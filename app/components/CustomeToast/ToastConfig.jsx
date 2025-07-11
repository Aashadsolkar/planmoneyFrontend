import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={styles.success}
      text1Style={styles.text}
      text2Style={styles.subtext}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={styles.error}
      text1Style={styles.text}
      text2Style={styles.subtext}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={styles.info}
      text1Style={styles.text}
      text2Style={styles.subtext}
    />
  ),
};

const styles = StyleSheet.create({
  success: {
    borderLeftColor: 'green',
    backgroundColor: '#e6ffed',
  },
  error: {
    borderLeftColor: 'red',
    backgroundColor: '#ffe6e6',
  },
  info: {
    borderLeftColor: '#1e90ff',
    backgroundColor: '#e6f0ff',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtext: {
    fontSize: 14,
    color: '#333',
  },
});
