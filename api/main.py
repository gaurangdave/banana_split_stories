
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image
import io
import uuid
import json
from api.character_generator import generate_character_asset
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
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
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

os.makedirs("static/images", exist_ok=True)
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
    Start a new game.
    """
    """
    Starts a new game instance.
    Generates story, character, and initial scene.
    """
    game_id = str(uuid.uuid4())
    
    ## create game_id folder to store details
    ## TODO: check if folder exists to avoid overwriting games
    os.makedirs(f"data/games/{game_id}", exist_ok=True)
    
    print(f"Starting new game with ID: {game_id}")

    ## Step 1 - Generate Story
    story_data = generate_story(theme=theme, step_count=3, client=client, mock=mock)
    ## save story to game data json
    with open(f"data/games/{game_id}/story.json", "w") as f:
        json.dump(story_data, f, indent=4)
    
    ## Step 2 - Generate Character Asset
    # Read the uploaded file's content
    contents = await selfie_image.read()

    # Open the image using PIL from the in-memory bytes
    image = Image.open(io.BytesIO(contents))
        
    character_asset = generate_character_asset(
        theme=theme, gender=gender, selfie_image=image, client=client
    )
    # ## save character_asset to game data
    
    character_asset.save(f"data/games/{game_id}/character_sheet.png")
    
    return story_data




@app.get("/ping")
def ping():
    """
    A simple endpoint to check if the server is running.
    """
    return {"status": "ok", "message": "API is alive!"}


app.mount("/", StaticFiles(directory="./frontend/build", html=True), name="static")
