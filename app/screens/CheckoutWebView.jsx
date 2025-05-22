import React from "react";
import { WebView } from "react-native-webview";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function CheckoutWebView({ route }) {
  const { sessionId, orderId } = route.params;
  const hostedUrl = `https://hunger.webiknows.in/payment.html?session_id=${sessionId}`;
  const navigation = useNavigation();

  const handleRedirect = (url) => {
    // Parse URL params
    const parsed = new URL(url);
    const returnUrl = parsed.searchParams.get("return_url");
    const orderId = parsed.searchParams.get("order_id");

    if (returnUrl) {
      // Parse screen path from return_url
      const returnParsed = new URL(returnUrl);
      const path = returnParsed.pathname; // "/--/screens/orderConfirm"
      const pathParts = path.split("/--/");

      if (pathParts.length === 2) {
        const screen = pathParts[1]; // "screens/orderConfirm"
        const screenParts = screen.split("/");

        if (screenParts.length === 2) {
          const screenName = screenParts[1]; // "orderConfirm"

          // Navigate to that screen and pass orderId
          navigation.navigate(screenName, { orderId });

          return false; // prevent WebView from loading the URL
        }
      }
    }

    return true; // otherwise, allow WebView to load normally
  };

  return (
    <WebView
      source={{
        uri: hostedUrl,
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
      style={{ paddingTop: 100 }}
    />
  );
}
