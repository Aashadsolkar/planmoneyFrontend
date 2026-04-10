import React from "react";
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, StatusBar, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "@components/Header";

/* ============ MOCK DATA ============ */

const PORTFOLIO = {
  current_value: 12000,
  investment:    10000,
  profit:         2000,
};

const SIPS = [
  { id: 1, fund_name: "Fund A", invested: 5000,  avg: 302, qty: 25,  pnl: 23,  current_value: 5023 },
  { id: 2, fund_name: "Fund B", invested: 4000,  avg: 32,  qty: 654, pnl: 298, current_value: 4298 },
  { id: 3, fund_name: "Fund C", invested: 3000,  avg: 568, qty: 10,  pnl: 780, current_value: 3780 },
];

/* ============ HELPERS ============ */

const fmt      = (n) => "₹" + Number(n).toLocaleString("en-IN");
const fmtPlain = (n) => Number(n).toLocaleString("en-IN");

/* ============ SCREEN ============ */

export default function MFPortfolioScreen({ navigation }) {
  return (
    <>
      <SafeAreaView edges={[""]} style={{ backgroundColor: "#fff" }} />
      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        <Header title="MF Portfolio" showBackButton />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {/* ── SEARCH (tappable — navigates to list) ── */}
          <TouchableOpacity
            style={styles.searchBox}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("MutualFundsList")}
          >
            <Ionicons name="search-outline" size={18} color="#aaa" />
            <Text style={styles.searchPlaceholder}>Search for Mutual funds</Text>
          </TouchableOpacity>

          {/* ── PORTFOLIO SUMMARY CARD ── */}
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
          </View>

          {/* ── YOUR SIPs ── */}
          <Text style={styles.sectionTitle}>Your SIPs</Text>

          <FlatList
            data={SIPS}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}   // parent ScrollView handles scroll
            contentContainerStyle={styles.sipList}
            renderItem={({ item }) => {
              const isProfit = item.pnl >= 0;
              return (
                <TouchableOpacity
                  style={styles.sipCard}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("FundDetail", { id: item.id })}
                >
                  {/* LEFT */}
                  <View style={styles.sipLeft}>
                    <Text style={styles.sipName}>{item.fund_name}</Text>
                    <Text style={styles.sipSub}>Inv. {fmtPlain(item.invested)}</Text>
                    <Text style={styles.sipSub}>Avg. {item.avg} | Qty. {item.qty}</Text>
                  </View>

                  {/* RIGHT */}
                  <View style={styles.sipRight}>
                    <Text style={[styles.sipPnl, !isProfit && styles.red]}>
                      {isProfit ? "+" : ""}{item.pnl.toFixed(2)}
                    </Text>
                    <Text style={styles.sipCurrentVal}>
                      Value: {fmtPlain(item.current_value)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {/* ── ADD MORE BAR ── */}
          <View style={styles.addBar}>
            <Text style={styles.addBarText}>
              Have extra cash? Add more in Mutual Funds
            </Text>
            <TouchableOpacity
              style={styles.addBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("MutualFundsList")}
            >
              <Text style={styles.addBtnText}>Add more</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

/* ============ STYLES ============ */

const PURPLE       = "#534AB7";
const PURPLE_LIGHT = "#EEEDFE";
const BORDER       = "#7F77DD";

const styles = StyleSheet.create({
  safeArea:        { flex: 1, backgroundColor: "#fff" },
  scrollContent:   { paddingBottom: 40 },

  searchBox:       { flexDirection: "row", alignItems: "center", margin: 16, marginBottom: 14, borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, height: 54, paddingHorizontal: 14, gap: 10, backgroundColor: PURPLE_LIGHT },
  searchPlaceholder:{ fontSize: 15, color: "#aaa" },

  portfolioCard:   { marginHorizontal: 16, marginBottom: 22, backgroundColor: PURPLE_LIGHT, borderRadius: 18, borderWidth: 1.5, borderColor: BORDER, padding: 18 },
  portfolioTitle:  { fontSize: 17, fontWeight: "700", color: "#1a1a1a", marginBottom: 14 },
  cvLabel:         { fontSize: 13, color: "#555", marginBottom: 2 },
  cvValue:         { fontSize: 34, fontWeight: "700", color: "#1E8A4A", marginBottom: 14 },
  invRow:          { flexDirection: "row", gap: 48 },
  invLabel:        { fontSize: 13, color: "#555", marginBottom: 2 },
  invVal:          { fontSize: 26, fontWeight: "700", color: "#1a1a1a" },
  green:           { color: "#1E8A4A" },
  red:             { color: "#D9232D" },

  sectionTitle:    { fontSize: 18, fontWeight: "700", color: "#1a1a1a", paddingHorizontal: 16, marginBottom: 12 },

  sipList:         { paddingHorizontal: 16, gap: 12 },
  sipCard:         { backgroundColor: PURPLE_LIGHT, borderRadius: 16, borderWidth: 1.5, borderColor: BORDER, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  sipLeft:         { flex: 1 },
  sipName:         { fontSize: 17, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
  sipSub:          { fontSize: 13, color: "#666", marginBottom: 2 },
  sipRight:        { alignItems: "flex-end" },
  sipPnl:          { fontSize: 22, fontWeight: "700", color: "#1E8A4A" },
  sipCurrentVal:   { fontSize: 13, color: "#666", marginTop: 2 },

  addBar:          { marginHorizontal: 16, marginTop: 6, backgroundColor: PURPLE_LIGHT, borderRadius: 14, borderWidth: 1.5, borderColor: BORDER, padding: 14, flexDirection: "row", alignItems: "center" },
  addBarText:      { flex: 1, fontSize: 13, color: "#555", marginRight: 10 },
  addBtn:          { backgroundColor: PURPLE, borderRadius: 22, paddingHorizontal: 20, paddingVertical: 10 },
  addBtnText:      { color: "#fff", fontSize: 14, fontWeight: "600" },
});