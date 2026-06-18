import React, { useCallback, useState, useRef } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  FlatList,
  ActivityIndicator,
  TextInput,
  Keyboard
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
import { COLORS } from "../../constants.js";
import { getUnlistedShares } from "../../utils/apiCaller";
import useOffsetPagination from "../../hooks/useOffsetPagination";
import UnlistedShareCard from "../../components/UnlistedShareCard";

/* ================= CONFIG ================= */

const IMAGE_BASE_URL = "https://planmoney.in/assets/logo/";
const SALES_NUMBER = "+91 8108181602";

/* ================= COMPONENT ================= */

const UnlistedShares = () => {
  const { logout } = useAuth();

  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  const searchRef = useRef("");
  const throttleRef = useRef(null);
  const inputRef = useRef(null);

  /* ================= CALL ================= */

  const handleCall = () => {
    Linking.openURL(`tel:${SALES_NUMBER}`);
  };

  /* ================= SEARCH (THROTTLED, NO LIMIT) ================= */

  const handleSearch = (text) => {
    setSearch(text);
    searchRef.current = text; // 🔥 always latest value

    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
    }

    throttleRef.current = setTimeout(() => {
      onRefresh();
    }, 500);
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
        const res = await getUnlistedShares(
          offset,
          limit,
          searchRef.current.trim() || "" // 🔥 empty = normal list
        );

        setList((prev) =>
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
      searchRef.current = "";
      setSearch("");
      onRefresh(false);

       return () => {
      // 👇 screen se jaate time
      Keyboard.dismiss();
      inputRef.current?.blur();
    };
    }, [])
  );

  /* ================= EMPTY ================= */

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View>
        <Entypo name="new" size={90} color={COLORS.secondaryColor} />
      </View>
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

 const renderItem = ({ item }) => (
  <UnlistedShareCard item={item} key={item.id} />
);

  /* ================= UI ================= */

  return (
    <SafeAreaView edges={[]} style={{ flex: 1, backgroundColor: COLORS.primaryColor }}>
      <StatusBar barStyle="light-content" />

      <Header  showBackButton backButtonText={() => <Text style={{ color: COLORS.secondaryColor, fontWeight: 600, fontSize: 18 }}>Unlisted Shares</Text>} />

      {/* 🔍 SEARCH BAR */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        style={styles.searchContainer}
      >
        <Ionicons name="search" size={18} color={COLORS.lightGray} />
        <TextInput
          ref={inputRef}
          placeholder="Search company..."
          placeholderTextColor={COLORS.lightGray}
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </TouchableOpacity>

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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardColor,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 14,
    height: 60,
    boxShadow: COLORS.boxShadow,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.fontWhite,
    fontSize: 14,
  },
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
