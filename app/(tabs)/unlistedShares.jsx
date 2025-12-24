import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
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
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await getUnlistedShares();

          const sortedData = (response || []).sort(
            (a, b) => new Date(b.added) - new Date(a.added)
          );

          setList(sortedData);
        } catch (error) {
          showToast({
            type: "error",
            title: `Something went wrong! 😥`,
            message: `${error?.error || error?.message || "Failed to get unlisted share data"}`,
            redirectPath: "home",
            sessionExired: error?.error == "Another session is active." ? true : false,
            logout: logout
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
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

  /* ================= CARDS ================= */

  const renderCards = () => {
    if (!list.length) return renderEmpty();

    return list.map((item, index) => (
      <Animatable.View
        key={item.id}
        animation="fadeInUp"
        delay={index * 80}
        style={styles.card}
      >
        {/* ===== HEADER ===== */}
        <View style={styles.headerRow}>
          <View style={styles.companyRow}>
            <View style={styles.logoWrapper}>
              <Image
                source={{ uri: IMAGE_BASE_URL + item.company_logo }}
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

        {/* ===== STATS ===== */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.lightText}>Market Cap (in cr)</Text>
            <Text style={styles.boldText}>{item.market_cap || "-"}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.lightText}>PE Ratio</Text>
            <Text style={styles.boldText}>
              {item.stock_pe_ratio || "-"}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.lightText}>Rating</Text>
            <Text style={styles.boldText}>
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
          <Text style={styles.callText}>Call Sales Expert</Text>
        </TouchableOpacity>
      </Animatable.View>
    ));
  };

  const backButtonText = () => {
    return (
      <Text style={{ color: COLORS.fontWhite, fontSize: 18, fontWeight: 600 }}>Unlisted Shares</Text>
    )
  }

  /* ================= LOADER ================= */

  if (isLoading) return <FullScreenLoader visible />;

  /* ================= UI ================= */

  return (
    <SafeAreaView
      edges={[]}
      style={{ flex: 1, backgroundColor: COLORS.primaryColor }}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />

      <Header title="Unlisted Shares" showBackButton backButtonText={backButtonText} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        <Text style={styles.heading}>Available Unlisted Shares</Text>
        {renderCards()}
      </ScrollView>
    </SafeAreaView>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    color: COLORS.fontWhite,
    fontWeight: "800",
    marginBottom: 16,
  },

  /* ===== CARD ===== */

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
    justifyContent: "space-between",
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
  },

  price: {
    color: COLORS.profitColor,
    fontWeight: "800",
    fontSize: 15,
  },

  /* ===== STATS ===== */

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  statBox: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 10,
    marginHorizontal: 4,
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

  /* ===== CTA ===== */

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
    fontSize: 14,
  },

  /* ===== EMPTY ===== */

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
