import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";

const IMAGE_BASE_URL = "https://planmoney.in/assets/logo/";

export default function MutualFundCard({ item }) {
  return (
    <TouchableOpacity onPress={() => router.push("startSIPScreen")} style={styles.card}>

      {/* TOP */}
      <View style={styles.topRow}>
        <View style={styles.logoCircle}>
          <Image
            source={{ uri: `${IMAGE_BASE_URL}${item.logo}` }}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        <Text style={styles.fundName}>{item.fund_name}</Text>
        <Text style={styles.minSip}>Minimum SIP: ₹{item.min_sip}</Text>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>1 year returns</Text>
          <Text style={styles.statVal}>{item.return_1y}%</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>3 years CAGR</Text>
          <Text style={styles.statVal}>{item.return_3y}%</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>5 years CAGR</Text>
          <Text style={styles.statVal}>{item.return_5y}%</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Since Inception CAGR</Text>
          <Text style={[styles.statVal, styles.green]}>{item.return_inception}%</Text>
        </View>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#d0cbf5",
    padding: 16,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0eefc",
    borderWidth: 1,
    borderColor: "#d0cbf5",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  logo: {
    width: 30,
    height: 30,
  },
  fundName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  minSip: {
    fontSize: 13,
    color: "#555",
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  stat: {
    flex: 1,
    paddingHorizontal: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#888",
    marginBottom: 4,
    lineHeight: 14,
  },
  statVal: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  green: {
    color: "#1E8A4A",
  },
  divider: {
    width: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 2,
  },
});