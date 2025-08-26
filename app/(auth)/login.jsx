import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
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
import { login,RegisterPushNotificationToken } from "@utils/apiCaller"; // <-- adjust path
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

const handleVerifyOtp = async () => {
  if (otp.length !== 4) {
    setErrors({ otp: "Enter a valid 4 digit OTP" });
    return;
  }

  setIsLoading(true);
  setLoginApiError("");

  try {
    const res = await login({ customer_id: customerId, otp });
    console.log("Verify OTP Response:", res);

    if (res?.data?.token) {
      storeUserData(res.data.user, res.data.token);
      const deviceToken = await getExpoPushToken();
      if (deviceToken) {
        await RegisterPushNotificationToken(deviceToken, res.data.token);
      } else {
        console.warn("Device token is null, not sending to backend.");
      }
    } else {
      setLoginApiError(res?.message || "Invalid OTP. Try again.");
    }
  } catch (err) {
    console.error("Verify OTP Error:", err);
    setLoginApiError("Network error. Please try again.");
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
        <View style={styles.content}>
          {/* Logo */}
          <Animatable.View animation="fadeInDown" delay={100} duration={500}>
            <LogoSVG style={styles.logo} />
          </Animatable.View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.subText}>Login with your mobile number</Text>

            {/* Phone Input */}
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
              editable={!otpSent}
            />

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
                  isNumberOnly={true}
                  maxLength={6} // 🔹 Fixed consistent
                  autoFocus
                />

                {/* Resend Section */}
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
                        {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
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

            {/* Error */}
            {loginApiError ? (
              <Text style={styles.errorText}>{loginApiError}</Text>
            ) : null}
          </View>

          {/* Bottom Actions */}
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
                disabled={otp.length !== 6 || isLoading}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
  },
  flexContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logo: {
    alignSelf: "center",
    marginBottom: 18,
  },
  formContainer: {
    width: "100%",
    padding: 20,
    marginBottom: 20,
  },
  subText: {
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 22,
    fontSize: 17,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  resendContainer: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  resendText: {
    color: COLORS.secondaryColor,
    fontSize: 14,
    fontWeight: "500",
  },
  resendLimit: {
    color: "#FFB300",
    fontSize: 13,
    fontWeight: "600",
  },
  errorText: {
    color: "#FF4444",
    marginTop: 12,
    fontSize: 13,
    textAlign: "center",
  },
  bottomContainer: {
    width: "100%",
    paddingHorizontal: 5,
    marginTop: 10,
  },
  signupText: {
    color: "#B0C4DE",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
  },
  signupLink: {
    color: "#F68F00",
    fontWeight: "700",
    fontSize: 14,
  },
});

export default Login;
