import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Animated,
  RefreshControl,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoomBooking = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [loomNumbers, setLoomNumbers] = useState([]);
  const [selectedLoom, setSelectedLoom] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [enquiryDetails, setEnquiryDetails] = useState(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [OrderNo, setOrderNo] = useState('');
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0))[0];
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);



  const fetchData = async () => {
    try {
      const id = await AsyncStorage.getItem("Id");
      const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/bookingjoin.php?LoomTraderId=${id}`);
      const data = await response.json();
      setLoomNumbers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    console.log("refreshed")
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleBlockPress = (loom) => {
    setSelectedLoom(loom);
    setIsModalVisible(true);
  };

  const handleEnquirySubmit = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      const response = await fetch("https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=LoomOrder&Colname=OrderNo&Colvalue=" + OrderNo, requestOptions);
      const result = await response.json(); // Parse the JSON response
      console.log(result); // Log the result to verify

      if (result.length > 0) {
        setEnquiryDetails(result[0]); // Set the first object in the result array
        setShowEnquiryForm(false);
      } else {
        setErrorMessage("No details found for the given Order No");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Error fetching enquiry details");
    }
  };

  const postLoomOrder = async () => {

    console.log("Data = ", selectedLoom?.BookingId, enquiryDetails.LoomOrderId)

    // const requestOptions = {
    //   method: "GET",
    //   redirect: "follow"
    // };

    // fetch('https://textileapp.microtechsolutions.co.in/php/updateloomavailability.php?BookingId=' + selectedLoom?.BookingId + '&OrderNoId=' + enquiryDetails.LoomOrderId, requestOptions)
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.error(error));
  };


  const handleBookLoom = () => {
    setIsBookingModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start(() => {
        setIsBookingModalVisible(false);
        setSelectedLoom(null);
        setEnquiryDetails(null);
        setOrderNo('');
        fetchData();
      });
    }, 3000);
    postLoomOrder();
  };


  const handleBlockPress1 = (loom) => {
    setSelectedLoom(loom);
    setModalVisible2(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      setModalVisible2(false);
      setSelectedLoom(null);
    });
  };

  const handleCloseModal2 = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      setShowEnquiryForm(true);
      setIsModalVisible(false);
      setSelectedLoom(null);
    });
  };

  const renderBlocks = () => {
    return loomNumbers.map((loom, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.block,
          loom.Available !== 1 && styles.unAvailableBlock // Conditionally apply red background
        ]}
        onPress={() => {
          if (loom.Available !== 1) {
            handleBlockPress1(loom)
          } else if (loom.Available === 1) {
            handleBlockPress(loom);
          } else {
            console.log("Error")
          }
        }}
      >
        <Text
          style={[
            styles.blockText,
            loom.Available !== 1 && styles.unAvailableBlockText // Conditionally apply white text color
          ]}
        >
          {'Loom No ' + loom.LoomNo}
        </Text>
      </TouchableOpacity>
    ));
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <ImageBackground
            source={require("../Images/drawer.png")}
            style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003c43", marginTop: 8, marginRight: 0, marginLeft: 10 }}
            imageStyle={{ borderRadius: 0 }}
          />
        </TouchableOpacity>
        <Text style={styles.header}>Loom Booking</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.blocksContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {renderBlocks()}
          <Modal
            visible={modalVisible2}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCloseModal}
          >
            <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Loom Details</Text>
                {selectedLoom && (
                  <>
                    <Text style={styles.modalText}>Loom No: {selectedLoom.LoomNo}</Text>
                    <Text style={styles.modalText}>Job Rate: {selectedLoom.JobRate}</Text>
                    <Text style={styles.modalText}>
                      Booked Date To: {selectedLoom.BookedDateTo ? selectedLoom.BookedDateTo.date.substring(0, 10) : 'N/A'}
                    </Text>
                  </>
                )}
                <TouchableOpacity onPress={() => handleCloseModal()} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Modal>
        </ScrollView>
      )}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={()=>setIsModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.backButton} onPress={()=>setIsModalVisible(false)}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>Loom Details</Text>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>Loom No:</Text>
              <Text style={styles.detailText}>{selectedLoom?.LoomNo}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>MachineType:</Text>
              <Text style={styles.detailText}>{selectedLoom?.MachineType}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>Width:</Text>
              <Text style={styles.detailText}>{selectedLoom?.Width}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>RPM:</Text>
              <Text style={styles.detailText}>{selectedLoom?.RPM}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>No of Frames:</Text>
              <Text style={styles.detailText}>{selectedLoom?.NoofFrames}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>No of Feeders:</Text>
              <Text style={styles.detailText}>{selectedLoom?.NoofFeeders}</Text>
            </View>
            {selectedLoom?.SelvageJacquard === 1 && (
              <View style={styles.detailContainer}>
                <Text style={styles.detailTitle}>Selvage Jacquard:</Text>
                <Text style={[
                  styles.detailText,
                  {
                    marginLeft: "2%",
                    marginTop: "-1%",
                    color: "#003c43"
                  }
                ]}>
                  Available
                </Text>
              </View>
            )}{selectedLoom?.TopBeam === 1 && (
              <View style={styles.detailContainer}>
                <Text style={styles.detailTitle}>Top Beam:</Text>
                <Text style={[
                  styles.detailText,
                  {
                    marginLeft: "2%",
                    marginTop: "-1%",
                    color: "#003c43"
                  }
                ]}>
                  Available
                </Text>
              </View>
            )}

            {selectedLoom?.Cramming === 1 && (
              <View style={styles.detailContainer}>
                <Text style={styles.detailTitle}>Cramming:</Text>
                <Text style={[
                  styles.detailText,
                  {
                    marginLeft: "2%",
                    marginTop: "-1%",
                    color: "#003c43"
                  }
                ]}>
                  Available
                </Text>
              </View>
            )}
            {selectedLoom?.LenoDesignEquipment === 1 && (
              <View style={styles.detailContainer}>
                <Text style={styles.detailTitle}>Leno Design Equipment:</Text>
                <Text style={[
                  styles.detailText,
                  {
                    marginLeft: "2%",
                    marginTop: "-1%",
                    color: "#003c43"
                  }
                ]}>
                  Available
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.proceedButton} onPress={handleCloseModal2}>
              <Text style={styles.proceedButtonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showEnquiryForm}
        onRequestClose={() => setShowEnquiryForm(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.backButton} onPress={() => { setShowEnquiryForm(false); setIsModalVisible(true); }}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.modalText}>Get Order No</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Order No"
                placeholderTextColor={'grey'}
                value={OrderNo}
                onChangeText={setOrderNo}
              />
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <TouchableOpacity style={styles.submitButton} onPress={() => handleEnquirySubmit()}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {enquiryDetails && (
        <View style={styles.enquiryDetailsContainer}>
          <View style={{ flexDirection: "row", marginVertical: "5%" }}>
            <Text style={[styles.detailText, { marginRight: "45%", color: "#000", textDecorationLine: "underline", fontWeight: "500" }]}>
              Loom No: {selectedLoom?.LoomNo}
            </Text>
            <TouchableOpacity style={styles.backButton} onPress={() => setEnquiryDetails(null)}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.detailHeader}>Order Details</Text>
          <Text style={styles.detailText}>OrderNo: {enquiryDetails.OrderNo}</Text>
          <Text style={styles.detailText}>PartyName: {enquiryDetails.PartyName}</Text>
          <Text style={styles.detailText}>JobRate: {enquiryDetails.JobRate}</Text>
          <Text style={styles.detailText}>Orderdate: {enquiryDetails.Orderdate?.date?.substring(0, 10) ?? 'N/A'}</Text>
          <Text style={styles.detailText}>BookedDateFrom: {enquiryDetails.BookedDateFrom?.date?.substring(0, 10) ?? 'N/A'}</Text>
          <Text style={styles.detailText}>BookedDateTo: {enquiryDetails.BookedDateTo?.date?.substring(0, 10) ?? 'N/A'}</Text>
          <TouchableOpacity style={styles.bookButton} onPress={() => handleBookLoom()}>
            <Text style={styles.bookButtonText}>Book Loom</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isBookingModalVisible}
        onRequestClose={() => setIsBookingModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <Icon name="checkmark-circle" size={50} color="green" />
            <Text style={styles.modalText}>Loom Booked Successfully!</Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: "#003c43",
    width: "100%",
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 0,
    flex: 1,
    textAlign: 'center',
    paddingVertical: "2%",
    color: "#fff"
  },
  blocksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  block: {
    backgroundColor: '#4CAF50',
    padding: 20,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  blockText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailTitle: {
    fontSize:18,
    fontWeight: "bold",
    color: "#333",
    marginRight:10
  },
  proceedButton: {
    backgroundColor: "#003c43",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  proceedButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#333",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%',
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#003c43",
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  enquiryDetailsContainer: {
    position: 'absolute',
    top: '50%',
    left: '60%',
    transform: [{ translateX: -150 }, { translateY: -200 }],
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  detailText: {
    fontSize: 19,
    marginBottom: 10,
    color: "#666",
  },
  bookButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    elevation: 2,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  block: {
    padding: 20,
    margin: 15,
    borderRadius: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // For Android shadow
  },
  unAvailableBlock: {
    backgroundColor: 'gray',
  },
  blockText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    padding: 3
  },
  unAvailableBlockText: {
    color: 'white',
  },
  orderNoContainer: {
    position: 'absolute',
    top: 5,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 5,
    borderRadius: 5,
  },
  orderNoText: {
    fontSize: 14,
    color: 'white',
  },
  block: {
    margin: 10,
    padding: 20,
    backgroundColor: 'green',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  blockText: {
    color: 'white',
    fontSize: 18,
  },
  unAvailableBlockText: {
    color: 'white',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
});

export default LoomBooking;
