import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Mock notifications
class NotificationMock {
  static permission = 'granted';
  static requestPermission = vi.fn().mockResolvedValue('granted');

  constructor(title, options) {
    this.title = title;
    this.options = options;
  }
}

// Set up mocks before tests
beforeAll(() => {
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  
  // Mock Notification API
  global.Notification = NotificationMock;
  
  // Mock Date for consistent testing
  const mockDate = new Date('2023-01-01T12:00:00Z');
  vi.spyOn(global, 'Date').mockImplementation(() => mockDate);
});

// Clean up after each test
afterEach(() => {
  // Clear localStorage
  window.localStorage.clear();
  
  // Reset mocks
  vi.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  vi.restoreAllMocks();
}); 