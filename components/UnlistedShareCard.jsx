import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Modal,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import * as Animatable from "react-native-animatable";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../constants.js";
import { useAuth } from "@context/useAuth";
import Button from "@components/Button";
import { showToast } from "@components/CustomToast/ToastService";
import { generateUnlistedLead } from "@utils/apiCaller";
import CustomTextInput from "./Input";
import { leads } from "../utils/apiCaller";

const { height } = Dimensions.get("window");

const IMAGE_BASE_URL = "https://planmoney.in/assets/logo/";
const SALES_NUMBER = "+918108181602";

const UnlistedShareCard = ({ item }) => {
  const { profileData, token, logout } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: profileData?.name || "",
    email: profileData?.email || "",
    phone: profileData?.phone || "",
  });

  const handleCall = () => {
    Linking.openURL(`tel:${SALES_NUMBER}`);
  };

  const validate = () => {
    let err = {};

    if (!form.name) err.name = "Name is required";
    if (!form.email) err.email = "Email is required";
    if (!form.phone || form.phone.length < 10)
      err.phone = "Valid phone required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        lead_source: "app",
        customer_id: profileData?.customer_id,
        name: profileData?.name,
        email: profileData?.email,
        phone: profileData?.phone,
        description: item.company_name,
        service_id: "7"
      }

      
      const response = await leads(token, payload);

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (error) {
      setIsSubmitting(false);
      showToast({
        type: "error",
        title: "Something went wrong 😥",
        message: error?.message || "Failed to submit request",
        sessionExired:
          error?.error === "Another session is active." ? true : false,
        logout: logout,
      });
    }
  };

  return (
    <>
      {/* ================= CARD ================= */}
      <Animatable.View animation="fadeInUp" style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.companyRow}>
            <View style={styles.logoWrapper}>
              <Image
                source={
                  item.company_logo
                    ? { uri: IMAGE_BASE_URL + item.company_logo }
                    : require("../assets/images/placeholder.jpg")
                }
                style={styles.logo}
                contentFit="contain"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.companyName} numberOfLines={1}>
                {item.company_name}
              </Text>
              <Text style={styles.subText}>Unlisted Equity</Text>
            </View>
          </View>

          <View style={styles.priceBadge}>
            <Text style={styles.price}>₹ {item.current_price}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.lightText}>Market Cap (Cr)</Text>
            <Text style={styles.boldText}>{item.market_cap || "-"}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.lightText}>PE Ratio</Text>
            <Text style={styles.boldText}>{item.stock_pe_ratio || "-"}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.lightText}>Rating</Text>
            <Text style={styles.boldText}>{item.rating || "-"} ⭐</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.callText}>I am Intrested</Text>
          <Ionicons name="cart" size={18} color={COLORS.orangeColor} />
        </TouchableOpacity>
      </Animatable.View>

      {/* ================= MODAL ================= */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {!isSuccess && "Get today's best deal"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setIsSuccess(false);
                  setErrors({});
                }}
              >
                <Ionicons name="close" size={24} color={COLORS.secondaryIconColor} />
              </TouchableOpacity>
            </View>

            {isSuccess ? (
              <Animatable.View
                animation="bounceIn"
                style={{ alignItems: "center", paddingHorizontal: 20 }}
              >
                <Text
                  style={{
                    color: COLORS.fontWhite,
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  Thank you. Our team will reach out to you shortly
                </Text>

                <TouchableOpacity
                  onPress={handleCall}
                  style={[styles.callButton, { marginTop: 20 }]}
                >
                  <Ionicons name="call" size={18} color="#fff" />
                  <Text style={styles.callText}>Call Now</Text>
                </TouchableOpacity>
              </Animatable.View>
            ) : (
              <View style={{ paddingHorizontal: 20 }}>
                <CustomTextInput
                  label="Name"
                  value={form.name}
                  onChangeText={(v) => setForm({ ...form, name: v })}
                  error={errors.name}
                  errorMessage={errors.name}
                />

                <CustomTextInput
                  label="Email"
                  value={form.email}
                  onChangeText={(v) => setForm({ ...form, email: v })}
                  error={errors.email}
                  errorMessage={errors.email}
                />

                <CustomTextInput
                  label="Phone"
                  value={form.phone}
                  onChangeText={(v) => setForm({ ...form, phone: v })}
                  error={errors.phone}
                  errorMessage={errors.phone}
                  isNumberOnly
                />

                <Button
                  isLoading={isSubmitting}
                  buttonStye={{ marginHorizontal: 20, marginTop: 10 }}
                  onClick={handleSubmit}
                  label="Submit"
                  gradientColor={["#D36C32", "#F68F00"]}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default React.memo(UnlistedShareCard);


/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardColor,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    elevation: 6,
    boxShadow: COLORS.boxShadow,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logo: {
    width: 28,
    height: 28,
  },
  companyName: {
    color: COLORS.fontWhite,
    fontWeight: "700",
    fontSize: 15,
  },
  subText: {
    color: COLORS.lightGray,
    fontSize: 12,
  },
  priceBadge: {
    backgroundColor: "rgba(0,200,83,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  price: {
    color: COLORS.profitColor,
    fontWeight: "800",
    fontSize: 15,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  lightText: {
    color: COLORS.lightGray,
    fontSize: 10,
  },
  boldText: {
    color: COLORS.fontWhite,
    fontWeight: "700",
    fontSize: 14,
    marginTop: 4,
  },
  callButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.secondaryIconColor,
    paddingVertical: 12,
    borderRadius: 30,
    paddingHorizontal: 20
  },
  callText: {
    color: COLORS.fontWhite,
    fontWeight: "700",
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(224, 213, 228, 0.5)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: COLORS.cardColor,
    borderRadius: 20,
    width: "90%",
    alignSelf: "center",
    maxHeight: height * 0.7,
    paddingBottom: 20,
    boxShadow: COLORS.boxShadow,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  modalTitle: {
    color: COLORS.fontWhite,
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: COLORS.primaryColor,
    borderRadius: 12,
    padding: 14,
    // marginHorizontal: 20,
    marginBottom: 12,
    color: COLORS.fontWhite,
  },
});
