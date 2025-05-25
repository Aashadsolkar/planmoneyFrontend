import { Stack } from 'expo-router';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/useAuth';

export default function ProtectedLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }


  return <Stack screenOptions={{ headerShown: false }} />;
}
