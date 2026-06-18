import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Image } from "expo-image";
import * as Animatable from "react-native-animatable";
import Entypo from "@expo/vector-icons/Entypo";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../constants.js";
import { formatDateToDDMMYYYY } from '../utils/commonFunctions';
import Foundation from "@expo/vector-icons/Foundation";

const HistoryCardList = ({ dataList = [], status = "active", }) => {
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
                const today = new Date();
                let showNewIcon = false;

                if (exitDate) {
                    // Sirf date compare karne ke liye time reset
                    const onlyExit = new Date(exitDate.setHours(0, 0, 0, 0));
                    const onlyToday = new Date(today.setHours(0, 0, 0, 0));

                    // Difference in days (today - exitDate)
                    const diffInTime = onlyToday - onlyExit;
                    const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

                    // Agar exit_date se leke agle 3 din ke andar hai
                    if (diffInDays >= 0 && diffInDays <= 3) {
                        showNewIcon = true;
                    }
                }

                return (
                    <View style={styles.card} key={data?.id}>
                       {showNewIcon && <View style={{position: "absolute", right: 10, top: -10, zIndex: 9999}}>
                         <Foundation
                            name="burst-new"
                            size={30}
                            style={{ transform: [{ rotate: "30deg" }] }}
                            color={COLORS.orangeColor}
                        />
                       </View>
                        }
                        {/* Top section */}
                        <View style={styles.cardSections}>
                            <View style={{ flexDirection: "row", gap: 3, alignItems: "start", flex: 1 ,justifyContent: "space-between"}}>
                                {/* <Image
                                    source={{ uri: data?.stock?.company_logo || "" }}
                                    style={{ width: 30, height: 30, borderRadius: 50, marginRight: 10 }}
                                /> */}
                                <Text style={[styles.boldText, { fontSize: 18}]}>
                                    {data?.stock?.company_name || "NA"}
                                </Text>
                            <View style={{ gap: 5 }}>
                                {/* <Text style={[styles.boldText, {
                                    paddingHorizontal: 4,
                                    paddingVertical: 2,
                                    backgroundColor: getRiskLevelColor(data?.recommendation_type),
                                    borderRadius: 5,
                                    color: COLORS.fontWhite,
                                    textAlign: "center"
                                }]}>
                                    {getRiskLevellabel(data?.recommendation_type)}
                                </Text> */}
                                <Text style={[styles.lightText]}>
                                    Published On
                                </Text>
                                <Text style={[{ fontSize: 12, color: COLORS.fontWhite, fontWeight: "600" }]}>{formatDateToDDMMYYYY(data?.published_on) || "NA"}</Text>
                            </View>
                            </View>
                        </View>

                        {/* Prices section */}
                        <View style={styles.cardSections}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.lightText}>Entry Price</Text>
                                <Text style={styles.boldText}>₹{data?.buy_price || "NA"}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                 <Text style={styles.lightText}>Stop Loss</Text>
                                <Text style={[styles.boldText, styles.redText]}>₹{data?.stop_loss_price || "NA"}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.lightText}>Exit price</Text>
                                <Text style={[styles.boldText]}>{data?.exit_price || "NA"}</Text>
                            </View>
                        </View>

                        {/* Stop loss + duration */}
                        <View style={styles.cardSections}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.lightText}>Gains/Loss</Text>
                                <Text
                                    style={[
                                        styles.boldText,
                                        Number.isFinite(Number(data?.gain_loss_price)) && Number(data?.gain_loss_price) >= 0
                                            ? styles.greenText
                                            : styles.redText,
                                    ]}
                                >
                                    {Number.isFinite(Number(data?.gain_loss_price)) ? Number(data?.gain_loss_price) : 0}%
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.lightText}>Entry Date</Text>
                                <Text style={styles.boldText}>{formatDateToDDMMYYYY(data?.exit_date) || "NA"}</Text>
                            </View>
                            
                            <View style={{ flex: 1 }}>
                                <Text style={styles.lightText}>Holding Period</Text>
                                <Text style={styles.boldText}>{data?.holding_period || "NA"} days</Text>
                            </View>
                        </View>

                        {/* Report link */}
                        {/* <View style={[styles.cardSections, { borderBottomColor: COLORS.cardColor }]}>
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
                        </View> */}
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
        position: "relative",
        boxShadow: COLORS.boxShadow,
        marginHorizontal: 15,
    },
    cardSections: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 10
    },
    boldText: {
        fontWeight: "bold",
        color: COLORS.fontWhite,
    },
    lightText: {
        color: COLORS.lightGray,
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
