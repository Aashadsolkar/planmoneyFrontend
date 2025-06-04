
import { View, Text, Image, SafeAreaView, ActivityIndicator, StyleSheet, ScrollView } from "react-native"
import { useEffect, useState } from "react"
import Button from "../components/Button"
import { COLORS } from "../constants"
import { useAuth } from '../context/useAuth';
import { buySubscription, pgVerifyOrder } from "../utils/apiCaller"
import { useNavigation, useRoute } from "@react-navigation/native"
import { CheckCircle, Clock } from "lucide-react-native"
import * as Animatable from "react-native-animatable"
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";

const OrderConfirm = () => {
  const route = useRoute()
  const { orderId } = route.params || {}
  // const { orderId } = useSearchParams();
  const { orderConfirmDetails, token, profileData, selectedService, prePaymentDetails } = useAuth()
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [verifyComplete, setVerifyComplete] = useState(false)
  const [subscriptionComplete, setSubscriptionComplete] = useState(false)
  const [error, setError] = useState(null)

  const { id, billing_cycle, serviceId } = selectedService || {}

  console.log(orderId, "order id.................");


  useEffect(() => {
    const verifyOrder = async () => {
      setLoading(true)
      try {
        const response = await pgVerifyOrder(token, orderId)

        if (response?.data?.length > 0) {
          if (response?.data[0]?.payment_status == "SUCCESS") {
            setOrderDetails(response.data)
            setVerifyComplete(true)
            // Wait 2 seconds before calling the subscription API
            setTimeout(() => {
              buyService(response.data)
            }, 2000)
          } else {
            setError("Failed to verify your payment. Please contact support.")
          }
        } else {
          setError("Failed to verify your payment. Please contact support.")
        }
      } catch (error) {
        setError("Failed to verify your payment. Please contact support.")
      } finally {
        setLoading(false)
      }
    }
    const buyService = async (orderData) => {
      if (!orderData || !orderData[0]) return
      setLoading(true)
      try {
        const payload = {
          service_id: serviceId,
          plan_id: id,
          payment_method: orderData[0]?.payment_group,
          amount: orderData[0].order_amount,
          currency: orderData[0]?.payment_currency,
          billing_cycle: billing_cycle,
          payment_status: "paid",
          transaction_id: orderId,
          coupon_code: prePaymentDetails?.coupon_code,
          referral_code: prePaymentDetails?.referral_code
        }
        console.log(prePaymentDetails, "asdadkjakadhj_________________");
        

        const response = await buySubscription(token, payload)
        setSubscriptionComplete(true)
      } catch (error) {
        setError(
          "Your payment was successful, but we couldn't activate your subscription. Our team will resolve this shortly.",
        )
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      verifyOrder()
    }
  }, [orderId])

  const renderLoadingState = () => (
    <Animatable.View animation="fadeIn" style={styles.centerContent}>
      <ActivityIndicator size="large" color="#D87129" />
      <Text style={styles.loadingText}>Verifying your payment...</Text>
      <Text style={styles.subText}>Please wait while we confirm your order</Text>
    </Animatable.View>
  )

  const renderVerifyComplete = () => (
    <Animatable.View animation="fadeIn" style={styles.centerContent}>
      <Animatable.View animation="bounceIn">
        <CheckCircle color="#D87129" size={60} />
      </Animatable.View>
      <Text style={styles.successTitle}>Payment Verified!</Text>
      <Text style={styles.subText}>Now activating your subscription...</Text>
      <ActivityIndicator size="small" color="#D87129" style={styles.smallLoader} />
    </Animatable.View>
  )

  const renderSubscriptionComplete = () => (
    <Animatable.View animation="fadeIn" style={styles.centerContent}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animatable.View animation="bounceIn">
          <CheckCircle color="#D87129" size={80} />
        </Animatable.View>
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.subText}>Your subscription has been activated</Text>

        <View style={styles.orderDetailsCard}>
          <Text style={styles.orderDetailsTitle}>Order Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID:</Text>
            <Text style={styles.detailValue}>{orderDetails?.[0]?.order_id}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, styles.statusText]}>{orderDetails?.[0]?.payment_status}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>₹{orderDetails?.[0]?.payment_amount}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{orderDetails?.[0]?.payment_group}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Billing Cycle:</Text>
            <Text style={styles.detailValue}>{billing_cycle}</Text>
          </View>
        </View>
      </ScrollView>
    </Animatable.View>
  )

  const renderErrorState = () => (
    <Animatable.View animation="fadeIn" style={styles.centerContent}>
      <Clock color="#D87129" size={60} />
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorText}>{error}</Text>
    </Animatable.View>
  )

  const renderContent = () => {
    if (loading && !verifyComplete && !subscriptionComplete) {
      return renderLoadingState()
    } else if (error) {
      return renderErrorState()
    } else if (verifyComplete && !subscriptionComplete) {
      return renderVerifyComplete()
    } else if (subscriptionComplete) {
      return renderSubscriptionComplete()
    }
    return renderLoadingState()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
      </View>

      {renderContent()}

      <View style={styles.buttonContainer}>
        <Button
          label={subscriptionComplete ? "Done" : "Back to Home"}
          gradientColor={["#D36C32", "#F68F00"]}
          // onPress={() => navigation.navigate("/screens/home")}
          onClick={() => router.push("home")}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    height: 60,
    alignSelf: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.fontWhite,
    marginTop: 20,
    textAlign: "center",
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.fontWhite,
    marginTop: 20,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.fontWhite,
    marginTop: 10,
    textAlign: "center",
    opacity: 0.8,
  },
  smallLoader: {
    marginTop: 20,
  },
  orderDetailsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 20,
    marginTop: 30,
    width: "100%",
    maxWidth: 350,
  },
  orderDetailsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.fontWhite,
    marginBottom: 15,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  detailLabel: {
    fontSize: 16,
    color: COLORS.fontWhite,
    opacity: 0.8,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.fontWhite,
  },
  statusText: {
    color: "#D87129",
    textTransform: "capitalize",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    width: "100%",
    paddingBottom: 30,
    backgroundColor: COLORS.primaryColor,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.fontWhite,
    marginTop: 20,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: COLORS.fontWhite,
    marginTop: 10,
    textAlign: "center",
    opacity: 0.8,
    maxWidth: 300,
  },
})

export default OrderConfirm
