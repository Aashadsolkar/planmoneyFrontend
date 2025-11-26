
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, TextInput, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '@context/useAuth';
import { router, useNavigation } from 'expo-router';
import { COLORS, serviceInfo } from '../app/constants';
import { Ionicons } from '@expo/vector-icons';
import Button from '@components/Button';
import { leads } from '@utils/apiCaller';
import * as Animatable from "react-native-animatable"
import { showToast } from "@components/CustomToast/ToastService";
import { formatIndianNumber } from '../utils/commonFunctions';
import * as Linking from "expo-linking";
const { height } = Dimensions.get("window")

const ServiceCard = ({
  name,
  icon,
  iconType,
  startsAt,
  basedOn,
  isExpanded,
  onToggle,
  showDetails,
  showSubscriptions,
  plans,
  serviceId,
  isPurchesed,
  advisor_name,
  is_advisor_assign,
  advisor_number
}) => {
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState("Need more details...");
  const [isLeadApiLoading, setIsLeadApiLoading] = useState(false);
  const [isLeadGenerated, setIsLeadGenerated] = useState(false);
  const [sortedPlans, setSortedPlans] = useState([])
  const {
    setSelectedService,
    token,
    profileData,
    logout
  } = useAuth();
  const navigation = useNavigation();
  const renderIcon = () => {
    if (iconType === 'fa') {
      return <FontAwesome name={icon} size={24} color="#FF9800" />;
    }
    return <MaterialIcons name={icon} size={24} color="#FF9800" />;
  };

  useEffect(() => {
    const sortPlans = sortPlansByActualPrice(plans)
    setSortedPlans(sortPlans)
  }, [])

  const sortPlansByActualPrice = (plans) => {
    if (!Array.isArray(plans)) return [];

    return plans.sort((a, b) => parseFloat(a.actual_price) - parseFloat(b.actual_price));
  };



  const generateLead = async () => {
    try {
      setIsLeadApiLoading(true);
      const payload = {
        lead_source: "app",
        customer_id: profileData?.customer_id,
        name: profileData?.name,
        email: profileData?.email,
        phone: profileData?.phone,
        description: searchText,
        service: name,
        service_id: String(serviceId)
      }
      const response = await leads(token, payload);
      setIsLeadGenerated(true);
      setIsLeadApiLoading(false);
      setSearchText("");
      setSearchText("Need more details...")
    } catch (error) {
      setIsLeadApiLoading(false);
      showToast({
        type: "error",
        title: `Something went wrong! 😥`,
        message: `${error?.error || error?.message || "Failed to generate Query"}`,
        redirectPath: "home",
        sessionExired: error?.error == "Another session is active." ? true : false,
        logout: logout
      });

    }
  }

  const renderOfferPrice = (actual, offer) => {

    // If no offer price, show only actual price
    if (!offer) {
      return <Text style={[styles.discounted, { paddingTop: 10 }]}>₹{formatIndianNumber(actual)}</Text>;
    }

    // If both prices are same, show only one
    if (actual === offer) {
      return <Text style={[styles.discounted, { paddingTop: 10 }]}>₹{formatIndianNumber(offer)}</Text>;
    }

    // Show original (strikethrough) and discounted
    return (
      <>
        <Text style={styles.original}>₹{formatIndianNumber(actual)}</Text>
        <Text style={styles.discounted}>₹{formatIndianNumber(offer)}</Text>
      </>
    );
  };

  const renderOfferPrice1 = (actual, offer) => {

    // If no offer price, show only actual price
    if (!offer) {
      return <Text style={[styles.discounted, { paddingTop: 10 }]}>₹{formatIndianNumber(actual)}</Text>;
    }

    // If both prices are same, show only one
    if (actual === offer) {
      return <Text style={[styles.discounted, { paddingTop: 10 }]}>₹{formatIndianNumber(offer)}</Text>;
    }

    // Show original (strikethrough) and discounted
    return (
      <>
        <Text style={styles.discounted}>₹{formatIndianNumber(offer)}</Text>
      </>
    );
  };


  const renderPurchesOrNot = () => {
    if (!isPurchesed) {
      return (
        <TouchableOpacity onPress={onToggle}>
          <View style={styles.details}>
            <Text style={styles.detailsText}>View Details</Text>
            <MaterialIcons name="chevron-right" size={16} color="#FF9800" />
          </View>
        </TouchableOpacity>
      )
    }
    return (<TouchableOpacity onPress={() => { }}>
      <View style={styles.details}>
        <Text style={styles.detailsText}>purchased</Text>
        {/* <MaterialIcons name="chevron-right" size={16} color="#FF9800" /> */}
      </View>
    </TouchableOpacity>)
  }

  const handleOpen = (item) => {

    if ([1, 6].includes(serviceId)) {
      router.push({
        pathname: `/fastlane/${serviceId}`
      });
    } else {
      // router.push(`pmsAndQuantom/${id}`)
      router.push({
        pathname: `/pmsAndQuantom/${serviceId}`,
        params: {
          is_advisor_assign: is_advisor_assign,
          advisor_name: advisor_name ?? "NA",
          advisor_nummber: advisor_number ?? "NA",
        },
      });
    }
  }

  const renderPriceContainer = () => {
    if (!isPurchesed) {
      return (
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>
            {startsAt ? 'Starts from' : 'Based on'}
          </Text>
          <Text style={styles.price}>
            {renderOfferPrice1(sortedPlans[0]?.actual_price, sortedPlans[0]?.offer_price)}
          </Text>
        </View>
      )
    }
    return (
      <View style={styles.priceContainer}>
        <TouchableOpacity onPress={() => handleOpen()}>
          <Text style={{ color: COLORS.fontWhite, backgroundColor: COLORS.secondaryColor, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, fontWeight: 600 }}>
            Open
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {icon()}
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            {showDetails && !isExpanded && renderPurchesOrNot()}
          </View>
          {renderPriceContainer()}
        </View>

        {isExpanded && showSubscriptions && (
          <View style={styles.expanded}>
            <View style={styles.subscriptions}>
              {sortedPlans.map((plan) => {
                const isBest = plan?.is_bestseller == 0 ? false : true;
                const isSelected = selectedDuration?.id === plan?.id;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    onPress={() => setSelectedDuration(plan)}
                    style={[
                      styles.subscription,
                      isSelected && styles.bestValueCard
                    ]}
                  >
                    {isBest && (
                      <View style={styles.bestValueBadge}>
                        <Text style={styles.bestValueText}>Best Value</Text>
                      </View>
                    )}
                    <Text style={styles.duration}>{plan.billing_cycle}</Text>
                    {renderOfferPrice(plan?.actual_price, plan?.offer_price)}
                  </TouchableOpacity>

                );
              })}
            </View>
            <View style={[styles.details, { justifyContent: "flex-end", marginBottom: 10 }]}>
              <Text onPress={() => setIsVisible(true)} style={[styles.detailsText]}>Know More</Text>
              <MaterialIcons name="chevron-right" size={16} color="#FF9800" style={{ marginTop: 3 }} />
            </View>
            <TouchableOpacity disabled={!selectedDuration} onPress={() => {
              setSelectedService({
                ...selectedDuration,
                serviceId: serviceId
              }),
                router.push('checkout')
            }} style={[styles.payNowBtn, { backgroundColor: selectedDuration ? "#FF9800" : "#ccc" }]}>
              <Text style={styles.payNowText}>PAY NOW</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Modal visible={isVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {
              isLeadGenerated ? (
                <>
                  <View style={[styles.modalHeader, { justifyContent: "flex-end" }]}>
                    <TouchableOpacity onPress={() => {
                      setIsLeadGenerated(false);
                      setIsVisible(false)
                    }}>
                      <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 15 }}>
                      <View style={{ backgroundColor: COLORS.primaryColor, height: 80, width: 80, borderRadius: "50%", justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
                        <Image
                          source={require('../assets/images/custmer_care.png')}
                          style={styles.logo}
                          resizeMode="contain"
                          height={50}
                        />
                      </View>
                      <Animatable.View animation="bounceIn">
                        <View style={{ alignItems: "center" }}>
                          <Text style={{ color: COLORS.fontWhite, fontSize: 25 }}>Thank you</Text>
                          <Text style={{ color: COLORS.fontWhite, fontSize: 14, marginTop: 5 }}> for your Interest</Text>
                          <Text style={{ color: COLORS.secondaryColor, fontSize: 14, marginTop: 5 }}>Our Agent will contact you soon</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
                          <Text style={{ color: COLORS.fontWhite, fontSize: 14 }}>
                            For urgent support,
                          </Text>

                          <TouchableOpacity onPress={() => Linking.openURL("tel:8108181602")}>
                            <Text style={{ color: COLORS.secondaryColor, fontSize: 14, textDecorationLine: "underline", marginLeft: 4 }}>
                              call here
                            </Text>
                          </TouchableOpacity>
                        </View>

                      </Animatable.View>
                    </View>
                    <Button isLoading={isLeadApiLoading} buttonStye={{ marginHorizontal: 20, marginTop: 10 }} onClick={() => {
                      setIsVisible(false);
                      setIsLeadGenerated(false);
                    }} label={"Done"} gradientColor={['#D36C32', '#F68F00']} />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Know More</Text>
                    <TouchableOpacity onPress={() => setIsVisible(false)}>
                      <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <Text style={{ marginHorizontal: 20, fontSize: 18, color: COLORS.secondaryColor }}>About {name}</Text>
                  <Text style={{ marginHorizontal: 20, color: COLORS.fontWhite, fontWeight: 400 }}>{serviceInfo[serviceId]}</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Type here..."
                    placeholderTextColor="#8B9DC3"
                    value={searchText}
                    onChangeText={setSearchText}
                    multiline={true}
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                  <Button isLoading={isLeadApiLoading} buttonStye={{ marginHorizontal: 20 }} onClick={() => generateLead()} label={"submit"} gradientColor={['#D36C32', '#F68F00']} />
                </>
              )
            }
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardColor,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    color: '#FF9800',
    fontSize: 14,
    marginRight: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  price: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  expanded: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  expandedTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 16,
  },
  subscriptions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 24,
     flexWrap: "wrap",
  },
  subscription: {
     width: "45%",    
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  bestValueCard: {
    borderColor: '#FF9800',
    borderWidth: 2,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#FF9800',
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 12,
  },
  bestValueText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  duration: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 8,
    textTransform: "capitalize",
    paddingTop: 5
  },
  original: {
    color: '#AAA',
    textDecorationLine: 'line-through',
    fontSize: 12,
    marginBottom: 4,
  },
  discounted: {
    color: '#FF9800',
    fontWeight: 'bold',
    fontSize: 14,
  },
  payNowBtn: {
    backgroundColor: '#FF9800',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payNowText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: COLORS.cardColor,
    borderRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
    paddingBottom: 20,
    width: "90%",
    marginHorizontal: "auto"
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchInput: {
    backgroundColor: COLORS.primaryColor,
    borderWidth: 1,
    borderColor: COLORS.fontWhite,
    borderRadius: 12,
    padding: 16,
    margin: 20,
    color: "#FFFFFF",
    fontSize: 16,
    height: 100
  },
});

export default ServiceCard;
