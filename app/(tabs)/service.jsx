import React, { use, useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text } from 'react-native';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../context/useAuth';
import Header from '../components/Header';
import { COLORS } from '../constants';
import { service } from '../utils/apiCaller';
import { router, useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import SkeletonList from '../components/ListSkeleton';
import QuantomVoltIcon, { FastlaneIcon, PMSIcon, PSIcon } from '../../assets/images/SVG';

const icon = {
    1 : () => <FastlaneIcon height={33} width={33} />,
    2 : () => <PSIcon height={33} width={33} />,
    3 : () => <FastlaneIcon height={33} width={33} />,
    4 : () => <QuantomVoltIcon height={33} width={33} />,
    6 : () => <PMSIcon height={33} width={33} />
}

const Service = () => {
    const {
        logout,
        setAllServices,
        allServices,
        setSkipServices,
        serviceSelectedOnHomePage,
        setServiceSelectedOnHomePage,
        purchesService
    } = useAuth();

    const navigation = useNavigation();
    const [expandedService, setExpandedService] = useState();
    const [isLoading, setIsloading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setSkipServices(true)
            const getServiceData = async () => {
                try {
                    setIsloading(true)
                    const serviceResponse = await service();
                    setIsloading(false)
                    const services = serviceResponse?.data?.services;
                    if (purchesService?.length > 0) {
                        const purchesServiceId = purchesService.map(item => item.id);
                        const filteredArray = services.filter(item => !purchesServiceId.includes(item.id));
                        const filteredData = filteredArray.filter(item => item.id !== 5);
                        setAllServices(filteredData);
                    } else {
                        const filteredData = services.filter(item => item.id !== 5);
                        setAllServices(filteredData);
                    }
                } catch (error) {
                    Alert.alert(
                        "Error",
                        error?.message || "Failed to get service data",
                        [
                            {
                                text: "OK",
                                onPress: () => router.push("home"),
                            },
                        ]
                    );
                }

            };

            getServiceData();
            setExpandedService(null)
            if (serviceSelectedOnHomePage) {
                setTimeout(() => {
                    setExpandedService(serviceSelectedOnHomePage);
                });
                setServiceSelectedOnHomePage(null);
            }

        }, [purchesService, serviceSelectedOnHomePage])
    );

    const toggleExpand = (name) => {
        setExpandedService(prev => (prev === name ? null : name));
    };


   const getLowestActualPricePlan = (plans) => {
  if (!Array.isArray(plans) || plans.length === 0) return null;

  return plans.reduce((minPlan, currentPlan) => {
    return parseFloat(currentPlan.actual_price) < parseFloat(minPlan.actual_price)
      ? currentPlan
      : minPlan;
  });  
};


    const renderService = () => {
        if (isLoading) {
            return <>
                <SkeletonList />
                <SkeletonList />
                <SkeletonList />
                <SkeletonList />
            </>
        }
        return allServices.map((service) => {
            return (
                <ServiceCard
                    name={service.name}
                    // icon="line-chart"
                    iconType="fa"
                    startsAt={getLowestActualPricePlan(service?.plans)?.actual_price}
                    isExpanded={expandedService === service.id}
                    onToggle={() => toggleExpand(service.id)}
                    plans={service?.plans}
                    showDetails
                    showSubscriptions
                    key={service?.id}
                    serviceId={service?.id}
                    icon={icon[service?.id]}
                />
            )
        })
    }

    const headerText = () => {
    return <Text style={{ color: COLORS.fontWhite, fontWeight: 600, fontSize: 18 }}>Services</Text>
  }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header showBackButton={true} backButtonText={headerText} />
            <ScrollView style={{flex:1}} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Select the Services</Text>
                {renderService()}
                {
                    !isLoading && <Text style={{ textAlign: "center", color: COLORS.fontWhite, fontWeight: 500 }} onPress={() => {
                        router.push("home")
                    }}>Skip for now</Text>
                }
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.primaryColor },
    scrollContent: { padding: 16, backgroundColor: COLORS.primaryColor },
    header: { marginBottom: 24 },
    greeting: { fontSize: 18, color: '#FFFFFF' },
    name: { color: '#FF9800', fontWeight: 'bold' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16 },
});

export default Service;
