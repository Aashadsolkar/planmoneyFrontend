import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import SelectBox from '../../components/Select';
import Button from '../../components/Button';
import { useNavigation } from 'expo-router';

const For3 = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor, padding: 20 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 1 : 40}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 20 }}>Step <Text style={{ color: COLORS.secondaryColor }}>3</Text> to 6</Text>
                    <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite }}>Investment Objectives & 
                    Preferences</Text>
                    <SelectBox options={[1,2,34,]} label={"Planned Investment Horizon"} placeHolder={"Select Planned Investment Horizon"}/>
                </ScrollView>
            </KeyboardAvoidingView>
            <Button onClick={() => navigation.navigate('form3')} label={"Next"} gradientColor={['#D36C32', '#F68F00']} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default For3;
