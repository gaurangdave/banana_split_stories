import os
import asyncio
from elevenlabs.client import ElevenLabs
from elevenlabs import play
from elevenlabs import Voice, VoiceSettings, play, save
from api.constants import GAME_DATA_DIR
from dotenv import load_dotenv
load_dotenv()
# Initialize the ElevenLabs client
# It will automatically pick up the ELEVENLABS_API_KEY from your environment
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")
client = ElevenLabs(
    api_key=ELEVENLABS_API_KEY
)


# A good, deep voice for a Dungeon Master. You can find other voice IDs on the ElevenLabs website.
VOICE_ID = "HAvvFKatz0uu0Fv55Riy"  # Adam


async def generate_narration(text_to_speak: str, game_id: str, step_id: str) -> str:
    """
    Generates narration audio from text, saves it, and returns the public URL.
    This is an async function that runs the blocking I/O in a separate thread.
    """

    def _generate_and_save():
        """The actual blocking work to be run in a thread."""
        
        audio_bytes = client.text_to_speech.convert(
            text=text_to_speak,
            voice_id=VOICE_ID)

        # Define the file path
        file_name = f"{step_id}_narration.mp3"
        file_path = os.path.join(GAME_DATA_DIR, game_id, file_name)

        # Save the audio bytes to the file
        save(audio_bytes, file_path)


        # Construct the public URL for the frontend
        public_url = f"/assets/games/{game_id}/{file_name}"
        return public_url

    print(f"🎙️ Generating narration for step: {step_id}...")
    # Run the synchronous, blocking function in a separate thread
    # so it doesn't block our main FastAPI application loop.
    loop = asyncio.get_running_loop()
    public_url = await loop.run_in_executor(None, _generate_and_save)
    print(f"✅ Narration saved to {public_url}")

    return public_url
