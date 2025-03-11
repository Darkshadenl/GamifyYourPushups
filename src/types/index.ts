export interface WorkoutDay {
  day: number;
  target: number;
  completed: boolean;
  actual: number;
  jokerUsed: boolean;
  date: string; // ISO string format
}

export interface UserProgress {
  currentDay: number;
  streak: number;
  level: number;
  levelProgress: number;
  days: WorkoutDay[];
}

export enum Level {
  Beginner = 1,
  Amateur = 2,
  Intermediate = 3,
  Advanced = 4,
  Master = 5
}

export const LevelNames: Record<number, string> = {
  1: 'Beginner',
  2: 'Amateur',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Master'
};

// Define the workout schema with progressive targets
export const workoutSchema: number[] = [
  5, 6, 7, 8, 9,           // Week 1
  10, 12, 14, 16, 18,      // Week 2
  20, 22, 24, 26, 28,      // Week 3
  30, 32, 34, 36, 38,      // Week 4
  40, 42, 44, 46, 48,      // Week 5
  50, 52, 54, 56, 58,      // Week 6
  60, 62, 64, 66, 68,      // Week 7
  70, 72, 74, 76, 78,      // Week 8
  80, 85, 90, 95, 100      // Week 9
];

// Define level thresholds (day numbers)
export const levelThresholds: number[] = [1, 10, 20, 30, 40];

// Define achievements
export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export const achievements: Achievement[] = [
  {
    id: 'first_day',
    name: 'First Step',
    description: 'Complete your first day',
    unlocked: false,
    icon: '🥇'
  },
  {
    id: 'week_streak',
    name: 'Weekly Warrior',
    description: 'Complete 7 days in a row',
    unlocked: false,
    icon: '🔥'
  },
  {
    id: 'level_up',
    name: 'Level Up',
    description: 'Reach Amateur level',
    unlocked: false,
    icon: '⬆️'
  },
  {
    id: 'halfway',
    name: 'Halfway There',
    description: 'Complete 25 days',
    unlocked: false,
    icon: '🏃'
  },
  {
    id: 'no_joker',
    name: 'Perfect Week',
    description: 'Complete a week without using jokers',
    unlocked: false,
    icon: '✨'
  },
  {
    id: 'master',
    name: 'Push-up Master',
    description: 'Reach Master level',
    unlocked: false,
    icon: '👑'
  }
]; 