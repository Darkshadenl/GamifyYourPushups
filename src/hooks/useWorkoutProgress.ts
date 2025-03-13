import { useState, useEffect } from 'react';
import { 
  UserProgress, 
  WorkoutDay, 
  Achievement
} from '../types';
import { 
  calculateLevelProgress, 
  loadUserProgress, 
  saveUserProgress, 
  updateAchievements,
  getNextDay
} from '../utils/storage';
import { notificationService } from '../utils/notifications';

/**
 * Custom hook to manage workout progress state
 */
export function useWorkoutProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [currentDay, setCurrentDay] = useState<WorkoutDay | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);

  // Load initial data and check for date changes
  useEffect(() => {
    const loadedProgress = loadUserProgress();
    
    // Check if we need to move to the next day based on date
    if (loadedProgress.days.length > 0) {
      const currentDayData = loadedProgress.days.find(day => day.day === loadedProgress.currentDay);
      
      if (currentDayData) {
        const currentDayDate = new Date(currentDayData.date);
        const today = new Date();
        
        // Reset time part for comparison
        currentDayDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        // Calculate days difference
        const daysDifference = Math.floor((today.getTime() - currentDayDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // If the date has changed
        if (daysDifference > 0) {
          // Case 1: Current day is completed - move to next day normally
          if (currentDayData.completed) {
            const nextDayData = getNextDay(loadedProgress);
            nextDayData.date = today.toISOString().split('T')[0]; // Set today's date
            
            const updatedDays = [...loadedProgress.days, nextDayData];
            loadedProgress.currentDay = nextDayData.day;
            loadedProgress.days = updatedDays;
            
            saveUserProgress(loadedProgress);
            
            // Check for new achievements when automatically moving to next day
            const updatedAchievements = updateAchievements(loadedProgress);
            setAchievements(updatedAchievements);
          } 
          // Case 2: Current day is not completed - check if we can use a joker
          else {
            // Count available jokers (days where joker is not used)
            const availableJokers = loadedProgress.days.filter(day => 
              day.completed && !day.jokerUsed
            ).length;
            
            if (availableJokers > 0) {
              // Use a joker on the earliest completed day that hasn't used a joker
              const jokerDay = loadedProgress.days.find(day => 
                day.completed && !day.jokerUsed
              );
              
              if (jokerDay) {
                // Mark the joker as used
                jokerDay.jokerUsed = true;
                
                // Mark the current day as completed with joker
                currentDayData.completed = true;
                currentDayData.jokerUsed = true;
                
                // Move to next day
                const nextDayData = getNextDay(loadedProgress);
                nextDayData.date = today.toISOString().split('T')[0]; // Set today's date
                
                const updatedDays = [...loadedProgress.days, nextDayData];
                loadedProgress.currentDay = nextDayData.day;
                loadedProgress.days = updatedDays;
                
                // Send notification about using a joker
                notificationService.sendCustomNotification(
                  'Streak Saved! 🃏',
                  {
                    body: 'We used one of your streak charges to maintain your streak.',
                    requireInteraction: true
                  }
                );
              }
            } else {
              // No jokers available - reset streak and level progress
              loadedProgress.streak = 0;
              loadedProgress.levelProgress = 0;
              
              // Keep the level the same
              // But update the current day to be today's date
              currentDayData.date = today.toISOString().split('T')[0];
              
              // Send notification about streak reset
              notificationService.sendCustomNotification(
                'Streak Reset 😢',
                {
                  body: 'Your streak has been reset because you missed a day and had no streak charges left.',
                  requireInteraction: true
                }
              );
            }
            
            saveUserProgress(loadedProgress);
            
            // Update achievements after streak changes
            const updatedAchievements = updateAchievements(loadedProgress);
            setAchievements(updatedAchievements);
          }
          
          // Get current day after potential update
          const updatedCurrentDay = loadedProgress.days.find(day => day.day === loadedProgress.currentDay);
          setCurrentDay(updatedCurrentDay || null);
        } else {
          // Just load achievements without checking for new ones
          const currentAchievements = updateAchievements(loadedProgress);
          setAchievements(currentAchievements);
          
          // Set current day
          setCurrentDay(currentDayData);
        }
      }
    }
    
    setProgress(loadedProgress);
  }, []);

  /**
   * Update the number of push-ups completed for the current day
   */
  const updatePushupCount = (count: number) => {
    if (!currentDay) return;
    
    const updatedDay = { ...currentDay, actual: count };
    
    // Auto-check completed if count meets or exceeds target
    if (count >= updatedDay.target && !updatedDay.jokerUsed) {
      updatedDay.completed = true;
    } else if (count < updatedDay.target) {
      updatedDay.completed = false;
    }
    
    // Update the current day
    setCurrentDay(updatedDay);
    
    // Update the progress state
    const updatedDays = progress.days.map(day => 
      day.day === updatedDay.day ? updatedDay : day
    );
    
    const updatedProgress = { ...progress, days: updatedDays };
    
    // Update streak if completion status changed
    if (updatedDay.completed !== currentDay.completed) {
      if (updatedDay.completed) {
        updatedProgress.streak = progress.streak + 1;
      } else {
        // If unchecking, reduce streak
        updatedProgress.streak = Math.max(0, progress.streak - 1);
      }
      
      // Update level progress
      const completedDays = updatedProgress.days.filter(day => day.completed).length;
      const { level, progress: levelProgress } = calculateLevelProgress(completedDays);
      updatedProgress.level = level;
      updatedProgress.levelProgress = levelProgress;
    }
    
    setProgress(updatedProgress);
    saveUserProgress(updatedProgress);
    
    // No longer check for achievements here
  };

  /**
   * Toggle the completion status of the current day
   */
  const toggleDayCompleted = () => {
    if (!currentDay || currentDay.jokerUsed) return;
    
    const updatedDay = { 
      ...currentDay, 
      completed: !currentDay.completed,
      // If completing, set to target value; if uncompleting, reset to 0
      actual: !currentDay.completed ? Math.max(currentDay.actual, currentDay.target) : 0
    };
    
    setCurrentDay(updatedDay);
    
    // Update the progress state
    const updatedDays = progress.days.map(day => 
      day.day === updatedDay.day ? updatedDay : day
    );
    
    const updatedProgress = { ...progress, days: updatedDays };
    
    // Update streak if day is completed
    if (updatedDay.completed) {
      updatedProgress.streak = progress.streak + 1;
    } else {
      // If unchecking, reduce streak
      updatedProgress.streak = Math.max(0, progress.streak - 1);
    }
    
    // Update level progress
    const completedDays = updatedProgress.days.filter(day => day.completed).length;
    const { level, progress: levelProgress } = calculateLevelProgress(completedDays);
    updatedProgress.level = level;
    updatedProgress.levelProgress = levelProgress;
    
    setProgress(updatedProgress);
    saveUserProgress(updatedProgress);
    
    // No longer check for achievements here
  };

  /**
   * Toggle the joker usage for the current day
   */
  const toggleJoker = () => {
    if (!currentDay) return;
    
    const updatedDay = { 
      ...currentDay, 
      jokerUsed: !currentDay.jokerUsed,
      // When using a joker, mark the day as completed to maintain streak
      // When removing a joker, reset completion status
      completed: !currentDay.jokerUsed ? true : false,
      actual: currentDay.jokerUsed ? currentDay.actual : 0
    };
    
    setCurrentDay(updatedDay);
    
    // Update the progress state
    const updatedDays = progress.days.map(day => 
      day.day === updatedDay.day ? updatedDay : day
    );
    
    const updatedProgress = { ...progress, days: updatedDays };
    
    // Update streak if joker usage changed
    if (updatedDay.jokerUsed !== currentDay.jokerUsed) {
      if (updatedDay.jokerUsed) {
        // Using a joker maintains the streak
        // No need to change streak count
      } else {
        // Removing a joker might break the streak if the day is not completed
        if (!updatedDay.completed) {
          updatedProgress.streak = Math.max(0, progress.streak - 1);
        }
      }
    }
    
    setProgress(updatedProgress);
    saveUserProgress(updatedProgress);
  };

  /**
   * Move to the next day in the workout program
   */
  const moveToNextDay = () => {
    if (!currentDay || !currentDay.completed) return;
    
    const nextDayData = getNextDay(progress);
    
    // Add the next day to the progress
    const updatedDays = [...progress.days, nextDayData];
    
    const updatedProgress = { 
      ...progress, 
      currentDay: nextDayData.day,
      days: updatedDays
    };
    
    setProgress(updatedProgress);
    setCurrentDay(nextDayData);
    saveUserProgress(updatedProgress);
    
    // Send a notification for completing a day
    notificationService.sendCustomNotification(
      'Day Completed! 🎉',
      {
        body: `Great job completing Day ${currentDay.day}! You've done ${currentDay.actual} push-ups today.`,
        requireInteraction: true
      }
    );
    
    // Only check for new achievements when moving to the next day
    checkForNewAchievements(updatedProgress);
  };

  /**
   * Navigate to a specific day
   */
  const navigateToDay = (dayNumber: number) => {
    // Only allow navigation to days that exist in the progress
    const dayExists = progress.days.some(day => day.day === dayNumber);
    if (!dayExists || dayNumber > progress.currentDay) return;
    
    const dayData = progress.days.find(day => day.day === dayNumber);
    if (dayData) {
      setCurrentDay(dayData);
    }
  };

  /**
   * Check for newly unlocked achievements
   */
  const checkForNewAchievements = (updatedProgress: UserProgress) => {
    const previousAchievements = achievements;
    const newAchievements = updateAchievements(updatedProgress);
    
    // Find newly unlocked achievements
    const newlyUnlocked = newAchievements.find((achievement, index) => 
      achievement.unlocked && !previousAchievements[index].unlocked
    );
    
    if (newlyUnlocked) {
      setNewlyUnlockedAchievement(newlyUnlocked);
      // Clear the notification after 5 seconds
      setTimeout(() => {
        setNewlyUnlockedAchievement(null);
      }, 5000);
    }
    
    setAchievements(newAchievements);
  };

  return {
    progress,
    currentDay,
    achievements,
    newlyUnlockedAchievement,
    updatePushupCount,
    toggleDayCompleted,
    toggleJoker,
    moveToNextDay,
    navigateToDay
  };
} 