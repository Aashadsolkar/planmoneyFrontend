import { FontAwesome, FontAwesome6, Foundation, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { COLORS } from "../app/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProtectedTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.secondaryColor,
        tabBarStyle: {
          backgroundColor: COLORS.primaryColor,
          paddingTop: 10,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 15,
          height: insets.bottom > 0 ? 70 + insets.bottom : 65,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
          borderColor: COLORS.secondaryColor,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="bonds"
        options={{
          title: "Bonds",
          tabBarIcon: ({ color }) => (
            <Foundation name="shield" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="service"
        options={{
          title: "Services",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="book" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="mutualFund"
        options={{
          title: "Mutual Fund",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="savings" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user-circle-o" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
