import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "../screens/Login";
import Registor from '../screens/Registor';
import IntorScreen from '../screens/IntorScreen';

const Stack = createNativeStackNavigator()

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="intorScreen" component={IntorScreen} />
            <Stack.Screen name="registor" component={Registor} />
        </Stack.Navigator>
    )
}
export default AuthNavigator