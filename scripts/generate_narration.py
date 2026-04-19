import json
import os
from pathlib import Path
from time import sleep, time
from elevenlabs import ElevenLabs
from elevenlabs import Voice, VoiceSettings, play, save
import emoji
from elevenlabs.errors import TooEarlyError

from dotenv import load_dotenv
load_dotenv()
# Initialize the ElevenLabs client
# It will automatically pick up the ELEVENLABS_API_KEY from your environment
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")
client = ElevenLabs(
    api_key=ELEVENLABS_API_KEY
)

# A good, deep voice for a Dungeon Master.
VOICE_ID = "HAvvFKatz0uu0Fv55Riy"


def generate_narration(data_root: str):
    print(emoji.emojize(":moai: generating narration"))
    print(emoji.emojize(f":file_folder: Reading stories from {data_root}..."))
    for theme in os.listdir(data_root):
        theme_dir = Path(data_root, theme)
        if not theme_dir.is_dir(): continue        
        print(emoji.emojize(f"\n:cyclone: Processing Theme: {theme}"))
        
        for story in os.listdir(theme_dir):
            story_dir = Path(theme_dir,story)
            print(emoji.emojize(f"\n    :file_folder: reading story from {story}"))

        
            for story_file in os.listdir(story_dir):
                if not story_file.endswith('.json'): continue

                story_path = Path(story_dir, story_file)
                print(emoji.emojize(f"      :eyes: Reading {story_file}..."), end=" ")
                
                with open(story_path, 'r') as file:
                    story_obj = json.load(file)

                ## step 1 - generate audio for prologue
                ## define prologue audio path
                prologue_audio_path = Path(story_dir, "prologue_narration.mp3")
                
                ## only generate audio if prologue mp3 doesn't exist
                if not os.path.exists(prologue_audio_path):
                    print(emoji.emojize(f"    :microphone: generating prologue..."))
                    prologue_text = story_obj["prologue"]
                    # audio_bytes = client.text_to_speech.convert(text=prologue_text,voice_id=VOICE_ID)
                    # save(audio_bytes, prologue_audio_path)
                    
                ## sleep a 5 seconds to avoid rate limiting
                sleep(5)
                
                for step in story_obj["story_tree"]:
                    step_id = step["id"]
                    
                    narration_file_name = f"{step_id}_narration.mp3"
                    narration_audio_path = Path(story_dir, narration_file_name)
                    if not os.path.exists(narration_audio_path):
                        print(emoji.emojize(f"\n    :microphone: generating narration for step {step_id}..."))
                        narration_text = step["narration"]
                        # audio_bytes = client.text_to_speech.convert(text=narration_text,voice_id=VOICE_ID)
                        # save(audio_bytes, prologue_audio_path)
                    sleep(5)
            
    print(emoji.emojize(" -> :check_mark_button: OK!"))            


def generate_audio_with_backoff(text: str, output_path: Path, max_retries=3):
    """
    Calls the ElevenLabs API with exponential backoff to handle rate limits.
    """
    attempt = 0
    wait_time = 5  # Initial wait time in seconds
    while attempt < max_retries:
        try:
            # Modern client.generate() syntax
            audio_bytes = client.text_to_speech.convert(text=text,voice_id=VOICE_ID)
            save(audio_bytes, str(output_path))
            print(emoji.emojize(" -> :floppy_disk: Saved!"))
            return True # Success
        except TooEarlyError:
            print(emoji.emojize(f"  :hourglass_not_done: Rate limit hit. Waiting {wait_time} seconds..."))
            time.sleep(wait_time)
            wait_time *= 2  # Exponential backoff
            attempt += 1
        except Exception as e:
            print(emoji.emojize(f"  :cross_mark: An unexpected error occurred: {e}"))
            return False # Failure
    
    print(emoji.emojize(f"  :cross_mark: FAILED after {max_retries} retries."))
    return False # Failure

def process_story_file(story_path:Path):
    """
    Processes a single story JSON file to generate its prologue and step narrations.
    """
    story_dir = story_path.parent
    with open(story_path, 'r') as f:
        story_obj = json.load(f)
    
    # 1. Generate audio for the prologue
    prologue_audio_path = story_dir / "prologue_narration.mp3"
    if not prologue_audio_path.exists():
        print(emoji.emojize(f"\n    :microphone: Generating prologue..."), end="")
        generate_audio_with_backoff(story_obj["prologue"], prologue_audio_path)
        
     # 2. Generate audio for each step in the story tree
    for step in story_obj.get("story_tree", []):
        step_id = step.get("id")
        if not step_id: continue

        narration_audio_path = story_dir / f"{step_id}_narration.mp3"
        if not narration_audio_path.exists():
            print(emoji.emojize(f"\n    :microphone: Generating narration for step '{step_id}'..."), end="")
            generate_audio_with_backoff(step["narration"], narration_audio_path)

def generate_all_narrations(data_root: str):
    print(emoji.emojize(":studio_microphone: --- Starting Narration Generation ---"))
    print(emoji.emojize(f":file_folder: Reading stories from {data_root}..."))
    
    for theme in os.listdir(data_root):
        theme_dir = Path(data_root, theme)
        if not theme_dir.is_dir(): continue
        
        print(emoji.emojize(f"\n:cyclone: Processing Theme: {theme}"))
        for story_id in os.listdir(theme_dir):
            story_dir = theme_dir / story_id
            if not story_dir.is_dir(): continue

            print(emoji.emojize(f"\n  :open_book: Processing Story: {story_id}"))
            story_file_path = story_dir / "story.json"

            if story_file_path.exists():
                process_story_file(story_file_path)
            else:
                print(emoji.emojize(f"    :warning: No story.json found in {story_dir}"))

    print(emoji.emojize("\n:sparkles::tada: Narration generation complete! :tada::sparkles:"))


if __name__ == "__main__":
    data_root = Path(__file__).resolve().parent.parent / "api"/"data"
    generate_all_narrations(data_root)