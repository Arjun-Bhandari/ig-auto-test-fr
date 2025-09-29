'use client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAutomationPreview } from '@/stores/automation-preview';

export const DmStep = () => {
  const preview = useAutomationPreview();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Direct Message</h2>
        <p className="text-white/60 mb-4">Configure your DM message and optional button.</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/80 mb-2 block">DM Text</label>
            <Textarea
              value={preview.dmText}
              onChange={(e) => preview.setDmText(e.target.value)}
              placeholder="Enter your DM message..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm text-white/80 mb-2 block">Button Label (Optional)</label>
            <Input
              value={preview.buttonLabel}
              onChange={(e) => preview.setButtonLabel(e.target.value)}
              placeholder="e.g., Learn More"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          
          <div>
            <label className="text-sm text-white/80 mb-2 block">Button URL (Optional)</label>
            <Input
              value={preview.buttonUrl}
              onChange={(e) => preview.setButtonUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};