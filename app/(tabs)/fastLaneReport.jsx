import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { COLORS } from '../constants';
import { getFastlaneData } from '../utils/apiCaller';
import { useAuth } from '../context/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import Header from '../components/Header';
import Button from '../components/Button';
import RenderHTML from 'react-native-render-html';

const FastLane = () => {
    const { reportData } = useAuth();
    const { width } = useWindowDimensions();
    const renderCardList = (data) => {
        return (
            <View style={styles.card} key={data?.id}>
                <View style={styles.cardSections}>
                    <View>
                        <Text style={styles.lightText}>Buy Price</Text>
                        <Text style={styles.boldText}>₹{data?.buy_price}</Text>
                    </View>
                    <View>
                        <Text style={styles.lightText}>Holding Period</Text>
                        <Text style={styles.boldText}>{data?.holding_period} days</Text>
                    </View>
                    <View>
                        <Text style={styles.lightText}>Valid till</Text>
                        <Text style={styles.boldText}>{data?.valid_till}</Text>
                    </View>
                    <View>
                        <Text style={styles.lightText}>Upside</Text>
                        <Text style={[styles.boldText, styles.greenText]}>{data?.upside}%</Text>
                    </View>
                </View>
                <View style={[styles.cardSections, { borderBottomColor: COLORS.cardColor }]}>
                    <View>
                        <Text style={styles.lightText}>Stop Loss</Text>
                        <Text style={[styles.boldText, styles.redText, styles.font12]}>₹{data?.stop_loss_price}</Text>
                    </View>
                    <View>
                        <Text style={styles.lightText}>Target 1</Text>
                        <Text style={[styles.boldText, styles.greenText, styles.font12]}>₹{data?.target_1}</Text>
                    </View>
                    <View>
                        <Text style={styles.lightText}>Target 2</Text>
                        <Text style={[styles.boldText, styles.greenText, styles.font12]}>₹{data?.target_2}</Text>
                    </View>

                </View>
            </View>
        )
    };

    const backButtonText =() =>{
            return (
                <>
                <Text style={{color: COLORS.fontWhite, fontSize: 18, fontWeight: 600}}>FastLane</Text>
                <Text style={{color: COLORS.fontWhite, fontSize: 12, fontWeight: 400}}>CMP ₹{reportData?.cmp}</Text>
                </>
            )
        } 

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor, padding: 20 }}>
            <Header
                backButtonText={backButtonText}
                showBackButton={true}
            />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 20, marginTop: 80 }}
            >
                {renderCardList(reportData)}

                <RenderHTML
                    contentWidth={width}
                    source={{ html: reportData.report }}
                    baseStyle={{ color: COLORS.fontWhite, fontSize: 14 }}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 16,
        color: COLORS.fontWhite,
        fontWeight: 600,
        marginBottom: 10
    },
    card: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: COLORS.cardColor,
        marginBottom: 20
    },
    cardSections: {
        padding: 15,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primaryColor,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    lightText: {
        fontSize: 10,
        fontWeight: 400,
        color: COLORS.lightGray
    },
    boldText: {
        color: COLORS.fontWhite,
        fontWeight: 700,
        fontSize: 10
    },
    greenText: {
        color: "#4BDE9F"
    },
    redText: {
        color: "#F85255"
    },
    font12: {
        fontSize: 12
    }
})

export default FastLane;
