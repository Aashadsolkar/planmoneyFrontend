import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import Header from '../components/Header';
import { router } from 'expo-router';

const HomeScreen = () => {
  const services = [
    {
      id: '1',
      title: '3 Stocks projected as Multibagger',
      date: '11 Apr 2025',
      timeframe: '18 Months',
      type: 'multi',
    },
    {
      id: '2',
      title: '5 STOCKS WITH 50% UPSIDE',
      date: '11 Apr 2025',
      timeframe: '18 Months',
      type: 'upside',
    },
    {
      id: '3',
      title: '3 Bluechip Stock expected 10% upside',
      date: '11 Apr 2025',
      timeframe: '3 Months',
      type: 'bluechip',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      <Header showBackButton={true} />

      <ScrollView style={styles.scrollView}>
        {services.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <View style={[
                styles.serviceTag, 
                service.type === 'multi' ? styles.multiTag : 
                service.type === 'upside' ? styles.upsideTag : styles.bluechipTag
              ]}>
                <Text style={styles.serviceTagText}>
                  {service.type === 'multi' ? 'Multi' : 
                   service.type === 'upside' ? 'Best' : 'High'}
                </Text>
              </View>
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
              <TouchableOpacity 
                style={styles.buyButton}
                onPress={() => router.push('newArrivalsDetails')}
              >
                <Text style={styles.buyButtonText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    color: COLORS.secondaryColor,
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
    color: '#fff',
    fontWeight: '500',
  },
  buyButton: {
    backgroundColor: COLORS.secondaryColor,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HomeScreen;
