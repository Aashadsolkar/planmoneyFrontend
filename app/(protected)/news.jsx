import { useEffect, useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Dimensions, Modal, FlatList, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Header from "../components/Header"
import { COLORS } from "../constants"
import { news } from "../utils/apiCaller"
import { useAuth } from "../context/useAuth"
import SkeletonList from '../components/ListSkeleton';
import { router } from "expo-router"

export default function News() {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        const getNew = async () => {
            try {
                const response = await news(token);
                setIsLoading(false)
                setNewsData(response?.data?.latest_news);

            } catch (error) {
                setIsLoading(false);
                Alert.alert(
                        "Error",
                        error?.message || "Failed to get news",
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

    const NewsCard = ({ title = "", summary = "", id }) => (
        <TouchableOpacity style={styles.card} onPress={() => router.push(`singleNews/${id}`)}>
            <View style={{width: "90%"}}>
                <Text style={styles.title} numberOfLines={1}>
                {title}
            </Text>
            <Text style={styles.summary} numberOfLines={2}>
                {summary}
            </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#f5a623" style={{width: "10%"}} />
        </TouchableOpacity>
    );

    const renderNews = () => {
        if (isLoading) {
            return [1,2,3,4].map((item) => <SkeletonList height={60} key={item}/>)
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

