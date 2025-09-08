from io import BytesIO
from pathlib import Path
from typing import Any, Dict, Optional
from PIL import Image
from google import genai

from api.constants import IMAGE_MODEL_ID, AI_IMAGE_DIR, MOCK_DATA_DIR


def _mock_scene_generation(theme: str, step_id: str) -> Image.Image:
    """
    Helper funtion to mock the scene generation to avoid expensive API calls

    Returns:
        Image.Image: Image from saved disk
    """
    print("🙃 mocking scene generation...")

    # open image file from mock data directory
    # TODO: Make the function little bit dynamic to return image from a pool of saved images.
    scene = Image.open(Path(MOCK_DATA_DIR, theme, f"{step_id}.png"))
    return scene


def generate_scene(
    theme: str,
    step_id: str,
    story_data: Dict[str, Any],
    character_asset: Image.Image,
    previous_scene_image: Optional[Image.Image],
    client: genai.Client,
    mock: bool = False,
    is_prologue: bool = False,
) -> Image.Image:
    """
    Generates the visual scene for a specific step in the story.
    This final version uses a unified prompt structure for clarity and power.
    """

    if mock:
        # For prologue, we need a different mock image
        if is_prologue:
            step_id = "start" # using start image for prologue
        return _mock_scene_generation(theme, step_id=step_id)

    if is_prologue:
        scene_description = story_data.get("prologue", "A cinematic opening shot for the story.")
        full_narrative_prompt = f"Generate a cinematic, establishing shot for a story with the following theme: {theme}. The scene should be described as: {scene_description}. This is the opening shot of the story, so it should be epic and inviting. Do not include any characters in this shot."
        prompt_parts = [
            full_narrative_prompt,
            "**STYLE:** The image must be a photorealistic, high-resolution, cinematic shot.",
            "**FORMAT:** The image MUST have a landscape 16:9 aspect ratio. Do NOT generate a portrait (vertical) image."
        ]
    else:
        # 1. Look up the current step's data.
        current_step = next(
            (step for step in story_data["story_tree"] if step["id"] == step_id), None)
        if not current_step:
            raise ValueError(f"Step with ID '{step_id}' not found in story_tree.")

        scene_description = current_step["scene_description"]
        pose_description = current_step["character_pose_description"]

        # 2. Combine the narrative descriptions into a single, cohesive paragraph.
        full_narrative_prompt = f"{scene_description}. Our hero is {pose_description}."

        # 3. Assemble the final prompt parts list.
        prompt_parts = [
            # The main narrative instruction
            full_narrative_prompt,

            # The Character Consistency instruction
            "**CHARACTER FACE:** The hero's face MUST look exactly like the person in this character sheet.",
            character_asset,

            # The global style and format instruction (your excellent suggestion)
            "**STYLE:** The image must be a photorealistic, high-resolution, cinematic shot.",
            "**FORMAT:** The image MUST have a landscape 16:9 aspect ratio. Do NOT generate a portrait (vertical) image."
        ]

        # 4. Add the previous scene for continuity, if it exists.
        if previous_scene_image:
            prompt_parts.extend([
                "**SCENE CONTINUITY:** This new scene directly follows the previous one. Maintain a consistent art style and mood.",
                previous_scene_image
            ])

    # 5. Make the API call.
    print(f"🚀 Generating scene for step: {step_id}...")
    response = client.models.generate_content(
        model=IMAGE_MODEL_ID,
        contents=prompt_parts
    )
    print("✅ Scene Generated!")

    # --- DEFENSIVE CHECKING ---
    # First, a`SBC`check if there are any candidates at all.
    if not response.candidates:
        print(
            "❌ ERROR: No candidates returned from API. The request may have been blocked.")
        print("--- FULL RESPONSE ---")
        print(response)
        # Return a placeholder or raise an error
        # For now, let's return None to see the error handled.
        return None

    # Now, check the specific candidate
    candidate = response.candidates[0]

    # Let's inspect the finish reason! This is the key piece of evidence.
    print(f"ℹ️ Finish Reason: {candidate.finish_reason}")

    if candidate.content is None or not candidate.content.parts:
        print("❌ ERROR: Candidate content is None or has no parts.")
        print("--- FULL RESPONSE ---")
        print(response)
        return None
    # --- END DEFENSIVE CHECKING ---

    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            image = Image.open(BytesIO(part.inline_data.data))

    return image
