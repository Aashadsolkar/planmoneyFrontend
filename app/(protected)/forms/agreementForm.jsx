import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, BackHandler, Alert } from 'react-native';
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
    const DOB = questionFormData?.dob;
    const formattedDate = new Date(DOB).toISOString().split("T")[0];
    if (fatcaSeclect === "yes") {
      try {
        const payload = {
          address: questionFormData?.address,
          city_id: questionFormData?.city,
          state_id: questionFormData?.state,
          country_id: questionFormData?.country,
          zip_code: questionFormData?.pincode,
          dob: formattedDate,
          occupation: questionFormData?.occupation,
          income_range: questionFormData?.income_range,
          investment_experience: questionFormData?.investment_experience,
          investment_goal: questionFormData?.investment_goal,
          investment_horizon: questionFormData?.plan_investment_horizon,
          reaction_of_market_volatility: questionFormData?.reaction_of_market_volatility,
          investment_represent: questionFormData?.investment_represent,
          knowledge_of_investment: questionFormData?.knowledge_of_investment,
          investment_return: questionFormData?.investment_return,
          attitude_towards_risk: questionFormData?.attitude_towards_risk,
          resident_of_india: questionFormData?.resident_of_india,
          resident_of: questionFormData?.resident_of,
          fatca_declaration: questionFormData?.fatca_declaration,
          risk_disclouser_agreement: 1
        };

        const response = await quetionerApi(token, payload);
        setRiskData(response?.data);
        setFatcaError("");
        router.push("riskResult");
      } catch (error) {
        Alert.alert(
          "Error",
          error?.message || "Questioner Api Failed",
          [
            {
              text: "OK",
              // onPress: () => router.push("home"),
            },
          ]
        );
      }
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={{ fontSize: 20, color: 'white', }}>←</Text>
        </TouchableOpacity>
        {/* Removed back button since back is blocked */}
        <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.fontWhite, marginTop: 20 }}>
          Step <Text style={{ color: COLORS.secondaryColor }}>5</Text> to 5
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

      <TouchableOpacity onPress={() => router.push("home")} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>

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
  skipButton: {
        alignItems: "center",
        marginBottom: 20,
    },
    skipText: {
        color: "#8B9DC3",
        fontSize: 16,
    },
});

export default AgreementForm;
