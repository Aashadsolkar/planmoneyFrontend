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
import { COLORS } from "../../constants.js";
import LogoSVG from "@components/LogoSVG";
import * as Animatable from "react-native-animatable";
import { login, RegisterPushNotificationToken } from "@utils/apiCaller";
import { Image } from "expo-image";
import { getExpoPushToken } from "../../push-notification/notificationService";

const { width, height } = Dimensions.get("window");

// ─── Helper ────────────────────────────────────────────────────────────────────
const detectInputType = (value) => {
  if (/^[6-9]\d{9}$/.test(value)) return "phone";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email";
  return null;
};

const isValidPhone = (v) => /^[6-9]\d{9}$/.test(v.trim());
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// ─── OTP Input ─────────────────────────────────────────────────────────────────
const OtpInput = ({ length = 4, value, setValue }) => {
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, "");
    let newValue = value.split("");
    newValue[index] = digit;
    setValue(newValue.join("").trim());
    if (digit && index < length - 1) inputs.current[index + 1].focus();
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

// ─── Login Screen ──────────────────────────────────────────────────────────────
const Login = () => {
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [inputType, setInputType] = useState(null);  // "email" | "phone" | null
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [loginApiError, setLoginApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [customerId, setCustomerId] = useState(null);

  const { storeUserData } = useAuth();

  // ── Input change handler ──
  const handleIdentifierChange = (text) => {
    // For phone: allow only digits; for email/mixed: allow everything
    const looksLikePhone = /^\d+$/.test(text.replace(/\s/g, ""));
    const cleaned = looksLikePhone
      ? text.replace(/[^0-9]/g, "").trim()
      : text.trim();

    setIdentifier(cleaned);
    setErrors({});
    setLoginApiError("");

    // Live detect so keyboard type can update hint text
    setInputType(detectInputType(cleaned));
  };

  // ── Validate before sending OTP ──
  const validateIdentifier = () => {
    const v = identifier.trim();
    if (!v) {
      setErrors({ identifier: "Please enter your mobile number or email" });
      return false;
    }
    if (/^\d+$/.test(v)) {
      // Looks like a phone attempt
      if (!isValidPhone(v)) {
        setErrors({ identifier: "Enter a valid 10-digit mobile number" });
        return false;
      }
    } else {
      // Assume email attempt
      if (!isValidEmail(v)) {
        setErrors({ identifier: "Enter a valid email address" });
        return false;
      }
    }
    return true;
  };

  // ── Send / Resend OTP ──
  const handleSendOtp = async () => {
    console.log("identifier", identifier);
    if (!validateIdentifier()) return;
    if (resendCount >= 3) {
      setLoginApiError("You have reached maximum OTP resend attempts.");
      return;
    }

    setIsLoading(true);
    setLoginApiError("");
    console.log("identifier", identifier);
    try {
      const res = await login({ email_or_phone: identifier.trim() });
      console.log("res", res);
      if (res?.data?.customer_id) {
        setOtpSent(true);
        setCustomerId(res.data.customer_id);
        setResendCount((prev) => prev + 1);
        setTimer(30);
        setOtp("");

        const countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) { clearInterval(countdown); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else {
        setLoginApiError(res?.message || "Failed to send OTP");
      }
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        err?.message ||
        "Network error. Please try again.";
      setLoginApiError(apiMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Verify OTP ──
  const handleVerifyOtp = async () => {
    console.log("otp", otp);
    const trimmedOtp = otp.trim();
    if (trimmedOtp.length !== 4) {
      setErrors({ otp: "Enter a valid 4-digit OTP" });
      return;
    }

    setIsLoading(true);
    setLoginApiError("");

    try {
      console.log("customerId", customerId);
      const res = await login({ customer_id: customerId, otp: trimmedOtp });
      console.log("res", res);
      console.log("res", res);
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
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        err?.message ||
        "Network error. Please try again.";
      setLoginApiError(apiMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Derived hint for placeholder / label ──
  const getInputHint = () => {
    if (inputType === "phone") return "Mobile number detected ✓";
    if (inputType === "email") return "Email detected ✓";
    return null;
  };

  const hint = getInputHint();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryColor} />

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
              <Animatable.View animation="fadeInDown" duration={600} style={styles.header}>
                <Image source={require("../../assets/images/new_logo.png")} style={styles.logo} />
                
              </Animatable.View>

              <Animatable.View animation="zoomIn" delay={200}>
                <Image
                  source={require("../../assets/images/login-bg (2).png")}
                  style={styles.illustration}
                  contentFit="contain"
                />
              </Animatable.View>

              <Animatable.View animation="fadeInUp" delay={300} style={styles.formCard}>
                <View>
                  <Text style={styles.formTitle}>
                    {otpSent ? "Enter OTP" : "Welcome Back, Login!"}
                  </Text>
                  <Text style={styles.formSubtitle}>
                    {otpSent
                      ? `OTP sent to ${identifier.trim()}`
                      : "Enter your mobile number or email to receive OTP."}
                  </Text>
                </View>

                {/* ── Identifier Input ── */}
                {!otpSent && (
                  <>
                    <Input
                      label="Mobile Number or Email"
                      value={identifier}
                      onChangeText={handleIdentifierChange}
                      error={!!errors?.identifier}
                      errorMessage={errors?.identifier}
                      keyboardType={
                        // start with numeric; switches automatically as user types
                        identifier === "" || /^\d+$/.test(identifier)
                          ? "phone-pad"
                          : "email-address"
                      }
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder="Mobile number or email"
                      maxLength={inputType === "phone" ? 10 : undefined}
                    />

                    {/* Live detection hint */}
                    {hint && !errors?.identifier && (
                      <Text style={styles.hintText}>{hint}</Text>
                    )}
                  </>
                )}

                {/* ── OTP Input ── */}
                {otpSent && (
                  <>
                    {/* Change identifier — let user go back */}
                    <TouchableOpacity
                      onPress={() => {
                        setOtpSent(false);
                        setOtp("");
                        setErrors({});
                        setLoginApiError("");
                      }}
                      style={styles.changeIdentifierRow}
                    >
                      <Text style={styles.changeIdentifierText}>
                        ← Change {inputType === "email" ? "email" : "number"}
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.otpLabel}>Enter OTP</Text>
                    <OtpInput length={4} value={otp} setValue={setOtp} />

                    {errors?.otp && (
                      <Text style={styles.otpError}>{errors.otp}</Text>
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
                              (timer > 0 || isLoading) && { opacity: 0.5 },
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

                {/* ── API Error ── */}
                {loginApiError ? (
                  <Text style={styles.errorText}>{loginApiError}</Text>
                ) : null}

                <Button
                  onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                  isLoading={isLoading}
                  style={{ marginTop: 20 }}
                  label={otpSent ? "Login" : "Get OTP"}
                  gradientColor={["#ff9f19", "#ff9f19"]}
                  disabled={
                    otpSent
                      ? otp.trim().length !== 4 || isLoading
                      : isLoading
                  }
                />
              </Animatable.View>
            </ScrollView>

            <View style={styles.bottomContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
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
  logo: { width: 350, height: 80 },
  illustration: { width: width * 0.9, height: height * 0.3, marginTop: 10 },
  formCard: {
    backgroundColor: COLORS.primaryColor,
    width: "90%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginTop: 30,
    gap: 5,
    boxShadow: COLORS.boxShadow,
  },
  formTitle: { fontSize: 24, fontWeight: "800", marginBottom: 5, color: COLORS.secondaryIconColor },
  formSubtitle: { fontSize: 16, color: COLORS.lightGray, marginBottom: 16 },
  hintText: { color: "#4CAF50", fontSize: 12, marginTop: -2, marginLeft: 2 },
  otpLabel: { color: COLORS.secondaryIconColor, marginBottom: 8, fontSize: 16 },
  otpError: { color: "red", fontSize: 13, textAlign: "center" },
  changeIdentifierRow: { marginBottom: 12, alignSelf: "flex-start" },
  changeIdentifierText: {
    color: COLORS.secondaryColor,
    fontSize: 13,
    fontWeight: "600",
  },
  resendContainer: { alignItems: "flex-end", marginBottom: 10, marginRight: 20 },
  resendText: { color: COLORS.secondaryColor, fontSize: 14, fontWeight: "500" },
  resendLimit: { color: "#FFB300", fontSize: 13, fontWeight: "600" },
  errorText: { color: "#FF4444", marginTop: 12, fontSize: 13, textAlign: "center" },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  signupText: { color: COLORS.lightGray, fontSize: 14 },
  signupLink: { color: COLORS.orangeColor, fontWeight: "700", fontSize: 14 },
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
    color: COLORS.primaryColor,
    borderColor: COLORS.secondaryColor,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  otpBoxFilled: {  color: COLORS.secondaryIconColor },
});

export default Login;