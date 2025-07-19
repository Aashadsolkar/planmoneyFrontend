
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function isUserLoggedIn() {
  const token = await AsyncStorage.getItem('token');
  return !!token;
}




export async function isBiometricEnabled() {
  const enabled = await AsyncStorage.getItem('biometricEnabled');
  return enabled === 'true';
}

export async function setBiometricEnabled(value) {
  await AsyncStorage.setItem('biometricEnabled', value ? 'true' : 'false');
}
