import React, { useState } from "react";
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
import PassWordInput from "@components/Password";
import Input from "@components/Input";
import { validateField, validateForm } from "@utils/validator";
import { RegisterPushNotificationToken, registor } from "@utils/apiCaller";
import { useAuth } from "@context/useAuth";
import LogoSVG from "@components/LogoSVG";
import * as Animatable from "react-native-animatable";
import { getExpoPushToken } from "../../push-notification/notificationService";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const { height } = Dimensions.get("window");

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [panChecked, setPanChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const { storeUserData } = useAuth();

  const handleChange = (value, name) => {
    setApiError("");
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const fieldError = validateField(name, value);

    let confirmPasswordError = errors.confirmPassword;
    if (["password", "confirmPassword"].includes(name)) {
      confirmPasswordError =
        updatedForm.password &&
        updatedForm.confirmPassword &&
        updatedForm.password !== updatedForm.confirmPassword
          ? "Passwords do not match"
          : "";
    }

    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
      ...(name === "password" || name === "confirmPassword"
        ? { confirmPassword: confirmPasswordError }
        : {}),
    }));
  };

  const handleSubmit = async () => {
    const newErrors = validateForm(formData);

    if (
      formData.password !== formData.confirmPassword &&
      !newErrors.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!panChecked) {
      newErrors.panCheck = "You must confirm PAN name is correct";
    }
    if (!termsChecked) {
      newErrors.termsCheck = "You must accept Terms & Conditions";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await registor({
          fullname: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          terms_and_conditions: true,
        });
        storeUserData(response?.data?.user, response?.data?.token);
        const deviceToken = await getExpoPushToken();
        if (deviceToken) {
          await RegisterPushNotificationToken(deviceToken, response.data.token);
        }
        setIsLoading(false);
      } catch (error) {
        if (error.errors) {
          const serverErrors = {};
          ["name", "email", "phone", "password"].forEach((field) => {
            if (error.errors[field]) {
              serverErrors[field] = error.errors[field][0];
            }
          });
          setErrors((prev) => ({ ...prev, ...serverErrors }));
        } else {
          setApiError(
            error.message || "Registration failed. Please try again."
          );
        }
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryColor}
      />
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <Animatable.View animation="fadeIn" delay={200} duration={600}>
            <View style={styles.logoContainer}>
              <LogoSVG />
            </View>
          </Animatable.View>

          {/* Title */}
          <Text style={styles.titleText}>
            Create your account to manage your finances
          </Text>

          {/* Form */}
          <Animatable.View animation="fadeInUp" duration={600} delay={100}>
            <Input
              label="Full Name"
              value={formData.name}
              onChangeText={(val) => handleChange(val, "name")}
              error={!!errors?.name}
              errorMessage={errors?.name}
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={600} delay={200}>
            <Input
              label="Email Address"
              value={formData.email}
              onChangeText={(val) => handleChange(val, "email")}
              error={!!errors?.email}
              errorMessage={errors?.email}
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={600} delay={300}>
            <Input
              label="Mobile Number"
              value={formData.phone}
              onChangeText={(val) => handleChange(val, "phone")}
              error={!!errors?.phone}
              errorMessage={errors?.phone}
            />
          </Animatable.View>

          {/* <Animatable.View animation="fadeInUp" duration={600} delay={400}>
            <PassWordInput
              label="Password"
              value={formData.password}
              onChangeText={(val) => handleChange(val, "password")}
              isPassword
              error={!!errors?.password}
              errorMessage={errors?.password}
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={600} delay={500}>
            <PassWordInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(val) => handleChange(val, "confirmPassword")}
              isPassword
              error={!!errors?.confirmPassword}
              errorMessage={errors?.confirmPassword}
            />
          </Animatable.View> */}

          {/* PAN checkbox */}
          <View style={styles.checkboxRow}>
            <BouncyCheckbox
              size={20}
              fillColor="#F68F00"
              unfillColor="#fff"
              isChecked={panChecked}
              text="Enter your name as per PAN card"
              textStyle={{
                color: "#d4e7ff",
                fontSize: 13,
                textDecorationLine: "none",
              }}
              onPress={(checked) => setPanChecked(checked)}
            />
            {errors?.panCheck && (
              <Text style={styles.errorText}>{errors.panCheck}</Text>
            )}
          </View>
          {errors?.panCheck && (
            <Text style={styles.errorText}>{errors.panCheck}</Text>
          )}

          {/* Terms & Conditions checkbox */}
          <View style={styles.checkboxRow}>
            <BouncyCheckbox
              size={20}
              fillColor="#F68F00"
              unfillColor="#fff"
              isChecked={termsChecked}
              text="I accept the Terms & Conditions"
              textStyle={{
                color: "#d4e7ff",
                fontSize: 13,
                textDecorationLine: "none",
              }}
              iconStyle={{ borderColor: "#F68F00" }}
              onPress={(checked) => setTermsChecked(checked)}
            />
          </View>
          {errors?.termsCheck && (
            <Text style={styles.errorText}>{errors.termsCheck}</Text>
          )}

          {apiError ? (
            <Text style={styles.apiErrorText}>{apiError}</Text>
          ) : null}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            label="SIGN UP"
            gradientColor={["#D36C32", "#F68F00"]}
          />
          <View style={{ flexDirection: "row", justifyContent: "center" ,marginTop:20 }}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#012744" },
  flexContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  logoContainer: { alignItems: "center", marginBottom: height * 0.05,marginTop:20 },
  titleText: {
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
    fontSize: 17,
    textAlign: "center",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  infoText: {
    fontSize: 13,
    color: "#d4e7ff",
    marginLeft: 8,
    flexShrink: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 30,
    marginBottom: 4,
  },
  apiErrorText: {
    color: "red",
    marginTop: 10,
    textAlign: "right",
    fontSize: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: COLORS.primaryColor,
  },
  footerText: {
    color: COLORS.fontWhite,
    textAlign: "center",
    marginBottom: 10,
  },
  footerLink: { color: "#D87129", fontWeight: "600" },
});

export default Register;
