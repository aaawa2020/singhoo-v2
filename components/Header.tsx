
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Singhoo Studio <span className="text-indigo-400">Illustrator AI</span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
