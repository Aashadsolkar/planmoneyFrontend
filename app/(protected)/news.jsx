import { useEffect, useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"
import Header from "@components/Header"
import { COLORS } from "../constants"
import { news } from "@utils/apiCaller"
import { useAuth } from "@context/useAuth"
import SkeletonList from '@components/ListSkeleton';
import { router } from "expo-router"
import { showToast } from "@components/CustomToast/ToastService";

export default function News() {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        const getNew = async () => {
            try {
                const response = await news(token);
                setIsLoading(false)
                setNewsData(response?.data?.latest_news || []);

            } catch (error) {
                setIsLoading(false);
                showToast({
                    type: "error",
                    title: `Something went wrong! 😥`,
                    message: `${error?.message || "Failed to get news"}`,
                    redirectPath: "home",
                });
            }
        }
        getNew()
    }, [])

    const NewsCard = ({ title = "", summary = "", id }) => (
        <TouchableOpacity style={styles.card} onPress={() => router.push(`singleNews/${id}`)}>
            <View style={{ width: "90%" }}>
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={styles.summary} numberOfLines={2}>
                    {summary}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#f5a623" style={{ width: "10%" }} />
        </TouchableOpacity>
    );

    const renderNews = () => {
        if (isLoading) {
            return [1, 2, 3, 4].map((item) => <SkeletonList height={60} key={item} />)
        }
        if (newsData == null || newsData.length == 0) {
            return (
                <Text style={{ textAlign: "center", fontSize: 18, color: COLORS.fontWhite, marginTop: 10 }}>No News Available.</Text>
            )
        }
        return (
            <FlatList
                data={newsData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NewsCard title={item?.title} summary={item?.summary} id={item?.id} />}
                contentContainerStyle={{ paddingVertical: 20 }}
            />
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header showBackButton={true} />
            <View style={{ flex: 1, backgroundColor: COLORS.primaryColor, paddingHorizontal: 20 }}>
                {renderNews()}
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cardColor,
    },
    card: {
        backgroundColor: '#083b66',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: "row"
    },
    title: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
        marginRight: 8,
        fontWeight: 600
    },
    summary: {
        marginTop: 10,
        color: '#fff',
        fontSize: 14,
        flex: 1,
        marginRight: 8,
    },
});

