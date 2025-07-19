
import { useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { View, Text, Button, ActivityIndicator } from 'react-native';

export default function BiometricAuth({ onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const available = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!available || !enrolled) {
        setError('Biometric auth not available');
        setLoading(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access PlanMoney',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        onSuccess();
      } else {
        setError('Authentication failed or cancelled');
      }

      setLoading(false);
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} />;

  return (
    <View style={{ marginTop: 100, alignItems: 'center' }}>
      <Text>{error}</Text>
      <Button title="Try Again" onPress={() => setLoading(true)} />
    </View>
  );
}
