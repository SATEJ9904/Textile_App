import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window'); // Get screen width

const MessageSelections = () => {
    const [chatData, setChatData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    // Fetch Sender's chat data using SenderId
    const fetchMarketChats = async (senderId) => {
        try {
            const response = await axios.get(
                `https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=MarketChat&Colname=ReceiverId&Colvalue=${senderId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching chat data:', error);
            return [];
        }
    };

    // Fetch MarketOffer details using MarketOfferId
    const fetchMarketOfferDetails = async (marketOfferId) => {
        try {
            const response = await axios.get(
                `https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=MarketOffer&Colname=Id&Colvalue=${marketOfferId}`
            );
            return {
                description: response.data[0].Description,
                photopath: response.data[0].Photopath,
                privacy: response.data[0].Privacy,
            };
        } catch (error) {
            console.error('Error fetching market offer details:', error);
            return { description: 'Unknown', photopath: null, privacy: null };
        }
    };

    // Fetch data and combine MarketOffer details for each chat
    const fetchData = async () => {
        try {
            const senderId = await AsyncStorage.getItem('Id');
            if (senderId) {
                const marketChats = await fetchMarketChats(senderId);

                // Filter out duplicates based on MarketOfferId
                const uniqueChats = marketChats.filter(
                    (item, index, self) => index === self.findIndex((chat) => chat.MarketOfferId === item.MarketOfferId)
                );

                // Fetch MarketOffer details for each chat
                const chatDataPromises = uniqueChats.map(async (chat) => {
                    const { description, photopath, privacy } = await fetchMarketOfferDetails(chat.MarketOfferId);
                    return { ...chat, Description: description, Photopath: photopath, Privacy: privacy };
                });

                const updatedChatData = await Promise.all(chatDataPromises);
                setChatData(updatedChatData);
            }
        } catch (error) {
            console.error('Error in fetchData:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderChatCard = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { width: width * 0.9 }]} // Make the card width 90% of the screen width
            onPress={() => navigation.navigate('MessageUserSelection', {
                marketOfferId: item.MarketOfferId,
                senderId: item.SenderId,
                receiverId: item.ReceiverId
            })}
        >
            <Text style={styles.cardTitle}>Offer ID: {item.MarketOfferId}</Text>
            <Text style={styles.cardSubtitle}>Description: {item.Description}</Text>
            {item.Photopath && (
                <Image
                    source={{ uri: item.Photopath }}
                    style={[styles.imageThumbnail, { width: width * 0.3, height: width * 0.3 * 0.75 }]} // Adjust image size based on screen width
                />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={{ padding: '2%' }} onPress={() => navigation.goBack()}>
                    <Image source={require('../Images/back.png')} style={styles.drawerIcon} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Offer List</Text>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#003C43" />
            ) : (
                <FlatList
                    data={chatData}
                    renderItem={renderChatCard}
                    keyExtractor={(item) => item.MarketOfferId.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            )}
            <View style={{ flexDirection: "row", borderWidth: 1, height: 50, borderColor: "#0A5D47" }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
                    <TouchableOpacity
                        style={{ justifyContent: "center", alignItems: "center", }}
                        onPress={() => navigation.navigate("ViewOffers")}
                    >
                        <Text style={{ color: "#003C43", fontSize: 20 }}>View Offers</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity
                        style={{ width: '100%', height: '100%', backgroundColor: "#003C43", justifyContent: "center", alignItems: "center", }}
                    >
                        <Text style={{ color: "#fff", fontSize: 20, }}>Messages</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default MessageSelections;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
    },
    header: {
        backgroundColor: '#003C43',
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    drawerIcon: {
        width: 28,
        height: 22,
        marginLeft: 10,
    },
    headerTitleContainer: {
        flex: 0.9,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 26,
        color: 'white',
        fontWeight: 'bold',
        letterSpacing: 1,
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
        color: '#777',
        marginTop: 5,
    },
    imageThumbnail: {
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 20,
    },
});
