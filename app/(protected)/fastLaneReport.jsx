import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from '../../constants.js';
import { getFastlaneData } from '@utils/apiCaller';
import { useAuth } from '@context/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import Header from '@components/Header';
import Button from '@components/Button';
import RenderHTML from 'react-native-render-html';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

const FastLane = () => {
    const { reportData } = useAuth();
    const { serviceData, serviceID } = reportData;
    const [webViewHeight, setWebViewHeight] = useState(500);


    const { width } = useWindowDimensions();
    const renderCardList = (data) => {
        return (
            <View style={styles.card} key={data?.id}>
                <View style={styles.cardSections}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.lightText}>Entry Level</Text>
                        <Text style={styles.boldText}>₹{data?.buy_price}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.lightText}>Duration</Text>
                        <Text style={styles.boldText}>{data?.holding_period} days</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.lightText}>Upside</Text>
                        <Text style={[styles.boldText, styles.greenText]}>{data?.upside}%</Text>
                    </View>
                </View>
                <View style={[styles.cardSections, { borderBottomColor: COLORS.secondaryColor }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.lightText}>Stop Loss</Text>
                        <Text style={[styles.boldText, styles.redText, styles.font12]}>₹{data?.stop_loss_price}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.lightText}>Target</Text>
                        <Text style={[styles.boldText, styles.greenText, styles.font12]}>₹{data?.target_price}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {/* <Text style={styles.lightText}>Target 2</Text>
                        <Text style={[styles.boldText, styles.greenText, styles.font12]}>₹{data?.target_2}</Text> */}
                    </View>

                </View>
            </View>
        )
    };

    const getServiceName = (id) => {

        let serviceName = "";
        switch (id) {
            case "1":
                return serviceName = "Fastlane"
                break;
            case "2":
                return serviceName = "PIS"
                break;
            case "3":
                return serviceName = "Portfolio Management"
                break;
            case "4":
                return serviceName = "Quantum Volt"
                break;
            case "6":
                return serviceName = "Premium Research"
                break;
            default:
                return serviceName = "Service Name"
                break;
        }
    }

    const backButtonText = () => {
        return (
            <>
                <Text style={{ color: COLORS.fontWhite, fontSize: 18, fontWeight: 600 }}>{getServiceName(serviceID)}</Text>
                {/* {serviceData?.cmp && <Text style={{ color: COLORS.fontWhite, fontSize: 12, fontWeight: 400 }}>CMP ₹{serviceData?.cmp}</Text>} */}
            </>
        )
    }

    return (
        <SafeAreaView edges={[]} style={{ flex: 1, backgroundColor: COLORS.cardColor }}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
            <Header
                backButtonText={backButtonText}
                showBackButton={true}
            />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 20, paddingTop: 20, backgroundColor: COLORS.primaryColor }}
            >
                {renderCardList(serviceData)}



                <WebView
                    originWhitelist={['*']}
                    source={{
                        html: `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
           <style>
            body { margin: 0; padding: 10px; color: ${COLORS.fontWhite}; font-size: 14px; }

            /* 🔥 Responsive image fix */
            img {
              max-width: 100%;
              width: 100%;
              height: auto;
              object-fit: contain;
            }
            
            p{
              line-height: 20px
            }

            table {
              width: 100% !important;
            }

            * {
              box-sizing: border-box;
            }
          </style>
          <script>
            function sendHeight() {
              const height = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
              );
              window.ReactNativeWebView.postMessage(height);
            }
            
            window.addEventListener('load', sendHeight);
            window.addEventListener('resize', sendHeight);

            // Recalculate every 300ms for async content
            setInterval(sendHeight, 300);
          </script>
        </head>
        <body>
          ${serviceData.report}
        </body>
      </html>
    `
                    }}
                    javaScriptEnabled={true}
                    onMessage={(e) => {
                        const height = Number(e.nativeEvent.data);
                        if (height > 0) setWebViewHeight(height + 20);
                    }}
                    style={{ height: webViewHeight, backgroundColor: COLORS.primaryColor }}
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
        marginBottom: 20,
        boxShadow: COLORS.boxShadow,
    },
    cardSections: {
        padding: 15,
        borderBottomWidth: .5,
        borderBottomColor: COLORS.secondaryColor,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    lightText: {
        fontSize: 16,
        fontWeight: 400,
        color: COLORS.lightGray
    },
    boldText: {
        color: COLORS.fontWhite,
        fontWeight: 700,
        fontSize: 16
    },
    greenText: {
        color: "#4BDE9F"
    },
    redText: {
        color: "#F85255"
    },
})

export default FastLane;
