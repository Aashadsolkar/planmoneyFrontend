import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput } from 'react-native-paper';

const TextAreaInput = ({ label, value, onChangeText, error, errorMessage }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        multiline
        numberOfLines={4}
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
        style={[styles.input, error && styles.inputError]}
        outlineColor={error ? 'red' : '#ccc'}
        activeOutlineColor={error ? 'red' : 'orange'}
        theme={{ roundness: 10 }}
        contentStyle={{ color: 'white' }}
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
    height: 100,
    textAlignVertical: 'top', // ensures text starts from top-left
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

export default TextAreaInput;
