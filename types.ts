
export type AspectRatio = '16:9' | '9:16';
export type Resolution = '720p' | '1080p';

export interface GenerationConfig {
  prompt: string;
  image?: {
    data: string; // base64 encoded string
    mimeType: string;
  };
  aspectRatio: AspectRatio;
  soundEnabled: boolean;
  resolution: Resolution;
}
