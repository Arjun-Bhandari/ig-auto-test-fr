'use client';
import { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAutomationPreview } from '@/stores/automation-preview';
import { CAMAPAIGN_TYPE } from '@/templates/templates';

export const DmStep = () => {
  const { slug } = useParams<{ slug: string }>();
  const preview = useAutomationPreview();

  // Pick first default DM text from template (if any)
  const defaultDm = useMemo(() => {
    const t = CAMAPAIGN_TYPE.find(x => x.id === slug);
    const arr = (t?.variables as any)?.defaultDmText as string[] | undefined;
    return Array.isArray(arr) && arr.length ? arr[0] : '';
  }, [slug]);

  // Prefill once if empty; user can still edit freely
  useEffect(() => {
    if (!preview.dmText && defaultDm) {
      preview.setDmText(defaultDm);
    }
  }, [defaultDm, preview.dmText]);

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