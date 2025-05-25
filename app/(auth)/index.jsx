import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingLabelInput from '../components/FloatingLabelInput';
import PasswordInput from '../components/PasswordInput ';
import Button from '../components/Button';
import { COLORS } from '../constants';
import { router, useNavigation } from 'expo-router';
import PassWordInput from '../components/Password';
import Input from '../components/Input';
import { validateField, validateForm } from '../utils/validator';
import { registor } from '../utils/apiCaller';
import { useAuth } from '../context/useAuth';

const { height, width } = Dimensions.get('window');

const Registor = () => {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confrimPasswor, setConfrimPasswor] = useState('');
  const [referal, setReferal] = useState('');
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    // referral_code: '',
  });

  const [registorApiError, setRegisterApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { storeUserData } = useAuth();

  const handleChange = (value, name) => {
    setRegisterApiError('');
  
    // Prepare updated form data
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
  
    // Validate individual field
    const fieldError = validateField(name, value);
  
    // Check password match only if password or confirmPassword is changing
    let confirmPasswordError = errors.confirmPassword;
    if (
      (name === 'password' && updatedForm.confirmPassword) ||
      (name === 'confirmPassword' && updatedForm.password)
    ) {
      confirmPasswordError =
        updatedForm.password !== updatedForm.confirmPassword
          ? 'Passwords do not match'
          : '';
    }
    
    // Update errors
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
          // referral_code: formData.referral_code
        });
        storeUserData(response?.data?.user, response?.data?.token);
        setIsLoading(false)
      } catch (error) {
        if (error.errors) {
          const { name, email, phone, password } = error.errors;
          setErrors(prev => ({
            ...prev,
            ...(name && { name: name[0] }),
            ...(email && { email: email[0] }),
            ...(phone && { phone: phone[0] }),
            ...(password && { password: password[0] }),
            // ...(referral_code && {referral_code: referral_code[0]})
          }));
        } else {
          setRegisterApiError(error.message);
        }
        setIsLoading(false)
      }
    }
  };
  


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 1 : 20}
      >
        <View style={styles.flexContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ paddingBottom: 20 }}
          >
            <View style={{ alignItems: 'center' }}>
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
              label={"ENTER YOUR FULL NAME"}
              value={formData.name}
              onChangeText={(val) => handleChange(val, "name")}
              error={!!errors?.name}
              errorMessage={errors?.name}
            />
            <Input
              label={"ENTER EMAIL ADDRESS"}
              value={formData.email}
              onChangeText={(val) => handleChange(val, "email")}
              error={!!errors?.email}
              errorMessage={errors?.email}
            />
            <Input
              label={"ENTER MOBILE NUMBER"}
              value={formData.phone}
              onChangeText={(val) => handleChange(val, "phone")}
              error={!!errors?.phone}
                    errorMessage={errors?.phone}
            />
            <PassWordInput
              label={"ENTER PASSWORD"}
              value={formData.password}
              onChangeText={(val) => handleChange(val, "password")}
              isPassword={true}
              error={!!errors?.password}
                    errorMessage={errors?.password}
            />
            <PassWordInput
              label={"ENTER CONFIRM PASSWORD"}
              value={formData.confirmPassword}
              onChangeText={(val) => handleChange(val, "confirmPassword")}
              isPassword={true}
              error={!!errors?.confirmPassword}
                    errorMessage={errors?.confirmPassword}
            />
            {/* <Input
              label={"Referral Code"}
              value={formData.referral_code}
              onChangeText={(val) => handleChange(val, "referral_code")}
              error={!!errors?.referral_code}
                    errorMessage={errors?.referral_code}
            /> */}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <View style={{ paddingHorizontal: 20, width: "100%", position: "absolute", bottom: 0, paddingBottom: 30, backgroundColor: COLORS.primaryColor }}>
        <Text style={{ color: "#fff", textAlign: "center", marginBottom: 10 }}>Already have an account? <Text onPress={() => router.push('/login')} style={{ color: "#D87129" }}> Sign in</Text></Text>
        <Button onClick={handleSubmit} isLoading={isLoading} label={"SIGN IN"} gradientColor={['#D36C32', '#F68F00']} />
      </View>
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
  logo: {
    height: height * 0.1,
    width: width * 0.4,
    marginBottom: height * 0.05,
  },
  titleText: {
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  bottomContainer: {
    backgroundColor: COLORS.primaryColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ffffff20',
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

export default Registor;
