import React, { use, useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../context/useAuth';
import Header from '../components/Header';
import { COLORS } from '../constants';
import { service } from '../utils/apiCaller';
import { router, useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import SkeletonList from '../components/ListSkeleton';
import { QuantomVoltIcon, FastlaneIcon, PMSIcon, PSIcon, PISIcon } from '../../assets/images/SVG';

const icon = {
    1: () => <FastlaneIcon height={33} width={33} />,
    2: () => <PISIcon height={33} width={33} />,
    3: () => <PMSIcon height={33} width={33} />,
    4: () => <QuantomVoltIcon height={33} width={33} />,
    6: () => <PSIcon height={33} width={33} />
}

const Service = () => {
    const {
        logout,
        setAllServices,
        allServices,
        setSkipServices,
        serviceSelectedOnHomePage,
        setServiceSelectedOnHomePage,
        purchesService,
    } = useAuth();

    const navigation = useNavigation();
    const [expandedService, setExpandedService] = useState();
    const [isLoading, setIsloading] = useState(true);
    const [purchesAllserviceFlag, setPurchesAllserviceFlag] = useState(false);


    useEffect(() => {
        const targetIds = [1, 2, 3, 4, 6];

        // Get all ids from the data
        const dataIds = purchesService.map(item => item.id);

        // Check if every target ID is included in data
        const allIncluded = targetIds.every(id => dataIds.includes(id));
        setPurchesAllserviceFlag(allIncluded)
    }, [purchesService])

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
                        let tempObj = {};
                        const purchesServiceId = purchesService.map(item => item.id);
                        purchesService.forEach(element => tempObj[element?.id] = element);

                        const filteredArray = services.map(item => {
                            const isPurchased = purchesServiceId.includes(item.id);
                            const subscription = tempObj?.[item.id]?.subscription;

                            return {
                                ...item,
                                purchesed: isPurchased,
                                advisor_nummber: isPurchased ? subscription?.advisor?.phone || null : null,
                                advisor_name: isPurchased ? subscription?.advisor?.name || null : null,
                                is_advisor_assign: isPurchased ? subscription?.is_advisor_assign ?? false : false
                            };
                        });
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
                    isPurchesed={service?.purchesed ?? false}
                    is_advisor_assign={service?.is_advisor_assign ?? false}
                    advisor_number={service?.advisor_number ?? ""}
                    advisor_name={service?.advisor_name ?? ""}
                />
            )
        })
    }

    const headerText = () => {
        return <Text style={{ color: COLORS.fontWhite, fontWeight: 600, fontSize: 18 }}>Services</Text>
    }

    const renderServiceList = () => {
        if (purchesAllserviceFlag) return (
            <View style={{ flex: 1, justifyContent: "center", }}>
                <Text style={{ color: COLORS.fontWhite, marginHorizontal: 20, marginTop: 20, fontSize: 20, fontWeight: "bold", textAlign: "center" }}>You’ve subscribed to all our available services. Thank you for being a valued customer!</Text>
            </View>
        )
        return (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Select the Services</Text>
                {renderService()}
                {
                    !isLoading && <TouchableOpacity onPress={() => router.push("home")}>
                        <Text style={{ textAlign: "center", color: COLORS.fontWhite, fontWeight: 500 }} >Skip for now</Text>
                    </TouchableOpacity>
                }
            </ScrollView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header showBackButton={true} backButtonText={headerText} />
            {renderServiceList()}
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
