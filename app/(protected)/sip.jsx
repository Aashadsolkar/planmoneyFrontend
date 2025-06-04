"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  PanResponder,
  Animated,
} from "react-native"
// import Slider from "react-native-slider"
import Slider from '@react-native-community/slider';

import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import Header from "../components/Header";
import { COLORS } from "../constants";

const { width } = Dimensions.get("window")

// Custom Slider Component for better Android performance
const CustomSlider = ({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step = 1,
  trackColor = "#e5e7eb",
  thumbColor = "#6366f1",
  minimumTrackTintColor = "#6366f1",
}) => {
  const [sliderWidth, setSliderWidth] = useState(0)
  const animatedValue = new Animated.Value(value)

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { },
    onPanResponderMove: (evt, gestureState) => {
      if (sliderWidth > 0) {
        const percentage = Math.max(0, Math.min(1, gestureState.moveX / sliderWidth))
        const newValue = minimumValue + (maximumValue - minimumValue) * percentage
        const steppedValue = Math.round(newValue / step) * step
        onValueChange(Math.max(minimumValue, Math.min(maximumValue, steppedValue)))
      }
    },
    onPanResponderRelease: () => { },
  })

  const percentage = (value - minimumValue) / (maximumValue - minimumValue)

  return (
    <View style={styles.customSliderContainer} onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}>
      <View style={[styles.customSliderTrack, { backgroundColor: trackColor }]}>
        <View
          style={[
            styles.customSliderProgress,
            {
              width: `${percentage * 100}%`,
              backgroundColor: minimumTrackTintColor,
            },
          ]}
        />
      </View>
      <View
        {...panResponder.panHandlers}
        style={[
          styles.customSliderThumb,
          {
            left: `${percentage * 100}%`,
            backgroundColor: thumbColor,
          },
        ]}
      />
    </View>
  )
}

export default function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(5000)
  const [interestRate, setInterestRate] = useState(12)
  const [years, setYears] = useState(10)
  const [maturityAmount, setMaturityAmount] = useState(0)
  const [totalInvested, setTotalInvested] = useState(0)
  const [totalReturns, setTotalReturns] = useState(0)
  const [useCustomSlider, setUseCustomSlider] = useState(Platform.OS === "android")

  // Calculate SIP maturity amount
  const calculateSIP = () => {
    const monthlyRate = interestRate / 12 / 100
    const totalMonths = years * 12
    const invested = monthlyAmount * totalMonths

    if (monthlyRate === 0) {
      const maturity = invested
      setMaturityAmount(maturity)
      setTotalInvested(invested)
      setTotalReturns(0)
      return
    }

    const maturity = monthlyAmount * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate))
    const returns = maturity - invested

    setMaturityAmount(maturity)
    setTotalInvested(invested)
    setTotalReturns(returns)
  }

  useEffect(() => {
    calculateSIP()
  }, [monthlyAmount, interestRate, years])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num)
  }

  const handleAmountChange = (text) => {
    const numValue = Number.parseInt(text.replace(/[^0-9]/g, "")) || 0
    setMonthlyAmount(Math.min(Math.max(numValue, 500), 100000))
  }

  const handleRateChange = (text) => {
    const numValue = Number.parseFloat(text.replace(/[^0-9.]/g, "")) || 0
    setInterestRate(Math.min(Math.max(numValue, 1), 30))
  }

  const handleYearsChange = (text) => {
    const numValue = Number.parseInt(text.replace(/[^0-9]/g, "")) || 0
    setYears(Math.min(Math.max(numValue, 1), 40))
  }



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      <Header
        showBackButton={true}
      />
      {/* 
      <LinearGradient colors={["#6366f1", "#8b5cf6", "#a855f7"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="calculator" size={32} color="white" />
          <Text style={styles.headerTitle}>SIP Calculator</Text>
          <Text style={styles.headerSubtitle}>Plan your systematic investments</Text>
        </View>
      </LinearGradient> */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Monthly Investment Amount */}
        <View style={styles.inputSection}>
          <View style={styles.inputHeader}>
            <Ionicons name="wallet" size={20} color="#6366f1" />
            <Text style={styles.inputLabel}>Monthly Investment</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.textInput}
              value={formatNumber(monthlyAmount)}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholder="5,000"
            />
          </View>

          {useCustomSlider ? (
            <CustomSlider
              value={monthlyAmount}
              onValueChange={setMonthlyAmount}
              minimumValue={500}
              maximumValue={100000}
              step={500}
              minimumTrackTintColor="#6366f1"
            />
          ) : (
            <Slider
              style={styles.slider}
              minimumValue={500}
              maximumValue={100000}
              step={500}
              value={monthlyAmount}
              onValueChange={setMonthlyAmount}
              minimumTrackTintColor="#6366f1"
              maximumTrackTintColor="#e5e7eb"
              thumbStyle={styles.sliderThumb}
              trackStyle={styles.sliderTrack}
            />
          )}

          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>₹500</Text>
            <Text style={styles.sliderLabel}>₹1,00,000</Text>
          </View>
        </View>

        {/* Interest Rate */}
        <View style={styles.inputSection}>
          <View style={styles.inputHeader}>
            <Ionicons name="trending-up" size={20} color="#10b981" />
            <Text style={styles.inputLabel}>Expected Annual Return</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={interestRate.toString()}
              onChangeText={handleRateChange}
              keyboardType="numeric"
              placeholder="12"
            />
            <Text style={styles.percentSymbol}>%</Text>
          </View>

          {useCustomSlider ? (
            <CustomSlider
              value={interestRate}
              onValueChange={setInterestRate}
              minimumValue={1}
              maximumValue={30}
              step={0.5}
              minimumTrackTintColor="#10b981"
            />
          ) : (
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={30}
              step={0.5}
              value={interestRate}
              onValueChange={setInterestRate}
              minimumTrackTintColor="#10b981"
              maximumTrackTintColor="#e5e7eb"
              thumbStyle={styles.sliderThumb}
              trackStyle={styles.sliderTrack}
            />
          )}

          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1%</Text>
            <Text style={styles.sliderLabel}>30%</Text>
          </View>
        </View>

        {/* Investment Period */}
        <View style={styles.inputSection}>
          <View style={styles.inputHeader}>
            <Ionicons name="time" size={20} color="#f59e0b" />
            <Text style={styles.inputLabel}>Investment Period</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={years.toString()}
              onChangeText={handleYearsChange}
              keyboardType="numeric"
              placeholder="10"
            />
            <Text style={styles.percentSymbol}>Years</Text>
          </View>

          {useCustomSlider ? (
            <CustomSlider
              value={years}
              onValueChange={setYears}
              minimumValue={1}
              maximumValue={40}
              step={1}
              minimumTrackTintColor="#f59e0b"
            />
          ) : (
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={40}
              step={1}
              value={years}
              onValueChange={setYears}
              minimumTrackTintColor="#f59e0b"
              maximumTrackTintColor="#e5e7eb"
              thumbStyle={styles.sliderThumb}
              trackStyle={styles.sliderTrack}
            />
          )}

          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1 Year</Text>
            <Text style={styles.sliderLabel}>40 Years</Text>
          </View>
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          <LinearGradient colors={["#fff", "#ccc"]} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Ionicons name="trophy" size={24} color="#6366f1" />
              <Text style={styles.resultTitle}>Investment Summary</Text>
            </View>

            <View style={styles.resultRow}>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Total Invested</Text>
                <Text style={styles.resultValue}>{formatCurrency(totalInvested)}</Text>
              </View>
              <View style={styles.resultDivider} />
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Total Returns</Text>
                <Text style={[styles.resultValue, styles.returnsValue]}>{formatCurrency(totalReturns)}</Text>
              </View>
            </View>

            <View style={styles.maturityContainer}>
              <Text style={styles.maturityLabel}>Maturity Amount</Text>
              <Text style={styles.maturityAmount}>{formatCurrency(maturityAmount)}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(totalInvested / maturityAmount) * 100}%` }]} />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>
                  Invested: {((totalInvested / maturityAmount) * 100).toFixed(1)}%
                </Text>
                <Text style={styles.progressLabel}>Returns: {((totalReturns / maturityAmount) * 100).toFixed(1)}%</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Additional Info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={16} color="#6b7280" />
              <Text style={styles.infoText}>
                You'll invest {formatCurrency(monthlyAmount)} monthly for {years} years
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calculator" size={16} color="#6b7280" />
              <Text style={styles.infoText}>
                Total months: {years * 12} | Expected return: {interestRate}% p.a.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardColor,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 0 : 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: COLORS.primaryColor
  },
  inputSection: {
    backgroundColor: COLORS.cardColor,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryColor,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginRight: 8,
  },
  percentSymbol: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
  },
  sliderThumb: {
    backgroundColor: "white",
    width: 24,
    height: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  // Custom Slider Styles
  customSliderContainer: {
    height: 40,
    justifyContent: "center",
    marginVertical: 10,
  },
  customSliderTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e5e7eb",
  },
  customSliderProgress: {
    height: "100%",
    borderRadius: 2,
  },
  customSliderThumb: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6366f1",
    marginLeft: -12,
    marginTop: -10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#ccc",
    fontWeight: "500",
  },
  resultsContainer: {
    marginBottom: 30,
  },
  resultCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginLeft: 8,
  },
  resultRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  resultItem: {
    flex: 1,
    alignItems: "center",
  },
  resultDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 20,
  },
  resultLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  returnsValue: {
    color: "#10b981",
  },
  maturityContainer: {
    alignItems: "center",
  },
  maturityLabel: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 8,
  },
  maturityAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 16,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  progressLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  infoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
    flex: 1,
  },
})