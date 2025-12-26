import React, { useCallback, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import * as Animatable from "react-native-animatable";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";

import Header from "@components/Header";
import { showToast } from "@components/CustomToast/ToastService";
import { useAuth } from "@context/useAuth";
import { COLORS } from "../constants";
import { getUnlistedShares } from "../../utils/apiCaller";
import useOffsetPagination from "../../hooks/useOffsetPagination";

/* ================= CONFIG ================= */

const IMAGE_BASE_URL = "https://planmoney.in/assets/logo/";
const SALES_NUMBER = "+91 8108181602";

/* ================= COMPONENT ================= */

const UnlistedShares = () => {
  const { logout } = useAuth();
  const [list, setList] = useState([]);

  /* ================= CALL ================= */

  const handleCall = () => {
    Linking.openURL(`tel:${SALES_NUMBER}`);
  };

  /* ================= PAGINATION ================= */

  const {
    loading,
    refreshing,
    onRefresh,
    onEndReached,
  } = useOffsetPagination({
    limit: 10,
    onFetch: async ({ offset, limit, isRefresh }) => {
      try {
        const res = await getUnlistedShares(offset, limit);

        setList(prev =>
          isRefresh ? res : [...prev, ...res]
        );

        return { count: res.length };
      } catch (error) {
        showToast({
          type: "error",
          title: "Something went wrong! 😥",
          message:
            error?.error ||
            error?.message ||
            "Failed to get unlisted share data",
          sessionExired:
            error?.error === "Another session is active.",
          logout,
        });

        return { count: 0 };
      }
    },
  });

  /* ================= INITIAL LOAD ================= */

  useFocusEffect(
    useCallback(() => {
      onRefresh();
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

  /* ================= FOOTER LOADER ================= */

  const renderFooter = () => {
    if (!loading || refreshing) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator
          size="small"
          color={COLORS.secondaryColor}
        />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  /* ================= CARD ================= */

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      // delay={index * 60}
      style={styles.card}
    >
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

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.lightText}>Market Cap (in cr)</Text>
          <Text style={styles.boldText}>
            {item.market_cap || "-"}
          </Text>
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

  /* ================= UI ================= */

  return (
    <SafeAreaView edges={[]} style={{ flex: 1, backgroundColor: COLORS.primaryColor }}>
      <StatusBar barStyle="light-content" />

      <Header title="Unlisted Shares" showBackButton />

      <FlatList
        data={list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={!loading && renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}

        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}

        refreshing={refreshing}
        onRefresh={onRefresh}

        ListFooterComponent={renderFooter}
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 6,
    color: COLORS.lightGray,
    fontSize: 12,
  },
});

export default UnlistedShares;
