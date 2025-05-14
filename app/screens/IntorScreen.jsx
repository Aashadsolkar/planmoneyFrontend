import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View, Dimensions } from 'react-native';
import FloatingLabelInput from '../components/FloatingLabelInput';
import PasswordInput from '../components/PasswordInput ';
import Button from '../components/Button';
import { useNavigation } from 'expo-router';
import { COLORS } from '../constants';

const { height, width } = Dimensions.get('window');

const IntorScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topSection}>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Image
                    source={require('../../assets/images/staticChart.png')}
                    style={styles.chart}
                    resizeMode="contain"
                />
                <View style={styles.textWrapper}>
                    <Text style={styles.heading}>Best Analysis of Equity</Text>
                    <Text style={styles.subHeading}>
                        Stock Suggestions with Expert Insights with Analysis Report
                    </Text>
                </View>
            </View>

            <View style={styles.bottomSection}>
                <Text style={styles.getStarted}>Get Started</Text>
                <Button
                    onClick={() => navigation.navigate('login')}
                    label={"SIGN IN"}
                    gradientColor={COLORS.orangeGradiantColor}
                />
                <Button
                    onClick={() => navigation.navigate('registor')}
                    buttonStye={{ marginTop: 10 }}
                    label={"JOIN NOW"}
                    gradientColor={COLORS.blueGradiantColor}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryColor
    },
    topSection: {
        flex: 2,
        alignItems: "center",
        paddingTop: height * 0.01,
    },
    logo: {
        height: height * 0.1,
        width: width * 0.4,
        marginBottom: height * 0.05
    },
    chart: {
        height: height * 0.23,
        marginBottom: height * 0.0001
    },
    textWrapper: {
        alignItems: "center",
        paddingHorizontal: 20
    },
    heading: {
        fontSize: 30,
        color: COLORS.fontWhite,
        textAlign: "center",
        fontWeight: '600'
    },
    subHeading: {
        color: COLORS.lightGray,
        fontSize: 13,
        textAlign: "center",
        marginTop: 10,
        width: 250
    },
    bottomSection: {
        flex: .8,
        backgroundColor: COLORS.cardColor,
        paddingHorizontal: 20,
        paddingVertical: 25,
        justifyContent: "center"
    },
    getStarted: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.fontWhite,
        textAlign: "center",
        marginBottom: 30
    }
});

export default IntorScreen;
