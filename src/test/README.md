# Workout App Testing Suite

This directory contains automated tests for the Workout App, focusing on streak management, joker functionality, level progression, and UI components.

## Test Structure

The test suite is organized into the following files:

- **streak-management.test.js**: Tests for the streak tracking functionality
- **joker-functionality.test.js**: Tests for joker usage and management
- **level-achievements.test.js**: Tests for level progression and achievements
- **ui-components.test.jsx**: Tests for React UI components
- **integration.test.js**: Integration tests for how different features work together

## Running Tests

You can run the tests using the following npm scripts:

```bash
# Run all tests once
npm test

# Run tests in watch mode (automatically re-runs when files change)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests with custom runner (prettier output)
npm run test:runner
```

## Test Coverage

The tests cover the following key aspects of the app:

### Streak Management
- Streak initialization
- Streak incrementation
- Streak reset when days are missed
- Date handling for streak calculations

### Joker Functionality
- Using jokers to maintain streaks
- Automatic joker usage when days are missed
- Joker rewards for completing streaks
- Joker limits and management

### Level & Achievements
- Level progression based on completed days
- Level progress calculation
- Achievement unlocking based on milestones
- Level maintenance when streaks are broken

### UI Components
- Streak display rendering
- Level progress visualization
- Joker display and explanation
- Component styling and responsiveness

## Adding New Tests

When adding new tests:

1. Create a new test file or add to an existing one based on the feature
2. Follow the existing patterns for mocking dependencies
3. Use descriptive test names that explain the expected behavior
4. Group related tests using `describe` blocks
5. Keep tests focused and isolated

## Mocking Strategy

The tests use the following mocking approach:

- **localStorage**: Mocked to avoid actual browser storage
- **Date**: Mocked to control time-based functionality
- **Storage Functions**: Mocked to isolate components from storage logic
- **React Components**: Tested with React Testing Library

## Troubleshooting

If tests are failing:

1. Check that the mocks are properly set up
2. Verify that the test environment is correctly configured
3. Ensure that the code being tested is properly imported
4. Look for timing issues with async tests
5. Check for DOM-related issues in component tests 