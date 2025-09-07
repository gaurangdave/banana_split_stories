from pathlib import Path
from fastapi import FastAPI

THEME_CONFIG = {
    "Haunted Space Station": {
        "character_prompt_template": "A {gender} hero wearing a worn, high-tech scavenger jumpsuit, equipped with a side-mounted plasma cutter and a wrist-mounted data-pad. The expression is a mix of determination and apprehension.",
        "story_theme_prompt": "A tense, sci-fi horror adventure about a rescue mission on a derelict space station teeming with strange alien phenomena."
    },
    "Lost Temple of the Jungle": {
        "character_prompt_template": "A {gender} explorer wearing practical, moisture-wicking gear, with a coiled whip on their belt and a leather-bound journal in a satchel. The expression is curious and brave.",
        "story_theme_prompt": "A classic pulp adventure to find a legendary artifact in a jungle temple filled with ancient traps and mysterious guardians."
    },
    "Cyberpunk Underworld": {
        "character_prompt_template": "A {gender} street samurai with subtle cybernetic enhancements around one eye, wearing a stylish neo-noir trench coat over light tactical armor. The expression is sharp and street-wise.",
        "story_theme_prompt": "A gritty, neon-noir investigation into a corporate conspiracy in the rain-slicked back-alleys of a futuristic metropolis."
    },
    "Curse of the Banana King": {
        "character_prompt_template": "A daring {gender} treasure hunter wearing a weathered fedora and a bright yellow bandana. They are equipped with a mystical, banana-shaped compass and a sharp machete for cutting through dense jungle foliage. The expression is a mix of excitement and unease.",
        "story_theme_prompt": "A thrilling, slightly absurd treasure hunt to find the mythical Golden Banana in a temple cursed by the ancient Banana King, where the banana trees are rumored to watch your every move."
    }
}

DEFAULT_THEME = "Curse of the Banana King"

IMAGE_DIR = Path("..","images")
AI_IMAGE_DIR = Path(IMAGE_DIR,"ai_images")
DATA_DIR = Path("data")
STATIC_DIR = Path("static")
MOCK_DATA_DIR = Path(DATA_DIR, "mock")
GAME_DATA_DIR = Path(STATIC_DIR, "games")



IMAGE_MODEL_ID = "gemini-2.5-flash-image-preview"
TEXT_MODEL_ID = "gemini-2.5-flash-lite"