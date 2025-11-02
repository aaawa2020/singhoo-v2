import React, { useState, useCallback, useEffect } from 'react';
import { generateImage } from '../services/geminiService';
import { AspectRatio, ImageModel, ImageSize, GenerateHistoryItem, HistoryItem } from '../types';
import { ASPECT_RATIOS, IMAGE_MODELS, IMAGE_SIZES } from '../constants';
import ResultDisplay from './common/ResultDisplay';
import Button from './common/Button';

interface GeneratePaneProps {
  addHistoryItem: (item: Omit<GenerateHistoryItem, 'id' | 'timestamp'>) => void;
  reusedSettings: HistoryItem | null;
  onSettingsReused: () => void;
}


const GeneratePane: React.FC<GeneratePaneProps> = ({ addHistoryItem, reusedSettings, onSettingsReused }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [model, setModel] = useState<ImageModel>(IMAGE_MODELS[0].id);
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const selectedModelInfo = IMAGE_MODELS.find(m => m.id === model);

  useEffect(() => {
    if (reusedSettings && reusedSettings.type === 'generate') {
      setPrompt(reusedSettings.prompt);
      setGeneratedImage(reusedSettings.imageUrl);
      if (reusedSettings.settings) {
        setModel(reusedSettings.settings.model);
        setAspectRatio(reusedSettings.settings.aspectRatio);
        setImageSize(reusedSettings.settings.imageSize);
      }
      setError(null);
      onSettingsReused();
    }
  }, [reusedSettings, onSettingsReused]);

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt to generate an image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(prompt, aspectRatio, model, imageSize);
      setGeneratedImage(imageUrl);
      addHistoryItem({
        type: 'generate',
        prompt,
        imageUrl,
        settings: { model, aspectRatio, imageSize },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio, model, imageSize, addHistoryItem]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-indigo-300">Image Generation</h2>
      <p className="text-gray-400">Create stunning visual novel illustrations from a text description. Describe your scene, characters, and style to bring your vision to life.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A young mage with silver hair standing in a glowing enchanted forest, fantasy, detailed, cinematic lighting..."
            className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
            disabled={isLoading}
          />
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-1">Image Model</label>
            <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value as ImageModel)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            disabled={isLoading}
            >
            {IMAGE_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
            ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {selectedModelInfo?.supportsAspectRatio && (
              <div className="flex-1">
                  <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-1">Aspect Ratio</label>
                  <select
                  id="aspectRatio"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  disabled={isLoading}
                  >
                  {ASPECT_RATIOS.map(ratio => (
                      <option key={ratio} value={ratio}>{ratio}</option>
                  ))}
                  </select>
              </div>
            )}
            {selectedModelInfo?.supportsImageSize && (
              <div className="flex-1">
                  <label htmlFor="imageSize" className="block text-sm font-medium text-gray-300 mb-1">Image Size</label>
                  <select
                  id="imageSize"
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value as ImageSize)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  disabled={isLoading}
                  >
                  {IMAGE_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                  ))}
                  </select>
              </div>
            )}
            <div className="flex-1 flex items-end">
                <Button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full">
                {isLoading ? 'Generating...' : 'Generate Image'}
                </Button>
            </div>
          </div>
        </div>
        <div className="md:col-span-1">
          <ResultDisplay
            isLoading={isLoading}
            error={error}
            content={generatedImage ? <img src={generatedImage} alt="Generated illustration" className="rounded-lg shadow-lg w-full h-auto object-contain" /> : null}
            placeholderText="Your generated image will appear here."
          />
        </div>
      </div>
    </div>
  );
};

export default GeneratePane;
