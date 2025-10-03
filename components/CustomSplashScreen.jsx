// components/HtmlViewer.tsx
import { View, ActivityIndicator, TextInput, Text } from "react-native";
import { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system/legacy";
import * as Asset from "expo-asset";

export default function HtmlViewer({ onAnimationFinish }) {
  const [htmlContent, setHtmlContent] = useState(null);

  useEffect(() => {
    const loadHtml = async () => {
      try {
        const asset = Asset.Asset.fromModule(
          require("../assets/custom-screen.html")
        );
        await asset.downloadAsync();
        const fileUri = asset.localUri ?? asset.uri;
        const content = await FileSystem.readAsStringAsync(fileUri);
        setHtmlContent(content);
      } catch (err) {
        console.error("Failed to load HTML:", err);
      }
    };
    loadHtml();
  }, []);

  if (!htmlContent) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#F68F00" />
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html: htmlContent }}
      onMessage={(event) => {
        if (event.nativeEvent.data === "animationDone" && onAnimationFinish) {
          onAnimationFinish();
        }
      }}
      scrollEnabled={false}
      style={{ backgroundColor: "#012744" }}
    />
  );
}