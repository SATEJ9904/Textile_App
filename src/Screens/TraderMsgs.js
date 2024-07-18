import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TraderMsgs = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        HandleFetch();
        const interval = setInterval(HandleFetch, 5000); // Call HandleFetch every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const HandleFetch = async () => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
    
        try {
            const id = await AsyncStorage.getItem("Id");
            const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=YarnRate&Colname=YarnId&Colvalue=${id}`, requestOptions);
            const result = await response.json();
    
            // Use a Set to filter out duplicate items based on unique IDs
            const uniqueResults = Array.from(new Set(result.map(item => item.TraderId)))
                .map(id => result.find(item => item.TraderId === id));
    
            setMessages(uniqueResults);
            console.log(uniqueResults);
    
            const userPromises = uniqueResults.map(item => HandleFetchUser(item.TraderId));
            const usersData = await Promise.all(userPromises);
    
            const filteredUsers = usersData.flat().filter(user => user.LoomOrTrader === 'T');
            setUsers(filteredUsers);
        } catch (error) {
            console.error(error);
        }
    };
    

    const HandleFetchUser = async (Id) => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        try {
            const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=${Id}`, requestOptions);
            const result = await response.json();
            console.log(result);
            return result;
        } catch (error) {
            console.error(error);
            return [];
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image source={require('../Images/drawer1.png')} style={styles.drawerIcon} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Loom Messages</Text>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={users}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <TouchableOpacity onPress={() => navigation.navigate('TraderChatDisplay', { yarnId: item.Id })} style={{ padding: '5%' }}>
                                <Text style={styles.textmap}>{item.Name}</Text>
                                <Text style={styles.textmap}>{item.PrimaryContact}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.Id.toString()}
                />
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.privateMessagesButton}>
                    <Text style={styles.privateMessagesText}>Private Messages</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('BroadCastYarn')} style={styles.broadcastMessagesButton}>
                    <Text style={styles.broadcastMessagesText}>Broadcast Messages</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default TraderMsgs;

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#003C43',
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
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
        fontWeight: '500',
    },
    card: {
        margin: '5%',
        backgroundColor: '#003C43',
        borderRadius: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    textmap: {
        color: '#fff',
        fontSize: 17,
        marginBottom: 5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
    },
    privateMessagesButton: {
        backgroundColor: '#003C43',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderWidth: 0.5,
        borderColor: 'grey',
    },
    privateMessagesText: {
        color: '#fff',
        fontSize: 18,
    },
    broadcastMessagesButton: {
        backgroundColor: '#fff',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderWidth: 0.5,
        borderColor: 'grey',
    },
    broadcastMessagesText: {
        color: '#003C43',
        fontSize: 18,
    },
});
