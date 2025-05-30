import React, { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../constants"
import Header from "../components/Header"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

export default function App() {
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [verificationType, setVerificationType] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef([]);

  const mobileNumber = "+91 8889968708"
  const emailAddress = "vigneshiyer212@gmail.com"

  const handleVerifyPress = (type) => {
    setVerificationType(type)
    setShowOTPModal(true)
    setOtp(["", "", "", "", "", ""])
    setTimeout(() => otpInputs.current[0]?.focus(), 100)
  }

  const handleOTPChange = (value, index) => {
    const cleanedValue = value.replace(/[^0-9]/g, "")
    const newOtp = [...otp]
    newOtp[index] = cleanedValue
    setOtp(newOtp)

    if (cleanedValue && index < 5) {
      otpInputs.current[index + 1]?.focus()
    }
  }

  const handleVerifyOTP = () => {
    const otpString = otp.join("")
    if (otpString.length === 6) {
      if (verificationType === "mobile") {
        setMobileVerified(true)
      } else {
        setEmailVerified(true)
      }
      setShowOTPModal(false)
      Alert.alert("Success", `${verificationType === "mobile" ? "Mobile number" : "Email address"} verified successfully!`)
    } else {
      Alert.alert("Error", "Please enter complete OTP")
    }
  }

  const handleResendOTP = () => {
    Alert.alert("OTP Sent", `OTP has been resent to your ${verificationType === "mobile" ? "mobile number" : "email address"}`)
  }

  return (
    <View style={styles.container}>
      <Header showBackButton={true} backButtonText={() => <Text style={{ color: COLORS.fontWhite, fontWeight: "600" }}>Account</Text>} />
      <View style={styles.content}>
        <Text style={styles.title}>Verify your Mobile No & Email Address</Text>

        {/* Mobile Section */}
        <View style={styles.verificationCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Mobile Number</Text>
          </View>
          <Text style={styles.contactInfo}>{mobileNumber}</Text>
          <View style={styles.statusRow}>
            {mobileVerified ? (
              <View style={styles.verifiedStatus}>
                <Ionicons name="checkmark-circle" size={16} color="#00ff88" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.verifyButton} onPress={() => handleVerifyPress("mobile")}>
                <Text style={styles.verifyButtonText}>Verify Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Email Section */}
        <View style={styles.verificationCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Email Address</Text>
          </View>
          <Text style={styles.contactInfo}>{emailAddress}</Text>
          <View style={styles.statusRow}>
            {emailVerified ? (
              <View style={styles.verifiedStatus}>
                <Ionicons name="checkmark-circle" size={16} color="#00ff88" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.verifyButton} onPress={() => handleVerifyPress("email")}>
                <Text style={styles.verifyButtonText}>Verify Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text onPress={() => router.push("changePassword")} style={{ color: COLORS.fontWhite }}>Change Your Password</Text>
      </View>

      {/* OTP Modal */}
      <Modal visible={showOTPModal} transparent animationType="slide" onRequestClose={() => setShowOTPModal(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verify your {verificationType === "mobile" ? "Mobile Number" : "Email Address"}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowOTPModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              We have sent a 4 Digit OTP to your {verificationType === "mobile" ? "Mobile Number" : "Email Address"}
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpInputs.current[index] = ref)}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOTPChange(value, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
                      otpInputs.current[index - 1]?.focus()
                    }
                  }}
                />
              ))}

            </View>

            <TouchableOpacity style={styles.resendButton} onPress={handleResendOTP}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.verifyOTPButton, { opacity: otp.join("").length === 6 ? 1 : 0.5 }]}
              onPress={handleVerifyOTP}
              disabled={otp.join("").length < 6}
            >
              <Text style={styles.verifyOTPButtonText}>VERIFY NOW</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryColor },
  gradient: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
    marginTop: 100
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: "600",
    color: "#fff",
    marginBottom: height * 0.04,
    textAlign: "left",
  },
  verificationCard: {
    backgroundColor: COLORS.cardColor,
    borderRadius: 12,
    padding: width * 0.04,
    marginBottom: height * 0.025,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  cardLabel: {
    fontSize: width * 0.035,
    color: "#ccc",
    fontWeight: "500",
  },
  contactInfo: {
    fontSize: width * 0.04,
    color: "#ffa500",
    fontWeight: "600",
    marginBottom: height * 0.015,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  verifyButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.008,
    borderRadius: 20,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: width * 0.032,
    fontWeight: "600",
  },
  verifiedStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedText: {
    color: "#00ff88",
    fontSize: width * 0.032,
    fontWeight: "600",
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.cardColor,
    padding: width * 0.06,
    borderTopStartRadius: 20,
    borderTopRightRadius: 20
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  modalTitle: {
    fontSize: width * 0.045,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalSubtitle: {
    fontSize: width * 0.035,
    color: "#ccc",
    textAlign: "center",
    marginBottom: height * 0.03,
    lineHeight: width * 0.05,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.03,
  },
  otpInput: {
    width: width * 0.11,
    height: width * 0.11,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
    fontSize: width * 0.05,
    color: "#fff",
  },
  resendButton: {
    alignSelf: "flex-start",
    marginBottom: height * 0.03,
  },
  resendText: {
    color: "#ffa500",
    fontSize: width * 0.035,
    fontWeight: "600",
  },
  verifyOTPButton: {
    backgroundColor: "#ffa500",
    paddingVertical: height * 0.018,
    borderRadius: 25,
    alignItems: "center",
  },
  verifyOTPButtonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "700",
  },
})
