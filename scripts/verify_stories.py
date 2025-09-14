import json
import os
from pathlib import Path
import emoji


# --- Helper Functions  ---
def is_valid_string_value(obj, key):
    val = obj.get(key)
    return isinstance(val, str) and len(val) > 0

def is_valid_list_value(obj, key):
    val = obj.get(key)
    return isinstance(val, list)

def is_valid_bool_value(obj, key):
    val = obj.get(key)
    return isinstance(val, bool)
    

def verify_stories(data_root: str) -> list[str]:
    print("--- Verifying Stories ---")
    invalid_stories = set() # Use a set to avoid duplicate entries
    print(emoji.emojize(f":file_folder: Verifying stories from {data_root}..."))

    for theme in os.listdir(data_root):
        theme_dir = Path(data_root, theme)
        if not theme_dir.is_dir(): continue        
        print(emoji.emojize(f"\n:cyclone: Verifying Theme: {theme}"))

        for story in os.listdir(theme_dir):
            story_dir = Path(theme_dir,story)
            print(emoji.emojize(f"\n    :file_folder: reading story from {story}"))
            
            for story_file in os.listdir(story_dir):
                if not story_file.endswith('.json'): continue

                story_path = Path(story_dir, story_file)
                print(emoji.emojize(f"      :eyes: Verifying {story_file}..."), end=" ")

                try:
                    
                    # read the json file from
                    with open(story_path, 'r') as file:
                        story_obj = json.load(file)

                    # --- Structural Validation ---
                    if not all(k in story_obj for k in ["prologue", "story_tree"]):
                        raise ValueError("Missing 'prologue' or 'story_tree' key.")

                    story_tree = story_obj["story_tree"]
                    if not isinstance(story_tree, list) or not story_tree:
                        raise ValueError("'story_tree' is not a valid, non-empty list.")

                    # --- Relational Validation (The Optimization) ---
                    # 1. Prepare Once: Create a set of all valid IDs for instant lookups.
                    all_step_ids = {step.get("id") for step in story_tree}
                    if None in all_step_ids:
                        raise ValueError("A step is missing an 'id' key.")
                    
                    # 2. Check for ID uniqueness
                    if len(all_step_ids) != len(story_tree):
                        raise ValueError("Duplicate 'id' found in story_tree.")
                    
                    # 3. Check for the required 'start' node
                    if "start" not in all_step_ids:
                        raise ValueError("Missing required step with id 'start'.")
                    
                    if (not is_valid_string_value(story_obj, "theme")):
                        print(f"🚨 Found invalid theme in {story_path}")
                        invalid_stories.append(story_path)
                        continue


                    # Step 3: loop thru story sections and validate them
                    for step in story_tree:
                        if not all(is_valid_string_value(step, k) for k in ["id", "scene_description", "character_pose_description", "narration"]):
                            raise ValueError(f"Step '{step.get('id')}' has missing or invalid string fields.")

                        if not is_valid_bool_value(step, "is_ending"):
                            raise ValueError(f"Step '{step.get('id')}' has invalid 'is_ending' flag.")

                        choices = step.get("choices", [])
                        if step["is_ending"]:
                            if choices:
                                raise ValueError(f"Ending step '{step['id']}' must not have choices.")
                            if not is_valid_string_value(step, "outcome"):
                                raise ValueError(f"Ending step '{step['id']}' is missing an 'outcome'.")                    
                        else: # Not an ending step
                            if not choices: # Must have at least one choice
                                raise ValueError(f"Non-ending step '{step['id']}' has no choices.")
                            # Validate that all next_ids point to a real step
                            if len(choices) < 2: # Must have at least one choice
                                raise ValueError(f"Non-ending step '{step['id']}' has less than 2 choices.")
                            for choice in choices:
                                next_id = choice.get("next_id")
                                if not next_id or next_id not in all_step_ids:
                                    raise ValueError(f"Step '{step['id']}' has a choice pointing to an invalid next_id: '{next_id}'.")

                    print(emoji.emojize(" -> :check_mark_button: OK!"))
                except (json.JSONDecodeError, ValueError) as e:
                    print(emoji.emojize(f" -> :cross_mark: FAIL! Reason: {e}"))
                    invalid_stories.add(str(story_path))                


    return list(invalid_stories)


if __name__ == "__main__":
    data_root = Path(__file__).resolve().parent.parent / "api"/"data"
    invalid_stories = verify_stories(data_root=data_root)    
    if invalid_stories:
        story_str = "stories" if len(invalid_stories) > 1 else "story"
        print(emoji.emojize(f"\n:exploding_head: Found {len(invalid_stories)} invalid {story_str}:"))
        for story_path in invalid_stories:
            print(f"- {story_path}")
    else:
        print(emoji.emojize("\n:sparkles::tada: All stories are valid and ready for production! :tada::sparkles:"))

