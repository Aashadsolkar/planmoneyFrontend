import { View, Text, Image, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import Button from '../components/Button'
import { COLORS } from '../constants'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../auth/useAuth';
import { pgVerifyOrder } from '../utils/apiCaller';

const OrderConfirm = () => {
  const { orderId } = useLocalSearchParams();
  console.log(orderId, "orderId..........");
  
  const { orderConfirmDetails, token, profileData } = useAuth();
  useEffect(() => {
    const verifyOrder = async () => {
      try {
        const payload = {
          "order_id": orderId,
          "order_amount": 250.00,
          "customer_id": profileData?.customer_id,
          "customer_email": profileData?.email,
          "customer_phone": profileData?.phone
        }
        const response = await pgVerifyOrder(token, payload, orderId);
      } catch (error) {

      }
    }
    verifyOrder();
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor }}>
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 100 }}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={{ alignItems: "center" }}
          resizeMode="contain"
        />
      </View>
      <View style={{ paddingHorizontal: 20, width: "100%", position: "absolute", bottom: 0, paddingBottom: 30, backgroundColor: COLORS.primaryColor }}>
        {/* <Text style={{ color: "#fff", textAlign: "center", marginBottom: 10 }}>Already have an account? <Text onPress={() => navigation.navigate('login')} style={{ color: "#D87129" }}> Sign in</Text></Text> */}
        <Button label={"Done"} gradientColor={['#D36C32', '#F68F00']} />
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 30, fontWeight: 600, color: COLORS.fontWhite }}>Payment Confirm</Text>
        <Text style={{ fontWeight: 400, color: COLORS.fontWhite }}>Your Payment Has Succesfully Done</Text>
        <Text style={{ fontWeight: 400, color: COLORS.fontWhite }}>Order ID: {orderConfirmDetails?.orderId}</Text>
      </View>

    </SafeAreaView>
  )
}

export default OrderConfirm