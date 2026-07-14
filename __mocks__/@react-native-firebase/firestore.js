module.exports = {
  __esModule: true,
  default: () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({}) })),
        set: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve()),
        delete: jest.fn(() => Promise.resolve()),
      })),
      add: jest.fn(() => Promise.resolve({ id: 'test-doc-id' })),
    })),
  }),
  FieldValue: {
    arrayUnion: jest.fn(),
    arrayRemove: jest.fn(),
    serverTimestamp: jest.fn(),
  },
};