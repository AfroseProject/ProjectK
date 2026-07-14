module.exports = {
  __esModule: true,
  default: () => ({
    currentUser: { uid: 'test-user-id' },
    signInAnonymously: jest.fn(() => Promise.resolve({ user: { uid: 'test-user-id' } })),
    signOut: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn((cb) => { cb({ uid: 'test-user-id' }); return () => {}; }),
  }),
};