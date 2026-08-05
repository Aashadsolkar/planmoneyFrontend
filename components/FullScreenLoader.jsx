import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { COLORS } from '../constants.js';

const FullScreenLoader = ({ visible = true }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={COLORS.secondaryColor} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FullScreenLoader;
