
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "expo-router";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("Home");
  const navigation = useNavigation();

  const tabs = [
    { name: "Home", icon: "home", href: "home" },
    { name: "Portfolio", icon: "pie-chart", href: "" },
    { name: "Services", icon: "settings", href: "service" },
    { name: "Account", icon: "person", href: "profie" },
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* {renderScreen()} */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.name} style={styles.tabItem} onPress={() => {
            setActiveTab(tab.name);
            navigation.navigate(tab.href)
          }}>
            <Ionicons name={tab.icon} size={24} color={activeTab === tab.name ? "#FFA500" : "#FFFFFF"} />
            <Text style={[styles.tabLabel, { color: activeTab === tab.name ? "#FFA500" : "#FFFFFF" }]}>{tab.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#f5f5f5",
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#003366",
    height: 60,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
})
