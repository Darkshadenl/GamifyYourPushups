import React from 'react';
import { Header } from './components/Header';
import { WorkoutDay } from './components/WorkoutDay';
import { ProgressBar } from './components/ProgressBar';
import { Achievements } from './components/Achievements';
import { DayHistory } from './components/DayHistory';
import { DataManagement } from './components/DataManagement';
import { useWorkoutProgress } from './hooks/useWorkoutProgress';

function App() {
  const {
    progress,
    currentDay,
    achievements,
    newlyUnlockedAchievement,
    updatePushupCount,
    toggleDayCompleted,
    toggleJoker,
    moveToNextDay,
    navigateToDay
  } = useWorkoutProgress();

  // Check if in development mode
  const isDev = import.meta.env.VITE_DEV === 'true';

  // Handle data import refresh
  const handleDataImported = () => {
    // Force a page reload to refresh all data
    window.location.reload();
  };

  // Handle data reset
  const handleDataReset = () => {
    // Force a page reload to initialize fresh data
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-10">
      <Header streak={progress.streak} level={progress.level} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="text-xl mr-2">📈</span>
              Level Progress
            </h2>
            <span className="text-sm font-medium text-gray-600">
              Level {progress.level}
            </span>
          </div>
          <ProgressBar 
            progress={progress.levelProgress} 
            color="bg-gradient-to-r from-indigo-500 to-purple-500" 
          />
        </div>
        
        {currentDay && (
          <WorkoutDay 
            day={currentDay}
            onUpdateCount={updatePushupCount}
            onToggleCompleted={toggleDayCompleted}
            onToggleJoker={toggleJoker}
            onMoveToNext={moveToNextDay}
          />
        )}
        
        {!isDev && currentDay?.completed && (
          <div className="max-w-md mx-auto mt-4 mb-2 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 shadow-sm">
            <div className="flex items-center">
              <span className="text-xl mr-2">🕒</span>
              <p>
                <strong>Note:</strong> Your progress will automatically move to the next day when the date changes. Come back tomorrow to continue your journey!
              </p>
            </div>
          </div>
        )}
        
        <div className="max-w-md mx-auto mt-4 mb-2 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 shadow-sm">
          <div className="flex items-center">
            <span className="text-xl mr-2">ℹ️</span>
            <p>
              <strong>Note:</strong> Achievements are only awarded when you complete a day and move to the next one.
            </p>
          </div>
        </div>
        
        <Achievements 
          achievements={achievements} 
          newlyUnlocked={newlyUnlockedAchievement} 
        />
        
        <DayHistory 
          days={progress.days}
          currentDayNumber={progress.currentDay}
          onSelectDay={navigateToDay}
        />
        
        <DataManagement 
          onDataImported={handleDataImported} 
          onDataReset={handleDataReset}
        />
      </main>
    </div>
  );
}

export default App; 