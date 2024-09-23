import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const MessageUserSelection = ({ route, navigation }) => {
    const { marketOfferId } = route.params;
    const [userId, setUserId] = useState(null);
    const [uniqueUsers, setUniqueUsers] = useState([]);
    const [privacy, setPrivacy] = useState(null);
    const [photoPath, setPhotoPath] = useState(null);
    const [userDetails, setUserDetails] = useState({}); // Store user details by UserId

    // Fetch AsyncStorage Id
    const fetchUserId = async () => {
        const id = await AsyncStorage.getItem('Id');
        setUserId(id);
    };

    // Fetch Privacy and PhotoPath
    const fetchMarketOfferDetails = async () => {
        try {
            const response = await axios.get(
                `https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=MarketOffer&Colname=Id&Colvalue=${marketOfferId}`
            );
            const data = response.data[0];
            setPrivacy(data.Privacy);
            setPhotoPath(data.Photopath); // Assuming 'Photopath' field is present
        } catch (error) {
            console.error('Error fetching market offer details:', error);
        }
    };

    // Fetch details for each user
    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(
                `https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=${userId}`
            );
            return response.data[0]; // Return the user details (Name, PrimaryContact)
        } catch (error) {
            console.error('Error fetching user details:', error);
            return null;
        }
    };

    // Filter unique SenderId and ReceiverId (excluding AsyncStorage Id)
    const fetchUniqueUsers = async () => {
        try {
            const response = await axios.get(
                `https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=MarketChat&Colname=MarketOfferId&Colvalue=${marketOfferId}`
            );
            const chats = response.data;

            // Filter out the entries where SenderId or ReceiverId equals AsyncStorage Id
            const filteredUsers = chats.filter(
                (chat) => chat.SenderId !== userId && chat.ReceiverId !== userId
            );

            // Collect unique SenderId and ReceiverId entries
            const uniqueUsers = Array.from(
                new Set(
                    filteredUsers.flatMap(chat => [chat.SenderId, chat.ReceiverId])
                )
            );

            // Filter out AsyncStorage Id
            const nonAsyncStorageUsers = uniqueUsers.filter(id => id !== userId);

            // Fetch details for each user and store them in state
            const userDetailsPromises = nonAsyncStorageUsers.map(async (id) => {
                const details = await fetchUserDetails(id);
                return { id, details };
            });

            const usersWithDetails = await Promise.all(userDetailsPromises);

            const userDetailMap = {};
            usersWithDetails.forEach(user => {
                userDetailMap[user.id] = user.details;
            });

            setUniqueUsers(nonAsyncStorageUsers);
            setUserDetails(userDetailMap);

        } catch (error) {
            console.error('Error fetching unique users:', error);
        }
    };

    useEffect(() => {
        fetchUserId();
        fetchMarketOfferDetails();
    }, []);

    useEffect(() => {
        if (userId && marketOfferId) {
            fetchUniqueUsers();
        }
    }, [userId, marketOfferId]);

    const renderUserCard = ({ item }) => {
        if (item != userId && userDetails[item]) {
            const { Name, PrimaryContact } = userDetails[item]; // Extract Name and PrimaryContact

            return (
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Message', { offerId: marketOfferId, ReceiverId: item, Privacy: privacy })}
                >
                    <Text style={styles.cardTitle}>Name: {Name}</Text>
                    <Text style={styles.cardSubtitle}>Contact: {PrimaryContact}</Text>
                </TouchableOpacity>
            );
        }
        return null; // If it matches AsyncStorage ID, don't show anything
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image source={require("../Images/drawer1.png")} style={styles.drawerIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Select Users</Text>
                <View style={styles.headerRight}>
                    <Icon name="notifications" size={24} color="#fff" />
                    <Icon name="search" size={24} color="#fff" style={{ marginLeft: 20 }} />
                </View>
            </View>
            <FlatList
                data={uniqueUsers}
                renderItem={renderUserCard}
                keyExtractor={(item) => item.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

export default MessageUserSelection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
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
    listContainer: {
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardSubtitle: {
        fontSize: 16,
        color: '#666',
    },
});
