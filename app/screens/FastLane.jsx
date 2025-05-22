import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { getFastlaneData } from '../utils/apiCaller';
import { useAuth } from '../auth/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import Header from '../components/Header';
import Button from '../components/Button';

const FastLane = () => {
    const { token, customerServiceData, setReportData } = useAuth();
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
        if (customerServiceData?.questionnaire_status == 1 && customerServiceData?.verification_status == 0) {
            callFastlaneApi()
        }
    }, [])

    const renderCardList = (data) => {
        return fastlaneData?.map((data) => {
            const dateStr = data?.created_at;
            const date = new Date(dateStr);

            const options = { day: '2-digit', month: 'short' }; // e.g., "22 May"
            const formattedDate = date.toLocaleDateString('en-GB', options);
            return (
                <View style={styles.card} key={data?.id}>
                    <View style={styles.cardSections}>
                        <View style={{ flexDirection: "row", gap: 3 }}>
                            <View style={{ marginRight: 10 }}>
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
                            <Text style={styles.lightText}>{formattedDate}</Text>
                            <Text style={[styles.boldText, { paddingHorizontal: 4, paddingVertical: 2, backgroundColor: "#F2B225", borderRadius: 5, color: COLORS.fontWhite }]} >Med</Text>
                        </View>
                    </View>
                    <View style={styles.cardSections}>
                        <View>
                            <Text style={styles.lightText}>Buy Price</Text>
                            <Text style={styles.boldText}>₹{data?.buy_price}</Text>
                        </View>
                        <View>
                            <Text style={styles.lightText}>Holding Period</Text>
                            <Text style={styles.boldText}>{data?.holding_period} days</Text>
                        </View>
                        <View>
                            <Text style={styles.lightText}>Valid till</Text>
                            <Text style={styles.boldText}>{data?.valid_till}</Text>
                        </View>
                        <View>
                            <Text style={styles.lightText}>Upside</Text>
                            <Text style={[styles.boldText, styles.greenText]}>{data?.upside}%</Text>
                        </View>
                    </View>
                    <View style={[styles.cardSections, { borderBottomColor: COLORS.cardColor }]}>
                        <View>
                            <Text style={styles.lightText}>Stop Loss</Text>
                            <Text style={[styles.boldText, styles.redText, styles.font12]}>₹{data?.stop_loss_price}</Text>
                        </View>
                        <View>
                            <Text style={styles.lightText}>Target 1</Text>
                            <Text style={[styles.boldText, styles.greenText, styles.font12]}>₹{data?.target_1}</Text>
                        </View>
                        <View>
                            <Text style={styles.lightText}>Target 2</Text>
                            <Text style={[styles.boldText, styles.greenText, styles.font12]}>₹{data?.target_2}</Text>
                        </View>
                        <View style={{ alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 2 }}>
                            <Text onPress={() => {
                                setReportData(data);
                                navigation.navigate("fastlaneReport")

                            }} style={[styles.lightText, { color: COLORS.secondaryColor }]}>REPORT ANALYSIS</Text>
                            <MaterialIcons onPress={() => {
                                setReportData(data);
                                navigation.navigate("fastlaneReport")

                            }} name="chevron-right" size={18} color={COLORS.secondaryColor} />
                            {/* <Text style={styles.boldText}>₹700.00</Text> */}
                        </View>
                    </View>
                </View>
            )
        });
    };


    if (customerServiceData?.questionnaire_status == 0) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor, padding: 20 }}>
                <Header
                    title="Hi Vignesh"
                    showBackButton={true}
                />
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    style={{ paddingHorizontal: 20, marginTop: 80 }}
                >
                    {/* <Text style={styles.heading}>Stock updates</Text> */}
                    {/* {renderCardList()} */}
                    <View style={{ alignItems: 'center', width: "100%", marginTop: 100 }}>
                        <Image
                            source={require('../../assets/images/questionCirlce.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={{ fontSize: 25, fontWeight: 600, color: COLORS.fontWhite, paddingVertical: 20 }}>Oops..!</Text>
                        <Text style={{ fontSize: 14, fontWeight: 400, color: COLORS.fontWhite, paddingVertical: 20, textAlign: "center", width: 250 }}>Its look like you have not filled your Details after Subscription</Text>
                    </View>
                    <Button onClick={() => navigation.navigate("form1")} label={"PROCEED"} gradientColor={['#D36C32', '#F68F00']} buttonStye={{ marginHorizontal: 20, }} />
                </ScrollView>
            </SafeAreaView>
        )
    }

    if (customerServiceData?.verification_status == 1) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor, padding: 20 }}>
                <Header
                    title="Hi Vignesh"
                    showBackButton={true}
                />
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    style={{ paddingHorizontal: 20, marginTop: 80 }}
                >
                    {/* <Text style={styles.heading}>Stock updates</Text> */}
                    {/* {renderCardList()} */}
                    <View style={{ alignItems: 'center', width: "100%", marginTop: 100 }}>
                        <Image
                            source={require('../../assets/images/rightCircle.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={{ fontSize: 25, fontWeight: 600, color: COLORS.fontWhite, paddingVertical: 20, textAlign: "center", width: 220 }}>Your Profile is Under Verification</Text>
                        <Text style={{ fontSize: 14, fontWeight: 400, color: COLORS.fontWhite, paddingVertical: 20, textAlign: "center", width: 250 }}>Please wait until our Advisor Approves your Profile</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    const backButtonText =() =>{
        return (
            <Text style={{color: COLORS.fontWhite, fontSize: 18, fontWeight: 600}}>FastLane</Text>
        )
    } 



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor, padding: 20 }}>
            <Header
                title="Hi Vignesh"
                showBackButton={true}
                backButtonText={backButtonText}
            />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 20, marginTop: 80 }}
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
        marginBottom: 10
    },
    card: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: COLORS.cardColor,
        marginBottom: 20
    },
    cardSections: {
        padding: 15,
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
