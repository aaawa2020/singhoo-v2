import React from 'react';
import { HistoryItem } from '../../types';

interface HistoryItemCardProps {
  item: HistoryItem;
  onReuse: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onView: (item: HistoryItem) => void;
}

const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ item, onReuse, onDelete, onView }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.imageUrl;
    link.download = `singhoo-studio-${item.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all duration-200 cursor-pointer"
      onClick={() => onView(item)}
    >
      <img src={item.imageUrl} alt={item.prompt.substring(0, 50)} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
        {item.type === 'generate' && (
          <button
            onClick={(e) => { e.stopPropagation(); onReuse(item); }}
            className="w-full text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1.5 px-2 rounded transition-colors"
            title="Reuse settings"
          >
            Reuse
          </button>
        )}
        <button
            onClick={handleDownload}
            className="w-full text-xs bg-green-600 hover:bg-green-500 text-white font-semibold py-1.5 px-2 rounded transition-colors"
            title="Download Image"
        >
            Download
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className="w-full text-xs bg-red-700 hover:bg-red-600 text-white font-semibold py-1.5 px-2 rounded transition-colors"
          title="Delete item"
        >
          Delete
        </button>
      </div>
       <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent transition-opacity group-hover:opacity-0">
        <p className="text-white text-xs truncate">{item.prompt}</p>
      </div>
    </div>
  );
};

export default HistoryItemCard;