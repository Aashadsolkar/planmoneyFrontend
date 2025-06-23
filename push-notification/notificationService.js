import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PUSH_TOKEN_KEY = "expo_push_token";

// Notification handler setup
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Get and cache push token
export async function getExpoPushToken() {
  try {
    const storedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    if (storedToken) {
      console.log("Using stored token:", storedToken);
      return storedToken;
    }

    if (!Device.isDevice) {
      alert("Must use physical device");
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Push notification permission not granted");
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    console.log("New token saved:", token);
    return token;
  } catch (error) {
    console.error("Error getting push token:", error);
    return null;
  }
}

// Notification channel config for Android
export async function configureNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#143b6c",
      sound: "default",
    });
  }
}

// Optional: Clear stored token (e.g., on logout)
export async function clearStoredPushToken() {
  await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
}

// Optional: Just get the stored token
export async function getStoredPushToken() {
  return await AsyncStorage.getItem(PUSH_TOKEN_KEY);
}
