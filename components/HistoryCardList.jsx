import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Image } from "expo-image";
import * as Animatable from "react-native-animatable";
import Entypo from "@expo/vector-icons/Entypo";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../app/constants";

const HistoryCardList = ({ dataList = [], status = "active", setReportData, router, serviceID }) => {
    const getRiskLevelColor = (riskLevel) => {
        const colors = {
            buy: COLORS.secondaryColor,
            sell: COLORS.profitColor,
            hold: COLORS.lossColor,
        };
        return colors[riskLevel?.toLowerCase()] || '#6c757d';
    };

    const getRiskLevellabel = (riskLevel) => {
        const label = {
            buy: "BUY",
            hold: "HOLD",
            sell: "EXIT",
        };
        return label[riskLevel?.toLowerCase()] || "NA";
    };

    if (dataList.length === 0) {
        return (
            <View style={styles.content}>
                <Animatable.View animation="bounceInDown" delay={300} duration={1000} useNativeDriver>
                    <Entypo name="new" size={100} color={COLORS.secondaryColor} style={{ marginBottom: 20 }} />
                </Animatable.View>
                <Animatable.Text
                    animation="pulse"
                    iterationCount="infinite"
                    duration={2000}
                    style={styles.text}
                >
                    {status === "active" ? "No Recommendations available." : "No history found."}
                </Animatable.Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {dataList.map((data) => {
                const date = new Date(data?.created_at);
                const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

                return (
                    <View style={styles.card} key={data?.id}>
                        {/* Top section */}
                        <View style={styles.cardSections}>
                            <View style={{ flexDirection: "row", gap: 3 }}>
                                <Image
                                    source={{ uri: data?.stock?.company_logo || "" }}
                                    style={{ width: 30, height: 30, borderRadius: 50, marginRight: 10 }}
                                />
                                <Text style={[styles.boldText, { fontSize: 18, width: "75%" }]}>
                                    {data?.stock?.name || "NA"}
                                </Text>
                            </View>
                            <View style={{ gap: 5 }}>
                                <Text style={[styles.boldText, {
                                    paddingHorizontal: 4,
                                    paddingVertical: 2,
                                    backgroundColor: getRiskLevelColor(data?.recommendation_type),
                                    borderRadius: 5,
                                    color: COLORS.fontWhite,
                                    textAlign: "center"
                                }]}>
                                    {getRiskLevellabel(data?.recommendation_type)}
                                </Text>
                                <Text style={[styles.lightText, { fontSize: 12 }]}>{formattedDate}</Text>
                            </View>
                        </View>

                        {/* Prices section */}
                        <View style={styles.cardSections}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.lightText}>Entry Level</Text>
                                <Text style={styles.boldText}>₹{data?.buy_price || "NA"}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.lightText}>Target</Text>
                                <Text style={[styles.boldText, styles.greenText]}>₹{data?.target_price || ""}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.lightText}>Upside</Text>
                                <Text style={[styles.boldText, styles.greenText]}>{data?.upside || ""}%</Text>
                            </View>
                        </View>

                        {/* Stop loss + duration */}
                        <View style={styles.cardSections}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.lightText}>Stop Loss</Text>
                                <Text style={[styles.boldText, styles.redText]}>₹{data?.stop_loss_price || "NA"}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.lightText}>Duration</Text>
                                <Text style={styles.boldText}>{data?.holding_period || "NA"} days</Text>
                            </View>
                            <View style={{ flex: 1 }} />
                        </View>

                        {/* Report link */}
                        <View style={[styles.cardSections, { borderBottomColor: COLORS.cardColor }]}>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", gap: 2, alignSelf: "center" }}
                                onPress={() => {
                                    setReportData({ "serviceData": data, "serviceID": serviceID });
                                    router.push("fastLaneReport");
                                }}
                            >
                                <Text style={[styles.lightText, { color: COLORS.secondaryColor }]}>REPORT ANALYSIS</Text>
                                <MaterialIcons name="chevron-right" size={18} color={COLORS.secondaryColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default HistoryCardList;

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.cardColor || "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    cardSections: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primaryColor,
        paddingVertical: 10
    },
    boldText: {
        fontWeight: "bold",
        color: "white",
    },
    lightText: {
        color: "#ccc",
    },
    greenText: {
        color: COLORS.profitColor,
    },
    redText: {
        color: COLORS.lossColor,
    },
    content: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    text: {
        color: "white",
        fontSize: 16,
        marginTop: 10,
    }
});
