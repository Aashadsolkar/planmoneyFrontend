
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../auth/useAuth';
import { useNavigation } from 'expo-router';
import { COLORS } from '../constants';

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
  plans
}) => {
  const [selectedDuration, setSelectedDuration] = useState(null);
  const { setSelectedService } = useAuth();
  const navigation = useNavigation();
  const renderIcon = () => {
    if (iconType === 'fa') {
      return <FontAwesome name={icon} size={24} color="#FF9800" />;
    }
    return <MaterialIcons name={icon} size={24} color="#FF9800" />;
  };

  console.log(selectedDuration);


  return (
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
              const isBest = plan?.is_bestseller == 0 ? false: true;
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
          <TouchableOpacity  disabled={!selectedDuration} onPress={() => {
            setSelectedService(selectedDuration),
            navigation.navigate('checkout')
          }} style={[styles.payNowBtn, {backgroundColor: selectedDuration ? "#FF9800": "#ccc"}]}>
            <Text style={styles.payNowText}>PAY NOW</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
    justifyContent: 'space-between',
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
});

export default ServiceCard;
