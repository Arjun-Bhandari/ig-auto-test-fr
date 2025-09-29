'use client';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useMediaSelection } from '@/stores/media-selection';

interface MediaSelectionStepProps {
  onShowModal: () => void;
}

export const MediaSelectionStep = ({ onShowModal }: MediaSelectionStepProps) => {
  const { getSelectedMedia } = useMediaSelection();
  const media = useMediaSelection(state => state.media);
  const selectedMedia = getSelectedMedia();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Select Media</h2>
        <p className="text-white/60 mb-4">Choose a post or reel to attach this automation.</p>
        
        {/* Selected Media Preview */}
        {selectedMedia && (
          <div className="border border-white/10 rounded-lg p-3 mb-4 bg-white/5">
            <div className="text-xs text-white/60 mb-2">Selected Media:</div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10">
                <img 
                  src={selectedMedia.media_url} 
                  alt="Selected media"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm text-white truncate ">
                  {selectedMedia.caption ? selectedMedia.caption.substring(0, 50) + '...' : 'No caption'}
                </div>
                {/* <div className="text-xs text-white/60">ID: {selectedMedia.id}</div> */}
              </div>
            </div>
          </div>
        )}

        {/* Media Grid - Show first 4 items */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {media.slice(0, 4).map((item, index) => (
              <div 
                key={item.id}
                className="relative group cursor-pointer"
                onClick={() => useMediaSelection.getState().select(item.id)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-white/10">
                  <img 
                    src={item.media_url} 
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                {/* Radio button overlay */}
                <div className="absolute top-2 right-2">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedMedia?.id === item.id 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'bg-white/20 border-white/40'
                  }`}>
                    {selectedMedia?.id === item.id && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* See More Button */}
          {media.length > 4 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={onShowModal}
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              See More ({media.length - 4} more)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};