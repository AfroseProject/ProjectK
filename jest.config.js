module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',

  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-native-firebase|@react-navigation|react-native-safe-area-context|@shopify/flash-list|react-native-maps)/)',
  ],

  setupFilesAfterEnv: [
    '<rootDir>/jestSetup.js',
    '@testing-library/jest-native/extend-expect',
  ],
};