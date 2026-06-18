import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { COLORS } from '../constants.js';

const CustomTextInput = ({ label, value, onChangeText, error, errorMessage, isNumberOnly }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        label={<Text allowFontScaling={false} style={{ fontSize: 14,color: error ? "red" :isFocused ? COLORS.orangeColor : COLORS.lightGray }}>{label}</Text>}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        numberOfLines={4}
        onBlur={() => setIsFocused(false)}
        error={!!error}
        style={[styles.input, error && styles.inputError]}
        outlineColor={error ? 'red' : COLORS.secondaryIconColor}
        activeOutlineColor={error ? 'red' : COLORS.secondaryColor}
        theme={{
          roundness: 10,
        }}
        contentStyle={{ color: COLORS.secondaryColor, }}
        keyboardType={isNumberOnly ? "number-pad":"default"}
      />
      {error && errorMessage ? (
        <Text allowFontScaling={false} style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    backgroundColor: COLORS.primaryColor,
    height: 60,
    color: COLORS.secondaryColor,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    textAlign: 'right',
  },
});

export default CustomTextInput;
