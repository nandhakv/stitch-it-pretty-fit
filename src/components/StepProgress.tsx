import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  steps: string[];
  currentStep: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="step-progress md:hidden">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <div 
                className={`step-progress-line ${
                  isCompleted || (isActive && index > 0) ? 'bg-plum' : 'bg-warm-gray'
                }`}
              />
            )}
            
            <div className="step-progress-item">
              <div
                className={`step-progress-circle ${
                  isActive ? 'step-active' : isCompleted ? 'step-completed' : 'step-incomplete'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="text-xs mt-1 max-w-[60px] text-center">
                {step}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgress;
