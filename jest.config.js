module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',

  transformIgnorePatterns: [
    'node_modules/(?!(' +
      [
        '@react-native',
        '@react-navigation',
        'react-native',
        'react-native-safe-area-context',
        'react-native-screens',
        'react-native-gesture-handler',
      ].join('|') +
      ')/)',
  ],

  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
  ],
};