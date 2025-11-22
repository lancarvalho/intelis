import React from 'react';
import { Steps } from '../types';
import { User, MapPin, FileText, Heart, Camera, CreditCard } from 'lucide-react';

interface StepperProps {
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const steps = [
    { id: Steps.PERSONAL, label: 'Dados Pessoais', icon: User },
    { id: Steps.ADDRESS, label: 'Endereço', icon: MapPin },
    { id: Steps.COMPLEMENTARY, label: 'Dados Comp.', icon: FileText },
    { id: Steps.INTERESTS, label: 'Interesses', icon: Heart },
    { id: Steps.DOCUMENTS, label: 'Documentos', icon: CreditCard },
    { id: Steps.SELFIE, label: 'Selfie', icon: Camera },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Line Background */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
        
        {/* Line Progress */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-intelis-blue -z-10 transition-all duration-500 ease-in-out" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isActive = step.id <= currentStep;
          const isCurrent = step.id === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center bg-white px-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive 
                    ? 'bg-intelis-blue border-intelis-blue text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                <Icon size={18} />
              </div>
              <span 
                className={`mt-2 text-xs font-medium hidden md:block ${
                  isActive ? 'text-intelis-blue' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="md:hidden text-center mt-4">
        <span className="text-sm font-semibold text-intelis-blue">
          Passo {currentStep} de {steps.length}: {steps.find(s => s.id === currentStep)?.label}
        </span>
      </div>
    </div>
  );
};
