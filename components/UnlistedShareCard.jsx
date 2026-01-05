import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Image } from "expo-image";
import * as Animatable from "react-native-animatable";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../app/constants";

const IMAGE_BASE_URL = "https://planmoney.in/assets/logo/";
const SALES_NUMBER = "+91 8108181602";

const UnlistedShareCard = ({ item }) => {
  const handleCall = () => {
    Linking.openURL(`tel:${SALES_NUMBER}`);
  };

  return (
    <Animatable.View animation="fadeInUp" style={styles.card}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View style={styles.companyRow}>
          <View style={styles.logoWrapper}>
            <Image
              source={
                item.company_logo
                  ? { uri: IMAGE_BASE_URL + item.company_logo }
                  : require("../assets/images/placeholder.jpg")
              }
              style={styles.logo}
              contentFit="contain"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.companyName} numberOfLines={1}>
              {item.company_name}
            </Text>
            <Text style={styles.subText}>Unlisted Equity</Text>
          </View>
        </View>

        <View style={styles.priceBadge}>
          <Text style={styles.price}>₹ {item.current_price}</Text>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.lightText}>Market Cap (in cr)</Text>
          <Text style={styles.boldText}>{item.market_cap || "-"}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.lightText}>PE Ratio</Text>
          <Text style={styles.boldText}>{item.stock_pe_ratio || "-"}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.lightText}>Rating</Text>
          <Text style={styles.boldText}>{item.rating || "-"} ⭐</Text>
        </View>
      </View>

      {/* BUY BUTTON */}
      <TouchableOpacity
        style={styles.callButton}
        onPress={handleCall}
        activeOpacity={0.85}
      >
        <Ionicons name="call" size={18} color={COLORS.fontWhite} />
        <Text style={styles.callText}>Buy</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default React.memo(UnlistedShareCard);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardColor,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logo: {
    width: 28,
    height: 28,
  },
  companyName: {
    color: COLORS.fontWhite,
    fontWeight: "700",
    fontSize: 15,
  },
  subText: {
    color: COLORS.lightGray,
    fontSize: 12,
  },
  priceBadge: {
    backgroundColor: "rgba(0,200,83,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  price: {
    color: COLORS.profitColor,
    fontWeight: "800",
    fontSize: 15,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  lightText: {
    color: COLORS.lightGray,
    fontSize: 10,
  },
  boldText: {
    color: COLORS.fontWhite,
    fontWeight: "700",
    fontSize: 14,
    marginTop: 4,
  },
  callButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.secondaryColor,
    paddingVertical: 12,
    borderRadius: 30,
  },
  callText: {
    color: COLORS.fontWhite,
    fontWeight: "700",
  },
});
