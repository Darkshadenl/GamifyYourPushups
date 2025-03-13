#!/usr/bin/env node

/**
 * Test runner script for the workout app
 * 
 * This script runs all the tests and provides a detailed report of the results.
 * It can be run with `node src/test/run-tests.js` or via npm script.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Print header
console.log(`\n${colors.bright}${colors.cyan}=== Workout App Test Runner ===${colors.reset}\n`);
console.log(`${colors.dim}Running tests at ${new Date().toLocaleString()}${colors.reset}\n`);

// Get all test files
const testDir = path.join(__dirname);
const testFiles = fs.readdirSync(testDir)
  .filter(file => file.endsWith('.test.js') || file.endsWith('.test.jsx'))
  .map(file => path.join(testDir, file));

console.log(`${colors.yellow}Found ${testFiles.length} test files:${colors.reset}`);
testFiles.forEach(file => {
  console.log(`  - ${path.basename(file)}`);
});
console.log('');

// Run tests
let hasErrors = false;

try {
  console.log(`${colors.bright}${colors.green}Running all tests...${colors.reset}\n`);
  
  // Run Vitest with the --reporter verbose flag for detailed output
  const result = execSync('npx vitest run --reporter verbose', { 
    stdio: 'inherit',
    encoding: 'utf-8'
  });
  
  console.log(`\n${colors.bright}${colors.green}✓ All tests completed successfully!${colors.reset}\n`);
} catch (error) {
  console.error(`\n${colors.bright}${colors.red}✗ Some tests failed!${colors.reset}\n`);
  hasErrors = true;
}

// Print footer with helpful information
console.log(`${colors.dim}─────────────────────────────────────────────${colors.reset}`);
console.log(`${colors.cyan}Test Commands:${colors.reset}`);
console.log(`  • Run all tests: ${colors.green}npm test${colors.reset}`);
console.log(`  • Run with watch mode: ${colors.green}npx vitest${colors.reset}`);
console.log(`  • Run a specific test file: ${colors.green}npx vitest src/test/streak-management.test.js${colors.reset}`);
console.log(`  • Run with UI: ${colors.green}npx vitest --ui${colors.reset}`);
console.log(`${colors.dim}─────────────────────────────────────────────${colors.reset}\n`);

// Exit with appropriate code
process.exit(hasErrors ? 1 : 0); 