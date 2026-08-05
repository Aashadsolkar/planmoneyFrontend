import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useAuth } from "@context/useAuth";
import { sendRequestApi } from "@utils/apiCaller";
import Header from "@components/Header";
import { COLORS } from "../../../constants.js";
import { useNavigation } from "expo-router";
import * as Linking from "expo-linking";
import { showToast } from "@components/CustomToast/ToastService";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const KycVerifyPage = () => {
  const [loading, setLoading] = useState(false);
  const [sdkUrl, setSdkUrl] = useState(null);
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("http://myapp");
  const { token, setDigiLockerRequestId, logout } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  // 🚫 Disable back button and navigation gestures
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault(); // Block navigation
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    ); // Block Android back

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation]);

  // 🚀 Get SDK URL
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
      if (error?.error) {
        showToast({
          type: "error",
          title: `Something went wrong! 😥`,
          message: `${error?.error || error?.message || "Failed to chanage password!"
            }`,
          // redirectPath: "home",
          sessionExired:
            error?.error == "Another session is active." ? true : false,
          logout: logout,
        });
      } else {
        setError(
          error.message || "Failed to Verify Digi Locker, Please try again"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle redirection from WebView
  const handleRedirect = (event) => {
    const url = event.url;
    // console.log("🔁 Redirect URL:", url);

    if (url.startsWith("planmoney://")) {
      // Try to open deep link safely
      Linking.openURL(url).catch((err) => {
        console.warn("❌ Deep link error:", err);
      });
      return false; // prevent WebView from loading it
    }

    return true; // allow other URLs
  };

  // ⏳ Show loading spinner
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Digi Locker...</Text>
      </View>
    );
  }

  // ❌ Show error screen
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={sendRequest} />
      </View>
    );
  }

  // ✅ Show WebView
  if (sdkUrl) {
    return (
      <>
        <Header disableSidebar webUrl={currentUrl} />
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor }}>
          <View style={{ marginHorizontal: 20, marginVertical: 0 }}>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              Please complete your KYC
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              paddingBottom: insets.bottom,
              backgroundColor: COLORS.primaryColor,
            }}
          >
            <WebView
              source={{
                uri: sdkUrl,
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }}
              onShouldStartLoadWithRequest={handleRedirect}
              onError={({ nativeEvent }) => {
                Alert.alert("WebView Error", nativeEvent.description);
                console.error("❌ WebView Error:", nativeEvent);
              }}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              style={{ flex: 1 }}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }

  return <View />; // fallback empty screen
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
