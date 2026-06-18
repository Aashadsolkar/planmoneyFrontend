import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../constants.js";

const SelectBox = ({ label, options = [], selected, setSelected, placeHolder, error }) => {
  const [visible, setVisible] = useState(false);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const handleSelect = (option) => {
    setSelected(option);
    closeModal();
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={{ color: COLORS.lightGray, fontWeight: "600", marginTop: 10 }}>
        {label}
      </Text>

      {/* Dropdown button */}
      <TouchableOpacity style={styles.dropdown} onPress={openModal}>
        <Text style={styles.selectedText} numberOfLines={1}>
          {selected || placeHolder}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="white" />
      </TouchableOpacity>

      {/* Error */}
      {error ? <Text style={{ color: "red", marginTop: 5 }}>{error}</Text> : null}

      {/* Center Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        {/* Background overlay */}
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        {/* Centered Box */}
        <View style={styles.centeredContainer}>
          <View style={styles.modalBox}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item === selected && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item === selected && styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dropdown: {
    backgroundColor: "#012744",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    height: 60,
  },
  selectedText: {
    color: "white",
    flex: 1,
    flexShrink: 1,
    marginRight: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  centeredContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#012744",
    borderRadius: 12,
    width: "90%",
    maxHeight: "60%",
    paddingVertical: 10,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1a3a5a",
  },
  selectedOption: {
    backgroundColor: "#024d82",
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
  selectedOptionText: {
    color: "orange",
    fontWeight: "bold",
  },
});

export default SelectBox;
