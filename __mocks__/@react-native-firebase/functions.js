module.exports = {
  __esModule: true,
  default: () => ({
    httpsCallable: jest.fn(() => () => Promise.resolve({ data: {} })),
  }),
};