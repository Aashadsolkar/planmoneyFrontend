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
import { changePassword, requestOtp, resetPasswordPreLogin, verifyOtp } from "../utils/apiCaller";
import { Modal } from "react-native";
import * as Animatable from "react-native-animatable"
import { CheckCircle } from "lucide-react-native"
import Header from "../components/Header";
import { useAuth } from "../context/useAuth";

const { height, width } = Dimensions.get("window");

const ChangePassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [resendDisabled, setResendDisabled] = useState(true);
    const [timer, setTimer] = useState(30);
    const [loading, setLoading] = useState(false);
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [successfullModal, setSuccessfullModal] = useState(false);
    const { token } = useAuth();

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
    const passwordRules = [
        { label: 'Be at least 8 characters', test: (p) => p.length >= 8 },
        { label: 'Include uppercase letter', test: (p) => /[A-Z]/.test(p) },
        { label: 'Include a number', test: (p) => /[0-9]/.test(p) },
        { label: 'Include a special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
    ];

    const validateForm = () => {
        let valid = true;

        if (!oldPassword) {
            setOldPasswordError("Old password is required");
            valid = false;
        }

        if (!newPassword || !validatePassword(newPassword)) {
            setPasswordError("Password must meet all rules");
            valid = false;
        }

        if (!confirmPassword || newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            valid = false;
        }

        return valid;
    };




    const handleUpdatePassword = async () => {
        // Reset all error messages
        setOldPasswordError("");
        setPasswordError("");
        setConfirmPasswordError("");

        // Frontend Validation
        let valid = true;
        if (!oldPassword) {
            setOldPasswordError("Old password is required");
            valid = false;
        }
        

        if (!newPassword) {
            setPasswordError("New password is required");
            valid = false;
        } else if (!validatePassword(newPassword)) {
            // setPasswordError("Password must be at least 8 characters");
            valid = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Please confirm your new password");
            valid = false;
        } else if (newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            valid = false;
        }

        if (!valid) return;

        setLoading(true);
        try {
            const payload = {
                current_password: oldPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            };

            const response = await changePassword(payload, token);

            // If success
            setSuccessfullModal(true);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            const res = error?.response?.data || error;

            // API Error Handling
            if (res?.message === "Current password is incorrect.") {
                setOldPasswordError("Current password is incorrect.");
            } else if (res?.message === "Validation failed" && res.errors) {
                if (res.errors?.new_password?.includes("The new password field confirmation does not match.")) {
                    setConfirmPasswordError("New password confirmation does not match.");
                } else {
                    setConfirmPasswordError("Password update failed. Please check your inputs.");
                }
            } else {
                Alert.alert("Error", res?.message || "Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor }}>
            <Header showBackButton={true} />
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
                            <View style={styles.contentContainer}>
                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>
                                        Update Password
                                    </Text>

                                    <Text style={styles.cardSubtitle}>
                                        You can update your password form here
                                    </Text>
                                    <View style={styles.stepContainer}>

                                        <PassWordInput
                                            label={'Enter Old Password'}
                                            value={oldPassword}
                                            onChangeText={(value) => {
                                                setOldPassword(value);
                                                if (oldPasswordError) setOldPasswordError("");
                                            }}
                                            isPassword={true}
                                            error={!!oldPasswordError}
                                            errorMessage={oldPasswordError}
                                        />
                                        <PassWordInput
                                            label={'Enter New Password'}
                                            value={newPassword}
                                            onChangeText={(value) => {
                                                setNewPassword(value);
                                                if (passwordError) setPasswordError("");
                                            }}
                                            error={!!passwordError}
                                            errorMessage={passwordError}
                                            isPassword={true}
                                        />
                                        <PassWordInput
                                            label={'Confirm You New Password'}
                                            value={confirmPassword}
                                            onChangeText={(value) => {
                                                setConfirmPassword(value);
                                                setConfirmPasswordError("");
                                            }}
                                            error={!!confirmPasswordError}
                                            errorMessage={confirmPasswordError}
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
                                            onPress={() => handleUpdatePassword()}
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
                                    router.push("home");
                                }} label={"Done"} gradientColor={['#D36C32', '#F68F00']} />
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
        marginTop: 80,
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

export default ChangePassword;