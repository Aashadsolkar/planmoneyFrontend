import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, util_style } from '../constants';

const Button = ({ label, gradientColor, buttonStye = {}, onClick, isLoading = false }) => {
    return (
        <TouchableOpacity
            style={{
                borderRadius: 50,
                ...util_style.darkShadow
            }}
            onPress={onClick}
            // disabled={isLoading}
        >
            <LinearGradient
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                colors={gradientColor}
                style={{ padding: 15, borderRadius: 50, ...buttonStye }}

            >
                {
                    isLoading ? <ActivityIndicator color={"#fff"} size="small" /> : <Text style={{ textAlign: "center", fontWeight: 500, fontSize: 15, color: COLORS.fontWhite }}>{label}</Text>
                }

            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

export default Button;
