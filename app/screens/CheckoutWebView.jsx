import React from "react";
import { WebView } from "react-native-webview";
import { Alert } from "react-native";
import { useAuth } from "../auth/useAuth";

export default function CheckoutWebView({ route, navigation }) {
  const { sessionId, orderId } = route.params;
 console.log(sessionId, orderId);
 const { setOrderCinfirmDetails } = useAuth();
  

  const hostedUrl = `https://hunger.webiknows.in/payment.html?session_id=${sessionId}`;

  const handleRedirect = (url) => {

    // Handle deep link when the URL contains "cashfreegatway://"
    const params = new URL(url).searchParams;
    // const paymentStatus = params.get("status");
    const paymentStatus = "success"
    // const orderId = params.get("orderId");
    const orderId = "ORDER_1747312858608";
    // if (url.includes("cashfreegatway://")) {
    if (url.includes("order_id")) {
      if (paymentStatus === "success") {
        setOrderCinfirmDetails({orderId})
        navigation.replace("orderConfirm");
      } else {
        Alert.alert("Payment Failed", "There was an issue with your payment.");
      }
      return false; // Prevent WebView from loading this URL
    }
    return true; // Allow WebView to load the URL
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
      onShouldStartLoadWithRequest={(event) =>
        handleRedirect(event.url)
      }
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        Alert.alert("WebView error", nativeEvent.description);
      }}
      startInLoadingState={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}
