
import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import axios from "axios"
import { COLORS } from "../constants"
import { useAuth } from "../auth/useAuth"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation } from "expo-router"

// Get screen dimensions for responsive design
const { width } = Dimensions.get("window")

export default function KYC() {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [aadharNumber, setAadharNumber] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [panNumber, setPanNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState("User");
  const [isVerified, setIsVerified] = useState(false)
  const [requestId, setRequestId] = useState("")
  const [taskId, setTaskId] = useState("")
  const { profileData } = useAuth();
  const navigation = useNavigation();

  // Total number of steps in the KYC process
  const TOTAL_STEPS = 6

  // Current step number based on the screen
  const getStepNumber = () => {
    if (currentStep === 1) return 1
    if (currentStep === 2) return 2
    if (currentStep === 3) return 3
    return 1
  }

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  // Refs for OTP inputs
  const otpInputs = useRef([])

  // Validation functions with improved error messages
  const isValidAadhar = (aadhar) => {
    if (!aadhar) return { valid: false, message: "Aadhar number is required" }
    if (aadhar.length !== 12) return { valid: false, message: "Aadhar number must be 12 digits" }
    if (!/^\d+$/.test(aadhar)) return { valid: false, message: "Aadhar number must contain only digits" }
    return { valid: true, message: "" }
  }

  const isValidPAN = (pan) => {
    if (!pan) return { valid: false, message: "PAN number is required" }
    if (pan.length !== 10) return { valid: false, message: "PAN number must be 10 characters" }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase())) {
      return { valid: false, message: "PAN should be in format: ABCDE1234F" }
    }
    return { valid: true, message: "" }
  }
const token ='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FkbWluLnBsYW5tb25leS5pbi9hcGkvY3VzdG9tZXIvbG9naW4iLCJpYXQiOjE3NDc4MjA4MTYsImV4cCI6MTc1MDQxMjgxNiwibmJmIjoxNzQ3ODIwODE2LCJqdGkiOiJLamlmWFJGMnJzcUp3NGRsIiwic3ViIjoiMiIsInBydiI6IjFkMGEwMjBhY2Y1YzRiNmM0OTc5ODlkZjFhYmYwZmJkNGU4YzhkNjMifQ.wOnzzUNCweM3OLTx74N_tKTjWpL0DElgxfQdAV49k0k'
  const isOtpComplete = () => {
    const emptyFields = otp.filter((digit) => digit === "").length
    if (emptyFields > 0) {
      return { valid: false, message: `Please enter all ${otp.length} digits of the OTP` }
    }
    return { valid: true, message: "" }
  }

  // Animation effect when component mounts or step changes
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()

    // Reset animation values when step changes
    return () => {
      fadeAnim.setValue(0)
      slideAnim.setValue(30)
    }
  }, [currentStep, isVerified])

  // API call to send OTP to Aadhar number
  const sendAadharOTP = async () => {
    const aadharValidation = isValidAadhar(aadharNumber)
    if (!aadharValidation.valid) {
      return Alert.alert("Invalid Aadhar", aadharValidation.message)
    }

    setLoading(true)
    try {
      const res = await axios.post("https://admin.planmoney.in/api/customer/aadhaar/send-otp", {
        aadhaar: aadharNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

      const data = res.data?.data
      if (res.data.status === "success" && data?.otp_sent) {
        setRequestId(data.request_id)
        setTaskId(data.task_id)
        setUserName("Vignesh") // This would ideally come from the API response
        setCurrentStep(2)

        // Clear OTP fields when requesting a new OTP
        setOtp(["", "", "", "", "", ""])
      } else {
        throw new Error(res.data.message || "OTP not sent")
      }
    } catch (err) {
      console.error("Aadhar OTP Error:", err)
      Alert.alert("Error", err.response?.data?.message || err.message || "Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // API call to verify OTP
  const verifyAadharOTP = async () => {
    const otpValidation = isOtpComplete()
    if (!otpValidation.valid) {
      return Alert.alert("Incomplete OTP", otpValidation.message)
    }

    setLoading(true)
    try {
      const res = await axios.post("https://admin.planmoney.in/api/customer/aadhaar/verify-otp", {
        otp: otp.join(""),
        request_id: requestId,
        task_id: taskId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
)

      if (res.data.status === "success") {
        setCurrentStep(3)
      } else {
        throw new Error(res.data.message || "OTP verification failed")
      }
    } catch (err) {
      console.error("OTP Verification Error:", err)
      Alert.alert("Error", err.response?.data?.message || err.message || "OTP verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // API call to verify PAN
  const verifyPAN = async () => {
    const panValidation = isValidPAN(panNumber)
    if (!panValidation.valid) {
      return Alert.alert("Invalid PAN", panValidation.message)
    }

    setLoading(true)
    try {
      const res = await axios.post("https://admin.planmoney.in/api/customer/pan/verify", {
        pan: panNumber.toUpperCase(),
      },
    {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.data.status === "success") {
        setIsVerified(true)
      } else {
        throw new Error(res.data.message || "PAN verification failed")
      }
    } catch (err) {
      console.error("PAN Verification Error:", err)
      Alert.alert("Error", err.response?.data?.message || err.message || "PAN verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP functionality
  const resendOTP = async () => {
    setLoading(true)
    try {
      const res = await axios.post("https://admin.planmoney.in/api/customer/aadhaar/send-otp", {
        aadhaar: aadharNumber,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

      const data = res.data?.data
      if (res.data.status === "success" && data?.otp_sent) {
        setRequestId(data.request_id)
        setTaskId(data.task_id)

        // Clear OTP fields when resending
        setOtp(["", "", "", "", "", ""])

        Alert.alert("Success", "OTP has been resent to your registered mobile number")
      } else {
        throw new Error(res.data.message || "Failed to resend OTP")
      }
    } catch (err) {
      console.error("Resend OTP Error:", err)
      Alert.alert("Error", err.response?.data?.message || err.message || "Failed to resend OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP input
  const handleOtpChange = (text, index) => {
    // Only allow digits
    if (text && !/^\d+$/.test(text)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)

    // Auto-focus next input
    if (text && index < 5) {
      otpInputs.current[index + 1].focus()
    }
  }

  // Handle backspace in OTP input
  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus()
    }
  }

  // Render Aadhar input step
  const renderAadharStep = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={{ fontSize: 25, fontWeight: 500, color: COLORS.fontWhite }}>Hey <Text style={{ color: COLORS.secondaryColor }}>{profileData?.name}</Text></Text>
      <Text style={styles.subText}>Please complete your KYC</Text>

      <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 20 }}>Step <Text style={{ color: COLORS.secondaryColor }}>1</Text> to 3</Text>
      <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite, marginBottom: 10 }}>Verify Your Aadhar Number</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Your Aadhar Number"
        placeholderTextColor="#FFFFFF80"
        keyboardType="numeric"
        maxLength={12}
        value={aadharNumber}
        onChangeText={setAadharNumber}
      />

      <Text style={styles.infoText}>OTP will be sent to your Aadhar Register Mobile Number</Text>

      <TouchableOpacity
        style={[styles.button, !aadharNumber && styles.buttonDisabled]}
        onPress={sendAadharOTP}
        disabled={loading || !aadharNumber}
      >
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          colors={['#D36C32', '#F68F00']}
          style={{ padding: 15, borderRadius: 50, width: "100%", textAlign: "center" }}
        >

          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )

  // Render OTP verification step
  const renderOtpStep = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity onPress={() => setCurrentStep(1)} style={styles.backButton}>
        <Text style={{ fontSize: 20, color: 'white', }}>←</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 60 }}>Step <Text style={{ color: COLORS.secondaryColor }}>2</Text> to 3</Text>
      <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite, marginBottom: 20 }}>Enter OTP (Aadhar Verification)</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (otpInputs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleOtpKeyPress(e, index)}
          />
        ))}
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't Get OTP? </Text>
        <TouchableOpacity onPress={resendOTP} disabled={loading}>
          <Text style={styles.resendButton}>Resend OTP</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, !isOtpComplete().valid && styles.buttonDisabled]}
        onPress={verifyAadharOTP}
        disabled={loading || !isOtpComplete().valid}
      >
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          colors={['#D36C32', '#F68F00']}
          style={{ padding: 15, borderRadius: 50, width: "100%", textAlign: "center" }}
        >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )

  // Render PAN verification step
  const renderPanStep = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity onPress={() => setCurrentStep(2)} style={styles.backButton}>
        <Text style={{ fontSize: 20, color: 'white', }}>←</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.fontWhite, marginTop: 60 }}>Step <Text style={{ color: COLORS.secondaryColor }}>3</Text> to 3</Text>
      <Text style={{ fontSize: 20, fontWeight: 600, color: COLORS.fontWhite, marginBottom: 20 }}>Verify Your PAN Number</Text>
      {/* <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(2)}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity> */}
      <TextInput
        style={styles.input}
        placeholder="Enter Your PAN Number"
        placeholderTextColor="#FFFFFF80"
        autoCapitalize="characters"
        maxLength={10}
        value={panNumber}
        onChangeText={(text) => setPanNumber(text.toUpperCase())}
      />

      <Text style={styles.infoText}>Your PAN Number should be in this format XXXXX0000X</Text>

      <TouchableOpacity
        style={[styles.button, !panNumber && styles.buttonDisabled]}
        onPress={verifyPAN}
        disabled={loading || !panNumber}
      >
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          colors={['#D36C32', '#F68F00']}
          style={{ padding: 15, borderRadius: 50, width: "100%", textAlign: "center" }}
        >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )

  // Render success step
  const renderSuccessStep = () => (
    <Animated.View style={[styles.successContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Ionicons name="checkmark-circle" size={80} color="#FFA500" />
      <Text style={styles.successTitle}>Verification Successful!</Text>
      <Text style={styles.successText}>Your Aadhar and PAN have been successfully verified.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setCurrentStep(1)
          setAadharNumber("")
          setOtp(["", "", "", "", "", ""])
          setPanNumber("")
          setIsVerified(false)
          setRequestId("")
          setTaskId("");
          navigation.navigate("home")

        }}
      >
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          colors={['#D36C32', '#F68F00']}
          style={{ padding: 15, borderRadius: 50, width: "100%", textAlign: "center" }}
        >
        <Text style={styles.buttonText}>GO To Home</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )


  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
        {isVerified
          ? renderSuccessStep()
          : currentStep === 1
            ? renderAadharStep()
            : currentStep === 2
              ? renderOtpStep()
              : renderPanStep()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
  },
  keyboardAvoid: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 40,
  },
  subText: {
    fontSize: 16,
    color: "#FFFFFF80",
    marginBottom: 30,
  },
  stepIndicator: {
    marginBottom: 30,
    marginTop: 20,
  },
  stepText: {
    fontSize: 14,
    color: "#FFFFFF80",
    marginBottom: 5,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 12,
    color: "#FFFFFF80",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#FFA500", // Orange button
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
    width: "100%"
  },
  buttonDisabled: {
    backgroundColor: "#FFA50080", // Semi-transparent orange
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: (width - 70) / 6, // Dynamically calculate width for 6 inputs with spacing
    height: 50,
    borderWidth: 1,
    borderColor: "#FFFFFF40",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    color: "#FFFFFF",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  resendText: {
    color: "#FFFFFF80",
  },
  resendButton: {
    color: "#FFA500",
    fontWeight: "bold",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: "#FFFFFF80",
    textAlign: "center",
    marginBottom: 40,
  },
  progressContainer: {
    height: 4,
    backgroundColor: "#FFFFFF20",
    width: "100%",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#FFA500",
  },
})
