
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, TextInput, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../context/useAuth';
import { router, useNavigation } from 'expo-router';
import { COLORS } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { leads } from '../utils/apiCaller';
import * as Animatable from "react-native-animatable"
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
  serviceId
}) => {
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState("Need more details...");
  const [isLeadApiLoading, setIsLeadApiLoading] = useState(false);
  const [isLeadGenerated, setIsLeadGenerated] = useState(false);
  const {
    setSelectedService,
    token,
    profileData
  } = useAuth();
  const navigation = useNavigation();
  const renderIcon = () => {
    if (iconType === 'fa') {
      return <FontAwesome name={icon} size={24} color="#FF9800" />;
    }
    return <MaterialIcons name={icon} size={24} color="#FF9800" />;
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
      console.log(response, "leads reposne_____");
      setIsLeadGenerated(true);
      setIsLeadApiLoading(false);
      setSearchText("");
      setSearchText("Need more details...")
    } catch (error) {
      console.log(error);
      setIsLeadApiLoading(false);

    }
  }

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {renderIcon()}
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            {showDetails && !isExpanded && (
              <TouchableOpacity onPress={onToggle}>
                <View style={styles.details}>
                  <Text style={styles.detailsText}>View Details</Text>
                  <MaterialIcons name="chevron-right" size={16} color="#FF9800" />
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>
              {startsAt ? 'Starts at' : 'Based on'}
            </Text>
            <Text style={styles.price}>
              {startsAt || basedOn}
            </Text>
          </View>
        </View>

        {isExpanded && showSubscriptions && (
          <View style={styles.expanded}>
            <Text style={styles.expandedTitle}>Stock Advise</Text>
            <View style={styles.subscriptions}>
              {plans.map((plan) => {
                const isBest = plan?.is_bestseller == 0 ? false : true;
                // de
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
                    <Text style={styles.original}>₹{plan?.actual_price}</Text>
                    <Text style={styles.discounted}>₹{plan?.offer_price}</Text>
                  </TouchableOpacity>

                );
              })}
            </View>
            <View style={[styles.details, { justifyContent: "flex-end", marginBottom: 10 }]}>
              <Text onPress={() => setIsVisible(true)} style={[styles.detailsText]}>Know More</Text>
              <MaterialIcons name="chevron-right" size={16} color="#FF9800" style={{ marginTop: 3 }} />
            </View>
            <TouchableOpacity disabled={!selectedDuration} onPress={() => {
              setSelectedService(selectedDuration),
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
                          source={require('../../assets/images/custmer_care.png')}
                          style={styles.logo}
                          resizeMode="contain"
                          height={50}
                        />
                      </View>
                      <Animatable.View animation="bounceIn">
                        <View style={{ alignItems: "center" }}>
                          <Text style={{ color: COLORS.fontWhite, fontSize: 25 }}>Thank you</Text>
                          {/* <CheckCircle color="#D87129" size={60} /> */}
                          <Text style={{ color: COLORS.fontWhite, fontSize: 14, marginTop: 5 }}> for your Interest</Text>
                          <Text style={{ color: COLORS.secondaryColor, fontSize: 14, marginTop: 5 }}>Our Agent will contact you soon</Text>
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
                  <Text style={{ marginHorizontal: 20, color: COLORS.fontWhite, fontWeight: 400 }}>Please enter your query here.</Text>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
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
  },
  subscription: {
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
  bestValueCard: {
    borderColor: '#FF9800',
    borderWidth: 2,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
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
    textTransform: "capitalize"
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
    fontSize: 16,
  },
  payNowBtn: {
    backgroundColor: '#FF9800',
    borderRadius: 24,
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
