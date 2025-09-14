import json
import os
from pathlib import Path
from time import sleep
from elevenlabs import ElevenLabs
from elevenlabs import Voice, VoiceSettings, play, save
import emoji

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
        
        for story_file in os.listdir(theme_dir):
            if not story_file.endswith('.json'): continue

            story_path = Path(theme_dir, story_file)
            print(emoji.emojize(f"  :eyes: Reading {story_file}..."), end=" ")
            
            with open(story_path, 'r') as file:
                story_obj = json.load(file)

            ## step 1 - generate audio for prologue
            ## define prologue audio path
            prologue_audio_path = Path(theme_dir, "prologue.mp3")
            
            ## only generate audio if prologue mp3 doesn't exist
            if not os.path.exists(prologue_audio_path):
                print(emoji.emojize(f"    :microphone: generating prologue..."))
                prologue_text = story_obj["prologue"]
                # audio_bytes = client.text_to_speech.convert(text=prologue_text,voice_id=VOICE_ID)
                # save(audio_bytes, prologue_audio_path)
                
            ## sleep a 5 seconds to avoid rate limiting
            sleep(5)
            
            for step in story_obj["story_tree"]:
                # narration_audio_path = Path(th)
                pass
            

            
    print(emoji.emojize(" -> :check_mark_button: OK!"))            


    pass



if __name__ == "__main__":
    data_root = Path(__file__).resolve().parent.parent / "api"/"data"
    generate_narration(data_root)