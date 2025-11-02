import React from 'react';
import { HistoryItem } from '../../types';
import Modal from '../common/Modal';
import Button from '../common/Button';

interface ImageViewerModalProps {
  item: HistoryItem;
  onClose: () => void;
}

const Detail: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-indigo-300">{label}</p>
    <p className="text-gray-300">{value}</p>
  </div>
);


const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ item, onClose }) => {
    
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = item.imageUrl;
    link.download = `singhoo-studio-${item.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <Modal isOpen={!!item} onClose={onClose} title="Image Details">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-lg overflow-hidden bg-gray-900/50 flex items-center justify-center">
            <img src={item.imageUrl} alt={item.prompt} className="max-w-full max-h-[65vh] object-contain" />
        </div>
        <div className="md:col-span-1 flex flex-col gap-4">
            <div>
                <p className="text-sm font-semibold text-indigo-300 mb-1">Prompt</p>
                <p className="text-sm bg-gray-900/80 p-3 rounded-md text-gray-200 whitespace-pre-wrap">{item.prompt}</p>
            </div>

            {item.type === 'generate' && (
                <>
                    <Detail label="Model" value={item.settings.model} />
                    <Detail label="Aspect Ratio" value={item.settings.aspectRatio} />
                    <Detail label="Image Size" value={item.settings.imageSize} />
                </>
            )}

            {item.type === 'edit' && (
                <div>
                     <p className="text-sm font-semibold text-indigo-300 mb-1">Original Image</p>
                     <img src={item.originalImageUrl} alt="Original version" className="rounded-md border-2 border-gray-600" />
                </div>
            )}
            
            <div className="mt-auto pt-4">
                <Button onClick={handleDownload} className="w-full">
                    Download Image
                </Button>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImageViewerModal;