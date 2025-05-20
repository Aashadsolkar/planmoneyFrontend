import React from 'react';
import { StyleSheet, View } from 'react-native';

const ConfirmQuestioner = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor }}>
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 100 }}>
                <Image
                    source={require('../../../assets/images/logo.png')}
                    style={{ alignItems: "center" }}
                    resizeMode="contain"
                />
            </View>
            <View style={{ paddingHorizontal: 20, width: "100%", position: "absolute", bottom: 0, paddingBottom: 30, backgroundColor: COLORS.primaryColor }}>
                <Button label={"Done"} gradientColor={['#D36C32', '#F68F00']} />
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 30, fontWeight: 600, color: COLORS.fontWhite }}>Your Profile has been Submitted Successfully. </Text>
                <Text style={{ fontWeight: 400, color: COLORS.fontWhite }}>
                    Please wait until our Advisor Approves your Profile</Text>
                <Text style={{ fontWeight: 400, color: COLORS.fontWhite }}>Order ID: {orderConfirmDetails?.orderId}</Text>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default ConfirmQuestioner;
