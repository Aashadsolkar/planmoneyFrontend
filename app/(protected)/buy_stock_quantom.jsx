import { useEffect, useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Dimensions, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Header from "@components/Header"
import { COLORS } from "../constants"
import Button from "@components/Button"
import { useAuth } from '@context/useAuth';
import { BuyPmsStock, BuyQuantomStock } from "@utils/apiCaller"
import { router, useLocalSearchParams } from "expo-router"
import Input from '@components/Input';
import * as Animatable from "react-native-animatable"
import { CheckCircle } from "lucide-react-native"
import { showToast } from "@components/CustomToast/ToastService";

const { height } = Dimensions.get("window")

export default function BuyStock() {
    const { stockId, serviceID, type, price, name } = useLocalSearchParams();
    const { token, logout } = useAuth();
    const [successfullModal, setSuccessfullModal] = useState(false);
    const [qty, setQty] = useState("");
    const [buyPriceError, setBuyPriceError] = useState("");
    const [buyPirce, setBuyPrice] = useState(price || 0);
    const [qtyError, setQtyError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const parsedPrice = parseFloat(buyPirce) || 0;
    const parsedQty = parseInt(qty) || 0;
    const totalBuyValue = parsedPrice * parsedQty;

    const buyPmsTock = async () => {
        // if (!qty || isNaN(qty) || parseInt(qty) <= 0) {
        //     setQtyError("Please enter a valid quantity.");
        //     return;
        // }

        // Validate Buy Price
        let hasError = false;
        if (!buyPirce || isNaN(buyPirce) || parseFloat(buyPirce) <= 0) {
            setBuyPriceError("Please enter a valid buy price.");
            hasError = true;
        } else {
            setBuyPriceError("");
        }

        // Validate Quantity
        if (!qty || isNaN(qty) || parseFloat(qty) <= 0) {
            setQtyError("Please enter a valid quantity.");
            hasError = true;
        } else {
            setQtyError("");
        }

        if (hasError) return;

        setQtyError(""); // clear error if valid
        setIsLoading(true)
        try {
            const payload = {
                price: buyPirce,
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
            showToast({
                type: "error",
                title: `Something went wrong! 😥`,
                message: `${error?.error || error?.message || "Buy Stock Api Failed"}`,
                // redirectPath: "home",
                sessionExired: error?.error == "Another session is active." ? true : false,
                logout: logout
            });
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header title="Hi Vignesh" showBackButton={true} />
            <ScrollView style={{ backgroundColor: COLORS.primaryColor }}>
                <View>
                    <View style={styles.stockInfoRow}>
                        <Text style={styles.stockTitle}>{name}</Text>
                    </View>
                    <View style={[styles.stockInfoRow, {paddingTop: 0, justifyContent: "flex-end"}]}>
                        <Text style={styles.stockPrice}><Text style={styles.cmp}>Buy Price  </Text>₹{price}</Text>
                    </View>
                    <View style={styles.inputRow}>
                        <View style={{ width: "50%" }}>
                            <Input
                                label={"Buy Price ₹"}
                                value={String(buyPirce)}
                                onChangeText={(val) => {
                                    setBuyPrice(val)
                                    setBuyPriceError("")
                                }}
                                keyboardType="numeric"
                                error={!!buyPriceError}
                                errorMessage={buyPriceError}
                                isNumberOnly={true}
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
            <View style={{ backgroundColor: COLORS.primaryColor, paddingBottom: 50 }}>
                <Button isLoading={isLoading} onClick={buyPmsTock} label={`Buy Now`} gradientColor={['#119320', '#04B719']} buttonStye={{ marginHorizontal: 20 }} />
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
        paddingHorizontal: 20,
        paddingTop: 20
    },
    stockTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: COLORS.fontWhite,
        width: "80%"
    },
    stockPrice: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.fontWhite,
        // width: "20%"
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
