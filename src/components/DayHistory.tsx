import React from 'react';
import { WorkoutDay } from '../types';

interface DayHistoryProps {
  days: WorkoutDay[];
  currentDayNumber: number;
  onSelectDay: (dayNumber: number) => void;
}

/**
 * DayHistory component to navigate through completed days
 */
export function DayHistory({ days, currentDayNumber, onSelectDay }: DayHistoryProps) {
  // Sort days by day number
  const sortedDays = [...days].sort((a, b) => a.day - b.day);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="text-2xl mr-2">📅</span>
        History
      </h2>
      
      <div className="flex flex-wrap gap-2">
        {sortedDays.map(day => (
          <button
            key={day.day}
            onClick={() => onSelectDay(day.day)}
            disabled={day.day > currentDayNumber}
            className={`
              w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium shadow-sm transition-all
              ${day.day === currentDayNumber ? 'ring-2 ring-indigo-500' : ''}
              ${day.completed 
                ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
              ${day.jokerUsed 
                ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300' 
                : ''}
              ${day.day > currentDayNumber 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:scale-110'}
            `}
            aria-label={`Day ${day.day}`}
          >
            {day.day}
          </button>
        ))}
      </div>
    </div>
  );
} 