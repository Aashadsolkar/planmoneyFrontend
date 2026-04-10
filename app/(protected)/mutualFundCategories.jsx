import React, { useState, useMemo } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import Header from "@components/Header";
import MutualFundCard from "../../components/MutualFundCard";
import { COLORS } from "../constants";

/* ============ MOCK DATA ============ */

const MOCK_FUNDS = {
  Equity: [
    { id: 1,  fund_name: "Mirae Asset Large Cap Fund",  logo: null, min_sip: 100,  category: "Large Cap", return_1y: 14.2, return_3y: 18.5, return_5y: 22.1, return_inception: 26.3 },
    { id: 2,  fund_name: "Axis Midcap Fund",            logo: null, min_sip: 500,  category: "Mid Cap",   return_1y: 19.8, return_3y: 24.1, return_5y: 28.6, return_inception: 31.2 },
    { id: 3,  fund_name: "SBI Small Cap Fund",          logo: null, min_sip: 500,  category: "Small Cap", return_1y: 22.4, return_3y: 31.2, return_5y: 36.8, return_inception: 22.5 },
    { id: 4,  fund_name: "Parag Parikh Flexi Cap Fund", logo: null, min_sip: 1000, category: "Flexi Cap", return_1y: 16.3, return_3y: 21.7, return_5y: 25.4, return_inception: 19.8 },
    { id: 5,  fund_name: "Quant ELSS Tax Saver Fund",   logo: null, min_sip: 500,  category: "ELSS",      return_1y: 28.1, return_3y: 35.4, return_5y: 41.2, return_inception: 34.7 },
    { id: 6,  fund_name: "HDFC Top 100 Fund",           logo: null, min_sip: 100,  category: "Large Cap", return_1y: 12.8, return_3y: 16.9, return_5y: 19.3, return_inception: 18.6 },
    { id: 7,  fund_name: "Kotak Emerging Equity Fund",  logo: null, min_sip: 100,  category: "Mid Cap",   return_1y: 18.6, return_3y: 26.3, return_5y: 30.1, return_inception: 24.9 },
  ],
  Debt: [
    { id: 8,  fund_name: "HDFC Short Term Debt Fund",     logo: null, min_sip: 100,  category: "Large Cap", return_1y: 7.2, return_3y: 6.8, return_5y: 7.1, return_inception: 8.3 },
    { id: 9,  fund_name: "ICICI Pru Corporate Bond Fund", logo: null, min_sip: 100,  category: "Mid Cap",   return_1y: 7.8, return_3y: 7.4, return_5y: 7.9, return_inception: 9.1 },
    { id: 10, fund_name: "Axis Banking & PSU Debt Fund",  logo: null, min_sip: 1000, category: "Large Cap", return_1y: 6.9, return_3y: 6.5, return_5y: 7.0, return_inception: 7.8 },
  ],
  Hybrid: [
    { id: 11, fund_name: "Balanced Advantage Fund",      logo: null, min_sip: 500, category: "Flexi Cap", return_1y: 11.4, return_3y: 14.2, return_5y: 16.8, return_inception: 17.5 },
    { id: 12, fund_name: "ICICI Pru Equity & Debt Fund", logo: null, min_sip: 100, category: "Large Cap", return_1y: 13.6, return_3y: 17.1, return_5y: 19.4, return_inception: 20.2 },
  ],
  "Tax Saver": [
    { id: 13, fund_name: "Mirae Asset Tax Saver Fund",   logo: null, min_sip: 500, category: "ELSS", return_1y: 16.8, return_3y: 22.4, return_5y: 26.1, return_inception: 27.9 },
    { id: 14, fund_name: "Canara Robeco ELSS Tax Saver", logo: null, min_sip: 500, category: "ELSS", return_1y: 15.2, return_3y: 20.1, return_5y: 23.8, return_inception: 25.4 },
    { id: 15, fund_name: "DSP Tax Saver Fund",           logo: null, min_sip: 500, category: "ELSS", return_1y: 14.9, return_3y: 19.3, return_5y: 22.7, return_inception: 24.1 },
  ],
};

const TOP_TABS    = ["Equity", "Debt", "Hybrid", "Tax Saver"];
const SUB_FILTERS = ["All", "Large Cap", "Mid Cap", "Small Cap", "Flexi Cap", "ELSS"];

/* ============ SCREEN ============ */

export default function MutualFundsScreen() {
  const [activeTab,    setActiveTab]    = useState("Equity");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search,       setSearch]       = useState("");

  /* ---- filtering ---- */
  const filteredList = useMemo(() => {
    const data = MOCK_FUNDS[activeTab] || [];
    return data.filter((f) => {
      const matchSub = activeFilter === "All" || f.category === activeFilter;
      const matchQ   = f.fund_name.toLowerCase().includes(search.trim().toLowerCase());
      return matchSub && matchQ;
    });
  }, [activeTab, activeFilter, search]);

  /* ---- tab change resets sub-filter + search ---- */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveFilter("All");
    setSearch("");
  };

  /* ---- sticky header rendered inside FlatList ---- */
  // ✅ FIX: entire top section (tabs + search + sub-filters) is inside
  // ListHeaderComponent so everything scrolls together — no nested ScrollView
  const ListHeader = () => (
    <View style={styles.listHeader}>

      {/* TOP TABS */}
      <View style={styles.topTabsRow}>
        {TOP_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabChange(tab)}
            style={[styles.topTab, activeTab === tab && styles.topTabActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.topTabText, activeTab === tab && styles.topTabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SEARCH */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          {/* ✅ FIX: Ionicons instead of broken unicode ⌕ */}
          <Ionicons name="search-outline" size={18} color="#bbb" />
          <TextInput
            placeholder="Search for Mutual funds"
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing" // iOS clear button
          />
          {/* ✅ Android clear button */}
          {search.length > 0 && Platform.OS === "android" && (
            <TouchableOpacity onPress={() => setSearch("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color="#bbb" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* SUB FILTERS */}
      {/* ✅ FIX: horizontal FlatList instead of ScrollView — gap via marginRight */}
      <FlatList
        data={SUB_FILTERS}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subFilterContent}
        renderItem={({ item: f }) => (
          <TouchableOpacity
            onPress={() => setActiveFilter(f)}
            style={[styles.sfChip, activeFilter === f && styles.sfChipActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.sfChipText, activeFilter === f && styles.sfChipTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        )}
      />

    </View>
  );

  /* ---- empty state ---- */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bar-chart-outline" size={48} color="#ccc" />
      <Text style={styles.emptyText}>No funds found</Text>
    </View>
  );

  const backButtonText = () => {
          return (
              <>
                  <Text style={{ color: COLORS.fontWhite, fontSize: 18, fontWeight: 600 }}>Mutual fund</Text>
                  {/* {serviceData?.cmp && <Text style={{ color: COLORS.fontWhite, fontSize: 12, fontWeight: 400 }}>CMP ₹{serviceData?.cmp}</Text>} */}
              </>
          )
      }

  /* ============ UI ============ */

  return (
    <>
      {/* ✅ FIX: top safe area background white, body background #f7f7fb */}
      <SafeAreaView edges={[""]} style={{ backgroundColor: "#fff" }} />
      <SafeAreaView edges={[]} style={styles.safeArea}>

        {/* ✅ FIX: no backgroundColor on Android StatusBar — causes flicker */}
        <StatusBar barStyle="dark-content" />

        <Header title="Mutual Funds" showBackButton backButtonText={backButtonText} />

        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MutualFundCard item={item} />}
          ListHeaderComponent={ListHeader}
          // ✅ FIX: stickyHeaderIndices={[0]} — tabs+search always visible while scrolling
          stickyHeaderIndices={[0]}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled" // ✅ FIX: tap on list dismisses keyboard
          keyboardDismissMode="on-drag"        // ✅ FIX: scroll karo toh keyboard band
        />

      </SafeAreaView>
    </>
  );
}

/* ============ STYLES ============ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7fb",
  },
  listHeader: {
    backgroundColor: "#fff",
  },
  topTabsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  topTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  topTabActive: {
    borderColor: "#534AB7",
  },
  topTabText: {
    fontSize: 13,
    color: "#666",
  },
  topTabTextActive: {
    fontWeight: "600",
    color: "#1a1a1a",
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#7F77DD",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1a1a1a",
    marginLeft: 10,
  },
  subFilterContent: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  sfChip: {
    borderWidth: 1.5,
    borderColor: "#7F77DD",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: "#fff",
    marginRight: 8, // ✅ FIX: gap instead of gap prop
  },
  sfChipActive: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
  },
  sfChipText: {
    fontSize: 13,
    color: "#1a1a1a",
  },
  sfChipTextActive: {
    color: "#fff",
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    flexGrow: 1,
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: "#aaa",
  },
});