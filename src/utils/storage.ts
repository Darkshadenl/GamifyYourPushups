import { UserProgress, WorkoutDay, workoutSchema, levelThresholds, achievements, Achievement } from '../types';

const STORAGE_KEY = 'pushup-journey-data';

/**
 * Initialize a new user progress object
 */
function initializeUserProgress(): UserProgress {
  const today = new Date().toISOString().split('T')[0];
  
  return {
    currentDay: 1,
    streak: 0,
    level: 1,
    levelProgress: 0,
    days: [
      {
        day: 1,
        target: workoutSchema[0],
        completed: false,
        actual: 0,
        jokerUsed: false,
        date: today
      }
    ]
  };
}

/**
 * Load user progress from local storage
 */
export function loadUserProgress(): UserProgress {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const newProgress = initializeUserProgress();
      saveUserProgress(newProgress);
      return newProgress;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading user progress:', error);
    const newProgress = initializeUserProgress();
    saveUserProgress(newProgress);
    return newProgress;
  }
}

/**
 * Save user progress to local storage
 */
export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
}

/**
 * Export user progress as a JSON file
 */
export function exportUserProgress(): void {
  try {
    const progress = loadUserProgress();
    const dataStr = JSON.stringify(progress, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `pushup-journey-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Error exporting user progress:', error);
  }
}

/**
 * Import user progress from a JSON file
 */
export function importUserProgress(jsonData: string): boolean {
  try {
    const progress = JSON.parse(jsonData) as UserProgress;
    
    // Validate the imported data has the expected structure
    if (!progress.currentDay || !Array.isArray(progress.days)) {
      throw new Error('Invalid data format');
    }
    
    saveUserProgress(progress);
    return true;
  } catch (error) {
    console.error('Error importing user progress:', error);
    return false;
  }
}

/**
 * Calculate level and progress based on completed days
 */
export function calculateLevelProgress(completedDays: number): { level: number; progress: number } {
  let level = 1;
  
  for (let i = 1; i < levelThresholds.length; i++) {
    if (completedDays >= levelThresholds[i]) {
      level = i + 1;
    }
  }
  
  const currentLevelStart = levelThresholds[level - 1];
  const nextLevelStart = level < levelThresholds.length ? levelThresholds[level] : workoutSchema.length;
  const daysInLevel = nextLevelStart - currentLevelStart;
  const daysCompleted = completedDays - currentLevelStart;
  
  const progress = Math.min(100, Math.floor((daysCompleted / daysInLevel) * 100));
  
  return { level, progress };
}

/**
 * Check and update achievements based on current progress
 */
export function updateAchievements(progress: UserProgress): Achievement[] {
  const updatedAchievements = [...achievements];
  const completedDays = progress.days.filter(day => day.completed).length;
  
  // First day achievement
  if (completedDays >= 1) {
    updatedAchievements[0].unlocked = true;
  }
  
  // Weekly warrior achievement
  if (progress.streak >= 7) {
    updatedAchievements[1].unlocked = true;
  }
  
  // Level up achievement
  if (progress.level >= 2) {
    updatedAchievements[2].unlocked = true;
  }
  
  // Halfway there achievement
  if (completedDays >= 25) {
    updatedAchievements[3].unlocked = true;
  }
  
  // Perfect week achievement - only check when we have at least 7 days completed
  if (completedDays >= 7) {
    const hasWeekWithoutJokers = checkForWeekWithoutJokers(progress.days);
    if (hasWeekWithoutJokers) {
      updatedAchievements[4].unlocked = true;
    }
  }
  
  // Master achievement
  if (progress.level >= 5) {
    updatedAchievements[5].unlocked = true;
  }
  
  return updatedAchievements;
}

/**
 * Check if there's a week without jokers used
 */
function checkForWeekWithoutJokers(days: WorkoutDay[]): boolean {
  if (days.length < 7) return false;
  
  for (let i = 0; i <= days.length - 7; i++) {
    const weekDays = days.slice(i, i + 7);
    const allCompleted = weekDays.every(day => day.completed);
    const noJokersUsed = weekDays.every(day => !day.jokerUsed);
    
    if (allCompleted && noJokersUsed) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get the next day's workout
 */
export function getNextDay(progress: UserProgress): WorkoutDay {
  const nextDayNumber = progress.currentDay + 1;
  
  if (nextDayNumber > workoutSchema.length) {
    // If we've completed the program, loop back or maintain the last target
    return {
      day: nextDayNumber,
      target: workoutSchema[workoutSchema.length - 1],
      completed: false,
      actual: 0,
      jokerUsed: false,
      date: new Date().toISOString().split('T')[0]
    };
  }
  
  return {
    day: nextDayNumber,
    target: workoutSchema[nextDayNumber - 1],
    completed: false,
    actual: 0,
    jokerUsed: false,
    date: new Date().toISOString().split('T')[0]
  };
} 