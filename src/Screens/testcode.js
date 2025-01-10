import React, { useState, useEffect, useRef } from 'react';
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
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview'; // For downloading files using WebView
import RNFetchBlob from 'rn-fetch-blob'; // For saving the file after WebView download
import FileViewer from 'react-native-file-viewer'; // For viewing files locally

const { width, height } = Dimensions.get('window');

const ViewOffers = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // To handle loading animation
  const [documentUrl, setDocumentUrl] = useState(null); // To manage document URL
  const webviewRef = useRef(null); // WebView reference

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(
          'https://textileapp.microtechsolutions.co.in/php/gettable.php?table=MarketOffer'
        );
        const data = await response.json();

        const updatedOffers = await Promise.all(
          data.map(async (offer) => {
            if (offer.Privacy === 1) {
              const id = offer.TraderId || offer.LoomId || offer.YarnId;

              if (id) {
                try {
                  const nameResponse = await fetch(
                    `https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=${id}`
                  );
                  const nameData = await nameResponse.json();
                  offer.Name = nameData[0].Name;
                } catch (error) {
                  console.log('Failed to fetch name:', error);
                }
              }
            }
            return offer; // Return the updated offer
          })
        );

        setOffers(updatedOffers);
        setFilteredOffers(updatedOffers);
      } catch (error) {
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
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOffer(null);
  };

  // Handle document download via WebView and save it
  const handleDocumentDownload = async (documentUrl) => {
    try {
      setLoading(true); // Show loading indicator
      setDocumentUrl(documentUrl); // Set the document URL for WebView to trigger download
    } catch (error) {
      console.error('File download error:', error);
      Alert.alert('Error', `Failed to download the document. Error: ${error.message}`);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // WebView onLoad function to trigger when the document starts loading
  const handleWebViewLoad = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/downloaded-file.pdf`;

    // Save the document to Downloads directory after WebView triggers the download
    RNFetchBlob
      .config({
        fileCache: true,
        path: filePath, // Save the file to the Downloads folder
      })
      .fetch('GET', documentUrl)
      .then(async (res) => {
        const filePath = res.path();
        try {
          await FileViewer.open(filePath); // Open the downloaded file
        } catch (error) {
          Alert.alert('Response from device', `Successfully downloaded, but this file type might not be supported on your device. Try opening it manually from downloads.`);
        }
      })
      .catch((error) => {
        console.error('File download error:', error);
        Alert.alert('Error', `Failed to download the document: ${error.message}`);
      });
  };

  const renderOfferCard = ({ item }) => {
    const offerType = item.OfferOptId === 1 ? 'BUY' : 'SELL';
    const offerBackgroundColor = item.OfferOptId === 1 ? '#4CAF50' : '#F44336';

    return (
      <TouchableOpacity onPress={() => openModal(item)} activeOpacity={0.8}>
        <View style={styles.cardContainer}>
          <View
            style={[styles.typeLabel, { backgroundColor: offerBackgroundColor }]}
          >
            <Text style={styles.typeLabelText}>{offerType}</Text>
          </View>
          {item.Name && <Text style={styles.offerNameText}>Offer By: {item.Name}</Text>}
          <Text style={styles.descriptionText} numberOfLines={2}>
            {item.Description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#003C43', '#006A6B']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../Images/back.png')} style={styles.drawerIcon} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>View Offers</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#003C43" style={styles.searchIcon} />
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
        ListEmptyComponent={<Text style={styles.noOffersText}>No offers found.</Text>}
      />

      {selectedOffer && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="none"
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <ScrollView>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Ionicons name="close" size={30} color="#003C43" />
                </TouchableOpacity>
                <Text style={styles.modalProductText}>{selectedOffer.ProductOptId}</Text>
                <Text style={styles.modalDescriptionText}>{selectedOffer.Description}</Text>
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
                    <TouchableOpacity
                      onPress={() => handleDocumentDownload(selectedOffer.Document)}
                    >
                      <Text style={styles.documentText}>Download</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Message Button */}
                <TouchableOpacity
                  style={styles.messageButton}
                  onPress={() => handleSendMessage(selectedOffer)}
                >
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* WebView (hidden) to trigger file downloads */}
      {documentUrl && (
        <WebView
          ref={webviewRef}
          source={{ uri: documentUrl }}
          onLoad={handleWebViewLoad} // Handle when WebView starts loading the document
          style={{ height: 0, width: 0 }} // Hidden WebView
        />
      )}

      {loading && (
        <Modal transparent={true} visible={loading}>
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#006A6B" />
            <Text style={styles.loadingText}>Downloading...</Text>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FA',
  },
  drawerIcon: {
    width: 30,
    height: 30,
    tintColor: '#FFFFFF',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#006A6B',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 10,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#003C43',
  },
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  typeLabel: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  typeLabelText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  offerNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  descriptionText: {
    color: '#555',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 5,
    fontWeight: '500',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
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
  messageButton: {
    backgroundColor: '#006A6B',
    padding: 12,
    marginVertical: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  messageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 10,
  },
});

export default ViewOffers;
