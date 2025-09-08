
import asyncio
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image
import io
import uuid
import json
import shutil

from api.character_generator import generate_character_asset
from api.constants import GAME_DATA_DIR
from api.narration_generator import generate_narration
from api.scene_generator import generate_scene
from api.story_generator import generate_story
from api.schemas import Story
from google import genai
import os
from dotenv import load_dotenv
load_dotenv()


# Create an instance of the FastAPI class
app = FastAPI()

# --- Middleware ---
# This is crucial for allowing our React frontend (on a different URL)
# to communicate with our backend.
origins = [
    "http://localhost:3000",  # The default URL for a local React app
    "http://localhost:5173",  # The default URL for a local Vite React app
    # We will add our deployed Vercel URL here later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# In-memory storage for game states (for simplicity in a hackathon)
# A real app would use a database.
game_states = {}
mock = False

# read api key
API_KEY = os.environ.get("GEMINI_API_KEY")


# configure the client with your API key
client = genai.Client(api_key=API_KEY)

# Ensure the 'static' directory exists for saving images
os.makedirs("static/games", exist_ok=True)
os.makedirs("data/games", exist_ok=True)
os.makedirs("assets/games", exist_ok=True)
# app.mount("/static", StaticFiles(directory="static"), name="static")



# --- API Endpoints ---
@app.post("/api/restart_game")
async def restart_game(game_id: str = Form(...)):
    """
    Restarts a game that has already been created.
    """
    current_game_path = os.path.join(GAME_DATA_DIR, game_id)
    if not os.path.exists(current_game_path):
        return {"error": "Game not found"}, 404

    with open(f"{current_game_path}/story.json", "r") as f:
        story_data = json.load(f)

    step_id = story_data["story_tree"][0]["id"]
    return_data = story_data["story_tree"][0]
    return_data["scene_image_url"] = f"/assets/games/{game_id}/{step_id}.png"
    return_data["character_sheet_url"] = f"/assets/games/{game_id}/character_sheet.png"

    return {"game_id": game_id, "step": return_data}



@app.post("/api/prologue")
async def prologue(
    theme: str = Form(...),
    gender: str = Form(None),
    selfie_file: UploadFile = File(None),
    animal: str = Form(None),
    personalities: str = Form(None),
    accessories: str = Form(None),
    game_id: str = Form(None),  # Optional game_id for restarting
):
    # If no game_id or the game_id doesn't exist, create a new game
    game_id = str(uuid.uuid4())

    # create game_id folder to store details
    current_game_path = os.path.join(GAME_DATA_DIR, game_id)
    os.makedirs(current_game_path, exist_ok=True)

    print(f"Starting prologue with ID: {game_id}")

    # Step 1 - Generate Story
    story_data = generate_story(
        theme=theme, step_count=3, client=client, mock=mock)
    story_data["theme"] = theme

    # save story to game data json
    with open(f"{current_game_path}/story.json", "w") as f:
        json.dump(story_data, f, indent=4)

    # Step 2 - Generate Character Asset
    if selfie_file:
        # Read the uploaded file's content
        contents = await selfie_file.read()

        # Open the image using PIL from the in-memory bytes
        image = Image.open(io.BytesIO(contents))

        # Generate the character asset
        character_asset = generate_character_asset(
            theme=theme, gender=gender, selfie_image=image, client=client, mock=mock
        )
    else:
        # Use a mock character sheet for fictional characters
        character_asset = Image.open("data/mock/character_sheet.png")

    # save character_asset to game data
    character_asset_image_path = f"{current_game_path}/character_sheet.png"
    character_asset.save(character_asset_image_path)

    # Step 3 - Generate Prologue Assets
    prologue_text = story_data.get("prologue", "The adventure begins....")
    
    # Create parallel tasks for generating prologue image and narration
    prologue_image_task = asyncio.to_thread(
        generate_scene, 
        theme, 
        "prologue", 
        story_data, 
        character_asset, 
        None, 
        client, 
        mock=mock,
        is_prologue=True
    )
    prologue_narration_task = generate_narration(prologue_text, game_id, "prologue_narration")

    # Run both tasks at the same time
    prologue_image, prologue_narration_url = await asyncio.gather(
        prologue_image_task, prologue_narration_task
    )

    # Save the generated assets
    prologue_image_path = f"{current_game_path}/prologue.png"
    prologue_image.save(prologue_image_path)

    # # Step 4: Prepare the initial game state response
    # character_details = {}
    # if selfie_file:
    #     character_details = {
    #         "mode": "selfie",
    #         "gender": gender,
    #         # file cannot be passed directly, but we can indicate its presence
    #         "file_uploaded": True if selfie_file else False
    #     }
    # else:
    #     character_details = {
    #         "mode": "fictional",
    #         "animal": animal,
    #         "personalities": json.loads(personalities) if personalities else [],
    #         "accessories": json.loads(accessories) if accessories else []
    #     }

    return {
        "game_id": game_id,
        "theme": theme,        
        "prologue_image_url": f"/assets/games/{game_id}/prologue.png",
        "prologue_narration_url": prologue_narration_url,
        "prologue": prologue_text
    }


@app.post("/api/start_game")
async def start_game(
    theme: str = Form(...),
    game_id: str = Form(None), 
):
    """
    Starts a new game instance or restarts an existing one.
    Generates story, character, and initial scene if it's a new game.
    """
    # if game_id:
    #     # If a game_id is provided, treat it as a restart
    #     current_game_path = os.path.join(GAME_DATA_DIR, game_id)
    #     if os.path.exists(current_game_path):
    #         with open(f"{current_game_path}/story.json", "r") as f:
    #             story_data = json.load(f)

    #         step_id = story_data["story_tree"][0]["id"]
    #         return_data = story_data["story_tree"][0]
    #         return_data["scene_image_url"] = f"/assets/games/{game_id}/{step_id}.png"
    #         return_data["character_sheet_url"] = f"/assets/games/{game_id}/character_sheet.png"
    #         return {"game_id": game_id, "step": return_data}

    # If no game_id or the game_id doesn't exist, create a new game
    # game_id = str(uuid.uuid4())

    # create game_id folder to store details
    current_game_path = os.path.join(GAME_DATA_DIR, game_id)
    os.makedirs(current_game_path, exist_ok=True)

    print(f"Starting new game with ID: {game_id}")

    ## step 1 : load story
    with open(f"{current_game_path}/story.json", "r") as f:
        story_data = json.load(f)

    ## step 2 : generate screen & naration
    narration_text = story_data["story_tree"][0]["narration"]    
    step_id = story_data["story_tree"][0]["id"]
    
    character_asset = Image.open(f"{current_game_path}/character_sheet.png")
    
    ## create parallel tasks
    image_task = asyncio.to_thread(generate_scene, theme, step_id, story_data, character_asset, None, client, mock=mock)    
    audio_task = generate_narration(narration_text, game_id, step_id)
    
    # Run both tasks at the same time
    results = await asyncio.gather(image_task, audio_task)

    # Unpack the results
    first_scene,first_scene_narration_audio_url = results
    
    
    first_scene_image_path = f"{current_game_path}/{step_id}.png"
    first_scene.save(first_scene_image_path)

    return_data = story_data["story_tree"][0]
    return_data["scene_image_url"] = f"/assets/games/{game_id}/{step_id}.png"
    return_data["character_sheet_url"] = f"/assets/games/{game_id}/character_sheet.png"
    return_data["narration_audio_url"] = first_scene_narration_audio_url

    return {"game_id": game_id, "step": return_data}


@app.post("/api/next_step")
async def next_step(
    game_id: str = Form(...),
    current_step_id: str = Form(...),
    choice_index: int = Form(...),
):
    current_game_path = os.path.join(GAME_DATA_DIR, game_id)
    # step 1 - read story data from current game
    with open(f"{current_game_path}/story.json", "r") as f:
        story_data = json.load(f)
    theme = story_data["theme"]

    # step 2 - load the chracter_asset for the current game
    character_asset_path = f"{current_game_path}/character_sheet.png"
    character_asset = Image.open(character_asset_path)

    # step 3 - load the previous scene for current game
    previous_scene_path = f"{current_game_path}/{current_step_id}.png"
    previous_scene = Image.open(previous_scene_path)

    # step 4 - get the next step id from the story data
    current_step_data = next(
        (step for step in story_data["story_tree"] if step["id"] == current_step_id), None)
    if not current_step_data:
        return {"error": "Invalid current_step_id"}, 404

    next_step_id = current_step_data["choices"][choice_index]["next_id"]

    # step 5 - extract scene details from story data based on step_id
    next_step_data = next(
        (step for step in story_data["story_tree"] if step["id"] == next_step_id), None)
    
    if not next_step_data:
        # Handle the case where an invalid step_id is provided
        return {"error": "Invalid next_step_id"}, 404
    

    # step 6 - generate the next scene & narration
    next_step_narration_text = next_step_data["narration"]

    ## create parallel tasks
    image_task = asyncio.to_thread(generate_scene, theme, next_step_id, story_data, character_asset, previous_scene, client, mock=mock)    
    audio_task = generate_narration(
        next_step_narration_text, game_id, next_step_id)

    # Run both tasks at the same time and wait for them both to complete
    results = await asyncio.gather(image_task, audio_task)

    # Unpack the results
    next_scene,next_scene_narration_audio_url = results


    # step 7 - save the next scene
    next_scene_image_path = f"{current_game_path}/{next_step_id}.png"
    next_scene.save(next_scene_image_path)

    next_step_data["scene_image_url"] = f"/assets/games/{game_id}/{next_step_id}.png"
    next_step_data["character_sheet_url"] = f"/assets/games/{game_id}/character_sheet.png"
    next_step_data["narration_audio_url"] = next_scene_narration_audio_url

    return {"step": next_step_data}


@app.get("/ping")
def ping():
    """
    A simple endpoint to check if the server is running.
    """
    return {"status": "ok", "message": "API is alive!"}


# --- Corrected Static File Mounting ---

# THE FIX: Mount your game assets at /assets to avoid conflict with React's /static folder.
app.mount("/assets/games", StaticFiles(directory=GAME_DATA_DIR), name="game_assets")

# This mount serves the entire built React application. It MUST be the LAST mount.
app.mount("/", StaticFiles(directory="frontend/build", html=True), name="react_app")