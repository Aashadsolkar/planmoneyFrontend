import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@components/Button";
import { COLORS } from "../constants";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import Input from "@components/Input";
import { validateField, validateForm } from "@utils/validator";
import { useAuth } from "@context/useAuth";
import LogoSVG from "@components/LogoSVG";
import * as Animatable from "react-native-animatable";
import BouncyCheckbox from "react-native-bouncy-checkbox";

// ✅ import API calls
import { sendEmailOtp, sendSmsOtp, verifyRegisterOtp, register } from "@utils/apiCaller";

const { width } = Dimensions.get("window");

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState(0);
  const scrollRef = useRef(null);

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);

  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);

  const [panChecked, setPanChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const { storeUserData } = useAuth();

  const goToStep = (nextStep) => {
    setStep(nextStep);
    scrollRef.current?.scrollTo({ x: nextStep * width, animated: true });
  };

  const handleChange = (value, name) => {
    setApiError("");
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  // ✅ Send Email OTP
  const handleSendEmailOtp = async () => {
    if (!formData.email || errors.email) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email first" }));
      return;
    }
    try {
      setIsLoading(true);
      await sendEmailOtp({ email: formData.email, name: formData.name });
      setEmailOtp("");
      setEmailOtpSent(true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setApiError(err.message || "Failed to send email OTP");
    }
  };

  // ✅ Verify Email OTP
  const handleVerifyEmailOtp = async () => {
    try {
      setIsLoading(true);
      await verifyRegisterOtp({ email_or_phone: formData.email, otp: emailOtp });
      setEmailOtpVerified(true);
      goToStep(2);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setErrors((prev) => ({ ...prev, emailOtp: err.message || "Invalid OTP" }));
    }
  };

  // ✅ Send Phone OTP
  const handleSendPhoneOtp = async () => {
    if (!formData.phone || errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "Enter a valid phone number" }));
      return;
    }
    try {
      setIsLoading(true);
      await sendSmsOtp({ phone: formData.phone });
      setPhoneOtp("");
      setPhoneOtpSent(true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setApiError(err.message || "Failed to send phone OTP");
    }
  };

  // ✅ Verify Phone OTP
  const handleVerifyPhoneOtp = async () => {
    try {
      setIsLoading(true);
      await verifyRegisterOtp({ email_or_phone: formData.phone, otp: phoneOtp });
      setPhoneOtpVerified(true);
      goToStep(3);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setErrors((prev) => ({ ...prev, phoneOtp: err.message || "Invalid OTP" }));
    }
  };

  // ✅ Final Submit
  const handleSubmit = async () => {
    const newErrors = validateForm(formData);

    if (!emailOtpVerified) newErrors.emailOtp = "Verify your email first";
    if (!phoneOtpVerified) newErrors.phoneOtp = "Verify your phone first";
    if (!panChecked) newErrors.panCheck = "You must confirm PAN name is correct";
    if (!termsChecked) newErrors.termsCheck = "You must accept Terms & Conditions";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const res = await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });

        alert("Registered successfully!");
        setIsLoading(false);

        // ✅ Save user in context
        storeUserData(
          { name: res?.user?.name, email: res?.user?.email, phone: res?.user?.phone },
          res?.token
        );

        router.push("/home");
      } catch (error) {
        setApiError(error.message || "Registration failed. Please try again.");
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryColor} />
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Logo */}
        <Animatable.View animation="fadeIn" delay={200} duration={600}>
          <View style={styles.logoContainer}>
            <LogoSVG />
          </View>
        </Animatable.View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[styles.progressDot, step === i && styles.progressDotActive]}
            />
          ))}
        </View>
        <Text style={styles.stepText}>Step {step + 1} of 4</Text>

        {/* Steps */}
      <ScrollView
  ref={scrollRef}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  scrollEnabled={false}
  keyboardShouldPersistTaps="handled"
>
  {/* Step 1 - Name */}
  <View style={styles.stepBox}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Full Name"
          autoFocus
          value={formData.name}
          onChangeText={(val) => handleChange(val, "name")}
          error={!!errors?.name}
          errorMessage={errors?.name || ""}
        />
        <BouncyCheckbox
          size={20}
          fillColor="#F68F00"
          unfillColor="#fff"
          isChecked={panChecked}
          text="Enter your name as per PAN card"
          textStyle={styles.checkboxText}
          onPress={(checked) => setPanChecked(checked)}
        />
        {errors?.panCheck && <Text style={styles.errorText}>{errors.panCheck}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  </View>

  {/* Step 2 - Email */}
  <View style={styles.stepBox}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Email Address"
          value={formData.email}
          autoFocus
          onChangeText={(val) => !emailOtpVerified && handleChange(val, "email")}
          editable={!emailOtpVerified}
          rightIcon={
            emailOtpVerified ? <Icon name="lock" size={18} color="#ccc" /> : null
          }
          error={!!errors?.email}
          errorMessage={errors?.email || ""}
        />
        {!emailOtpVerified && !emailOtpSent && (
          <Button onClick={handleSendEmailOtp} label="Send OTP" small buttonStye={{ marginTop: 10 }} />
        )}
        {emailOtpSent && !emailOtpVerified && (
          <Animatable.View animation="fadeInUp" duration={400} style={styles.otpBox}>
            <Input
              label="Enter Email OTP"
              value={emailOtp}
              onChangeText={setEmailOtp}
              keyboardType="numeric"
              maxLength={6}
              autoFocus
              error={!!errors?.emailOtp}
              errorMessage={errors?.emailOtp || ""}
            />
            <Button onClick={handleVerifyEmailOtp} label="Verify OTP" small buttonStye={{ marginTop: 10 }} />
          </Animatable.View>
        )}
        {emailOtpVerified && <Text style={styles.successText}>Email verified ✅</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  </View>

  {/* Step 3 - Phone */}
  <View style={styles.stepBox}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Mobile Number"
          value={formData.phone}
          autoFocus
          onChangeText={(val) => !phoneOtpVerified && handleChange(val, "phone")}
          editable={!phoneOtpVerified}
          rightIcon={
            phoneOtpVerified ? <Icon name="lock" size={18} color="#ccc" /> : null
          }
          error={!!errors?.phone}
          errorMessage={errors?.phone || ""}
        />
        {!phoneOtpVerified && !phoneOtpSent && (
          <Button onClick={handleSendPhoneOtp} label="Send OTP" small buttonStye={{ marginTop: 10 }} />
        )}
        {phoneOtpSent && !phoneOtpVerified && (
          <Animatable.View animation="fadeInUp" duration={400} style={styles.otpBox}>
            <Input
              label="Enter Phone OTP"
              value={phoneOtp}
              onChangeText={setPhoneOtp}
              keyboardType="numeric"
              maxLength={6}
              autoFocus
              error={!!errors?.phoneOtp}
              errorMessage={errors?.phoneOtp || ""}
            />
            <Button onClick={handleVerifyPhoneOtp} label="Verify OTP" small buttonStye={{ marginTop: 10 }} />
          </Animatable.View>
        )}
        {phoneOtpVerified && <Text style={styles.successText}>Phone verified ✅</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  </View>

  {/* Step 4 - Review & Final */}
  <View style={styles.stepBox}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.reviewCard}>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Full Name</Text>
            <Text style={styles.reviewValueBig}>{formData.name || "--"}</Text>
          </View>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Email</Text>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewValueBig}>{formData.email || "--"}</Text>
              {emailOtpVerified && (
                <Icon name="check-circle" size={20} color="lightgreen" style={{ marginLeft: 8 }} />
              )}
            </View>
          </View>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Phone</Text>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewValueBig}>{formData.phone || "--"}</Text>
              {phoneOtpVerified && (
                <Icon name="check-circle" size={20} color="lightgreen" style={{ marginLeft: 8 }} />
              )}
            </View>
          </View>
        </View>
        <BouncyCheckbox
          size={20}
          fillColor="#F68F00"
          unfillColor="#fff"
          isChecked={termsChecked}
          text="I accept the Terms & Conditions"
          textStyle={styles.checkboxText}
          iconStyle={{ borderColor: "#F68F00" }}
          onPress={(checked) => setTermsChecked(checked)}
        />
        {errors?.termsCheck && <Text style={styles.errorText}>{errors.termsCheck}</Text>}
        <Button
          onClick={handleSubmit}
          isLoading={isLoading}
          label="SIGN UP"
          gradientColor={["#D36C32", "#F68F00"]}
          buttonStye={{ marginTop: 25 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  </View>
</ScrollView>

        {apiError ? <Text style={styles.apiErrorText}>{apiError}</Text> : null}

        {/* Floating navigation buttons */}
        <View style={styles.navButtons}>
          {step > 0 && (
            <TouchableOpacity
              style={[styles.navBtn, { backgroundColor: "#444" }]}
              onPress={() => goToStep(step - 1)}
            >
              <Icon name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
          )}
          {step < 3 && (
            <TouchableOpacity style={styles.navBtn} onPress={() => goToStep(step + 1)}>
              <Icon name="arrow-forward" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.footerLink} onPress={() => router.push("/login")}>
              Sign in
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#012744" },
  flexContainer: { flex: 1 },
  logoContainer: { alignItems: "center", marginBottom: 10, marginTop: 30 },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
    gap: 6,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#555",
  },
  progressDotActive: {
    backgroundColor: "#F68F00",
    width: 20,
  },

  stepText: { color: "#fff", textAlign: "center", marginBottom: 10, fontSize: 14, opacity: 0.7 },
  stepBox: {
    width,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: "flex-start",
  },
  otpBox: { marginTop: 15, padding: 12, backgroundColor: "#083b5c", borderRadius: 10 },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
  successText: { color: "lightgreen", fontSize: 13, marginTop: 12, textAlign: "center" },
  checkboxText: { color: "#d4e7ff", fontSize: 13, textDecorationLine: "none" },
  apiErrorText: { color: "red", marginTop: 10, textAlign: "center", fontSize: 12 },
  footer: { padding: 15, backgroundColor: COLORS.primaryColor },
  footerText: { color: COLORS.fontWhite, textAlign: "center" },
  footerLink: { color: "#D87129", fontWeight: "600" },

  navButtons: {
    position: "absolute",
    bottom: 100,
    right: 20,
    flexDirection: "row",
    gap: 12,
  },
  navBtn: {
    backgroundColor: "#F68F00",
    borderRadius: 40,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  // Review Card
  reviewCard: {
    backgroundColor: "#083b5c",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  reviewItem: {
    marginBottom: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(49, 193, 255, 0.38)",
    paddingBottom: 10,
  },
  reviewLabel: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 4,
  },
  reviewValueBig: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Register;
