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
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const RegisterScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  const banners = [
    {
      id: 1,
      title: "Welcome to Our App",
      subtitle: "Discover amazing features",
      description:
        "Join thousands of users who are already enjoying our premium services and exclusive content.",
      backgroundColor: "#012744",
    },
    {
      id: 2,
      title: "Stay Connected",
      subtitle: "Never miss an update",
      description:
        "Get real-time notifications and stay connected with your friends and family anywhere, anytime.",
      backgroundColor: "#012744",
    },
    {
      id: 3,
      title: "Secure & Private",
      subtitle: "Your data is safe",
      description:
        "We use advanced encryption to protect your personal information and ensure complete privacy.",
      backgroundColor: "#012744",
    },
    {
      id: 4,
      title: "Get Started Today",
      subtitle: "Join our community",
      description:
        "Create your account now and unlock all the amazing features waiting for you.",
      backgroundColor: "#012744",
    },
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

  const handleSkip = () => {
    setShowRegisterForm(true);
  };

  const handleNext = () => {
    if (currentSlide < banners.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      setShowRegisterForm(true);
    }
  };

  useEffect(() => {
    if (showRegisterForm) {
      router.push("/login");
    }
  }, [showRegisterForm]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor={banners[currentSlide].backgroundColor} />

      <View style={[styles.container, { backgroundColor: banners[currentSlide].backgroundColor }]}>
        {/* Skip Button */}
        <TouchableOpacity
          style={[styles.skipButton, { top: insets.top + 10 }]}
          onPress={handleSkip}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.skipText}>Skip</Text>
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
        >
          {banners.map((banner) => (
            <View
              key={banner.id}
              style={[styles.bannerSlide, { width: screenWidth }]}
            >
              <View style={styles.bannerContent}>
                <View style={styles.bannerImagePlaceholder}>
                  <Text style={styles.bannerImageText}>📱</Text>
                </View>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                <Text style={styles.bannerDescription}>{banner.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Pagination + Button */}
        <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.paginationContainer}>
            {banners.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  currentSlide === index && styles.paginationDotActive,
                ]}
                onPress={() => goToSlide(index)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentSlide === banners.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#012744" },
  container: { flex: 1 },
  skipButton: {
    position: "absolute",
    right: 20,
    zIndex: 2,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  skipText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  bannerSlide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  bannerContent: { alignItems: "center", justifyContent: "center", flex: 1 },
  bannerImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  bannerImageText: { fontSize: 50 },
  bannerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  bannerSubtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
    opacity: 0.9,
  },
  bannerDescription: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  bottomContainer: {
    paddingHorizontal: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 6,
  },
  paginationDotActive: { backgroundColor: "#fda500ff", width: 14, height: 14 },
  nextButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
  },
  nextButtonText: { fontSize: 18, fontWeight: "600", color: "#333" },
});

export default RegisterScreen;
