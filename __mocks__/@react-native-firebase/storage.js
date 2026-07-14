module.exports = {
  __esModule: true,
  default: () => ({
    ref: jest.fn(() => ({
      putFile: jest.fn(() => Promise.resolve()),
      getDownloadURL: jest.fn(() => Promise.resolve('https://mock-url.com/image.jpg')),
    })),
  }),
};