import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "@components/Header";
import { COLORS } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@components/Button";
import { useAuth } from "@context/useAuth";
import {
  applyCouponApi,
  applyReferralApi,
  buySubscription,
  pgCreateOrder,
} from "@utils/apiCaller";
import { router, useNavigation } from "expo-router";
import Input from "@components/Input";
import * as Linking from "expo-linking";
import { showToast } from "@components/CustomToast/ToastService";
import { formatDateToDDMMYYYY, formatIndianNumber } from "../../utils/commonFunctions";

export default function Checkout() {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showCouponDiscount, setShowCouponDiscount] = useState(false);
  const { selectedService, token, profileData, setPrePaymentDetails, logout } =
    useAuth();
  const [couponErrorMsg, setCouponErrorMsg] = useState("");
  const [referralError, setReferralError] = useState(null);
  const [referral, setReferral] = useState("");
  // const userReturnURL = Linking.createURL("/orderConfirm");
  const userReturnURL = `planmoney://orderConfirm`;
  const [isLoading, setIsLoading] = useState(false);

  const basePrice = selectedService.offer_price ?? selectedService.actual_price;
  const totalPrice = basePrice - discount;

  const baseAmount = (totalPrice).toFixed(2);
  const CGST = (baseAmount * 0.09).toFixed(2);
  const SGST = (baseAmount * 0.09).toFixed(2);
  const finalTotal = (parseFloat(baseAmount) + parseFloat(CGST) + parseFloat(SGST)).toFixed(2);




  const generateOrderNumber = () => {
    const randomSixDigit = Math.floor(100000 + Math.random() * 900000); // Ensures 6 digits
    return `ORDER_${randomSixDigit}`;
  };

  const handlePay = async () => {
    try {
      const orderID = generateOrderNumber();
      const payload = {
        order_id: orderID,
        order_amount: parseFloat(baseAmount),
        customer_id: profileData?.customer_id,
        customer_email: profileData?.email,
        customer_phone: profileData?.phone?.replace(/\D/g, ""),
        app_return_url: `https://hunger.webiknows.in/payment.html?order_id={order_id}&return_url=${userReturnURL}`,
      };
      const response = await pgCreateOrder(token, payload);
      setIsLoading(false);
      let prePaymentDetails = {
        order_id: orderID,
        order_amount: parseFloat(finalTotal),
        customer_id: profileData?.customer_id,
        referral_code: referral,
      };
      if (showCouponDiscount) {
        prePaymentDetails["coupon_code"] = couponCode;
      }
      setPrePaymentDetails(prePaymentDetails);
      router.push({
        pathname: "/checkoutWebView",
        params: {
          sessionId: response?.data?.payment_session_id,
          orderId: response?.data?.order_id,
        },
      });
    } catch (error) {
      setIsLoading(false);
      showToast({
        type: "error",
        title: `Order Failed! 😥`,
        message: `${error?.error || error?.message || "Failed to generate payment" }`,
        redirectPath: "home",
        sessionExired: error?.error == "Another session is active." ? true : false,
        logout: logout
      });
    }
  };

  const applyCoupon = async () => {
    try {
      const payload = {
        coupon_code: couponCode,
        amount: basePrice,
      };
      const couponResponse = await applyCouponApi(token, payload);
      setDiscount(couponResponse?.data?.discount);
      setShowCouponDiscount(true);
    } catch (error) {
      setAppliedCoupon("");
      setDiscount(0);
      setShowCouponDiscount(false);
      setCouponErrorMsg(error?.message || "Applied Coupon api failed");
    }
  };

  const applyReferral = async () => {
    try {
      const payload = {
        referral_code: referral,
      };
      const ReferralResponse = await applyReferralApi(token, payload);
      handlePay();
    } catch (error) {
      setIsLoading(false);
      setReferralError(
        error?.errors?.referral_code[0] || "Referral Api Failed."
      );
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    if (referral) {
      applyReferral();
    } else {
      handlePay();
    }
  };

  const getPlanExpiryDate = (planType) => {
    const currentDate = new Date();
    let futureDate = new Date(currentDate);

    switch (planType.toLowerCase()) {
      case "monthly":
        futureDate.setMonth(futureDate.getMonth() + 1);
        break;
      case "quarterly":
        futureDate.setMonth(futureDate.getMonth() + 3);
        break;
      case "half-yearly":
        futureDate.setMonth(futureDate.getMonth() + 6);
        break;
      case "yearly":
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        break;
      default:
        return "Invalid plan type";
    }

    const formattedDate = formatDateToDDMMYYYY(futureDate);

    return `Expires on ${formattedDate}`;
  };

  const renderOfferPrice = (actual, offer) => {
    const safeActual = actual ?? 0;
    const safeOffer = offer ?? 0;

    // If both are 0 or missing → show nothing
    if (!safeActual && !safeOffer) return null;

    // If actual is missing or 0 → show only offer
    if (!safeActual) {
      return safeOffer ? (
        <Text style={styles.subscriptionPrice}>₹{formatIndianNumber(safeOffer)}</Text>
      ) : null;
    }

    // If offer is missing or 0 → show only actual
    if (!safeOffer) {
      return safeActual ? (
        <Text style={styles.subscriptionPrice}>₹{formatIndianNumber(safeActual)}</Text>
      ) : null;
    }

    // If both are same → show offer
    if (safeActual === safeOffer) {
      return <Text style={styles.subscriptionPrice}>₹{formatIndianNumber(safeOffer)}</Text>;
    }

    // Else → show actual (strikethrough) + offer
    return (
      <>
        <Text
          style={[
            styles.subscriptionPrice,
            {
              fontWeight: 400,
              color: COLORS.lightGray,
              textDecorationLine: "line-through",
            },
          ]}
        >
          ₹{formatIndianNumber(safeActual)}
        </Text>
        <Text style={styles.subscriptionPrice}>₹{formatIndianNumber(safeOffer)}</Text>
      </>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
      <Header showBackButton={true} />
      <ScrollView style={{ backgroundColor: COLORS.primaryColor }}>
        {/* Coupon Section */}
        {!showCouponDiscount ? (
          <View>
            <View style={styles.couponContainer}>
              <TextInput
                style={styles.couponInput}
                placeholder="Apply Coupon"
                placeholderTextColor="#888"
                value={couponCode}
                onChangeText={(val) => {
                  setCouponCode(val);
                  setCouponErrorMsg("");
                }}
              />
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyCoupon}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "red", paddingStart: 20, marginBottom: 5 }}>
              {couponErrorMsg}
            </Text>
          </View>
        ) : (
          <View style={styles.appliedCouponContainer}>
            <View style={styles.savedContainer}>
              <Text style={styles.discountAmount}>Coupon applied.</Text>
              <Text style={[styles.discountAmount, { fontSize: 17 }]}>
                CODE: {couponCode}
              </Text>
              <Text style={styles.savedText}>Saved: ₹{discount}</Text>
            </View>
            <View style={styles.appliedBadge}>
              <Text
                style={styles.appliedText}
                onPress={() => {
                  setAppliedCoupon("");
                  setDiscount(0);
                  setShowCouponDiscount(false);
                  setCouponCode("");
                }}
              >
                Remove
              </Text>
            </View>
          </View>
        )}

        {/* Subscription Details */}
        <View style={styles.subscriptionCard}>
          <View
            style={{
              borderBottomWidth: 1,
              borderBlockColor: COLORS.primaryColor,
              paddingBottom: 10,
              marginBottom: 10,
            }}
          >
            <View style={[styles.subscriptionHeader, { alignItems: "flex-start" }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.subscriptionTitle]}>
                  {selectedService?.name}
                </Text>
                <Text style={styles.expiryText}>
                  {getPlanExpiryDate(selectedService?.billing_cycle)}
                </Text>
              </View>
              <View style={{}}>
                {renderOfferPrice(selectedService?.actual_price, selectedService?.offer_price)}
                <Text style={[styles.subscriptionDuration]}>
                  {selectedService?.billing_cycle || ""}
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.expiryText, { marginBottom: 10 }]}>
            If you Pay ₹{selectedService?.offer_price}/- now. The plan is valid
            till {getPlanExpiryDate(selectedService?.billing_cycle)}{" "}
          </Text>
          <Text
            style={[
              styles.expiryText,
              {
                backgroundColor: COLORS.primaryColor,
                padding: 10,
                fontSize: 10,
              },
            ]}
          >
            Note: Please don’t worry, we’ll remind you for the payment
          </Text>

          {/* Grand Total Section */}
          {showCouponDiscount && (
            <View
              style={{
                borderTopWidth: 1,
                borderBlockColor: COLORS.primaryColor,
                paddingTop: 10,
                marginTop: 10,
              }}
            >
              <View style={[styles.subscriptionHeader]}>
                <Text style={{ color: "#fff" }}>Coupon Discount</Text>
                <Text style={styles.discountValue}>
                  You saved <Text style={styles.greenText}>-₹{discount}</Text>
                </Text>
              </View>
            </View>
          )}

          <View
            style={{
              borderTopWidth: 1,
              borderBlockColor: COLORS.primaryColor,
              paddingTop: 10,
              marginTop: 10,
            }}
          >
            <View style={[styles.subscriptionHeader]}>
              <Text style={{ color: "#fff" }}>Base Amount</Text>
              <Text
                style={[
                  styles.subscriptionPrice,
                  {fontSize: 14, fontWeight: 400}
                ]}
              >
                ₹{formatIndianNumber(baseAmount)}
              </Text>
            </View>
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderBlockColor: COLORS.primaryColor,
              paddingTop: 10,
              marginTop: 10,
            }}
          >
            <View style={[styles.subscriptionHeader]}>
              <Text style={{ color: "#fff" }}>CGST 9%</Text>
              <Text
                style={[
                  styles.subscriptionPrice,
                  {fontSize: 14, fontWeight: 400}
                ]}
              >
                ₹{formatIndianNumber(CGST)}
              </Text>
            </View>
          </View>
           <View
            style={{
              borderTopWidth: 1,
              borderBlockColor: COLORS.primaryColor,
              paddingTop: 10,
              marginTop: 10,
            }}
          >
            <View style={[styles.subscriptionHeader]}>
              <Text style={{ color: "#fff" }}>SGST 9%</Text>
              <Text
                style={[
                  styles.subscriptionPrice,
                  {fontSize: 14, fontWeight: 400}
                ]}
              >
                ₹{formatIndianNumber(SGST)}
              </Text>
            </View>
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderBlockColor: COLORS.primaryColor,
              paddingTop: 10,
              marginTop: 10,
            }}
          >
            <View style={[styles.subscriptionHeader]}>
              <Text style={{ color: "#fff" }}>Grand Total</Text>
              <Text
                style={[
                  styles.subscriptionPrice,
                  { color: COLORS.secondaryColor },
                ]}
              >
                ₹{formatIndianNumber(finalTotal)}
              </Text>
            </View>
          </View>
        </View>

        {/* Referral section */}
        <View style={{ marginHorizontal: 20 }}>
          <Input
            label={"Refferal Code"}
            value={referral}
            onChangeText={(val) => {
              setReferral(val);
              setReferralError("");
            }}
            error={!!referralError}
            errorMessage={referralError}
          />
        </View>

        {/* Please Note Section */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Please Note</Text>
          <View style={styles.noteItem}>
            <View style={styles.bulletPoint} />
            <View style={styles.noteContent}>
              <Text style={styles.noteItemTitle}>Auto-Renewal</Text>
              <Text style={styles.noteItemText}>
                - Your Subscription will automatically renew based on your
                selected plan (3 Month, 6 Month, 1 Year) unless cancelled. You
                can cancel anytime before renewal.
              </Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <View style={styles.bulletPoint} />
            <View style={styles.noteContent}>
              <Text style={styles.noteItemTitle}>Renewal Pricing</Text>
              <Text style={styles.noteItemText}>
                - The renewal amount may vary from your current payment. Please
                Review the renewal price before renewal.
              </Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <View style={styles.bulletPoint} />
            <View style={styles.noteContent}>
              <Text style={styles.noteItemTitle}>KYC Requirement</Text>
              <Text style={styles.noteItemText}>
                - As per SEBI regulations, all SEBI registered intermediaries
                (including Fintorneary) must complete KYC verification. You'll
                need to complete KYC to unlock all Fintorneary benefits.
              </Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <View style={styles.bulletPoint} />
            <View style={styles.noteContent}>
              <Text style={styles.noteItemTitle}>Agreement</Text>
              <Text style={styles.noteItemText}>
                - By Proceeding, you agree to Fintorneary's{" "}
                <Text style={styles.linkText}>Term & Conditions</Text> and{" "}
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ backgroundColor: COLORS.primaryColor }}>
        <Button
          isLoading={isLoading}
          onClick={() => handleSubmit()}
          label={`PAY ₹${formatIndianNumber(finalTotal)}`}
          gradientColor={["#D36C32", "#F68F00"]}
          buttonStye={{ marginHorizontal: 10, marginBottom: 10 }}
        />
      </View>
      {/* Payment Button */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardColor,
  },
  couponContainer: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginTop: 0,
    backgroundColor: "#1E1E1E",
    borderRadius: 25,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 10,
  },
  couponInput: {
    flex: 1,
    color: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
  },
  applyButton: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 25,
    height: 40,
    marginTop: 10,
    marginEnd: 10,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "600",
  },
  appliedCouponContainer: {
    margin: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#333",
  },
  savedContainer: {
    // flexDirection: "row",
    // alignItems: "center",
  },
  savedText: {
    color: "white",
    marginRight: 4,
  },
  discountAmount: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  withCouponText: {
    color: "#888",
    fontSize: 12,
  },
  appliedBadge: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  appliedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  subscriptionCard: {
    margin: 12,
    marginTop: 0,
    backgroundColor: COLORS.cardColor,
    borderRadius: 8,
    padding: 16,
  },
  subscriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    justifyContent: "space-between",
  },
  subscriptionTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  subscriptionDuration: {
    color: "#ccc",
    fontSize: 12,
    textTransform: "capitalize",
    fontWeight: "bold",
    textAlign: "right"
  },
  subscriptionPrice: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: "auto",
  },
  expiryText: {
    color: "#CCC",
    fontSize: 10,
  },
  policyText: {
    color: "white",
    fontSize: 12,
    marginBottom: 4,
  },
  noteText: {
    color: "#888",
    fontSize: 10,
  },
  totalSection: {
    margin: 12,
    marginTop: 0,
  },
  couponDiscountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    color: "white",
    fontSize: 14,
  },
  discountValue: {
    color: "white",
    fontSize: 14,
  },
  greenText: {
    color: "#4CAF50",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grandTotalLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  grandTotalValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  upgradeCard: {
    margin: 12,
    marginTop: 0,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
    borderWidth: 2,
    borderColor: COLORS.secondaryColor,
  },
  upgradeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  upgradeTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  upgradeDuration: {
    color: "#CCC",
    fontSize: 12,
  },
  upgradeDescription: {
    color: "#CCC",
    fontSize: 12,
    marginTop: 4,
    maxWidth: "80%",
  },
  upgradePrice: {
    color: "white",
    fontWeight: "bold",
  },
  upgradeButton: {
    backgroundColor: "#FF9500",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-end",
  },
  upgradeButtonText: {
    color: "white",
    fontWeight: "600",
  },
  notesSection: {
    margin: 12,
    marginTop: 0,
  },
  notesTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  noteItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF9500",
    marginTop: 6,
    marginRight: 8,
  },
  noteContent: {
    flex: 1,
  },
  noteItemTitle: {
    color: "white",
    fontWeight: 600,
    fontSize: 12,
  },
  noteItemText: {
    color: "#CCC",
    fontSize: 12,
    lineHeight: 18,
  },
  linkText: {
    color: "#FF9500",
    textDecorationLine: "underline",
  },
  payButton: {
    backgroundColor: "#FF9500",
    margin: 12,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  payButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
