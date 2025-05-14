import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import DOBInput from '../../components/DOBInput';
import SelectBox from '../../components/Select';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigation } from 'expo-router';
import TextAreaInput from '../../components/TextArea';

const Form1 = () => {
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [occupation, setOccupation] = useState("");
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

                    <Text style={{ fontSize: 25, fontWeight: 500, color: COLORS.fontWhite }}>Hey <Text style={{ color: COLORS.secondaryColor }}>Vignesh</Text></Text>
                    <Text style={{ marginTop: 5, color: COLORS.lightGray, fontSize: 12 }}>There are Few Details we need to know for
                        this process</Text>
                    <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 20 }}>Step <Text style={{ color: COLORS.secondaryColor }}>1</Text> to 6</Text>
                    <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite }}>Personal Details</Text>
                    <Text style={{ fontWeight: 600, color: COLORS.lightGray, marginTop: 20 }}>Date of Birth</Text>
                    <DOBInput />
                    <TextAreaInput
                        label={"Address"}
                        value={address}
                        onChangeText={(val) => setAddress(val)}

                    />
                    <Input
                        label={"City"}
                        value={city}
                        onChangeText={(val) => setCity(val)}
                    />
                    <Input
                        label={"State"}
                        value={state}
                        onChangeText={(val) => setState(val)}
                    />
                    <Input
                        label={"country"}
                        value={country}
                        onChangeText={(val) => setCountry(val)}
                    />
                    <Input
                        label={"Enter your Occupation"}
                        value={country}
                        onChangeText={(val) => setCountry(val)}
                    />
                    <Input
                        label={"Enter your Occupation"}
                        value={country}
                        onChangeText={(val) => setCountry(val)}
                    /><Input
                        label={"Enter your Occupation"}
                        value={country}
                        onChangeText={(val) => setCountry(val)}
                    /><Input
                        label={"Enter your Occupation"}
                        value={country}
                        onChangeText={(val) => setCountry(val)}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
            <Button onClick={() => navigation.navigate('form2')} label={"Next"} gradientColor={['#D36C32', '#F68F00']} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Form1;
