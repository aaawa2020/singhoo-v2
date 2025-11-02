import React from 'react';
import { HistoryItem } from '../../types';
import HistoryItemCard from './HistoryItemCard';
import Button from '../common/Button';

interface HistoryPanelProps {
  history: HistoryItem[];
  onReuse: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onView: (item: HistoryItem) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onReuse, onDelete, onClear, onView }) => {
  return (
    <div className="bg-gray-800/50 rounded-xl shadow-2xl border border-gray-700 h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
        <h2 className="text-xl font-bold text-indigo-300">History</h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors font-semibold bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-gray-500">Your past generations and edits will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {history.map(item => (
              <HistoryItemCard
                key={item.id}
                item={item}
                onReuse={onReuse}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;