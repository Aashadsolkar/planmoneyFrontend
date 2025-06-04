import { useEffect, useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Dimensions, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Header from "../components/Header"
import { COLORS } from "../constants"
import Button from "../components/Button"
import { useAuth } from '../context/useAuth';
import { BuyPmsStock, BuyQuantomStock } from "../utils/apiCaller"
import { router, useLocalSearchParams } from "expo-router"
import Input from '../components/Input';
import * as Animatable from "react-native-animatable"
import { CheckCircle } from "lucide-react-native"
import { Alert } from "react-native"

const { height } = Dimensions.get("window")

export default function BuyStock() {
    const { stockId, serviceID, type, price } = useLocalSearchParams();
    const { token } = useAuth();
    const [successfullModal, setSuccessfullModal] = useState(false);
    const [qty, setQty] = useState("");
    const [qtyError, setQtyError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const parsedPrice = parseFloat(price) || 0;
    const parsedQty = parseInt(qty) || 0;
    const totalBuyValue = parsedPrice * parsedQty;

    const buyPmsTock = async () => {
        if (!qty || isNaN(qty) || parseInt(qty) <= 0) {
            setQtyError("Please enter a valid quantity.");
            return;
        }

        setQtyError(""); // clear error if valid
        setIsLoading(true)
        try {
            const payload = {
                price,
                qty,
                service_id: serviceID,
                type,
                stock_id: stockId
            };
            const response = await BuyQuantomStock(token, payload);
            setSuccessfullModal(true);
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            Alert.alert(
                "Error",
                error?.message || "Buy Stock Api Failed",
                [
                    {
                        text: "OK",
                        onPress: () => router.push("home"),
                    },
                ]
            );
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header title="Hi Vignesh" showBackButton={true} />
            <ScrollView style={{backgroundColor: COLORS.primaryColor }}>
                <View>
                    <View style={styles.stockInfoRow}>
                        <Text style={styles.stockTitle}>State of India</Text>
                        <Text style={styles.stockPrice}><Text style={styles.cmp}>CMP  </Text>₹{price}</Text>
                    </View>
                    <View style={styles.inputRow}>
                        <View style={{ width: "50%" }}>
                            <Input
                                label={"Buy Price ₹"}
                                value={String(price)}
                                editable={false}
                            />
                        </View>
                        <View style={{ width: "50%" }}>
                            <Input
                                label={"QTY"}
                                value={qty}
                                onChangeText={(val) => {
                                    setQty(val)
                                    setQtyError("")
                                }}
                                keyboardType="numeric"
                                error={!!qtyError}
                                errorMessage={qtyError}
                                isNumberOnly={true}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.totalValueRow}>
                <Text style={styles.totalLabel}>Total Buy Value</Text>
                <Text style={styles.totalValue}>₹{totalBuyValue.toFixed(2)}</Text>
            </View>
            <View style={{backgroundColor: COLORS.primaryColor,paddingBottom: 20}}>
            <Button isLoading={isLoading} onClick={buyPmsTock} label={`Buy Now`} gradientColor={['#119320', '#04B719']} buttonStye={{marginHorizontal: 20}} />
            </View>

            {/* Success Modal */}
            <Modal visible={successfullModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={[styles.modalHeader, { justifyContent: "flex-end" }]}>
                            <TouchableOpacity onPress={() => setSuccessfullModal(false)}>
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingBottom: 30 }}>
                            <Animatable.View animation="bounceIn">
                                <View style={{ alignItems: "center", marginBottom: 10 }}>
                                    <CheckCircle color="#D87129" size={60} />
                                    <Text style={styles.successText}>Successfull</Text>
                                    <Text style={styles.successMessage}>Stock added to your portfolio successfully.</Text>
                                </View>
                                <Button isLoading={false} buttonStye={{ marginHorizontal: 20 }} onClick={() => {
                                    setSuccessfullModal(false)
                                    router.push({
                                        pathname: "/portfolio",
                                        params: {
                                            serviceID: 4
                                        },
                                    })
                                }} label={"Go To Portfolio"} gradientColor={['#D36C32', '#F68F00']} />
                            </Animatable.View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cardColor,
    },
    stockInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
    },
    stockTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: COLORS.fontWhite,
    },
    stockPrice: {
        fontSize: 20,
        fontWeight: "600",
        color: COLORS.fontWhite,
    },
    cmp: {
        fontSize: 12,
    },
    inputRow: {
        flexDirection: "row",
        gap: 10,
        marginHorizontal: 20,
    },
    totalValueRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        paddingBottom: 10,
        backgroundColor: COLORS.primaryColor
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: "400",
        color: COLORS.fontWhite,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.secondaryColor,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: COLORS.cardColor,
        borderRadius: 20,
        paddingBottom: 20,
        width: "90%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    successText: {
        color: COLORS.fontWhite,
        fontSize: 25,
        textTransform: "uppercase",
        marginTop: 10,
        fontWeight: "600",
    },
    successMessage: {
        color: COLORS.fontWhite,
        fontSize: 14,
        marginTop: 5,
    },
})
