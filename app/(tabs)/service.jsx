import React, { use, useCallback, useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceCard from '@components/ServiceCard';
import { useAuth } from '@context/useAuth';
import Header from '@components/Header';
import { COLORS } from '../../constants.js';
import { service } from '@utils/apiCaller';
import { router, useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import SkeletonList from '@components/ListSkeleton';
import { QuantomVoltIcon, FastlaneIcon, PMSIcon, PSIcon, PISIcon } from '../../assets/images/SVG';
import { showToast } from "@components/CustomToast/ToastService";
import Foundation from "@expo/vector-icons/Foundation";

const STATIC_SERVICES = [
    {
        id: 101,
        name: "Unlisted Shares",
        isStatic: true,
    },
    {
        id: 102,
        name: "Bonds",
        isStatic: true,
    },
];


const icon = {
    1: () => <FastlaneIcon height={33} width={33} />,
    2: () => <PISIcon height={33} width={33} />,
    3: () => <PMSIcon height={33} width={33} />,
    4: () => <QuantomVoltIcon height={33} width={33} />,
    5: () => <Foundation
        name="burst-new"
        size={50}
        style={{ transform: [{ rotate: "30deg" }] }}
        color={COLORS.secondaryIconColor}
    />,
    6: () => <PSIcon height={40} width={40} />,
    101: () => <Foundation name="graph-trend" size={32} color={COLORS.secondaryIconColor} />,
    102: () => <Foundation name="shield" size={32} color={COLORS.secondaryIconColor} />
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
    const removeIds = [];


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
                        const filteredData = filteredArray.filter(item => !removeIds.includes(item.id));
                        setAllServices(filteredData);
                    } else {
                        const filteredData = services.filter(item => !removeIds.includes(item.id));
                        setAllServices(filteredData);
                    }
                } catch (error) {
                    setIsloading(false)
                    showToast({
                        type: "error",
                        title: `Something went wrong! 😥`,
                        message: `${error?.message || "Failed to get service data"}`,
                        redirectPath: "home",
                    });
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
            return (
                <>
                    <SkeletonList />
                    <SkeletonList />
                    <SkeletonList />
                    <SkeletonList />
                </>
            );
        }

        return (
            <>
                {/* 🔹 API SERVICES */}
                {allServices.map((service) => {
                    if (service?.plans?.length > 0) {
                        return (
                            <ServiceCard
                                key={service.id}
                                name={service.name}
                                isExpanded={expandedService === service.id}
                                onToggle={() => toggleExpand(service.id)}
                                plans={service.plans}
                                showDetails={![5, 6].includes(service.id)}   // ✅ yahi logic
                                showSubscriptions
                                serviceId={service.id}
                                icon={icon[service.id]}
                                isPurchesed={service?.purchesed ?? false}
                                is_advisor_assign={service?.is_advisor_assign ?? false}
                                advisor_number={service?.advisor_number ?? ""}
                                advisor_name={service?.advisor_name ?? ""}
                            />
                        );
                    }
                    return null;
                })}

                {/* 🔥 STATIC SERVICES (NO PLANS) */}
                {STATIC_SERVICES.map((service) => (
                    <ServiceCard
                        key={service.id}
                        name={service.name}
                        serviceId={service.id}
                        icon={icon[service.id]}
                        showDetails={false}
                        showSubscriptions={false}
                        plans={[]} // ⬅️ IMPORTANT
                        isPurchesed={true} // ⬅️ taaki "Open" button aaye
                    />
                ))}
            </>
        );
    };

    const headerText = () => {
        return <Text allowFontScaling={false} style={{ color: COLORS.secondaryColor, fontWeight: 600, fontSize: 18 }}>Services</Text>
    }

    const renderServiceList = () => {
        return (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
                <Text allowFontScaling={false} style={styles.sectionTitle}>Select the Services</Text>
                {renderService()}
                {
                    !isLoading && <TouchableOpacity onPress={() => router.push("home")}>
                        <Text allowFontScaling={false} style={{ textAlign: "center", color: COLORS.fontWhite, fontWeight: 500 }} >Skip for now</Text>
                    </TouchableOpacity>
                }
            </ScrollView>
        )
    }

    return (
        <SafeAreaView edges={[]} style={styles.container}>
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
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.secondaryColor, marginBottom: 16 },
});

export default Service;
