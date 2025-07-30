import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from './Button';
import { COLORS } from '../app/constants';
import { useAuth } from '@context/useAuth';
import { verifyQuestioner } from '@utils/apiCaller';
import { router } from 'expo-router';
import { showToast } from "@components/CustomToast/ToastService";

const { height } = Dimensions.get('window');

const QuestionerModal = ({ isVisible, handleClose, onRefresh }) => {
    const { profileData, token, setIsQuestionerFillderByAdvisor, logout } = useAuth();
    const [isLoading, setIsLoading] = useState();
    const {
        occupation,
        income_range,
        investment_experience,
        investment_goals,
        investment_horizon,
        reaction_of_market_volatility,
        investment_represent,
        knowledge_of_investment,
        investment_return,
        attitude_towards_risk,
        resident_of_india,
        resident_of,
        fatca_declaration,
        risk_disclouser_agreement,
        risk_category,
        risk_score
    } = profileData?.customerfinanceinfo ?? {};

    const {
        dob,
        address,
        zip_code,
        city,
        state,
        country
    } = profileData || {};

    const handleSubmitClick = async (val) => {
        try {
            setIsLoading(true)
            const payload = {
                customer_id: profileData?.customerfinanceinfo?.customer_id,
                verified: val
            }
            const response = await verifyQuestioner(token, payload);
            setIsQuestionerFillderByAdvisor(false);
            onRefresh()
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            showToast({
                type: "error",
                title: `Something went wrong! 😥`,
                message: `${error?.error || error?.message || "Failed to submit data"}`,
                redirectPath: "home",
                sessionExired: error?.error == "Another session is active." ? true : false,
                logout: logout
            });
        }
    }

    return (
        <Modal visible={isVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Text style={{ color: COLORS.fontWhite, paddingHorizontal: 20, paddingBottom: 10, fontSize: 18, fontWeight: "600" }}>Our advisor has completed these details for you. Please verify that all information is correct.</Text>

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {[
                            { label: "Date of birth", value: dob },
                            { label: "Pincode", value: zip_code },
                            { label: "Address", value: address },
                            { label: "Country", value: country?.name },
                            { label: "State", value: state?.name },
                            { label: "City", value: city?.name },
                            { label: "Occupation", value: occupation },
                            { label: "Income Range", value: income_range },
                            { label: "Investment experience (years)", value: investment_experience },
                            { label: "What is your primary investment goal?", value: investment_goals },
                            { label: "What is your investment horizon?", value: investment_horizon },
                            { label: "How would you react if your portfolio drops 20% in a short time?", value: reaction_of_market_volatility },
                            { label: "How familiar are you with investment products like stocks, bonds, mutual funds, derivatives?", value: knowledge_of_investment },
                            { label: "What kind of returns are you expecting?", value: investment_return },
                            { label: "Which statement best describes your attitude towards investment risk?", value: attitude_towards_risk },
                            { label: "Investment Represent", value: investment_represent },
                            { label: "Resident of India", value: resident_of_india },
                            { label: "Resident Of", value: resident_of || "India" },
                            { label: "FATCA Declaration and Compliance Documents", value: fatca_declaration },
                            { label: "Risk Disclouser Agreement", value: "Yes" },
                            { label: "Risk Category", value: risk_category },
                            { label: "Risk Score", value: risk_score },
                        ].map((item, index) => (
                            <View style={styles.questionContaner} key={index}>
                                <Text style={styles.label}>Question:</Text>
                                <Text style={styles.question}>{item.label}</Text>
                                <Text style={styles.label}>Answer:</Text>
                                <Text style={styles.answer}>{item.value ?? "N/A"}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={{ flexDirection: "row", justifyContent: "center", gap: 5 }}>
                        <Button
                            isLoading={isLoading}
                            buttonStye={{ marginTop: 10, paddingHorizontal: 50, }}
                            onClick={() => handleSubmitClick(1)}
                            label={"Accept"}
                            gradientColor={[COLORS.profitColor, COLORS.profitColor]}
                        />
                        <Button
                            isLoading={isLoading}
                            buttonStye={{ marginTop: 10, paddingHorizontal: 50, }}
                            onClick={() => handleSubmitClick(3)}
                            label={"Reject"}
                            gradientColor={['#D36C32', '#F68F00']}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
    },
    modalContent: {
        backgroundColor: COLORS.cardColor,
        borderRadius: 20,
        maxHeight: height * 0.9,
        paddingBottom: 20,
        width: "90%",
        alignSelf: "center",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 20,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    questionContaner: {
        marginBottom: 16,
        backgroundColor: COLORS.cardColor,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.borderColor || '#444',
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.secondaryColor || '#FFA500',
        marginTop: 6,
    },
    question: {
        fontSize: 14,
        color: COLORS.fontWhite,
        fontWeight: '600',
        marginBottom: 4,
    },
    answer: {
        fontSize: 15,
        color: COLORS.fontWhite,
        fontWeight: '400',
        marginBottom: 10,
    },
});

export default QuestionerModal;
