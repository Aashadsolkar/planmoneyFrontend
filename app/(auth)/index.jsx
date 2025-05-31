import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { COLORS } from '../constants';
import { router } from 'expo-router';
import PassWordInput from '../components/Password';
import Input from '../components/Input';
import { validateField, validateForm } from '../utils/validator';
import { registor } from '../utils/apiCaller';
import { useAuth } from '../context/useAuth';

const { height, width } = Dimensions.get('window');

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { storeUserData } = useAuth();

  const handleChange = (value, name) => {
    setApiError('');
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const fieldError = validateField(name, value);

    let confirmPasswordError = errors.confirmPassword;
    if (['password', 'confirmPassword'].includes(name)) {
      confirmPasswordError =
        updatedForm.password && updatedForm.confirmPassword &&
        updatedForm.password !== updatedForm.confirmPassword
          ? 'Passwords do not match'
          : '';
    }

    setErrors(prev => ({
      ...prev,
      [name]: fieldError,
      ...(name === 'password' || name === 'confirmPassword'
        ? { confirmPassword: confirmPasswordError }
        : {}),
    }));
  };

  const handleSubmit = async () => {
    const newErrors = validateForm(formData);
    if (
      formData.password !== formData.confirmPassword &&
      !newErrors.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await registor({
          fullname: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          terms_and_conditions: true,
        });
        storeUserData(response?.data?.user, response?.data?.token);
        setIsLoading(false);
      } catch (error) {
        if (error.errors) {
          const serverErrors = {};
          ['name', 'email', 'phone', 'password'].forEach(field => {
            if (error.errors[field]) {
              serverErrors[field] = error.errors[field][0];
            }
          });
          setErrors(prev => ({ ...prev, ...serverErrors }));
        } else {
          setApiError(error.message || 'Registration failed. Please try again.');
        }
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.titleText}>
            Please enter your details to sign up
          </Text>

          <Input
            label="ENTER YOUR FULL NAME"
            value={formData.name}
            onChangeText={val => handleChange(val, 'name')}
            error={!!errors?.name}
            errorMessage={errors?.name}
          />
          <Input
            label="ENTER EMAIL ADDRESS"
            value={formData.email}
            onChangeText={val => handleChange(val, 'email')}
            error={!!errors?.email}
            errorMessage={errors?.email}
          />
          <Input
            label="ENTER MOBILE NUMBER"
            value={formData.phone}
            onChangeText={val => handleChange(val, 'phone')}
            error={!!errors?.phone}
            errorMessage={errors?.phone}
          />
          <PassWordInput
            label="ENTER PASSWORD"
            value={formData.password}
            onChangeText={val => handleChange(val, 'password')}
            isPassword
            error={!!errors?.password}
            errorMessage={errors?.password}
          />
          <PassWordInput
            label="ENTER CONFIRM PASSWORD"
            value={formData.confirmPassword}
            onChangeText={val => handleChange(val, 'confirmPassword')}
            isPassword
            error={!!errors?.confirmPassword}
            errorMessage={errors?.confirmPassword}
          />

          {apiError ? (
            <Text style={styles.apiErrorText}>{apiError}</Text>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text
              onPress={() => router.push('/login')}
              style={styles.footerLink}
            >
              Sign in
            </Text>
          </Text>
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            label="SIGN UP"
            gradientColor={['#D36C32', '#F68F00']}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#012744',
  },
  flexContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  logo: {
    height: height * 0.1,
    width: width * 0.4,
  },
  titleText: {
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 20,
    fontSize: 16,
  },
  apiErrorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'right',
    fontSize: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: COLORS.primaryColor,
  },
  footerText: {
    color: COLORS.fontWhite,
    textAlign: 'center',
    marginBottom: 10,
  },
  footerLink: {
    color: '#D87129',
  },
});

export default Register;
