'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface KeywordInputProps {
  onAdd: (keyword: string) => void;
  placeholder: string;
}

export const KeywordInput = ({ onAdd, placeholder }: KeywordInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setInputValue('');
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
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
          placeholder="Enter keyword..."
          className="text-sm bg-white/10 border-white/20 text-white placeholder:text-white/50"
          autoFocus
        />
      </form>
    );
  }

  return (
    <button
      type="button"
      className="w-full border-2 border-dashed border-white/30 rounded-lg p-3 text-white/60 hover:border-white/50 hover:text-white/80 transition-colors text-left"
      onClick={() => setIsEditing(true)}
    >
      {placeholder}
    </button>
  );
};