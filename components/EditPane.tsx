import React, { useState, useCallback, useRef } from 'react';
import { editImage } from '../services/geminiService';
import { convertFileToBase64 } from '../utils/fileUtils';
import ResultDisplay from './common/ResultDisplay';
import Button from './common/Button';
import { EditHistoryItem } from '../types';

interface EditPaneProps {
  addHistoryItem: (item: Omit<EditHistoryItem, 'id' | 'timestamp'>) => void;
}

const EditPane: React.FC<EditPaneProps> = ({ addHistoryItem }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("File size cannot exceed 4MB.");
        return;
      }
      setOriginalImageFile(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setEditedImageUrl(null);
      setError(null);
    }
  };

  const handleEdit = useCallback(async () => {
    if (!originalImageFile) {
      setError('Please upload an image to edit.');
      return;
    }
    if (!prompt) {
      setError('Please enter a prompt to describe the edit.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);

    try {
      const base64Image = await convertFileToBase64(originalImageFile);
      const imageUrl = await editImage(prompt, base64Image, originalImageFile.type);
      setEditedImageUrl(imageUrl);

      if (originalImageUrl) {
        addHistoryItem({
          type: 'edit',
          prompt,
          imageUrl,
          originalImageUrl,
        });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, originalImageFile, originalImageUrl, addHistoryItem]);
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-indigo-300">Image Editing</h2>
      <p className="text-gray-400">Refine your illustrations with simple text commands. Upload an image and describe your desired changes, like adding a filter or removing an object.</p>
      
      <div className="flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Add a retro filter, Make the sky look like a sunset, Remove the person in the background..."
          className="w-full h-24 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
          disabled={isLoading}
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            disabled={isLoading}
          />
           <Button onClick={triggerFileSelect} disabled={isLoading} variant="secondary" className="flex-1">
            {originalImageFile ? 'Change Image' : 'Upload Image'}
          </Button>
          <Button onClick={handleEdit} disabled={isLoading || !prompt || !originalImageFile} className="flex-1">
            {isLoading ? 'Editing...' : 'Apply Edit'}
          </Button>
        </div>
        {originalImageFile && <p className="text-sm text-gray-400 text-center">Selected: {originalImageFile.name}</p>}

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center text-gray-400">Original</h3>
          <ResultDisplay
            isLoading={false}
            error={null}
            content={originalImageUrl ? <img src={originalImageUrl} alt="Original" className="rounded-lg shadow-lg w-full h-auto object-contain" /> : null}
            placeholderText="Upload an image to see it here."
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center text-gray-400">Edited</h3>
          <ResultDisplay
            isLoading={isLoading}
            error={error}
            content={editedImageUrl ? <img src={editedImageUrl} alt="Edited illustration" className="rounded-lg shadow-lg w-full h-auto object-contain" /> : null}
            placeholderText="Your edited image will appear here."
          />
        </div>
      </div>
    </div>
  );
};

export default EditPane;
