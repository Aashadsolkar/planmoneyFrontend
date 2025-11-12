import { router } from "expo-router";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// Import your intro images
import banner3 from "../../assets/images/intro1.png";
import banner2 from "../../assets/images/intro2.png";
import banner4 from "../../assets/images/intro3.jpeg";
import banner1 from "../../assets/images/intro4.jpeg";

const RegisterScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  const banners = [
    { id: 1, image: banner1, backgroundColor: "#012744" },
    { id: 2, image: banner2, backgroundColor: "#012744" },
    { id: 3, image: banner3, backgroundColor: "#012744" },
    { id: 4, image: banner4, backgroundColor: "#012744" },
  ];

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setCurrentSlide(Math.round(index));
  };

  const goToSlide = (slideIndex) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: slideIndex * screenWidth,
        animated: true,
      });
    }
  };

  // ✅ Fixed: Direct navigation instead of using showRegisterForm state
  const handleSkip = () => router.push("/login");

  const handleNext = () => {
    if (currentSlide < banners.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      router.push("/login");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={banners[currentSlide].backgroundColor}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: banners[currentSlide].backgroundColor },
        ]}
      >
        {/* Skip Button */}
        <TouchableOpacity
          style={[styles.skipButton, { top: insets.top + 16 }]}
          onPress={handleSkip}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text allowFontScaling={false} style={styles.skipText}>
            Skip
          </Text>
        </TouchableOpacity>

        {/* Banner Slider */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onLayout={(e) => setScreenWidth(e.nativeEvent.layout.width)}
          contentContainerStyle={{ flexGrow: 1 }}
          style={styles.scrollView}
        >
          {banners.map((banner) => (
            <View
              key={banner.id}
              style={[
                styles.bannerSlide,
                { width: screenWidth, backgroundColor: banner.backgroundColor },
              ]}
            >
              <View style={styles.imageShadowContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={banner.image}
                    style={styles.bannerImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Controls */}
        <View
          style={[
            styles.bottomContainer,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {banners.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  currentSlide === index && styles.paginationDotActive,
                ]}
                onPress={() => goToSlide(index)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              />
            ))}
          </View>

          {/* Next/Get Started Button */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text allowFontScaling={false} style={styles.nextButtonText}>
              {currentSlide === banners.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#012744",
  },
  container: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 24,
  },
  skipText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  bannerSlide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 140,
    paddingHorizontal: 24,
  },
  imageShadowContainer: {
    flex: 1,
    width: "100%",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 20,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
    zIndex: 5,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: 0.5,
  },
});

export default RegisterScreen;
