import React from 'react';
import { StyleSheet, View } from 'react-native';
import RootNavigator from "./navigation/RootNavigator"
import AuthProvider from './auth/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

const RootLayout = () => {
    return (
        <AuthProvider>
            <PaperProvider>
                <RootNavigator />
            </PaperProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({})

export default RootLayout;
