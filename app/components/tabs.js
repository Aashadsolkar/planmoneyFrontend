import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { COLORS } from '../constants';

export default function ProtectedTabs() {
  return (
    <Tabs screenOptions={{
      headerShown: false, tabBarActiveTintColor: `${COLORS.secondaryColor}`, tabBarStyle: {
        backgroundColor: COLORS.primaryColor,
      }
    }} >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,

        }}
      />
      <Tabs.Screen
        name="service"
        options={{
          title: 'Service',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Account', tabBarIcon: ({ color }) => <FontAwesome size={28} name="user-circle-o" color={color} />, }}
      />
      <Tabs.Screen
        name="sip"
        options={{ title: 'SIP', href: null }}
      />
    </Tabs>
  );
}
