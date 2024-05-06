import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, ImageBackground, ScrollView, Modal, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import DateTimePicker from '@react-native-community/datetimepicker';

const LoomBooking = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [loomNumbers, setLoomNumbers] = useState([]);
  const [selectedLoomNo, setSelectedLoomNo] = useState(null);
  const [formFields, setFormFields] = useState({
    BookingID: '',
    EnquiryConfirmId: '',
    PartyName: '',
    JobRate: '',
    Quality: '',
    Orderdate: '',
    BookedDateFrom: '',
    BookedDateTo: '',
  });
  const [BookingID, setBookingID] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [selectedLoomDetails, setSelectedLoomDetails] = useState({});
  const [showmsg, setShowMsg] = useState(true);
  const [isConected, setisConnected] = useState(false);
  const [showOrderDatePicker, setShowOrderDatePicker] = useState(false);
  const [showBookedFromDatePicker, setShowBookedFromDatePicker] = useState(false);
  const [showBookedToDatePicker, setShowBookedToDatePicker] = useState(false);
  const [selectedOrderDate, setSelectedOrderDate] = useState(new Date());
  const [selectedBookedFromDate, setSelectedBookedFromDate] = useState(new Date());
  const [selectedBookedToDate, setSelectedBookedToDate] = useState(new Date());

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setisConnected(state.isConnected);

      if (state.isConnected == true) {
        setTimeout(() => {
          setShowMsg(false);
        }, 5000);
      } else {
        setShowMsg(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const convert = () => {
    const jobRateNumber = parseInt(formFields.JobRate, 10);
    const EnquiryConfirmID = parseInt(formFields.EnquiryConfirmId, 10);
    const mergedFormFields = { ...formFields, BookingID: BookingID, JobRate: jobRateNumber, EnquiryConfirmId: EnquiryConfirmID };
    setFormFields(mergedFormFields);
    setIsModalVisible2(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleBlockPress = (loomNo, BookingId, details) => {
    setSelectedLoomNo(loomNo === selectedLoomNo ? null : loomNo);
    setBookingID(BookingId);
    setSelectedLoomDetails({
      SelvageJacquard: details.SelvageJacquard,
      TopBeam: details.TopBeam,
      Cramming: details.Cramming,
      LenoDesignEquipment: details.LenoDesignEquipment,
    });
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (fieldName, value) => {
    setFormFields(prevState => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleSubmit = () => {
    setIsModalVisible2(false);
    const formdata = new FormData();
    formdata.append("EnquiryConfirmId", formFields.EnquiryConfirmId);
    formdata.append("LoomBookingId", formFields.BookingID);
    formdata.append("PartyName", formFields.PartyName);
    formdata.append("JobRate", formFields.JobRate);
    formdata.append("Quality", formFields.Quality);
    formdata.append("Orderdate", formFields.Orderdate);
    formdata.append("BookedDateFrom", formFields.BookedDateFrom);
    formdata.append("BookedDateTo", formFields.BookedDateTo);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/postloomorder.php", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

    console.log(formFields);
  };

  const handleOrderDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedOrderDate;
    setShowOrderDatePicker(false);
    setSelectedOrderDate(currentDate);
    handleInputChange('Orderdate', currentDate.toISOString().split('T')[0]);
  };

  const handleBookedFromDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedBookedFromDate;
    setShowBookedFromDatePicker(false);
    setSelectedBookedFromDate(currentDate);
    handleInputChange('BookedDateFrom', currentDate.toISOString().split('T')[0]);
  };

  const handleBookedToDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedBookedToDate;
    setShowBookedToDatePicker(false);
    setSelectedBookedToDate(currentDate);
    handleInputChange('BookedDateTo', currentDate.toISOString().split('T')[0]);
  };

  const renderBlocks = () => {
    return loomNumbers.map(({ LoomNo, BookingId, ...details }, index) => (
      <TouchableOpacity key={index} style={[styles.block, selectedLoomNo === LoomNo ? styles.selectedBlock : null]} onPress={() => handleBlockPress(LoomNo, BookingId, details)}>
        <Text style={styles.blockText}>{`Loom No: ${LoomNo}`}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "#71B7E1", flexDirection: "row", marginTop: "0%", width: "100%" }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <ImageBackground
            source={require("../Images/drawer.png")}
            style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#71B7E1", marginTop: 15, marginRight: 0, marginLeft: 10 }}
            imageStyle={{ borderRadius: 0 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: "white", margin: "2.5%", marginLeft: "30%" }}>Loom Booking</Text>
      </View>

      <Text style={styles.header}>Loom Numbers</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.blocksContainer}>{renderBlocks()}</View>
            {selectedLoomNo && (
              <View style={styles.formContainer}>
                <Text style={styles.formHeader}>Booking Details</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enquiry Confirm Id"
                  placeholderTextColor={"#000"}
                  onChangeText={text => handleInputChange('EnquiryConfirmId', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="PartyName"
                  placeholderTextColor={"#000"}
                  onChangeText={text => handleInputChange('PartyName', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="JobRate"
                  placeholderTextColor={"#000"}
                  onChangeText={text => handleInputChange('JobRate', text)}
                  keyboardType='numeric'
                />
                <TextInput
                  style={styles.input}
                  placeholder="Quality"
                  placeholderTextColor={"#000"}
                  onChangeText={text => handleInputChange('Quality', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Select Order Date"
                  placeholderTextColor={"#000"}
                  onFocus={() => setShowOrderDatePicker(true)}
                  value={formFields.Orderdate ? formFields.Orderdate : ''}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Select Booked Date From"
                  placeholderTextColor={"#000"}
                  onFocus={() => setShowBookedFromDatePicker(true)}
                  value={formFields.BookedDateFrom ? formFields.BookedDateFrom : ''}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Select Booked Date To"
                  placeholderTextColor={"#000"}
                  onFocus={() => setShowBookedToDatePicker(true)}
                  value={formFields.BookedDateTo ? formFields.BookedDateTo : ''}
                />
                <TouchableOpacity style={styles.submitButton} onPress={() => { convert(); convert() }}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      )}
      {
        showmsg ? <View style={{ flex: 2, alignItems: "flex-end", justifyContent: "flex-end" }}>
          <View style={{
            bottom: 0,
            height: 20,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isConected ? 'green' : 'red'

          }}>
            <Text style={{ color: "#fff" }}>
              {(() => {
                if (isConected === true) {
                  'Back Online'
                } else {
                  navigation.navigate("NoInternet")
                }
              })}
            </Text>

          </View>
        </View> : null
      }
      {/* Modal for displaying Loom details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Loom Details</Text>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>SelvageJacquard:</Text>
              <Text style={styles.detailText}>{selectedLoomDetails.SelvageJacquard}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>TopBeam:</Text>
              <Text style={styles.detailText}>{selectedLoomDetails.TopBeam}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>Cramming:</Text>
              <Text style={styles.detailText}>{selectedLoomDetails.Cramming}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>LenoDesignEquipment:</Text>
              <Text style={styles.detailText}>{selectedLoomDetails.LenoDesignEquipment}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible2}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Details</Text>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>EnquiryConfirmId:{formFields.EnquiryConfirmId}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>BookingID:{formFields.BookingID}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>PartyName:{formFields.JobRate}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>Quality:{formFields.Quality}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>Orderdate:{formFields.Orderdate}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>BookedDateFrom:{formFields.BookedDateFrom}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>BookedDateTo:{formFields.BookedDateTo}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => handleSubmit()}>
              <Text style={styles.closeButtonText}>Book Loom</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#000"
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  blocksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  block: {
    width: 100,
    height: 100,
    backgroundColor: '#4CAF50',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  selectedBlock: {
    backgroundColor: '#FFA500', // Change to a different color for selected block
  },
  blockText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: "20%"
  },
  formContainer: {
    width: '80%',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "#000"
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000"
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailTitle: {
    fontWeight: "bold",
    marginRight: 5,
    color: "#000"
  },
  detailText: {
    flex: 1,
    color: "#000"
  },
  closeButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LoomBooking;
