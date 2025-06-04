import React from "react";
import { WebView } from "react-native-webview";
import { Alert } from "react-native";
import { useAuth } from '../context/useAuth';
import { router, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import * as Linking from 'expo-linking';
export default function CheckoutWebView( props) {
  const { sessionId, orderId } = useLocalSearchParams();
  const hostedUrl = `https://hunger.webiknows.in/payment.html?session_id=${sessionId}`;

  // const handleRedirect = (url) => {
  //   debugger
  //   console.log(url, ".......urlllllll");
    
  //   // const url = "https://sandbox.cashfree.com/checkout/billgo/v2/order/cancel";
  //   debugger
  //   // Handle deep link when the URL contains "cashfreegatway://"
  //   const params = new URL(url).searchParams;
  //   // const paymentStatus = params.get("status");
  //   const paymentStatus = "success"
  //   // const orderId = params.get("orderId");
  //   const orderId = "ORDER_1747312858608";
  //   // if (url.includes("cashfreegatway://")) {
  //   if (url.includes("order_id")) {
  //     if (paymentStatus === "success") {
  //       setOrderCinfirmDetails({orderId})
  //       navigation.replace("orderConfirm");
  //     } else {
  //       Alert.alert("Payment Failed", "There was an issue with your payment.");
  //     }
  //     return false; // Prevent WebView from loading this URL
  //   }
  //   return true; // Allow WebView to load the URL
  // };

 const navigation = useNavigation();

 const handleRedirect = (url) => {
  console.log("🔁 Full Redirect URL:", url);

  // Parse query params from the full URL
  const parsed = Linking.parse(url);
  const query = parsed.queryParams || {};

  const returnUrl = query.return_url; // planMoney://orderConfirm
  const order_Id = query.order_id;

  if (returnUrl && returnUrl.startsWith("planMoney://")) {
    // Extract path from return URL
    const path = returnUrl.replace("planMoney://", "");

    console.log("🔀 Navigating to:", path, "with order_id:", order_Id);

    // Navigate using expo-router
    router.push({
      pathname: `/${path}`,
      params: { orderId: order_Id },
    });

    return false; // Don't let WebView load this URL
  }

  return true; // Let WebView handle non-return links
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
      style={{paddingTop: 100}}
    />
  );
}
