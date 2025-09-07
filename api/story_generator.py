import json
from api.constants import DEFAULT_THEME, MOCK_DATA_DIR, TEXT_MODEL_ID, THEME_CONFIG
from api.schemas import Story
from api.prompts import setup_screen_prompt_template
import re


def _clean_and_parse_json(raw_text: str):
    """
    A helper function to find and parse a JSON object from a raw string
    that might be wrapped in markdown fences.
    """
    # Use a regular expression to find the content between ```json and ```
    match = re.search(r"```json\n(.*?)\n```", raw_text, re.DOTALL)

    if match:
        # If we found a match, extract the JSON string
        json_str = match.group(1)
    else:
        # If no markdown fences are found, assume the raw text is the JSON
        json_str = raw_text

    # Parse the cleaned string into a Python dictionary
    return json.loads(json_str)

def _mock_story_generation()->dict:
    """
    Helper funtion to mock the story generation to avoid expensive API calls
    Returns:
        _type_: Story data from saved json
    """
    print("🙃 mocking story generation...")

    with open(f"{MOCK_DATA_DIR}/story.json", "r") as file:
        story_data = json.load(file)
    return story_data


def generate_story(theme=THEME_CONFIG[DEFAULT_THEME]["story_theme_prompt"], step_count=3, client=None, mock=False):
    
    # skip data generation if mocked data is needed
    if mock:
        return _mock_story_generation()

    # format the final prompt
    final_prompt = setup_screen_prompt_template.format(
        theme=theme, step_count=step_count)

    print("🚀 Generating story from theme...")


    response = client.models.generate_content(
        model=TEXT_MODEL_ID,
        contents=final_prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": Story,
        },        
    )
    print("✅ Story Generated!")

    
    # story_json_text = response.text
    # parse story data
    # story_data = json.loads(story_json_text)
    story_data = _clean_and_parse_json(response.text)
    # return story data
    return story_data