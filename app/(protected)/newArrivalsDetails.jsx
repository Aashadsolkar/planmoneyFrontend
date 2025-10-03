import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import { COLORS } from '../constants';
import { useAuth } from '@context/useAuth';
import RenderHTML from 'react-native-render-html';
import { router } from 'expo-router';
import { formatDateToDDMMYYYY } from '../../utils/commonFunctions';


const ServiceDetailScreen = () => {
  const { width } = useWindowDimensions();
  const { newArrivalsDetails } = useAuth();
  const [expandedCompany, setExpandedCompany] = useState(null);

  const toggleCompany = (id) => {
    if (expandedCompany === id) {
      setExpandedCompany(null);
    } else {
      setExpandedCompany(id);
    }
  };

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

  const renderRecommendation = () => {
    if(newArrivalsDetails?.new_arrivals_recommendation?.length == 0){
      return <Text style={{color:COLORS.fontWhite, textAlign: "center", fontWeight: "bold", fontSize: 18, marginTop: 20}}>No recommendations are currently available.</Text>
    }
    return newArrivalsDetails?.new_arrivals_recommendation?.map((company) => (
      <View key={company.id} style={styles.companyCard}>
        <TouchableOpacity
          style={styles.companyHeader}
          onPress={() => toggleCompany(company.id)}
        >
          <View style={styles.companyIcon}>
            <Text style={styles.companyIconText}>
              {company?.stock?.name?.charAt(0)}
            </Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{company?.stock?.name}</Text>
            <View>
              <Text style={styles.companyLabel}>CMP</Text>
              <Text style={styles.companyPrice}>{company?.stock?.bse_price}</Text>
            </View>
          </View>
          <Ionicons
            name={expandedCompany === company.id ? "chevron-up" : "chevron-down"}
            size={24}
            color={expandedCompany === company.id ? COLORS.secondaryColor : COLORS.fontWhite}
          />
        </TouchableOpacity>

        {expandedCompany === company.id && company.report && (
          <View style={styles.companyDetails}>
            <RenderHTML
              contentWidth={width}
              source={{ html: company.report }}
              baseStyle={{ color: COLORS.fontWhite, fontSize: 14 }}
            />
          </View>
        )}
      </View>
    ))
  }

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
      <Header showBackButton={true} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceTitle}>{newArrivalsDetails.title}</Text>
        </View>

        <View style={styles.serviceDetails}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>As on</Text>
            <Text style={styles.detailValue}>{formatDateToDDMMYYYY(newArrivalsDetails.created_at)}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Timeframe</Text>
            <Text style={styles.detailValue}>{getTimeframeLabel(newArrivalsDetails.valid_till)}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Risk</Text>
            <View style={[styles.riskTag, { backgroundColor: getRiskLevelColor(newArrivalsDetails?.risk_level) }]}>
              <Text style={styles.riskTagText}>{getRiskLevellabel(newArrivalsDetails?.risk_level)}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.pdfButton} onPress={() => router.push({
          pathname: "/newArrivalPDF",
          params: {
            report: newArrivalsDetails?.report
          }
        })}>
          <Text style={styles.pdfButtonText}>View PDF</Text>
          <Ionicons name="chevron-forward" size={16} color="#ffaa00" />
        </TouchableOpacity>

        <View style={styles.companiesContainer}>
          {renderRecommendation()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  serviceHeader: {
    marginVertical: 10,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  serviceDetails: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: "space-between"
  },
  detailLabel: {
    fontSize: 12,
    color: '#8aa0b8',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  riskTag: {
    backgroundColor: COLORS.secondaryColor,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  riskTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  pdfButtonText: {
    color: '#ffaa00',
    fontWeight: '500',
    fontSize: 14,
    marginRight: 4,
  },
  companiesContainer: {
    marginBottom: 24,
  },
  companyCard: {
    backgroundColor: COLORS.cardColor,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  companyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff3333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyIconText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  companyLabel: {
    fontSize: 12,
    color: '#8aa0b8',
  },
  companyPrice: {
    color: '#ffaa00',
    fontWeight: '700',
    fontSize: 16,
  },
  companyDetails: {
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.primaryColor,
    borderRadius: 20
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffaa00',
    marginTop: 6,
    marginRight: 8,
  },
  detailText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
});

export default ServiceDetailScreen;
