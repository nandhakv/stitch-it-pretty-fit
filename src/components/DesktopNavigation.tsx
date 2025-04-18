
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

interface StepItem {
  label: string;
  path: string;
}

const steps: StepItem[] = [
  { label: "Address", path: "/" },
  { label: "Boutique", path: "/boutiques" },
  { label: "Design", path: "/service-options" },
  { label: "Cloth", path: "/cloth-selection" },
  { label: "Measure", path: "/measurement" },
  { label: "Order", path: "/order-summary" },
  { label: "Pickup", path: "/pickup-scheduling" }
];

const DesktopNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentStepIndex = () => {
    const currentPath = location.pathname;
    return steps.findIndex(step => currentPath === step.path);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-6 text-plum">Order Progress</h2>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          
          return (
            <button
              key={step.path}
              onClick={() => navigate(step.path)}
              className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors
                ${isActive ? 'bg-plum text-white' : 
                  isCompleted ? 'bg-light-plum text-white' : 
                  'text-gray-500 hover:bg-warm-gray'}`}
            >
              <span className="w-6 h-6 flex items-center justify-center rounded-full border border-current">
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </span>
              <span className="font-medium">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DesktopNavigation;
