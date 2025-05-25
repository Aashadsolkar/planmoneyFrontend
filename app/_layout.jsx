import React from 'react';
import { StyleSheet, View } from 'react-native';
import RootNavigator from "./navigation/RootNavigator"
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Slot } from 'expo-router';
import AuthProvider from './context/AuthContext';

const RootLayout = () => {
    return (
        <AuthProvider>
            <PaperProvider>
                <Slot/>
            </PaperProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({})

export default RootLayout;
