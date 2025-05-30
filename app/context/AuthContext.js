import React, { createContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { customerService } from '../utils/apiCaller';
import { router } from 'expo-router';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState({});
  const [purchesService, setPurchesService] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [skipServices, setSkipServices] = useState(false);
  const [serviceSelectedOnHomePage, setServiceSelectedOnHomePage] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [orderConfirmDetails, setOrderCinfirmDetails] = useState({})
  const [questionFormData, setQuestionFormData] = useState(null)
  const [orderId, setOrderId] = useState(null);
  const [customerServiceData, setCustomerServiceData] = useState("")
  const [riskData, setRiskData] = useState("")
  const [reportData, setReportData] = useState({})
  const [isCustomerApiLoading, setIsCustomerApiLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser || {}));
      }
      setLoading(false);
    };

    loadSession();
  }, []);

  const storeUserData = async (user, token) => {
    setToken(token);
    setUser(user);
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
  };

  const verifyOtp = async (phone, otp) => {
    const { token, user } = { token: "1231231312asda", user: { name: "Aashad" } };
    setToken(token);
    setUser(user);
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
  };


  const logout = async () => {
    console.log("logout called")
    setToken(null);
    setUser(null);
    await AsyncStorage.clear();
  };

  const getCustomerServiceAPi = async () => {
    try {
      const response = await customerService(token)
      setCustomerServiceData(response?.data)
      console.log(response);
      const filterPurchesService = response?.data?.services?.filter((service) => service.is_subscribed)
      if (filterPurchesService.length > 0) {
        // if (response?.data?.kyc_status == 0) {
        //   router.replace("forms/kyc");
        // } else if (response?.data?.questionnaire_status == 0) {
        //   router.replace("forms/personalDetails");
        // }
        setPurchesService(filterPurchesService);
      } else {
        if (!skipServices) {
          router.push("service");
        }
      }
      setIsCustomerApiLoading(false);
    } catch (error) {
      console.log(error);
      setIsCustomerApiLoading(false)

    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      token, storeUserData,
      verifyOtp,
      logout,
      loading,
      setSelectedService,
      selectedService,
      setPurchesService,
      purchesService,
      setAllServices,
      allServices,
      skipServices,
      setSkipServices,
      serviceSelectedOnHomePage,
      setServiceSelectedOnHomePage,
      setProfileData,
      profileData,
      setOrderCinfirmDetails,
      orderConfirmDetails,
      questionFormData,
      setQuestionFormData,
      setOrderId,
      orderId,
      customerServiceData,
      setCustomerServiceData,
      riskData,
      setRiskData,
      setReportData,
      reportData,
      isCustomerApiLoading,
      getCustomerServiceAPi
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider

