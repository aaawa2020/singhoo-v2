
import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import { AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../constants';
import ResultDisplay from './common/ResultDisplay';
import Button from './common/Button';

const GeneratePane: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt to generate an image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(prompt, aspectRatio);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

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
          <div className="flex flex-col sm:flex-row gap-4">
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
