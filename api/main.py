
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
mock = True

# read api key
API_KEY = os.environ.get("GEMINI_API_KEY")


# configure the client with your API key
client = genai.Client(api_key=API_KEY)

# Ensure the 'static' directory exists for saving images
os.makedirs("static/games", exist_ok=True)
os.makedirs("data/games", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


# --- API Endpoints ---
@app.post("/start_game")
async def start_game(
    theme: str = Form(...),
    gender: str = Form(...),
    selfie_image: UploadFile = File(...),
):
    """
    Starts a new game instance.
    Generates story, character, and initial scene.
    """
    game_id = str(uuid.uuid4())

    # create game_id folder to store details
    # TODO: check if folder exists to avoid overwriting games
    current_game_path = f"{GAME_DATA_DIR}/{game_id}"
    os.makedirs(current_game_path, exist_ok=True)

    print(f"Starting new game with ID: {game_id}")

    # Step 1 - Generate Story
    story_data = generate_story(
        theme=theme, step_count=3, client=client, mock=mock)
    # save story to game data json
    #TODO: Write this to different location to limit access from the client
    with open(f"{current_game_path}/story.json", "w") as f:
        json.dump(story_data, f, indent=4)

    # Step 2 - Generate Character Asset
    # Read the uploaded file's content
    contents = await selfie_image.read()

    # Open the image using PIL from the in-memory bytes
    image = Image.open(io.BytesIO(contents))

    # Generate the character asset
    character_asset = generate_character_asset(
        theme=theme, gender=gender, selfie_image=image, client=client, mock=mock
    )

    # save character_asset to game data
    character_asset_image_path = f"{current_game_path}/character_sheet.png"
    character_asset.save(character_asset_image_path)

    # Step 3 - Generate first scene
    step_id = story_data["story_tree"][0]["id"]
    first_scene = generate_scene(
        step_id, story_data, character_asset, None, client, mock=mock)
    first_scene_image_path = f"{current_game_path}/{step_id}.png"
    first_scene.save(first_scene_image_path)
    
    return_data = story_data["story_tree"][0]
    return_data["scene_image"] = first_scene_image_path
    return_data["character_sheet"] = character_asset_image_path

    ## TODO: remove next_id from return_data["choices"] array to keep the suspense. 

    return return_data


@app.post("/next_step")
async def next_step(
    game_id: str = Form(...),
    current_step_id: str = Form(...),
    step_id: str = Form(...),
):
    current_game_path = f"{GAME_DATA_DIR}/{game_id}"
    ## step 1 - read story data from current game
    with open(f"{current_game_path}/story.json", "r") as f:
        story_data = json.load(f)

    ## step 2 - load the chracter_asset for the current game
    character_asset_path = f"{current_game_path}/character_sheet.png"
    character_asset = Image.open(character_asset_path)

    ## step 3 - load the previous scene for current game
    previous_scene_path = f"{current_game_path}/{current_step_id}.png"
    previous_scene = Image.open(previous_scene_path)

    ## step 4 - generate the next scene
    next_scene = generate_scene(
        step_id, story_data, character_asset, previous_scene, client, mock=mock)

    ## step 5 - save the next scene
    next_scene_image_path = f"{current_game_path}/{step_id}.png"    
    next_scene.save(next_scene_image_path)
    
    ## step 6 - extract scene details from story data based on step_id
    for step in story_data["story_tree"]:
        if step["id"] == step_id:
            next_scene = step
            break
    
    return_data = next_scene
    return_data["scene_image"] = next_scene_image_path
    return_data["character_sheet"] = character_asset_path
    return return_data


@app.get("/ping")
def ping():
    """
    A simple endpoint to check if the server is running.
    """
    return {"status": "ok", "message": "API is alive!"}


app.mount("/", StaticFiles(directory="./frontend/build", html=True), name="static")
