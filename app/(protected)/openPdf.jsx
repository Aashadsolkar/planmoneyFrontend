import React from "react";
import {
  StyleSheet,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@components/Header";
import { COLORS } from "../constants";
import { useLocalSearchParams } from "expo-router"

export default function PdfViewer() {
  const { url } = useLocalSearchParams();

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      {/* Header with Back Button */}
      <Header showBackButton={true} />

      {/* PDF Viewer */}
      <WebView
        source={{
          uri: `https://docs.google.com/gview?embedded=true&url=https://admin.planmoney.in/${url}`
        }}
        style={styles.webview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cardColor,
  },
  header: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  webview: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
});
