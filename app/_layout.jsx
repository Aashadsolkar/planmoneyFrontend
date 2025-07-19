// app/_layout.tsx
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
import BiometricAuth from "../components/BiometricAuth/Index";
import {
  getExpoPushToken,
  configureNotificationChannel,
} from "../push-notification/notificationService";
import { toastConfig } from "@components/CustomToast/ToastConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  isUserLoggedIn,
  isBiometricEnabled,
} from "../utils/auth"; 

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
  const [isAppReady, setIsAppReady] = useState(false);
  const [authPassed, setAuthPassed] = useState(false);

  const router = useRouter();

  // Handle first install
  useEffect(() => {
    clearOnFirstInstall();
  }, []);

  // Handle deep linking
  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      const { path } = Linking.parse(url);
      if (path) {
        router.push("/" + path);
      }
    });

    return () => subscription.remove();
  }, []);

  // Splash screen logic
  useEffect(() => {
    const hideDefaultSplashTimer = setTimeout(async () => {
      try {
        await SplashScreen.hideAsync();
        setShowCustomSplash(true);
      } catch (error) {
        console.warn("Error hiding splash screen:", error);
        setShowCustomSplash(true);
      }
    }, 30);

    const hideCustomSplashTimer = setTimeout(() => {
      setShowCustomSplash(false);
    }, 4000);

    return () => {
      clearTimeout(hideDefaultSplashTimer);
      clearTimeout(hideCustomSplashTimer);
    };
  }, []);

  // Internet connection check
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Push notification setup
  useEffect(() => {
    (async () => {
      await configureNotificationChannel();
      const token = await getExpoPushToken();
      if (token) {
        // Optionally send token to backend
      }
    })();
  }, []);

  // 🔐 Biometric + Login check
  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isUserLoggedIn();
      const biometric = await isBiometricEnabled();

      if (loggedIn && biometric) {
        setAuthPassed(false); // trigger biometric prompt
      } else {
        setAuthPassed(true); // skip biometric
      }

      setIsAppReady(true);
    };

    checkAuth();
  }, []);

  if (showCustomSplash || !isAppReady) return <CustomSplash />;
  if (!isConnected) return <NoInternetScreen />;

  // 🔐 If biometric needed but not passed, show BiometricAuth
  if (!authPassed) {
    return <BiometricAuth onSuccess={() => setAuthPassed(true)} />;
  }

  return (
    <AuthProvider>
      <PaperProvider>
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
        <Toast config={toastConfig} />
      </PaperProvider>
    </AuthProvider>
  );
};

export default RootLayout;
