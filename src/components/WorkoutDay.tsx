import React, { useState, useEffect } from 'react';
import { WorkoutDay as WorkoutDayType } from '../types';
import { ProgressBar } from './ProgressBar';

interface WorkoutDayProps {
  day: WorkoutDayType;
  onUpdateCount: (count: number) => void;
  onToggleCompleted: () => void;
  onToggleJoker: () => void;
  onMoveToNext: () => void;
}

/**
 * WorkoutDay component to display and interact with the current day's workout
 */
export function WorkoutDay({ 
  day, 
  onUpdateCount, 
  onToggleCompleted, 
  onToggleJoker, 
  onMoveToNext 
}: WorkoutDayProps) {
  const [inputValue, setInputValue] = useState(day.actual.toString());
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Check if in development mode
  const isDev = import.meta.env.VITE_DEV === 'true';
  
  // Update input value when day changes
  useEffect(() => {
    setInputValue(day.actual.toString());
  }, [day.actual]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setInputValue(value);
      
      // Update count if value is not empty
      if (value !== '') {
        onUpdateCount(parseInt(value, 10));
      } else {
        onUpdateCount(0);
      }
    }
  };
  
  // Handle move to next day with confirmation
  const handleMoveToNext = () => {
    setShowConfirmation(true);
  };
  
  // Confirm move to next day
  const confirmMoveToNext = () => {
    onMoveToNext();
    setShowConfirmation(false);
  };
  
  // Cancel move to next day
  const cancelMoveToNext = () => {
    setShowConfirmation(false);
  };
  
  // Calculate progress percentage
  const progressPercentage = day.target > 0 
    ? Math.min(100, Math.floor((day.actual / day.target) * 100)) 
    : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Day {day.day}</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleJoker}
            className={`text-2xl focus:outline-none p-1 rounded-full transition-all ${
              day.jokerUsed 
                ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            aria-label={day.jokerUsed ? "Remove joker" : "Use joker"}
          >
            {day.jokerUsed ? '⭕' : '❌'}
          </button>
          
          <div className="flex flex-col items-end">
            <label className="flex items-center cursor-pointer" title="Unchecking will reset your pushup count to 0">
              <input
                type="checkbox"
                className="sr-only"
                checked={day.completed}
                onChange={onToggleCompleted}
                disabled={day.jokerUsed}
              />
              <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all ${
                day.completed 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white' 
                  : 'border-gray-300 hover:border-indigo-400'
              }`}>
                {day.completed && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">Target: {day.target} push-ups</div>
        <ProgressBar progress={progressPercentage} color="bg-green-500" />
      </div>
      
      <div className="mb-6">
        <label htmlFor="pushupCount" className="block text-sm font-medium text-gray-700 mb-1">
          Today's Push-ups
        </label>
        <div className="flex items-center">
          <input
            id="pushupCount"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={handleInputChange}
            disabled={day.jokerUsed}
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 ${
              day.jokerUsed ? 'bg-gray-100 text-gray-500' : 'bg-white'
            }`}
          />
        </div>
      </div>
      
      {isDev && day.completed && !showConfirmation && (
        <div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-2 text-xs text-yellow-800">
            <div className="flex items-center">
              <span className="text-lg mr-2">⚠️</span>
              <p>Developer Mode: Next Day button is visible</p>
            </div>
          </div>
          <button
            onClick={handleMoveToNext}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md"
          >
            Complete Day & Move to Next Day
          </button>
        </div>
      )}
      
      {showConfirmation && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md shadow-sm">
          <p className="text-sm text-yellow-800 mb-3">
            Are you sure you want to complete this day and move to the next? This action will finalize your progress for today and cannot be undone.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={confirmMoveToNext}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-md hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-sm"
            >
              Yes, Complete Day
            </button>
            <button
              onClick={cancelMoveToNext}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {day.jokerUsed && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-800 shadow-sm">
          <div className="flex items-center">
            <span className="text-2xl mr-2">😴</span>
            <p>You've used a joker for today. Take a rest and come back stronger tomorrow!</p>
          </div>
        </div>
      )}
    </div>
  );
} 