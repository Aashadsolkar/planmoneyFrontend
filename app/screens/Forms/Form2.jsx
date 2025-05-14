import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import DOBInput from '../../components/DOBInput';
import SelectBox from '../../components/Select';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigation } from 'expo-router';

const Form2 = () => {
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
                    <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 20 }}>Step <Text style={{ color: COLORS.secondaryColor }}>2</Text> to 6</Text>
                    <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite }}>Income & Earnings Profile</Text>
                    <SelectBox options={[1,2,34,]} label={"Primary Source of Income"} placeHolder={"Select Source of Income"}/>
                    <SelectBox options={[1,2,34,]} label={"Annual Gross Income"} placeHolder={"Select Annual Gross Income"}/>
                </ScrollView>
            </KeyboardAvoidingView>
            <Button onClick={() => navigation.navigate('form3')} label={"Next"} gradientColor={['#D36C32', '#F68F00']} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Form2;
