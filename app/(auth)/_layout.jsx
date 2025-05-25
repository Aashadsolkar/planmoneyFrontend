import { router, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../context/useAuth';

export default function AuthLayout() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace('/home');
    }
  }, [user]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
