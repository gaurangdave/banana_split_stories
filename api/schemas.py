from pydantic import BaseModel
from typing import List, Optional, Literal

# No changes are needed for the Choice class.
class Choice(BaseModel):
    """
    Represents a single choice a player can make.
    """
    text: str
    next_id: str


class StoryNode(BaseModel):
    """
    Represents a single step in the story.
    We've added the 'id' field here to uniquely identify each node.
    """
    id: str  # <-- The new field you suggested!
    scene_description: str
    character_pose_description: str
    narration: str
    choices: List[Choice]
    is_ending: bool
    outcome: Optional[Literal["success", "failure"]] = None


class Story(BaseModel):
    """
    Represents the entire adventure.
    The 'story_tree' is now a List of StoryNode objects instead of a Dictionary.
    This resolves the `additionalProperties` error with the Gemini API.
    """
    prologue: str
    story_tree: List[StoryNode]