import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionSheet from 'react-native-actionsheet';
import { Animated } from 'react-native';

const YarnMsg = ({ route }) => {
  const { yarnId, userType } = route.params; // userType can be 'Loom', 'Trader', or 'Yarn'
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState(null);
  const [yarnDetails, setYarnDetails] = useState({ name: '', primaryContact: '' });
  const [currentUserId, setCurrentUserId] = useState(null);
  const actionSheetRef = useRef();
  
  // Example animated value with useNativeDriver
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userId = await AsyncStorage.getItem("Id");
    setCurrentUserId(userId);

    fetch('https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=' + yarnId)
      .then(response => response.json())
      .then(data => {
        data.map((item) => {
          setYarnDetails({ name: item.Name, primaryContact: item.PrimaryContact });
        })
      })
      .catch(error => console.error('Error fetching yarn details:', error));

    fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=YarnRate&Colname=LoomId&Colvalue=' + await AsyncStorage.getItem("Id"))
      .then(response => response.json())
      .then(data =>  {
        console.log(yarnId,userId)
        const filteredMessages = data.filter(msg => msg.YarnId == yarnId && msg.LoomId == userId && !msg.TraderId);
        setMessages(filteredMessages);
        console.log(filteredMessages)
    })
      .catch(error => console.error('Error fetching messages:', error));
  };

  const sendMessage = async () => {
    if (!image && !newMessage.trim()) {
      Alert.alert("Please enter a message or select an image");
    } else {
      try {
        const formdata = new FormData();
        formdata.append("YarnId", yarnId);
        formdata.append("LoomId", await AsyncStorage.getItem("Id"));
        formdata.append("TraderId", null);
        formdata.append("Message", newMessage);
        formdata.append("Sender", "L");

        if (image) {
          formdata.append("DesignPaper", {
            uri: image.path,
            type:  "image/jpeg",
            name: "DesignPaper.jpg",
          });
        }

        const requestOptions = {
          method: "POST",
          body: formdata,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          redirect: "follow",
        };

        const response = await fetch("https://textileapp.microtechsolutions.co.in/php/postyarnrate.php", requestOptions);
        const result = await response.text();
        console.log(result);
        fetchData();
        setNewMessage('');
        setImage(null);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const pickImage = () => {
    actionSheetRef.current.show();
  };

  const handleActionSheetPress = (index) => {
    if (index === 0) {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        setImage(image);
      });
    } else if (index === 1) {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        setImage(image);
      });
    }
  };

  return (
    <View
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{yarnDetails.name}</Text>
          <Text style={styles.headerSubtitle}>{yarnDetails.primaryContact}</Text>
        </View>
      </View>
      <FlatList
        data={messages}
        renderItem={({ item }) => {
          const isCurrentUser = item.Sender === "L";
          return (
            <View style={[
              styles.messageContainer,
              isCurrentUser ? styles.sentMessageContainer : styles.receivedMessageContainer
            ]}>
              <View style={[
                styles.messageBubble,
                isCurrentUser ? styles.sentMessageBubble : styles.receivedMessageBubble
              ]}>
                <Text style={[
                  styles.messageText,
                  isCurrentUser ? styles.sentMessageText : styles.receivedMessageText
                ]}>{item.Message}</Text>
                {item.DesignPaper && <Image source={{ uri: item.DesignPaper }} style={styles.messageImage} />}
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.Id}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        {image && (
          <Image
            source={{ uri: image.path }}
            style={styles.previewImage}
          />
        )}
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
          <Icon name="photo-library" size={24} color="#003C43" />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ActionSheet
        ref={actionSheetRef}
        title={'Select an option'}
        options={['Pick from Gallery', 'Capture Image', 'Cancel']}
        cancelButtonIndex={2}
        onPress={handleActionSheetPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DADBDD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#003C43',
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  sentMessageContainer: {
    justifyContent: 'flex-end',
  },
  receivedMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
  },
  sentMessageBubble: {
    backgroundColor: '#003C43',
  },
  receivedMessageBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#000',
  },
  messageImage: {
    width: 150,
    height: 150,
    marginTop: 5,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    padding: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f7f7f7',
    marginRight: 5,
    color:"#000"

  },
  iconButton: {
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#003C43',
    padding: 10,
    borderRadius: 20,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default YarnMsg;
