import React, { createContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState({});
  const [purchesService, setPurchesService] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [skipServices, setSkipServices]= useState(false);
  const [serviceSelectedOnHomePage, setServiceSelectedOnHomePage] = useState(null);
  const [profileData, setProfileData] = useState({})

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
      profileData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider

