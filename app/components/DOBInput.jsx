import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

const DOBInput = ({ onDateChange, onError }) => {
  const [dob, setDob] = useState(null);
  const [showIOSPicker, setShowIOSPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      if (event.type === 'dismissed') return;
    }


    const finalDate = selectedDate || dob;
    const today = new Date();

    if (finalDate > today) {
      onError?.('Future dates are not allowed.');
      return;
    }
    setDob(finalDate);

    const age = calculateAge(finalDate);
    if (age < 18) {
      onError?.('You must be at least 18 years old.');
    } else {
      onError?.('');
    }

    onDateChange?.(finalDate);
    if (Platform.OS === 'ios') setShowIOSPicker(false);
  };

  const showDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: dob || new Date(),
        mode: 'date',
        is24Hour: true,
        maximumDate: new Date(),
        onChange: handleDateChange,
      });
    } else {
      setShowIOSPicker(true);
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity  onPress={showDatePicker} style={styles.dateButton}>
        <Ionicons name="calendar-outline" size={20} color={COLORS.lightGray} />
        <Text style={styles.dateText}>{dob ? formatDate(dob) : 'Select Date of Birth'}</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' && showIOSPicker && (
        <DateTimePicker
          value={dob || new Date()}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
    color: COLORS.fontWhite,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: COLORS.primaryColor,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.lightGray,
    marginLeft: 8,
  },
});

export default DOBInput;
