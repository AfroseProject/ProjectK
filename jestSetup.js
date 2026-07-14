jest.mock('@react-native-firebase/app');
jest.mock('@react-native-firebase/auth');
jest.mock('@react-native-firebase/firestore');
jest.mock('@react-native-firebase/functions');
jest.mock('@react-native-firebase/storage');
jest.mock('@react-native-firebase/analytics');
jest.mock('@react-native-firebase/crashlytics');
jest.mock('@react-native-firebase/app-check');

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  class MockMapView extends React.Component {
    render() {
      return <View testID="MockMapView" {...this.props} />;
    }
  }
  return {
    __esModule: true,
    default: MockMapView,
    Marker: (props) => <View testID="MockMarker" {...props} />,
  };
});
