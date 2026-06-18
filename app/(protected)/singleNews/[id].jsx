import { useEffect, useState } from "react"
import { StyleSheet, Text, View, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@components/Header"
import { COLORS } from "../../../constants.js";
import { singleNews } from "@utils/apiCaller"
import { useAuth } from "@context/useAuth"
import { Link, useLocalSearchParams } from "expo-router"
import SkeletonList from '@components/ListSkeleton';
import { showToast } from "@components/CustomToast/ToastService";

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
                showToast({
                    type: "error",
                    title: `Something went wrong! 😥`,
                    message: `${error?.message || "Failed to get new"}`,
                    redirectPath: "home",
                });

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

                {newsData?.link && <Link href={newsData?.link || ""} style={{ marginTop: 10, color: "#1e90ff" }}>
                    {newsData?.link}
                </Link>}
                <Text style={{ fontSize: 15, fontWeight: 400, marginTop: 20, color: COLORS.fontWhite }}>
                    {newsData?.description}
                </Text>
            </>
        )
    }

    return (
        <SafeAreaView edges={[]} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header showBackButton={true} />
            <ScrollView>
                <View style={{ flex: 1, backgroundColor: COLORS.primaryColor, paddingHorizontal: 20, paddingTop: 20 }}>
                    <View style={{ marginBottom: 30 }}>
                        {renderNews()}
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
});

