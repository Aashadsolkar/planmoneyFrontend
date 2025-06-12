import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../context/useAuth';
import PassWordInput from '../components/Password';
import Input from '../components/Input';
import Button from '../components/Button';
import { validateField, validateForm } from '../utils/validator';
import { login } from '../utils/apiCaller';
import { COLORS } from '../constants';
import LogoSVG from '../components/LogoSVG';
import * as Animatable from 'react-native-animatable';
import { customerLogin } from '../utils/apis/customer-api-caller';

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
    email_or_phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loginApiError, setLoginApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { storeUserData } = useAuth();

  const handleChange = (value, name) => {
    setLoginApiError('');
    setFormData((prev) => ({ ...prev, [name]: value }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await customerLogin({
          email_or_phone: formData.email_or_phone,
          password: formData.password,
        });

        if (response?.data?.user && response?.data?.token) {
          storeUserData(response.data.user, response.data.token);
        } else {
          setLoginApiError('Unexpected response from server.');
        }
      } catch (error) {
        if (error.errors) {
          const { email_or_phone, password } = error.errors;
          setErrors((prev) => ({
            ...prev,
            ...(email_or_phone && { email_or_phone: email_or_phone[0] }),
            ...(password && { password: password[0] }),
          }));
        } else {
          setLoginApiError(error.message || 'Login failed. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryColor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Animatable.View animation="fadeIn" delay={200} duration={600}>
          <View style={styles.logoContainer}>
            <LogoSVG />
          </View>
        </Animatable.View>

        <View style={styles.formContainer}>
          <Text style={styles.subText}>
            Please enter your details to sign in
          </Text>

          <Animatable.View animation="fadeInUp" delay={100} duration={600}>
            <Input
              label="ENTER YOUR EMAIL OR MOBILE"
              value={formData.email_or_phone}
              onChangeText={(value) => handleChange(value, 'email_or_phone')}
              error={!!errors?.email_or_phone}
              errorMessage={errors?.email_or_phone}
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={200} duration={600}>
            <PassWordInput
              label="ENTER PASSWORD"
              value={formData.password}
              onChangeText={(value) => handleChange(value, 'password')}
              error={!!errors.password}
              errorMessage={errors.password}
              isPassword={true}
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={300} duration={600}>
            <View style={styles.forgotContainer}>
              <TouchableOpacity onPress={() => router.push('forgotPasswrd')}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>

          {loginApiError ? (
            <Text style={styles.errorText}>{loginApiError}</Text>
          ) : null}
        </View>


        <View style={styles.bottomContainer}>
          <Text style={styles.signupText}>
            Don’t have an account?{' '}
            <Text
              onPress={() => router.push('/')}
              style={styles.signupLink}
            >
              Sign up
            </Text>
          </Text>

          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            label="SIGN IN"
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
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
    paddingVertical: 30
  },
  logo: {
    height: 100,
    width: 200,
    marginBottom: height * 0.05,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  subText: {
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginVertical: 8,
  },
  forgotText: {
    color: COLORS.secondaryColor,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    textAlign: 'right',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    width: '100%',
    position: 'absolute',
    bottom: '5%',
  },
  signupText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  signupLink: {
    color: '#D87129',
  },
});

export default Login;
