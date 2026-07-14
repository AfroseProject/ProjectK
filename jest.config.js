module.exports = {
  preset: 'react-native',

  testEnvironment: 'node',

  setupFilesAfterEnv: [
    '<rootDir>/jestSetup.js',
    '@testing-library/jest-native/extend-expect',
  ],

  moduleNameMapper: {
    '^@react-native-firebase/(.*)$':
      '<rootDir>/__mocks__/@react-native-firebase/$1.js',
  },

  transformIgnorePatterns: [
    'node_modules/(?!(' +
      [
        '@react-native',
        '@react-navigation',
        'react-native',
        'react-native-safe-area-context',
        'react-native-screens',
        'react-native-gesture-handler',
        '@shopify/flash-list',
      ].join('|') +
    ')/)',
  ],
};
