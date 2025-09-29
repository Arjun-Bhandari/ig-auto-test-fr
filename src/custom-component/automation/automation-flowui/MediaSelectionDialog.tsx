'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMediaSelection } from '@/stores/media-selection';

interface MediaSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MediaSelectionDialog = ({ open, onOpenChange }: MediaSelectionDialogProps) => {
  const { getSelectedMedia } = useMediaSelection();
  const media = useMediaSelection(state => state.media);
  const selectedMedia = getSelectedMedia();

  const handleSelectMedia = (mediaItem: any) => {
    useMediaSelection.getState().select(mediaItem.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-[#12111A] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Select Media</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {media.map((item, index) => (
              <div 
                key={item.id}
                className="relative group cursor-pointer"
                onClick={() => handleSelectMedia(item)}
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
                {/* Caption overlay */}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                    <p className="text-xs text-white truncate">
                      {item.caption.substring(0, 60)}...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};