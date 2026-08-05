import { router } from "expo-router";
import { useState, useRef } from "react";
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

import banner3 from "../../assets/images/intro1.png";
import banner2 from "../../assets/images/intro2.png";
import banner4 from "../../assets/images/intro3.jpeg";
import banner1 from "../../assets/images/intro4.jpeg";
import { COLORS } from "../../constants";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const RegisterScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderHeight, setSliderHeight] = useState(0);
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  const banners = [
    { id: 1, image: banner1, backgroundColor: COLORS.primaryColor },
    { id: 2, image: banner2, backgroundColor: COLORS.primaryColor },
    { id: 3, image: banner3, backgroundColor: COLORS.primaryColor },
    { id: 4, image: banner4, backgroundColor: COLORS.primaryColor },
  ];

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setCurrentSlide(Math.round(index));
  };

  const goToSlide = (slideIndex) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: slideIndex * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const handleSkip = () => router.push("/login");

  const handleNext = () => {
    if (currentSlide < banners.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      router.push("/login");
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: banners[currentSlide].backgroundColor }]}
      edges={["top", "left", "right"]}
    >
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
          style={styles.skipButton}
          onPress={handleSkip}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text allowFontScaling={false} style={styles.skipText}>
            Skip
          </Text>
        </TouchableOpacity>

        {/* Banner Slider */}
        <View
          style={styles.sliderWrapper}
          onLayout={(e) => setSliderHeight(e.nativeEvent.layout.height)}
        >
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {banners.map((banner) => (
              <View
                key={banner.id}
                style={[
                  styles.bannerSlide,
                  {
                    width: SCREEN_WIDTH,
                    height: sliderHeight,
                    backgroundColor: banner.backgroundColor,
                  },
                ]}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={banner.image}
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

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

          {/* Next / Get Started Button */}
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
  },
  container: {
    flex: 1,
  },
  skipButton: {
    alignSelf: "flex-end",
    marginRight: 24,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: COLORS.secondaryIconColor,
    borderRadius: 24,
    zIndex: 10,
  },
  skipText: {
    fontWeight: "500",
    color: COLORS.primaryColor,
  },
  sliderWrapper: {
    flex: 1,               // baaki sara space le lo
    overflow: "hidden",
  },
  bannerSlide: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: "transparent",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryColor,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.orangeColor,
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