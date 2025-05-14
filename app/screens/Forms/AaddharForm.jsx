import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import DOBInput from '../../components/DOBInput';
import SelectBox from '../../components/Select';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigation } from 'expo-router';
import TextAreaInput from '../../components/TextArea';

const AaddharForm = () => {
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [occupation, setOccupation] = useState("");
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor, padding: 20 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 1 : 40}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    <Text style={{ fontSize: 25, fontWeight: 500, color: COLORS.fontWhite }}>Hey <Text style={{ color: COLORS.secondaryColor }}>Vignesh</Text></Text>
                    <Text style={{ marginTop: 5, color: COLORS.lightGray, fontSize: 12 }}>Please complete your KYC</Text>
                    <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 20 }}>Step <Text style={{ color: COLORS.secondaryColor }}>1</Text> to 6</Text>
                    <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite }}>Verify Your Aadhar Number</Text>
                    <Input
                        label={"Enter Your Aadhar Number"}
                        value={city}
                        onChangeText={(val) => setCity(val)}
                    />
                    <Text style={{ fontWeight: 600, color: COLORS.lightGray, marginTop: 5, fontSize: 12 }}>OTP will be sent to your Aadhar Register Mobile Number</Text>
                </ScrollView>
            </KeyboardAvoidingView>
            <Button onClick={() => navigation.navigate('form2')} label={"Send Otp"} gradientColor={['#D36C32', '#F68F00']} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default AaddharForm;
