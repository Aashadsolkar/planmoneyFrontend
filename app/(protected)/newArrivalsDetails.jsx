import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS } from '../constants';

const ServiceDetailScreen = () => {
  const  service = { 
    title: '5 STOCKS WITH 50% UPSIDE', 
    date: '11 Apr 2025', 
    timeframe: '18 Months' 
  };
  
  const [expandedCompany, setExpandedCompany] = useState('pfc');
  
  const companies = [
    {
      id: 'pfc',
      name: 'Power Finance Corporation Ltd',
      price: '₹780.00',
      details: [
        'Maharatna PSU financing India\'s power sector',
        'Loan book of loan crore | 80% to government entities',
        'Supports 25% of India\'s renewable energy capacity',
        'GNPA at 3.4%, NIM at 3.18%',
        'Expanding via PSC-OFS City arm'
      ]
    },
    {
      id: 'abc',
      name: 'Aditya Birla Capital Ltd',
      price: '₹185.00',
      details: []
    },
    {
      id: 'bhf',
      name: 'Bajaj Housing Finance Ltd',
      price: '₹119.00',
      details: []
    },
    {
      id: 'tcp',
      name: 'Tata Consumer Products Ltd',
      price: '₹1088.00',
      details: []
    },
    {
      id: 'kpit',
      name: 'KPIT Technologies Ltd',
      price: '₹1119.00',
      details: []
    }
  ];

  const toggleCompany = (id) => {
    if (expandedCompany === id) {
      setExpandedCompany(null);
    } else {
      setExpandedCompany(id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
      <Header showBackButton={true}/>

      <ScrollView style={styles.scrollView}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
        </View>
        
        <View style={styles.serviceDetails}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>As on</Text>
            <Text style={styles.detailValue}>{service.date}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Timeframe</Text>
            <Text style={styles.detailValue}>{service.timeframe}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Risk</Text>
            <View style={styles.riskTag}>
              <Text style={styles.riskTagText}>MED</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.pdfButton}>
          <Text style={styles.pdfButtonText}>View PDF</Text>
          <Ionicons name="chevron-forward" size={16} color="#ffaa00" />
        </TouchableOpacity>
        
        <View style={styles.companiesContainer}>
          {companies.map((company) => (
            <View key={company.id} style={styles.companyCard}>
              <TouchableOpacity 
                style={styles.companyHeader}
                onPress={() => toggleCompany(company.id)}
              >
                <View style={styles.companyIcon}>
                  <Text style={styles.companyIconText}>
                    {company.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>{company.name}</Text>
                  <View>
                    <Text style={styles.companyLabel}>CMP</Text>
                    <Text style={styles.companyPrice}>{company.price}</Text>
                  </View>
                </View>
                <Ionicons 
                  name={expandedCompany === company.id ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={expandedCompany === company.id ? COLORS.secondaryColor : COLORS.fontWhite}
                />
              </TouchableOpacity>
              
              {expandedCompany === company.id && company.details.length > 0 && (
                <View style={styles.companyDetails}>
                  {company.details.map((detail, index) => (
                    <View key={index} style={styles.detailItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.detailText}>{detail}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
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
  },
  detailColumn: {
    flex: 1,
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
