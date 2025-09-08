from dotenv import load_dotenv
from google import genai
from api.scene_generator import generate_scene
from api.character_generator import generate_character_asset
from api.story_generator import generate_story
import json
import os
import sys
from pathlib import Path
from PIL import Image
from io import BytesIO

# Add the parent directory to the Python path to allow imports from the 'api' module
sys.path.append(str(Path(__file__).resolve().parent.parent))


# --- Configuration ---
load_dotenv()
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found in .env file or environment variables.")

# genai.configure(api_key=API_KEY)

# We need both a text and an image model client for this script
# text_model_client = genai.GenerativeModel('gemini-1.5-flash-latest')
# image_model_client = genai.GenerativeModel('gemini-2.5-flash-image-preview')
# read api key
API_KEY = os.environ.get("GEMINI_API_KEY")


# configure the client with your API key
client = genai.Client(api_key=API_KEY)


THEMES = ["Haunted Space Station", "Lost Temple of the Jungle",
          "Cyberpunk Underworld", "Curse of the Banana King"]

# THEMES = ["Haunted Space Station"]

MOCK_DATA_ROOT = Path(__file__).resolve().parent.parent / "api"/"data"


def main():
    """Main function to generate all mock data."""
    print("--- Starting Mock Data Generation ---")
    os.makedirs(MOCK_DATA_ROOT, exist_ok=True)

    # Create a placeholder selfie image since we don't have a user input.
    # This is a 1x1 black pixel, which is enough to satisfy the function signature.

    number_of_stories = 5
    for theme in THEMES:
        print(f"\nProcessing Theme: {theme}")
        theme_dir = MOCK_DATA_ROOT / theme
        os.makedirs(theme_dir, exist_ok=True)

        try:
            # 1. Generate and save the story JSON
            for i in range(number_of_stories):
                print(f"  -> Generating story number {i+1}...")
                story_data = generate_story(
                    theme=theme, step_count=3, client=client)
                story_data["theme"] = theme
                with open(theme_dir / f"story_{i+1}.json", "w") as f:
                    json.dump(story_data, f, indent=4)
                print("  ✅ Story JSON saved.")

        except Exception as e:
            print(f"🚨 FAILED to process theme: {theme}. Error: {e}")

    print("\n--- Mock Data Generation Complete ---")


if __name__ == "__main__":
    main()
