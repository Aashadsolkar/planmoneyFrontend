import { View, Text, useWindowDimensions, ScrollView } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'
import RenderHTML from 'react-native-render-html';
import { COLORS } from '../constants';
import { useLocalSearchParams } from 'expo-router';
import Header from '@components/Header';

const NewArrivalPDF = () => {
    const { width } = useWindowDimensions();
    const { report } = useLocalSearchParams();
    const backButtonText = () => {
            return (
                <Text style={{ color: COLORS.fontWhite, fontSize: 18, fontWeight: 600 }}>PDF</Text>
            )
        }
        
    return (
        <SafeAreaView edges={[]} style={{flex: 1, backgroundColor: COLORS.primaryColor}}>
            <Header showBackButton={true} backButtonText={backButtonText}/>
            <ScrollView style={{padding: 20}}>
                <RenderHTML
                    contentWidth={width}
                    source={{ html: report }}
                    baseStyle={{ color: COLORS.fontWhite, fontSize: 14 }}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default NewArrivalPDF