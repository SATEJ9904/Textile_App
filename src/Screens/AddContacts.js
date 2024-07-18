import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const AddContact = ({ navigation }) => {
    const [ownerNo, setOwnerNo] = useState('');
    const [managerNo, setManagerNo] = useState('');
    const [otherNo, setOtherNo] = useState('');

    const handleSubmit = async () => {
        const Id = await AsyncStorage.getItem("Id");

        const formdata = new FormData();
        formdata.append("LoomTraderDetailId", Id);
        formdata.append("OwnerNo", ownerNo);
        formdata.append("ManagerNo", managerNo);
        formdata.append("OtherNo", otherNo);

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/postcontact.php", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                Alert.alert("Contact Added Successfully!");
                navigation.goBack(); // Navigate back to the previous screen
            })
            .catch((error) => {
                console.error(error);
                Alert.alert("Error adding contact.");
            });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add Contact</Text>

            <TextInput
                style={styles.input}
                placeholder="Owner Number"
                value={ownerNo}
                onChangeText={setOwnerNo}
            />
            <TextInput
                style={styles.input}
                placeholder="Manager Number"
                value={managerNo}
                onChangeText={setManagerNo}
            />
            <TextInput
                style={styles.input}
                placeholder="Other Number"
                value={otherNo}
                onChangeText={setOtherNo}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#E5E5E5',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#003C43',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        width: '90%',
        padding: 15,
        borderColor: '#003C43',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 25,
        backgroundColor: '#FFFFFF',
        fontSize: 16,
        color: '#003C43',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    submitButton: {
        backgroundColor: '#003C43',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '90%',
        marginTop: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddContact;
