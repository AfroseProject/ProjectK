module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',

  setupFilesAfterEnv: [
    '<rootDir>/jestSetup.js',
    '@testing-library/jest-native/extend-expect',
  ],

  transformIgnorePatterns: [
    'node_modules/(?!(' +
      [
        '@react-native',
        '@react-native-firebase',
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
