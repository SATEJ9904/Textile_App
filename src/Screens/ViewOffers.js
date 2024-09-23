import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  Animated,
  Easing,
  Modal,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
  Button
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';


const { width, height } = Dimensions.get('window');


const supportedURL = 'https://google.com';

const unsupportedURL = 'slack://open?team=123456';

const ViewOffers = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchOffers = async () => {
      await requestStoragePermission(); // Request storage permission for Android devices

      try {
        const response = await fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=MarketOffer');
        const data = await response.json();

        const updatedOffers = await Promise.all(
          data.map(async (offer) => {
            if (offer.Privacy === 1) {
              const id = offer.TraderId || offer.LoomId || offer.YarnId;

              if (id) {
                try {
                  const nameResponse = await fetch(`https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=${id}`);
                  const nameData = await nameResponse.json();
                  console.log("New Response = ", nameData)

                  offer.Name = nameData[0].Name;

                } catch (error) {
                  console.log('Failed to fetch name:', error);
                }
              }
            }
            return offer; // Return the updated offer
          })
        );

        // Step 3: Update the state with the updated offers (with names if available)
        setOffers(updatedOffers);
        setFilteredOffers(updatedOffers);
      } catch (error) {
        // Show an alert if fetching offers fails
        Alert.alert('Error', 'Failed to fetch offers');
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredOffers(offers);
    } else {
      const filtered = offers.filter((offer) =>
        offer.Description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOffers(filtered);
    }
  }, [searchQuery, offers]);

  const openModal = (offer) => {
    setSelectedOffer(offer);
    setModalVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedOffer(null);
    });
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to download documents',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const handleDocumentDownload = async (document) => {
    console.log("permission modal called")
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Error', 'Storage permission denied.');
        return;
      }

      const { config, fs } = RNFetchBlob;
      const date = new Date();
      const fileName = document.split('/').pop(); // Get the file name from the URL
      const downloadDest = `${fs.dirs.DownloadDir}/${fileName}`; // Save to the device's Download directory

      const downloadOptions = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true, // Use native Android download manager
          notification: true,
          path: downloadDest, // Set the destination path
          description: 'Downloading document...',
          mediaScannable: true, // Makes file visible in the downloads app
        },
      };

      config(downloadOptions)
        .fetch('GET', document)
        .then((res) => {
          Alert.alert('Success', 'Document downloaded successfully!');
          // handleDocumentPreview(document); // Optionally preview the file
        })
        .catch((error) => {
          console.error('Document download error:', error);
          Alert.alert('Error', 'Document download failed.');
        });
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download the document.');
    }
  };



  const handleDocumentPreview = async (documentUrl) => {
    console.log(documentUrl)
    Linking.canOpenURL(documentUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(documentUrl);
        } else {
          Alert.alert("Can't open this URL");
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return <Button title={children} onPress={handlePress} />;
  };

  const handleSendMessage = (offer) => {
    let idParam;
    let idName;
    let receiverId; // Define the receiverId to store the non-nullable ID

    if (offer.TraderId) {
      idParam = { TraderId: offer.TraderId };
      idName = 'TraderId';
      receiverId = offer.TraderId; // Set TraderId as the ReceiverId
    } else if (offer.LoomId) {
      idParam = { LoomId: offer.LoomId };
      idName = 'LoomId';
      receiverId = offer.LoomId; // Set LoomId as the ReceiverId
    } else if (offer.YarnId) {
      idParam = { YarnId: offer.YarnId };
      idName = 'YarnId';
      receiverId = offer.YarnId; // Set YarnId as the ReceiverId
    } else {
      Alert.alert('Error', 'No valid ID available for this offer');
      return;
    }

    // Trigger an alert for confirmation
    Alert.alert(
      'Message',
      `You are messaging about offer: ${offer.Description}`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Next',
          onPress: () => {
            // Navigate to the Message screen with required parameters
            navigation.navigate('Message', {
              offerId: offer.Id,
              Message: offer.Description,
              Privacy: offer.Privacy,
              Photopath: offer.Photopath,
              idType: idName, // Include the name of the ID type
              ReceiverId: receiverId, // Pass the non-nullable ReceiverId
              ...idParam // Pass the specific ID value here as well
            });
            setModalVisible(false);
          },
        },
      ],
      { cancelable: true }
    );
  };




  const renderOfferCard = ({ item }) => {
    const offerType = item.OfferOptId === 1 ? 'BUY' : 'SELL';
    const offerBackgroundColor = item.OfferOptId === 1 ? '#4CAF50' : '#F44336';
    const offerTextColor = '#FFFFFF';

    return (
      <TouchableOpacity onPress={() => openModal(item)} activeOpacity={0.8}>
        <View style={styles.cardContainer}>
          <View
            style={[
              styles.typeLabel,
              {
                backgroundColor: offerBackgroundColor,
              },
            ]}
          >
            <Text style={[styles.typeLabelText, { color: offerTextColor }]}>
              {offerType}
            </Text>
          </View>
          {item.Name && (
            <Text style={styles.offerNameText}>
              Offer By: {item.Name}
            </Text>
          )}
          <Text style={styles.descriptionText} numberOfLines={2}>
            {item.Description}
          </Text>

        </View>
      </TouchableOpacity>
    );
  };
  const animatedStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
    opacity: animation,
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#003C43', '#006A6B']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../Images/back.png')}
            style={styles.drawerIcon}
          />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>View Offers</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#003C43"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search offers..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      <FlatList
        data={filteredOffers}
        renderItem={renderOfferCard}
        keyExtractor={(item) => item.Id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.noOffersText}>No offers found.</Text>
        }
      />

      {selectedOffer && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="none"
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <Animated.View style={[styles.modalContainer, animatedStyle]}>
              <ScrollView>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Ionicons name="close" size={30} color="#003C43" />
                </TouchableOpacity>
                <Text style={styles.modalProductText}>
                  {selectedOffer.ProductOptId}
                </Text>
                <Text style={styles.modalDescriptionText}>
                  {selectedOffer.Description}
                </Text>
                {selectedOffer.Photopath && (
                  <Image
                    source={{ uri: selectedOffer.Photopath }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                )}
                {selectedOffer.Document && (
                  <View style={styles.documentsContainer}>
                    <Text style={styles.documentsTitle}>Documents:</Text>
                    <View style={styles.documentItem}>
                      {/* <TouchableOpacity
                          onPress={() =>
                            handleDocumentPreview(selectedOffer.Document)
                          }
                        >
                          <Text style={styles.documentText}>Preview</Text>
                        </TouchableOpacity> */}
                      <TouchableOpacity
                        onPress={() =>
                          handleDocumentDownload(selectedOffer.Document)
                        }
                      >
                        <Text style={styles.documentText}>Download</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.messageButton}
                  onPress={() => handleSendMessage(selectedOffer)}
                >
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
      )}
      <View style={{ flexDirection: "row", borderWidth: 1, height: 50, borderColor: "#0A5D47" }}>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center",backgroundColor:"#003C43" }}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center", }}
         
          >
            <Text style={{ color: "#fff", fontSize: 20 }}>View Offers</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={{ width: '100%', height: '100%', backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", }}
            onPress={() => navigation.navigate("MessageSelections")}
          >
            <Text style={{ color: "#003C43", fontSize: 20, }}>Messages</Text>
          </TouchableOpacity>
        </View>




      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#006A6B',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  drawerIcon: {
    width: 30,
    height: 30,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#003C43',
  },
  listContent: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
  },
  typeLabel: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  typeLabelText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalProductText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003C43',
    marginBottom: 10,
  },
  modalDescriptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  documentsContainer: {
    marginTop: 20,
  },
  documentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006A6B',
    marginBottom: 10,
  },
  documentText: {
    color: '#006A6B',
    textDecorationLine: 'underline',
  },
  noOffersText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 16,
    marginTop: 20,
  },
  offerNameText: {
    fontSize: 16,
    color: '#003C43',
    marginTop: 10,
  },
  messageButton: {
    backgroundColor: '#006A6B',
    padding: 10,
    marginVertical: 20,
    borderRadius: 5,
    alignItems: 'center',
  },

  messageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default ViewOffers;
