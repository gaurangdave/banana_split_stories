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

GENDER = "male"
MOCK_DATA_ROOT = Path(__file__).resolve().parent.parent / "data" / "mock"
IMAGE_DIR = Path(__file__).resolve().parent.parent / "images"


def generate_scenes_recursively(theme, step_id, story_data, character_asset, previous_scene_image, theme_dir, visited_steps):
    """
    Recursively traverses the story tree to generate a scene for each step.
    This is a classic Depth-First Search (DFS) algorithm.
    """
    # Base Case: If we have already generated this scene, stop.
    if step_id in visited_steps:
        return

    print(f"  -> Generating scene for step: {step_id}")
    visited_steps.add(step_id)

    try:
        # Generate the current scene's image
        current_scene_image = generate_scene(
            theme=theme,
            step_id=step_id,
            story_data=story_data,
            character_asset=character_asset,
            previous_scene_image=previous_scene_image,
            client=client
        )

        # Extract the image from the response
        # image_bytes = scene_response.parts[0].data
        # current_scene_image = Image.open(BytesIO(image_bytes))

        # Save the image
        current_scene_image.save(theme_dir / f"{step_id}.png")

        # Find the current step data in the story tree
        current_step = next(
            (s for s in story_data["story_tree"] if s["id"] == step_id), None)
        if not current_step:
            return  # Should not happen if story is well-formed

        # Recursive Step: For each choice, call this function again
        for choice in current_step.get("choices", []):
            generate_scenes_recursively(
                theme=theme,
                step_id=choice["next_id"],
                story_data=story_data,
                character_asset=character_asset,
                previous_scene_image=current_scene_image,  # Pass the current image down
                theme_dir=theme_dir,
                visited_steps=visited_steps
            )

    except Exception as e:
        print(f"  🚨 FAILED to generate scene for step: {step_id}. Error: {e}")


def main():
    """Main function to generate all mock data."""
    print("--- Starting Mock Data Generation ---")
    os.makedirs(MOCK_DATA_ROOT, exist_ok=True)

    # Create a placeholder selfie image since we don't have a user input.
    # This is a 1x1 black pixel, which is enough to satisfy the function signature.

    placeholder_selfie = Image.open(Path(IMAGE_DIR, "me.jpg"))

    for theme in THEMES:
        print(f"\nProcessing Theme: {theme}")
        theme_dir = MOCK_DATA_ROOT / theme
        os.makedirs(theme_dir, exist_ok=True)

        try:
            # 1. Generate and save the story JSON
            print("  -> Generating story JSON...")
            story_data = generate_story(
                theme=theme, step_count=3, client=client)
            story_data["theme"] = theme
            with open(theme_dir / "story.json", "w") as f:
                json.dump(story_data, f, indent=4)
            print("  ✅ Story JSON saved.")

            # 2. Generate and save the character sheet
            print("  -> Generating character sheet...")
            character_asset_image = generate_character_asset(
                theme=theme, gender=GENDER, selfie_image=placeholder_selfie, client=client
            )
            character_asset_image.save(theme_dir / "character_sheet.png")
            print("  ✅ Character sheet saved.")

            # 3. Generate the initial prologue scene (our visual anchor)
            # print("  -> Generating prologue scene...")
            # prologue_response = generate_scene(
            #     story_data=story_data,
            #     character_asset=character_asset_image,
            #     client=client
            # )
            # prologue_image = Image.open(BytesIO(prologue_response.parts[0].data))
            # prologue_image.save(theme_dir / "prologue.png")
            # print("  ✅ Prologue scene saved.")

            # 4. Kick off the recursive generation for all story steps
            visited_steps = set()
            generate_scenes_recursively(
                theme=theme,
                step_id="start",
                story_data=story_data,
                character_asset=character_asset_image,
                previous_scene_image=None,  # Start with the prologue image
                theme_dir=theme_dir,
                visited_steps=visited_steps
            )
            print(f"  ✅ All scenes generated for {theme}.")

        except Exception as e:
            print(f"🚨 FAILED to process theme: {theme}. Error: {e}")

    print("\n--- Mock Data Generation Complete ---")


if __name__ == "__main__":
    main()
