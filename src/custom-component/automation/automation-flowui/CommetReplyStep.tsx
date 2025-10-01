'use client';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAutomationPreview } from '@/stores/automation-preview';
import { CAMAPAIGN_TYPE } from '@/templates/templates';
import { cn } from '@/lib/utils'; // if you have a cn helper, else inline classes

export const CommentReplyStep = () => {
  const { slug } = useParams<{ slug: string }>();
  const preview = useAutomationPreview();

  const defaults = useMemo(() => {
    const t = CAMAPAIGN_TYPE.find(x => x.id === slug);
    return t?.variables?.defaultReplyText ?? [];
  }, [slug]);

  const handlePick = (val: string) => {
    preview.setReplyText(val);
  };

  return (
    <div className="space-y-3">

      <div className="pt-2">
        <label className="block text-xs text-white/60 mb-1">Your reply</label>
        <textarea
          value={preview.replyText}
          onChange={(e) => preview.setReplyText(e.target.value)}
          className="w-full bg-white/10 border border-white/10 rounded-md px-3 py-2 text-sm min-h-[88px] focus:outline-none focus:ring-1 focus:ring-white/30"
          placeholder="Type your reply…"
        />
      </div>
      <div className="text-xs text-white/60">Quick replies</div>
      <div className="grid gap-2">
        {defaults.map((val) => {
          const isSelected = preview.replyText.trim() === val.trim();
          return (
            <button
              key={val}
              type="button"
              onClick={() => handlePick(val)}
              className={cn(
                'w-full text-left bg-white/10 hover:bg-white/15 border rounded-md px-3 py-2 text-sm transition-colors',
                isSelected ? 'border-white/40 bg-white/15' : 'border-white/10'
              )}
            >
              {val}
            </button>
          );
        })}
      </div>

      
    </div>
  );
};