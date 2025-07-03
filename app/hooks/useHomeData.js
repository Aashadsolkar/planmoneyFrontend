import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { getProfileData, customerService, news, optionstocks } from '../utils/apiCaller'; // adjust path as needed
import { useAuth } from '../context/useAuth'; // adjust path as needed
import { useRouter } from 'expo-router';

export const useHomeData = () => {
    const {
        token,
        setProfileData,
        setCustomerServiceData,
        setPortfolioServices,
        setPurchesService,
        setGetCustomerDataAgain,
        getCustomerDataAgain,
        skipQuestioniar,
        skipServices,
        newsData,
        setNewsData,
        setOptionStockData,
        setIsProfileLoading,
        setIsQuestionerFillderByAdvisor
    } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchData = useCallback(async (forceCall = false) => {
        if ((token && getCustomerDataAgain) || forceCall) {
            setIsLoading(true);
            try {
                await fetchNews();
                await fetchCustomerServices();
                await fetchOptionStockData();
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setIsLoading(false);
                setRefreshing(false);
                setGetCustomerDataAgain(false);
            }
        }
    }, [token, getCustomerDataAgain]);

    const fetchProfile = async () => {
        try {
            setIsProfileLoading(true);
            const response = await getProfileData(token);
            setProfileData(response?.data?.data);
            setIsProfileLoading(false)
        } catch (error) {
            setIsProfileLoading(false)
            Alert.alert("Error", error?.message || "Failed to get profile data", [
                { text: "OK", onPress: () => router.push("home") },
            ]);
        }
    };

    const fetchCustomerServices = async () => {
        try {

            // get profile data
            setIsProfileLoading(true);
            const profileResponse = await getProfileData(token);
            setProfileData(profileResponse?.data?.data);
            setIsProfileLoading(false)

            // get customer details data
            const response = await customerService(token);
            const services = response?.data?.services || [];
            setCustomerServiceData(response?.data);

            const purchased = services.filter(s => s.is_subscribed);
            const filteredData = purchased.filter(item => item.id !== 5);
            if (filteredData.length > 0) {
                setPurchesService(filteredData);
                const portfolio = filteredData.filter(service =>
                    ["Portfolio Management Subscription", "QuantumVault (For Above ₹50 lakh Capital)", "Personalised Investment Services"]
                        .includes(service.name)
                );
                setPortfolioServices(portfolio);
                if (response?.data?.kyc_status === 0 && portfolio.length > 0) {
                    router.push("forms/kyc");
                    return;
                }
                if (profileResponse?.data?.data?.customerfinanceinfo?.verified == 2) {
                    setIsQuestionerFillderByAdvisor(true);
                    return;
                }
                if (!skipQuestioniar && response?.data?.questionnaire_status === 0) {
                    router.push("forms/personalDetails");
                    return;
                }
            } else if (filteredData.length === 0 && !skipServices) {
                if (profileResponse?.data?.data?.customerfinanceinfo?.verified == 2) {
                    setIsQuestionerFillderByAdvisor(true);
                    return;
                }
                router.push("service");
            }


        } catch (error) {
            setIsProfileLoading(false);
            Alert.alert("Error", error?.message || "Failed to get customer data", [
                { text: "OK", onPress: () => router.push("home") },
            ]);
        }
    };

    const fetchNews = async () => {
        try {
            const response = await news(token);
            setNewsData(response?.data?.latest_news || []);
        } catch (error) {
            Alert.alert("Error", error?.message || "Failed to get news", [
                { text: "OK", onPress: () => router.push("home") },
            ]);
        }
    };

    const fetchOptionStockData = async () => {
        try {
            const response = await optionstocks(token);
            setOptionStockData(response?.data?.optionStock || []);
        } catch (error) {
            Alert.alert("Error", error?.message || "Failed to get news", [
                { text: "OK", onPress: () => router.push("home") },
            ]);
        }
    };


    const onRefresh = () => {
        setRefreshing(true);
        fetchData(true);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        newsData,
        isLoading,
        refreshing,
        onRefresh,
    };
};
