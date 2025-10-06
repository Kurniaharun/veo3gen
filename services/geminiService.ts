
import { GoogleGenAI } from "@google/genai";
import type { GenerationConfig } from '../types';

const POLLING_INTERVAL = 10000; // 10 seconds

// Define a type for the VEO operation response, as it might not be in the public SDK.
interface VideoOperation {
  done: boolean;
  response?: {
    generatedVideos?: {
      video?: {
        uri: string;
      };
    }[];
  };
  [key: string]: any;
}

export const generateVideo = async (
  config: GenerationConfig,
  onProgress: (message: string) => void
): Promise<Blob> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please ensure it is configured.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  onProgress("Initializing video generation...");

  const requestPayload: any = {
      model: "veo-3.0-generate-preview",
      prompt: config.prompt,
      config: {
        numberOfVideos: 1,
        aspectRatio: config.aspectRatio,
        // Sound and resolution options from the UI are not included here as they are not currently
        // documented parameters for the 'veo-2.0-generate-001' model API.
      }
  };

  if (config.image) {
      requestPayload.image = {
        imageBytes: config.image.data,
        mimeType: config.image.mimeType,
      }
  }

  // The `generateVideos` and `getVideosOperation` methods are based on the documentation
  // for the VEO model. We use @ts-ignore to suppress type errors if they aren't in the public SDK.
  // @ts-ignore
  let operation: VideoOperation = await ai.models.generateVideos(requestPayload);
  
  onProgress("Video synthesis started... This may take several minutes.");
  
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    onProgress("Checking generation status...");
    // @ts-ignore
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  onProgress("Finalizing video...");

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

  if (!downloadLink) {
    throw new Error("Video generation failed or the API returned no video URI.");
  }
  
  onProgress("Downloading generated video...");

  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);

  if (!videoResponse.ok) {
    throw new Error(`Failed to download video: ${videoResponse.statusText}`);
  }

  const videoBlob = await videoResponse.blob();
  
  onProgress("Generation complete!");

  return videoBlob;
};
