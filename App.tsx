
import React, { useState } from 'react';
import { AppMode } from './types';
import Header from './components/Header';
import TabSelector from './components/TabSelector';
import GeneratePane from './components/GeneratePane';
import EditPane from './components/EditPane';
import ThinkPane from './components/ThinkPane';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);

  const renderPane = () => {
    switch (mode) {
      case AppMode.GENERATE:
        return <GeneratePane />;
      case AppMode.EDIT:
        return <EditPane />;
      case AppMode.THINK:
        return <ThinkPane />;
      default:
        return <GeneratePane />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <TabSelector currentMode={mode} onModeChange={setMode} />
          <div className="mt-6 bg-gray-800/50 rounded-xl shadow-2xl p-4 md:p-8 border border-gray-700">
            {renderPane()}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Singhoo Studio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
