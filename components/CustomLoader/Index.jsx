import React from "react";
import { View, ActivityIndicator, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CustomAppLoader = () => {
  return (
    <LinearGradient
      colors={["#00508eff", "#0a2a3cff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar hidden={true} translucent />
      <ActivityIndicator size="large" color="#F68F00" />
    </LinearGradient>
  );
};

export default CustomAppLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
