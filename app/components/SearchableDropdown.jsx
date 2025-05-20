import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../constants';

const CountryAutocompleteInput = ({ data = [], value, onSelect }) => {
  const [query, setQuery] = useState(value || '');
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);

  // Sync internal query if value changes from outside
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Filter countries based on query
  const filteredCountries = data.filter(country =>
    country.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (country) => {
    onSelect(country);
    setShowResults(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Country</Text>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Enter country"
        placeholderTextColor="#8b9cb5"
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
      />

      {showResults && query.length > 0 && (
        <View style={styles.resultsContainer}>
          <ScrollView >
            {filteredCountries.length === 0 ? (
              <Text style={styles.noResults}>No countries found</Text>
            ) : (
              filteredCountries.map((item, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  style={styles.resultItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.resultText}>{item}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
    zIndex: 10,  // Ensure dropdown is above other components
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.fontWhite,
    backgroundColor: COLORS.primaryColor,
    color: 'white',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  resultsContainer: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    backgroundColor: '#002147',
    borderRadius: 10,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#2c4c7c',
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2c4c7c',
  },
  resultText: {
    color: 'white',
    fontSize: 16,
  },
  noResults: {
    padding: 15,
    color: '#8b9cb5',
    textAlign: 'center',
  },
});

export default CountryAutocompleteInput;
