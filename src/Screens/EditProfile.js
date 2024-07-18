import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, RefreshControl, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = ({ route, navigation }) => {
    const { userInfo } = route.params;
    const [updatedUserInfo, setUpdatedUserInfo] = useState({ ...userInfo });
    const [refreshing, setRefreshing] = useState(false);

    const handleSave = async () => {

        console.log(updatedUserInfo.Id, updatedUserInfo.CompanyName, updatedUserInfo.OwnerName, updatedUserInfo.Address)

        const formdata = new FormData();
        formdata.append("Id", updatedUserInfo.Id);
        formdata.append("Name", updatedUserInfo.CompanyName);
        formdata.append("OwnerName", updatedUserInfo.OwnerName);
        formdata.append("Address", updatedUserInfo.Address);
        formdata.append("City", updatedUserInfo.City);
        formdata.append("State", updatedUserInfo.State);
        formdata.append("Country", updatedUserInfo.Country);
        formdata.append("Pincode", updatedUserInfo.Pincode);
        formdata.append("GSTNumber", updatedUserInfo.GSTNumber);

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/editcompany.php", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                 if(result === " Value Updated "){
                    UpdateAsyncStorage();
                 }else{
                    Alert.alert("Error in Updating values Please try again later")
                 }
                navigation.navigate('SelfInfo');
            })
            .catch((error) => console.error(error));




        // Navigate back to the SelfInfo screen
        navigation.navigate('SelfInfo');
    };

    const UpdateAsyncStorage = async() => {
        await AsyncStorage.setItem("AppUserId", updatedUserInfo.Email);
        await AsyncStorage.setItem("Name", updatedUserInfo.CompanyName);
        await AsyncStorage.setItem("OwnerName", updatedUserInfo.OwnerName);
        await AsyncStorage.setItem("Address", updatedUserInfo.Address);
        await AsyncStorage.setItem("Country", updatedUserInfo.Country);
        await AsyncStorage.setItem("State", updatedUserInfo.State);
        await AsyncStorage.setItem("City", updatedUserInfo.City);
        await AsyncStorage.setItem("Pincode", updatedUserInfo.Pincode);
        await AsyncStorage.setItem("PrimaryContact", updatedUserInfo.PrimaryContact);
        await AsyncStorage.setItem("RegistrationNumber", updatedUserInfo.RegistrationNumber);
        await AsyncStorage.setItem("GSTNumber", updatedUserInfo.GSTNumber);
        await AsyncStorage.setItem("LoomOrTrader", updatedUserInfo.Role);
        await AsyncStorage.setItem("CreatedOn", updatedUserInfo.Creation);
    }


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setUpdatedUserInfo({ ...userInfo });
        setRefreshing(false);
    }, [userInfo]);

    const renderInput = (label, value, key) => (
        <View style={styles.inputContainer} key={key}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={(text) => setUpdatedUserInfo({ ...updatedUserInfo, [key]: text })}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('SelfInfo')}
                >
                    <Image
                   source={require("../Images/back.png")}
                   style={{width:40,height:40,marginLeft:"2%"}}
                   />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                </View>
            </View>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {renderInput('Company Name', updatedUserInfo.CompanyName, 'CompanyName')}
                {renderInput('Owner Name', updatedUserInfo.OwnerName, 'OwnerName')}
                {renderInput('Address', updatedUserInfo.Address, 'Address')}
                {renderInput('Country', updatedUserInfo.Country, 'Country')}
                {renderInput('State', updatedUserInfo.State, 'State')}
                {renderInput('City', updatedUserInfo.City, 'City')}
                {renderInput('Pincode', updatedUserInfo.Pincode, 'Pincode')}
                {renderInput('GST No.', updatedUserInfo.GSTNumber, 'GSTNumber')}

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    header: {
        backgroundColor: "#003C43",
        flexDirection: "row",
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 10
    },
    backButton: {
        padding: "2%",
    },
    backButtonText: {
        color: "white",
        fontSize: 16
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 26,
        color: "white",
        fontWeight: '500',
        marginLeft:"-15%"
    },
    content: {
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        color: "#555"
    },
    saveButton: {
        backgroundColor: "#FF7722",
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 5
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: '500'
    }
});
