import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import { router, useNavigation } from 'expo-router';
import SelectBox from '../../components/Select';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/useAuth';

const RiskCalculate1 = () => {
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
        if (!questionFormData?.occupation) newErrors.occupation = 'Please select an occupation';
        if (!questionFormData?.income_range) newErrors.income_range = 'Please select an income range';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        router.push('forms/riskCalculate2');

    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor}}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 1 : 40}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    style={{padding: 20}}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={{ fontSize: 20, color: 'white', }}>←</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 20 }}>Step <Text style={{ color: COLORS.secondaryColor }}>2</Text> to 5</Text>
                    <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite }}>Income & Earnings Profile</Text>
                    <SelectBox
                        selected={questionFormData?.occupation}
                        setSelected={(option) => handleSelect("occupation", option)}
                        options={["Business owner / Entrepreneur", "Salaried – Private sector", "Salaried – Government sector", "Retired / Homemaker"]}
                        label={"occupation"} placeHolder={"Select occupation"}
                        error={errors?.occupation}
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
            <TouchableOpacity onPress={() => router.push("home")} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
            <Button onClick={handleSubmit} label={"Next"} gradientColor={['#D36C32', '#F68F00']} buttonStye={{marginHorizontal: 20}} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    skipButton: {
        alignItems: "center",
        marginBottom: 20,
    },
    skipText: {
        color: "#8B9DC3",
        fontSize: 16,
    },
})

export default RiskCalculate1;
