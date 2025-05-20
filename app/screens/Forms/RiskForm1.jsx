import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import { useNavigation } from 'expo-router';
import SelectBox from '../../components/Select';
import { COLORS } from '../../constants';
import { useAuth } from '../../auth/useAuth';

const RiskForm1 = () => {
    const navigation = useNavigation();
    const { questionFormData, setQuestionFormData } = useAuth();
    const [errors, setErrors] = useState({});

    const handleSelect = (key, value) => {
        setQuestionFormData((preValue) => {
            return {
                ...preValue,
                [key]: value
            }
        })

        // Clear error for this field
        setErrors((prev) => ({
            ...prev,
            [key]: '',
        }));
    }

    const handleSubmit = () => {
        const newErrors = {};
        if (!questionFormData?.Occupation) newErrors.Occupation = 'Please select an occupation';
        if (!questionFormData?.income_range) newErrors.income_range = 'Please select an income range';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        navigation.navigate('riskForm');

    }
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
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={{ fontSize: 20, color: 'white', }}>←</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 20 }}>Step <Text style={{ color: COLORS.secondaryColor }}>1</Text> to 6</Text>
                    <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite }}>Income & Earnings Profile</Text>
                    <SelectBox
                        selected={questionFormData?.Occupation}
                        setSelected={(option) => handleSelect("Occupation", option)}
                        options={["Business owner / Entrepreneur", "Salaried – Private sector", "Salaried – Government sector", "Retired / Homemaker"]}
                        label={"Occupation"} placeHolder={"Select Occupation"}
                        error={errors?.Occupation}
                    />
                    <SelectBox
                        selected={questionFormData?.income_range}
                        setSelected={(option) => handleSelect("income_range", option)}
                        options={["Above ₹25 lakh", "₹10 lakh – ₹25 lakh", "₹5 lakh – ₹10 lakh", "Below ₹5 lakh"]}
                        label={"Income Range"}
                        placeHolder={"Select Income Range"}
                        error={errors?.income_range}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
            <Button onClick={handleSubmit} label={"Next"} gradientColor={['#D36C32', '#F68F00']} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default RiskForm1;
