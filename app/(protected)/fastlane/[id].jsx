import React, { useCallback, useEffect, useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView,useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../../constants.js";
import { getFastlaneData, getFastlaneHistoryData } from "@utils/apiCaller";
import { useAuth } from "@context/useAuth";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import Header from "@components/Header";
import Button from "@components/Button";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import FullScreenLoader from "@components/FullScreenLoader";
import * as Animatable from "react-native-animatable";
import Entypo from "@expo/vector-icons/Entypo";
import { Image } from "expo-image";
import { showToast } from "@components/CustomToast/ToastService";

const FastLane = () => {
    const { token, customerServiceData, setReportData, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [fastlaneData, setFastlaneData] = useState([]);
const insets = useSafeAreaInsets();

    const { id } = useLocalSearchParams();

    useFocusEffect(
        useCallback(() => {
            const callFastlaneApi = async () => {
                try {
                    setIsLoading(true);
                    const response = await getFastlaneData(token, id);
                    const data = response?.data?.services || [];
                    const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                    setFastlaneData(sortedData || []);
                } catch (error) {
                    showToast({
                        type: "error",
                        title: `Something went wrong! 😥`,
                        message: `${error?.error || error?.message || "Failed to get service data"}`,
                        redirectPath: "home",
                        sessionExired: error?.error == "Another session is active." ? true : false,
                        logout: logout
                    });
                } finally {
                    setIsLoading(false);
                }
            };
            // if (customerServiceData?.questionnaire_status == 1) {
                callFastlaneApi();
            // }
        }, [id])
    );


    const getRiskLevelColor = (riskLevel) => {
        const colors = {
            buy: COLORS.profitColor,
            sell: COLORS.lossColor,
            hold: COLORS.secondaryColor,
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

    const renderCardList = (dataList, status) => {
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
                        {status == "active" ? "No Recommendations available." : "No history found."}
                    </Animatable.Text>
                </View>
            );
        }

        return dataList.map((data) => {
            const date = new Date(data?.created_at);
            const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            return (
                <View style={styles.card} key={data?.id}>
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
                    <View style={[styles.cardSections, { borderBottomColor: COLORS.cardColor }]}>
                        <TouchableOpacity
                            style={{ flexDirection: "row", alignItems: "center", gap: 2, alignSelf: "center" }}
                            onPress={() => {
                                setReportData({ "serviceData": data, "serviceID": id });
                                router.push("fastLaneReport");
                            }}
                        >
                            <Text style={[styles.lightText, { color: COLORS.secondaryColor }]}>REPORT ANALYSIS</Text>
                            <MaterialIcons name="chevron-right" size={18} color={COLORS.secondaryColor} />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        });
    };

    // if (customerServiceData?.questionnaire_status == 0) {
    //     return (
    //         <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardColor }}>
    //             <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
    //             <Header title="Hi Vignesh" showBackButton />
    //             <ScrollView style={{ paddingHorizontal: 20, backgroundColor: COLORS.primaryColor, paddingTop: 100 }}>
    //                 <View style={{ alignItems: 'center', width: "100%" }}>
    //                     <Image
    //                         source={require('../../../assets/images/questionCirlce.png')}
    //                         style={styles.logo}
    //                         contentFit="contain"
    //                     />
    //                     <Text style={{ fontSize: 25, fontWeight: 600, color: COLORS.fontWhite, paddingVertical: 20 }}>Oops..!</Text>
    //                     <Text style={{ fontSize: 14, color: COLORS.fontWhite, paddingVertical: 20, textAlign: "center", width: 250 }}>
    //                         Its look like you have not filled your Details after Subscription
    //                     </Text>
    //                 </View>
    //                 <Button
    //                     onClick={() => router.push("forms/totalInvestmentForm")}
    //                     label={"PROCEED"}
    //                     gradientColor={['#D36C32', '#F68F00']}
    //                     buttonStye={{ marginHorizontal: 20 }}
    //                 />
    //             </ScrollView>
    //         </SafeAreaView>
    //     );
    // }

    if (isLoading) {
        return <FullScreenLoader visible={isLoading} />;
    }

    return (
        <SafeAreaView edges={['right','bottom','left']} style={{ flex: 1, backgroundColor: COLORS.cardColor }}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header
                title="Hi Vignesh"
                showBackButton
                backButtonText={() => <Text style={{ color: COLORS.fontWhite, fontSize: 18, fontWeight: 600 }}>{id == 1 ? "FastLane" : "Premium Research"}</Text>}
            />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 20, backgroundColor: COLORS.primaryColor, paddingTop: 15 }}
            >
                <Text style={styles.heading}>Stock Recommendations</Text>
                <View style={{ marginBottom: 50 }}>
                    {renderCardList(fastlaneData, "active")}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 18,
        color: COLORS.fontWhite,
        fontWeight: 600,
        marginBottom: 15,
    },
    card: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: COLORS.cardColor,
        marginBottom: 20,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.secondaryColor,
        boxShadow: COLORS.boxShadow,
    },
    cardSections: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primaryColor,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    lightText: {
        fontSize: 15,
        fontWeight: '400',
        color: COLORS.lightGray,
    },
    boldText: {
        color: COLORS.fontWhite,
        fontWeight: '700',
        fontSize: 15,
    },
    greenText: {
        color: COLORS.profitColor,
    },
    redText: {
        color: COLORS.lossColor,
    },
    content: {
        flex: 1,
        marginTop: 100,
        backgroundColor: COLORS.primaryColor,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: COLORS.fontWhite,
        fontWeight: "600",
        fontSize: 20,
        textAlign: "center",
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: COLORS.cardColor,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 10
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        // borderRadius: 20,
        backgroundColor: COLORS.primaryColor,
        flex: 1
    },
    activeTab: {
        backgroundColor: COLORS.secondaryColor,
    },
    tabText: {
        color: COLORS.fontWhite,
        fontWeight: '600',
        textAlign: "center"
    },
    activeTabText: {
        color: COLORS.fontWhite,
    },
});

export default FastLane;
