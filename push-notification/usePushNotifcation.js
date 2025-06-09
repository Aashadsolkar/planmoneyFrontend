// firebase/usePushNotification.js
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { configureNotificationChannel, getExpoPushToken } from './notificationService';

export const usePushNotification = () => {
  const [expoToken, setExpoToken] = useState('');

  useEffect(() => {
    configureNotificationChannel();

    getExpoPushToken().then(async (token) => {
      if (token) {
        setExpoToken(token);
        // await registerTokenWithServer(token);
      }
    });

    const receiveSub = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Foreground Notification:', notification);
    });

    const tapSub = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response?.notification?.request?.content?.data?.screen;
      const params = response?.notification?.request?.content?.data?.params;
      if (screen) {
         const path = params ? `${screen}?${new URLSearchParams(params).toString()}` : screen;
        router.push(path);
      }
    });

    return () => {
      receiveSub.remove();
      tapSub.remove();
    };
  }, []);

  return expoToken;
};
