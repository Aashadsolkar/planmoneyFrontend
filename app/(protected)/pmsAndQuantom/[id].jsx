import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants';
import { getFastlaneData, getFastlaneHistoryData } from '../../utils/apiCaller';
import { useAuth } from '../../context/useAuth';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { router, useNavigation, useLocalSearchParams } from 'expo-router';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useFocusEffect } from '@react-navigation/native';
import FullScreenLoader from '../../components/FullScreenLoader';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from "expo-linking";
import * as Animatable from "react-native-animatable";
import Entypo from '@expo/vector-icons/Entypo';
import { Image } from 'expo-image';
import { showToast } from "../../components/CustomeToast/ToastService";

const PmsAndQuantom = () => {
    const { id, advisor_name, advisor_nummber, is_advisor_assign } = useLocalSearchParams();
    const { token, customerServiceData, setReportData } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [fastlaneData, setFastlaneData] = useState([]);
    const [historyData, setHistoryData] = useState([]);
    const [activeTab, setActiveTab] = useState('recommendations');
    const navigation = useNavigation();
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const callFastlaneApi = async () => {
                try {
                    setIsLoading(true);
                    const response = await getFastlaneData(token, id);
                    const data = response?.data?.services || [];
                    const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    setFastlaneData(sortedData);
                    setHistoryData(sortedData.slice(1, 3)); // Dummy history
                } catch (error) {
                    showToast({
                        type: "error",
                        title: `Something went wrong! 😥`,
                        message: `${error?.message || "Failed to get service data"}`,
                        redirectPath: "home",
                    });
                } finally {
                    setIsLoading(false);
                }
            };
            if (
                customerServiceData?.questionnaire_status == 1 &&
                customerServiceData?.verification_status == 1 &&
                is_advisor_assign == "true"
            ) {
                callFastlaneApi();
            }
        }, [id])
    );

    useFocusEffect(
        useCallback(() => {
            const callFastlaneHistoryApi = async () => {
                try {
                    setIsHistoryLoading(true);
                    const response = await getFastlaneHistoryData(token, id);
                    const data = response?.data?.services || [];
                    const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                    setHistoryData(sortedData || []);
                } catch (error) {
                    showToast({
                        type: "error",
                        title: `Something went wrong! 😥`,
                        message: `${error?.message || "Failed to get service history data"}`,
                        redirectPath: "home",
                    });
                } finally {
                    setIsHistoryLoading(false);
                }
            };
            if (customerServiceData?.questionnaire_status == 1 &&
                customerServiceData?.verification_status == 1 &&
                is_advisor_assign == "true") {
                callFastlaneHistoryApi();
            }
        }, [id])
    );

    const handleBuyButtonClick = (data) => {
        let path = "";
        if (id == 2) {
            path = "/buy_stock_pis";
        } else if (id == 3) {
            path = "/buy_stock_pms";
        } else {
            path = "/buy_stock_quantom";
        }
        router.push({
            pathname: path,
            params: {
                stockId: data?.stock_id,
                serviceID: id,
                type: "BUY",
                price: data?.buy_price,
                name: data?.stock?.name
            },
        });
    };

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
            sell: "SELL",
        };
        return label[riskLevel?.toLowerCase()] || "NA";
    };

    const renderCardList = (dataList, status) => {
        if (!dataList || dataList.length === 0) {
            return (
                <View style={styles.content}>
                    <Animatable.View animation="bounceInDown" delay={300} duration={1000} useNativeDriver>
                        <Entypo name="new" size={100} color={COLORS.secondaryColor} style={{ marginBottom: 20 }} />
                    </Animatable.View>
                    <Animatable.Text animation="pulse" iterationCount="infinite" duration={2000} style={styles.text}>
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
                        <View style={{ flex: 1, flexDirection: "row", gap: 3 }}>
                            <View style={{ marginRight: 10 }}>
                                {!data?.stock?.company_logo ? (
                                    <FontAwesome size={28} name="signal" color={"white"} />
                                ) : (
                                    <Image source={{ uri: data?.stock?.company_logo }} style={{ width: 30, height: 30, borderRadius: 50 }} />
                                )}
                            </View>
                            <View style={{ width: "75%"}}>
                                <Text style={[styles.boldText, { fontSize: 18 }]}>{data?.stock?.name || ""}</Text>
                            </View>
                        </View>
                        <View style={{ gap: 5 }}>
                            <Text style={[styles.boldText, {
                                paddingHorizontal: 4,
                                paddingVertical: 2,
                                backgroundColor: getRiskLevelColor(data?.recommendation_type || ""),
                                borderRadius: 5,
                                color: COLORS.fontWhite,
                                textAlign: "center",
                            }]}>
                                {getRiskLevellabel(data?.recommendation_type || "")}
                            </Text>
                            <Text style={[styles.lightText, { fontSize: 12 }]}>{formattedDate}</Text>
                        </View>
                    </View>
                    <View style={styles.cardSections}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.lightText}>Buy Price</Text>
                            <Text style={styles.boldText}>₹{data?.buy_price || ""}</Text>
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
                            <Text style={[styles.boldText, styles.redText]}>₹{data?.stop_loss_price || ""}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.lightText}>Duration</Text>
                            <Text style={styles.boldText}>{data?.holding_period || ""} days</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.lightText}>Quantity</Text>
                            <Text style={styles.boldText}>{data?.qty || ""}</Text>
                        </View>
                    </View>
                    <View style={[styles.cardSections, { borderBottomColor: COLORS.cardColor }]}>
                        <TouchableOpacity
                            onPress={() => {
                                setReportData({ serviceData: data, serviceID: id });
                                router.push("fastLaneReport");
                            }}
                            style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
                        >
                            <Text style={[styles.lightText, { color: COLORS.secondaryColor }]}>REPORT ANALYSIS</Text>
                            <MaterialIcons name="chevron-right" size={18} color={COLORS.secondaryColor} />
                        </TouchableOpacity>
                        {status == "active" && <TouchableOpacity
                            style={[styles.buttonWrapper, { alignSelf: "flex-end" }]}
                            onPress={() => handleBuyButtonClick(data)}
                        >
                            <Text style={styles.buttonText}>Buy</Text>
                        </TouchableOpacity>}
                    </View>
                </View>
            );
        });
    };

    const renderHeaderText = () => {
        switch (id) {
            case "3":
                return "PMS";
            case "4":
                return "Quantum Volt"
            case "2":
                return "PIS"
            default:
                return null;
        }
    }

    const backButtonText = () => {
        return (
            <Text style={{ color: COLORS.fontWhite, fontSize: 18, fontWeight: 600 }}>{renderHeaderText()}</Text>
        )
    }

    const openDialer = () => {
        const url = `tel:${advisor_nummber}`;
        Linking.openURL(url).catch((err) =>
            showToast({
                type: "error",
                title: `Something went wrong! 😥`,
                message: `Unable to open dialer`,
                redirectPath: "home",
            })
        );
    };

    if (customerServiceData?.questionnaire_status == 0) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor }}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
                <Header
                    title="Hi Vignesh"
                    showBackButton={true}
                />
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    style={{ paddingHorizontal: 20, marginTop: 80 }}
                >
                    <View style={{ alignItems: 'center', width: "100%", marginTop: 100 }}>
                        <Image
                            source={require('../../../assets/images/questionCirlce.png')}
                            style={styles.logo}
                            contentFit="contain"
                        />
                        <Text style={{ fontSize: 25, fontWeight: 600, color: COLORS.fontWhite, paddingVertical: 20 }}>Oops..!</Text>
                        <Text style={{ fontSize: 14, fontWeight: 400, color: COLORS.fontWhite, paddingVertical: 20, textAlign: "center", width: 250 }}>Its look like you have not filled your Details after Subscription</Text>
                    </View>
                    <Button onClick={() => router.push("forms/totalInvestmentForm")} label={"PROCEED"} gradientColor={['#D36C32', '#F68F00']} buttonStye={{ marginHorizontal: 20, }} />
                </ScrollView>
            </SafeAreaView>
        )
    }
    if (customerServiceData?.verification_status == 0 || is_advisor_assign == "false") {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardColor, }}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
                <Header
                    title="Hi Vignesh"
                    showBackButton={true}
                />
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    style={{ paddingHorizontal: 20, backgroundColor: COLORS.primaryColor }}
                >
                    <View style={{ alignItems: 'center', width: "100%", marginTop: 100 }}>
                        <Image
                            source={require('../../../assets/images/rightCircle.png')}
                            style={styles.logo}
                            contentFit="contain"
                        />
                        <Text style={{ fontSize: 25, fontWeight: 600, color: COLORS.fontWhite, paddingVertical: 20, textAlign: "center", width: 220 }}>Your Profile is Under Verification</Text>
                        <Text style={{ fontSize: 14, fontWeight: 400, color: COLORS.fontWhite, paddingVertical: 20, textAlign: "center", width: 250 }}>Please wait until our Advisor Approves your Profile</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    if (isLoading || isHistoryLoading) return <FullScreenLoader visible={isLoading} />;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardColor }}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header
                title="Hi Vignesh"
                showBackButton={true}
                backButtonText={backButtonText}
            />
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20, backgroundColor: COLORS.primaryColor }}>
                <TouchableOpacity style={{ marginVertical: 10 }}
                    onPress={openDialer}
                >
                    <LinearGradient
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        colors={['#AF125D', '#F68F00']}
                        style={{ padding: 15, borderRadius: 10, width: "100%", textAlign: "center", flexDirection: "row", justifyContent: "space-between" }}
                    >
                        <View>
                            <Text style={{ fontSize: 12, color: COLORS.fontWhite }}>Call our Advisor</Text>
                            <Text style={{ fontSize: 16, color: COLORS.fontWhite, fontWeight: 600 }}>{advisor_name}</Text>
                        </View>
                        <View>
                            <Image
                                source={require('../../../assets/images/phone-call.png')}
                                style={styles.logo}
                                contentFit="contain"
                            />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'recommendations' && styles.activeTab]}
                        onPress={() => setActiveTab('recommendations')}
                    >
                        <Text style={[styles.tabText, activeTab === 'recommendations' && styles.activeTabText]}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'history' && styles.activeTab]}
                        onPress={() => setActiveTab('history')}
                    >
                        <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'recommendations' && fastlaneData.length > 0 && <Text style={styles.heading}>Stock Recommendations</Text>}
                {activeTab === 'history' && historyData.length > 0 && <Text style={styles.heading}>Recommendation History</Text>}

                <View style={{ marginBottom: 50 }}>
                    {activeTab === 'recommendations' ? renderCardList(fastlaneData, "active") : renderCardList(historyData, "inActive")}
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
        borderLeftColor: COLORS.secondaryColor,
        borderLeftWidth: 3,
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
    buttonWrapper: {
        backgroundColor: "#04B719",
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: COLORS.fontWhite,
        fontWeight: 600,
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
        paddingHorizontal: 16,
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

export default PmsAndQuantom;
