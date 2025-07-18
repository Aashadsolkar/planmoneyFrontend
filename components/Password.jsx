import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput } from 'react-native-paper';

const PassWordInput = ({
  label,
  value,
  onChangeText,
  error,
  errorMessage,
  isPassword = false,
  isNumberOnly = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [secureText, setSecureText] = useState(isPassword);

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        label={
          <Text style={{ color: error ? 'red' : isFocused ? 'orange' : 'white' }}>
            {label}
          </Text>
        }
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        error={!!error}
        secureTextEntry={secureText}
        right={
          isPassword ? (
            <TextInput.Icon
              icon={secureText ? 'eye-off' : 'eye'}
              onPress={() => setSecureText(!secureText)}
              color="white"
            />
          ) : null
        }
        autoComplete="off"
        textContentType="oneTimeCode" // <--- this tricks iOS out of password behavior
        importantForAutofill="no"
        style={[styles.input, error && styles.inputError]}
        outlineColor={error ? 'red' : '#ccc'}
        activeOutlineColor={error ? 'red' : 'orange'}
        theme={{
          roundness: 10,
        }}
        contentStyle={{ color: 'white' }}
        keyboardType={isNumberOnly ? "number-pad":"default"}
      />
      {error && errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    backgroundColor: '#012744',
    height: 60
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

export default PassWordInput;
