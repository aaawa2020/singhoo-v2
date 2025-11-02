
import React, { useState, useCallback } from 'react';
import { thinkComplex } from '../services/geminiService';
import ResultDisplay from './common/ResultDisplay';
import Button from './common/Button';

const ThinkPane: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);

  const handleThink = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a query.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultText(null);

    try {
      const text = await thinkComplex(prompt);
      setResultText(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-indigo-300">Thinking Mode</h2>
      <p className="text-gray-400">Tackle your most complex creative challenges. Use this mode for brainstorming detailed plot points, generating complex character backstories, or drafting intricate scene descriptions. Powered by Gemini 2.5 Pro for advanced reasoning.</p>

      <div className="flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your complex query here. For example: 'Develop a branching narrative for a visual novel chapter where the protagonist must choose between three conflicting loyalties. Outline the key decision points and their immediate consequences...'"
          className="w-full h-40 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
          disabled={isLoading}
        />
        <div className="flex justify-end">
          <Button onClick={handleThink} disabled={isLoading || !prompt} className="w-full sm:w-auto">
            {isLoading ? 'Thinking...' : 'Engage AI'}
          </Button>
        </div>
      </div>

      <div className="mt-4">
         <ResultDisplay
            isLoading={isLoading}
            error={error}
            content={resultText ? <pre className="whitespace-pre-wrap bg-gray-900/50 p-4 rounded-md text-gray-200 text-sm font-mono leading-relaxed">{resultText}</pre> : null}
            placeholderText="The AI's response will appear here."
          />
      </div>
    </div>
  );
};

export default ThinkPane;
