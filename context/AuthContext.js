import { createContext, useEffect, useState, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // -------------------------------
  // States (kept same names as yours)
  // -------------------------------
  const [user, setUser] = useState(null); // ✅ use null (not undefined) for consistency
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState({});
  const [purchesService, setPurchesService] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [skipServices, setSkipServices] = useState(false);
  const [skipQuestioniar, setSkipQuestioniar] = useState(false);
  const [serviceSelectedOnHomePage, setServiceSelectedOnHomePage] =
    useState(null);
  const [profileData, setProfileData] = useState({});
  const [orderConfirmDetails, setOrderCinfirmDetails] = useState({}); // ⚠️ kept your original setter name
  const [questionFormData, setQuestionFormData] = useState(null);
  const [prePaymentDetails, setPrePaymentDetails] = useState(null);
  const [customerServiceData, setCustomerServiceData] = useState(null); // ✅ safer than ""
  const [riskData, setRiskData] = useState(null); // ✅ safer than ""
  const [reportData, setReportData] = useState({});
  const [portfolioServices, setPortfolioServices] = useState([]);
  const [getCustomerDataAgain, setGetCustomerDataAgain] = useState(true);
  const [newsData, setNewsData] = useState([]);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [newArrivalsDetails, setNewArrivalsDetails] = useState([]);
  const [optionStockData, setOptionStockData] = useState([]);
  const [isQuestionerFillderByAdvisor, setIsQuestionerFillderByAdvisor] =
    useState(false);
  const [digiLockerRequestId, setDigiLockerRequestId] = useState(null); // ✅ better default than false
  const [advertisement, setAdvertisement] = useState([]);
  const [isNewArrivalsNotOpen, setIsNewArrivalsNotOpen] = useState(true);

  // -------------------------------
  // Load saved session on app start
  // -------------------------------
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        // ✅ make sure not to load "null" string or corrupted data
        if (storedToken && storedUser && storedUser !== "null") {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (e) {
        console.error("Failed to load auth session", e);
        // ✅ clear only auth keys if something goes wrong
        await AsyncStorage.multiRemove(["token", "user"]);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false); // ✅ always stop loader
      }
    };

    loadSession();
  }, []);

  // -------------------------------
  // Store user data after login
  // -------------------------------
  const storeUserData = async (user, token) => {
    try {
      setToken(token);
      setUser(user);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
      console.error("Failed to store user data", e);
    }
  };


  // -------------------------------
  // Logout user
  // -------------------------------
  const logout = async () => {
    try {
      setToken(null);
      setUser(null);
      setSkipServices(false);
      setSkipQuestioniar(false);
      setServiceSelectedOnHomePage(null);
      setProfileData({});
      setOrderCinfirmDetails({});
      setQuestionFormData(null);
      setPrePaymentDetails(null);
      setCustomerServiceData(null);
      setRiskData(null);
      setPortfolioServices([]);
      setReportData({});
      setPurchesService([]);
      setSelectedService({}); // ✅ match initial type (object, not array)
      setAllServices([]);
      setGetCustomerDataAgain(true);

      // ✅ clear only required keys (not everything)
      await AsyncStorage.multiRemove(["token", "user"]);

      router.push("login");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  // -------------------------------
  // Memoized context value
  // -------------------------------
  const value = useMemo(
    () => ({
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
      setOrderCinfirmDetails, // ⚠️ keeping same name you used
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
    }),
    [
      user,
      token,
      loading,
      selectedService,
      purchesService,
      allServices,
      skipServices,
      serviceSelectedOnHomePage,
      profileData,
      orderConfirmDetails,
      questionFormData,
      prePaymentDetails,
      customerServiceData,
      riskData,
      reportData,
      skipQuestioniar,
      portfolioServices,
      getCustomerDataAgain,
      newsData,
      isProfileLoading,
      newArrivalsDetails,
      optionStockData,
      isQuestionerFillderByAdvisor,
      digiLockerRequestId,
      advertisement,
      isNewArrivalsNotOpen,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
