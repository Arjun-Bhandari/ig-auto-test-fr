'use client';
import { KeywordInput } from './KeywordInput';
import { EditableKeywordTag } from './EditableKeyword';
import { useAutomationPreview } from '@/stores/automation-preview';
import { CommentReplyStep } from './CommetReplyStep';

export const KeywordSelectionStep = () => {
  const preview = useAutomationPreview();

  const handleAddKeyword = (keyword: string) => {
    if (keyword.trim() && !preview.includeKeywords.includes(keyword.trim())) {
      preview.setIncludeKeywords([...preview.includeKeywords, keyword.trim()]);
    }
  };

  const handleRemoveKeyword = (index: number) => {
    preview.setIncludeKeywords(preview.includeKeywords.filter((_, i) => i !== index));
  };

  const handleUpdateKeyword = (index: number, newKeyword: string) => {
    preview.setIncludeKeywords(
      preview.includeKeywords.map((keyword, i) => i === index ? newKeyword : keyword)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">What will start your Reply automation?</h2>
        <p className="text-white/60 mb-4">Set up keywords to trigger your automation.</p>
        
        {/* Include Keywords Section */}
        <div className="border border-white/10 rounded-lg p-4 bg-white/5 mb-4">
          <h4 className="text-sm font-medium text-white mb-3">
            Comments <span className="font-bold">include</span> these Keywords:
          </h4>
          <div className="space-y-3">
            {/* Keyword Tags */}
            <div className="flex flex-wrap gap-2">
              {preview.includeKeywords.map((keyword, index) => (
                <EditableKeywordTag
                  key={index}
                  keyword={keyword}
                  onRemove={() => handleRemoveKeyword(index)}
                  onUpdate={(newKeyword) => handleUpdateKeyword(index, newKeyword)}
                />
              ))}
            </div>
            <KeywordInput onAdd={handleAddKeyword} placeholder="+ Keyword" />
          </div>
        </div>

        {/* Case Sensitivity Note */}
        <p className="text-xs text-white/60">
          Keywords are not case-sensitive, e.g. "Hello" and "hello" are recognised as the same.
        </p>
      </div>
      <CommentReplyStep/>
    </div>
  );
};