import React from 'react';
import { Achievement as AchievementType } from '../types';

interface AchievementsProps {
  achievements: AchievementType[];
  newlyUnlocked: AchievementType | null;
}

/**
 * Achievements component to display achievement badges
 */
export function Achievements({ achievements, newlyUnlocked }: AchievementsProps) {
  const unlockedAchievements = achievements.filter(achievement => achievement.unlocked);
  const lockedAchievements = achievements.filter(achievement => !achievement.unlocked);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="text-2xl mr-2">🏆</span>
        Achievements
      </h2>
      
      {newlyUnlocked && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 animate-pulse shadow-sm">
          <div className="flex items-center">
            <span className="text-3xl mr-3">{newlyUnlocked.icon}</span>
            <div>
              <p className="font-bold text-base">{newlyUnlocked.name} Unlocked!</p>
              <p>{newlyUnlocked.description}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        {unlockedAchievements.map(achievement => (
          <div 
            key={achievement.id}
            className="border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 rounded-md p-3 flex items-center shadow-sm transition-transform hover:scale-105"
          >
            <span className="text-3xl mr-3">{achievement.icon}</span>
            <div>
              <p className="font-semibold text-sm">{achievement.name}</p>
              <p className="text-xs text-gray-600">{achievement.description}</p>
            </div>
          </div>
        ))}
        
        {lockedAchievements.map(achievement => (
          <div 
            key={achievement.id}
            className="border border-gray-200 bg-gray-50 rounded-md p-3 flex items-center opacity-60 shadow-sm"
          >
            <span className="text-3xl mr-3 grayscale">{achievement.icon}</span>
            <div>
              <p className="font-semibold text-sm">{achievement.name}</p>
              <p className="text-xs text-gray-600">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 