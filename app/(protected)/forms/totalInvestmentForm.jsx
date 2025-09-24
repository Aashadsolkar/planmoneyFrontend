
import { useEffect, useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    Dimensions,
    KeyboardAvoidingView,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router"
import { COLORS } from '../../constants'
import Button from "@components/Button"
import { useAuth } from "@context/useAuth"

const { width, height } = Dimensions.get("window")

export default function PersonalDetailsForm() {
    const [formData, setFormData] = useState({
        capital_amount: "",
    })
    const { profileData, setQuestionFormData, setSkipQuestioniar } = useAuth();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setSkipQuestioniar(true);
    }, [])

    const handleNext = () => {
        const newErrors = {};
        if (!formData.capital_amount) {
            newErrors.capital_amount = "Enter Amount.";
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            router.push("forms/personalDetails");
            setQuestionFormData((prev) => {
                return {
                    ...prev,
                    "capital_amount": formData?.capital_amount,
                }
            })
        }
    };


    return (
        <SafeAreaView edges={[]} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryColor} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 10} // adjust as needed
            >
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Hi, <Text style={{color: COLORS.secondaryColor}}>{profileData?.name || "User"}</Text></Text>
                        <Text style={styles.subtitle}>Need some details before you proceed with our Services.</Text>
                        <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 5 }}>Step <Text style={{ color: COLORS.secondaryColor }}>1</Text> to 6</Text>
                        <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite }}>Total amount to invest?</Text>
                    </View>

                    <View style={styles.form}>
                        {/* Total investment qestion */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Investment Amount"
                                placeholderTextColor="#8B9DC3"
                                value={formData.capital_amount}
                                onChangeText={(text) => {
                                    setFormData((prev) => ({ ...prev, capital_amount: text }))
                                    setErrors((prev) => {
                                        return {
                                            ...prev,
                                            "capital_amount": ""
                                        }
                                    })
                                }}
                                keyboardType="numeric"
                            />
                        </View>
                        {errors.capital_amount && <Text style={styles.errorText}>{errors.capital_amount}</Text>}
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
        backgroundColor: COLORS.primaryColor,
        paddingBottom: 20
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
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        color: COLORS.fontWhite
    },
    subtitle: {
        color: "#B8C5D6",
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 20,
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
        marginBottom: 10,
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
    placeholder: {
        color: "#8B9DC3",
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
        marginBottom: 10,
        textAlign: "right"
    },

})
