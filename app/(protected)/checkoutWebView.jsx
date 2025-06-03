import React from "react";
import { WebView } from "react-native-webview";
import { Alert } from "react-native";
import { useAuth } from '../context/useAuth';
import { router, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function CheckoutWebView( props) {
  console.log(props,":::::::::::::::::::::::::");
  
  const { sessionId, orderId } = useLocalSearchParams();
 console.log(sessionId, orderId, "asdsadasdasdsdasdsasfdfdadfd____________Adas");
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
    // Parse URL params
    
    // const parsed = new URL(url);
    // const returnUrl = parsed.searchParams.get("return_url");
    // const orderId = parsed.searchParams.get("order_id");

    // if (returnUrl) {
    //   // Parse screen path from return_url
    //   const returnParsed = new URL(returnUrl);
    //   const path = returnParsed.pathname; // "/--/screens/orderConfirm"
    //   const pathParts = path.split("/--/");

    //   if (pathParts.length === 2) {
    //     const screen = pathParts[1]; // "screens/orderConfirm"
    //     const screenParts = screen.split("/");

    //     if (screenParts.length === 2) {
    //       const screenName = screenParts[1]; // "orderConfirm"

    //       // Navigate to that screen and pass orderId
    //       navigation.navigate(screenName, { orderId });

    //       return false; // prevent WebView from loading the URL
    //     }
    //   }
    // }

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
