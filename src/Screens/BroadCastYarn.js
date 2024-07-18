import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BroadCastYarn = ({ navigation }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Call HandleFetch every 5 seconds

        return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=YarnRate');
      const data = await response.json();
      const filteredMessages = data.filter(msg => msg.YarnId === null);

      // Fetch additional details for each message
      const messagesWithDetails = await Promise.all(filteredMessages.map(async (msg) => {
        const senderId = msg.Sender === 'L' ? msg.LoomId : msg.TraderId;
        const senderDetails = await fetchSenderDetails(senderId);
        return {
          ...msg,
          ...senderDetails,
        };
      }));

      setMessages(messagesWithDetails);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchSenderDetails = async (senderId) => {
    try {
      const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=${senderId}`);
      const data = await response.json();

      // Map the data to extract Name and PrimaryContact
      const senderDetails = data.map((item) => ({
        Name: item.Name,
        PrimaryContact: item.PrimaryContact,
      }));

      // Assuming we want the first item's details in the array
      return senderDetails[0];
    } catch (error) {
      console.error('Error fetching sender details:', error);
      return {};
    }
  };
  const handleCardPress = (item) => {
    const yarnId = item.Sender === 'L' ? item.LoomId : item.TraderId;
    if (item.Sender === 'L') {
      navigation.navigate('YarnTmsg', { yarnId });
    } else if (item.Sender === 'T') {
      navigation.navigate('TraderChatDisplay', { yarnId });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
      <Text style={styles.senderText}>{item.Sender === 'L' ? 'Loom' : 'Trader'}</Text>
      <Text style={styles.nameText}>{item.Name}</Text>
      <Text style={styles.messageText}>{item.Message}</Text>
      {item.DesignPaper && <Image source={{ uri: item.DesignPaper }} style={styles.messageImage} />}
      <Text style={styles.contactText}>{item.PrimaryContact}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("LoomMsgs")}>
          <Image source={require('../Images/back.png')} style={styles.drawerIcon} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Broadcast Messages</Text>
        </View>
      </View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.Id.toString()}
        contentContainerStyle={styles.messagesList}
      />
    </SafeAreaView>
  );
};

export default BroadCastYarn;

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
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  senderText: {
    fontSize: 18,
    color: '#003C43',
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: 16,
    color: '#003C43',
    marginVertical: 5,
    marginTop:"5%"
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  messageImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  messagesList: {
    paddingBottom: 20,
  },
});
