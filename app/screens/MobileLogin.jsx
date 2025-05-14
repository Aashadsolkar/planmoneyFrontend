import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../auth/useAuth';

const MobileLogin = () => {
    const { verifyOtp } = useAuth()
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
            <View>
                <Text onPress={() => verifyOtp()}>Mobile Login</Text>
                <Text onPress={() => navigation.navigate('EmailLogin')}>Login from Mobile</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default MobileLogin;
