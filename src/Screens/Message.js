import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, Dimensions, KeyboardAvoidingView, RefreshControl, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';

const Message = ({ route }) => {
    const { Message, offerId, Privacy, Photopath, ReceiverId } = route.params;
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [name, setName] = useState('');
    const [primaryContact, setPrimaryContact] = useState('');
    const [profileImg, setProfileImg] = useState('');
    const [renderedImage, setRenderedImage] = useState(null);
    const [replyToMessage, setReplyToMessage] = useState(null);
    const [senderId, setSenderId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [UserId, setUserId] = useState(null);
    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        setRenderedImage(Photopath);
        setUserId(AsyncStorage.getItem("Id"))
        console.log("Privacy",Privacy)
    }, []);

    const fetchOfferDetails = async () => {
        try {
            const sendersId = await AsyncStorage.getItem("Id");
            setSenderId(sendersId);
    
            // Fetch chat details based on SenderId and ReceiverId
            const response = await fetch(
                `https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=MarketChat&Colname=SenderId&Colvalue=${sendersId}&Colname2=ReceiverId&Colvalue2=${ReceiverId}`
            );
            const data = await response.json();
    
          
    
            // Filter chats related to the specific offer
            const filteredChats = data.filter(chat => chat.MarketOfferId === offerId);
            setChatHistory(filteredChats);
            console.log("Chat Response = ", filteredChats);
    
            // Ensure data is not empty before destructuring
            if (data.length > 0) {
                const { ReceiverId, SenderId } = data[0];
                const nonNullId = ReceiverId || SenderId;
    
                if (nonNullId) {
                    fetchUserDetails(nonNullId); // Fetch user details if a valid ID exists
                } else {
                    console.log('No valid user ID found.');
                }
            } else {
                console.log('No chat history found.');
            }
        } catch (error) {
            console.error('Failed to fetch offer details:', error);
        }
    };
    

    const fetchUserDetails = async (id) => {
        console.log(id)
        try {
            const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=${ReceiverId}`);
            const userDetails = await response.json();
            console.log("User Details : ",userDetails)

            if (userDetails.length !== 0 && Privacy === 1 ) {
                setName(userDetails[0].Name);
                setPrimaryContact(userDetails[0].PrimaryContact);
                setProfileImg(userDetails[0].Profilepic);
            } else {
                setName('Privacy applied');
            }
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        }
    };

    useEffect(() => {
        if (Message) {
            setMessage(`I Need More Information about \n\n${Message}`);
        }
        fetchOfferDetails();
    }, [Message, offerId]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOfferDetails();
        setRefreshing(false);
    };

    const sendMessage = async () => {
        const sendersId = await AsyncStorage.getItem("Id");

        const formdata = new FormData();
        formdata.append("MarketOfferId", offerId);
        formdata.append("SenderId", sendersId);
        formdata.append("ReceiverId", ReceiverId);
        formdata.append("Message", message);
        formdata.append("Replay", replyToMessage || "");
        formdata.append("File", renderedImage ? { uri: renderedImage, type: 'image/jpeg', name: 'image.jpg' } : "");

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/postmarketchat.php", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));

        setMessage('');
        setRenderedImage(null);
        setReplyToMessage(null);
        fetchOfferDetails();
    };

    const renderMessage = ({ item }) => {
        const isSender = item.SenderId == UserId._j; 
        const isReceiver = item.ReceiverId == UserId._j; 
    
        if (!isSender && !isReceiver) {
            return null; 
        }
    
        return (
            <Swipeable
                renderRightActions={() => (
                    <TouchableOpacity
                        onPress={() => setReplyToMessage(item.Message)} 
                        style={styles.replyButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                )}
            >
                <View
                    style={[
                        styles.messageBubble,
                        isSender ? styles.myMessage : styles.otherMessage,
                    ]}
                >
                    {item.File && (
                        <Image
                            source={{ uri: item.File }}
                            style={styles.sentImage}
                        />
                    )}
                    <Text style={isSender ? styles.myMessageText : styles.otherMessageText}>
                        {item.Message}
                    </Text>
                </View>
            </Swipeable>
        );
    };

    return (
        <View style={styles.container} behavior="padding">
            <View style={styles.userInfoContainer}>
                <Image
                    source={profileImg ? { uri: profileImg } : require('../Images/user2.png')}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <View style={{ marginLeft: '4%' }}>
                    <Text style={styles.userInfoText}>{name}</Text>
                    <Text style={styles.userInfoText}>{primaryContact}</Text>
                </View>
            </View>

            <FlatList
                data={chatHistory}
                renderItem={renderMessage}
                keyExtractor={(item) => item.Id.toString()}
                contentContainerStyle={styles.chatContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />

            {replyToMessage && (
                <View style={styles.replyPreview}>
                    <Text style={styles.replyPreviewText}>Replying to: {replyToMessage}</Text>
                    <TouchableOpacity onPress={() => setReplyToMessage(null)}>
                        <Ionicons name="close-circle" size={24} color="#006A6B" />
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.inputContainer}>
                {renderedImage && (
                    <Image
                        source={{ uri: renderedImage }}
                        style={{ width: 40, height: 40 }}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor={"#000"}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                />
                <TouchableOpacity onPress={sendMessage}>
                    <Ionicons name="send" size={24} color="#006A6B" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Message;

const styles = StyleSheet.create({
    // Style definitions here
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    chatContainer: {
        padding: 10,
    },
    messageBubble: {
        maxWidth: '80%',
        borderRadius: 15,
        padding: 10,
        marginVertical: 5,
    },
    myMessage: {
        backgroundColor: '#003C43',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#ddd',
        alignSelf: 'flex-start',
    },
    myMessageText: {
        color: 'white',
    },
    otherMessageText: {
        color: 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    input: {
        flex: 1,
        color:"#000",
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        backgroundColor: '#fff',
    },
    replyButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#006A6B',
        width: 50,
        height: '100%',
    },
    replyPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e1e1e1',
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    replyPreviewText: {
        flex: 1,
        color: '#333',
    },
    emojiSelectorContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#003C43',
    },
    userInfoText: {
        color: 'white',
        fontSize: 16,
    },
    sentImage: {
        width: 150,
        height: 150,
        marginTop: 5,
        borderRadius: 10,
    },
});
