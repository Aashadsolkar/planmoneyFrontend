
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
export async function isUserLoggedIn() {
  const token = await SecureStore.getItem('token');
  return !!token;
}




export async function isBiometricEnabled() {
  const enabled = await SecureStore.getItem('biometricEnabled');
  return enabled === 'true';
}

export async function setBiometricEnabled(value) {
  await SecureStore.setItem('biometricEnabled', value ? 'true' : 'false');
}
