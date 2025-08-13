
export type GameState = 'not_started' | 'loading' | 'playing' | 'error';

export interface StoryStep {
  sceneDescription: string;
  imageBase64: string;
  choices: string[];
}
