import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS } from '../constants';
import Header from '../components/Header';
import { useFocusEffect } from '@react-navigation/native';

export default function SIP() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturnRate, setAnnualReturnRate] = useState(12);
  const [years, setYears] = useState(10);
  const [maturityAmount, setMaturityAmount] = useState(null);

  const calculateSIP = () => {
    const P = parseFloat(monthlyInvestment);
    const r = parseFloat(annualReturnRate) / 100 / 12;
    const n = parseInt(years) * 12;

    if (isNaN(P) || isNaN(r) || isNaN(n)) {
      setMaturityAmount(null);
      return;
    }

    const FV = P * (((Math.pow(1 + r, n) - 1) * (1 + r)) / r);
    setMaturityAmount(FV.toFixed(2));
  };

  useFocusEffect(
    useCallback(() => {
      calculateSIP();
    }, [monthlyInvestment, annualReturnRate, years])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardColor }}>
      <Header showBackButton={true}/>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>SIP Calculator</Text>

        {/* Monthly Investment */}
        <Text style={styles.label}>Monthly Investment (₹)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={monthlyInvestment.toString()}
          onChangeText={(val) => setMonthlyInvestment(Number(val))}
        />
        <Slider
          style={styles.slider}
          minimumValue={500}
          maximumValue={100000}
          step={500}
          value={monthlyInvestment}
          onValueChange={setMonthlyInvestment}
          minimumTrackTintColor="#007aff"
          maximumTrackTintColor="#ccc"
        />

        {/* Annual Return Rate */}
        <Text style={styles.label}>Expected Annual Return (%)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={annualReturnRate.toString()}
          onChangeText={(val) => setAnnualReturnRate(Number(val))}
        />
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={30}
          step={0.5}
          value={annualReturnRate}
          onValueChange={setAnnualReturnRate}
          minimumTrackTintColor="#28a745"
          maximumTrackTintColor="#ccc"
        />

        {/* Investment Duration */}
        <Text style={styles.label}>Investment Duration (Years)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={years.toString()}
          onChangeText={(val) => setYears(Number(val))}
        />
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={40}
          step={1}
          value={years}
          onValueChange={setYears}
          minimumTrackTintColor="#ff9900"
          maximumTrackTintColor="#ccc"
        />

        {maturityAmount && (
          <Text style={styles.result}>
            Estimated Maturity Amount: ₹ {maturityAmount}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: COLORS.primaryColor,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: COLORS.fontWhite
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    color: COLORS.fontWhite
  },
  input: {
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    marginTop: 6,
    color: COLORS.fontWhite,
    borderColor: COLORS.secondaryColor
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 8,
  },
  result: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondaryColor,
    textAlign: 'center',
  },
});
