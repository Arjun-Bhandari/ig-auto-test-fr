"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { listAutomationPresets } from "@/lib/instagram/api";
import { useRouter } from "next/navigation";
interface Preset {
  id: string;
  label: string;
  type: "comment-reply" | "comment-reply+dm";
  description?: string;
}

interface TempleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (preset: Preset) => void;
}

export function TempleteDialog({ open, onOpenChange, onSelect }: TempleteDialogProps) {
  const [query, setQuery] = useState("");
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (!open) return;
    let abort = new AbortController();
    (async () => {
      try {
        setIsLoading(true);
        setHasError(null);
        const res = await listAutomationPresets();
        if (!abort.signal.aborted) setPresets(res.presets ?? []);
      } catch (e: any) {
        if (!abort.signal.aborted) setHasError(e?.message ?? "Failed to load templates");
      } finally {
        if (!abort.signal.aborted) setIsLoading(false);
      }
    })();
    return () => abort.abort();
  }, [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) return presets;
    const q = query.toLowerCase();
    return presets.filter(
      (p) => p.label.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    );
  }, [presets, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-white/10 bg-[#12111A] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Templates</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
          />
          {hasError ? (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {hasError}
            </div>
          ) : null}
          <ScrollArea className="h-[60vh] pr-2">
            <div className="grid gap-3 sm:grid-cols-2  lg:grid-cols-2">
              {(isLoading ? Array.from({ length: 6 }) : filtered).map((item: any, i) => (
                <button
                  key={isLoading ? i : item.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => !isLoading && router.push(`/automation/${item.id}`)}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:bg-white/10 disabled:opacity-50 hover:border-white/20"
                >

                  <div className="space-y-2">
                    <div className="font-medium text-white">
                      {isLoading ? "Loading..." : item.label}
                    </div>
                    <div className="text-xs text-white/70">
                      {isLoading ? "Please wait" : item.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
//