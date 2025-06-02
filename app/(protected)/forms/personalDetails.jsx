
import { useEffect, useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    FlatList,
    Platform,
    Dimensions,
    SafeAreaView,
    KeyboardAvoidingView,
    Alert,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { COLORS } from '../../constants'
import Header from "../../components/Header"
import Button from "../../components/Button"
import { router } from "expo-router"
import { cityApi, countryApi, stateApi } from "../../utils/apiCaller"
import { useAuth } from "../../context/useAuth"


const { width, height } = Dimensions.get("window")

// Sample data - replace with your actual data source
const countries = [
    { id: "1", name: "India", code: "IN" },
    { id: "2", name: "United States", code: "US" },
    { id: "3", name: "United Kingdom", code: "UK" },
    { id: "4", name: "Canada", code: "CA" },
    { id: "5", name: "Australia", code: "AU" },
]

const states = {
    "1": [
        { id: "1", name: "Maharashtra" },
        { id: "2", name: "Karnataka" },
        { id: "3", name: "Tamil Nadu" },
        { id: "4", name: "Gujarat" },
        { id: "5", name: "Rajasthan" },
    ],
    "2": [
        { id: "6", name: "California" },
        { id: "7", name: "New York" },
        { id: "8", name: "Texas" },
        { id: "9", name: "Florida" },
    ],
}

const cities = {
    "1": [
        { id: "1", name: "Mumbai" },
        { id: "2", name: "Pune" },
        { id: "3", name: "Nashik" },
    ],
    "2": [
        { id: "4", name: "Bangalore" },
        { id: "5", name: "Mysore" },
    ],
    "6": [
        { id: "6", name: "Los Angeles" },
        { id: "7", name: "San Francisco" },
    ],
}




const SearchableDropdown = ({ data, value, placeholder, onSelect, searchKey, displayKey }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [searchText, setSearchText] = useState("")

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

export default function PersonalDetailsForm() {
    const today = new Date();
    const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    );
    const [formData, setFormData] = useState({
        dateOfBirth: eighteenYearsAgo,
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
    })
    const { profileData, token, setQuestionFormData, setSkipQuestioniar } = useAuth();

    const [selectedCountry, setSelectedCountry] = useState(null)
    const [selectedState, setSelectedState] = useState(null)
    const [selectedCity, setSelectedCity] = useState(null)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [coutryData, setCountryData] = useState([])
    const [stateData, setStateData] = useState([])
    const [cityData, setCityData] = useState([])
    const [errors, setErrors] = useState({});


    useEffect(() => {
        setSkipQuestioniar(true);
        const getState = async () => {
            try {
                const response = await countryApi(token);
                setCountryData(response?.data?.country);
            } catch (error) {
                Alert.alert(
                    "Error",
                    error?.message || "Failed to get country data",
                    [
                        {
                            text: "OK",
                            onPress: () => router.push("home"),
                        },
                    ]
                );

            }
        }
        getState()
    }, [])

    useEffect(() => {
        const getState = async (id) => {
            try {
                const response = await stateApi(id);
                setStateData(response?.data?.state);
            } catch (error) {
                Alert.alert(
                    "Error",
                    error?.message || "Failed to get state data",
                    [
                        {
                            text: "OK",
                            onPress: () => router.push("home"),
                        },
                    ]
                );

            }
        }
        if (selectedCountry) {
            getState(selectedCountry?.id);
        }
    }, [selectedCountry])


    useEffect(() => {
        const getCity = async (id) => {
            try {
                const response = await cityApi(id);
                setCityData(response?.data?.cities);
            } catch (error) {
                Alert.alert(
                    "Error",
                    error?.message || "Failed to get city data",
                    [
                        {
                            text: "OK",
                            onPress: () => router.push("home"),
                        },
                    ]
                );
            }
        }
        if (selectedState) {
            getCity(selectedState?.id);
        }
    }, [selectedState])

    const handleCountrySelect = (country) => {
        setSelectedCountry(country)
        setSelectedState(null)
        setSelectedCity(null)
        setFormData((prev) => ({
            ...prev,
            country: country.name,
            state: "",
            city: "",
        }))
        setErrors((prev) => {
            return {
                ...prev,
                "country": ""
            }
        })
    }

    const handleStateSelect = (state) => {
        setSelectedState(state)
        setSelectedCity(null)
        setFormData((prev) => ({
            ...prev,
            state: state.name,
            city: "",
        }))
        setErrors((prev) => {
            return {
                ...prev,
                "state": ""
            }
        })
    }

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setFormData((prev) => ({
            ...prev,
            city: city.name,
        }))
        setErrors((prev) => {
            return {
                ...prev,
                "city": ""
            }
        })
    }

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === "ios")
        if (selectedDate) {
            setFormData((prev) => ({
                ...prev,
                dateOfBirth: selectedDate,
            }))
        }
    }

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
    }

    const handleNext = () => {
        router.push("forms/riskCalculate1");
        const newErrors = {};

        // Age validation (at least 18 years old)
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth is required.";
        } else {
            const today = new Date();
            const eighteenYearsAgo = new Date(
                today.getFullYear() - 18,
                today.getMonth(),
                today.getDate()
            );
            const dob = new Date(formData.dateOfBirth);
            if (dob > eighteenYearsAgo) {
                newErrors.dateOfBirth = "You must be at least 18 years old.";
            }
        }

        if (!formData.country) newErrors.country = "Please select a country.";
        if (!formData.state) newErrors.state = "Please select a state.";
        if (!formData.city) newErrors.city = "Please select a city.";
        if (!formData.pincode || formData.pincode.length !== 6) {
            newErrors.pincode = "Enter a valid 6-digit pincode.";
        }
        if (!formData.address.trim()) newErrors.address = "Address is required.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            router.push("forms/riskCalculate1");
            setQuestionFormData((prev) => {
                return {
                    ...prev,
                    "dob": formData?.dateOfBirth,
                    "country": selectedCountry?.id,
                    "state": selectedState?.id,
                    "city": selectedCity?.id,
                    "pincode": formData?.pincode,
                    "address": formData?.address,
                }
            })
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0} // adjust as needed
            >
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.header}>
                        <Text style={styles.subtitle}>Need some details before you proceed with our Services</Text>
                        <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 20 }}>Step <Text style={{ color: COLORS.secondaryColor }}>1</Text> to 6</Text>
                        <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite }}>Income & Earnings Profile</Text>
                    </View>

                    <View style={styles.form}>
                        {/* Date of Birth */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Date of Birth</Text>
                            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                                <Ionicons name="calendar-outline" size={20} color="#8B9DC3" />
                                <Text style={styles.dateText}>{formatDate(formData.dateOfBirth)}</Text>
                            </TouchableOpacity>
                        </View>

                        {showDatePicker && (
                            <DateTimePicker
                                value={formData.dateOfBirth}
                                mode="date"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={handleDateChange}
                                maximumDate={new Date()}
                            />
                        )}

                        {/* Address */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter your Address"
                                placeholderTextColor="#8B9DC3"
                                value={formData.address}
                                onChangeText={(text) => {
                                    setFormData((prev) => ({ ...prev, address: text }))
                                    setErrors((prev) => {
                                        return {
                                            ...prev,
                                            "address": ""
                                        }
                                    })
                                }}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

                        {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
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


                        {/* State */}
                        <View style={styles.inputContainer}>
                            <SearchableDropdown
                                data={stateData}
                                value={formData.state}
                                placeholder="State"
                                onSelect={handleStateSelect}
                                searchKey="name"
                                displayKey="name"
                            />
                        </View>
                        {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}


                        {/* City */}
                        <View style={styles.inputContainer}>
                            <SearchableDropdown
                                data={cityData}
                                value={formData.city}
                                placeholder="City"
                                onSelect={handleCitySelect}
                                searchKey="name"
                                displayKey="name"
                            />
                        </View>
                        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}



                        {/* Pincode */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Pincode"
                                placeholderTextColor="#8B9DC3"
                                value={formData.pincode}
                                onChangeText={(text) => {
                                    setFormData((prev) => ({ ...prev, pincode: text }))
                                    setErrors((prev) => {
                                        return {
                                            ...prev,
                                            "pincode": ""
                                        }
                                    })
                                }}
                                keyboardType="numeric"
                                maxLength={6}
                            />
                        </View>
                        {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}


                    </View>


                </ScrollView>
            </KeyboardAvoidingView>
            <TouchableOpacity onPress={() => router.push("home")} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
            <Button onClick={() => handleNext()} label={"Next"} gradientColor={['#D36C32', '#F68F00']} buttonStye={{ marginHorizontal: 20 }} />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryColor
    },
    gradient: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 30,
    },
    subtitle: {
        color: "#B8C5D6",
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 20,
    },
    stepText: {
        color: "#8B9DC3",
        fontSize: 12,
        marginBottom: 8,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "bold",
    },
    form: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: "#8B9DC3",
        fontSize: 14,
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: COLORS.primaryColor,
        borderWidth: 1,
        borderColor: COLORS.fontWhite,
        borderRadius: 12,
        padding: 16,
        color: "#FFFFFF",
        fontSize: 16,
        minHeight: 56,
        textAlignVertical: "top",
    },
    dateInput: {
        backgroundColor: COLORS.primaryColor,
        borderWidth: 1,
        borderColor: COLORS.fontWhite,
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        minHeight: 56,
    },
    dateText: {
        color: "#FFFFFF",
        fontSize: 16,
        marginLeft: 12,
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
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
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
    footer: {
        marginTop: 30,
    },
    skipButton: {
        alignItems: "center",
        marginBottom: 20,
    },
    skipText: {
        color: "#8B9DC3",
        fontSize: 16,
    },
    nextButton: {
        backgroundColor: "#FF8C42",
        borderRadius: 25,
        padding: 18,
        alignItems: "center",
        shadowColor: "#FF8C42",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    nextButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        // marginTop: 4,
        marginBottom: 10

    },

})
