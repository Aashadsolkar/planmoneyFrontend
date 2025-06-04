import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import AuthProvider from './context/AuthContext';

// Prevent splash screen from auto-hiding (only run once)
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [appIsReady, setAppIsReady] = useState(false);

    const router = useRouter();

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      const { path } = Linking.parse(url);
      if (path) {
        router.push("/" + path);
      }
    });

    return () => subscription.remove();
  }, []);
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Do any app initialization logic here (e.g., loading fonts, tokens)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn('App init error:', e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    // Don't render anything until the app is ready
    return null;
  }

  return (
    <AuthProvider>
      <PaperProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Slot />
        </View>
      </PaperProvider>
    </AuthProvider>
  );
};

export default RootLayout;
