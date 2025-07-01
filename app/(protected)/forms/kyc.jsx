
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Button,
  StyleSheet,
  Text,
  View
} from "react-native";
import { WebView } from "react-native-webview";
import { useAuth } from "../../context/useAuth"
import { sendRequestApi } from "../../utils/apiCaller";
import Header from "../../components/Header";
import { COLORS } from "../../constants";
import { useNavigation } from "expo-router";


const KycVerifyPage = () => {
  const [loading, setLoading] = useState(false);
  const [sdkUrl, setSdkUrl] = useState(null);
  const [error, setError] = useState(null);
  const { token, setDigiLockerRequestId, profileData } = useAuth();
  const navigation = useNavigation();

  // 🚫 Prevent back button and swipe gestures
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault(); // Block back navigation
    });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true); // Block Android hardware back

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation]);

  useEffect(() => {
    sendRequest();
  }, []);

  const sendRequest = async () => {
    try {
      setLoading(true);
      const result = await sendRequestApi(token);
      setDigiLockerRequestId(result?.data?.request_id);
      setSdkUrl(result?.data?.sdk_url);
    } catch (error) {
      setError(error.message || "Faild to Verify Digi Locker, Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (url) => {
    console.log("🔁 Full Redirect URL:", url);
    return true;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Digi Locker...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={() => sendRequest()} />
      </View>
    );
  }

  if (sdkUrl) {
    return (
      <>
        <Header />
        <View style={{ marginHorizontal: 20, marginVertical: 20}}>
          <Text style={{ fontSize: 18, fontWeight: 600 }}>Please complete your KYC</Text>
        </View>
        <WebView
          source={{
            uri: sdkUrl,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }}
          onShouldStartLoadWithRequest={(event) => handleRedirect(event.url)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            Alert.alert("WebView error", nativeEvent.description);
          }}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={{ paddingTop: 50 }}
        />
      </>
    );
  }
  return (
    <View>

    </View>
  );
};
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default KycVerifyPage;
