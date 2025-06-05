import { StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity, ScrollView } from "react-native"
import Header from "../components/Header"
import { COLORS } from "../constants"
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";

export default function Support() {

    const handleCall = () => {
        Linking.openURL('tel:+91 8108181602'); // Replace with your number
    };

    const handleEmail = () => {
        Linking.openURL('mailto:service@planmoney.in'); // Replace with your support email
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header showBackButton={true} />
           <ScrollView style={{backgroundColor: COLORS.primaryColor, padding: 20}}>
             <Text style={styles.title}>Support</Text>

            <View style={styles.card}>
                <Ionicons name="call" size={24} color={COLORS.secondaryColor} />
                <View style={styles.info}>
                    <Text style={styles.label}>Call us</Text>
                    <TouchableOpacity onPress={handleCall}>
                        <Text style={styles.link}>+91 98765 43210</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.card}>
                <Ionicons name="mail" size={24} color={COLORS.secondaryColor} />
                <View style={styles.info}>
                    <Text style={styles.label}>Email us</Text>
                    <TouchableOpacity onPress={handleEmail}>
                        <Text style={styles.link}>support@planmoney.in</Text>
                    </TouchableOpacity>
                </View>
            </View>
           </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cardColor,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.fontWhite,
        marginBottom: 30,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.cardColor,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    info: {
        marginLeft: 16,
    },
    label: {
        fontSize: 16,
        color: COLORS.fontWhite,
    },
    link: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.fontWhite,
        marginTop: 4,
    },
})
