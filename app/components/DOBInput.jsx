import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput } from 'react-native-paper';

const DOBInput = ({ day, month, year, setDay, setMonth, setYear, error, label }) => {
 const [isFocused, setIsFocused] = useState(false); 
  return (
    <View style={styles.row}>
      <TextInput
        mode="outlined"
        label={<Text style={{ color: error ? "red" :isFocused ? 'orange' : 'white' }}>DD</Text>}
        value={day}
        onChangeText={setDay}
        keyboardType="numeric"
        maxLength={2}
        style={styles.input}
        contentStyle={{ color: 'white' }}
        outlineColor="#ccc"
        activeOutlineColor="orange"
        theme={{ roundness: 10 }}
      />
      <TextInput
        mode="outlined"
        label={<Text style={{ color: error ? "red" :isFocused ? 'orange' : 'white' }}>MM</Text>}
        value={month}
        onChangeText={setMonth}
        keyboardType="numeric"
        maxLength={2}
        style={styles.input}
        contentStyle={{ color: 'white' }}
        outlineColor="#ccc"
        activeOutlineColor="orange"
        theme={{ roundness: 10 }}
      />
      <TextInput
        mode="outlined"
        label={<Text style={{ color: error ? "red" :isFocused ? 'orange' : 'white' }}>YYYY</Text>}
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        maxLength={4}
        style={styles.input}
        contentStyle={{ color: 'white' }}
        outlineColor="#ccc"
        activeOutlineColor="orange"
        theme={{ roundness: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#012744',
    flex: 1,
    marginHorizontal: 4,
  },
});

export default DOBInput;
