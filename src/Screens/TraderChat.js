import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, RefreshControl, Modal, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageEditor from '@react-native-community/image-editor'; // For image editing
import GestureRecognizer from 'react-native-swipe-gestures'; // For swipe gestures

const TraderChat = ({ route }) => {
  const { yarnId, userType } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState(null);
  const [yarnDetails, setYarnDetails] = useState({ name: '', primaryContact: '' });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [replyTo, setReply] = useState(null);

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

    fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=YarnRate&Colname=TraderId&Colvalue=' + userId)
      .then(response => response.json())
      .then(data =>   {
        console.log(yarnId,userId)
        const filteredMessages = data.filter(msg => msg.YarnId == yarnId && !msg.LoomId && msg.TraderId== userId );
        setMessages(filteredMessages);
        console.log(filteredMessages)
    })
      .catch(error => console.error('Error fetching messages:', error));
      setRefreshing(false);

  };

  const sendMessage = async () => {
    if (!newMessage && !image) {
      Alert.alert('Error', 'Cannot send empty message.');
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append("YarnId",yarnId);
      formdata.append("LoomId",null );
      formdata.append("TraderId", await AsyncStorage.getItem("Id") );
      formdata.append("Message", newMessage);
      formdata.append("Sender", "T");
      formdata.append("Reply", replyTo?.Message);

      if (image) {
        formdata.append("DesignPaper", {
          uri: image.path,
          type: "image/jpg",
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
      setReply(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const selectImageOption = () => {
    Alert.alert(
      "Choose an option",
      "",
      [
        {
          text: "Capture Image",
          onPress: () => captureImage(),
        },
        {
          text: "Select from Gallery",
          onPress: () => selectFromGallery(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };


  const captureImage = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage({ path: image.path });
    }).catch(error => {
      console.error(error);
      setImage(null);
    });
  };

  const selectFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage({ path: image.path });
    }).catch(error => {
      console.error(error);
      setImage(null);
    });
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);

  };

  const viewImage = (imageUri) => {
    setSelectedImage(imageUri);
  };

  const replyToMessage = (message) => {
    setReply(message);
  };

  const handleSwipe = (direction, message) => {
    if (direction === 'SWIPE_LEFT' || direction === 'SWIPE_RIGHT') {
      replyToMessage(message);
    }
  };

  const renderRepliedMessage = (replyMessage) => {
    if (!replyMessage || replyMessage === null || replyMessage === "null") return null;

    return (
      <View style={styles.repliedMessageContainer}>
        <Text style={styles.repliedMessageText}>{replyMessage}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{yarnDetails.name}</Text>
          <Text style={styles.headerSubtitle}>{yarnDetails.primaryContact}</Text>
        </View>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Icon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={messages}
        renderItem={({ item }) => {
          const isCurrentUser = item.Sender === "T";
          return (
            <GestureRecognizer
              onSwipe={(direction) => handleSwipe(direction, item)}
              style={[
                styles.messageContainer,
                isCurrentUser ? styles.sentMessageContainer : styles.receivedMessageContainer
              ]}
            >
              
              <TouchableOpacity
                onLongPress={() => replyToMessage(item)}
                onPress={() => item.DesignPaper && viewImage(item.DesignPaper)}
                style={[
                  styles.messageBubble,
                  isCurrentUser ? styles.sentMessageBubble : styles.receivedMessageBubble
                ]}
              >
                <Text style={styles.senderName}>{isCurrentUser ? 'You' : yarnDetails.name}</Text>
                {renderRepliedMessage(item.Reply)}
                <Text style={[
                  styles.messageText,
                  isCurrentUser ? styles.sentMessageText : styles.receivedMessageText
                ]}>{item.Message}</Text>
                {item.DesignPaper && <Image source={{ uri: item.DesignPaper }} style={styles.messageImage} />}
              </TouchableOpacity>
            </GestureRecognizer>
          );
        }}
        keyExtractor={(item) => item.Id.toString()}
        contentContainerStyle={styles.messagesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    {replyTo && replyTo.Message && (
        <View style={styles.replyContainer}>
          <Text style={styles.replyLabel}>Replying to:</Text>
          <Text style={styles.replyMessage}>{replyTo.Message}</Text>
          <TouchableOpacity onPress={() => setReply(null)}>
            <Icon name="close" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputContainer}>
        {image && (
          <Image source={{ uri: image.path }} style={styles.selectedImage} />
        )}
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity onPress={selectImageOption} style={styles.iconButton}>
          <Icon name="photo-library" size={24} color="#003C43" />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {selectedImage && (
        <Modal visible={true} transparent={true} onRequestClose={() => setSelectedImage(null)}>
          <View style={styles.modalContainer}>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.closeButton}>
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DADBDD',  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#006064',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#B2DFDB',
    fontSize: 14,
  },
  refreshButton: {
    padding: 10,
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
    alignItems: 'flex-end',
    flexDirection:"column"
  },
  senderName: {
    color: 'orange',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  receivedMessageContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection:"column"

  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
  },
  sentMessageBubble: {
    backgroundColor: '#006064',
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
  repliedMessageContainer: {
    backgroundColor: '#5A969D',
    borderRadius: 10,
    padding: 5,
    marginBottom: 5,
    maxWidth: '70%',
  },
  repliedMessageText: {
    fontSize: 14,
    color: '#ffffff',
  },
  repliedMessageImage: {
    width: 100,
    height: 100,
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
    color: "#000",
  },
  selectedImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  iconButton: {
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#006064',
    padding: 10,
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  replyLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    color:"#333"
  },
  replyMessage: {
    flex: 1,
    color:"#333"
  },
});

export default TraderChat;
