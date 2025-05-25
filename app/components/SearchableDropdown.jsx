import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { COLORS } from "../constants";

const Dropdown = ({ options, onOptionSelected, label }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  const filterOptions = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      setFilteredOptions(
        options.filter((option) =>
          option.toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      setFilteredOptions([]);
    }
  };

  const onOptionPress = (option) => {
    setSearchText(option);
    setFilteredOptions([]);
    onOptionSelected(option);
  };

  return (
    <View>
      {label && (
        <Text style={{ color: COLORS.fontWhite, marginBottom: 5 }}>{label}</Text>
      )}
      <TextInput
        value={searchText}
        onChangeText={filterOptions}
        placeholder="Search..."
        placeholderTextColor={COLORS.lightGray}
        style={{
          borderWidth: 1,
          height: 60,
          borderRadius: 10,
          borderColor: COLORS.fontWhite,
          padding: 20,
          color: COLORS.fontWhite,
        }}
      />

      {/* Only show dropdown when there is input */}
      {searchText.length > 0 && (
        <FlatList
          data={filteredOptions}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onOptionPress(item)}
              style={{
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.lightGray,
              }}
            >
              <Text style={{ color: COLORS.fontWhite }}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          style={{
            backgroundColor: COLORS.primaryColor,
            borderRadius: 8,
            marginTop: 5,
            maxHeight: 150,
          }}
        />
      )}
    </View>
  );
};

export default Dropdown;
