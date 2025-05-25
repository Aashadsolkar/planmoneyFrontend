import React, { use, useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../context/useAuth';
import Header from '../components/Header';
import { COLORS } from '../constants';
import { service } from '../utils/apiCaller';
import { navigate } from 'expo-router/build/global-state/routing';
import { router, useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

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
    console.log("service render");

    const navigation = useNavigation();
    const [expandedService, setExpandedService] = useState();
    const [isLoading, setIsloading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const getServiceData = async () => {
                const serviceResponse = await service();
                console.log(serviceResponse);
                setIsloading(false)
                const services = serviceResponse?.data?.services;
                if (purchesService?.length > 0) {
                    const purchesServiceId = purchesService.map(item => item.id);
                    const filteredArray = services.filter(item => !purchesServiceId.includes(item.id));
                    setAllServices(filteredArray);
                } else {
                    setAllServices(services);
                }
            };

            getServiceData();

            if (serviceSelectedOnHomePage) {
                setExpandedService(serviceSelectedOnHomePage);
                setServiceSelectedOnHomePage(null);
            }

        }, [purchesService, serviceSelectedOnHomePage])
    );

    const toggleExpand = (name) => {
        setExpandedService(prev => (prev === name ? null : name));
    };

    const renderService = () => {
        if(isLoading){
            return <Text>Loading</Text>
        }
        return allServices.map((service) => {
            return (
                <ServiceCard
                    name={service.name}
                    icon="line-chart"
                    iconType="fa"
                    startsAt={service?.plans[0]?.actual_price}
                    isExpanded={expandedService === service.id}
                    onToggle={() => toggleExpand(service.id)}
                    plans={service?.plans}
                    showDetails
                    showSubscriptions
                    key={service.id}
                />
            )
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header
                showBackButton={true}
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Select the Services</Text>

                {
                    renderService()
                }
                <Text style={{ textAlign: "center", color: COLORS.fontWhite, fontWeight: 500 }} onPress={() => {
                    setSkipServices(true),
                        router.push("home")
                }}>Skip for now</Text>
                {/* <Text onPress={() => logout()}>Logout</Text> */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.primaryColor },
    scrollContent: { padding: 16, paddingTop: 80, },
    header: { marginBottom: 24 },
    greeting: { fontSize: 18, color: '#FFFFFF' },
    name: { color: '#FF9800', fontWeight: 'bold' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16 },
});

export default Service;
