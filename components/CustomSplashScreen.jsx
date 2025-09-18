import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system/legacy"; // Use legacy API
import * as Asset from "expo-asset";

export default function HtmlViewer() {
  const [htmlContent, setHtmlContent] = useState(null);

  useEffect(() => {
    const loadHtml = async () => {
      try {
        // Load asset
        const asset = Asset.Asset.fromModule(
          require("../assets/custom-screen.html")
        );
        await asset.downloadAsync();

        // Use localUri if available
        const fileUri = asset.localUri ?? asset.uri;

        // Read HTML content (legacy API)
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

  return <WebView originWhitelist={["*"]} source={{ html: htmlContent }} />;
}
