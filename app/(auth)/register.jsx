import React, { useState, useRef, useEffect } from "react";
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
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@components/Button";
import { COLORS } from "../../constants.js";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import Input from "@components/Input";
import { validateField, validateForm } from "@utils/validator";
import { useAuth } from "@context/useAuth";
import LogoSVG from "@components/LogoSVG";
import * as Animatable from "react-native-animatable";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { sendEmailOtp, sendSmsOtp, verifyRegisterOtp, register } from "@utils/apiCaller";
import { showToast } from "../../components/CustomToast/ToastService";

const { width } = Dimensions.get("window");

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  
  const [step, setStep] = useState(0);
  const scrollRef = useRef(null);

  // Email OTP states
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailResendCount, setEmailResendCount] = useState(0);
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [emailLoading, setEmailLoading] = useState(false);
  const emailOtpRef = useRef(null);

  // Phone OTP states
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);
  const [phoneResendCount, setPhoneResendCount] = useState(0);
  const [phoneCooldown, setPhoneCooldown] = useState(0);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const phoneOtpRef = useRef(null);

  const [panChecked, setPanChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const { storeUserData } = useAuth();

  // Countdown timers
  useEffect(() => {
    if (emailCooldown <= 0) return;
    const timer = setInterval(() => setEmailCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [emailCooldown]);

  useEffect(() => {
    if (phoneCooldown <= 0) return;
    const timer = setInterval(() => setPhoneCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [phoneCooldown]);

  const handleChange = (value, name) => {
    setApiError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) || "" }));
  };

  // Step validation logic
  const canGoNext = () => {
    switch (step) {
      case 0:
        return formData.name && panChecked;
      case 1:
        return emailOtpVerified;
      case 2:
        return phoneOtpVerified;
      default:
        return true;
    }
  };

  const goToStep = (nextStep) => {
    if (nextStep < 0 || nextStep > 3) return;
    if (nextStep > step && !canGoNext()) return; // prevent forward without validation
    setStep(nextStep);
    scrollRef.current?.scrollTo({ x: nextStep * width, animated: true });
  };

  // Send Email OTP
  const handleSendEmailOtp = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (emailResendCount >= 3) {
      setErrors((prev) => ({ ...prev, emailOtp: "Resend limit reached" }));
      return;
    }
    try {
      setEmailLoading(true);
      await sendEmailOtp({ email: formData.email, name: formData.name });
      setEmailOtp("");
      setEmailOtpSent(true);
      setEmailResendCount((c) => c + 1);
      setEmailCooldown(30);
      setEmailLoading(false);
      setTimeout(() => emailOtpRef.current?.focus(), 400);
    } catch (err) {
      setApiError(err.message || "Failed to send email OTP");
      setEmailLoading(false);
    }
  };

  // Verify Email OTP
  const handleVerifyEmailOtp = async () => {
    if (!/^\d{6}$/.test(emailOtp)) {
      setErrors((prev) => ({ ...prev, emailOtp: "Enter a valid 6-digit OTP" }));
      return;
    }
    try {
      setEmailLoading(true);
      await verifyRegisterOtp({ email_or_phone: formData.email, otp: emailOtp });
      setEmailOtpVerified(true);
      setEmailLoading(false);
      goToStep(2);
    } catch (err) {
      setErrors((prev) => ({ ...prev, emailOtp: err.message || "Invalid OTP" }));
      setEmailLoading(false);
    }
  };

  // Send Phone OTP
  const handleSendPhoneOtp = async () => {
    if (!formData.phone) {
      setErrors((prev) => ({ ...prev, phone: "Phone is required" }));
      return;
    }
    if (phoneResendCount >= 3) {
      setErrors((prev) => ({ ...prev, phoneOtp: "Resend limit reached" }));
      return;
    }
    try {
      setPhoneLoading(true);
      await sendSmsOtp({ phone: formData.phone });
      setPhoneOtp("");
      setPhoneOtpSent(true);
      setPhoneResendCount((c) => c + 1);
      setPhoneCooldown(30);
      setPhoneLoading(false);
      setTimeout(() => phoneOtpRef.current?.focus(), 400);
    } catch (err) {
      setApiError(err.message || "Failed to send phone OTP");
      setPhoneLoading(false);
    }
  };

  // Verify Phone OTP
  const handleVerifyPhoneOtp = async () => {
    if (!/^\d{6}$/.test(phoneOtp)) {
      setErrors((prev) => ({ ...prev, phoneOtp: "Enter a valid 6-digit OTP" }));
      return;
    }
    try {
      setPhoneLoading(true);
      await verifyRegisterOtp({ email_or_phone: formData.phone, otp: phoneOtp });
      setPhoneOtpVerified(true);
      setPhoneLoading(false);
      goToStep(3);
    } catch (err) {
      setErrors((prev) => ({ ...prev, phoneOtp: err.message || "Invalid OTP" }));
      setPhoneLoading(false);
    }
  };

  // Final submit
  const handleSubmit = async () => {
    const newErrors = validateForm(formData);
    if (!emailOtpVerified) newErrors.emailOtp = "Verify your email first";
    if (!phoneOtpVerified) newErrors.phoneOtp = "Verify your phone first";
    if (!panChecked) newErrors.panCheck = "Confirm PAN name is correct";
    if (!termsChecked) newErrors.termsCheck = "Accept Terms & Conditions";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await register({
          fullname: formData.name,
          email: formData.email,
          phone: formData.phone,
        });
        showToast({
          type: "success",
          title: "Registration Successful! 🎉",
          message: `Welcome aboard, ${formData.name}!`,
        });
        if (!res?.data?.user || !res?.data?.token) throw new Error(res?.message || "Registration failed");
        storeUserData(res.data.user, res.data.token);
        router.push("/home");
      } catch (err) {
        setApiError(err.message || "Registration failed. Try again.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryColor} />
      <KeyboardAvoidingView style={styles.flexContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Animatable.View animation="fadeIn" delay={200} duration={600}>
          <View style={styles.logoContainer}>
            <LogoSVG width={80} height={80} />
          </View>
        </Animatable.View>

        <View style={styles.progressContainer}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.progressDot, step === i && styles.progressDotActive]} />
          ))}
        </View>
        <Text style={styles.stepText}>Step {step + 1} of 4</Text>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step 1 */}
          <View style={styles.stepBox}>
            <Input
              label="Full Name"
              value={formData.name}
              autoFocus
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
          </View>

          {/* Step 2 */}
          <View style={styles.stepBox}>
            <Input
              label="Email Address"
              value={formData.email}
              onChangeText={(val) => !emailOtpVerified && handleChange(val, "email")}
              editable={!emailOtpVerified}
              rightIcon={emailOtpVerified ? <Icon name="lock" size={18} color="#ccc" /> : null}
              error={!!errors?.email}
              errorMessage={errors?.email || ""}
            />
            {!emailOtpVerified && (
              <Button
                onClick={handleSendEmailOtp}
                label={emailCooldown > 0 ? `Resend in ${emailCooldown}s` : emailOtpSent ? "Resend OTP" : "Send OTP"}
                isLoading={emailLoading}
                small={false}
                disabled={emailLoading || emailCooldown > 0}
                gradientColor={["#F68F00", "#D36C32"]}
                buttonStye={{ marginTop: 15, borderRadius: 10 }}
              />
            )}
            {emailOtpSent && !emailOtpVerified && (
              <Animatable.View animation="fadeInUp" duration={400} style={styles.otpBox}>
                <TextInput
                  ref={emailOtpRef}
                  style={styles.otpInput}
                  value={emailOtp}
                  onChangeText={(val) => setEmailOtp(val.replace(/[^0-9]/g, "").slice(0, 6))}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholder="Enter Email OTP"
                  placeholderTextColor="#aaa"
                />
                {errors?.emailOtp && <Text style={styles.errorText}>{errors.emailOtp}</Text>}
                <Button
                  onClick={handleVerifyEmailOtp}
                  label="Verify OTP"
                  isLoading={emailLoading}
                  small={false}
                  disabled={emailLoading}
                  gradientColor={["#F68F00", "#D36C32"]}
                  buttonStye={{ marginTop: 12, borderRadius: 10 }}
                />
              </Animatable.View>
            )}
            {emailOtpVerified && <Text style={styles.successText}>Email verified ✅</Text>}
          </View>

          {/* Step 3 */}
          <View style={styles.stepBox}>
            <Input
              label="Mobile Number"
              value={formData.phone}
              onChangeText={(val) => !phoneOtpVerified && handleChange(val, "phone")}
              editable={!phoneOtpVerified}
              rightIcon={phoneOtpVerified ? <Icon name="lock" size={18} color="#ccc" /> : null}
              error={!!errors?.phone}
              errorMessage={errors?.phone || ""}
            />
            {!phoneOtpVerified && (
              <Button
                onClick={handleSendPhoneOtp}
                label={phoneCooldown > 0 ? `Resend in ${phoneCooldown}s` : phoneOtpSent ? "Resend OTP" : "Send OTP"}
                isLoading={phoneLoading}
                small={false}
                disabled={phoneLoading || phoneCooldown > 0}
                gradientColor={["#F68F00", "#D36C32"]}
                buttonStye={{ marginTop: 15, borderRadius: 10 }}
              />
            )}
            {phoneOtpSent && !phoneOtpVerified && (
              <Animatable.View animation="fadeInUp" duration={400} style={styles.otpBox}>
                <TextInput
                  ref={phoneOtpRef}
                  style={styles.otpInput}
                  value={phoneOtp}
                  onChangeText={(val) => setPhoneOtp(val.replace(/[^0-9]/g, "").slice(0, 6))}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholder="Enter Phone OTP"
                  placeholderTextColor="#aaa"
                />
                {errors?.phoneOtp && <Text style={styles.errorText}>{errors.phoneOtp}</Text>}
                <Button
                  onClick={handleVerifyPhoneOtp}
                  label="Verify OTP"
                  isLoading={phoneLoading}
                  small={false}
                  disabled={phoneLoading}
                  gradientColor={["#F68F00", "#D36C32"]}
                  buttonStye={{ marginTop: 12, borderRadius: 10 }}
                />
              </Animatable.View>
            )}
            {phoneOtpVerified && <Text style={styles.successText}>Phone verified ✅</Text>}
          </View>

          {/* Step 4 */}
          <View style={styles.stepBox}>
            <View style={styles.reviewCard}>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Full Name</Text>
                <Text style={styles.reviewValueBig}>{formData.name || "--"}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Email</Text>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewValueBig}>{formData.email || "--"}</Text>
                  {emailOtpVerified && <Icon name="check-circle" size={20} color="lightgreen" style={{ marginLeft: 8 }} />}
                </View>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Phone</Text>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewValueBig}>{formData.phone || "--"}</Text>
                  {phoneOtpVerified && <Icon name="check-circle" size={20} color="lightgreen" style={{ marginLeft: 8 }} />}
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
              isLoading={emailLoading || phoneLoading}
              label="Create Account"
              gradientColor={["#D36C32", "#F68F00"]}
              buttonStye={{ marginTop: 25, borderRadius: 10 }}
            />
          </View>
        </ScrollView>

        {apiError ? <Text style={styles.apiErrorText}>{apiError}</Text> : null}

        <View style={styles.navButtonsContainer}>
          {step > 0 && (
            <TouchableOpacity style={[styles.navBtn, { backgroundColor: "#083b5c" }]} onPress={() => goToStep(step - 1)}>
              <Icon name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
          )}
          {step < 3 && (
            <TouchableOpacity
              style={[styles.navBtn, { backgroundColor: canGoNext() ? "#F68F00" : "#555" }]}
              onPress={() => goToStep(step + 1)}
              disabled={!canGoNext()}
            >
              <Icon name="arrow-forward" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

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
  logoContainer: { alignItems: "center", marginBottom: 10, marginTop: 20 },
  progressContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 10, gap: 6 },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#555", marginHorizontal: 4 },
  progressDotActive: { backgroundColor: "#F68F00" },
  stepText: { color: "#fff", textAlign: "center", marginBottom: 12, fontSize: 14, opacity: 0.8 },
  stepBox: { width, paddingHorizontal: 20, paddingTop: 20, justifyContent: "flex-start", flex: 1 },
  otpBox: { marginTop: 15, padding: 15, backgroundColor: "#083b5c", borderRadius: 12 },
  otpInput: { backgroundColor: "#fff", borderRadius: 8, padding: 12, fontSize: 16, textAlign: "center", letterSpacing: 4 },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
  successText: { color: "lightgreen", fontSize: 13, marginTop: 12, textAlign: "center" },
  checkboxText: { color: "#d4e7ff", fontSize: 13, textDecorationLine: "none", marginLeft: 6 },
  apiErrorText: { color: "red", marginTop: 10, textAlign: "center", fontSize: 12 },
  navButtonsContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 15 },
  navBtn: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center" },
  footer: { padding: 15, backgroundColor: COLORS.primaryColor },
  footerText: { color: COLORS.fontWhite, textAlign: "center", fontSize: 13 },
  footerLink: { color: "#D87129", fontWeight: "600" },
  reviewCard: { backgroundColor: "#083b5c", borderRadius: 12, padding: 20, marginBottom: 20 },
  reviewItem: { marginBottom: 18 },
  reviewLabel: { color: "#fff", fontSize: 13, opacity: 0.7 },
  reviewValueBig: { color: "#fff", fontSize: 16, fontWeight: "600" },
  reviewRow: { flexDirection: "row", alignItems: "center" },
});

export default Register;
