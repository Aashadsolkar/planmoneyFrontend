import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Slot, useRouter } from "expo-router";

import { Provider as PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import AuthProvider from "./context/AuthContext";
import NoInternetScreen from "./components/OfflineScreen";
import NetInfo from "@react-native-community/netinfo";
import CustomSplash from "./components/CustomSplashScreen";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [showSplash,setShowSplash]=useState(true);
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
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn("App init error:", e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && !showSplash) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady,showSplash]);

   const handleSplashEnd = () => {
    setShowSplash(false);
  };
  if (!appIsReady) return null;
if(showSplash) {
  return <CustomSplash onAnimationEnd={handleSplashEnd}/>
}
  return isConnected ? (
    <AuthProvider>
      <PaperProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Slot />
        </View>
      </PaperProvider>
    </AuthProvider>
  ) : (
    <NoInternetScreen />
  );
};

export default RootLayout;
