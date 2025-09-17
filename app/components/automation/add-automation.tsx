
'use client';
import { useEffect, useMemo, useState } from 'react';
import { listAutomationPresets, createTemplate, createAutomation, listAutomations, goLiveSubscribe } from '../../lib/instagram/api';
import { useMediaSelection } from '../../stores/media-selection';

type Preset = { id: string; label: string; type: 'comment-reply'|'comment-reply+dm'; description?: string };

export const AddAutomation = () => {
  const [igUserId, setIgUserId] = useState<string| null>(null);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [form, setForm] = useState({
    mediaId: '', keywords: [] as string[], regex: '', replyText: '',
    dmText: '', buttonLabel: '', buttonUrl: '', randomize: false, responses: [] as string[],
  });
  const { selectedIds } = useMediaSelection(); // you already store selections

  useEffect(() => {
    if (typeof window !== 'undefined') setIgUserId(localStorage.getItem('igUserId'));
  }, []);
  useEffect(() => {
    listAutomationPresets().then(res => setPresets(res.presets)).catch(() => setPresets([]));
  }, []);

  useEffect(() => {
    if (!form.mediaId && selectedIds.size > 0) {
      setForm(f => ({ ...f, mediaId: Array.from(selectedIds)[0] }));
    }
  }, [selectedIds]);

  const canSubmit = igUserId && form.mediaId && (form.replyText || form.responses.length > 0) && (selectedPreset !== null);

  const handleAddResponse = (text: string) => {
    setForm(f => ({ ...f, responses: [...f.responses, text] }));
  };

  const handleSave = async () => {
    if (!igUserId || !selectedPreset) return;

    // Build Template body for UI visualization
    const templateBody =
      selectedPreset.type === 'comment-reply'
        ? {
            type: 'comment-reply',
            nodes: [
              { id: 'trigger', kind: 'trigger', label: 'User comments', config: { mediaId: form.mediaId, match: { contains: form.keywords, regex: form.regex || undefined } } },
              { id: 'reply', kind: 'comment_reply', label: 'Reply', config: { text: form.replyText, responses: form.responses, randomize: form.randomize } },
            ],
            edges: [{ from: 'trigger', to: 'reply' }],
          }
        : {
            type: 'comment-reply+dm',
            nodes: [
              { id: 'trigger', kind: 'trigger', label: 'User comments', config: { mediaId: form.mediaId, match: { contains: form.keywords, regex: form.regex || undefined } } },
              { id: 'reply', kind: 'comment_reply', label: 'Reply', config: { text: form.replyText, responses: form.responses, randomize: form.randomize } },
              { id: 'dm', kind: 'dm_message', label: 'Send DM', config: { text: form.dmText, buttons: form.buttonUrl ? [{ type: 'url', label: form.buttonLabel || 'Open', url: form.buttonUrl }] : [] } },
            ],
            edges: [{ from: 'trigger', to: 'reply' }, { from: 'reply', to: 'dm' }],
          };

    const tmpl = await createTemplate({
      name: `${selectedPreset.label} - ${new Date().toISOString()}`,
      type: templateBody.type as any,
      body: templateBody,
    });

    // Build execution rule
    const actions: any[] = [
      form.randomize && form.responses.length > 0
        ? { type: 'comment_reply', text: '', responses: form.responses, randomize: true }
        : { type: 'comment_reply', text: form.replyText }
    ];
    if (selectedPreset.type === 'comment-reply+dm') {
      actions.push({ type: 'send_dm', text: form.dmText, buttons: templateBody.nodes[2].config.buttons });
    }
    const rule = {
      trigger: { type: 'comment_created', mediaId: form.mediaId, match: { contains: form.keywords, regex: form.regex || undefined } },
      actions,
    };

    await createAutomation({
      igUserId,
      mediaId: form.mediaId,
      templateId: tmpl.data.id,
      randomize: form.randomize,
      responses: form.responses,
      rule,
    });
    // optionally refresh automations list
    await listAutomations(igUserId);
    alert('Automation created');
  };

  const handleGoLive = async () => {
    if (!igUserId) return;
    await goLiveSubscribe(igUserId);
    alert('Webhook subscribed');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button className="rounded bg-violet-600 px-3 py-1.5 text-white" onClick={handleGoLive}>Go Live</button>
        <div className="text-xs text-white/60">Subscribes webhook for comment events</div>
      </div>

      <div className="rounded-md border border-white/10 p-4 bg-white/5">
        <div className="mb-3">
          <label className="block text-sm text-white/80 mb-1">Preset</label>
          <select className="w-full rounded bg-black/30 p-2 text-white" onChange={e => setSelectedPreset(presets.find(x => x.id === e.target.value) ?? null)}>
            <option value="">Select preset</option>
            {presets.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-white/80 mb-1">Media Id</label>
            <input className="w-full rounded bg-black/30 p-2 text-white" value={form.mediaId} onChange={e => setForm(f => ({...f, mediaId: e.target.value }))}/>
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">Keywords (comma separated)</label>
            <input className="w-full rounded bg-black/30 p-2 text-white" onChange={e => setForm(f => ({...f, keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}))}/>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-white/80 mb-1">Reply Text</label>
            <input className="w-full rounded bg-black/30 p-2 text-white" value={form.replyText} onChange={e => setForm(f => ({...f, replyText: e.target.value }))}/>
          </div>

          {selectedPreset?.type === 'comment-reply+dm' && (
            <>
              <div className="sm:col-span-2">
                <label className="block text-sm text-white/80 mb-1">DM Text</label>
                <textarea className="w-full rounded bg-black/30 p-2 text-white" value={form.dmText} onChange={e => setForm(f => ({...f, dmText: e.target.value }))}/>
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-1">Button Label</label>
                <input className="w-full rounded bg-black/30 p-2 text-white" value={form.buttonLabel} onChange={e => setForm(f => ({...f, buttonLabel: e.target.value }))}/>
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-1">Button URL</label>
                <input className="w-full rounded bg-black/30 p-2 text-white" value={form.buttonUrl} onChange={e => setForm(f => ({...f, buttonUrl: e.target.value }))}/>
              </div>
            </>
          )}

          <div className="sm:col-span-2 flex items-center gap-2">
            <input id="randomize" type="checkbox" checked={form.randomize} onChange={e => setForm(f => ({...f, randomize: e.target.checked }))}/>
            <label htmlFor="randomize" className="text-sm text-white/80">Randomize from response pool</label>
            <button className="ml-auto rounded bg-black/30 px-2 py-1 text-xs text-white" onClick={() => handleAddResponse(form.replyText)}>Add current reply to pool</button>
          </div>

          {form.responses.length > 0 && (
            <div className="sm:col-span-2 text-xs text-white/70">
              Pool: {form.responses.map((r, i) => <span key={i} className="mr-2 rounded bg-black/40 px-1.5 py-0.5">{r}</span>)}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button disabled={!canSubmit} className="rounded bg-violet-600 px-4 py-2 text-white disabled:opacity-50" onClick={handleSave}>
            Save automation
          </button>
        </div>
      </div>
    </div>
  );
};