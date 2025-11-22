import React from 'react';
import { Lock } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, disabled, ...props }) => {
  return (
    <div className="mb-4 w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {props.required && !disabled && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
            error 
              ? 'border-red-500 focus:ring-red-200' 
              : disabled
                ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'border-gray-300 focus:ring-intelis-blue focus:border-intelis-blue'
          } ${className}`}
          disabled={disabled}
          {...props}
        />
        {disabled && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Lock size={16} />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};