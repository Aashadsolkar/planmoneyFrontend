import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Switch,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants.js";
import Header from "@components/Header";
import { router } from "expo-router";
import { useAuth } from "@context/useAuth";
import { isBiometricEnabled, setBiometricEnabled } from "@utils/auth";
import {
  createMobileOTP,
  generateVerifyEmailOpt,
  updateCapital,
  verifyEmailOpt,
  verifyMobileOTP,
} from "@utils/apiCaller";
import AntDesign from "@expo/vector-icons/AntDesign";
import Input from "@components/Input";

import { showToast } from "@components/CustomToast/ToastService";

const { width, height } = Dimensions.get("window");

export default function App() {
  const { profileData, token, logout, portfolioServices } = useAuth();
  const [errors, setErrors] = useState({});
  const [isCapitalFormUpdate, setIsCapitalFormUpdate] = useState(false);
  const [isUpdateCapitalLoading, setIsUpdateCapitalLoading] = useState(false);
  const [formData, setFormData] = useState({
    captal_amount: String(
      profileData?.customerfinanceinfo?.capital_amount ?? ""
    ),
  });

  useEffect(() => {
    setFormData({
      captal_amount: profileData?.customerfinanceinfo?.capital_amount
    })
  },[profileData])  

  const [updatedCapitalAmount, setUpdatedCapitalAmount] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const mobileNumber = profileData?.phone || "";
  const emailAddress = profileData?.email || "";

  const handleChange = (value, name) => {
    setErrors({});
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (formData?.captal_amount == "") {
      newErrors.capital_amount = "Amount is required";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        setIsUpdateCapitalLoading(true);
        const payload = {
          capital_amount: formData?.captal_amount || "",
        };
        const response = await updateCapital(token, payload);
        setUpdatedCapitalAmount(formData?.captal_amount);

        setIsCapitalFormUpdate(false);
        setIsUpdateCapitalLoading(false);
      } catch (error) {
        setIsUpdateCapitalLoading(false);
        showToast({
          type: "error",
          title: `Something went wrong! 😥`,
          message: `${error?.error || error?.message || "Failed to update capital"}`,
          redirectPath: "home",
          sessionExired: error?.error == "Another session is active." ? true : false,
          logout: logout
        });
      }
    }
  };

  // Format currency
  const formatCurrency = useCallback((amount) => {
    return `₹ ${Math.abs(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    })}`;
  }, []);

  useEffect(() => {
    isBiometricEnabled().then(setEnabled);
  }, []);

  const toggle = async (value) => {
    setEnabled(value);
    await setBiometricEnabled(value);
  };

  const renderCapitalAmountSection = () => {
    if (portfolioServices.length > 0 && profileData?.customerfinanceinfo) {
      return (
        <View style={[styles.verificationCard, { marginBottom: 0 }]}>
          <View style={[styles.cardHeader, { marginBottom: 0 }]}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={styles.cardLabel}>Capital Amount: </Text>
              <Text style={{ color: COLORS.fontWhite, paddingRight: 10 }}>
                {formatCurrency(
                  updatedCapitalAmount || formData.captal_amount
                )}
              </Text>
            </View>
            <AntDesign name="edit" size={20} color="#fff" />
          </View>
        </View>
      )
    } else {
      return null
    }
  }

  const renderCapitalSection = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => setIsCapitalFormUpdate(true)}
        >
          {renderCapitalAmountSection()}
        </TouchableOpacity>
        <Modal visible={isCapitalFormUpdate} transparent animationType="slide">
          <View style={styles.modalOverlay_capital_modal}>
            <View style={styles.modalContent_capital_modal}>
              <View
                style={[styles.modalHeader, { justifyContent: "flex-end" }]}
              >
                <TouchableOpacity onPress={() => setIsCapitalFormUpdate(false)}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    color: COLORS.fontWhite,
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  Update your Capital Amount.
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Capital Amount"
                      value={formData.captal_amount}
                      onChangeText={(val) => handleChange(val, "captal_amount")}
                      error={!!errors?.captal_amount}
                      errorMessage={errors?.captal_amount}
                      isNumberOnly={true}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    style={styles.updateButton}
                  >
                    {isUpdateCapitalLoading ? (
                      <ActivityIndicator
                        style={{ paddingHorizontal: 16 }}
                        color={"#fff"}
                        size="small"
                      />
                    ) : (
                      <Text style={styles.cardLabel}>UPDATE</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={{ color: COLORS.lossColor }}>
                  {errors?.capital_amount}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
      <Header
        showBackButton={true}
        backButtonText={() => (
          <Text
            style={{ color: COLORS.fontWhite, fontWeight: 600, fontSize: 18 }}
          >
            Account
          </Text>
        )}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>
              Your Mobile Number & Email Address
            </Text>

            {/* Mobile Section */}
            <View style={styles.verificationCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Mobile Number</Text>
              </View>
              <Text style={styles.contactInfo}>{mobileNumber}</Text>
              <View style={styles.statusRow}>
                  <View style={styles.verifiedStatus}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#00ff88"
                    />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
              </View>
            </View>

            {/* Email Section */}
            <View style={styles.verificationCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Email Address</Text>
              </View>
              <Text style={styles.contactInfo}>
                {emailAddress?.toLowerCase()}
              </Text>
              <View style={styles.statusRow}>
                  <View style={styles.verifiedStatus}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#00ff88"
                    />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
              </View>
            </View>
            {renderCapitalSection()}

            {/* ************Local auth setup ********************* */}
{/* 
            <View style={styles.card}>
              <Text style={styles.label}>Use Biometric Authentication</Text>
              <Switch
                value={enabled}
                onValueChange={toggle}
                trackColor={{ false: "#555", true: "#4cd964" }}
                thumbColor={enabled ? "#fff" : "#ff4444"}
              />
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryColor },
  gradient: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: "600",
    color: COLORS.secondaryColor,
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
    boxShadow: COLORS.boxShadow,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  cardLabel: {
    fontSize: width * 0.035,
    color: COLORS.fontWhite,
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
    color: COLORS.secondaryColor,
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
  modalOverlay_capital_modal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.cardColor,
    padding: width * 0.06,
    borderTopStartRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContent_capital_modal: {
    backgroundColor: COLORS.cardColor,
    padding: 20,
    borderRadius: 20,
    width: "90%",
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
  updateButton: {
    backgroundColor: COLORS.secondaryColor,
    paddingHorizontal: 20,
    paddingVertical: 23,
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 5,
  },
  card: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: COLORS.cardColor,
    borderRadius: 12,
    marginVertical:20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});
