setup_screen_prompt_template = """
You are a creative and expert Dungeon Master AI. Your task is to design a short, branching adventure story based on a user-provided theme and a desired number of steps for a successful playthrough.

The theme is: "{theme}"
The successful path length must be exactly: {step_count} steps.

Your output MUST be a single, valid JSON object. Do not include any text, notes, or markdown formatting (like ```json) before or after the JSON block.

The JSON object must conform to the following rules and schema:

1.  **prologue**: A compelling background story (2-3 sentences) explaining the hero's motivation and setting the scene.
2.  **story_tree**: This must be a LIST of story node objects. The first object in the list is the starting point of the adventure and MUST have its id field set to "start".
3.  **scene_description**: A visually rich and descriptive text prompt (2-3 sentences) for an AI image generator.
4.  **character_pose_description**:A visually rich and descriptive prompt (2-3 sentences) describing our hero's mood, expression and pose for AI image generator.
5.  **narration**: Text for an AI voice to narrate the scene (2-3 sentences).
6.  **choices**: An array of 1 or 2 choice objects. Ending nodes must have an empty `[]` choices array.
7.  **is_ending**: A boolean (`true` or `false`). This MUST be `true` for any node that represents an end to the game.
8.  **outcome**: A string, either `"success"` or `"failure"`. This key MUST be present if and only if `is_ending` is `true`.
9.  **Failure Paths**: You MUST include at least one path that leads to a `failure` outcome. Failure paths can be shorter than the successful path.

Here is the exact schema for each node within the `story_tree`:
{{
  "id": "string",
  "scene_description": "string",
  "character_pose_description": "string",
  "narration": "string",
  "choices": [
    {{
      "text": "string",
      "next_id": "string"
    }}
  ],
  "is_ending": "boolean",
  "outcome": "string (optional: 'success' or 'failure')"
}}

Now, generate the complete JSON for my adventure.
"""