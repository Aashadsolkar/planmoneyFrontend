import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import { useNavigation } from 'expo-router';
import SelectBox from '../../components/Select';
import { COLORS } from '../../constants';
import { useAuth } from '../../auth/useAuth';

const RiskForm = () => {
    const navigation = useNavigation();
    const [errors, setErrors] = useState({});
    const { questionFormData, setQuestionFormData } = useAuth();
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
        if (!questionFormData?.investment_experience) newErrors.investment_experience = 'Please select';
        if (!questionFormData?.plan_investment_horizon) newErrors.plan_investment_horizon = 'Please select';
        if (!questionFormData?.investment_represent) newErrors.investment_represent = 'Please select';
        if (!questionFormData?.knowledge_of_investment) newErrors.knowledge_of_investment = 'Please select';
        if (!questionFormData?.investment_return) newErrors.investment_return = 'Please select';
        if (!questionFormData?.attitude_towards_risk) newErrors.attitude_towards_risk = 'Please select';
        if (!questionFormData?.reaction_of_market_volatility) newErrors.reaction_of_market_volatility = 'Please select';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        navigation.navigate('residentDetails');

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
                    style={{padding: 20}}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={{ fontSize: 20, color: 'white', }}>←</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 20 }}>Step <Text style={{ color: COLORS.secondaryColor }}>1</Text> to 6</Text>
                    <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite }}>Investment Objectives & Risk Capacity</Text>
                    <SelectBox
                        selected={questionFormData?.investment_experience}
                        setSelected={(option) => handleSelect("investment_experience", option)}
                        error={errors.investment_experience}
                        options={["More than 5 years ", "3 – 5 years", "1 – 3 years", "Less than 1 year"]}
                        label={"Investment experience (years)"}
                        placeHolder={"Select Investment Experience"}

                    />
                    <SelectBox
                        selected={questionFormData?.plan_investment_horizon}
                        setSelected={(option) => handleSelect("plan_investment_horizon", option)}
                        error={errors.plan_investment_horizon}
                        options={["Less than 1 year", "1-3 years", "3-5 years", "More than 5 years"]}
                        label={"Planned Investment Horizon"}
                        placeHolder={"Select Planned Investment Horizon"}
                    />
                    <SelectBox
                        selected={questionFormData?.reaction_of_market_volatility}
                        setSelected={(option) => handleSelect("reaction_of_market_volatility", option)}
                        error={errors.reaction_of_market_volatility}
                        options={["Sell immediately to prevent further losses", "Wait for some recovery, but might sell if losses worsen", "Stay invested and wait for recovery", "Invest more at lower levels"]}
                        label={"How would you react if your portfolio drops 20% in a short time?"}
                        placeHolder={"Select Your Reaction"}
                    />
                    <SelectBox
                        selected={questionFormData?.investment_represent}
                        setSelected={(option) => handleSelect("investment_represent", option)}
                        error={errors.investment_represent}
                        options={["More than 75%", "50% - 75%", "25% - 50%", "Less than 25%"]}
                        label={"How much of your total net worth will this investment represent?"}
                        placeHolder={"Select Your Net Worth"}
                    />
                    <SelectBox
                        selected={questionFormData?.knowledge_of_investment}
                        setSelected={(option) => handleSelect("knowledge_of_investment", option)}
                        error={errors.knowledge_of_investment}
                        options={["No experience", "Some knowledge, little experience", "Good knowledge and some active investment", "Very experienced investor"]}
                        label={"How familiar are you with investment products like stocks, bonds, mutual funds, derivatives?"}
                        placeHolder={"Select Your experience"}
                    />
                    <SelectBox
                        selected={questionFormData?.investment_return}
                        setSelected={(option) => handleSelect("investment_return", option)}
                        error={errors.investment_return}
                        options={["4%-6% annualized (capital preservation)", "7%-10% annualized (moderate growth)", "11%-15% annualized (high growth)", "16%+ annualized (very aggressive growth)",]}
                        label={"What kind of returns are you expecting?"}
                        placeHolder={"Select Your Reaction"}
                    />
                    <SelectBox
                        selected={questionFormData?.attitude_towards_risk}
                        setSelected={(option) => handleSelect("attitude_towards_risk", option)}
                        error={errors.attitude_towards_risk}
                        options={["I avoid losses at any cost", "I am willing to take minor risks for modest returns", "I can tolerate moderate volatility for better returns", "I am comfortable with high volatility and high risks"]}
                        label={"Which statement best describes your attitude towards investment risk?"}
                        placeHolder={"Select Your Reaction"}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
            <Button onClick={() => handleSubmit()} label={"Next"} gradientColor={['#D36C32', '#F68F00']} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default RiskForm;
