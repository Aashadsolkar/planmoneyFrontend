import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Menu, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants';

const SelectBox = ({ label, options = [], selected, setSelected, placeHolder, error }) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Text style={{ color: COLORS.lightGray, fontWeight: 600, marginTop: 10 }}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TouchableOpacity style={styles.dropdown} onPress={openMenu}>
            <Text
              style={styles.selectedText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {selected || placeHolder}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="white" />
          </TouchableOpacity>

        }
        contentStyle={{ backgroundColor: '#012744' }}
      >
        {options.map((option, idx) => (
          <Menu.Item
            key={idx}
            onPress={() => {
              setSelected(option);
              closeMenu();
            }}
            title={option}
            titleStyle={[
              styles.menuItem,
              option === selected && styles.selectedItem,
            ]}
          />
        ))}
      </Menu>
      <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginVertical: 8,
  },
  dropdown: {
    backgroundColor: '#012744',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    height: 60
  },
  selectedText: {
    color: 'white',
    flex: 1,
    flexShrink: 1,
    marginRight: 10,
    numberOfLines: 1, // React Native Text prop
  },
  menuItem: {
    color: 'white',
  },
  selectedItem: {
    color: 'orange',
    fontWeight: 'bold',
  },
});

export default SelectBox;
