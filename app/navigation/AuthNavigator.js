import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MobileLogin from "../screens/MobileLogin";
import Login from "../screens/Login";
import Registor from '../screens/Registor';
import IntorScreen from '../screens/IntorScreen';
import Form1 from '../screens/Forms/Form1';
import Form2 from '../screens/Forms/Form2';
import For3 from '../screens/Forms/Form3';


const Stack = createNativeStackNavigator()

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="form1" component={Form1} />
            <Stack.Screen name="form2" component={Form2} />
            <Stack.Screen name="form3" component={For3} />
            <Stack.Screen name="intorScreen" component={IntorScreen} />
            <Stack.Screen name="registor" component={Registor} />
        </Stack.Navigator>
    )
}
export default AuthNavigator