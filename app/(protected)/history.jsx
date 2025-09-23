import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getFastlaneHistoryData } from "@utils/apiCaller";
import { useAuth } from "@context/useAuth";
import { showToast } from "@components/CustomToast/ToastService";
import { COLORS } from "../constants";
import Header from "@components/Header";
import { router } from "expo-router";
import HistoryCardList from "@components/HistoryCardList";


const services = [
    { id: 1, title: "FastLane", serviceID: "1" },
    { id: 2, title: "PIS", serviceID: "2" },
    { id: 3, title: "PSS", serviceID: "3" },
    { id: 4, title: "QuantumVault", serviceID: "4" },
    // { id: 5, title: "Premium Research", serviceID: "6" },
];

export default function App() {
    const { token, logout, setReportData } = useAuth();
    const [activeTab, setActiveTab] = useState(services[0]); // default Service 1
    const [historyData, setHistoryData] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);


    const callFastlaneHistoryApi = async (serviceID) => {
        try {
            setIsHistoryLoading(true);
            const response = await getFastlaneHistoryData(token, serviceID);
            const data = response?.data?.services || [];
            const sortedData = data.sort(
                (a, b) => new Date(b.exit_date) - new Date(a.exit_date)
            );
            setHistoryData(sortedData || []);
        } catch (error) {
            showToast({
                type: "error",
                title: `Something went wrong! 😥`,
                message: `${error?.error || error?.message || "Failed to get service history data"
                    }`,
                sessionExired: error?.error == "Another session is active.",
                logout: logout,
            });
        } finally {
            setIsHistoryLoading(false);
        }
    };

    useEffect(() => {
        callFastlaneHistoryApi(activeTab.serviceID);
    }, [activeTab]);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={COLORS.cardColor}
            />
            <Header showBackButton={true} />

            <View style={styles.innerContainer}>
                {/* Title */}
                <Text style={styles.label}>Recommendation History</Text>

                {/* Tabs Slider */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabContainer}
                    contentContainerStyle={{ alignItems: "center" }}
                >
                    {services.map((service) => (
                        <TouchableOpacity
                            key={service.id}
                            style={[
                                styles.tab,
                                activeTab.id === service.id && styles.activeTab,
                            ]}
                            onPress={() => setActiveTab(service)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab.id === service.id && styles.activeTabText,
                                ]}
                            >
                                {service.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Data Area */}
                <View style={styles.content}>
                    {isHistoryLoading ? (
                        <ActivityIndicator size="large" color={COLORS.secondaryColor} />
                    ) :
                        <HistoryCardList
                            dataList={historyData}
                            status="inActive"
                            setReportData={setReportData}
                            router={router}
                            serviceID={activeTab.serviceID}
                        />
                    }
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: COLORS.primaryColor, flex: 1 },
    innerContainer: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },

    // ✅ Fixed: Tabs only take their content height
    tabContainer: {
        flexGrow: 0,
        marginBottom: 15,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: "#eee",
    },
    activeTab: {
        backgroundColor: COLORS.secondaryColor,
    },
    tabText: {
        fontSize: 14,
        color: "black",
        fontWeight: "600"
    },
    activeTabText: {
        color: "white",
        fontWeight: "600",
    },
    content: { flex: 1 },
    label: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
        color: "white",
    },
    card: {
        backgroundColor: COLORS.cardColor || "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
    cardDate: {
        fontSize: 12,
        color: "#666",
        marginTop: 5,
    },
    noData: {
        textAlign: "center",
        marginTop: 30,
        color: "#ccc",
        fontSize: 16,
    },

});
