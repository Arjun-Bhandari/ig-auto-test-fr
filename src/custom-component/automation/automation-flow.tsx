'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from 'react';
import { createTemplate, createAutomation, listAutomations, goLiveSubscribe, getIgMedia } from '../../lib/instagram/api';
import { useMediaSelection } from '../../stores/media-selection';
import IgMediaGrid from "../media/mdia";
import { IgConnectButton } from "../ig-connect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, X, Zap, MessageSquare, Send, ChevronDown, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Progress Indicator Component
const ProgressIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-6">
      <div className="text-sm text-white/80 mb-2">
        Step {currentStep} of {totalSteps}
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

// Keyword Input Component
const KeywordInput = ({ onAdd, placeholder }: { onAdd: (keyword: string) => void; placeholder: string }) => {
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

// Editable Keyword Tag Component
const EditableKeywordTag = ({ 
  keyword, 
  onRemove, 
  onUpdate 
}: { 
  keyword: string; 
  onRemove: () => void; 
  onUpdate: (newKeyword: string) => void;
}) => {
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

export default function AutomationFlow() {
  const { slug } = useParams();
  const { selectedId } = useMediaSelection();
  
  const [igUserId, setIgUserId] = useState<string | null>(null);
  const [automationRule, setAutomationRule] = useState<any[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [media, setMedia] = useState<any[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    mediaId: '', 
    includeKeywords: [] as string[], 
    // excludeKeywords: [] as string[], // Commented out as requested
    regex: '', 
    replyText: '',
    dmText: '', 
    buttonLabel: '', 
    buttonUrl: '', 
    randomize: false, 
    responses: [] as string[],
  });

  const preset = slug === 'comment-reply' || slug === 'comment-reply+dm'
    ? (slug as 'comment-reply' | 'comment-reply+dm')
    : 'comment-reply';

  useEffect(() => {
    if (typeof window !== 'undefined') setIgUserId(localStorage.getItem('igUserId'));
  }, []);

  // Fetch media when component mounts
  useEffect(() => {
    const fetchMedia = async () => {
      if (!igUserId) return;
      try {
        const mediaData = await getIgMedia(igUserId, 24);
        setMedia(mediaData);
      } catch (error) {
        console.error('Failed to fetch media:', error);
      }
    };
    fetchMedia();
  }, [igUserId]);

  useEffect(() => {
    if (selectedId) setForm(f => ({ ...f, mediaId: selectedId }));
    else setForm(f => ({ ...f, mediaId: '' }));
  }, [selectedId]);

  const canSubmit = Boolean(igUserId && form.mediaId && (form.replyText || form.responses.length > 0));

  const handleAddResponse = (text: string) => {
    if (text.trim()) {
      setForm(f => ({ ...f, responses: [...f.responses, text.trim()] }));
    }
  };

  const handleRemoveResponse = (index: number) => {
    setForm(f => ({ ...f, responses: f.responses.filter((_, i) => i !== index) }));
  };

  const handleSelectMedia = (mediaItem: any) => {
    setSelectedMedia(mediaItem);
    setForm(f => ({ ...f, mediaId: mediaItem.id }));
    setShowMediaModal(false);
  };

  const handleAddIncludeKeyword = (keyword: string) => {
    if (keyword.trim() && !form.includeKeywords.includes(keyword.trim())) {
      console.log('Adding include keyword:', keyword.trim());
      setForm(f => ({ ...f, includeKeywords: [...f.includeKeywords, keyword.trim()] }));
    }
  };

  // const handleAddExcludeKeyword = (keyword: string) => {
  //   if (keyword.trim() && !form.excludeKeywords.includes(keyword.trim())) {
  //     setForm(f => ({ ...f, excludeKeywords: [...f.excludeKeywords, keyword.trim()] }));
  //   }
  // }; // Commented out as requested

  const handleRemoveIncludeKeyword = (index: number) => {
    setForm(f => ({ ...f, includeKeywords: f.includeKeywords.filter((_, i) => i !== index) }));
  };

  // const handleRemoveExcludeKeyword = (index: number) => {
  //   setForm(f => ({ ...f, excludeKeywords: f.excludeKeywords.filter((_, i) => i !== index) }));
  // }; // Commented out as requested

  const handleUpdateIncludeKeyword = (index: number, newKeyword: string) => {
    setForm(f => ({
      ...f,
      includeKeywords: f.includeKeywords.map((keyword, i) => i === index ? newKeyword : keyword)
    }));
  };

  // const handleUpdateExcludeKeyword = (index: number, newKeyword: string) => {
  //   setForm(f => ({
  //     ...f,
  //     excludeKeywords: f.excludeKeywords.map((keyword, i) => i === index ? newKeyword : keyword)
  //   }));
  // }; // Commented out as requested

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return Boolean(form.mediaId);
      case 2:
        return Boolean(form.includeKeywords.length > 0);
      case 3:
        return Boolean(form.replyText || form.responses.length > 0);
      default:
        return false;
    }
  };

  const handleSave = async () => {
    if (!igUserId || !form.mediaId) return;

    // Debug logging
    console.log('Form data:', form);
    console.log('Include keywords:', form.includeKeywords);
    // console.log('Exclude keywords:', form.excludeKeywords); // Commented out as requested

    // Build Template body for UI visualization (using backend schema format)
    const templateBody = preset === 'comment-reply'
      ? {
          type: 'comment-reply',
          nodes: [
            { id: 'trigger', kind: 'trigger', label: 'User comments', config: { mediaId: form.mediaId, match: { contains: form.includeKeywords, regex: form.regex || undefined } } },
            { id: 'reply', kind: 'comment_reply', label: 'Reply', config: { text: form.replyText, responses: form.responses, randomize: form.randomize } },
          ],
          edges: [{ from: 'trigger', to: 'reply' }],
        }
      : {
          type: 'comment-reply+dm',
          nodes: [
            { id: 'trigger', kind: 'trigger', label: 'User comments', config: { mediaId: form.mediaId, match: { contains: form.includeKeywords, regex: form.regex || undefined } } },
            { id: 'reply', kind: 'comment_reply', label: 'Reply', config: { text: form.replyText, responses: form.responses, randomize: form.randomize } },
            { id: 'dm', kind: 'dm_message', label: 'Send DM', config: { text: form.dmText, buttons: form.buttonUrl ? [{ type: 'url', label: form.buttonLabel || 'Open', url: form.buttonUrl }] : [] } },
          ],
          edges: [{ from: 'trigger', to: 'reply' }, { from: 'reply', to: 'dm' }],
        };

    const tmpl = await createTemplate({
      name: `${preset === 'comment-reply' ? 'Reply to Comment' : 'Reply to Comment + Send DM'} - ${new Date().toISOString()}`,
      type: templateBody.type as any,
      body: templateBody,
    });

    // Build execution rule
    const actions: any[] = [
      form.randomize && form.responses.length > 0
        ? { type: 'comment_reply', text: '', responses: form.responses, randomize: true }
        : { type: 'comment_reply', text: form.replyText }
    ];
    if (preset === 'comment-reply+dm') {
      actions.push({ type: 'send_dm', text: form.dmText, buttons: templateBody.nodes[2].config.buttons });
    }
    // Build match object according to backend schema
    const matchObject: any = {};
    
    // Use 'include' format (client format) - server now supports both
    if (form.includeKeywords.length > 0) {
      matchObject.include = form.includeKeywords;
    }
    if (form.regex) {
      matchObject.regex = form.regex;
    }

    const rule = {
      trigger: { 
        type: 'comment_created', 
        mediaId: form.mediaId, 
        match: Object.keys(matchObject).length > 0 ? matchObject : undefined
      },
      actions,
    };

    console.log('Final rule being sent:', rule);

    await createAutomation({
      igUserId,
      mediaId: form.mediaId,
      templateId: tmpl.data.id,
      randomize: form.randomize,
      responses: form.responses,
      rule,
    });
    
    const automationsRule = await listAutomations(igUserId);
    setAutomationRule(automationsRule.data);
    alert('Automation created');
  };

  const handleGoLive = async () => {
    if (!igUserId) return;
    await goLiveSubscribe(igUserId);
    alert('Webhook subscribed');
  };

  // Show connect button if no igUserId
  if (!igUserId) {
    return (
      <div className="flex h-screen bg-[#12111A] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Connect to Instagram</h2>
          <p className="text-white/60 mb-6">You need to connect your Instagram account to create automations.</p>
          <IgConnectButton />
        </div>
      </div>
    );
  }

  // Step Components
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Select Media</h2>
        <p className="text-white/60 mb-4">Choose a post or reel to attach this automation.</p>
        
        {/* Selected Media Preview */}
        {selectedMedia && (
          <div className="border border-white/10 rounded-lg p-3 mb-4 bg-white/5">
            <div className="text-xs text-white/60 mb-2">Selected Media:</div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10">
                <img 
                  src={selectedMedia.media_url} 
                  alt="Selected media"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm text-white truncate">
                  {selectedMedia.caption ? selectedMedia.caption.substring(0, 50) + '...' : 'No caption'}
                </div>
                <div className="text-xs text-white/60">ID: {selectedMedia.id}</div>
              </div>
            </div>
          </div>
        )}

        {/* Media Grid - Show first 4 items */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {media.slice(0, 4).map((item, index) => (
              <div 
                key={item.id}
                className="relative group cursor-pointer"
                onClick={() => handleSelectMedia(item)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-white/10">
                  <img 
                    src={item.media_url} 
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                {/* Radio button overlay */}
                <div className="absolute top-2 right-2">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedMedia?.id === item.id 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'bg-white/20 border-white/40'
                  }`}>
                    {selectedMedia?.id === item.id && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* See More Button */}
          {media.length > 4 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={() => setShowMediaModal(true)}
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              See More ({media.length - 4} more)
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
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
              {form.includeKeywords.map((keyword, index) => (
                <EditableKeywordTag
                  key={index}
                  keyword={keyword}
                  onRemove={() => handleRemoveIncludeKeyword(index)}
                  onUpdate={(newKeyword) => handleUpdateIncludeKeyword(index, newKeyword)}
                />
              ))}
            </div>
            {/* Add Keyword Input */}
            <KeywordInput onAdd={handleAddIncludeKeyword} placeholder="+ Keyword" />
          </div>
        </div>

        {/* Exclude Keywords Section - Commented out as requested */}
        {/* <div className="border border-white/10 rounded-lg p-4 bg-white/5 mb-4">
          <h4 className="text-sm font-medium text-white mb-3">
            Comments <span className="font-bold">exclude</span> these Keywords:
          </h4>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {form.excludeKeywords.map((keyword, index) => (
                <EditableKeywordTag
                  key={index}
                  keyword={keyword}
                  onRemove={() => handleRemoveExcludeKeyword(index)}
                  onUpdate={(newKeyword) => handleUpdateExcludeKeyword(index, newKeyword)}
                />
              ))}
            </div>
            <KeywordInput onAdd={handleAddExcludeKeyword} placeholder="+ Keyword" />
          </div>
        </div> */}

        {/* Case Sensitivity Note */}
        <p className="text-xs text-white/60">
          Keywords are not case-sensitive, e.g. "Hello" and "hello" are recognised as the same.
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Public Replies</h2>
        <p className="text-white/60 mb-4">Configure your automated replies.</p>
        
        <div className="space-y-4">
          {form.responses.map((response, index) => (
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
              value={form.replyText}
              onChange={(e) => setForm(f => ({...f, replyText: e.target.value}))}
              className="text-sm bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleAddResponse(form.replyText);
                setForm(f => ({...f, replyText: ''}));
              }}
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
            checked={form.randomize}
            onCheckedChange={(checked) => setForm(f => ({...f, randomize: checked as boolean}))}
          />
          <label htmlFor="randomize" className="text-sm text-white">
            Randomize from response pool
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#12111A]">
      {/* Left Panel - Configuration */}
      <div className="w-96 border-r border-white/10 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4 text-white" />
            <h1 className="text-lg font-semibold text-white">
              {preset === 'comment-reply' ? 'Post or Reel Comments #1' : 'Post or Reel Comments + DM #1'}
            </h1>
          </div>
          <ProgressIndicator currentStep={currentStep} totalSteps={3} />
        </div>

        <div className="p-4">
          {/* Render Current Step */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-white/10 mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={handleGoLive}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                >
                  Go Live
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!canSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  Save Automation
                </Button>
              </div>
            )}
          </div>

          {/* Existing Automations */}
          {automationRule.length > 0 && (
            <div className="pt-4 border-t border-white/10 mt-6">
              <h3 className="text-sm font-medium text-white mb-2">Existing Automations</h3>
              <ul className="space-y-1">
                {automationRule.map((rule) => (
                  <li key={rule.id} className="text-xs text-white/70 bg-white/5 p-2 rounded">
                    {rule.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Canvas (Manychat style workflow) */}
      <div className="flex-1  relative">
          Canvas Automation Flow 
      </div>

      {/* Media Selection Dialog */}
      <Dialog open={showMediaModal} onOpenChange={setShowMediaModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] bg-[#12111A] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Select Media</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {media.map((item, index) => (
                <div 
                  key={item.id}
                  className="relative group cursor-pointer"
                  onClick={() => handleSelectMedia(item)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-white/10">
                    <img 
                      src={item.media_url} 
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  {/* Radio button overlay */}
                  <div className="absolute top-2 right-2">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedMedia?.id === item.id 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-white/20 border-white/40'
                    }`}>
                      {selectedMedia?.id === item.id && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                  </div>
                  {/* Caption overlay */}
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                      <p className="text-xs text-white truncate">
                        {item.caption.substring(0, 60)}...
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}