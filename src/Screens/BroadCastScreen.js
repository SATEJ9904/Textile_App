import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, Text, Alert, StyleSheet, Modal, Button, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import ModalComponent from 'react-native-modal';

const BroadCastScreen = ({ route, navigation }) => {
  const { userType } = route.params; // userType can be 'Loom' or 'Trader'
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [broadcastMessages, setBroadcastMessages] = useState([]);

  useEffect(() => {
    fetchBroadcastMessages();
    const interval = setInterval(fetchBroadcastMessages, 5000); // Call HandleFetch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchBroadcastMessages = async () => {
    const userId = await AsyncStorage.getItem("Id");
    fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=YarnRate&Colname=LoomId&Colvalue=' + await AsyncStorage.getItem("Id"))
      .then(response => response.json())
      .then(data => {
        const filteredMessages = data.filter(msg => !msg.YarnId && msg.LoomId == userId && !msg.TraderId);
        setBroadcastMessages(filteredMessages);
      })
      .catch(error => console.error('Error fetching broadcast messages:', error));

  };


  const sendMessage = async () => {
    console.log(await AsyncStorage.getItem("Id"), message)
    setLoading(true);
    const formdata = new FormData();
    formdata.append("LoomId", await AsyncStorage.getItem("Id"));
    formdata.append("Message", message);
    formdata.append("Sender", "L");
    formdata.append("YarnId", "");
    if (image) {
      formdata.append("DesignPaper", {
        uri: image.path,
        type: "image/jpeg",
        name: "DesignPaper.jpg",
      });
    }
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/postyarnrate.php", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setLoading(false);
        console.log(result);
        fetchBroadcastMessages();
        setMessage('');
        setImage(null);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(image);
    });
  };

  const captureImage = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(image);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../Images/back.png')} style={styles.drawerIcon} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Broadcast Message</Text>
        </View>
      </View>
      <FlatList
        data={broadcastMessages}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.Message}</Text>
            {item.DesignPaper && <Image source={{ uri: item.DesignPaper }} style={styles.messageImage} />}
          </View>
        )}
        keyExtractor={(item) => item.Id.toString()}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your requirement"
          placeholderTextColor="#999"
          multiline
        />
        <View style={styles.imageOptions}>
          <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
            <Icon name="photo-library" size={30} color="#003C43" />
            <Text style={styles.iconText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={captureImage}>
            <Icon name="photo-camera" size={30} color="#003C43" />
            <Text style={styles.iconText}>Camera</Text>
          </TouchableOpacity>
        </View>
        {image && <Image source={{ uri: image.path }} style={styles.imagePreview} />}
      </View>
      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
      {loading && (
        <ModalComponent isVisible={loading} backdropOpacity={0.5}>
          <View style={styles.loadingContainer}>
            <LottieView source={require('../Animation/car_animation.json')} autoPlay loop />
            <Text style={styles.loadingText}>Processing Your Requirements...</Text>
          </View>
        </ModalComponent>
      )}
      <ModalComponent isVisible={modalVisible} backdropOpacity={0.5}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <Button title="OK" onPress={() => setModalVisible(false)} />
        </View>
      </ModalComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
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
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  inputContainer: {
    padding: "5%",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    color: '#333',
    fontSize: 16,
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  iconButton: {
    alignItems: 'center',
    marginHorizontal: "3%"
  },
  iconText: {
    color: '#003C43',
    fontSize: 18,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  sendButton: {
    backgroundColor: '#003C43',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    justifyContent: "flex-end",
    alignItems: "flex-end",

  },
  messageText: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#003C43',
    padding: 10,
    borderRadius: 10,

  },
  messageImage: {
    width: 60,
    height: 60,
    marginTop: 5,
    borderRadius: 10,
  },
  messagesList: {
    padding: 10,
  },
});

export default BroadCastScreen;
