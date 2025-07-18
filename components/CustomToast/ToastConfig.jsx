import { StyleSheet } from 'react-native';
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
    backgroundColor: '#d2ffdfff',
  },
  error: {
    borderLeftColor: '#ff6d6dff',
    backgroundColor: '#ff8686ff',
  },
  info: {
    borderLeftColor: '#0262abff',
    backgroundColor: '#c8e6fdff',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  subtext: {
    fontSize: 16,
    color: '#333',
  },
});
