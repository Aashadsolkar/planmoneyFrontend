import React from "react";
import { WebView } from "react-native-webview";
import { Alert, StatusBar, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from '@context/useAuth';
import { router, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import * as Linking from 'expo-linking';
import { COLORS } from "../../constants.js";

export default function CheckoutWebView(props) {
  const { sessionId, orderId } = useLocalSearchParams();
  const hostedUrl = `https://planmoney.in/payment.html?session_id=${sessionId}`;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleRedirect = (url) => {
    // Parse query params from the full URL
    const parsed = Linking.parse(url);
    const query = parsed.queryParams || {};

    const returnUrl = query.return_url; // planMoney://orderConfirm
    const order_Id = query.order_id;

    if (returnUrl && returnUrl.startsWith("planmoney://")) {
      // Extract path from return URL
      const path = returnUrl.replace("planmoney://", "");

      // Navigate using expo-router
      router.push({
        pathname: `/${path}`,
        params: { orderId: order_Id },
      });

      return false; // Don't let WebView load this URL
    }

    return true; // Let WebView handle non-return links
  };

  // Calculate proper spacing for WebView
  const getWebViewStyle = () => {
    return {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0,
      marginBottom: Platform.OS === 'android' && insets.bottom === 0 ? 20 : 0,
    };
  };

  return (
    <SafeAreaView style={styles.container} edges={[ 'left', 'right']}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.primaryColor || "#FFFFFF"}
        translucent={false}
      />
      
      <View style={[styles.webViewContainer, { paddingBottom: Math.max(insets.bottom, 0) }]}>
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
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={getWebViewStyle()}
          // Enhanced WebView props for better performance
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          bounces={false}
          scrollEnabled={true}
          // Security props
          allowsBackForwardNavigationGestures={false}
          allowFileAccess={false}
          allowUniversalAccessFromFileURLs={false}
          // Performance props
          renderToHardwareTextureAndroid={true}
          androidLayerType="hardware"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS?.primaryColor || "#FFFFFF",
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: COLORS?.primaryColor || "#FFFFFF",
  },
});
