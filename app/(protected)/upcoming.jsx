import { StyleSheet, Text, View,  SafeAreaView, StatusBar } from "react-native"
import Header from "../components/Header"
import { COLORS } from "../constants"

export default function Upcomping() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header showBackButton={true} />
            <View style={{flex: 1, backgroundColor: COLORS.primaryColor, justifyContent: "center", alignItems: "center"}}>
                <Text style={{color: COLORS.fontWhite, fontWeight: 600, fontSize: 20}}>Comming soon...</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cardColor,
    },
})
