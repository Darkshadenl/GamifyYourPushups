import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { 
  loadUserProgress, 
  saveUserProgress, 
  calculateLevelProgress,
  updateAchievements
} from '../utils/storage';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    key: vi.fn((index) => Object.keys(store)[index] || null),
    length: vi.fn(() => Object.keys(store).length),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock the achievements array
vi.mock('../types', () => ({
  levelThresholds: [0, 7, 14, 30, 60, 100],
  workoutSchema: Array(100).fill(0).map((_, i) => 10 + i * 2),
  achievements: [
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
    }
  ]
}));

describe('Storage Utility Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Progress Management', () => {
    it('should get progress from localStorage', () => {
      const progress = {
        currentDay: 5,
        streak: 5,
        level: 2,
        levelProgress: 42,
        jokers: 1,
        days: Array(5).fill(0).map((_, i) => ({
          day: i + 1,
          completed: true,
          jokerUsed: false
        })),
        lastUpdated: new Date().toISOString()
      };
      
      // Set up localStorage with test data
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(progress));
      
      const result = loadUserProgress();
      
      expect(result).toEqual(progress);
      expect(localStorageMock.getItem).toHaveBeenCalled();
    });
    
    it('should save progress to localStorage', () => {
      const progress = {
        currentDay: 5,
        streak: 5,
        level: 2,
        levelProgress: 42,
        jokers: 1,
        days: Array(5).fill(0).map((_, i) => ({
          day: i + 1,
          completed: true,
          jokerUsed: false
        })),
        lastUpdated: new Date().toISOString()
      };
      
      saveUserProgress(progress);
      
      expect(localStorageMock.setItem).toHaveBeenCalled();
      
      // Verify the saved data
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData).toEqual(progress);
    });
    
    it('should initialize progress if not found in localStorage', () => {
      // Mock localStorage to return null (no existing progress)
      localStorageMock.getItem.mockReturnValueOnce(null);
      
      const result = loadUserProgress();
      
      expect(result).toEqual({
        currentDay: 1,
        streak: 0,
        level: 1,
        levelProgress: 0,
        days: [expect.objectContaining({
          day: 1,
          completed: false,
          jokerUsed: false
        })],
      });
    });
  });
  
  describe('Level Progress Calculation', () => {
    it('should calculate level 1 progress correctly', () => {
      const completedDays = 3;
      
      const result = calculateLevelProgress(completedDays);
      
      expect(result.level).toBe(1);
      expect(result.progress).toBeGreaterThan(0);
      expect(result.progress).toBeLessThan(100);
    });
    
    it('should calculate exact level thresholds correctly', () => {
      // Test exact threshold values
      expect(calculateLevelProgress(0).level).toBe(1);
      expect(calculateLevelProgress(7).level).toBe(2);
      expect(calculateLevelProgress(14).level).toBe(3);
      expect(calculateLevelProgress(30).level).toBe(4);
      expect(calculateLevelProgress(60).level).toBe(5);
      expect(calculateLevelProgress(100).level).toBe(6);
    });
    
    it('should handle progress for maximum level', () => {
      const result = calculateLevelProgress(120);
      
      expect(result.level).toBe(6); // Assuming 6 is max level
      expect(result.progress).toBe(100); // Should be capped at 100%
    });
  });
  
  describe('Achievement Management', () => {
    it('should update achievements based on progress', () => {
      const progress = {
        currentDay: 7,
        streak: 7,
        level: 2,
        levelProgress: 0,
        days: Array(7).fill(0).map((_, i) => ({
          day: i + 1,
          completed: true,
          jokerUsed: false
        }))
      };
      
      const updatedAchievements = updateAchievements(progress);
      
      // First day achievement should be unlocked
      expect(updatedAchievements[0].unlocked).toBe(true);
      
      // Weekly warrior achievement should be unlocked (7-day streak)
      expect(updatedAchievements[1].unlocked).toBe(true);
    });
  });
}); 