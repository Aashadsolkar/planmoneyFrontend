import React, { useState, useEffect } from 'react';
import { View, TextInput, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { util_style, COLORS } from '../constants';

const PasswordInput = ({
  label,
  value,
  onChangeText,
  inputStyle = {},
  containerStyle = {},
  error,
  focusColor = error ? COLORS.errorColor : COLORS.secondaryColor,
  blurColor = COLORS.lightGray,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animatedIsFocused = useState(new Animated.Value(value ? 1 : 0))[0];

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute',
    left: 12,
    color: isFocused ? focusColor : COLORS.lightGray,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [40, 10],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    backgroundColor: COLORS.primaryColor,
    paddingHorizontal: 4,
    zIndex: 1,
    pointerEvents: 'none'
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[
            util_style.input,
            inputStyle,
            { borderColor: isFocused ? focusColor : error ? COLORS.errorColor : blurColor }
          ]}
          underlineColorAndroid="transparent"
          selectionColor={focusColor}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"             // ✅ disables autofill suggestion
          textContentType="off"        // ✅ prevents "strong password" prompt
          importantForAutofill="no"     // ✅ Android autofill suppression
          {...props}
        />

        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowPassword(prev => !prev)}
        >
          <MaterialCommunityIcons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={COLORS.lightGray}
          />
        </TouchableOpacity>
      </View>
      {error && <Animated.Text style={util_style.errorText}>{error}</Animated.Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    marginBottom: 10,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: 20,
  }
});

export default PasswordInput;
