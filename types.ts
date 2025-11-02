export enum AppMode {
  GENERATE = 'generate',
  EDIT = 'edit',
  THINK = 'think',
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export type ImageModel = 'imagen-4.0-generate-001' | 'gemini-2.5-flash-image';

export type ImageSize = "1K" | "2K";

// History types
interface HistoryItemBase {
  id: string;
  timestamp: number;
  prompt: string;
  imageUrl: string;
}

export interface GenerateHistoryItem extends HistoryItemBase {
  type: 'generate';
  settings: {
    model: ImageModel;
    aspectRatio: AspectRatio;
    imageSize: ImageSize;
  };
}

export interface EditHistoryItem extends HistoryItemBase {
  type: 'edit';
  originalImageUrl: string;
}

export type HistoryItem = GenerateHistoryItem | EditHistoryItem;
