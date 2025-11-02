import React, { useState } from 'react';
import { AppMode, HistoryItem } from './types';
import Header from './components/Header';
import TabSelector from './components/TabSelector';
import GeneratePane from './components/GeneratePane';
import EditPane from './components/EditPane';
import ThinkPane from './components/ThinkPane';
import HistoryPanel from './components/history/HistoryPanel';
import { useHistory } from './hooks/useHistory';
import ImageViewerModal from './components/history/ImageViewerModal';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [history, addHistoryItem, removeHistoryItem, clearHistory] = useHistory();
  const [reusedSettings, setReusedSettings] = useState<HistoryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<HistoryItem | null>(null);


  const handleReuse = (item: HistoryItem) => {
    if (item.type === 'generate') {
      setMode(AppMode.GENERATE);
      setReusedSettings(item);
    }
  };

  const handleSettingsReused = () => {
    setReusedSettings(null);
  };

  const handleView = (item: HistoryItem) => {
    setViewingItem(item);
  };

  const handleCloseViewer = () => {
    setViewingItem(null);
  };

  const renderPane = () => {
    switch (mode) {
      case AppMode.GENERATE:
        return <GeneratePane addHistoryItem={addHistoryItem} reusedSettings={reusedSettings} onSettingsReused={handleSettingsReused} />;
      case AppMode.EDIT:
        return <EditPane addHistoryItem={addHistoryItem} />;
      case AppMode.THINK:
        return <ThinkPane />;
      default:
        return <GeneratePane addHistoryItem={addHistoryItem} reusedSettings={reusedSettings} onSettingsReused={handleSettingsReused} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-8 flex">
        <div className="flex flex-col lg:flex-row gap-8 max-w-screen-2xl w-full mx-auto">
          {/* Main Workspace Panel */}
          <div className="flex-1 bg-gray-800/50 rounded-xl shadow-2xl border border-gray-700 flex flex-col min-h-[70vh]">
            {/* Panel Header with Tabs */}
            <div className="p-3 border-b border-gray-700">
              <TabSelector currentMode={mode} onModeChange={setMode} />
            </div>
            {/* Panel Content */}
            <div className="flex-grow p-4 md:p-8 overflow-y-auto">
              {renderPane()}
            </div>
          </div>
          {/* History Panel */}
          <div className="lg:w-96 xl:w-[420px] lg:flex-shrink-0">
            <HistoryPanel
              history={history}
              onReuse={handleReuse}
              onDelete={removeHistoryItem}
              onClear={clearHistory}
              onView={handleView}
            />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Singhoo Studio. All rights reserved.</p>
      </footer>
      {viewingItem && (
        <ImageViewerModal item={viewingItem} onClose={handleCloseViewer} />
      )}
    </div>
  );
};

export default App;