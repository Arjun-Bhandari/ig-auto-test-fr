'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { useAutomationPreview } from '@/stores/automation-preview';

export const CommentReplyStep = () => {
  const preview = useAutomationPreview();

  const handleAddResponse = () => {
    if (preview.replyText.trim()) {
      preview.setResponses([...preview.responses, preview.replyText.trim()]);
      preview.setReplyText('');
    }
  };

  const handleRemoveResponse = (index: number) => {
    preview.setResponses(preview.responses.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Public Replies</h2>
        <p className="text-white/60 mb-4">Configure your automated replies.</p>
        
        <div className="space-y-4">
          {preview.responses.map((response, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border border-white/10 rounded-lg bg-white/5">
              <span className="flex-1 text-sm text-white">{response}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveResponse(index)}
                className="h-6 w-6 p-0 text-white/60 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Add reply text..."
              value={preview.replyText}
              onChange={(e) => preview.setReplyText(e.target.value)}
              className="text-sm bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddResponse}
              className="px-3 border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Randomize Option */}
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="randomize"
            checked={preview.randomize}
            onCheckedChange={(checked) => preview.setRandomize(checked as boolean)}
          />
          <label htmlFor="randomize" className="text-sm text-white">
            Randomize from response pool
          </label>
        </div>
      </div>
    </div>
  );
};