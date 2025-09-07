import io
from pathlib import Path
from api.constants import DEFAULT_THEME, IMAGE_MODEL_ID, MOCK_DATA_DIR, THEME_CONFIG, AI_IMAGE_DIR
from PIL import Image
from google import genai
from io import BytesIO


def _mock_character_generation()-> Image.Image:
    """
    Helper funtion to mock the character generation to avoid expensive API calls

    Returns:
        Image.Image: Image from saved disk
    """
    print("🙃 mocking character generation...")

    ## open image file from mock data directory
    character_sheet = Image.open(Path(MOCK_DATA_DIR,"character_sheet.png"))
    return character_sheet


def generate_character_asset(theme: str, gender: str, selfie_image: Image.Image, client: genai.Client, mock: bool = False) -> Image.Image:
    """
    Generates a character asset image based on a theme, gender, and user selfie.

    Args:
        theme: The selected story theme (e.g., "Haunted Space Station").
        gender: The selected character gender (e.g., "male", "female").
        selfie_image: A PIL Image object of the user's selfie.
        model: The initialized Gemini generative model.

    Returns:
        A PIL Image object of the generated character asset.
    """
    ## skip image creation if mock data is requested
    if mock:
        return _mock_character_generation()
    
    # read theme config
    theme_data = THEME_CONFIG.get(theme, THEME_CONFIG[DEFAULT_THEME])
    base_prompt = theme_data.get("character_prompt_template")

    # prepare the prompt
    character_description = base_prompt.format(gender=gender)
    prompt_parts = [
        "You are an expert photorealistic editor responsible to create accurate video game characters from selfies. Your task is to edit the following selfie image.",
        selfie_image,
        "**Primary Objective:** Create a photorealistic character suitable for a video game.",
        "**Rule 1 (CRITICAL):** Do NOT change the person's face or hair. The likeness must be perfectly preserved.",
        f"**Rule 2:** Replace the person's current clothing with the following: {character_description}.",
        "**Rule 3:** Replace the original background with a neutral, grey studio backdrop for a character sheet.",
        "**STYLE:** The image must be a photorealistic, high-resolution, cinematic shot.",
        "**FORMAT:** The image MUST have a landscape 16:9 aspect ratio. Do NOT generate a portrait (vertical) image."
    ]

    response = client.models.generate_content(
        model=IMAGE_MODEL_ID,
        contents=prompt_parts
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            image = Image.open(BytesIO(part.inline_data.data))

    return image
