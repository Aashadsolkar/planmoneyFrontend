import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, AntDesign, FontAwesome6 } from "@expo/vector-icons";
import Header from "@components/Header";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";
import { useAuth } from "@context/useAuth";
import { router, useNavigation } from "expo-router";
import Button from "@components/Button";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Foundation from "@expo/vector-icons/Foundation";
import { BackHandler } from "react-native";
import * as Animatable from "react-native-animatable";
import ShimmerSkeleton from "@components/ListSkeleton";
import { useHomeData } from "@hooks/useHomeData";
import StockOptionSlider from "@components/StockOtionSlider";
import QuestionerModal from "@components/QuestionerModal";
import { Image } from "expo-image";
import { formatDateToDDMMYYYY } from "../../utils/commonFunctions";
import { PSIcon } from "../../assets/images/SVG";

const { height, width } = Dimensions.get("window");

const NewsCard = ({ title = "", summary = "", id }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => router.push(`singleNews/${id}`)}
  >
    <View style={{ width: "90%" }}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.summary} numberOfLines={2}>
        {summary}
      </Text>
    </View>
    <Ionicons
      name="chevron-forward"
      size={25}
      color="#f5a623"
      style={{ width: "10%" }}
    />
  </TouchableOpacity>
);

const SERVICE_CARD_WIDTH = 230;

export default function Home() {
  const {
    purchesService,
    allServices,
    setServiceSelectedOnHomePage,
    portfolioServices,
    newsData,
    optionStockData,
    isQuestionerFillderByAdvisor,
    profileData,
    advertisement,
    isNewArrivalsNotOpen
  } = useAuth();
  const navigation = useNavigation();
  const { isLoading, refreshing, onRefresh } = useHomeData();

  const [showPullHint, setShowPullHint] = useState(true);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isQuestionerModalOpen, setIsQuestionerModalOpen] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const [activeAdverismentIndex, setActiveAdverismentIndex] = useState(0);

  const { width } = Dimensions.get("window");
  const ITEM_WIDTH = width * 0.93; // 90% of screen width
  const SPACING = (width - ITEM_WIDTH) / 3;
  const removeIds = [5, 6];

  useEffect(() => {
    if (isQuestionerFillderByAdvisor) {
      setIsQuestionerModalOpen(true);
    } else {
      setIsQuestionerModalOpen(false);
    }
  }, [isQuestionerFillderByAdvisor]);

  useEffect(() => {
    const timer = setTimeout(() => setShowPullHint(false), 3000); // Hide after 3 sec
    return () => clearTimeout(timer);
  }, []);

  // 🚫 Prevent back button and swipe gestures
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault(); // Block back navigation
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    ); // Block Android hardware back

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation]);

  const [offerData, setOfferData] = useState(advertisement);
  useEffect(() => {
    // Create a set of purchased service IDs
    const purchasedServiceIds = new Set(
      purchesService.map((service) => service.id)
    );

    // Filter offer data
    const filteredOffers = advertisement.filter(
      (offer) => !offer.service_id || !purchasedServiceIds.has(offer.service_id)
    );

    const sortedData = filteredOffers.sort((a, b) => {
      if (a.service_id === null && b.service_id !== null) return 1; // a ko last le jao
      if (a.service_id !== null && b.service_id === null) return -1; // b ko last le jao
      return 0; // order same rahe agar dono same type ke hain
    });

    setOfferData(sortedData);
  }, [portfolioServices]);

  const handleClick = (item) => {
    if ([1, 6].includes(item?.id)) {
      router.push({
        pathname: `/fastlane/${item?.id}`,
        params: {
          is_advisor_assign: item?.subscription?.is_advisor_assign,
        },
      });
    } else {
      // router.push(`pmsAndQuantom/${id}`)
      router.push({
        pathname: `/pmsAndQuantom/${item?.id}`,
        params: {
          is_advisor_assign: item?.subscription?.is_advisor_assign,
          advisor_name: item?.subscription?.advisor?.name ?? "NA",
          advisor_nummber: item?.subscription?.advisor?.phone ?? "NA",
        },
      });
    }
  };

  const handleServiceClick = (item) => {
    setServiceSelectedOnHomePage(item.id);
    navigation.navigate("service");
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
        <TouchableOpacity onPress={() => handleClick(item)}>
          <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            colors={
              is__not_subscribed
                ? [COLORS.cardColor, COLORS.cardColor]
                : ["#AF125D", "#D36C32"]
            }
            style={[styles.serviceCard]}
          >
            <Text style={styles.serviceTitle}>{item?.name}</Text>
            <View style={styles.serviceInfoRow}></View>
            <View style={styles.serviceFooter}>
              {is__not_subscribed ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <View style={{ justifyContent: "center", paddingEnd: 20 }}>
                      <Text style={{ fontSize: 10, color: COLORS.fontWhite }}>
                        Start from
                      </Text>
                      <Text style={{ fontSize: 12, color: COLORS.fontWhite }}>
                        ₹{item.plans?.[0]?.offer_price}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button
                        onClick={() => handleServiceClick(item)}
                        label={"subscribe now"}
                        gradientColor={["#D36C32", "#F68F00"]}
                        buttonStye={{ padding: 10 }}
                      />
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View>
                    <Text style={styles.updateText}>Expire On</Text>
                    <Text style={styles.dateText}>
                      {formatDateToDDMMYYYY(item?.subscription?.end_at)}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={40} color="#fff" />
                </>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const renderServices = () => {
    const renderData = purchesService.length > 0 ? purchesService : allServices;
    // removing new arrivals
    const filteredData = renderData.filter(item => !removeIds.includes(item.id));
    const handleServiceScroll = (event) => {
      const scrollX = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollX / SERVICE_CARD_WIDTH); // adjust 180 based on your service card width
      setActiveServiceIndex(index);
    };

    return (
      <>
        <FlatList
          data={filteredData}
          renderItem={renderServiceItem}
          keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
          horizontal
          onScroll={handleServiceScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesListContainer}
        />

        {/* Dot Indicators for Services */}
        {filteredData?.length > 1 && (
          <View style={styles.dotContainer}>
            {filteredData.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i === activeServiceIndex
                        ? COLORS.secondaryColor
                        : COLORS.lightGray,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </>
    );
  };

  const renderNews = () => {
    if (newsData == null || newsData.length == 0) {
      return (
        <Text
          style={{ textAlign: "center", fontSize: 16, color: COLORS.fontWhite }}
        >
          No News Available.
        </Text>
      );
    }
    return newsData.slice(0, 4).map((item) => {
      return (
        <NewsCard
          title={item?.title}
          summary={item?.summary}
          id={item?.id}
          key={`news/${item?.id}`}
        />
      );
    });
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
                {
                  backgroundColor:
                    i === activeIndex
                      ? COLORS.secondaryColor
                      : COLORS.lightGray,
                },
              ]}
            />
          ))}
        </View>
      );
    }
  };

  const renderBanner = () => {
    if (offerData.length !== 0) {
      return (
        <View style={styles.carouselContainer}>
          <FlatList
            data={offerData}
            keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: SPACING
            }}
            renderItem={({ item, index }) => (
              <Animatable.View
                animation="fadeInRight"
                delay={index * 100}
                duration={300}
              >
                <TouchableOpacity 
                  onPress={
                    item?.service_id
                      ? () => {
                        setServiceSelectedOnHomePage(item?.service_id);
                        router.push("service");
                      }
                      : () => { }
                  }
                >
                  <Image
                    source={typeof item.banner_url === 'string' ? { uri: item.banner_url } : item.banner_url}
                    style={{
                      width: ITEM_WIDTH,
                      height: 177,
                      borderRadius: 10,
                      overflow: 'hidden',
                      marginHorizontal: 5,
                    }}
                    contentFit="fill"
                  />
                </TouchableOpacity>
              </Animatable.View>
            )}
            onScroll={(e) => {
              // const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
              const maxIndex = Math.max(0, offerData.length - 1);
              const index = Math.min(maxIndex, Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH));
              setActiveIndex(index); // use this for dot indicators
            }}

          />
          {/* Dot Indicators */}
          {showOffterSliderDots()}
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
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
      );
    }
    return (
      <>
        {/* Offer Carousel Section */}
        {renderBanner()}

        {/* Option stock section */}
        <View style={{ marginTop: 10 }}>
          <StockOptionSlider marketData={optionStockData || []} />
        </View>

        {/* Services Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {purchesService.length > 0 ? "Your Services" : "Buy Service"}
          </Text>
          {renderServices()}
        </View>

        {/* Quick Links Section */}
        <View style={styles.linksContainer}>
          <Animatable.View
            animation="zoomIn"
            delay={100}
            duration={100}
            style={styles.linkItem}
          >
            <TouchableOpacity
              onPress={() => router.push("history")}
              style={{alignItems: "center"}}
            >
              <View style={styles.linkIconContainer}>
                <FontAwesome6
                  size={35}
                  name="chart-pie"
                  color={COLORS.secondaryColor}
                />
              </View>
              <Text style={styles.linkText}>Recommendation History</Text>
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View
            animation="zoomIn"
            delay={200}
            duration={200}
            style={styles.linkItem}
          >
            <TouchableOpacity
              onPress={() => router.push("sip")}
              style={{alignItems: "center"}}
            >
              <View style={styles.linkIconContainer}>
                <Ionicons name="calculator" size={40} color="#FFA500" />
              </View>
              <Text style={styles.linkText}>SIP Calculator</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View
            animation="zoomIn"
            delay={300}
            duration={200}
            style={styles.linkItem}
          >
            {isNewArrivalsNotOpen ? <View style={{width:10, height:10, backgroundColor: "red", borderRadius: "50%", position: "absolute", top: 13, right: 28, zIndex: 9999 }}></View> : null }
            <TouchableOpacity
              onPress={() => router.push("newArrivals")}
              style={{alignItems: "center"}}
            >
              <View style={styles.linkIconContainer}>
                <Foundation
                  name="burst-new"
                  size={50}
                  style={{ transform: [{ rotate: "30deg" }] }}
                  color="#FFA500"
                />
              </View>
              <Text style={styles.linkText}>New Arrivals</Text>
            </TouchableOpacity>
          </Animatable.View>

          {/* MF option  */}
          <Animatable.View
            animation="zoomIn"
            delay={300}
            duration={200}
            style={styles.linkItem}
          >
            <TouchableOpacity
            style={{alignItems: "center"}}
              onPress={() => router.push("premiumResearch")}
            >
              <View style={styles.linkIconContainer}>
                <PSIcon height={40} width={40} />
              </View>
              <Text style={styles.linkText}>Premium Research</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>

        {/* Latest News Section */}
        <View style={styles.newsContainer}>
          <View style={styles.newsHeader}>
            <Text style={styles.newsTitle}>Latest News</Text>
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => router.push("news")}
            >
              <Text style={styles.viewMoreText}>View More</Text>
              <AntDesign name="right" size={12} color="#FFA500" />
            </TouchableOpacity>
          </View>

          {/* News Accordion */}
          {renderNews()}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
      <Header showBackButton={false} />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {showPullHint && (
          <Animatable.View
            animation="fadeIn"
            duration={1000}
            easing="ease-in-out"
            style={{ alignItems: "center", paddingVertical: 10 }}
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
            <Text style={{ color: "#ccc", fontSize: 13, marginTop: 5 }}>
              Pull down to refresh
            </Text>
          </Animatable.View>
        )}

        {renderContent()}
      </ScrollView>
      {profileData && (
        <QuestionerModal
          isVisible={isQuestionerModalOpen}
          handleClose={() => setIsQuestionerModalOpen(false)}
          onRefresh={onRefresh}
        />
      )}
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
    backgroundColor: COLORS.primaryColor,
  },
  carouselContainer: {
    marginTop: 10,
  },
  offerCard: {
    height: 177,
    width: width,
    marginHorizontal: 10,
    position: "relative",
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  offerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionContainer: {
    marginTop: 8,
    paddingStart: 18,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  servicesListContainer: {
    paddingRight: 18,
  },
  serviceCard: {
    width: SERVICE_CARD_WIDTH,
    height: 130,
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
  },
  serviceTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  serviceInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  updateText: {
    color: "#ccc",
    fontSize: 12,
  },
  dateText: {
    marginTop: 3,
    color: "white",
    fontSize: 14,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  linksContainer: {
    flex:1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    // marginVertical:15,
    marginTop: 15,
    marginBottom: 10
  },
  linkItem: {
    alignItems: "center",
    width: "25%"
  },
  linkIconContainer: {
    width: 70,
    height: 65,
    borderRadius: 8,
    backgroundColor: COLORS.cardColor,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  linkText: {
    color: "white",
    fontSize: 11,
    textAlign: "center"
  },
  newsContainer: {
    paddingHorizontal: 20,
    // marginVertical: 10,
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  newsTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewMoreText: {
    color: "#FFA500",
    fontSize: 12,
    marginRight: 5,
  },
  card: {
    backgroundColor: COLORS.cardColor,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
    marginRight: 8,
    fontWeight: 600,
  },
  summary: {
    marginTop: 10,
    color: "#fff",
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    zIndex: 9999,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});