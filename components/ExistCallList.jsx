import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Image } from "expo-image";
import * as Animatable from "react-native-animatable";
import Entypo from "@expo/vector-icons/Entypo";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../app/constants";
import { formatDateToDDMMYYYY } from '../utils/commonFunctions';
import Foundation from "@expo/vector-icons/Foundation";

const ExistCallList = ({ dataList = [], status = "active", }) => {
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
        <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}>
            {dataList.map((data) => {
                const exitDate = data?.exit_date ? new Date(data.exit_date) : null;
                return (
                    <View style={styles.card} key={data?.id}>
                        {/* Top section */}
                        <View style={styles.cardSections}>
                            <View style={{ flexDirection: "row", gap: 3 }}>
                                <Text style={[styles.boldText, { fontSize: 18, width: "75%" }]}>
                                    {data?.stocks?.name || "NA"}
                                </Text>
                            </View>
                            <View style={{ gap: 5 }}>
                                <Text style={[styles.lightText]}>
                                    Exit on
                                </Text>
                                <Text style={[{ fontSize: 12, color: COLORS.fontWhite, fontWeight: "600" }]}>{formatDateToDDMMYYYY(data?.created_at) || "NA"}</Text>
                            </View>
                        </View>

                        {/* Prices section */}
                        <View style={styles.cardSections}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.lightText}>Exit Price</Text>
                                <Text style={styles.boldText}>₹{data?.price || "NA"}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                 <Text style={styles.lightText}>Profit & Loss</Text>
                                <Text style={[styles.boldText, styles.redText]}>₹{data?.profit_loss || "NA"}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.lightText}>Quantity</Text>
                                <Text style={[styles.boldText]}>{data?.qty || "NA"}</Text>
                            </View>
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default ExistCallList;

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.cardColor || "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        position: "relative"
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
