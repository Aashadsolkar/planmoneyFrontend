
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, BackHandler } from "react-native"
import { COLORS } from "../constants";
import Button from "../components/Button";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";

export default function App() {
    const navigation = useNavigation();

    // 🚫 Prevent back button and swipe gestures
        useEffect(() => {
          const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault(); // Block back navigation
          });
      
          const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true); // Block Android hardware back
      
          return () => {
            unsubscribe();
            backHandler.remove();
          };
        }, [navigation]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor, padding: 20 }}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 20, marginTop: 10 }}
            >
                <View style={{ alignItems: 'center', width: "100%", marginTop: 150 }}>
                    <Image
                        source={require('../../assets/images/rightCircle.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={{ fontSize: 25, fontWeight: 600, color: COLORS.fontWhite, paddingVertical: 20, textAlign: "center", width: 220 }}>Your Profile is Under Verification</Text>
                    <Text style={{ fontSize: 14, fontWeight: 400, color: COLORS.fontWhite, paddingVertical: 20, textAlign: "center", width: 250 }}>Please wait until our Advisor Approves your Profile</Text>
                </View>
            </ScrollView>
            <Button onClick={() => router.push("home")} label={"Done"} gradientColor={['#D36C32', '#F68F00']} buttonStye={{ marginHorizontal: 20 }} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryColor, // Dark blue background
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    headerText: {
        color: "white",
        fontSize: 18,
        marginBottom: 20,
        fontWeight: "500",
    },
    circleContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 30,
    },
    outerCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    innerCircle: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
    scoreText: {
        fontSize: 48,
        fontWeight: "bold",
    },
    pointsText: {
        color: "white",
        fontSize: 16,
        marginTop: -5,
    },
    riskText: {
        color: "white",
        fontSize: 18,
        marginTop: 20,
        fontWeight: "500",
    },
    riskLevel: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 5,
    },
})
