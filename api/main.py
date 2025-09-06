# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

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

# --- API Endpoints ---
@app.get("/ping")
def ping():
    """
    A simple endpoint to check if the server is running.
    """
    return {"status": "ok", "message": "API is alive!"}


app.mount("/", StaticFiles(directory="./frontend/build", html=True), name="static")
