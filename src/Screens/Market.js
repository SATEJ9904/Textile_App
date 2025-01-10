import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Image, ScrollView, Dimensions } from 'react-native';
import { TextInput, Button, IconButton, Snackbar, Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; 

const { width, height } = Dimensions.get('window');

const Market = () => {
    const navigation = useNavigation(); 

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image source={require("../Images/drawer1.png")} style={styles.drawerIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Market Offers</Text>
                <View style={styles.headerRight}>
                    <Icon name="notifications" size={24} color="#fff" />
                    <Icon name="search" size={24} color="#fff" style={{ marginLeft: 20 }} />
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.content}>
                    <View style={styles.cardContainer}>
                        <Card style={styles.card}>
                            <Card.Cover source={require("../Images/Client2.jpg")} />
                            <Card.Content>
                                <Title style={styles.cardTitle}>Generate Offer</Title>
                                <Title style={styles.cardTitle2}>Here you can offer your yarn, greige fabric and finish fabric to all the market.</Title>

                            </Card.Content>
                            <Card.Actions>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('GenerateOffers')}
                                    style={styles.cardButton}
                                >
                                    <Text style={styles.cardButtonText}>Generate</Text>
                                </TouchableOpacity>
                            </Card.Actions>
                        </Card>
                    </View>
                    <View style={styles.cardContainer}>
                        <Card style={styles.card}>
                        <Card.Cover source={require("../Images/client1.jpg")} />
                        <Card.Content>
                                <Title style={styles.cardTitle}>View Offers</Title>
                                <Title style={styles.cardTitle2}>Here you can view offers of yarn, greige fabric, finish fabric made by others</Title>

                            </Card.Content>
                            <Card.Actions>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('ViewOffers')}
                                    style={styles.cardButton}
                                >
                                    <Text style={styles.cardButtonText}>View </Text>
                                </TouchableOpacity>
                            </Card.Actions>
                        </Card>
                    </View>
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
        justifyContent: 'space-between',
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
    headerRight: {
        flexDirection: 'row',
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
    cardContainer: {
        marginBottom: 20,
    },
    card: {
        borderRadius: 15,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardTitle2: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    cardButton: {
        backgroundColor: '#003C43',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    cardButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Market;