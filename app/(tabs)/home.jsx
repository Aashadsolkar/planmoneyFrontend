import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    Image,
    Dimensions,
    RefreshControl
} from 'react-native';
import {
    Ionicons,
    AntDesign,
    FontAwesome6
} from '@expo/vector-icons';
import Header from '../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants';
import { useAuth } from '../context/useAuth';
import { router, useNavigation } from 'expo-router';
import Button from '../components/Button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from '@expo/vector-icons/Foundation'
import { BackHandler } from 'react-native';
import * as Animatable from 'react-native-animatable';
import ShimmerSkeleton from '../components/ListSkeleton';
import { useHomeData } from '../hooks/useHomeData';


const { height, width } = Dimensions.get("window");

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
        portfolioServices,
        newsData
    } = useAuth();
    const navigation = useNavigation();
    const {
        isLoading,
        refreshing,
        onRefresh,
    } = useHomeData();

    const [showPullHint, setShowPullHint] = useState(true);
    const [activeServiceIndex, setActiveServiceIndex] = useState(0)
    const [activeIndex, setActiveIndex] = useState(0);
    const screenWidth = Dimensions.get("window").width;

    useEffect(() => {
        const timer = setTimeout(() => setShowPullHint(false), 3000); // Hide after 3 sec
        return () => clearTimeout(timer);
    }, []);


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
            },
            banner: require('../../assets/images/portfolioBanner.png')
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
            },
            banner: require('../../assets/images/qauntomBanner.png')
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

        if ([1, 6].includes(item?.id)) {
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

    const renderServices = () => {
        const renderData = purchesService.length > 0 ? purchesService : allServices;

        const handleServiceScroll = (event) => {
            const scrollX = event.nativeEvent.contentOffset.x;
            const index = Math.round(scrollX / 250); // adjust 180 based on your service card width
            setActiveServiceIndex(index);
        };

        return (
            <>
                <FlatList
                    data={renderData}
                    renderItem={renderServiceItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    onScroll={handleServiceScroll}
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.servicesListContainer}
                />

                {/* Dot Indicators for Services */}
                {
                    renderData?.length > 1 &&
                    <View style={styles.dotContainer}>
                        {renderData.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    { backgroundColor: i === activeServiceIndex ? COLORS.secondaryColor : COLORS.lightGray },
                                ]}
                            />
                        ))}
                    </View>
                }
            </>
        );
    };


    const renderNews = () => {
        return (
            newsData.slice(0, 4).map((item) => {
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

    const handleScroll = (event) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollX / screenWidth);
        setActiveIndex(index);
    };
    const showOffterSliderDots = () => {
        if (offerData.length > 1) {
            return (
                <View style={styles.dotContainer}>
                    {offerData.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                { backgroundColor: i === activeIndex ? COLORS.secondaryColor : COLORS.lightGray },
                            ]}
                        />
                    ))}
                </View>
            )
        }
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={{ padding: 16 }}>
                    <ShimmerSkeleton height={180} />
                    <ShimmerSkeleton height={120} />
                    {/* <ShimmerSkeleton height={50} /> */}
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                        <ShimmerSkeleton height={60} width={60} />
                        <ShimmerSkeleton height={60} width={60} />
                        <ShimmerSkeleton height={60} width={60} />
                        <ShimmerSkeleton height={60} width={60} />
                    </View>
                    <View>
                        <ShimmerSkeleton height={80} />
                        <ShimmerSkeleton height={80} />
                        <ShimmerSkeleton height={80} />
                    </View>
                </View>

            )
        }
        return (
            <>
                {/* Offer Carousel Section */}
                <View style={styles.carouselContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        style={{ paddingHorizontal: 10 }}
                    >
                        {offerData.map((item, index) => (
                            <Animatable.View
                                key={item.id}
                                animation="fadeInRight"
                                delay={index * 100}
                                duration={300}
                            >
                                <TouchableOpacity onPress={() => item.onClick()}>
                                    <Image
                                        style={styles.offerCard}
                                        source={item.banner}
                                        resizeMode="stretch"
                                    />
                                </TouchableOpacity>
                            </Animatable.View>
                        ))}
                    </ScrollView>

                    {/* Dot Indicators */}
                    {showOffterSliderDots()}
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

                    {/* MF option  */}
                    <Animatable.View animation="zoomIn" delay={300} duration={200} style={styles.linkItem}>
                        <TouchableOpacity style={styles.linkItem} onPress={() => router.push("upcoming")}>
                            <View style={styles.linkIconContainer}>
                                {/* <AntDesign name="trademark" size={35} color="#FFA500" /> */}
                                <MaterialIcons name="savings" size={38} color={COLORS.secondaryColor} />
                            </View>
                            <Text style={styles.linkText}>Mutual Fund</Text>
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
            </>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header showBackButton={false} />
            <ScrollView style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {showPullHint && (
                    <Animatable.View
                        animation="fadeIn"
                        duration={1000}
                        easing="ease-in-out"
                        style={{ alignItems: 'center', paddingVertical: 10 }}
                    >
                        <Animatable.View
                            animation="slideInDown"
                            duration={1000}
                            easing="ease-in-out"
                            iterationCount="infinite"
                            direction="alternate"
                            style={{ transform: [{ translateY: 0 }] }}
                        >
                            <Ionicons name="arrow-down" size={22} color="#ccc" />
                        </Animatable.View>
                        <Text style={{ color: '#ccc', fontSize: 13, marginTop: 5 }}>
                            Pull down to refresh
                        </Text>
                    </Animatable.View>
                )}

                {renderContent()}
            </ScrollView>
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
        marginTop: 20
    },
    offerCard: {
        height: 177,
        width: width - 38,
        marginHorizontal: 10,
        position: 'relative',
        overflow: "hidden"
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    offerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sectionContainer: {
        marginTop: 10,
        paddingStart: 20
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
    updateText: {
        color: "#ccc",
        fontSize: 14,
    },
    dateText: {
        marginTop: 3,
        color: 'white',
        fontSize: 16,
    },
    serviceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: "auto"
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        marginTop: 20,
        marginBottom: 20,
    },
    linkItem: {
        alignItems: 'center',
    },
    linkIconContainer: {
        width: 70,
        height: 65,
        borderRadius: 8,
        backgroundColor: COLORS.cardColor,
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
    card: {
        backgroundColor: COLORS.cardColor,
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
    dotContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        zIndex: 9999
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },

});