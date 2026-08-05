import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView,useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import Header from '@components/Header';
import { router } from 'expo-router';
import { useAuth } from '@context/useAuth';
import { getFastLaneServiceData } from '@utils/apis/customer-api-caller';
import { newArrivals, service } from '@utils/apiCaller';
import SkeletonList from '@components/ListSkeleton';
import * as Animatable from 'react-native-animatable';
import Entypo from '@expo/vector-icons/Entypo';
import { showToast } from "@components/CustomToast/ToastService";
import { formatDateToDDMMYYYY } from '../../utils/commonFunctions';

const HomeScreen = () => {
  const { token, setNewArrivalsDetails, setSelectedService, logout, setIsNewArrivalsNotOpen } = useAuth()
  const [newArrivalsData, setNewArrivalsData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newArrivalsPlan, setNewArrivalsPlan] = useState({});
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setIsNewArrivalsNotOpen(false)
    getNewArrivalsData(token, 5)
  }, [token])

  const getNewArrivalsData = async (token, id) => {
    try {
      const response = await getFastLaneServiceData(token, id);
      
      const newArrivalsUser = await newArrivals(token);
      // getting new arrivals plan details
      const servicesResponse = await service();
      const services = servicesResponse?.data?.services;
      const plan = services.find(item => item.id === 5)?.plans?.[0];
      setNewArrivalsPlan(plan);
      const availableService = response?.data?.services || []
      const availableUserService = newArrivalsUser?.data?.new_arrival_data || [];
      const mergedServices = [];
      availableService.forEach(service => {
        // Check if this service is purchased
        const purchased = availableUserService.find(p => p.id === service.id);
        if (purchased) {
          // Merge both objects if found
          mergedServices.push({ ...service, ...purchased });
        } else {
          // If not purchased, keep original
          mergedServices.push(service);
        }
      });

      if (availableService.length > 0 && availableUserService.length > 0) {
        setNewArrivalsData(mergedServices);
      } else if (availableService.length > 0) {
        setNewArrivalsData(mergedServices);
      } else {
        setNoData(true);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showToast({
        type: "error",
        title: `Something went wrong! 😥`,
        message: `${error?.error || error?.message || "Failed to get New Arrivals Data."}`,
        redirectPath: "home",
        sessionExired: error?.error == "Another session is active." ? true : false,
        logout: logout
      });
    }
  }


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Apr"
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getTimeframeLabel = (validTillDate) => {
    const now = new Date();
    const end = new Date(validTillDate);

    // Ensure valid dates
    if (isNaN(end.getTime())) return 'Invalid Date';

    let years = end.getFullYear() - now.getFullYear();
    let months = end.getMonth() - now.getMonth();
    let days = end.getDate() - now.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    // Return based on values
    if (years === 0 && months === 0) {
      return `${days} Days`;
    } else if (years === 0 && days === 0) {
      return `${months} Month${months > 1 ? 's' : ''}`;
    } else if (years === 0) {
      return `${months} Month${months > 1 ? 's' : ''} ${days} Day${days > 1 ? 's' : ''}`;
    } else if (months === 0 && days === 0) {
      return `${years} Year${years > 1 ? 's' : ''}`;
    } else {
      return `${years} Year${years > 1 ? 's' : ''} ${months} Month${months > 1 ? 's' : ''}`;
    }
  };


  const getRiskLevelColor = (riskLevel) => {
    const colors = {
      low: COLORS.profitColor,    // green
      medium: COLORS.secondaryColor,// yellow
      high: COLORS.lossColor   // red
    };

    return colors[riskLevel.toLowerCase()] || '#6c757d'; // fallback: gray
  }

  const getRiskLevellabel = (riskLevel) => {
    const label = {
      low: "LOW",
      medium: "MED",
      high: "HIGH"
    };

    return label[riskLevel.toLowerCase()]; // fallback: gray
  }

  const renderStockList = () => {

    if (noData) {
      return (
        <View style={styles.content}>
          <Animatable.View
            animation="bounceInDown"
            delay={300}
            duration={1000}
            useNativeDriver
          >
            <Entypo
              name="new"
              size={100}
              color={COLORS.secondaryColor}
              style={{ marginBottom: 20 }}
            />
          </Animatable.View>

          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
            style={styles.text}
          >
            No Recommendations available.
          </Animatable.Text>
        </View>
      )
    }

    if (isLoading) {
      return [1, 2, 3, 4, 5].map((v) => <SkeletonList key={v} />)
    }
    return newArrivalsData.map((service) => (
      <View key={service.id} style={styles.serviceCard}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <View style={[
            styles.serviceTag,
            styles.multiTag,
            { backgroundColor: getRiskLevelColor(service?.risk_level) }
          ]}>
            <Text style={[styles.serviceTagText]}>
              {getRiskLevellabel(service?.risk_level)}
            </Text>
          </View>
        </View>
        <View style={styles.serviceDetails}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>As on</Text>
            <Text style={styles.detailValue}>{formatDateToDDMMYYYY(service.created_at)}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Timeframe</Text>
            <Text style={styles.detailValue}>{getTimeframeLabel(service.valid_till)}</Text>
          </View>
          {
            service?.new_arrivals_recommendation ?
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => {
                setNewArrivalsDetails(service);
                router.push('newArrivalsDetails')
              }}>
                <Text style={{ color: COLORS.secondaryColor }}>View Details</Text><MaterialIcons name="chevron-right" size={18} color={COLORS.secondaryColor} />
              </TouchableOpacity>
              :
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => {
                  setSelectedService({ new_arrival_id: service?.id, name: service?.title, offer_price: service?.price, id: newArrivalsPlan?.id, billing_cycle: "yearly", serviceId: "5" })
                  router.push("checkout")
                }}
              >
                <Text style={styles.buyButtonText}>Buy Now</Text>
              </TouchableOpacity>
          }
        </View>
      </View>
    ))
  }

  const headerText = () => {
    return <Text allowFontScaling={false} style={{ color: COLORS.secondaryColor, fontWeight: 600, fontSize: 18 }}>New Arrivals</Text>
}

  return (
    <SafeAreaView edges={['left', 'right','bottom']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      <Header showBackButton={true} backButtonText={headerText} />

      <ScrollView   style={styles.scrollView}>
        {renderStockList()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#003366',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 16,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#990066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 20
  },
  serviceCard: {
    backgroundColor: COLORS.cardColor,
    borderRadius: 10,
    borderLeftWidth: 2,
    borderColor: '#ffaa00',
    marginBottom: 16,
    padding: 16,
    boxShadow: COLORS.boxShadow,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.fontWhite,
    flex: 1,
    paddingRight: 8,
  },
  serviceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  multiTag: {
    backgroundColor: '#ff3333',
  },
  upsideTag: {
    backgroundColor: '#ffaa00',
  },
  bluechipTag: {
    backgroundColor: '#ff3333',
  },
  serviceTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailColumn: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.lightGray,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.fontWhite,
    fontWeight: '500',
  },
  buyButton: {
    backgroundColor: COLORS.orangeColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  buyButtonText: {
    color: COLORS.fontWhite,
    fontWeight: '600',
    fontSize: 12,
  },
  content: {
    flex: 1,
    marginTop: 100,
    backgroundColor: COLORS.primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: COLORS.fontWhite,
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center"
  },
});

export default HomeScreen;
