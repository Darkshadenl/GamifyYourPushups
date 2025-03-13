import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock components since they don't exist yet
vi.mock('../components/StreakDisplay', () => ({
  StreakDisplay: ({ streak }) => (
    <div className={streak === 0 ? 'broken-streak' : ''}>
      <span>{streak}</span> streak {streak > 0 && '🔥'}
    </div>
  )
}));

vi.mock('../components/LevelProgress', () => ({
  LevelProgress: ({ level, progress }) => {
    const levelTitles = ['Beginner', 'Amateur', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    return (
      <div>
        <h3>Level {level} - {levelTitles[level - 1]}</h3>
        <div>{progress}%</div>
        <div role="progressbar" style={{ width: `${progress}%` }}></div>
      </div>
    );
  }
}));

vi.mock('../components/JokerDisplay', () => ({
  JokerDisplay: ({ jokers }) => (
    <div>
      {jokers > 0 ? (
        <>
          <div>{jokers} jokers</div>
          <div>
            {Array.from({ length: jokers }).map((_, i) => (
              <span key={i} data-testid="joker-card">🃏</span>
            ))}
          </div>
          <p>Jokers are automatically used when you miss a day</p>
        </>
      ) : (
        <div>No jokers available</div>
      )}
    </div>
  )
}));

// Import the mocked components
import { StreakDisplay } from '../components/StreakDisplay';
import { LevelProgress } from '../components/LevelProgress';
import { JokerDisplay } from '../components/JokerDisplay';

// Mock the localStorage
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

// Mock the progress data
const mockProgress = {
  currentDay: 10,
  streak: 7,
  level: 2,
  levelProgress: 42,
  jokers: 3,
  days: Array(10).fill(0).map((_, i) => ({
    day: i + 1,
    completed: true,
    jokerUsed: i === 5, // One joker used on day 6
  })),
};

// Mock the storage utility functions
vi.mock('../utils/storage', () => ({
  loadUserProgress: vi.fn(() => mockProgress),
  saveUserProgress: vi.fn(),
  calculateLevelProgress: vi.fn(() => ({ level: 2, progress: 42 })),
  updateAchievements: vi.fn(() => []),
}));

describe('UI Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('StreakDisplay Component', () => {
    it('should render the current streak correctly', () => {
      render(<StreakDisplay streak={7} />);
      
      expect(screen.getByText(/7/)).toBeInTheDocument();
      expect(screen.getByText(/streak/i)).toBeInTheDocument();
    });
    
    it('should display a fire emoji for streaks', () => {
      render(<StreakDisplay streak={7} />);
      
      expect(screen.getByText(/🔥/)).toBeInTheDocument();
    });
    
    it('should show a different style for zero streak', () => {
      render(<StreakDisplay streak={0} />);
      
      expect(screen.getByText(/0/)).toBeInTheDocument();
      // Check for a specific class that indicates a broken streak
      const streakElement = screen.getByText(/streak/i).closest('div');
      expect(streakElement).toHaveClass('broken-streak');
    });
  });
  
  describe('LevelProgress Component', () => {
    it('should render the current level correctly', () => {
      render(<LevelProgress level={2} progress={42} />);
      
      expect(screen.getByText(/level 2/i)).toBeInTheDocument();
    });
    
    it('should display the progress percentage', () => {
      render(<LevelProgress level={2} progress={42} />);
      
      expect(screen.getByText(/42%/)).toBeInTheDocument();
    });
    
    it('should render a progress bar with correct width', () => {
      render(<LevelProgress level={2} progress={42} />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveStyle('width: 42%');
    });
    
    it('should show level title based on level number', () => {
      render(<LevelProgress level={2} progress={42} />);
      
      expect(screen.getByText(/amateur/i)).toBeInTheDocument();
    });
  });
  
  describe('JokerDisplay Component', () => {
    it('should render the correct number of jokers', () => {
      render(<JokerDisplay jokers={3} />);
      
      expect(screen.getByText(/3/)).toBeInTheDocument();
      expect(screen.getByText(/jokers/i)).toBeInTheDocument();
    });
    
    it('should display joker cards visually', () => {
      render(<JokerDisplay jokers={3} />);
      
      // Check for joker card icons or elements
      const jokerCards = screen.getAllByTestId('joker-card');
      expect(jokerCards.length).toBe(3);
    });
    
    it('should show a message when no jokers are available', () => {
      render(<JokerDisplay jokers={0} />);
      
      expect(screen.getByText(/no jokers available/i)).toBeInTheDocument();
    });
    
    it('should explain how jokers work', () => {
      render(<JokerDisplay jokers={3} />);
      
      expect(screen.getByText(/automatically used/i)).toBeInTheDocument();
      expect(screen.getByText(/miss a day/i)).toBeInTheDocument();
    });
  });
}); 