module.exports = {
  __esModule: true,
  default: () => ({
    initializeAppCheck: jest.fn(),
    getToken: jest.fn(() => Promise.resolve({ token: 'mock-token' })),
  }),
};