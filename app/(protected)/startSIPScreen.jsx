import React, { useState } from "react";
import {
    StyleSheet, Text, View, TouchableOpacity,
    TextInput, StatusBar, KeyboardAvoidingView,
    Platform, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import Header from "@components/Header";

/* ============ MOCK DATA ============ */

const FUND = {
    id: 1,
    fund_name: "HDFC Fund A",
    logo: null,
    category: "Sectorial Fund",
    min_sip: 100,
    aum: "₹78,000 cr",
    expense_ratio: "0.84%",
};

const IMAGE_BASE_URL = "https://planmoney.in/assets/logo/";

/* ============ SCREEN ============ */

export default function StartSIPScreen({ route, navigation }) {
    // jab real data aaye: const { fund } = route.params;
    const fund = FUND;

    const [amount, setAmount] = useState("1000");
    const [sipDate, setSipDate] = useState("19");

    const handleStart = () => {
        const parsedAmount = parseInt(amount, 10);
        const parsedDate = parseInt(sipDate, 10);

        if (!parsedAmount || parsedAmount < fund.min_sip) {
            alert(`Minimum SIP amount is ₹${fund.min_sip}`);
            return;
        }
        if (!parsedDate || parsedDate < 1 || parsedDate > 28) {
            alert("SIP date must be between 1 and 28");
            return;
        }

        // TODO: API call
        console.log("Starting SIP:", { fund_id: fund.id, amount: parsedAmount, date: parsedDate });
    };

    return (
        <>
            <SafeAreaView edges={[""]} style={{ backgroundColor: "#fff" }} />
            <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />

                <Header title="Start SIP" showBackButton />

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={90}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >

                        {/* ── FUND CARD ── */}
                        <View style={styles.fundCard}>
                            <View style={styles.logoCircle}>
                                {fund.logo ? (
                                    <Image
                                        source={{ uri: `${IMAGE_BASE_URL}${fund.logo}` }}
                                        style={styles.logo}
                                        contentFit="contain"
                                    />
                                ) : (
                                    <Text style={styles.logoText}>Logo</Text>
                                )}
                            </View>
                            <View>
                                <Text style={styles.fundName}>{fund.fund_name}</Text>
                                <View style={styles.categoryTag}>
                                    <Text style={styles.categoryText}>{fund.category}</Text>
                                </View>
                            </View>
                        </View>

                        {/* ── SCHEME INFO ── */}
                        <Text style={styles.sectionLabel}>Scheme Info</Text>
                        <View style={styles.schemeCard}>
                            <View style={styles.schemeItem}>
                                <Text style={styles.schemeLabel}>Minimum SIP</Text>
                                <Text style={styles.schemeVal}>₹{fund.min_sip}</Text>
                            </View>
                            <View style={styles.schemeItem}>
                                <Text style={styles.schemeLabel}>AUM</Text>
                                <Text style={styles.schemeVal}>{fund.aum}</Text>
                            </View>
                            <View style={styles.schemeItem}>
                                <Text style={styles.schemeLabel}>Expense Ratio</Text>
                                <Text style={styles.schemeVal}>{fund.expense_ratio}</Text>
                            </View>
                        </View>

                        {/* ── SIP AMOUNT ── */}
                        <Text style={styles.sectionLabel}>SIP Amount</Text>
                        <View style={styles.inputCard}>
                            <Text style={styles.rupeeIcon}>₹</Text>
                            <TextInput
                                style={styles.amountInput}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="number-pad"
                                placeholder="Enter amount"
                                placeholderTextColor="#bbb"
                                returnKeyType="done"
                            />
                        </View>

                        {/* ── SIP DATE ── */}
                        <Text style={styles.sectionLabel}>SIP Date</Text>
                        <View style={styles.inputCard}>
                            <Ionicons name="calendar-outline" size={26} color="#444" />
                            <TextInput
                                style={styles.amountInput}
                                value={sipDate}
                                onChangeText={(t) => {
                                    const n = parseInt(t, 10);
                                    if (!t) { setSipDate(""); return; }
                                    if (n >= 1 && n <= 28) setSipDate(t);
                                }}
                                keyboardType="number-pad"
                                placeholder="1 – 28"
                                placeholderTextColor="#bbb"
                                returnKeyType="done"
                                maxLength={2}
                            />
                        </View>

                        {/* ── SPACER ── */}
                        <View style={{ flex: 1 }} />

                        {/* ── FOOTER ── */}
                        <View style={styles.footer}>
                            <Text style={styles.tnc}>
                                By proceeding, you accept Planmoney's terms &amp; Conditions
                            </Text>
                            <TouchableOpacity
                                style={styles.startBtn}
                                onPress={handleStart}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.startBtnText}>Start your SIP</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}

/* ============ STYLES ============ */

const PURPLE = "#534AB7";
const PURPLE_LIGHT = "#EEEDFE";
const BORDER = "#7F77DD";

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#fff" },
    scrollContent: { padding: 16, paddingBottom: 32, flexGrow: 1 },

    fundCard: { backgroundColor: PURPLE_LIGHT, borderRadius: 16, borderWidth: 1.5, borderColor: BORDER, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 20 },
    logoCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#fff", borderWidth: 1, borderColor: "#C8C2F8", justifyContent: "center", alignItems: "center" },
    logo: { width: 36, height: 36 },
    logoText: { fontSize: 11, color: "#aaa" },
    fundName: { fontSize: 20, fontWeight: "700", color: "#1a1a1a", marginBottom: 6 },
    categoryTag: { borderWidth: 1, borderColor: "#555", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start" },
    categoryText: { fontSize: 12, color: "#555", fontStyle: "italic" },

    sectionLabel: { fontSize: 18, fontWeight: "700", color: "#1a1a1a", marginBottom: 10 },

    schemeCard: { backgroundColor: PURPLE_LIGHT, borderRadius: 16, borderWidth: 1.5, borderColor: BORDER, padding: 18, flexDirection: "row", marginBottom: 20 },
    schemeItem: { flex: 1 },
    schemeLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
    schemeVal: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },

    inputCard: { backgroundColor: PURPLE_LIGHT, borderRadius: 16, borderWidth: 1.5, borderColor: BORDER, padding: 18, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
    rupeeIcon: { fontSize: 28, color: "#666", fontWeight: "400" },
    amountInput: { flex: 1, fontSize: 38, fontWeight: "700", color: "#1a1a1a", padding: 0 },

    footer: { marginTop: 16, alignItems: "center", gap: 12 },
    tnc: { fontSize: 13, color: "#666", textAlign: "center" },
    startBtn: { width: "100%", backgroundColor: PURPLE, borderRadius: 16, paddingVertical: 20, alignItems: "center" },
    startBtnText: { color: "#fff", fontSize: 22, fontWeight: "600", letterSpacing: 0.3 },
});