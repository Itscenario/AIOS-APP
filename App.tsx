import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/store';
import { restoreSavedProfile } from './src/store/persistence';

function App(): React.JSX.Element {
  const [profileRestored, setProfileRestored] = useState(false);
  useEffect(() => {
    let mounted = true;
    restoreSavedProfile().finally(() => {
      if (mounted) {
        setProfileRestored(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <Provider store={store}>
          <StatusBar hidden={false} barStyle="dark-content" />
          {profileRestored ? <AppNavigator /> : null}
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
