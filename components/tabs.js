import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { COLORS } from '../app/constants';

export default function ProtectedTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.secondaryColor,
        tabBarStyle: {
          backgroundColor: COLORS.primaryColor,
          paddingTop: 10,      // ✅ Apply top padding
          paddingBottom: 15,   // optional: give space from bottom
          height: 80,
          borderTopWidth: 1,           // ✅ Remove top border line
          elevation: 0,                // ✅ Remove shadow on Android
          shadowOpacity: 0,
          borderColor: COLORS.secondaryColor            // ✅ Remove shadow on iOS
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={25} name="chart-pie" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="service"
        options={{
          title: 'Services',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mutualFund"
        options={{
          title: 'Mututal Fund',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="savings" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user-circle-o" color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
