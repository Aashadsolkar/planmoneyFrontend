import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, ActivityIndicator, Dimensions } from "react-native";
import PDF from "react-native-pdf";
import Header from "@components/Header";
import { COLORS } from "../constants";
import { useLocalSearchParams } from "expo-router";

export default function PdfViewer() {
  const { url } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  const source = {
    uri: `https://admin.planmoney.in/${url}`,
    cache: true,
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <Header showBackButton={true} />
      <View style={styles.container}>
        <PDF
          source={source}
          style={styles.pdf}
          onLoadStart={() => setLoading(true)}
          onLoadComplete={() => setLoading(false)}
          trustAllCerts={false}
        />
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.secondaryColor} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
  },
  container: {
    flex: 1,
    width: width,
    height: height - 50, // Adjust for header height if needed
  },
  pdf: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
});
