import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { WebView } from "react-native-webview";


export default function CustomSplash({ htmlContent }) {
  const [isWebViewReady, setIsWebViewReady] = useState(false);

  // ✅ FIX 9: Handle WebView loading states
  const handleWebViewLoad = () => {
    setIsWebViewReady(true);
  };

  const handleWebViewError = () => {
    console.warn("WebView failed to load splash content");
    setIsWebViewReady(true); // Still proceed to avoid infinite loading
  };

  // ✅ FIX 10: Show loading indicator while WebView loads
  if (!htmlContent) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F68F00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ✅ FIX 11: Background view to prevent white flash */}
      <View style={styles.backgroundContainer}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          style={styles.webView}
          onLoad={handleWebViewLoad}
          onError={handleWebViewError}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F68F00" />
            </View>
          )}
          // ✅ FIX 12: Additional WebView props to prevent flashing
          androidLayerType="hardware"
          mixedContentMode="compatibility"
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </View>
  );
}

// ✅ FIX 13: Consistent styling to prevent white flashes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#012744', // Match your splash screen background color
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#012744', // Ensure no white background shows
  },
  webView: {
    flex: 1,
    backgroundColor: '#012744', // WebView background
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#012744',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
