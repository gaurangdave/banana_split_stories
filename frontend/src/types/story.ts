/**
 * TypeScript interfaces for the story JSON structure
 * Based on the story.json format used in the banana split stories application
 */

/**
 * Represents a single choice a player can make in the story
 */
export interface Choice {
  /** The text displayed for the choice */
  text: string;
  /** The ID of the next story node to navigate to */
  next_id: string;
}

/**
 * Represents the outcome of a story ending
 */
export type StoryOutcome = 'success' | 'failure';

/**
 * Represents a single node/step in the story tree
 */
export interface StoryNode {
  /** Unique identifier for this story node */
  id: string;
  /** Description of the scene/environment */
  scene_description: string;
  /** Description of the character's pose and appearance */
  character_pose_description: string;
  /** The narrative text presented to the player */
  narration: string;
  /** Array of choices available to the player (empty for ending nodes) */
  choices: Choice[];
  /** Whether this node represents an ending of the story */
  is_ending: boolean;
  /** The outcome if this is an ending node (success or failure) */
  outcome?: StoryOutcome;
}

/**
 * Represents the complete story structure
 */
export interface Story {
  /** The introductory text that sets up the story */
  prologue: string;
  /** Array of story nodes that form the branching narrative tree */
  story_tree: StoryNode[];
  /** The theme/genre of the story */
  theme: string;
}

/**
 * Type guard to check if a story node is an ending node
 */
export const isEndingNode = (node: StoryNode): node is StoryNode & { outcome: StoryOutcome } => {
  return node.is_ending && node.outcome !== undefined;
};

/**
 * Helper function to find a story node by ID
 */
export const findStoryNodeById = (story: Story, nodeId: string): StoryNode | undefined => {
  return story.story_tree.find(node => node.id === nodeId);
};

/**
 * Helper function to get the starting node of a story
 */
export const getStartingNode = (story: Story): StoryNode | undefined => {
  return story.story_tree.find(node => node.id === 'start');
};