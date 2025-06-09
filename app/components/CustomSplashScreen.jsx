import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import { Image } from "react-native";

const { width, height } = Dimensions.get("window");

const CustomSplashScreen = ({ onAnimationEnd }) => {
  const imageRef = useRef(null);

  useEffect(() => {
    const animate = async () => {
      if (imageRef.current) {
        await imageRef.current.fadeIn(800);
        await new Promise((resolve) => setTimeout(resolve, 1200)); // ⏱️ stays visible for 1.2s
        await imageRef.current.fadeOut(800);
        onAnimationEnd(); // 👈 now proceed
      }
    };

    animate();
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.Image
        ref={imageRef}
        style={styles.logo}
        source={require("../../assets/images/logo.png")}
        resizeMode="contain"
      />
    </View>
  );
};

export default CustomSplashScreen;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width,
    height,
    backgroundColor: "#012744",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  logo: {
    width: 400,
    height: 400,
  },
});
