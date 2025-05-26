import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Dimensions, FlatList, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from "../../constants";
import Button from '../../components/Button';
import Input from '../../components/Input';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { countryApi } from '../../utils/apiCaller';
import { useAuth } from '../../context/useAuth';
const { height } = Dimensions.get("window")

const SearchableDropdown = ({ data, value, placeholder, onSelect, searchKey, displayKey }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [searchText, setSearchText] = useState("");


    const filteredData = data.filter((item) => item[searchKey].toLowerCase().includes(searchText.toLowerCase()))

    const handleSelect = (item) => {
        onSelect(item)
        setIsVisible(false)
        setSearchText("")
    }

    return (
        <>
            <TouchableOpacity style={styles.dropdown} onPress={() => setIsVisible(true)}>
                <Text style={[styles.dropdownText, !value && styles.placeholder]}>{value || placeholder}</Text>
                <Ionicons name="chevron-down" size={20} color="#8B9DC3" />
            </TouchableOpacity>

            <Modal visible={isVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{placeholder}</Text>
                            <TouchableOpacity onPress={() => setIsVisible(false)}>
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
                            placeholderTextColor="#8B9DC3"
                            value={searchText}
                            onChangeText={setSearchText}
                        />

                        <FlatList
                            data={filteredData}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelect(item)}>
                                    <Text style={styles.dropdownItemText}>{item[displayKey]}</Text>
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        </>
    )
}

const ResidentDetails = () => {
    const [selected, setSelected] = useState("yes");
    const [fatcaSelect, setFatcaSelect] = useState(null);
    const [country, setCountry] = useState("");
    const navigation = useNavigation();
    const [coutryData, setCountryData] = useState([])
    const [formData, setFormData] = useState({
        country: "",
    })
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [errors, setErrors] = useState({});
    const { setQuestionFormData } = useAuth();

    useEffect(() => {
        const getState = async () => {
            try {
                const response = await countryApi();
                setCountryData(response?.data?.country)
                console.log(response);
            } catch (error) {
                console.log(error);

            }
        }
        getState()
    }, [])

    const handleSubmit = () => {
        let isValid = true;
        let newErrors = {};

        if (selected === "no" && !formData.country) {
            newErrors.country = "Please select your country.";
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) return;

        setQuestionFormData((prev) => {
            return {
                ...prev,
                "resident_of_india": selected,
                "resident_of": formData?.country,
                "fatca_declaration": fatcaSelect === "yes" ? "yes" : "no",
            }
        })

        router.push('forms/agreementForm');
    };


    const renderCheckbox = (label) => {
        const isChecked = selected === label;
        return (
            <TouchableOpacity onPress={() => setSelected(label)} style={styles.option}>
                <View style={[styles.checkbox, isChecked && styles.checkedBox]}>
                    {isChecked && <View style={styles.innerCheck} />}
                </View>
                <Text style={styles.label}>{label === 'yes' ? 'Yes' : 'No'}</Text>
            </TouchableOpacity>
        );
    };

    const renderFatcaCheckbox = (label) => {
        const isChecked = fatcaSelect === label;
        return (
            <TouchableOpacity onPress={() => setFatcaSelect(label)} style={styles.option}>
                <View style={[styles.checkbox, isChecked && styles.checkedBox]}>
                    {isChecked && <View style={styles.innerCheck} />}
                </View>
                {/* <Text style={styles.label}>{label === 'yes' ? 'Yes' : 'No'}</Text> */}
            </TouchableOpacity>
        );
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setFormData((prev) => ({
            ...prev,
            country: country.name,
        }))
        setErrors((prev) => {
            return {
                ...prev,
                "country": ""
            }
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor, padding: 20 }}>
            <View style={{padding: 20}}>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={{ fontSize: 20, color: 'white' }}>←</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 12, fontWeight: "600", color: COLORS.fontWhite, marginTop: 20 }}>
                Step <Text style={{ color: COLORS.secondaryColor }}>1</Text> to 6
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "600", color: COLORS.fontWhite, marginBottom: 20 }}>
                Tax Residence Details
            </Text>

            <Text style={{ fontSize: 16, fontWeight: "400", color: COLORS.fontWhite, marginBottom: 10 }}>
                Are you Resident of India?
            </Text>
            <View style={{ flexDirection: "row", gap: 15, marginBottom: 20 }}>
                {renderCheckbox('yes')}
                {renderCheckbox('no')}
            </View>

            {selected === "no" && (
                <>
                    {/* Country */}
                    <View style={styles.inputContainer}>
                        <SearchableDropdown
                            data={coutryData}
                            value={formData.country}
                            placeholder="Country"
                            onSelect={handleCountrySelect}
                            searchKey="name"
                            displayKey="name"
                        />
                    </View>
                    {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
                    <View style={{ flexDirection: "row", gap: 5, marginBottom: 20, alignItems: "flex-start", marginTop: 30 }}>
                        {renderFatcaCheckbox('yes')}
                        <Text style={{ fontSize: 16, fontWeight: "400", color: COLORS.fontWhite }}>
                            If yes, provide FATCA Declaration and Compliance Documents (as applicable).
                        </Text>
                    </View>
                </>
            )}
            </View>
            <Button onClick={handleSubmit} label="Next" gradientColor={['#D36C32', '#F68F00']} buttonStye={{ marginHorizontal: 20 }} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    option: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        height: 24,
        width: 24,
        borderWidth: 2,
        borderColor: '#444',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedBox: {
        backgroundColor: '#007AFF',
    },
    innerCheck: {
        width: 10,
        height: 10,
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    label: {
        fontSize: 16,
        color: COLORS.fontWhite
    },
    backButton: {
        marginBottom: 10,
    },
    dropdown: {
        backgroundColor: COLORS.primaryColor,
        borderWidth: 1,
        borderColor: COLORS.fontWhite,
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 56,
    },
    dropdownText: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    placeholder: {
        color: "#8B9DC3",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
    },
    modalContent: {
        backgroundColor: COLORS.cardColor,
        borderRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: height * 0.7,
        paddingBottom: 20,
        width: "90%",
        marginHorizontal: "auto"
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    modalTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    searchInput: {
        backgroundColor: COLORS.primaryColor,
        borderWidth: 1,
        borderColor: COLORS.fontWhite,
        borderRadius: 12,
        padding: 16,
        margin: 20,
        color: "#FFFFFF",
        fontSize: 16,
    },
    dropdownItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    dropdownItemText: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        // marginTop: 4,
        marginBottom: 10

    },
    inputContainer: {
        marginBottom: 5,
    }
});

export default ResidentDetails;
