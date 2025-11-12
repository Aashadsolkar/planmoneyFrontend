import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@context/useAuth";
import CustomAppLoader from "@components/CustomLoader/Index";

export default function AuthLayout() {
  const { user, token, loading } = useAuth();

 

  useEffect(() => {
  if (!loading) {
    if (user && token) {
      setTimeout(() => {
        router.replace("/home");
      }, 100);
    }
  }
}, [loading, user, token]);

  if (loading) {
    return <CustomAppLoader />;
  }

  if (!user || !token) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  
  return <CustomAppLoader />;
}
