import {router } from "expo-router";
import Toast from "react-native-toast-message";

export const showToast = ({
  type = "success",
  title = "",
  message = "",
  redirectPath = "",
}) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 60,
  });
  if (redirectPath) {
    setTimeout(() => {
      router.push(`${redirectPath}`);
    },3500);
  }
};
