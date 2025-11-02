
import React from 'react';
import Spinner from './Spinner';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  content: React.ReactNode | null;
  placeholderText?: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, content, placeholderText = "Result will be displayed here." }) => {
  return (
    <div className="w-full min-h-[200px] h-full bg-gray-900/70 rounded-lg flex items-center justify-center p-4 border-2 border-dashed border-gray-600">
      {isLoading && <Spinner />}
      {!isLoading && error && (
        <div className="text-center text-red-400">
          <h4 className="font-bold">Error</h4>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {!isLoading && !error && !content && (
        <p className="text-gray-500 text-center">{placeholderText}</p>
      )}
      {!isLoading && !error && content}
    </div>
  );
};

export default ResultDisplay;
