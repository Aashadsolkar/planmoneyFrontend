import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../constants'
import Button from '../../components/Button';
// import { ScrollView } from 'react-native-web';
import Input from '../../components/Input';
import { useNavigation } from 'expo-router';
import { quetionerApi } from '../../utils/apiCaller';
import { useAuth } from '../../auth/useAuth';

const AgreementForm = () => {
    const [fatcaSeclect, setFatcaSelect] = useState(null);
    const navigation = useNavigation();
    const { token, setRiskData, questionFormData } = useAuth();
    const [fatcaError, setFatcaError] = useState("")
    console.log(fatcaError,"fatcaError...........-----------------");
    
    const handleSubmit = async () => {
        // if (DOB) {
        //     if (dobError) return
        // }
        const payload = {
            "address": "Domivali",
            "city_id": 1,
            "state_id": 1,
            "country_id": 1,
            "zip_code": "123456",
            "dob": "2002-12-01",
            "occupation": questionFormData?.occupation,
            "income_range": questionFormData?.income_range,
            "investment_experience": questionFormData?.investment_experience,
            "investment_goal": questionFormData?.investment_goal,
            "investment_horizon": questionFormData?.investment_horizon,
            "reaction_of_market_volatility": questionFormData?.reaction_of_market_volatility,
            "investment_represent": questionFormData?.investment_represent,
            "knowledge_of_investment": questionFormData?.knowledge_of_investment,
            "investment_return": questionFormData?.investment_return,
            "attitude_towards_risk": questionFormData?.attitude_towards_risk,
            "resident_of_india": "yes",
            "resident_of": "India",
            "fatca_declaration": "yes",
            "risk_disclouser_agreement": 1
        }
        console.log(fatcaSeclect, "fatcaSeclect,,,,,,--das89dsauiadsadsgsagdsadgsadgfsyt6767-----------))))");
        
        if(fatcaSeclect == "yes"){
            const response = await quetionerApi(token, payload);
            console.log(response);
            setRiskData(response?.data);
            setFatcaError("")
            navigation.navigate("riskResult")
        }else{
            setFatcaError("Please select")
        }
        // navigation.navigate('home')


    }
    const renderFatcaCheckbox = (label) => {
        const isChecked = fatcaSeclect === label;
        return (
            <TouchableOpacity
                onPress={() => {
                    setFatcaSelect(label),
                    setFatcaError("")
                }}
                style={styles.option}
            >
                <View style={[styles.checkbox, isChecked && styles.checkedBox]}>
                    {isChecked && <View style={styles.innerCheck} />}
                </View>
                {/* <Text style={styles.label}>{label === 'yes' ? 'Yes' : 'No'}</Text> */}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor, padding: 20 }}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                scrollEnabled
                style={{paddingHorizontal: 20}}
            >
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={{ fontSize: 20, color: 'white', }}>←</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 20 }}>Step <Text style={{ color: COLORS.secondaryColor }}>1</Text> to 6</Text>
            <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite, marginBottom: 20 }}>Tax Residence Details</Text>
                <Text style={{ color: COLORS.fontWhite, fontSize: 14, marginBottom: 20 }}>
                    I confirm that I have understood the nature of the investment products being offered and acknowledge that:Investments are subject to market risks, including the potential loss of capital.Returns are not guaranteed, and past performance is not indicative of future results.The risk profile assessment has been conducted based on the information provided by me, and I take full responsibility for its accuracy and completeness.
                </Text>
                <Text style={{ fontSize: 14, color: COLORS.fontWhite, fontWeight: 600 }}>
                    Investor Undertaking:
                </Text>
                <Text style={{ color: COLORS.fontWhite, fontSize: 14, marginBottom: 20 }}>
                    I hereby declare that I have carefully read and understood the risk factors associated with the investment products I am choosing to invest in. I confirm that I am making an informed decision after considering my financial position, risk appetite, and investment goals.
                </Text>

                <Text style={{ color: COLORS.fontWhite, fontSize: 14 }}>
                    I agree that the investment decisions are made voluntarily and at my own risk. I will not hold [Company Name] or its representatives responsible for any losses or shortfall in expected returns. I am aware that I can seek independent legal and financial advice before investing.
                </Text>


            </ScrollView>
            <View style={{ flexDirection: "row", gap: 5,  alignItems: "flex-start", marginTop: 30, paddingHorizontal: 20,marginBottom: 20, }}>
                {renderFatcaCheckbox('yes')}
                <Text style={{ fontSize: 16, fontWeight: 400, color: COLORS.fontWhite }}>If yes, provide FATCA Declaration and Compliance Documents (as applicable).</Text>
            </View>
           {fatcaError && <Text style={{color: "red", paddingHorizontal: 20}}>{fatcaError}</Text>}
            <Button onClick={() => handleSubmit()} label={"Next"} gradientColor={['#D36C32', '#F68F00']} buttonStye={{ marginHorizontal: 20 }} />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 20,
        padding: 10,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        height: 24,
        width: 24,
        borderWidth: 2,
        borderColor: '#444',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedBox: {
        backgroundColor: '#007AFF',
    },
    innerCheck: {
        width: 10,
        height: 10,
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    label: {
        fontSize: 16,
        color: COLORS.fontWhite
    },
});

export default AgreementForm