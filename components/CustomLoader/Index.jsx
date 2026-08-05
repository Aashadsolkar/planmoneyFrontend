import React from "react";
import { View, ActivityIndicator, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants.js";

const CustomAppLoader = () => {
  return (
    <LinearGradient
      colors={[COLORS.primaryColor, COLORS.primaryColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar hidden={true} translucent />
      <ActivityIndicator size="large" color={COLORS.orangeColor} />
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
