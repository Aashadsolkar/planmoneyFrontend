import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    StatusBar,
    Alert
} from 'react-native';
import {
    Ionicons,
    MaterialCommunityIcons,
    FontAwesome5,
    AntDesign,
    FontAwesome6
} from '@expo/vector-icons';
import Header from '../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants';
import { useAuth } from '../context/useAuth';
import { getProfileData, news } from '../utils/apiCaller';
import { router, useNavigation } from 'expo-router';
import Button from '../components/Button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FullScreenLoader from '../components/FullScreenLoader';
import SkeletonList from '../components/ListSkeleton';
import Foundation from '@expo/vector-icons/Foundation'
import { BackHandler } from 'react-native';
import * as Animatable from 'react-native-animatable';



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
        <Ionicons name="chevron-forward" size={25} color="#f5a623" style={{ width: "10%" }} />
    </TouchableOpacity>
);

export default function Home() {
    const { purchesService,
        allServices,
        setServiceSelectedOnHomePage,
        isCustomerApiLoading,
        getCustomerServiceAPi,
        setProfileData,
        token,
        portfolioServices
    } = useAuth();
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [isNewApiLoading, setIsNewApiLoading] = useState(true);
    const navigation = useNavigation();
    const [newsData, setNewsData] = useState([]);


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

    useEffect(() => {
        getCustomerServiceAPi();
        const callProfileApi = async () => {
            try {
                const response = await getProfileData(token);
                setProfileData(response?.data?.data);

            } catch (error) {
                Alert.alert(
                    "Error",
                    error?.message || "Failed to get profile data",
                    [
                        {
                            text: "OK",
                            onPress: () => router.push("home"),
                        },
                    ]
                );
            }
        }
        if (token) {
            callProfileApi()
        }
    }, [])


    useEffect(() => {
        const getNew = async () => {
            try {
                const response = await news(token);
                setIsNewApiLoading(false)
                setNewsData(response?.data?.latest_news);

            } catch (error) {
                setIsNewApiLoading(false);
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

    // Offer carousel data
    const initialOfferData = [
        {
            id: '1',
            title: 'PORTFOLIO MANAGEMENT SYSTEM',
            serviceId: 3,
            subtitle: 'Organize your Investment',
            buttonText: 'Get this Service',
            color: [COLORS.secondaryColor, COLORS.secondaryColor],
            onClick: () => {
                setServiceSelectedOnHomePage(3)
                router.push("service");
            }
        },
        {
            id: '2',
            title: 'QuantumVault (For Above ₹50 lakh Capital)',
            serviceId: 4,
            subtitle: 'Expert Stock Picks',
            buttonText: 'Subscribe Now',
            color: [COLORS.secondaryColor, COLORS.secondaryColor],
            onClick: () => {
                setServiceSelectedOnHomePage(4)
                router.push("service");
            }
        },
    ];

    const [offerData, setOfferData] = useState(initialOfferData);
    useEffect(() => {


        // Create a set of purchased service IDs
        const purchasedServiceIds = new Set(portfolioServices.map(service => service.id));

        // Filter offer data
        const filteredOffers = initialOfferData.filter(
            offer => !offer.serviceId || !purchasedServiceIds.has(offer.serviceId)
        );

        setOfferData(filteredOffers);
    }, [portfolioServices]);


    const handleClick = (item) => {

        if ([1].includes(item?.id)) {
            router.push(`fastlane/${item?.id}`)
        } else {
            // router.push(`pmsAndQuantom/${id}`)
            router.push({
                pathname: `/pmsAndQuantom/${item?.id}`,
                params: {
                    is_advisor_assign: item?.subscription?.is_advisor_assign,
                    advisor_name: item?.subscription?.advisor?.name,
                    advisor_nummber: item?.subscription?.advisor?.phone,
                },
            });

        }
    }

    const handleServiceClick = (item) => {
        setServiceSelectedOnHomePage(item.id);
        navigation.navigate('service');
    };


    // Render services carousel item
    const renderServiceItem = ({ item }) => {

        const is__not_subscribed = !item.is_subscribed;

        return (
            <Animatable.View
                key={item.id}
                animation="fadeInRight"
                delay={item.id * 100}
                duration={300}
            >
                <LinearGradient
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    colors={is__not_subscribed ? [COLORS.cardColor, COLORS.cardColor] : ['#AF125D', '#D36C32']}
                    // style={}
                    style={[styles.serviceCard]}
                >
                    <Text style={styles.serviceTitle}>{item?.name}</Text>
                    <View style={styles.serviceInfoRow}>
                    </View>
                    <View style={styles.serviceFooter}>
                        {
                            is__not_subscribed ? <>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                    <View style={{ justifyContent: "center", paddingEnd: 20 }}>
                                        <Text style={{ fontSize: 10, color: COLORS.fontWhite }}>Start from</Text>
                                        <Text style={{ fontSize: 12, color: COLORS.fontWhite }}>₹{item.plans?.[0]?.offer_price}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Button onClick={() => handleServiceClick(item)}
                                            label={"subscribe now"}
                                            gradientColor={['#D36C32', '#F68F00']}
                                            buttonStye={{ padding: 10 }}

                                        />
                                    </View>
                                </View>
                            </> : <>
                                <View>
                                    <Text style={styles.updateText}>Expire On</Text>
                                    <Text style={styles.dateText}>{item?.subscription?.end_at}</Text>
                                </View>
                                <MaterialIcons onPress={() => handleClick(item)} name="chevron-right" size={40} color="#fff" />
                            </>
                        }
                    </View>
                </LinearGradient>
            </Animatable.View>
        )
    };

    // Toggle accordion
    const toggleAccordion = (id) => {
        setActiveAccordion(activeAccordion === id ? null : id);
    };

    const renderServices = () => {
        const renderData = purchesService.length > 0 ? purchesService : allServices
        return (
            <FlatList
                data={renderData}
                renderItem={renderServiceItem}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.servicesListContainer}
            />
        )
    }

    const renderNews = () => {
        if (isNewApiLoading) {
            return <>
                <SkeletonList />
                <SkeletonList />
                <SkeletonList />
                <SkeletonList />
            </>
        }
        return (
            newsData.map((item) => {
                return (
                    <NewsCard title={item?.title}
                        summary={item?.summary}
                        id={item?.id}
                        key={item?.id}
                    />
                )
            })
        )
    }

    if (isCustomerApiLoading) {
        return <FullScreenLoader />
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header showBackButton={false} />
            <ScrollView style={styles.scrollView}>
                {/* Offer Carousel Section */}
                <View style={styles.carouselContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={{ paddingHorizontal: 10 }}
                    >
                        {offerData.map((item, index) => (
                            <Animatable.View
                                key={item.id}
                                animation="fadeInRight"
                                delay={index * 100}
                                duration={300}
                            >
                                <LinearGradient
                                    key={item.id}
                                    colors={item.color}
                                    style={styles.offerCard}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <TouchableOpacity style={styles.closeButton}>
                                        <Ionicons name="close" size={20} color="white" />
                                    </TouchableOpacity>
                                    <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
                                    <Text style={styles.offerTitle}>{item.title}</Text>
                                    <TouchableOpacity style={styles.offerButton} onPress={() => item.onClick()}>
                                        <Text style={styles.offerButtonText}>{item.buttonText}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </Animatable.View>
                        ))}
                    </ScrollView>
                </View>


                {/* Services Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>{purchesService.length > 0 ? "Your Services" : "Buy Service"}</Text>
                    {renderServices()}
                </View>

                {/* Quick Links Section */}
                <View style={styles.linksContainer}>
                    <Animatable.View animation="zoomIn" delay={100} duration={100} style={styles.linkItem}>
                        <TouchableOpacity style={styles.linkItem} onPress={() => router.push("portfolio")}>
                            <View style={styles.linkIconContainer}>
                                <FontAwesome6 size={35} name="chart-pie" color={COLORS.secondaryColor} />
                            </View>
                            <Text style={styles.linkText}>Portfolio</Text>
                        </TouchableOpacity>
                    </Animatable.View>

                    {/* <TouchableOpacity style={styles.linkItem} onPress={() => router.push("upcoming")}>
                        <View style={styles.linkIconContainer}>
                            <MaterialCommunityIcons name="wallet-outline" size={35} color="#FFA500" />
                        </View>
                        <Text style={styles.linkText}>Wallet</Text>
                    </TouchableOpacity> */}
                    <Animatable.View animation="zoomIn" delay={200} duration={200} style={styles.linkItem}>
                        <TouchableOpacity onPress={() => router.push("sip")} style={styles.linkItem}>
                            <View style={styles.linkIconContainer}>
                                <Ionicons name="calculator" size={40} color="#FFA500" />
                            </View>
                            <Text style={styles.linkText}>SIP Calculator</Text>
                        </TouchableOpacity>
                    </Animatable.View>

                    <Animatable.View animation="zoomIn" delay={300} duration={200} style={styles.linkItem}>
                        <TouchableOpacity style={styles.linkItem} onPress={() => router.push("upcoming")}>
                            <View style={styles.linkIconContainer}>
                                {/* <AntDesign name="trademark" size={35} color="#FFA500" /> */}
                                <Foundation name="burst-new" size={50} style={{ transform: [{ rotate: "30deg" }] }} color="#FFA500" />
                            </View>
                            <Text style={styles.linkText}>New Arrivals</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>

                {/* Latest News Section */}
                <View style={styles.newsContainer}>
                    <View style={styles.newsHeader}>
                        <Text style={styles.newsTitle}>Latest News</Text>
                        <TouchableOpacity style={styles.viewMoreButton} onPress={() => router.push("news")}>
                            <Text style={styles.viewMoreText}>View More</Text>
                            <AntDesign name="right" size={14} color="#FFA500" />
                        </TouchableOpacity>
                    </View>

                    {/* News Accordion */}
                    {renderNews()}
                </View>
            </ScrollView>
            {/* <Tabs /> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cardColor,
    },
    scrollView: {
        flex: 1,
        backgroundColor: COLORS.primaryColor
    },
    carouselContainer: {
        marginVertical: 10
    },
    offerCard: {
        height: 177,
        width: 335,
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 10,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    offerSubtitle: {
        color: 'white',
        fontSize: 14,
        marginBottom: 5,
    },
    offerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    offerButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    offerButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    sectionContainer: {
        // marginTop: 10,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    servicesListContainer: {
        paddingRight: 20,
    },
    serviceCard: {
        width: 250,
        height: 150,
        borderRadius: 10,
        padding: 15,
        marginRight: 15,
    },
    serviceTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    serviceInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    updateContainer: {
        borderRadius: 12,
        marginRight: 8,
    },
    updateText: {
        color: "#ccc",
        fontSize: 16,
    },
    dateText: {
        marginTop: 3,
        color: 'white',
        fontSize: 18,
    },
    serviceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: "auto"
    },
    updateDateText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 500
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        marginTop: 30,
        marginBottom: 20,
    },
    linkItem: {
        alignItems: 'center',
    },
    linkIconContainer: {
        width: 80,
        height: 70,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    linkText: {
        color: 'white',
        fontSize: 12,
    },
    newsContainer: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    newsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    newsTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewMoreText: {
        color: '#FFA500',
        fontSize: 14,
        marginRight: 5,
    },
    accordionItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    accordionTitle: {
        color: 'white',
        fontSize: 14,
        flex: 1,
        paddingRight: 10,
    },
    accordionIcon: {
        transform: [{ rotate: '0deg' }],
    },
    accordionIconActive: {
        transform: [{ rotate: '90deg' }],
    },
    accordionContent: {
        padding: 15,
        paddingTop: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    accordionContentText: {
        color: '#CCC',
        fontSize: 14,
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