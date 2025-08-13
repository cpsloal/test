
import { GoogleGenAI, Type } from "@google/genai";
import type { StoryStep } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const gameStepSchema = {
  type: Type.OBJECT,
  properties: {
    sceneDescription: {
      type: Type.STRING,
      description: "A detailed, engaging description of the current scene in a text adventure game. Describe the environment, characters, and mood in 2-3 sentences. Be creative and immersive."
    },
    imagePrompt: {
      type: Type.STRING,
      description: "A concise, descriptive prompt for an image generation model to create a picture for this scene. Focus on key visual elements. Example: 'Epic fantasy art, a lone knight stands before a glowing cave entrance in a dark forest.'"
    },
    choices: {
      type: Type.ARRAY,
      description: "An array of 3 distinct, short action choices for the player to make next. Each choice should be a complete, concise sentence starting with a verb.",
      items: { type: Type.STRING }
    }
  },
  required: ["sceneDescription", "imagePrompt", "choices"]
};

async function getGameStep(prompt: string): Promise<StoryStep> {
  // Generate the story content and image prompt
  const textResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: gameStepSchema,
      temperature: 0.9
    }
  });

  const rawJson = textResponse.text.trim();
  const storyData = JSON.parse(rawJson);
  
  const { sceneDescription, imagePrompt, choices } = storyData;

  // Generate the image
  const imageResponse = await ai.models.generateImages({
    model: 'imagen-3.0-generate-002',
    prompt: `${imagePrompt}, cinematic lighting, detailed, high quality, fantasy illustration`,
    config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '16:9',
    },
  });

  if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
      throw new Error("Image generation failed.");
  }
  
  const imageBase64 = imageResponse.generatedImages[0].image.imageBytes;

  return {
    sceneDescription,
    imageBase64,
    choices
  };
}


export async function generateInitialScene(theme: string): Promise<StoryStep> {
  const prompt = `You are a creative and engaging dungeon master. Start a brand new text-based adventure game with the theme: "${theme}". The player is just beginning their journey. Provide a compelling opening scene.`;
  return getGameStep(prompt);
}

export async function generateNextScene(storyHistory: StoryStep[], playerChoice: string): Promise<StoryStep> {
  const historyText = storyHistory.map((step, index) => 
    `Scene ${index + 1}: ${step.sceneDescription}`
  ).join('\n');

  const prompt = `
You are a creative and engaging dungeon master continuing a text adventure game.
Here is the story so far:
${historyText}

The player's last action was: "${playerChoice}"

Now, generate the very next part of the story.
- The tone should be consistent with the established theme.
- The player should feel the consequences of their action.
- Do not repeat previous descriptions. Create a fresh and new scene.
- Ensure the choices are logical next steps.
`;
  return getGameStep(prompt);
}
