import React from 'react';
import { AppMode } from '../types';

interface TabSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const TabButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  // Fix: Changed JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactNode;
}> = ({ label, isActive, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-md'
          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

const TabSelector: React.FC<TabSelectorProps> = ({ currentMode, onModeChange }) => {
  const tabs = [
    {
      mode: AppMode.GENERATE,
      label: 'Generate',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
      )
    },
    {
      mode: AppMode.EDIT,
      label: 'Edit',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
      )
    },
    {
      mode: AppMode.THINK,
      label: 'Think',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
      )
    }
  ];

  return (
    <div className="flex p-1 space-x-2 bg-gray-900/60 rounded-xl">
      {tabs.map(tab => (
        <TabButton
          key={tab.mode}
          label={tab.label}
          icon={tab.icon}
          isActive={currentMode === tab.mode}
          onClick={() => onModeChange(tab.mode)}
        />
      ))}
    </div>
  );
};

export default TabSelector;