import React, { useCallback, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@context/useAuth";
import { useFocusEffect } from "@react-navigation/native";
import Header from "@components/Header";
import FullScreenLoader from "@components/FullScreenLoader";
import { Image } from "expo-image";
import * as Animatable from "react-native-animatable";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { showToast } from "@components/CustomToast/ToastService";
import { COLORS } from "../constants";
import { getUnlistedShares } from "../../utils/apiCaller";

/* ================= CONFIG ================= */

const IMAGE_BASE_URL = "https://planmoney.in/assets/logo/";
const SALES_NUMBER = "+91 8108181602";

/* ================= COMPONENT ================= */

const UnlistedShares = () => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);

  /* ================= CALL ================= */

  const handleCall = () => {
    Linking.openURL(`tel:${SALES_NUMBER}`);
  };

  /* ================= FETCH ================= */

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await getUnlistedShares();

          const sortedData = (response || []).sort(
            (a, b) => new Date(b.added) - new Date(a.added)
          );

          if (isActive) setList(sortedData);
        } catch (error) {
          showToast({
            type: "error",
            title: "Something went wrong! 😥",
            message:
              error?.error ||
              error?.message ||
              "Failed to get unlisted share data",
            redirectPath: "home",
            sessionExired:
              error?.error === "Another session is active." ? true : false,
            logout,
          });
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      fetchData();
      return () => (isActive = false);
    }, [])
  );

  /* ================= EMPTY ================= */

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Animatable.View animation="bounceInDown">
        <Entypo name="new" size={90} color={COLORS.secondaryColor} />
      </Animatable.View>
      <Animatable.Text
        animation="pulse"
        iterationCount="infinite"
        style={styles.emptyText}
      >
        No Unlisted Shares Available
      </Animatable.Text>
    </View>
  );

  /* ================= CARD ================= */

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 80}
      style={styles.card}
    >
      {/* ===== HEADER ===== */}
      <View style={styles.headerRow}>
        <View style={styles.companyRow}>
          <View style={styles.logoWrapper}>
            <Image
              source={
                item.company_logo
                  ? { uri: IMAGE_BASE_URL + item.company_logo }
                  : require("../../assets/images/placeholder.jpg")
              }
              style={styles.logo}
              contentFit="contain"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              allowFontScaling={false}
              style={styles.companyName}
              numberOfLines={1}
            >
              {item.company_name}
            </Text>
            <Text allowFontScaling={false} style={styles.subText}>
              Unlisted Equity
            </Text>
          </View>
        </View>

        <View style={styles.priceBadge}>
          <Text
            allowFontScaling={false}
            style={styles.price}
            numberOfLines={1}
          >
            ₹ {item.current_price}
          </Text>
        </View>
      </View>

      {/* ===== STATS ===== */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text allowFontScaling={false} style={styles.lightText}>
            Market Cap (in cr)
          </Text>
          <Text allowFontScaling={false} style={styles.boldText}>
            {item.market_cap || "-"}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text allowFontScaling={false} style={styles.lightText}>
            PE Ratio
          </Text>
          <Text allowFontScaling={false} style={styles.boldText}>
            {item.stock_pe_ratio || "-"}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text allowFontScaling={false} style={styles.lightText}>
            Rating
          </Text>
          <Text allowFontScaling={false} style={styles.boldText}>
            {item.rating || "-"} ⭐
          </Text>
        </View>
      </View>

      {/* ===== CTA ===== */}
      <TouchableOpacity
        style={styles.callButton}
        onPress={handleCall}
        activeOpacity={0.85}
      >
        <Ionicons name="call" size={18} color={COLORS.fontWhite} />
        <Text allowFontScaling={false} style={styles.callText}>
          Buy
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  /* ================= LOADER ================= */

  if (isLoading) return <FullScreenLoader visible />;

  /* ================= UI ================= */

  return (
    <SafeAreaView
      edges={[]}
      style={{ flex: 1, backgroundColor: COLORS.primaryColor }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.cardColor}
      />

      <Header title="Unlisted Shares" showBackButton />

      <FlatList
        data={list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardColor,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
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
    marginRight: 10,
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
    flexShrink: 1,
  },

  subText: {
    color: COLORS.lightGray,
    fontSize: 12,
    marginTop: 2,
  },

  priceBadge: {
    backgroundColor: "rgba(0,200,83,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    maxWidth: 120,
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
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 70,
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
    paddingHorizontal: 20,
    borderRadius: 30,
    minHeight: 48,
  },

  callText: {
    color: COLORS.fontWhite,
    fontWeight: "700",
    fontSize: 14,
  },

  emptyContainer: {
    marginTop: 120,
    alignItems: "center",
  },

  emptyText: {
    marginTop: 15,
    color: COLORS.fontWhite,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default UnlistedShares;
