

"use client";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { EditableKeywordTag } from "./EditableKeyword";
import { useAutomationPreview } from "@/stores/automation-preview";
import { CAMAPAIGN_TYPE } from "@/templates/templates";
import { CommentReplyStep } from "./CommetReplyStep";

export const KeywordSelectionStep = () => {
  const { slug } = useParams<{ slug: string }>();
  const preview = useAutomationPreview();
  const [draft, setDraft] = useState("");

  const suggestions = useMemo(() => {
    const t = CAMAPAIGN_TYPE.find((x) => x.id === slug);
    const fromTemplate = (t?.variables as any)?.includeKeywords as
      | string[]
      | undefined;
    return Array.isArray(fromTemplate) && fromTemplate.length
      ? fromTemplate
      : ["Price", "Link", "Shop"];
  }, [slug]);

  const normalize = (s: string) => s.trim();
  const toKey = (s: string) => s.trim().toLowerCase();

  const commitDraftToStore = () => {
    const tokens = draft.split(",").map(normalize).filter(Boolean);
    if (!tokens.length) return;

    const existing = preview.includeKeywords;
    const existingKeys = new Set(existing.map(toKey));
    const merged = [...existing];

    tokens.forEach((t) => {
      const k = toKey(t);
      if (!existingKeys.has(k)) {
        existingKeys.add(k);
        merged.push(t);
      }
    });

    preview.setIncludeKeywords(merged);
    setDraft("");
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitDraftToStore();
    }
  };

  const handleBlur = () => {
    commitDraftToStore();
  };

  const handleRemoveKeyword = (index: number) => {
    preview.setIncludeKeywords(
      preview.includeKeywords.filter((_, i) => i !== index)
    );

    setDraft("");
  };

  const handleUpdateKeyword = (index: number, next: string) => {
    const updated = preview.includeKeywords.slice();
    updated[index] = normalize(next);
    preview.setIncludeKeywords(updated);
  };

  const handlePickSuggestion = (text: string) => {
    const key = toKey(text);
    const exists = preview.includeKeywords.some((k) => toKey(k) === key);
    if (!exists) preview.setIncludeKeywords([...preview.includeKeywords, text]);

    const base = draft.replace(/\s*,\s*$/, "");
    setDraft(base ? `${base}, ${text}` : text);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">
          What will start your Reply automation?
        </h2>
        <p className="text-white/60 mb-4">
          Set up keywords to trigger your automation.
        </p>

        <div className="border border-white/10 rounded-lg p-4 bg-white/5 mb-4">
          <div className="space-y-3">
            {/* Active keywords (editable, removable) */}
            <div className="flex flex-wrap gap-2">
              {preview.includeKeywords.map((keyword, index) => (
                <EditableKeywordTag
                  key={`${keyword}-${index}`}
                  keyword={keyword}
                  onRemove={() => handleRemoveKeyword(index)}
                  onUpdate={(newKeyword) =>
                    handleUpdateKeyword(index, newKeyword)
                  }
                />
              ))}
            </div>

            {/* CSV input (always visible) */}
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleEnter}
              onBlur={handleBlur}
              placeholder="Enter a word or multiple, separated by commas"
              className="w-full text-sm bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
            />

            <div className="text-xs text-white/60">
              Use commas to separate words
            </div>

            {/* Suggestion pills */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-white/60">For example:</span>
              {suggestions.map((s) => {
                const picked = preview.includeKeywords.some(
                  (k) => toKey(k) === toKey(s)
                );
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handlePickSuggestion(s)}
                    className={[
                      "px-3 py-1 rounded-full text-xs transition-colors border",
                      picked
                        ? "bg-white/20 border-white/30 text-white"
                        : "bg-white/10 border-white/20 text-white/80 hover:bg-white/15",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-xs text-white/60">
          Keywords are not case-sensitive, e.g. "Hello" and "hello" are
          recognised as the same.
        </p>
      </div>

      <CommentReplyStep />
    </div>
  );
};
