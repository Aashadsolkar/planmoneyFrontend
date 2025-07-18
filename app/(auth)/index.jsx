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

const { width } = Dimensions.get("window");

const RegisterScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const scrollViewRef = useRef(null);

  // Banner data
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
    const roundIndex = Math.round(index);
    setCurrentSlide(roundIndex);
  };

  const goToSlide = (slideIndex) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: slideIndex * width,
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
      router.push("/register");
    }
  }, [showRegisterForm]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={banners[currentSlide].backgroundColor}
      />

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
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
        style={styles.bannerContainer}
      >
        {banners.map((banner, index) => (
          <View
            key={banner.id}
            style={[
              styles.bannerSlide,
              { backgroundColor: banner.backgroundColor },
            ]}
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
          />
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentSlide === banners.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  skipText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bannerContainer: {
    flex: 1,
  },
  bannerSlide: {
    width: width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  bannerContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  bannerImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  bannerImageText: {
    fontSize: 50,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  bannerSubtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.9,
  },
  bannerDescription: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  bottomNavigation: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
  },
  nextButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  // Register Form Styles
  registerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: "#333",
  },
  registerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  registerForm: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  registerButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  loginText: {
    fontSize: 16,
    color: "#666",
  },
  loginLink: {
    fontSize: 16,
    color: "#4A90E2",
    fontWeight: "600",
  },
});

export default RegisterScreen;
