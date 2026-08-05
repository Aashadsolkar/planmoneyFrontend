import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { COLORS, util_style } from "../constants";

const Button = ({
  label,
  gradientColor = [COLORS.primaryColor, COLORS.primaryColor], // ✅ safe default
  buttonStye = {},
  onClick,
  isLoading = false,
  small = false, // ✅ optional prop to support small button (used in Register.js)
}) => {
  return (
    <TouchableOpacity
      style={{
        borderRadius: 50,
        ...util_style.darkShadow,
      }}
      onPress={onClick}
      disabled={isLoading}
    >
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        colors={[COLORS.orangeColor, COLORS.orangeColor]}
        style={{
          padding: small ? 10 : 15, // ✅ smaller padding for "Send OTP" buttons
          borderRadius: 50,
          ...buttonStye,
        }}
      >
        {isLoading ? (
          <ActivityIndicator color={"#fff"} size="small" />
        ) : (
          <Text
          allowFontScaling={false}
            style={{
              textAlign: "center",
              fontWeight: "500", // ✅ string instead of number to avoid warning
              fontSize: 15,
              color: COLORS.fontWhite,
            }}
          >
            {label}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;
