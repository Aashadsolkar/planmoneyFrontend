import { createContext, useEffect, useRef, useState } from "react";
// ✅ REPLACED: AsyncStorage with SecureStore
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";

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
  const [serviceSelectedOnHomePage, setServiceSelectedOnHomePage] =
    useState(null);
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
  const [isQuestionerFillderByAdvisor, setIsQuestionerFillderByAdvisor] =
    useState(false);
  const [digiLockerRequestId, setDigiLockerRequestId] = useState(false);
  const [advertisement, setAdvertisement] = useState([]);
  const [isNewArrivalsNotOpen, setIsNewArrivalsNotOpen] = useState(true);

  const logoutTimer = useRef(null);
  useEffect(() => {
    const loadSession = async () => {
      try {
        // ✅ SECURE: Load both values in parallel using SecureStore
        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync("token"),
          SecureStore.getItemAsync("user"),
        ]);
     
        if (storedToken) {
          const isExpired = checkTokenExpiry(storedToken);
          if (isExpired) {
            console.log("🔴 Token expired on startup — logging out");
            // await logout();
            await clearSecureData();
          } else {
            let parsedUser = null;
            try {
              parsedUser = storedUser ? JSON.parse(storedUser) : null;
            } catch (err) {
              console.log("Error parsing stored user:", err);
            }
            setToken(storedToken);
            setUser(parsedUser);
            scheduleAutoLogout(storedToken);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to load session:", error);
        setLoading(false);
      }
    };
    loadSession();
    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, []);

  const checkTokenExpiry = (jwt) => {
    try {
      const decoded = jwtDecode(jwt);
      let exp = decoded.exp;

      if (exp > 10000000000) exp = Math.floor(exp / 1000);

      const currentTime = Date.now() / 1000;
      return exp < currentTime;
    } catch (err) {
      console.log("Token decode error:", err);
      return true;
    }
  };

  // ✅ Helper: Schedule auto logout
   const scheduleAutoLogout = (jwt) => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);

    try {
      const decoded = jwtDecode(jwt);
      let exp = decoded.exp;

      if (exp > 10000000000) exp = Math.floor(exp / 1000);

      const currentTime = Date.now() / 1000;
      const expiresIn = exp - currentTime;

      if (expiresIn > 0) {
        logoutTimer.current = setTimeout(() => {
          logout();
        }, expiresIn * 1000);
      }
    } catch {}
  };

  // ✅ UPDATED: SecureStore version
  const storeUserData = async (user, token) => {
    try {
      setToken(token);
      setUser(user);

      // ✅ SECURE: Store in parallel using SecureStore
      await Promise.all([
        SecureStore.setItemAsync("token", token),
        SecureStore.setItemAsync("user", JSON.stringify(user)),
      ]);
      scheduleAutoLogout(token);
    } catch (error) {
      console.error("Failed to store user data:", error);
      throw error;
    }
  };

  const clearSecureData = async () => {
    const keys = ["token", "user", "hasLaunched", "biometric_enabled", "refresh_token"];
    try {
      await Promise.all(keys.map((k) => SecureStore.deleteItemAsync(k)));
    } catch (err) {
      console.log("Error clearing storage:", err);
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
        // verifyOtp,
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
