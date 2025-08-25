import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@context/useAuth";
import Input from "@components/Input";
import Button from "@components/Button";
import { COLORS } from "../constants";
import LogoSVG from "@components/LogoSVG";
import * as Animatable from "react-native-animatable";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [loginApiError, setLoginApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  const { storeUserData } = useAuth();

  // 📌 Dummy Send OTP
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

    try {
      // 🔹 Dummy delay + success
      setTimeout(() => {
        setOtpSent(true);
        setResendCount((prev) => prev + 1);
        setTimer(30); // 30 sec cooldown
        setIsLoading(false);

        const countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 1000);
    } catch (err) {
      setLoginApiError("Failed to send OTP (dummy error)");
      setIsLoading(false);
    }
  };

  // 📌 Dummy Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setErrors({ otp: "Enter a valid 6 digit OTP" });
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      if (otp === "123456") {
        // 🔹 Fake user + token
        const dummyUser = { id: 1, name: "John Doe", phone };
        const dummyToken = "dummy-jwt-token";

        storeUserData(dummyUser, dummyToken);
        setLoginApiError("");
        alert("✅ OTP Verified! Logged in successfully.");
        router.push("/");
      } else {
        setLoginApiError("❌ Invalid OTP. Try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryColor}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Animatable.View animation="fadeIn" delay={200} duration={600}>
          <View style={styles.logoContainer}>
            <LogoSVG />
          </View>
        </Animatable.View>

        <View style={styles.formContainer}>
          <Text style={styles.subText}>Login with your mobile number</Text>

          {/* Phone Input */}
          <Animatable.View animation="fadeInUp" delay={100} duration={600}>
            <Input
              label="Mobile Number"
              value={phone}
              onChangeText={(value) => {
                setPhone(value);
                setErrors({});
              }}
              error={!!errors?.phone}
              errorMessage={errors?.phone}
              isNumberOnly={true}
              maxLength={10}
              editable={!otpSent} // disable after OTP sent
            />
          </Animatable.View>

          {/* OTP Section */}
          {otpSent && (
            <Animatable.View animation="fadeInUp" delay={200} duration={600}>
              <Input
                label="Enter OTP"
                value={otp}
                onChangeText={(value) => {
                  setOtp(value);
                  setErrors({});
                }}
                error={!!errors?.otp}
                errorMessage={errors?.otp}
                isNumberOnly={true}
                maxLength={6}
              />

              {/* Resend OTP */}
              <View style={styles.resendContainer}>
                {resendCount < 3 ? (
                  <TouchableOpacity
                    disabled={timer > 0}
                    onPress={handleSendOtp}
                  >
                    <Text
                      style={[styles.resendText, timer > 0 && { opacity: 0.5 }]}
                    >
                      {timer > 0
                        ? `Resend OTP in ${timer}s`
                        : "Resend OTP"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.resendLimit}>
                    ⚠️ Max resend attempts reached
                  </Text>
                )}
              </View>
            </Animatable.View>
          )}

          {/* Error Display */}
          {loginApiError ? (
            <Text style={styles.errorText}>{loginApiError}</Text>
          ) : null}
        </View>

        <View style={styles.bottomContainer}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={styles.signupText}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
          {!otpSent ? (
            <Button
              onClick={handleSendOtp}
              isLoading={isLoading}
              label="Get OTP"
              gradientColor={["#D36C32", "#F68F00"]}
            />
          ) : (
            <Button
              onClick={handleVerifyOtp}
              isLoading={isLoading}
              label="Login"
              gradientColor={["#D36C32", "#F68F00"]}
              disabled={otp.length !== 6} // Disable until OTP is valid
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#012744" },
  logoContainer: { alignItems: "center", marginTop: 40, paddingVertical: 20 },
  formContainer: { paddingHorizontal: 20, marginTop: 20 },
  subText: { fontWeight: "500", color: "#FFFFFF", marginBottom: 10, fontSize: 16 },
  resendContainer: { alignItems: "flex-end", marginTop: 8 },
  resendText: { color: COLORS.secondaryColor, fontSize: 14, fontWeight: "500" },
  resendLimit: { color: "orange", fontSize: 13, fontWeight: "600" },
  errorText: { color: "red", marginTop: 8, fontSize: 13, textAlign: "center" },
  bottomContainer: {
    paddingHorizontal: 20,
    width: "100%",
    position: "absolute",
    bottom: "10%",
  },
  signupText: { color: "#fff", textAlign: "center", marginBottom: 20 },
  signupLink: { color: "#D87129" },
});

export default Login;
