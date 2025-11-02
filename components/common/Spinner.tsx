
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
        <p className="text-indigo-300 text-sm">Processing...</p>
    </div>
  );
};

export default Spinner;
