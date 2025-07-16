import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { ActivityIndicator, View } from "react-native";
import CustomAppLoader from "../components/CustomLoader/Index";

export default function AuthLayout() {
  const { user, token, loading } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user]);
  if (loading || token) {
    return <CustomAppLoader />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
