import React, { createContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
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
  const [skipQuestioniar, setSkipQuestioniar] = useState(false);
  const [serviceSelectedOnHomePage, setServiceSelectedOnHomePage] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [orderConfirmDetails, setOrderCinfirmDetails] = useState({})
  const [questionFormData, setQuestionFormData] = useState(null)
  const [prePaymentDetails, setPrePaymentDetails] = useState(null);
  const [customerServiceData, setCustomerServiceData] = useState("")
  const [riskData, setRiskData] = useState("")
  const [reportData, setReportData] = useState({})
  const [portfolioServices, setPortfolioServices] = useState([])
  const [getCustomerDataAgain, setGetCustomerDataAgain] = useState(true);
  const [newsData, setNewsData] = useState([]);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

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
    setToken(null);
    setUser(null);
    setSkipServices(false);
    setSkipQuestioniar(false);
    setServiceSelectedOnHomePage(null);
    setProfileData({});
    setOrderCinfirmDetails({});
    setQuestionFormData(null);
    setPrePaymentDetails(null);
    setCustomerServiceData("");
    setRiskData("")
    setPortfolioServices([]);
    setReportData({})
    setPurchesService([]);
    setSelectedService([]);
    setAllServices([]);
    setGetCustomerDataAgain(true)
    router.push("login")
    await AsyncStorage.clear();
  };

 

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
      setPrePaymentDetails,
      prePaymentDetails,
      customerServiceData,
      setCustomerServiceData,
      riskData,
      setRiskData,
      setReportData,
      reportData,
      setSkipQuestioniar,
      skipQuestioniar,
      portfolioServices,
      setGetCustomerDataAgain,
      getCustomerDataAgain,
      setPortfolioServices,
      setNewsData,
      newsData,
      isProfileLoading,
      setIsProfileLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider

