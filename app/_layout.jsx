// app/_layout.tsx
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Slot, useRouter, SplashScreen } from "expo-router";
import Toast from "react-native-toast-message";
import { Provider as PaperProvider } from "react-native-paper";
import AuthProvider from "@context/AuthContext";
import NoInternetScreen from "@components/OfflineScreen";
import NetInfo from "@react-native-community/netinfo";
import CustomSplashScreen from "@components/CustomSplashScreen"; // Use custom HtmlViewer here instead of CustomSplash
import BiometricAuth from "../components/BiometricAuth/Index";
import {
  getExpoPushToken,
  configureNotificationChannel,
} from "../push-notification/notificationService";
import { toastConfig } from "@components/CustomToast/ToastConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isUserLoggedIn, isBiometricEnabled } from "../utils/auth";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
  const [isConnected, setIsConnected] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationDone, setSplashAnimationDone] = useState(false);
  const [authPassed, setAuthPassed] = useState(false);

  const router = useRouter();

  useEffect(() => {
    clearOnFirstInstall();
  }, []);

  // useEffect(() => {
  //   const subscription = Linking.addEventListener("url", ({ url }) => {
  //     const { path } = Linking.parse(url);
  //     if (path) {
  //       router.push("/" + path);
  //     }
  //   });
  //   return () => subscription.remove();
  // }, []);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    const prepareApp = async () => {
      await configureNotificationChannel();
      await getExpoPushToken();

      const loggedIn = await isUserLoggedIn();
      const biometric = await isBiometricEnabled();
      if (loggedIn && biometric) {
        setAuthPassed(false);
      } else {
        setAuthPassed(true);
      }
      setAppIsReady(true);
    };
    prepareApp();
  }, []);

  // Hide splash only when both app and animation are ready
  useEffect(() => {
    if (appIsReady && splashAnimationDone) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, splashAnimationDone]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  if (!isConnected) return <NoInternetScreen />;
  if (!appIsReady || !splashAnimationDone) {
    return <CustomSplashScreen onAnimationFinish={() => setSplashAnimationDone(true)} />;
  }
  if (!authPassed) return <BiometricAuth onSuccess={() => setAuthPassed(true)} />;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider settings={{ text: { maxFontSizeMultiplier: 1 } }}>
          <View style={{ flex: 1 }}>
            <Slot />
          </View>
          <Toast config={toastConfig} />
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;