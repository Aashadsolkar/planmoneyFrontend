import React, { useState, useEffect } from 'react';
import { View, TextInput, Animated, StyleSheet } from 'react-native';
import { COLORS, util_style } from '../constants';

const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  inputStyle = {},
  containerStyle = {},
  error,
  focusColor = error ? COLORS.errorColor : COLORS.secondaryColor, // default focus color (blue)
  blurColor = COLORS.lightGray,     // default blur color (gray)
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
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
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={
          [
            util_style.input,
            inputStyle,
            { borderColor: isFocused ? focusColor : error ? COLORS.errorColor : blurColor, } // outline color here
          ]
        }
        underlineColorAndroid="transparent" // disable Android underline
        selectionColor={focusColor}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        {...props}
      />
      {error && <Animated.Text style={util_style.errorText}>{error}</Animated.Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    marginBottom: 10,
  }
});

export default FloatingLabelInput;
