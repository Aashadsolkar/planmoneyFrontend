import { View, Text, Image, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { COLORS } from "../constants";
import { useAuth } from "../auth/useAuth";
import { pgVerifyOrder } from "../utils/apiCaller";
import { useRoute } from "@react-navigation/native";

const OrderConfirm = () => {
  const route = useRoute();
  const { orderId } = route.params || {};
  const { orderConfirmDetails, token, profileData } = useAuth();
  const [orderDetails, setOrderDetails] = useState("");
  useEffect(() => {
    const verifyOrder = async () => {
      try {
        const response = await pgVerifyOrder(token, orderId);
        setOrderDetails(response?.data);
      } catch (error) {}
    };
    verifyOrder();
  }, [orderId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 100,
        }}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ alignItems: "center" }}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          paddingHorizontal: 20,
          width: "100%",
          position: "absolute",
          bottom: 0,
          paddingBottom: 30,
          backgroundColor: COLORS.primaryColor,
        }}
      >
        {/* <Text style={{ color: "#fff", textAlign: "center", marginBottom: 10 }}>Already have an account? <Text onPress={() => navigation.navigate('login')} style={{ color: "#D87129" }}> Sign in</Text></Text> */}
        <Button label={"Done"} gradientColor={["#D36C32", "#F68F00"]} />
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{ fontSize: 30, fontWeight: 600, color: COLORS.fontWhite }}
        >
          Payment Confirm
        </Text>
        <Text style={{ fontWeight: 400, color: COLORS.fontWhite }}>
          Your Payment Has Succesfully Done
        </Text>
        <Text style={{ fontWeight: 400, color: COLORS.fontWhite }}>
          Order ID: {orderDetails?.order_id}
        </Text>
        <Text style={{ fontWeight: 400, color: COLORS.fontWhite }}>
          Order Status:{orderDetails?.order_status}
        </Text>
        <Text style={{ fontWeight: 400, color: COLORS.fontWhite }}>
          Order Amount: ₹{orderDetails?.order_amount}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default OrderConfirm;
