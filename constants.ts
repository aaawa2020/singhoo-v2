import { AspectRatio, ImageModel, ImageSize } from './types';

export const MODEL_IMAGEN = 'imagen-4.0-generate-001';
export const MODEL_FLASH_IMAGE = 'gemini-2.5-flash-image';
export const MODEL_PRO_THINKING = 'gemini-2.5-pro';

export const ASPECT_RATIOS: AspectRatio[] = ["1:1", "16:9", "9:16", "4:3", "3:4"];

export const IMAGE_SIZES: ImageSize[] = ["1K", "2K"];

export const IMAGE_MODELS: { id: ImageModel; name: string; supportsAspectRatio: boolean; supportsImageSize: boolean; }[] = [
  { id: 'imagen-4.0-generate-001', name: 'Imagen 4.0', supportsAspectRatio: true, supportsImageSize: true },
  { id: 'gemini-2.5-flash-image', name: 'Gemini Flash Image', supportsAspectRatio: true, supportsImageSize: false },
];