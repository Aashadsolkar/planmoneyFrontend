import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { getFastlaneData } from '../utils/apiCaller';
import { useAuth } from '../auth/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import Header from '../components/Header';

const FastLane = () => {
    const { token } = useAuth();
    const [isLoading, setIsloadin] = useState(false);
    const [fastlaneData, setFastlaneData] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const callFastlaneApi = async () => {
            try {
                const response = await getFastlaneData(token);
                setFastlaneData(response?.data?.services)

            } catch (error) {
                console.log(error);
            }
        }
        callFastlaneApi()
    }, [])

    const renderCardList = (data) => {
        return fastlaneData?.map((data) => {
            return (
                <View style={styles.card} key={data?.id}>
                    <View style={styles.cardSections}>
                        <View style={{ flexDirection: "row", gap: 3 }}>
                            <View style={{marginRight: 10}}>
                                <Image
                                    source={{ uri: data?.stock?.company_logo }}
                                    style={{ width: 30, height: 30, borderRadius: 50 }}
                                />
                            </View>
                            <View>
                                <Text style={[styles.boldText, { fontSize: 12 }]}>{data?.stock?.name}</Text>
                                <Text style={styles.boldText}><Text style={styles.lightText}>CMP</Text> ₹670.00 </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                            <Text style={styles.lightText}>16 Apr</Text>
                            <Text style={[styles.boldText, { paddingHorizontal: 4, paddingVertical: 2, backgroundColor: "#F2B225", borderRadius: 5, color: COLORS.fontWhite }]} >Med</Text>
                        </View>
                    </View>
                    <View style={styles.cardSections}>
                        <View>
                            <Text style={styles.lightText}>Buy Price</Text>
                            <Text style={styles.boldText}>₹700.00</Text>
                        </View>
                        <View>
                            <Text style={styles.lightText}>Holding Period</Text>
                            <Text style={styles.boldText}>{data?.holding_period} days</Text>
                        </View>
                        <View>
                            <Text style={styles.lightText}>Valid till</Text>
                            <Text style={styles.boldText}>₹700.00</Text>
                        </View>
                        <View>
                            <Text style={styles.lightText}>Upside</Text>
                            <Text style={[styles.boldText, styles.greenText]}>₹700.00</Text>
                        </View>
                    </View>
                    <View style={[styles.cardSections, { borderColor: COLORS.cardColor }]}>
                        <View>
                            <Text style={styles.lightText}>Stop Loss</Text>
                            <Text style={[styles.boldText, styles.redText, styles.font12]}>₹{data?.stop_loss_price}</Text>
                        </View>
                        <View>
                            <Text style={styles.lightText}>Target 1</Text>
                            <Text style={[styles.boldText, styles.greenText, styles.font12]}>₹700.00</Text>
                        </View>
                        <View>
                            <Text style={styles.lightText}>Target 2</Text>
                            <Text style={[styles.boldText, styles.greenText, styles.font12]}>₹700.00</Text>
                        </View>
                        <View style={{ alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 2 }}>
                            <Text style={[styles.lightText, { color: COLORS.secondaryColor }]}>REPORT ANALYSIS</Text>
                            <MaterialIcons onPress={() => navigation.navigate("fastlane")} name="chevron-right" size={18} color={COLORS.secondaryColor} />
                            {/* <Text style={styles.boldText}>₹700.00</Text> */}
                        </View>
                    </View>
                </View>
            )
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor, padding: 20 }}>
            <Header
				title="Hi Vignesh"
				showBackButton={true}
			/>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ marginTop: 70}}
            >
                <Text style={styles.heading}>Stock updates</Text>
                {renderCardList()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 16,
        color: COLORS.fontWhite,
        fontWeight: 600,
        marginBottom: 20
    },
    card: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: COLORS.cardColor,
        marginBottom: 20
    },
    cardSections: {
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primaryColor,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    lightText: {
        fontSize: 10,
        fontWeight: 400,
        color: COLORS.lightGray
    },
    boldText: {
        color: COLORS.fontWhite,
        fontWeight: 700,
        fontSize: 10
    },
    greenText: {
        color: "#4BDE9F"
    },
    redText: {
        color: "#F85255"
    },
    font12: {
        fontSize: 12
    }
})

export default FastLane;
