import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Image, ScrollView, Dimensions } from 'react-native';
import { TextInput, Button, IconButton, Snackbar, Card, Title } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-crop-picker';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const { width, height } = Dimensions.get('window');

const KnottingOffersL = () => {
    const navigation = useNavigation(); // Initialize navigation


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image source={require("../Images/drawer1.png")} style={styles.drawerIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Knotting Offers</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.content}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('GenerateKnottingoffers')}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Generate Knotting Offer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('KnottingResponses')}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Knotting Responses</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: "#003C43",
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        flexDirection: "row",
        elevation: 5,
    },
    drawerIcon: {
        width: 28,
        height: 22,
    },
    headerText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: "20%",
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    scrollViewContent: {
        paddingHorizontal: '5%',
        paddingVertical: '10%',
    },
    content: {
        padding: '5%',
        backgroundColor: 'white',
        borderRadius: 15,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    button: {
        backgroundColor: '#003C43',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default KnottingOffersL;
