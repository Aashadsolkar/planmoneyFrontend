import { StyleSheet, Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@components/Header";
import { COLORS } from "../../constants.js";
import Entypo from '@expo/vector-icons/Entypo';
import * as Animatable from 'react-native-animatable';

export default function Upcomping() {
  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
      <Header showBackButton={true} />
      <View style={styles.content}>
        <Animatable.View
          animation="bounceInDown"
          delay={300}
          duration={1000}
          useNativeDriver
        >
          <Entypo
            name="new"
            size={100}
            color={COLORS.secondaryColor}
            style={{ marginBottom: 20 }}
          />
        </Animatable.View>

        <Animatable.Text
          animation="pulse"
          iterationCount="infinite"
          duration={2000}
          style={styles.text}
        >
          Coming soon...
        </Animatable.Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardColor,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: COLORS.fontWhite,
    fontWeight: "600",
    fontSize: 20,
  },
});
