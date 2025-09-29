interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
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