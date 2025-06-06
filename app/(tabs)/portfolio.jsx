import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/Header';
import PortfolioTab from '../components/PortfolioTab';
import { COLORS } from '../constants';
import { pmsPortfolio, quantomPortfolio } from '../utils/apiCaller';
import { useAuth } from '../context/useAuth';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';


const Portfolio = () => {
  const { portfolioServices } = useAuth();
  const { serviceID } = useLocalSearchParams();

  // Determine available tabs based on configuration

  // Define availableTabs based on subscription presence
  const availableTabs = [];

  const hasPMS = portfolioServices.some(
    (sub) => sub.name === "Portfolio Management Subscription" && sub.is_subscribed
  );
  if (hasPMS) availableTabs.push("PMS");

  const hasQuantumVoltz = portfolioServices.some(
    (sub) => sub.name === "QuantumVault (For Above ₹50 lakh Capital)" && sub.is_subscribed
  );
  if (hasQuantumVoltz) availableTabs.push("QuantumVoltz");


  // Map service IDs to tab names
  const serviceIdToTab = {
    3: 'PMS',
    4: 'QuantumVoltz',
  };


  const [activeTab, setActiveTab] = useState(null);
  useFocusEffect(
    useCallback(() => {
      const id = Number(serviceID); // ensure it's a number
      const mappedTab = serviceIdToTab[id];

      if (availableTabs.includes(mappedTab)) {
        setActiveTab(mappedTab);
      } else if (availableTabs.includes('PMS')) {
        setActiveTab('PMS');
      } else {
        setActiveTab(availableTabs[0]);
      }
    }, [serviceID, portfolioServices])
  );




  // Don't render if no tabs are available
  if (availableTabs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header showBackButton={true} />
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={[COLORS.primaryColor, COLORS.primaryColor]} style={styles.gradient}>
          <View style={styles.noServiceContainer}>
            <Ionicons name="alert-circle-outline" size={64} color="#ff8c00" />
            <Text style={styles.noServiceText}>No Services Available</Text>
            <Text style={styles.noServiceSubText}>
              Please contact support to enable services
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const headerText = () => {
    return <Text style={{ color: COLORS.fontWhite, fontWeight: 600 }}>Portfolio</Text>
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header showBackButton={true} backButtonText={headerText} />
      {/* Header Tabs - Only show if more than one tab available */}
      {/* {availableTabs.length == 0 } */}
      {availableTabs.length > 0 && (
        <View style={styles.tabContainer}>
          {availableTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {/* Content */}
      {activeTab === 'PMS' ? <PortfolioTab advisorName={"aashad"} key={1} stockAPi={pmsPortfolio} /> : <PortfolioTab advisorName={"uzair"} key={2} stockAPi={quantomPortfolio} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardColor
  },
  gradient: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    gap: 10,
    backgroundColor: COLORS.primaryColor
  },
  tab: {
    paddingHorizontal: 36,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ff8c00',
  },
  activeTab: {
    backgroundColor: '#ff8c00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabText: {
    color: '#ff8c00',
    fontSize: 15,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primaryColor
  },

  // Main Card Styles
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  rateSection: {
    marginBottom: 20,
  },
  currentRateLabel: {
    color: '#a0a0a0',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  currentRateValue: {
    color: '#10b981',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  dividerLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  dividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 20,
  },
  summaryLabel: {
    color: '#a0a0a0',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  summaryValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  returnsValue: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Enhanced Advisor Card
  advisorCardContainer: {
    marginBottom: 25,
    borderRadius: 14,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  advisorCard: {
    borderRadius: 14,
    padding: 18,
  },
  advisorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  advisorTextContainer: {
    flex: 1,
  },
  advisorLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  advisorName: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
  },
  phoneIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 12,
  },

  // Investments Section
  investmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  investmentsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sortBy: {
    color: '#a0a0a0',
    fontSize: 12,
    fontWeight: '500',
  },
  sortIcon: {
    marginLeft: 4,
  },

  // Enhanced Investment Items
  investmentItem: {
    marginBottom: 12,
  },
  investmentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  investmentTitleContainer: {
    flex: 1,
  },
  investmentName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  investmentQty: {
    color: '#a0a0a0',
    fontSize: 13,
    fontWeight: '500',
  },
  investmentValueContainer: {
    alignItems: 'flex-end',
  },
  investmentCurrentValue: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  investmentDate: {
    color: '#a0a0a0',
    fontSize: 13,
    fontWeight: '500',
  },
  investmentDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  investmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  investmentFooterItem: {
    flex: 1,
  },
  investmentFooterLabel: {
    color: '#a0a0a0',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  investedAmount: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  buyAtValue: {
    color: '#ff8c00',
    fontSize: 15,
    fontWeight: '600',
  },
  returnPercentage: {
    fontSize: 15,
    fontWeight: '600',
  },

  // PMS Placeholder Content
  placeholderCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  placeholderIcon: {
    marginBottom: 16,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  placeholderSubText: {
    color: '#a0a0a0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  placeholderStats: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  placeholderStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  placeholderStatLabel: {
    color: '#a0a0a0',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  placeholderStatValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  // No Service Available
  noServiceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noServiceText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  noServiceSubText: {
    color: '#a0a0a0',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },

  bottomSpacing: {
    height: 20,
  },
});

export default Portfolio;