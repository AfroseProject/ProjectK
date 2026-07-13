import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useNetworkStore } from './src/store/networkStore';

function App(): React.JSX.Element {
  const initNetworkListener = useNetworkStore((state) => state.initNetworkListener);

  useEffect(() => {
    const unsubscribe = initNetworkListener();
    return () => {
      unsubscribe();
    };
  }, [initNetworkListener]);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <RootNavigator />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

export default App;
