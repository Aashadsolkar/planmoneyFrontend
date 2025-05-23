import { useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Header from "../components/Header"
import { COLORS } from "../constants"
import { LinearGradient } from "expo-linear-gradient"
import Button from "../components/Button"
import { useAuth } from "../auth/useAuth"
import { applyCouponApi, pgCreateOrder } from "../utils/apiCaller"
import { useNavigation } from "expo-router"
import * as Linking from "expo-linking";

export default function Checkout() {
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState("")
  const [discount, setDiscount] = useState(0)
  const [showCouponDiscount, setShowCouponDiscount] = useState(false)
  const { selectedService, token, profileData, setOrderId } = useAuth();
  const [couponErrorMsg, setCouponErrorMsg] = useState("")
  const [orderDetails, setOrderDetails] = useState();

  /// order details
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("9876543210");
  const [address, setAddress] = useState("123, Demo Street");
  const [pincode, setPincode] = useState("560001");
  const [amount, setAmount] = useState("1");
  const navigation = useNavigation();
  const userReturnURL = Linking.createURL("orderConfirm");


  const generateOrderNumber = () => {
    const randomSixDigit = Math.floor(100000 + Math.random() * 900000); // Ensures 6 digits
    return `ORDER_${randomSixDigit}`;
  }

  const handlePay = async () => {
    try {
      const orderID = generateOrderNumber();
      const payload = {
        "order_id": orderID,
        "order_amount": parseFloat(totalPrice),
        "customer_id": profileData?.customer_id,
        "customer_email": profileData?.email,
        "customer_phone": profileData?.phone,
        "app_return_url": `https://hunger.webiknows.in/payment.html?order_id={order_id}&return_url=${userReturnURL}`
      }

      const response = await pgCreateOrder(token, payload);
      setOrderId(response?.data?.order_id);
      navigation.navigate("checkoutWebView", {
        sessionId: response?.data.payment_session_id,
        orderId: response?.data?.order_id,
      });
    } catch (error) {
      console.log("Payment creation failed:", error);
    }
  };

  const totalPrice = selectedService.offer_price - discount

  const applyCoupon = async () => {
    try {
      const payload = {
        coupon_code: couponCode,
        amount: totalPrice
      }
      const couponResponse = await applyCouponApi(token, payload)
      setDiscount(couponResponse?.data?.discount)
      setShowCouponDiscount(true)
      console.log(couponResponse);

    } catch (error) {
      setAppliedCoupon("")
      setDiscount(0)
      setShowCouponDiscount(false)
      setCouponErrorMsg(error?.message)
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Hi Vignesh"
        showBackButton={true}
      />
      <ScrollView>

        {/* Coupon Section */}
        {!showCouponDiscount ? (
          <View>
            <View style={[styles.couponContainer, {marginTop: 100}]}>
              <TextInput
                style={styles.couponInput}
                placeholder="Apply Referral"
                placeholderTextColor="#888"
                value={couponCode}
                // onChangeText={setCouponCode}
              />
              <TouchableOpacity style={styles.applyButton} >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "red", paddingStart: 20 }}>{couponErrorMsg}</Text>
          </View>
        ) : (
          <View style={styles.appliedCouponContainer}>
            <View style={styles.savedContainer}>
              <Text style={styles.savedText}>Saved-₹{discount}</Text>
              <Text style={styles.discountAmount}>{couponCode}</Text>
            </View>
            {/* <Text style={styles.withCouponText}>with {appliedCoupon}</Text> */}
            <View style={styles.appliedBadge}>
              <Text style={styles.appliedText}>Applied</Text>
            </View>
          </View>
        )}

        <View>
            <View style={styles.couponContainer}>
              <TextInput
                style={styles.couponInput}
                placeholder="Apply Coupon"
                placeholderTextColor="#888"
                value={couponCode}
                onChangeText={setCouponCode}
              />
              <TouchableOpacity style={styles.applyButton} onPress={applyCoupon}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "red", paddingStart: 20 }}>{couponErrorMsg}</Text>
          </View>

        {/* Subscription Details */}
        <View style={styles.subscriptionCard}>
          <View style={{ borderBottomWidth: 1, borderBlockColor: COLORS.primaryColor, paddingBottom: 10, marginBottom: 10 }}>
            <View style={styles.subscriptionHeader}>
              <Text style={styles.subscriptionTitle}>{selectedService?.name}</Text>
              <Text style={styles.subscriptionDuration}>{selectedService?.billing_cycle}</Text>
              <Text style={[styles.subscriptionPrice, { fontWeight: 400, color: COLORS.lightGray, textDecorationLine: "line-through" }]}>₹{selectedService?.actual_price}</Text>
            </View>
            <View style={[styles.subscriptionHeader]}>
              <Text style={styles.expiryText}>Expires on 02 Jul 2025</Text>
              <Text style={styles.subscriptionPrice}>₹{selectedService?.offer_price}</Text>
            </View>
          </View>

          <Text style={[styles.expiryText, { marginBottom: 10 }]}>If you Pay ₹{selectedService?.actual_price}/- now. The plan is valid till 02 Jul 2025 </Text>
          <Text style={[styles.expiryText, { backgroundColor: COLORS.primaryColor, padding: 10, fontSize: 10, }]}>Note: Please don’t worry, we’ll remind you for the payment</Text>

          {/* Grand Total Section */}
          {showCouponDiscount && <View style={{ borderTopWidth: 1, borderBlockColor: COLORS.primaryColor, paddingTop: 10, marginTop: 10 }}>
            <View style={[styles.subscriptionHeader]}>
              <Text style={{ color: "#fff" }}>Coupon Discount</Text>
              <Text style={styles.discountValue}>
                You saved <Text style={styles.greenText}>-₹{discount}</Text>
              </Text>
            </View>
          </View>}

          <View style={{ borderTopWidth: 1, borderBlockColor: COLORS.primaryColor, paddingTop: 10, marginTop: 10 }}>
            <View style={[styles.subscriptionHeader]}>
              <Text style={{ color: "#fff" }}>Grand Total</Text>
              <Text style={[styles.subscriptionPrice, { color: COLORS.secondaryColor }]}>₹{totalPrice}</Text>
            </View>
          </View>
        </View>


        {/* Upgrade Option */}
        

        {/* Please Note Section */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Please Note</Text>

          <View style={styles.noteItem}>
            <View style={styles.bulletPoint} />
            <View style={styles.noteContent}>
              <Text style={styles.noteItemTitle}>Auto-Renewal</Text>
              <Text style={styles.noteItemText}>
                - Your Subscription will automatically renew based on your selected plan (3 Month, 6 Month, 1 Year)
                unless cancelled. You can cancel anytime before renewal.
              </Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <View style={styles.bulletPoint} />
            <View style={styles.noteContent}>
              <Text style={styles.noteItemTitle}>Renewal Pricing</Text>
              <Text style={styles.noteItemText}>
                - The renewal amount may vary from your current payment. Please Review the renewal price before renewal.
              </Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <View style={styles.bulletPoint} />
            <View style={styles.noteContent}>
              <Text style={styles.noteItemTitle}>KYC Requirement</Text>
              <Text style={styles.noteItemText}>
                - As per SEBI regulations, all SEBI registered intermediaries (including Fintorneary) must complete KYC
                verification. You'll need to complete KYC to unlock all Fintorneary benefits.
              </Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <View style={styles.bulletPoint} />
            <View style={styles.noteContent}>
              <Text style={styles.noteItemTitle}>Agreement</Text>
              <Text style={styles.noteItemText}>
                - By Proceeding, you agree to Fintorneary's <Text style={styles.linkText}>Term & Conditions</Text> and{" "}
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>
      {/* Payment Button */}
      <Button onClick={() => handlePay()} label={`PAY ₹${totalPrice}`} gradientColor={['#D36C32', '#F68F00']} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
  },
  header: {
    backgroundColor: "#003366",
    padding: 16,
    borderRadius: 8,
    margin: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  couponContainer: {
    flexDirection: "row",
    margin: 12,
    marginTop: 0,
    backgroundColor: "#1E1E1E",
    borderRadius: 25,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },
  couponInput: {
    flex: 1,
    color: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  applyButton: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 25,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "600",
  },
  appliedCouponContainer: {
    margin: 12,
    marginTop: 80,
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
    color: "#4CAF50",
    fontWeight: "bold",
  },
  withCouponText: {
    color: "#888",
    fontSize: 12,
  },
  appliedBadge: {
    backgroundColor: "#FF9500",
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
    justifyContent: "space-between"
  },
  subscriptionTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  subscriptionDuration: {
    color: "#CCC",
    fontSize: 10,
    marginLeft: 4,
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
    borderColor: COLORS.secondaryColor
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
})
