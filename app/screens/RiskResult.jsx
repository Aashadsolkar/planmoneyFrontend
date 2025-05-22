"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import { useAuth } from "../auth/useAuth";
import { COLORS } from "../constants";
import Header from "../components/Header";
import Button from "../components/Button";
import { useNavigation } from "expo-router";


export default function App() {
  const navigation = useNavigation();
  // In a real app, you would fetch this data
  const { riskData } = useAuth();
  const [response, setResponse] = useState({
    data: { risk: "Medium Risk", score: 36 },
    message: "Added successfully.",
    status: "success",
  })



  // Determine color based on risk level
  const getColorForRisk = (risk) => {
    if (risk.includes("Low")) return "#2ecc71" // Green
    if (risk.includes("Medium")) return "#f39c12" // Orange/Yellow
    if (risk.includes("High")) return "#e74c3c" // Red
    return "#3498db" // Default blue
  }

  // Get risk level text
  const getRiskLevelText = (risk) => {
    if (risk.includes("Low")) return "LOW"
    if (risk.includes("Medium")) return "MEDIUM"
    if (risk.includes("High")) return "HIGH"
    return "UNKNOWN"
  }

  const riskColor = getColorForRisk(riskData?.risk)
  const riskLevelText = getRiskLevelText(riskData?.risk)

  return (


    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor, padding: 20 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 20, marginTop: 10 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={{ fontSize: 20, color: 'white', }}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', width: "100%", marginTop: 100 }}>
          <Text style={styles.headerText}>Your got</Text>

          <View style={styles.circleContainer}>
            <View style={[styles.outerCircle, { borderColor: riskColor }]}>
              <View style={styles.innerCircle}>
                <Text style={[styles.scoreText, { color: riskColor }]}>{riskData?.score}</Text>
                <Text style={styles.pointsText}>Points</Text>
              </View>
            </View>
          </View>

          <Text style={styles.riskText}>Your Risk Taking Ability is</Text>
          <Text style={[styles.riskLevel, { color: riskColor }]}>{riskLevelText}</Text>
        </View>
      </ScrollView>
      <Button onClick={() => navigation.navigate("confrimQuestioner")} label={"Next"} gradientColor={['#D36C32', '#F68F00']} buttonStye={{ marginHorizontal: 20 }} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryColor, // Dark blue background
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "500",
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  outerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  pointsText: {
    color: "white",
    fontSize: 16,
    marginTop: -5,
  },
  riskText: {
    color: "white",
    fontSize: 18,
    marginTop: 20,
    fontWeight: "500",
  },
  riskLevel: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
})
