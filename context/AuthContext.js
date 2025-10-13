import { createContext, useEffect, useState } from "react";
// ✅ REPLACED: AsyncStorage with SecureStore
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";

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
  const [orderConfirmDetails, setOrderCinfirmDetails] = useState({});
  const [questionFormData, setQuestionFormData] = useState(null);
  const [prePaymentDetails, setPrePaymentDetails] = useState(null);
  const [customerServiceData, setCustomerServiceData] = useState("");
  const [riskData, setRiskData] = useState("");
  const [reportData, setReportData] = useState({});
  const [portfolioServices, setPortfolioServices] = useState([]);
  const [getCustomerDataAgain, setGetCustomerDataAgain] = useState(true);
  const [newsData, setNewsData] = useState([]);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [newArrivalsDetails, setNewArrivalsDetails] = useState([]);
  const [optionStockData, setOptionStockData] = useState([]);
  const [isQuestionerFillderByAdvisor, setIsQuestionerFillderByAdvisor] = useState(false);
  const [digiLockerRequestId, setDigiLockerRequestId] = useState(false);
  const [advertisement, setAdvertisement] = useState([]);
  const [isNewArrivalsNotOpen, setIsNewArrivalsNotOpen] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // ✅ UPDATED: SecureStore version with same logic
    const loadSession = async () => {
      try {
        // ✅ SECURE: Load both values in parallel using SecureStore
        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync("token"),
          SecureStore.getItemAsync("user"),
        ]);

        // ✅ SAME: Only update state if component is still mounted
        if (isMounted) {
          if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to load auth session", e);
        // ✅ SAME: Safe state update
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ UPDATED: SecureStore version
  const storeUserData = async (user, token) => {
    try {
      setToken(token);
      setUser(user);
      
      // ✅ SECURE: Store in parallel using SecureStore
      await Promise.all([
        SecureStore.setItemAsync("token", token),
        SecureStore.setItemAsync("user", JSON.stringify(user))
      ]);
    } catch (error) {
      console.error("Failed to store user data:", error);
      throw error;
    }
  };

  // ✅ UPDATED: SecureStore version  
  const verifyOtp = async (phone, otp) => {
    const { token, user } = {
      token: "1231231312asda",
      user: { name: "Aashad" },
    };
    
    try {
      setToken(token);
      setUser(user);
      
      // ✅ SECURE: Store in parallel using SecureStore
      await Promise.all([
        SecureStore.setItemAsync("token", token),
        SecureStore.setItemAsync("user", JSON.stringify(user))
      ]);
    } catch (error) {
      console.error("Failed to store verification data:", error);
      throw error;
    }
  };

  // ✅ UPDATED: SecureStore version with individual key deletion
  const logout = async () => {
    // ✅ SAME: Reset all state variables
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
    setRiskData("");
    setPortfolioServices([]);
    setReportData({});
    setPurchesService([]);
    setSelectedService([]);
    setAllServices([]);
    setGetCustomerDataAgain(true);
    
    try {
      // ✅ SECURE: Clear SecureStore data (no clear() method, so delete individually)
      const keysToDelete = [
        "token",
        "user",
        "hasLaunched",
        "biometric_enabled",
        "refresh_token",
        // Add any other keys your app uses
      ];

      await Promise.all(
        keysToDelete.map(async (key) => {
          try {
            await SecureStore.deleteItemAsync(key);
          } catch (e) {
            // Key might not exist, that's OK
            console.warn(`Failed to delete key ${key}:`, e);
          }
        })
      );
      
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // ✅ SAME: Force navigation even if storage clear fails
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        storeUserData,
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
        setIsProfileLoading,
        newArrivalsDetails,
        setNewArrivalsDetails,
        setOptionStockData,
        optionStockData,
        setIsQuestionerFillderByAdvisor,
        isQuestionerFillderByAdvisor,
        setDigiLockerRequestId,
        digiLockerRequestId,
        setAdvertisement,
        advertisement,
        isNewArrivalsNotOpen,
        setIsNewArrivalsNotOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
