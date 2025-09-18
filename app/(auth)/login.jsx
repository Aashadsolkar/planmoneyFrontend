import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  TextInput,
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

const OtpInput = ({ length = 4, value, setValue }) => {
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, ""); // allow only numbers
    let newValue = value.split("");
    newValue[index] = digit;
    const updatedValue = newValue.join("").trim();
    setValue(updatedValue);

    if (digit && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {Array(length)
        .fill(0)
        .map((_, i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputs.current[i] = ref)}
            style={[styles.otpBox, value[i] ? styles.otpBoxFilled : null]}
            keyboardType="number-pad"
            maxLength={1}
            value={value[i] || ""}
            onChangeText={(text) => handleChange(text, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
          />
        ))}
    </View>
  );
};

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

  const handleSendOtp = async () => {
    const trimmedPhone = phone.trim();
    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
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
      const res = await login({ email_or_phone: trimmedPhone });

      if (res?.data.customer_id) {
        setOtpSent(true);
        setCustomerId(res?.data.customer_id);
        setResendCount((prev) => prev + 1);
        setTimer(30);
        setOtp("");

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
      const apiMessage =
        err?.response?.data?.message || // server message
        err?.response?.data?.errors?.[0]?.message || // first error in array
        err?.message || // fallback JS error
        "Network error. Please try again.";

      setLoginApiError(apiMessage);
      // setLoginApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const trimmedOtp = otp.trim();
    if (trimmedOtp.length !== 4) {
      setErrors({ otp: "Enter a valid 4 digit OTP" });
      return;
    }

    setIsLoading(true);
    setLoginApiError("");

    try {
      const res = await login({ customer_id: customerId, otp: trimmedOtp });
      if (res?.data?.token) {
        storeUserData(res.data.user, res.data.token);
        const deviceToken = await getExpoPushToken();
        if (deviceToken) {
          await RegisterPushNotificationToken(deviceToken, res.data.token);
        }
        setOtp("");
      } else {
        setLoginApiError(res?.message || "Invalid OTP. Try again.");
      }
    } catch (err) {
        console.log("Full API Error:", err);
    // Check if it's an Axios-style error with response data
    const apiMessage =
      err?.response?.data?.message || // server message
      err?.response?.data?.errors?.[0]?.message || // first error in array
      err?.message || // fallback JS error
      "Network error. Please try again.";

    setLoginApiError(apiMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryColor}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.flexContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Animatable.View
                animation="fadeInDown"
                duration={600}
                style={styles.header}
              >
                <LogoSVG style={styles.logo} />
              </Animatable.View>

              <Animatable.View animation="zoomIn" delay={200}>
                <Image
                  source={require("../../assets/images/login-bg.png")}
                  style={styles.illustration}
                  contentFit="contain"
                />
              </Animatable.View>

              <Animatable.View
                animation="fadeInUp"
                delay={300}
                style={styles.formCard}
              >
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

                {!otpSent && (
                  <Input
                    label="Mobile Number"
                    value={phone}
                    onChangeText={(value) => {
                      setPhone(value.replace(/[^0-9]/g, "").trim());
                      setErrors({});
                    }}
                    error={!!errors?.phone}
                    errorMessage={errors?.phone}
                    isNumberOnly
                    maxLength={10}
                    keyboardType="number-pad"
                    placeholder="Enter 10-digit mobile number"
                  />
                )}

                {otpSent && (
                  <>
                    <Text
                      style={{ color: "#fff", marginBottom: 8, fontSize: 16 }}
                    >
                      Enter OTP
                    </Text>
                    <OtpInput length={4} value={otp} setValue={setOtp} />

                    {errors?.otp && (
                      <Text
                        style={{
                          color: "red",
                          fontSize: 13,
                          textAlign: "center",
                        }}
                      >
                        {errors?.otp}
                      </Text>
                    )}

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
                        <Text style={styles.resendLimit}>
                          ⚠️ Max resend attempts reached
                        </Text>
                      )}
                    </View>
                  </>
                )}

                {loginApiError ? (
                  <Text style={styles.errorText}>{loginApiError}</Text>
                ) : null}

                <Button
                  onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                  isLoading={isLoading}
                  style={{ marginTop: 20 }}
                  label={otpSent ? "Login" : "Get OTP"}
                  gradientColor={["#D36C32", "#F68F00"]}
                  disabled={
                    otpSent ? otp.trim().length !== 4 || isLoading : isLoading
                  }
                />
              </Animatable.View>
            </ScrollView>

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
  scrollContent: { alignItems: "center", paddingBottom: 40 },
  header: { alignItems: "center", marginTop: 20 },
  logo: { width: 80, height: 80 },
  illustration: { width: width * 0.9, height: height * 0.3, marginTop: 10 },
  formCard: {
    backgroundColor: "#093658",
    width: "90%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginTop: 30,
    gap: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 5,
    color: "#ffffffff",
  },
  formSubtitle: { fontSize: 16, color: "#bebebeff", marginBottom: 16 },
  resendContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
    marginRight: 20,
  },
  resendText: { color: COLORS.secondaryColor, fontSize: 14, fontWeight: "500" },
  resendLimit: { color: "#FFB300", fontSize: 13, fontWeight: "600" },
  errorText: {
    color: "#FF4444",
    marginTop: 12,
    fontSize: 13,
    textAlign: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  signupText: { color: "#FFF", fontSize: 14 },
  signupLink: { color: "#D87129", fontWeight: "700", fontSize: 14 },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 12,
  },
  otpBox: {
    width: 50,
    height: 55,
    borderWidth: 2,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    borderColor: COLORS.secondaryColor,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  otpBoxFilled: { borderColor: "#fff" },
});

export default Login;
