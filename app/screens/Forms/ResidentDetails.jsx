import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../constants'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useNavigation } from 'expo-router'

const ResidentDetails = () => {
    const [selected, setSelected] = useState("yes");
    const [fatcaSelect, setFatcaSelect] = useState(null);
    const [country, setCountry] = useState("");
    const navigation = useNavigation();

    const handleSubmit = () => {
        navigation.navigate('agreementForm');
    }

    const renderCheckbox = (label) => {
        const isChecked = selected === label;
        return (
            <TouchableOpacity onPress={() => setSelected(label)} style={styles.option}>
                <View style={[styles.checkbox, isChecked && styles.checkedBox]}>
                    {isChecked && <View style={styles.innerCheck} />}
                </View>
                <Text style={styles.label}>{label === 'yes' ? 'Yes' : 'No'}</Text>
            </TouchableOpacity>
        );
    };

    const renderFatcaCheckbox = (label) => {
        const isChecked = fatcaSelect === label;
        return (
            <TouchableOpacity onPress={() => setFatcaSelect(label)} style={styles.option}>
                <View style={[styles.checkbox, isChecked && styles.checkedBox]}>
                    {isChecked && <View style={styles.innerCheck} />}
                </View>
                {/* <Text style={styles.label}>{label === 'yes' ? 'Yes' : 'No'}</Text> */}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor, padding: 20 }}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{padding: 20}}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={{ fontSize: 20, color: 'white' }}>←</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 12, fontWeight: "600", color: COLORS.fontWhite, marginTop: 20 }}>
                    Step <Text style={{ color: COLORS.secondaryColor }}>1</Text> to 6
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "600", color: COLORS.fontWhite, marginBottom: 20 }}>
                    Tax Residence Details
                </Text>

                <Text style={{ fontSize: 16, fontWeight: "400", color: COLORS.fontWhite, marginBottom: 10 }}>
                    Are you Resident of India?
                </Text>
                <View style={{ flexDirection: "row", gap: 15, marginBottom: 20 }}>
                    {renderCheckbox('yes')}
                    {renderCheckbox('no')}
                </View>

                {selected === "no" && (
                    <>
                        <Input label="Country" value={"Inida"} onChangeText={setCountry} />
                        <View style={{ flexDirection: "row", gap: 5, marginBottom: 20, alignItems: "flex-start", marginTop: 30 }}>
                            {renderFatcaCheckbox('yes')}
                            <Text style={{ fontSize: 16, fontWeight: "400", color: COLORS.fontWhite }}>
                                If yes, provide FATCA Declaration and Compliance Documents (as applicable).
                            </Text>
                        </View>
                    </>
                )}
            </ScrollView>
            <Button onClick={handleSubmit} label="Next" gradientColor={['#D36C32', '#F68F00']} buttonStye={{marginHorizontal: 20}} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    option: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        height: 24,
        width: 24,
        borderWidth: 2,
        borderColor: '#444',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedBox: {
        backgroundColor: '#007AFF',
    },
    innerCheck: {
        width: 10,
        height: 10,
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    label: {
        fontSize: 16,
        color: COLORS.fontWhite
    },
    backButton: {
        marginBottom: 10,
    }
});

export default ResidentDetails;
