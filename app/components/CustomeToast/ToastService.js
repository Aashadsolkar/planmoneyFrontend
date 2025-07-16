import Toast from "react-native-toast-message";

export const showToast = ({ type = "success", title = "", message = "" }) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 60,
  });
};
