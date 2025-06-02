import { useEffect, useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Dimensions, Modal, FlatList, Alert } from "react-native"
import Header from "../../components/Header"
import { COLORS } from "../../constants"
import { singleNews } from "../../utils/apiCaller"
import { useAuth } from "../../context/useAuth"
import { useLocalSearchParams } from "expo-router"
import SkeletonList from '../../components/ListSkeleton';

export default function SingleNew() {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [newsData, setNewsData] = useState([]);
    const { id } = useLocalSearchParams();

    useEffect(() => {
        const getNew = async () => {
            try {
                const response = await singleNews(token, id);
                setIsLoading(false)
                setNewsData(response?.data?.latest_news[0]);
            } catch (error) {
                setIsLoading(false);
                Alert.alert(
                    "Error",
                    error?.message || "Failed to get new",
                    [
                        {
                            text: "OK",
                            onPress: () => router.push("home"),
                        },
                    ]
                );

            }
        }
        getNew()
    }, [])

    
    const renderNews = () => {
        if (isLoading) {
            return [1, 2, 3, 4, 5].map((item) => <SkeletonList height={20} key={item} />)
        }
        return (
            <>
            <Text style={{ fontSize: 18, fontWeight: 600, color: COLORS.fontWhite }}>
                    {newsData?.title}
                </Text>
                <Text style={{ fontSize: 15, fontWeight: 400, marginTop: 20, color: COLORS.fontWhite }}>
                    {newsData?.description}
                </Text>
            </>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header showBackButton={true} />
            <View style={{ flex: 1, backgroundColor: COLORS.primaryColor, paddingHorizontal: 20, paddingTop: 20 }}>
                {renderNews()}
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cardColor,
        // paddingHorizontal: 16,
    },
});

