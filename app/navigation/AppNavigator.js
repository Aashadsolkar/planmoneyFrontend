import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "../screens/Home";
import Service from '../screens/Service';
import Checkout from '../screens/Checkout';
import Form1 from '../screens/Forms/Form1';
import Form2 from '../screens/Forms/Form2';
import For3 from '../screens/Forms/Form3';
import AaddharForm from '../screens/Forms/AaddharForm';
import FastLane from '../screens/FastLane';
import SIP from '../screens/SIP';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='home' component={Home}/>
            <Stack.Screen name='aadharForm' component={AaddharForm}/>
            <Stack.Screen name='service' component={Service}/>
            <Stack.Screen name='checkout' component={Checkout}/>
            <Stack.Screen name="fastlane" component={FastLane} />
            <Stack.Screen name="form1" component={Form1} />
            <Stack.Screen name="form2" component={Form2} />
            <Stack.Screen name="form3" component={For3} />
            <Stack.Screen name="sip" component={SIP} />
        </Stack.Navigator>
    );
}

export default AppNavigator;
