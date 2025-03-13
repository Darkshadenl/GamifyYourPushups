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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Day {day.day}</h2>
        <div className="flex space-x-2">
          <button
            onClick={onToggleJoker}
            className={`p-2 rounded-md ${day.jokerUsed
                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            aria-label={day.jokerUsed ? 'Remove joker' : 'Use joker'}
            title={day.jokerUsed ? 'Remove joker' : 'Use joker'}
          >
            <span className="text-xl">🃏</span>
          </button>
          <button
            onClick={onToggleCompleted}
            disabled={day.jokerUsed}
            className={`p-2 rounded-md ${day.completed
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } ${day.jokerUsed ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={day.completed ? 'Mark as incomplete' : 'Mark as complete'}
            title={day.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <span className="text-xl">{day.completed ? '✅' : '❌'}</span>
          </button>
        </div>
      </div>

      {day.jokerUsed && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
          <div className="flex items-start">
            <span className="text-xl mr-2">🃏</span>
            <div>
              <p className="font-medium">Streak Charge Used</p>
              <p>You've used a streak charge for this day. This maintains your streak without completing the pushups.</p>
            </div>
          </div>
        </div>
      )}

      {!day.jokerUsed && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
          <div className="flex items-start">
            <span className="text-xl mr-2">ℹ️</span>
            <div>
              <p className="font-medium">About Streak Charges</p>
              <p>Each completed day gives you one streak charge. If you miss a day, a charge will be automatically used to maintain your streak.</p>
            </div>
          </div>
        </div>
      )}

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
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 ${day.jokerUsed ? 'bg-gray-100 text-gray-500' : 'bg-white'
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
    </div>
  );
} 