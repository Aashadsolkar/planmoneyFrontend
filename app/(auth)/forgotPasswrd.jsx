import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    Alert,
    SafeAreaView
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";
import PassWordInput from '../components/Password';
import Input from '../components/Input';
import Button from '../components/Button';
import { requestOtp, resetPasswordPreLogin, verifyOtp } from "../utils/apiCaller";
import { Modal } from "react-native";
import * as Animatable from "react-native-animatable"
import { CheckCircle } from "lucide-react-native"

const { height, width } = Dimensions.get("window");

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resendDisabled, setResendDisabled] = useState(true);
    const [timer, setTimer] = useState(30);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [successfullModal, setSuccessfullModal] = useState(false);

    const scrollViewRef = useRef(null);

    useEffect(() => {
        let interval;
        if (resendDisabled && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setResendDisabled(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer, resendDisabled]);

    const startResendTimer = () => {
        setResendDisabled(true);
        setTimer(30);
        // Simulate OTP resend
        // Alert.alert("OTP Sent", "A new OTP has been sent to your email");
    };

    const passwordRules = [
        { label: 'Be at least 8 characters', test: (p) => p.length >= 8 },
        { label: 'Include uppercase letter', test: (p) => /[A-Z]/.test(p) },
        { label: 'Include a number', test: (p) => /[0-9]/.test(p) },
        { label: 'Include a special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
    ];

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long.");
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            setPasswordError("Password must contain at least one uppercase letter.");
            return false;
        }
        if (!/[0-9]/.test(password)) {
            setPasswordError("Password must contain at least one number.");
            return false;
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            setPasswordError("Password must contain at least one special character.");
            return false;
        }

        setPasswordError(""); // No error
        return true;
    };


    const handleSendOTP = async () => {
        if (!email) {
            setEmailError("Email is required");
            return;
        }

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email");
            return;
        }

        setEmailError("");
        setLoading(true);

        try {
            const payload = {
                email: email
            }
            const response = await requestOtp(payload);
            setStep(2);
            setLoading(false);
            startResendTimer();
        } catch (error) {
            if (error.errors.email) {
                setEmailError(error.errors.email[0]);
            }
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setOtpError("Invalid OTP", "Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);

        // setTimeout(() => {
        //     setLoading(false);
        //     setStep(3);
        // }, 1500);

        // Simulate API call
        try {
            const payload = {
                otp: otp,
                email: email
            }
            const response = await verifyOtp(payload)
            setStep(3);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setOtpError(error?.message)
        }
    };

    const handleResetPassword = async () => {
        // Reset all error messages
        // setConfirmPassword("");
        setPasswordError("");
        setPasswordConfirmError("");

        // Frontend Validation
        let valid = true;

        if (!newPassword) {
            setPasswordError("New password is required");
            valid = false;
        } else if (!validatePassword(newPassword)) {
            valid = false;
        }

        if (!confirmPassword) {
            setPasswordConfirmError("Please confirm your new password");
            valid = false;
        } else if (newPassword !== confirmPassword) {
            setPasswordConfirmError("Passwords do not match");
            valid = false;
        }

        if (!valid) return;
        setLoading(true);
        try {
            const payload = {
                password: newPassword,
                password_confirmation: confirmPassword,
                email: email
            }
            const response = await resetPasswordPreLogin(payload)
            setLoading(false);
            setSuccessfullModal(true);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }


    };

    const renderStepIndicator = () => {
        return (
            <View style={styles.stepIndicator}>
                {[1, 2, 3].map((item) => (
                    <View key={item} style={styles.stepRow}>
                        <View
                            style={[
                                styles.stepDot,
                                step >= item && styles.activeStepDot
                            ]}
                        >
                            {step > item && (
                                <Ionicons name="checkmark" size={12} color="#fff" />
                            )}
                            {step === item && (
                                <Text style={styles.stepNumber}>{item}</Text>
                            )}
                        </View>
                        {item < 3 && (
                            <View
                                style={[
                                    styles.stepLine,
                                    step > item && styles.activeStepLine
                                ]}
                            />
                        )}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <LinearGradient
                        style={styles.background}
                        colors={[COLORS.primaryColor, COLORS.primaryColor]}
                    >
                        <ScrollView
                            ref={scrollViewRef}
                            contentContainerStyle={styles.scrollContainer}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="arrow-back" size={24} color="#ffffff" />
                            </TouchableOpacity>

                            <View style={styles.contentContainer}>
                                {/* Header Image */}
                                <Image
                                    // source={require("../../assets/images/forgot-password-bg.png")} 
                                    style={styles.animation}
                                    resizeMode="contain"
                                    height={30}
                                />

                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>
                                        {step === 1 ? "Forgot Password" :
                                            step === 2 ? "Verify OTP" :
                                                "Reset Password"}
                                    </Text>

                                    <Text style={styles.cardSubtitle}>
                                        {step === 1 ? "Enter your email to receive a verification code" :
                                            step === 2 ? `We've sent a 6-digit code to ${email}` :
                                                "Create a new secure password"}
                                    </Text>

                                    {renderStepIndicator()}

                                    {/* Step 1: Enter Email */}
                                    {step === 1 && (
                                        <View style={styles.stepContainer}>
                                            <Input
                                                label={'Email id'}
                                                value={email}
                                                onChangeText={(value) => setEmail(value)}
                                                error={!!emailError}
                                                errorMessage={emailError}
                                            />
                                            <Button onClick={() => handleSendOTP()} isLoading={loading} label={'Send Verification Code'} gradientColor={['#D36C32', '#F68F00']} buttonStye={{ marginTop: 10 }} />
                                        </View>
                                    )}

                                    {/* Step 2: Enter OTP */}
                                    {step === 2 && (
                                        <View style={styles.stepContainer}>
                                            <PassWordInput
                                                label={'ENTER OTP'}
                                                value={otp}
                                                onChangeText={(value) => setOtp(value)}
                                                error={!!otpError}
                                                errorMessage={otpError}
                                                isPassword={true}
                                                isNumberOnly={true}
                                            />
                                            <Button onClick={() => handleVerifyOTP()} isLoading={loading} label={'Verify Code'} gradientColor={['#D36C32', '#F68F00']} buttonStye={{ marginTop: 10 }} />

                                            <TouchableOpacity
                                                disabled={resendDisabled}
                                                style={styles.resendButton}
                                                onPress={startResendTimer}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={[
                                                    styles.resendText,
                                                    resendDisabled && styles.disabledText
                                                ]}>
                                                    {resendDisabled ? `Resend code in ${timer}s` : "Resend code"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {/* Step 3: Reset Password */}
                                    {step === 3 && (
                                        <View style={styles.stepContainer}>
                                            <PassWordInput
                                                label={'Enter Password'}
                                                value={newPassword}
                                                onChangeText={(value) => {
                                                    setNewPassword(value);
                                                    if (passwordError) setPasswordError("");
                                                }}
                                                // error={!!}
                                                // errorMessage={errors.password}
                                                isPassword={true}
                                                error={!!passwordError}
                                                errorMessage={passwordError}
                                            />
                                            <PassWordInput
                                                label={'Confirm You Password'}
                                                value={confirmPassword}
                                                onChangeText={(value) => {
                                                    setConfirmPassword(value);
                                                    if (passwordConfirmError) setPasswordConfirmError("");
                                                }}
                                                error={!!passwordConfirmError}
                                                errorMessage={passwordConfirmError}
                                                isPassword={true}
                                            />



                                            <View style={styles.passwordRequirements}>
                                                <Text style={styles.requirementTitle}>Password must:</Text>
                                                {passwordRules.map((rule, i) => {
                                                    const passed = rule.test(newPassword);
                                                    return (
                                                        <View key={i} style={styles.requirementItem}>
                                                            <Ionicons
                                                                name={passed ? "checkmark-circle" : "ellipse-outline"}
                                                                size={16}
                                                                color={passed ? "#4CAF50" : "#999"}
                                                            />
                                                            <Text style={styles.requirementText}>{rule.label}</Text>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={handleResetPassword}
                                                disabled={loading}
                                                activeOpacity={0.8}
                                            >
                                                {loading ? (
                                                    <ActivityIndicator color="#fff" size="small" />
                                                ) : (
                                                    <Text style={styles.buttonText}>Reset Password</Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </ScrollView>
                    </LinearGradient>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            {/* Success Modal */}
            <Modal visible={successfullModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={[styles.modalHeader, { justifyContent: "flex-end" }]}>
                            <TouchableOpacity onPress={() => setSuccessfullModal(false)}>
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingBottom: 30 }}>
                            <Animatable.View animation="bounceIn">
                                <View style={{ alignItems: "center", marginBottom: 10 }}>
                                    <CheckCircle color="green" size={60} />
                                    <Text style={styles.successText}>Success</Text>
                                    <Text style={styles.successMessage}>Your Password Updated Successfully.</Text>
                                </View>
                                <Button isLoading={false} buttonStye={{ marginHorizontal: 20 }} onClick={() => {
                                    setSuccessfullModal(false)
                                    router.push("login");
                                }} label={"Go To Login"} gradientColor={['#D36C32', '#F68F00']} />
                            </Animatable.View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: "100%",
        // height: "100%",
    },
    scrollContainer: {
        // flexGrow: 1,
        paddingHorizontal: 20,
    },
    contentContainer: {
        flex: 1,
        width: "100%",
        marginTop: 60,
        // justifyContent: "center",
        // alignItems: "center"
    },
    backButton: {
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    animation: {
        width: width * 0.7,
        height: width * 0.5,
        marginBottom: 20,
    },
    card: {
        backgroundColor: COLORS.cardColor,
        borderRadius: 20,
        padding: 24,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#fff",
        textAlign: "center",
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#fff",
        textAlign: "center",
        marginBottom: 24,
    },
    stepIndicator: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    stepRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    stepDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#E0E0E0",
        justifyContent: "center",
        alignItems: "center",
    },
    activeStepDot: {
        backgroundColor: "#04B719",
    },
    stepNumber: {
        color: "#000",
        fontSize: 12,
        fontWeight: "bold",
    },
    stepLine: {
        width: 40,
        height: 2,
        backgroundColor: "#E0E0E0",
        marginHorizontal: 4,
    },
    activeStepLine: {
        backgroundColor: "#04B719",
    },
    stepContainer: {
        width: "100%",
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.fontWhite,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 12,
        // backgroundColor: "#F9F9F9",
        height: 56,
        position: "relative",
    },
    inputIcon: {
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        height: 56,
        fontSize: 16,
        color: "#333",
        paddingRight: 12,
    },
    eyeIcon: {
        padding: 12,
        position: "absolute",
        right: 0,
        height: "100%",
        justifyContent: "center",
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    button: {
        backgroundColor: "#8E54E9",
        borderRadius: 12,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        shadowColor: "#8E54E9",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    resendButton: {
        alignItems: "center",
        marginTop: 16,
        padding: 8,
    },
    resendText: {
        color: COLORS.secondaryColor,
        fontWeight: "600",
    },
    disabledText: {
        color: "#999",
    },
    passwordRequirements: {
        marginTop: 8,
        marginBottom: 16,
        padding: 16,
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
    },
    requirementTitle: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 12,
        color: "#333",
    },
    requirementItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    requirementText: {
        fontSize: 13,
        color: "#666",
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: COLORS.cardColor,
        borderRadius: 20,
        paddingBottom: 20,
        width: "90%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    successText: {
        color: COLORS.fontWhite,
        fontSize: 25,
        textTransform: "uppercase",
        marginTop: 10,
        fontWeight: "600",
    },
    successMessage: {
        color: COLORS.fontWhite,
        fontSize: 14,
        marginTop: 5,
    },
});

export default ForgotPassword;