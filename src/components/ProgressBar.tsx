import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: string;
}

/**
 * ProgressBar component to visualize progress percentage
 */
export function ProgressBar({ progress, label, color = 'bg-gradient-to-r from-indigo-500 to-purple-500' }: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const safeProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="w-full">
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
        <div 
          className={`h-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${safeProgress}%` }}
          role="progressbar"
        />
      </div>
      <div className="text-xs text-right mt-1 font-medium">{safeProgress}%</div>
    </div>
  );
} 