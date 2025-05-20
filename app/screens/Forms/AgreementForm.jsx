import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../constants'
import Button from '../../components/Button';
import { ScrollView } from 'react-native-web';
import Input from '../../components/Input';
import { useNavigation } from 'expo-router';
import { quetionerApi } from '../../utils/apiCaller';
import { useAuth } from '../../auth/useAuth';

const AgreementForm = () => {
    const [selected, setSelected] = useState("yes");
    const [fatcaSeclect, setFatcaSelect] = useState(null);
    const navigation = useNavigation();
    const { token } = useAuth();
    const handleSubmit = async () => {
        // if (DOB) {
        //     if (dobError) return
        // }
        const payload = {
            "address": "Domivali",
            "city_id" : 1,
            "state_id": 1,
            "country_id": 1,
            "zip_code" : "123456",
            "dob": "2002-12-01",
            "occupation": "Salaried-Government sector",
            "income_range": "10 lakh - 25 lakh",
            "investment_experience": "More than 5 years",
            "investment_goal": "aggressive growth",
            "investment_horizon": "1-3 years",
            "reaction_of_market_volatility": "Wait for some recovery, but might sell if losses worsen",
            "investment_represent": "More than 75%",
            "knowledge_of_investment": "No experience",
            "investment_return": "7%-10% annualized (moderate growth)",
            "attitude_towards_risk": "i am willing to take minor risks for modest returns",
            "resident_of_india": "yes",
            "resident_of": "India",
            "fatca_declaration": "yes",
            "risk_disclouser_agreement": 1
        }
        const response = await quetionerApi(token,payload);
        console.log(response);
        

        navigation.navigate('home')
    }
    const renderFatcaCheckbox = (label) => {
        const isChecked = fatcaSeclect === label;
        return (
            <TouchableOpacity
                onPress={() => setFatcaSelect(label)}
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={{ fontSize: 20, color: 'white', }}>←</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 20 }}>Step <Text style={{ color: COLORS.secondaryColor }}>1</Text> to 6</Text>
            <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite, marginBottom: 20 }}>Tax Residence Details</Text>

            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                scrollEnabled
            >
                <Text style={{ color: COLORS.fontWhite, fontSize: 14, marginBottom: 20 }}>
                    I confirm that I have understood the nature of the investment products being offered and acknowledge that: Investments are subject to market risks, including the potential loss of capital. Returns are not guaranteed, and past performance is not indicative of future results. The risk profile assessment has been conducted based on the information provided by me, and I take full responsibility for its accuracy and completeness.
                </Text>
                <Text style={{fontSize: 14, color: COLORS.fontWhite, fontWeight: 600}}>
                   Investor Undertaking: 
                </Text>
                <Text style={{ color: COLORS.fontWhite, fontSize: 14, marginBottom: 20 }}>
                    I hereby declare that I have carefully read and understood the risk factors associated with the investment products I am choosing to invest in. I confirm that I am making an informed decision after considering my financial position, risk appetite, and investment goals.
                </Text>

                <Text style={{ color: COLORS.fontWhite, fontSize: 14 }}>
                    I agree that the investment decisions are made voluntarily and at my own risk. I will not hold [Company Name] or its representatives responsible for any losses or shortfall in expected returns. I am aware that I can seek independent legal and financial advice before investing.
                </Text>


            </ScrollView>
                            <View style={{ flexDirection: "row", gap: 5, marginBottom: 20, alignItems: "flex-start", marginTop: 30 }}>
                {renderFatcaCheckbox('yes')}
                <Text style={{ fontSize: 16, fontWeight: 400, color: COLORS.fontWhite }}>If yes, provide FATCA Declaration and Compliance Documents (as applicable).</Text>
            </View>
            <Button onClick={() => handleSubmit()} label={"Next"} gradientColor={['#D36C32', '#F68F00']} />
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