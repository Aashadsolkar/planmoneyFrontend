import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const NoInternetScreen = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/images/offlineScreen.json")}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.title}>Whoops!</Text>
      <Text style={styles.message}>Slow or no internet connection.</Text>
      <Text style={styles.message}>
        Please check your connection and try again.
      </Text>
    </View>
  );
};
export default NoInternetScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#093658",
    paddingHorizontal: 20,
  },
  animation: {
    width: 220,
    height: 220,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffff",
    marginTop: 20,
  },
  message: {
    fontSize: 16,
    color: "#ffff",
    textAlign: "center",
    marginTop: 5,
  },
});
