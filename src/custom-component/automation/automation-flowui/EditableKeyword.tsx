'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface EditableKeywordTagProps {
  keyword: string;
  onRemove: () => void;
  onUpdate: (newKeyword: string) => void;
}

export const EditableKeywordTag = ({ 
  keyword, 
  onRemove, 
  onUpdate 
}: EditableKeywordTagProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(keyword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && inputValue.trim() !== keyword) {
      onUpdate(inputValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setInputValue(keyword);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim() && inputValue.trim() !== keyword) {
      onUpdate(inputValue.trim());
    } else {
      setInputValue(keyword);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="text-sm bg-white/10 border-white/20 text-white h-8 px-2 py-1 min-w-[80px]"
          autoFocus
        />
      </form>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 cursor-pointer hover:bg-white/15 transition-colors">
      <span 
        className="text-sm text-white"
        onClick={() => setIsEditing(true)}
      >
        {keyword}
      </span>
      <button
        onClick={onRemove}
        className="text-white/60 hover:text-white ml-1"
        type="button"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};