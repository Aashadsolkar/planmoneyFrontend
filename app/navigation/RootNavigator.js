// import React, { useEffect } from 'react';
// import { ActivityIndicator, StyleSheet, View } from 'react-native';
// import { useAuth } from '../context/useAuth';
// import AppNavigator from './AppNavigator';
// import AuthNavigator from './AuthNavigator';
// import { getProfileData } from '../utils/apiCaller';

// const RootNavigator = () => {
//     const { user, loading, token, setProfileData } = useAuth();
//     useEffect(() => {
//         const callProfileApi = async( )=> {
//             try {
//                 const response = await getProfileData(token);
//                 setProfileData(response?.data?.data);
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         if(token){
//             callProfileApi()
//         }
//     },[token])

//     if (loading) {
//         return (
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                 <ActivityIndicator size="large" />
//             </View>
//         );
//     }
//     return user ? <AppNavigator /> : <AuthNavigator />
// }

// export default RootNavigator;
