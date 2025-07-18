import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../context/useAuth";
import CustomAppLoader from "../components/CustomLoader/Index";

export default function AuthLayout() {
  const { user, token, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && token) {
      router.replace("/home");
    }
  }, [user, token, loading]);

  if (loading) {
    return <CustomAppLoader />;
  }

  if (user && token) {
    return null; 
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
