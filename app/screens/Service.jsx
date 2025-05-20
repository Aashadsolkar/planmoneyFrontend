import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../auth/useAuth';
import Header from '../components/Header';
import { COLORS } from '../constants';
import { service } from '../utils/apiCaller';
import { navigate } from 'expo-router/build/global-state/routing';
import { useNavigation } from 'expo-router';
import Tabs from '../components/Tabs';

const Service = () => {
    const {
        logout,
        setAllServices,
        allServices,
        setSkipServices,
        serviceSelectedOnHomePage,
        setServiceSelectedOnHomePage
    } = useAuth();
    const navigation = useNavigation();
    const [expandedService, setExpandedService] = useState();

    useEffect(() => {
        const getServiceData = async () => {
            const serviceResponse = await service();
            setAllServices(serviceResponse?.data?.services);
        }
        getServiceData()
        if (serviceSelectedOnHomePage) {
            setExpandedService(serviceSelectedOnHomePage);
            setServiceSelectedOnHomePage(null);
        }
    }, [])

    const toggleExpand = (name) => {
        setExpandedService(prev => (prev === name ? null : name));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header
                title="Hi Vignesh"
                showBackButton={false}
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Select the Services</Text>

                {
                    allServices.map((service) => {
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
                <Text style={{ textAlign: "center", color: COLORS.fontWhite, fontWeight: 500 }} onPress={() => {
                    setSkipServices(true),
                        navigation.navigate("home")
                }}>Skip for now</Text>
                {/* <Text onPress={() => logout()}>Logout</Text> */}
            </ScrollView>
            <Tabs />
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
