import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, LogBox } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as StoreProvider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import store from './store';
import AppNavigator from './navigation/AppNavigator';
import theme from './styles/theme';

// Ignore specific warnings (useful for development)
// In a production app, these should be properly fixed
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested',
]);

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StoreProvider store={store}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
              <AppNavigator />
            </SafeAreaView>
          </NavigationContainer>
        </PaperProvider>
      </StoreProvider>
    </GestureHandlerRootView>
  );
};

export default App;
