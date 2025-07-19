import { useEffect, useState } from "react";
import { View } from "react-native";
import { Slot, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Provider as PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import AuthProvider from "@context/AuthContext";
import NoInternetScreen from "@components/OfflineScreen";
import NetInfo from "@react-native-community/netinfo";
import CustomSplash from "@components/CustomSplashScreen";
import {
  getExpoPushToken,
  configureNotificationChannel,
} from "../push-notification/notificationService";
import { toastConfig } from "@components/CustomToast/ToastConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const clearOnFirstInstall = async () => {
  try {
    const hasLaunched = await AsyncStorage.getItem("hasLaunched");
    if (!hasLaunched) {
      await AsyncStorage.clear();
      await AsyncStorage.setItem("hasLaunched", "true");
      console.log("First launch — cleared AsyncStorage");
    }
  } catch (e) {
    console.warn("Error clearing AsyncStorage:", e);
  }
};

const RootLayout = () => {
  const [showCustomSplash, setShowCustomSplash] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const router = useRouter();

  useEffect(() => {
    clearOnFirstInstall();
  }, []);

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
    // Timer 1: Hide default splash after 100ms and show custom splash
    const hideDefaultSplashTimer = setTimeout(async () => {
      try {
        await SplashScreen.hideAsync();
        setShowCustomSplash(true);
      } catch (error) {
        console.warn("Error hiding splash screen:", error);
        setShowCustomSplash(true);
      }
    }, 30);

    // Timer 2: Hide custom splash after 2100ms total (100ms + 2000ms)
    const hideCustomSplashTimer = setTimeout(() => {
      setShowCustomSplash(false);
    }, 4000);

    // Cleanup timers
    return () => {
      clearTimeout(hideDefaultSplashTimer);
      clearTimeout(hideCustomSplashTimer);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    (async () => {
      await configureNotificationChannel();
      const token = await getExpoPushToken();
      if (token) {
        // console.log("Expo Push Token in layout:", token);
        // Optionally send token to backend here
      }
    })();
  }, []);

  if (showCustomSplash) {
    return <CustomSplash />;
  }
  return isConnected ? (
    <AuthProvider>
      <PaperProvider>
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
        <Toast config={toastConfig} />
      </PaperProvider>
    </AuthProvider>
  ) : (
    <NoInternetScreen />
  );
};

export default RootLayout;
