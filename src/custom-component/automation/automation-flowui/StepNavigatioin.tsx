'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronRight, Plus } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceedToNext: boolean;
  canSubmit: boolean;
  isSaving: boolean;
  automationId: string | null;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
}

export const StepNavigation = ({ 
  currentStep, 
  totalSteps, 
  canProceedToNext, 
  canSubmit, 
  isSaving, 
  automationId,
  onPrevious, 
  onNext, 
  onSave 
}: StepNavigationProps) => {
  return (
    <div className="flex justify-between pt-6 border-t border-white/10 mt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />

      </Button>
      
      {currentStep < totalSteps ? (
        <Button
          onClick={onNext}
          disabled={!canProceedToNext}
          className="bg-blue-600 text-center hover:bg-blue-700 text-white disabled:opacity-50"
        >
          
          <ArrowRight className="w-4 h-4 mr-2" />
        </Button>
      ) : (
        <Button
          onClick={onSave}
          disabled={!canSubmit || isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
          ) : (
            automationId ? 'Update ' : 'Save '
          )}
       
        </Button>
      )}
    </div>
  );
};