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
import { isUserLoggedIn, isBiometricEnabled } from "../utils/auth";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Asset from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";

// ✅ FIX 1: Prevent auto hide immediately
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

// ✅ FIX 2: Preload HTML content function
const preloadSplashAssets = async () => {
  try {
    const asset = Asset.Asset.fromModule(
      require("../assets/custom-screen.html")
    );
    await asset.downloadAsync();
    
    const fileUri = asset.localUri ?? asset.uri;
    const content = await FileSystem.readAsStringAsync(fileUri);
    
    return content;
  } catch (error) {
    console.warn("Error preloading splash assets:", error);
    return null;
  }
};

const RootLayout = () => {
  // ✅ FIX 3: Better state management
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const [authPassed, setAuthPassed] = useState(false);
  const [splashAssetsReady, setSplashAssetsReady] = useState(false);
  const [preloadedHtml, setPreloadedHtml] = useState(null);

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

  // ✅ FIX 4: Coordinated splash screen initialization
  useEffect(() => {
    const initializeSplash = async () => {
      try {
        // 1. Preload HTML content
        const htmlContent = await preloadSplashAssets();
        setPreloadedHtml(htmlContent);
        
        // 2. Wait minimum time for smooth transition
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 3. Mark splash assets as ready
        setSplashAssetsReady(true);
        
        // 4. Hide native splash after everything is ready
        setTimeout(async () => {
          try {
            await SplashScreen.hideAsync();
          } catch (error) {
            console.warn("Error hiding splash screen:", error);
          }
        }, 100);
        
      } catch (error) {
        console.warn("Splash initialization error:", error);
        setSplashAssetsReady(true);
        // Hide splash even if preloading fails
        setTimeout(async () => {
          try {
            await SplashScreen.hideAsync();
          } catch (err) {
            console.warn("Error hiding splash screen:", err);
          }
        }, 500);
      }
    };

    initializeSplash();
  }, []);

 
  useEffect(() => {
    if (splashAssetsReady && isAppReady && authPassed) {
      const timer = setTimeout(() => {
        setShowCustomSplash(false);
      }, 3500); 

      return () => clearTimeout(timer);
    }
  }, [splashAssetsReady, isAppReady, authPassed]);

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

  // ✅ FIX 6: Improved auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedIn = await isUserLoggedIn();
        const biometric = await isBiometricEnabled();

        if (loggedIn && biometric) {
          setAuthPassed(false); // trigger biometric prompt
        } else {
          setAuthPassed(true); // skip biometric
        }

        setIsAppReady(true);
      } catch (error) {
        console.warn("Auth check error:", error);
        setAuthPassed(true);
        setIsAppReady(true);
      }
    };

    checkAuth();
  }, []);

  // ✅ FIX 7: Show custom splash until everything is ready
  if (showCustomSplash || !splashAssetsReady) {
    return <CustomSplash htmlContent={preloadedHtml} />;
  }
  
  if (!isConnected) return <NoInternetScreen />;

  // 🔐 If biometric needed but not passed, show BiometricAuth
  if (!authPassed) {
    return <BiometricAuth onSuccess={() => setAuthPassed(true)} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider>
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
