import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';
import { useAuth } from '../context/useAuth';
import PassWordInput from '../components/Password';
import Input from '../components/Input';
import Button from '../components/Button';
import { validateField, validateForm } from '../utils/validator';
import { login } from '../utils/apiCaller';

const { height, width } = Dimensions.get('window');

// Regex helpers
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[6-9]\d{9}$/;

const getUserType = (input) => {
    if (emailRegex.test(input)) return 'email';
    if (mobileRegex.test(input)) return 'mobile';
    return 'invalid';
};

const Login = () => {
    const [formData, setFormData] = useState({
        email_or_phone: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [loginApiError, setLoginApiError] = useState("")
    const [isLoading, setIsLoading] = useState("")

    const navigation = useNavigation();
    const { storeUserData } = useAuth();

    const handleChange = (value, name) => {
        setLoginApiError("");
        setFormData(prev => ({ ...prev, [name]: value }));
        const errorMsg = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        const newErrors = validateForm(formData);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            try {
                const reponse = await login({
                    email_or_phone: formData.email_or_phone,
                    password: formData.password
                });
                storeUserData(reponse?.data?.user, reponse?.data?.token)
                setIsLoading(false)

            } catch (error) {
                if (error.errors) {
                    const { email_or_phone, password } = error.errors;
                    setErrors((prev) => {
                        return {
                            ...prev,
                            ...(email_or_phone && { email_or_phone: email_or_phone[0] }),
                            ...(password && { password: password[0] }),
                        };
                    });
                } else {
                    setLoginApiError(error.message)
                }
                setIsLoading(false)
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ fontWeight: '500', color: '#FFFFFF' }}>
                    Please enter your details to sign in
                </Text>

                <Input
                    label={'ENTER YOUR EMAIL OR MOBILE'}
                    value={formData.email_or_phone}
                    onChangeText={(value) => handleChange(value, "email_or_phone")}
                    error={!!errors?.email_or_phone}
                    errorMessage={errors?.email_or_phone}
                />

                <PassWordInput
                    label={'ENTER PASSWORD'}
                    value={formData.password}
                    onChangeText={(value) => handleChange(value, "password")}
                    error={!!errors.password}
                    errorMessage={errors.password}
                    isPassword={true}
                />
                {loginApiError ? (
                    <Text style={styles.errorText}>{loginApiError}</Text>
                ) : null}
            </View>

            <View style={{ paddingHorizontal: 20, width: '100%', position: 'absolute', bottom: '5%' }}>
                <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 10 }}>
                    Don’t have an account?{' '}
                    <Text onPress={() => router.push('/')} style={{ color: '#D87129' }}>
                        Sign up
                    </Text>
                </Text>
                <Button onClick={handleSubmit} isLoading={isLoading} label={'SIGN IN'} gradientColor={['#D36C32', '#F68F00']} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#012744',
    },
    logo: {
        height: height * 0.1,
        width: width * 0.4,
        marginBottom: height * 0.05,
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        marginLeft: 4,
        fontSize: 12,
        textAlign: 'right',
    },
});

export default Login;
