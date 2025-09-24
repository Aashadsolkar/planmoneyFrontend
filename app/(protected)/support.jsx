import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@components/Header"
import { COLORS } from "../constants"
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";

export default function Support() {

    const handleCall = (number) => {
        Linking.openURL(`tel:${number}`);
    };

    const handleEmail = (email) => {
        Linking.openURL(`mailto:${email}`);
    };

    const companyInfo = [
        { label: "Company Name", value: "Econexx wealth Pvt Ltd." },
        { label: "BSE Membership No", value: "Under Process" },
        { label: "SEBI Reg No", value: "Under Process" },
        { label: "ARN Number", value: "337712" },
        { label: "Principal Officer", value: "Ovesh Khatri" },
        { label: "Email", value: "po-cio@planmoney.in / 8108181604" },
        { label: "Compliance Officer", value: "Aishwarya Shinde" },
        { label: "Email", value: "services@planmoney.in / 8108181602" },
    ];

    // helper function to render clickable email/phone
    const renderValue = (value) => {
        // multiple values ho sakte hain (split by / ya space)
        return value.split("/").map((v, i) => {
            const trimmed = v.trim();

            if (trimmed.includes("@")) {
                return (
                    <TouchableOpacity key={i} onPress={() => handleEmail(trimmed)}>
                        <Text style={styles.link}>{trimmed}</Text>
                    </TouchableOpacity>
                );
            } else if (/^\d{6,}$/.test(trimmed)) {
                return (
                    <TouchableOpacity key={i} onPress={() => handleCall(trimmed)}>
                        <Text style={styles.link}>{trimmed}</Text>
                    </TouchableOpacity>
                );
            } else {
                return (
                    <Text key={i} style={styles.normalText}>
                        {trimmed}
                    </Text>
                );
            }
        });
    };

    return (
        <SafeAreaView edges={[]} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header showBackButton={true} />

            <ScrollView style={{ backgroundColor: COLORS.primaryColor, padding: 20 }}>
                <Text style={styles.title}>Support</Text>

                {/* Call + Email Cards */}
                <View style={styles.card}>
                    <Ionicons name="call" size={24} color={COLORS.secondaryColor} />
                    <View style={styles.info}>
                        <Text style={styles.label}>Call us</Text>
                        <TouchableOpacity onPress={() => handleCall("9876543210")}>
                            <Text style={styles.link}>+91 98765 43210</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.card}>
                    <Ionicons name="mail" size={24} color={COLORS.secondaryColor} />
                    <View style={styles.info}>
                        <Text style={styles.label}>Email us</Text>
                        <TouchableOpacity onPress={() => handleEmail("support@planmoney.in")}>
                            <Text style={styles.link}>support@planmoney.in</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Company Info Section */}
                <View style={[styles.card, { flexDirection: "column", alignItems: "flex-start" }]}>
                    <Text style={styles.label}>Company Information</Text>
                    {companyInfo.map((item, index) => (
                        <View key={index} style={{ flexDirection: "row", marginBottom: 12, flexWrap: "wrap" }}>
                            {/* Label */}
                            <Text style={styles.infoLabel}>{item.label}: </Text>

                            {/* Value (clickable if phone/email) */}
                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                {renderValue(item.value)}
                            </View>
                        </View>
                    ))}

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cardColor,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.fontWhite,
        marginBottom: 30,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.cardColor,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    info: {
        marginLeft: 16,
    },
    label: {
        fontSize: 16,
        color: COLORS.fontWhite,
        fontWeight: "600",
    },
    infoLabel: {
        fontSize: 14,
        color: "#ccc",
        fontWeight: "500",
        marginBottom: 2,
    },
    link: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.secondaryColor,
        marginRight: 8,
        marginTop: 4,
    },
    normalText: {
        fontSize: 14,
        color: COLORS.fontWhite,
        marginRight: 8,
        marginTop: 4,
    },
    infoLabel: {
  fontSize: 14,
  color: "#ccc",
  fontWeight: "500",
},
link: {
  fontSize: 14,
  fontWeight: "600",
  color: COLORS.secondaryColor,
  marginRight: 8,
},
normalText: {
  fontSize: 14,
  color: COLORS.fontWhite,
  marginRight: 8,
},

});
