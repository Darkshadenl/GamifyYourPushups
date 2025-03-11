import React from 'react';
import { LevelNames } from '../types';

interface HeaderProps {
  streak: number;
  level: number;
}

/**
 * Header component displaying app title, streak, and level information
 */
export function Header({ streak, level }: HeaderProps) {
  const levelName = LevelNames[level] || 'Beginner';
  
  // Format current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 shadow-lg">
      <div className="container mx-auto flex flex-col items-center">
        {/* Title - Always at the top */}
        <div className="w-full text-center mb-4">
          <div className="inline-flex items-center justify-center">
            <span className="text-3xl mr-2">💪</span>
            <h1 className="text-2xl font-bold">Push-up Journey</h1>
          </div>
          <div className="mt-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm inline-block">
              🔥 {streak} days
            </span>
          </div>
        </div>
        
        {/* Level and Date - Side by side on larger screens, stacked on mobile */}
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="bg-white/10 px-4 py-2 rounded-lg text-lg font-semibold text-center sm:text-left">
            Level {level} - {levelName}
          </div>
          <div className="text-white/80 text-sm text-center sm:text-right">
            {formattedDate}
          </div>
        </div>
      </div>
    </header>
  );
} 