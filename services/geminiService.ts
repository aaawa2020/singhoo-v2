import { GoogleGenAI, Modality } from "@google/genai";
import { MODEL_IMAGEN, MODEL_FLASH_IMAGE, MODEL_PRO_THINKING } from '../constants';
import { AspectRatio, ImageModel, ImageSize } from '../types';

const getAIClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateImage = async (prompt: string, aspectRatio: AspectRatio, model: ImageModel, imageSize: ImageSize): Promise<string> => {
    const ai = getAIClient();

    if (model === MODEL_IMAGEN) {
        const response = await ai.models.generateImages({
            model: MODEL_IMAGEN,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: aspectRatio,
                imageSize: imageSize,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    } else if (model === MODEL_FLASH_IMAGE) {
        const response = await ai.models.generateContent({
            model: MODEL_FLASH_IMAGE,
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
                imageConfig: {
                    aspectRatio: aspectRatio,
                },
            },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    return `data:image/png;base64,${base64ImageBytes}`;
                }
            }
        }
    }
    
    throw new Error("Image generation failed or returned no images.");
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    const ai = getAIClient();
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: mimeType,
        },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: MODEL_FLASH_IMAGE,
        contents: {
            parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    throw new Error("Image editing failed or returned no image data.");
};

export const thinkComplex = async (prompt: string): Promise<string> => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
        model: MODEL_PRO_THINKING,
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
        },
    });
    return response.text;
};
