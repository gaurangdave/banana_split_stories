from io import BytesIO
from pathlib import Path
from typing import Any, Dict, Optional
from PIL import Image
from google import genai

from api.constants import IMAGE_MODEL_ID, AI_IMAGE_DIR


def generate_scene(
    step_id: str,
    story_data: Dict[str, Any],
    character_asset: Image.Image,
    previous_scene_image: Optional[Image.Image],
    client: genai.Client,
):
    """
    Generates the visual scene for a specific step in the story.
    This final version uses a unified prompt structure for clarity and power.
    """
    # 1. Look up the current step's data.
    current_step = next((step for step in story_data["story_tree"] if step["id"] == step_id), None)
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

    for part in response.candidates[0].content.parts:
        # if part.text is not None:
        #     print(part.text)
        if part.inline_data is not None:
            image = Image.open(BytesIO(part.inline_data.data))
            # image.save(Path(ai_image_dir, f"{step_id}.png"))

    return image