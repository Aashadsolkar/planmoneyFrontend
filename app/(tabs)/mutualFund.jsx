import React from "react";
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  TextInput, StatusBar, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "@components/Header";
import { COLORS } from "../constants";
import { router } from "expo-router";

/* ============ MOCK DATA ============ */

const PORTFOLIO = {
  current_value: 12000,
  investment: 10000,
  profit: 2000,
};

const TRENDING_FUNDS = [
  { id: 1, name: "ICICI Pru Bluechip Fund", min_sip: 100, return_1y: 12.5, return_3y: 69.3 },
  { id: 2, name: "SBI Magnum Midcap Fund", min_sip: 100, return_1y: 11.8, return_3y: 54.2 },
  { id: 3, name: "Mirae Asset Large Cap", min_sip: 500, return_1y: 14.2, return_3y: 48.7 },
  { id: 4, name: "Axis Small Cap Fund", min_sip: 100, return_1y: 22.1, return_3y: 81.4 },
];

const TOP_FILTERS = [
  { id: 1, label: "Highest\nReturns Funds" },
  { id: 2, label: "Best\nIndex Funds" },
  { id: 3, label: "Start SIP\nwith ₹100" },
  { id: 4, label: "Top Rates\nFunds" },
  { id: 5, label: "Tax Saving\nELSS" },
];

const CATEGORIES = [
  { id: 1, name: "Equity" },
  { id: 2, name: "Hybrid" },
  { id: 3, name: "Debt" },
  { id: 4, name: "Tax Saver" },
];

const TOP_AMCS = [
  { id: 1, short: "HDFC", name: "HDFC AMC" },
  { id: 2, short: "SBI", name: "SBI AMC" },
  { id: 3, short: "Kotak", name: "Kotak AMC" },
  { id: 4, short: "Motilal", name: "Motilal Oswal" },
  { id: 5, short: "Axis", name: "Axis AMC" },
  { id: 6, short: "ICICI", name: "ICICI Pru" },
];

const YOUR_SIP = {
  sip_this_month: 1000,
  active_sips: 2,
};

const NEW_SIP_FUNDS = [
  { id: 1, name: "Fund 1" },
  { id: 2, name: "Fund 2" },
  { id: 3, name: "Fund 3" },
];

/* ============ HELPERS ============ */

const fmt = (n) => "₹" + n.toLocaleString("en-IN");

/* ============ SCREEN ============ */

export default function MutualFundsDashboard({ navigation }) {

  const backButtonText = () => {
    return (
      <>
        <Text style={{ color: COLORS.fontWhite, fontSize: 18, fontWeight: 600 }}>MF Dashboard</Text>
        {/* {serviceData?.cmp && <Text style={{ color: COLORS.fontWhite, fontSize: 12, fontWeight: 400 }}>CMP ₹{serviceData?.cmp}</Text>} */}
      </>
    )
  }
  return (
    <>
      <SafeAreaView edges={[""]} style={{ backgroundColor: "#fff" }} />
      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        <Header title="Mutual Funds" showDrawer showBackButton backButtonText={backButtonText} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── SEARCH ── */}
          <TouchableOpacity
            style={styles.searchBox}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("MutualFundsList")}
          >
            <Ionicons name="search-outline" size={18} color="#bbb" />
            <Text style={styles.searchPlaceholder}>Search for Mutual funds</Text>
          </TouchableOpacity>

          {/* ── PORTFOLIO CARD ── */}
          <View style={styles.portfolioCard}>
            <Text style={styles.portfolioTitle}>Mutual Funds Portfolio</Text>
            <Text style={styles.cvLabel}>Current Value</Text>
            <Text style={styles.cvValue}>{fmt(PORTFOLIO.current_value)}</Text>
            <View style={styles.invRow}>
              <View>
                <Text style={styles.invLabel}>Investment</Text>
                <Text style={styles.invVal}>{fmt(PORTFOLIO.investment)}</Text>
              </View>
              <View>
                <Text style={styles.invLabel}>Profit</Text>
                <Text style={[styles.invVal, styles.green]}>{fmt(PORTFOLIO.profit)}</Text>
              </View>
            </View>
            <View style={styles.addBar}>
              <Text style={styles.addBarText}>Have extra cash? Add more in Mutual Funds</Text>
              <TouchableOpacity onPress={() => router.push("mutualFundPortfolioScreen")} style={styles.addBtn} activeOpacity={0.85}>
                <Text style={styles.addBtnText}>Add more</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── TRENDING ── */}
          <SectionHeader title="Most Trending Mutual Funds" />
          <FlatList
            data={TRENDING_FUNDS}
            keyExtractor={(i) => i.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScrollContent}
            renderItem={({ item }) => (
              <View style={styles.trendCard}>
                <View style={styles.trendTop}>
                  <View style={styles.trendLogo} />
                  <Text style={styles.trendName} numberOfLines={2}>{item.name}</Text>
                </View>
                <View style={styles.trendStats}>
                  <StatItem label="Minimum SIP" value={fmt(item.min_sip)} />
                  <StatItem label="1 year return" value={`${item.return_1y}%`} />
                  <StatItem label="3 years return" value={`${item.return_3y}%`} green />
                </View>
              </View>
            )}
          />

          {/* ── TOP FILTERS ── */}
          <SectionHeader title="Top Filters" viewMore />
          <FlatList
            data={TOP_FILTERS}
            keyExtractor={(i) => i.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScrollContent}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.filterItem} activeOpacity={0.8}>
                <View style={styles.filterBox} />
                <Text style={styles.filterLabel}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />

          {/* ── CATEGORIES ── */}
          <SectionHeader title="Categories" viewMore  onPress={() => router.push("mutualFundCategories")}/>
          <FlatList
            data={CATEGORIES}
            keyExtractor={(i) => i.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScrollContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.catChip}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("MutualFundsList", { tab: item.name })}
              >
                <View style={styles.catLogo} />
                <Text style={styles.catName}>{item.name}</Text>
                <Text style={styles.catArrow}>▶</Text>
              </TouchableOpacity>
            )}
          />

          {/* ── TOP AMCs ── */}
          <SectionHeader title="Top AMCs" viewMore />
          <FlatList
            data={TOP_AMCS}
            keyExtractor={(i) => i.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScrollContent}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.amcItem} activeOpacity={0.8}>
                <View style={styles.amcLogo}>
                  <Text style={styles.amcShort}>{item.short}</Text>
                </View>
                <Text style={styles.amcName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          {/* ── YOUR SIP ── */}
          <View style={styles.tagCard}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>Your SIP</Text>
            </View>
            <View style={styles.tagCardBody}>
              <View style={styles.sipRow}>
                <View>
                  <Text style={styles.sipLabel}>SIP this month</Text>
                  <Text style={styles.sipVal}>{fmt(YOUR_SIP.sip_this_month)}</Text>
                </View>
                <View>
                  <Text style={styles.sipLabel}>Active SIPs</Text>
                  <Text style={styles.sipVal}>{YOUR_SIP.active_sips}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.tagCardFooter} activeOpacity={0.8}>
              <Text style={styles.tagCardFooterText}>View all SIPs</Text>
            </TouchableOpacity>
          </View>

          {/* ── START NEW SIP ── */}
          <View style={styles.tagCard}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>Start New SIP</Text>
            </View>
            <View style={styles.tagCardBody}>
              <View style={styles.newSipRow}>
                {NEW_SIP_FUNDS.map((f) => (
                  <TouchableOpacity key={f.id} style={styles.fundBtn} activeOpacity={0.8}>
                    <View style={styles.fundBtnDot} />
                    <Text style={styles.fundBtnName}>{f.name}</Text>
                    <Text style={styles.fundBtnArrow}>▶</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.viewAllRow}>
              <TouchableOpacity style={styles.viewAllBtn} activeOpacity={0.85}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

/* ── small reusable components ── */
const SectionHeader = ({ title, viewMore,  onPress}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {viewMore && <Text onPress={onPress} style={styles.viewMore}>View more...</Text>}
  </View>
);

const StatItem = ({ label, value, green }) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statVal, green && styles.green]}>{value}</Text>
  </View>
);

/* ============ STYLES ============ */

const PURPLE = "#534AB7";
const PURPLE_LIGHT = "#EEEDFE";
const BORDER = "#C8C2F8";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 40 },

  searchBox: { flexDirection: "row", alignItems: "center", margin: 16, borderWidth: 1.5, borderColor: "#7F77DD", borderRadius: 14, height: 54, paddingHorizontal: 14, gap: 10 },
  searchPlaceholder: { fontSize: 15, color: "#bbb" },

  portfolioCard: { marginHorizontal: 16, marginBottom: 20, backgroundColor: PURPLE_LIGHT, borderRadius: 18, borderWidth: 1.5, borderColor: BORDER, padding: 16 },
  portfolioTitle: { fontSize: 16, fontWeight: "700", color: "#1a1a1a", marginBottom: 10 },
  cvLabel: { fontSize: 12, color: "#666", marginBottom: 2 },
  cvValue: { fontSize: 32, fontWeight: "700", color: "#1E8A4A", marginBottom: 12 },
  invRow: { flexDirection: "row", gap: 40, marginBottom: 14 },
  invLabel: { fontSize: 12, color: "#555", marginBottom: 2 },
  invVal: { fontSize: 22, fontWeight: "700", color: "#1a1a1a" },
  green: { color: "#1E8A4A" },
  addBar: { backgroundColor: "#fff", borderRadius: 10, padding: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  addBarText: { fontSize: 12, color: "#555", flex: 1, marginRight: 8 },
  addBtn: { backgroundColor: PURPLE, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#1a1a1a" },
  viewMore: { fontSize: 13, color: PURPLE },

  hScrollContent: { paddingHorizontal: 16, paddingBottom: 20 },

  trendCard: { width: 220, borderWidth: 1.5, borderColor: BORDER, borderRadius: 16, padding: 14, marginRight: 12, backgroundColor: "#fff" },
  trendTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  trendLogo: { width: 40, height: 40, borderRadius: 20, backgroundColor: PURPLE_LIGHT, borderWidth: 1, borderColor: BORDER },
  trendName: { flex: 1, fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  trendStats: { flexDirection: "row", gap: 14 },
  statItem: { flex: 1 },
  statLabel: { fontSize: 10, color: "#888", marginBottom: 2 },
  statVal: { fontSize: 14, fontWeight: "700", color: "#1a1a1a" },

  filterItem: { alignItems: "center", gap: 8, marginRight: 12 },
  filterBox: { width: 80, height: 80, borderWidth: 1.5, borderColor: BORDER, borderRadius: 16, backgroundColor: PURPLE_LIGHT },
  filterLabel: { fontSize: 11, color: "#444", textAlign: "center", maxWidth: 80, lineHeight: 16 },

  catChip: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1.5, borderColor: BORDER, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 12, backgroundColor: "#fff" },
  catLogo: { width: 28, height: 28, borderRadius: 14, backgroundColor: PURPLE_LIGHT, borderWidth: 1, borderColor: BORDER },
  catName: { fontSize: 14, fontWeight: "500", color: "#1a1a1a" },
  catArrow: { fontSize: 10, color: PURPLE },

  amcItem: { alignItems: "center", gap: 8, marginRight: 12 },
  amcLogo: { width: 72, height: 72, borderRadius: 16, backgroundColor: PURPLE_LIGHT, borderWidth: 1.5, borderColor: BORDER, justifyContent: "center", alignItems: "center" },
  amcShort: { fontSize: 11, fontWeight: "700", color: PURPLE, textAlign: "center" },
  amcName: { fontSize: 11, color: "#444", textAlign: "center", maxWidth: 72 },

  tagCard: { marginHorizontal: 16, marginBottom: 20, borderWidth: 1.5, borderColor: BORDER, borderRadius: 18, overflow: "hidden" },
  tagBadge: { alignSelf: "flex-start", backgroundColor: PURPLE, paddingHorizontal: 14, paddingVertical: 5, borderBottomRightRadius: 10, borderBottomLeftRadius: 0, borderTopLeftRadius: 0 },
  tagBadgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  tagCardBody: { padding: 16 },
  sipRow: { flexDirection: "row", gap: 40 },
  sipLabel: { fontSize: 13, color: "#555", marginBottom: 4 },
  sipVal: { fontSize: 26, fontWeight: "700", color: "#1a1a1a" },
  tagCardFooter: { borderTopWidth: 1, borderTopColor: "#eee", padding: 12 },
  tagCardFooterText: { fontSize: 14, color: PURPLE, fontWeight: "500" },

  newSipRow: { flexDirection: "row", gap: 10 },
  fundBtn: { flex: 1, borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  fundBtnDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: PURPLE },
  fundBtnName: { flex: 1, fontSize: 13, fontWeight: "500", color: "#1a1a1a" },
  fundBtnArrow: { fontSize: 10, color: PURPLE },
  viewAllRow: { flexDirection: "row", justifyContent: "flex-end", padding: 12, paddingTop: 4 },
  viewAllBtn: { backgroundColor: PURPLE, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 },
  viewAllText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});