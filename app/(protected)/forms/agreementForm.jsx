import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../constants';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { router, useNavigation } from 'expo-router';
import { quetionerApi } from '../../utils/apiCaller';
import { useAuth } from '../../context/useAuth';

const AgreementForm = () => {
  const [fatcaSeclect, setFatcaSelect] = useState(null);
  const navigation = useNavigation();
  const { token, setRiskData, questionFormData } = useAuth();
  const [fatcaError, setFatcaError] = useState("");

  const handleSubmit = async () => {
    if (fatcaSeclect === "yes") {
      const payload = {
        address: "Domivali",
        city_id: 1,
        state_id: 1,
        country_id: 1,
        zip_code: "123456",
        dob: "2002-12-01",
        occupation: questionFormData?.occupation,
        income_range: questionFormData?.income_range,
        investment_experience: questionFormData?.investment_experience,
        investment_goal: questionFormData?.plan_investment_horizon,
        investment_horizon: "1-3 years",
        reaction_of_market_volatility: questionFormData?.reaction_of_market_volatility,
        investment_represent: questionFormData?.investment_represent,
        knowledge_of_investment: questionFormData?.knowledge_of_investment,
        investment_return: questionFormData?.investment_return,
        attitude_towards_risk: questionFormData?.attitude_towards_risk,
        resident_of_india: "yes",
        resident_of: "India",
        fatca_declaration: "yes",
        risk_disclouser_agreement: 1
      };

      const response = await quetionerApi(token, payload);
      setRiskData(response?.data);
      setFatcaError("");
      router.push("riskResult");
    } else {
      setFatcaError("Please select");
    }
  };

  const renderFatcaCheckbox = (label) => {
    const isChecked = fatcaSeclect === label;
    return (
      <TouchableOpacity
        onPress={() => {
          setFatcaSelect(label);
          setFatcaError("");
        }}
        style={styles.option}
      >
        <View style={[styles.checkbox, isChecked && styles.checkedBox]}>
          {isChecked && <View style={styles.innerCheck} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor, padding: 20 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled
        style={{ paddingHorizontal: 20 }}
      >
        {/* Removed back button since back is blocked */}
        <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.fontWhite, marginTop: 20 }}>
          Step <Text style={{ color: COLORS.secondaryColor }}>1</Text> to 6
        </Text>
        <Text style={{ fontSize: 20, fontWeight: '600', color: COLORS.fontWhite, marginBottom: 20 }}>
          Tax Residence Details
        </Text>
        <Text style={{ color: COLORS.fontWhite, fontSize: 14, marginBottom: 20 }}>
          I confirm that I have understood the nature of the investment products being offered...
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.fontWhite, fontWeight: '600' }}>
          Investor Undertaking:
        </Text>
        <Text style={{ color: COLORS.fontWhite, fontSize: 14, marginBottom: 20 }}>
          I hereby declare that I have carefully read and understood the risk factors...
        </Text>
        <Text style={{ color: COLORS.fontWhite, fontSize: 14 }}>
          I agree that the investment decisions are made voluntarily and at my own risk...
        </Text>
      </ScrollView>

      <View style={{ flexDirection: "row", gap: 5, alignItems: "flex-start", marginTop: 30, paddingHorizontal: 20, marginBottom: 20 }}>
        {renderFatcaCheckbox('yes')}
        <Text style={{ fontSize: 16, fontWeight: '400', color: COLORS.fontWhite }}>
          If yes, provide FATCA Declaration and Compliance Documents (as applicable).
        </Text>
      </View>

      {fatcaError && <Text style={{ color: "red", paddingHorizontal: 20 }}>{fatcaError}</Text>}

      <Button
        onClick={handleSubmit}
        label={"Next"}
        gradientColor={['#D36C32', '#F68F00']}
        buttonStye={{ marginHorizontal: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default AgreementForm;
