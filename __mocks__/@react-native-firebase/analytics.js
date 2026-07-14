module.exports = {
  __esModule: true,
  default: () => ({
    logEvent: jest.fn(() => Promise.resolve()),
    setUserId: jest.fn(() => Promise.resolve()),
  }),
};