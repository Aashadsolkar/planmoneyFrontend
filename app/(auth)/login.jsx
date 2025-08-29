import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@context/useAuth";
import Input from "@components/Input";
import Button from "@components/Button";
import { COLORS } from "../constants";
import LogoSVG from "@components/LogoSVG";
import * as Animatable from "react-native-animatable";
import { login, RegisterPushNotificationToken } from "@utils/apiCaller";
import { Image } from "expo-image";
import { getExpoPushToken } from "../../push-notification/notificationService";

const { width, height } = Dimensions.get("window");

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [loginApiError, setLoginApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [customerId, setCustomerId] = useState(null);

  const { storeUserData } = useAuth();

  // ✅ Send OTP
  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrors({ phone: "Enter a valid 10-digit mobile number" });
      return;
    }
    if (resendCount >= 3) {
      setLoginApiError("You have reached maximum OTP resend attempts.");
      return;
    }

    setIsLoading(true);
    setLoginApiError("");

    try {
      const res = await login({ email_or_phone: phone });

      if (res?.data.customer_id) {
        setOtpSent(true);
        setCustomerId(res?.data.customer_id);
        setResendCount((prev) => prev + 1);
        setTimer(30);

        const countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setLoginApiError(res?.message || "Failed to send OTP");
      }
    } catch (err) {
      setLoginApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setErrors({ otp: "Enter a valid 6 digit OTP" });
      return;
    }

    setIsLoading(true);
    setLoginApiError("");

    try {
      const res = await login({ customer_id: customerId, otp });
      if (res?.data?.token) {
        storeUserData(res.data.user, res.data.token);
        const deviceToken = await getExpoPushToken();
        if (deviceToken) {
          await RegisterPushNotificationToken(deviceToken, res.data.token);
        }
      } else {
        setLoginApiError(res?.message || "Invalid OTP. Try again.");
      }
    } catch (err) {
      setLoginApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryColor} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            
            {/* Header with Logo & Welcome */}
            <Animatable.View animation="fadeInDown" duration={600} style={styles.header}>
              <LogoSVG style={styles.logo} />
              {/* <Text style={styles.welcomeText}>Welcome Back 👋</Text>
              <Text style={styles.tagline}>
                Manage your finances smartly and securely
              </Text> */}
            </Animatable.View>

            {/* Finance Illustration */}
            <Animatable.View animation="zoomIn" delay={200}>
              <Image
                source={require("../../assets/images/login-bg.png")}
                style={styles.illustration}
                contentFit="contain"
              />
            </Animatable.View>

            {/* Card Form */}
            <Animatable.View animation="fadeInUp" delay={300} style={styles.formCard}>
              <View>
       <Text style={styles.formTitle}>
                {otpSent ? "Enter OTP" : "Welcome Back, Login!"}
              </Text>
              <Text style={styles.formSubtitle}>
                {otpSent
                  ? "We’ve sent a 4-digit OTP to your mobile number."
                  : "Enter your mobile number to receive OTP."}
              </Text>
              </View>
       

              {/* Phone Input */}
              {!otpSent && (
                <Input
                  label="Mobile Number"
                  value={phone}
                  onChangeText={(value) => {
                    setPhone(value);
                    setErrors({});
                  }}
                  error={!!errors?.phone}
                  errorMessage={errors?.phone}
                  isNumberOnly
                  maxLength={10}
                />
              )}

              {/* OTP Input */}
              {otpSent && (
                <>
                  <Input
                    label="Enter OTP"
                    value={otp}
                    onChangeText={(value) => {
                      setOtp(value);
                      setErrors({});
                    }}
                    error={!!errors?.otp}
                    errorMessage={errors?.otp}
                    isNumberOnly
                    maxLength={6}
                    autoFocus
                  />

                  {/* Resend OTP */}
                  <View style={styles.resendContainer}>
                    {resendCount < 3 ? (
                      <TouchableOpacity
                        disabled={timer > 0 || isLoading}
                        onPress={handleSendOtp}
                      >
                        <Text
                          style={[
                            styles.resendText,
                            (timer > 0 || isLoading) && { opacity: 0.6 },
                          ]}
                        >
                          {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.resendLimit}>⚠️ Max resend attempts reached</Text>
                    )}
                  </View>
                </>
              )}

              {/* Error */}
              {loginApiError ? (
                <Text style={styles.errorText}>{loginApiError}</Text>
              ) : null}

              {/* Button */}
              <Button
                onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                isLoading={isLoading}
                 style={{ marginTop: 20 }}
                label={otpSent ? "Verify & Login" : "Get OTP"}
                gradientColor={["#D36C32", "#F68F00"]}
                disabled={otpSent ? otp.length !== 6 || isLoading : isLoading}
              />
            </Animatable.View>

            {/* Signup */}
            <View style={styles.bottomContainer}>
              <Text style={styles.signupText}>Don’t have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.signupLink}> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryColor },
  flexContainer: { flex: 1 },
  content: { flex: 1, alignItems: "center",gap:16 },

  header: { alignItems: "center", marginTop: 20 },
  logo: { width: 80, height: 80 },

  illustration: { width: width * 0.8, height: height * 0.4 },

  formCard: {
    backgroundColor: "#093658",
    width: "90%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
     gap: 20,
  },
  formTitle: { fontSize: 24, fontWeight: "700", marginBottom: 8, color: "#fdfdfdff" },
  formSubtitle: { fontSize: 16, color: "#ccccccff", marginBottom: 20 },

  resendContainer: { alignItems: "flex-end", marginTop: 8 },
  resendText: { color: COLORS.secondaryColor, fontSize: 14, fontWeight: "500" },
  resendLimit: { color: "#FFB300", fontSize: 13, fontWeight: "600" },

  errorText: { color: "#FF4444", marginTop: 12, fontSize: 13, textAlign: "center" },

  bottomContainer: { flexDirection: "row", marginBottom: 20 },
  signupText: { color: "#FFF", fontSize: 14 },
  signupLink: { color: "#FFD54F", fontWeight: "700", fontSize: 14 },
});

export default Login;
