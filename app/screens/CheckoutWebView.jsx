import React from "react";
import { WebView } from "react-native-webview";
import { Alert } from "react-native";
import { useAuth } from "../auth/useAuth";
import { router } from "expo-router";

export default function CheckoutWebView({ route, navigation }) {
  const { sessionId, orderId } = route.params;
//  console.log(sessionId, orderId);
 const { setOrderCinfirmDetails } = useAuth();
  

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

  const handleRedirect = (url) => {
  console.log(url, "urlllll,,,,-----------------");
  // Handle redirect URLs from Expo (local dev)
  // if (url.startsWith("exp://") || url.startsWith("myapp://")) {
  //   const parsedUrl = new URL(url);
  //   const pathname = parsedUrl.pathname;
  //   const params = parsedUrl.searchParams;

  //   const orderId = params.get("order_id") || params.get("orderId"); // handle both cases
  //   const status = params.get("status");

  //   console.log(pathname, "pathname from redirect");
  //   console.log(orderId, "orderId from redirect");

  //   if (status === "success" || pathname.includes("orderConfirm")) {
  //     router.replace({
  //       pathname: "/orderConfirm",
  //       params: { orderId },
  //     });
  //   } else {
  //     Alert.alert("Payment Failed", "There was an issue with your payment.");
  //   }

  //   return false; // prevent WebView from loading the URL
  // }

  return true; // allow WebView to continue loading
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
