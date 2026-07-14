module.exports = {
  __esModule: true,
  default: () => ({
    log: jest.fn(),
    recordError: jest.fn(),
    setUserId: jest.fn(),
    crash: jest.fn(),
  }),
};