import {router } from "expo-router";
import Toast from "react-native-toast-message";

export const showToast = ({
  type = "success",
  title = "",
  message = "",
  redirectPath = "",
  sessionExired = false,
  logout =  () => {},
}) => {
  Toast.show({
    type,
    text1: !sessionExired ? title : "Session Expired",
    text2: !sessionExired ?  message: "Logged in from another device.",
    position: "top",
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 60,
    sessionExired,
    logout
  });
  if(sessionExired){
     setTimeout(() => {
      logout()
    },1000);
  }else if (redirectPath) {
    setTimeout(() => {
      router.push(`${redirectPath}`);
    },3500);
  }
};
