import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import Header from '@components/Header';
import { router } from 'expo-router';
import { useAuth } from '@context/useAuth';
import { getFastLaneServiceData } from '@utils/apis/customer-api-caller';
import { newArrivals, service } from '@utils/apiCaller';
import SkeletonList from '@components/ListSkeleton';
import * as Animatable from 'react-native-animatable';
import Entypo from '@expo/vector-icons/Entypo';
import { showToast } from "@components/CustomToast/ToastService";
import { formatDateToDDMMYYYY } from '../../utils/commonFunctions';
import { Image } from 'expo-image';

const PremiumResearch = () => {
    const { token, setSelectedService, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [newArrivalsPlan, setNewArrivalsPlan] = useState({});
    const [boughtServices, setBoughtServices] = useState([]);
    const [unboughtServices, setUnboughtServices] = useState([]);
    const [activeTab, setActiveTab] = useState("unboughtServices");
    useEffect(() => {
        getNewArrivalsData(token, 6)
    }, [token])

    const getNewArrivalsData = async (token, id) => {
        try {
            const response = await getFastLaneServiceData(token, id);
            const boughtServices = response?.data?.boughtServices || []
            const unboughtServices = response?.data?.unboughtServices || []

            setBoughtServices(boughtServices)
            setUnboughtServices(unboughtServices)
            // getting new arrivals plan details
            const servicesResponse = await service();
            const services = servicesResponse?.data?.services;
            const plan = services.find(item => item.id === 6)?.plans?.[0];

            setNewArrivalsPlan(plan);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            showToast({
                type: "error",
                title: `Something went wrong! 😥`,
                message: `${error?.error || error?.message || "Failed to get Premium Research Data."}`,
                // redirectPath: "home",
                sessionExired: error?.error == "Another session is active." ? true : false,
                logout: logout
            });
        }
    }

    const renderStockListPurchased = () => {

        if (boughtServices.length == 0) {
            return (
                <View style={styles.content}>
                    <Animatable.View
                        animation="bounceInDown"
                        delay={300}
                        duration={1000}
                        useNativeDriver
                    >
                        <Entypo
                            name="new"
                            size={100}
                            color={COLORS.secondaryColor}
                            style={{ marginBottom: 20 }}
                        />
                    </Animatable.View>

                    <Animatable.Text
                        animation="pulse"
                        iterationCount="infinite"
                        duration={2000}
                        style={styles.text}
                    >
                        No Recommendations available.
                    </Animatable.Text>
                </View>
            )
        }

        return boughtServices.map((data) => {
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
                                 router.push({
                                     pathname: "openPdf",
                                     params: {
                                         url: data?.doc_file
                                     },
                                 });
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

    const getRiskLevelColor = (riskLevel) => {
        const colors = {
            buy: COLORS.profitColor,    // green
            // sell: COLORS.secondaryColor,// yellow
            // hold: COLORS.lossColor   // red
        };

        return colors[riskLevel.toLowerCase()] || '#6c757d'; // fallback: gray
    }

    const getRiskLevellabel = (riskLevel) => {
        const label = {
            buy: "BUY",
            // medium: "MED",
            // high: "HIGH"
        };

        return label[riskLevel.toLowerCase()]; // fallback: gray
    }

    // const renderStockListPurchased = () => {

    //     if (boughtServices.length == 0) {
    //         return (
    //             <View style={styles.content}>
    //                 <Animatable.View
    //                     animation="bounceInDown"
    //                     delay={300}
    //                     duration={1000}
    //                     useNativeDriver
    //                 >
    //                     <Entypo
    //                         name="new"
    //                         size={100}
    //                         color={COLORS.secondaryColor}
    //                         style={{ marginBottom: 20 }}
    //                     />
    //                 </Animatable.View>

    //                 <Animatable.Text
    //                     animation="pulse"
    //                     iterationCount="infinite"
    //                     duration={2000}
    //                     style={styles.text}
    //                 >
    //                     No Recommendations available.
    //                 </Animatable.Text>
    //             </View>
    //         )
    //     }

    //     if (isLoading) {
    //         return [1, 2, 3, 4, 5].map((v) => <SkeletonList key={v} />)
    //     }
    //     return boughtServices.map((service) => (
    //         <View key={service.id} style={styles.serviceCard}>
    //             <View style={styles.serviceHeader}>
    //                 <Text style={styles.serviceTitle}>{service.title}</Text>
    //             </View>
    //             <View style={styles.serviceDetails}>
    //                 <View style={styles.detailColumn}>
    //                     <Text style={styles.detailLabel}>As on</Text>
    //                     <Text style={styles.detailValue}>{formatDateToDDMMYYYY(service.created_at)}</Text>
    //                 </View>
    //                 <View style={styles.detailColumn}>
    //                     <Text style={styles.detailLabel}>Timeframe</Text>
    //                     {/* <Text style={styles.detailValue}>{getTimeframeLabel(service.valid_till)}</Text> */}
    //                 </View>
    //                 <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => {
    //                     setNewArrivalsDetails(service);
    //                     router.push({
    //                         pathname: "openPdf",
    //                         params: {
    //                             url: "https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf"
    //                         },
    //                     });
    //                 }}>
    //                     <Text style={{ color: COLORS.secondaryColor }}>View Details</Text><MaterialIcons name="chevron-right" size={18} color={COLORS.secondaryColor} />
    //                 </TouchableOpacity>
    //             </View>
    //         </View>
    //     ))
    // }

    const renderStockListNotPurchased = () => {

        if (unboughtServices.length == 0) {
            return (
                <View style={styles.content}>
                    <Animatable.View
                        animation="bounceInDown"
                        delay={300}
                        duration={1000}
                        useNativeDriver
                    >
                        <Entypo
                            name="new"
                            size={100}
                            color={COLORS.secondaryColor}
                            style={{ marginBottom: 20 }}
                        />
                    </Animatable.View>

                    <Animatable.Text
                        animation="pulse"
                        iterationCount="infinite"
                        duration={2000}
                        style={styles.text}
                    >
                        No Recommendations available.
                    </Animatable.Text>
                </View>
            )
        }

        if (isLoading) {
            return [1, 2, 3, 4, 5].map((v) => <SkeletonList key={v} />)
        }
        return unboughtServices.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
                <View style={{ flexDirection: "row", gap: 3, marginBottom: 20 }}>
                    <Image
                        source={{ uri: service?.stock?.company_logo || "" }}
                        style={{ width: 30, height: 30, borderRadius: 50, marginRight: 10 }}
                    />
                    <Text style={[styles.boldText, { fontSize: 18, width: "75%" }]}>
                        {service?.stock?.name || "NA"}
                    </Text>
                </View>
                <View style={styles.serviceDetails}>
                    <View style={styles.detailColumn}>
                        <Text style={styles.detailLabel}>Created Data</Text>
                        <Text style={styles.detailValue}>{formatDateToDDMMYYYY(service.created_at)}</Text>
                    </View>
                    <View style={styles.detailColumn}>
                        <Text style={styles.detailLabel}>Price</Text>
                        <Text style={styles.detailValue}>{service?.amount}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.buyButton}
                        onPress={() => {
                            setSelectedService({ new_arrival_id: service?.id, name: service?.stock?.company_name, offer_price: service?.amount, id: newArrivalsPlan?.id, billing_cycle: "yearly", serviceId: "6" })
                            router.push("checkout")
                        }}
                    >
                        <Text style={styles.buyButtonText}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        ))
    }

    if (isLoading) {
        return (
            <SafeAreaView edges={[]} style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#003366" />
                <Header showBackButton={true} />
                {[1, 2, 3, 4, 5].map((v) => <SkeletonList key={v} />)}
            </SafeAreaView>
        )
    }

    const backButtonText = () => {
            return (
                <Text style={{ color: COLORS.fontWhite, fontSize: 18, fontWeight: 600 }}>Premium Research</Text>
            )
        }

    return (
        <SafeAreaView edges={[]} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <Header showBackButton={true} backButtonText={backButtonText} />
            <View style={styles.tabContainer}>
                 <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "unboughtServices" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("unboughtServices")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "unboughtServices" && styles.activeTabText,
                        ]}
                    >
                        Not Purchased
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "boughtServices" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("boughtServices")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "boughtServices" && styles.activeTabText,
                        ]}
                    >
                        Purchased
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                {activeTab == "boughtServices" ? renderStockListPurchased() : renderStockListNotPurchased()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryColor,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#003366',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginRight: 16,
    },
    profileButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#990066',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: {
        color: '#fff',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
        padding: 16,
        paddingHorizontal: 20
    },
    serviceCard: {
        backgroundColor: COLORS.cardColor,
        borderRadius: 10,
        borderLeftWidth: 2,
        borderColor: '#ffaa00',
        marginBottom: 16,
        padding: 16,
    },
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.secondaryColor,
        flex: 1,
        paddingRight: 8,
    },
    serviceTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    multiTag: {
        backgroundColor: '#ff3333',
    },
    upsideTag: {
        backgroundColor: '#ffaa00',
    },
    bluechipTag: {
        backgroundColor: '#ff3333',
    },
    serviceTagText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    serviceDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailColumn: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: COLORS.lightGray,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
    buyButton: {
        backgroundColor: COLORS.secondaryColor,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    buyButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
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
        textAlign: "center"
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.cardColor,
        borderRadius: 10,
        margin: 16,
        overflow: "hidden",
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        backgroundColor: "transparent",
    },
    activeTab: {
        backgroundColor: COLORS.secondaryColor,
    },
    tabText: {
        color: "#aaa",
        fontSize: 15,
        fontWeight: "600",
    },
    activeTabText: {
        color: "#fff",
    },
    card: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: COLORS.cardColor,
        marginBottom: 20,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.secondaryColor,
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
});

export default PremiumResearch;
