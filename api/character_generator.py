import io
from pathlib import Path
from api.constants import DEFAULT_THEME, IMAGE_MODEL_ID, MOCK_DATA_DIR, THEME_CONFIG, AI_IMAGE_DIR
from PIL import Image
from google import genai
from io import BytesIO


def _mock_character_generation(theme: str) -> Image.Image:
    """
    Helper funtion to mock the character generation to avoid expensive API calls

    Returns:
        Image.Image: Image from saved disk
    """
    print("🙃 mocking character generation...")

    # open image file from mock data directory
    character_sheet = Image.open(
        Path(MOCK_DATA_DIR, theme, "character_sheet.png"))
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
    # skip image creation if mock data is requested
    if mock:
        return _mock_character_generation(theme)

    # read theme config
    print(f"🚀 Generating character for theme: {theme}...")
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

    # --- DEFENSIVE CHECKING ---
    # First, check if there are any candidates at all.
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

    print("✅ Character Generated!")

    return image



def generate_fictional_character_asset(theme: str, animal: str, personalities: list, accessories: list, client: genai.Client, mock: bool = False) -> Image.Image:
    """
    Generates a fictional character asset from descriptive text prompts.

    Args:
        theme: The selected story theme (e.g., "Haunted Space Station").
        animal: The selected spirit animal (e.g., "Wolf").
        personalities: A list of two personality traits (e.g., ["Brave", "Cunning"]).
        accessories: A list of two accessories (e.g., ["Glowing Amulet", "Ornate Dagger"]).
        client: The initialized Gemini API client.

    Returns:
        The full response object from the Gemini API.
    """
    if mock:
        return _mock_character_generation(theme)

    theme_data = THEME_CONFIG.get(theme, THEME_CONFIG[DEFAULT_THEME])
    base_clothing = theme_data["character_prompt_template"].format(
        gender="character")

    # 2. Dynamically construct the detailed prompt.
    personality_str = " and ".join(personalities)
    accessory_str = " and a ".join(accessories)

    full_description = (
        f"An anthropomorphic {animal} hero, dressed as a {base_clothing}. "
        f"The character should have a {personality_str} expression and pose. "
        f"They are equipped with a {accessory_str}."
    )

    prompt_parts = [
        "**Objective:** Create a photorealistic, concept art character sheet of a fictional hero.",
        "**Character Description:** " + full_description,
        "**Style:** The final image should be a high-resolution, full-body portrait against a neutral, grey studio backdrop.",
        "**Format:** The image must be portrait-oriented."
    ]

    # 3. Make the API call to generate the image.
    print(f"🚀 Generating fictional character with prompt: {full_description}")
    response = client.models.generate_content(
        model=IMAGE_MODEL_ID,
        contents=prompt_parts
    )
    print("✅ Fictional Character Asset Generated!")

     # --- DEFENSIVE CHECKING ---
    # First, check if there are any candidates at all.
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

    print("✅ Character Generated!")

    return image