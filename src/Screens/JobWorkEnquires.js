import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity, TextInput, Image, RefreshControl, Platform, ImageBackground } from 'react-native';
import axios from 'axios';
import DatePicker from '@react-native-community/datetimepicker'; // Import the DatePicker component
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const { width } = Dimensions.get('window');

const JobWorkEnquires = ({ navigation }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showED, setShowED] = useState(false);
  const [showE, setShowE] = useState(true);
  const [loomPossible, setLoomPossible] = useState('');
  const [counterOffer, setCounterOffer] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false); // State for showing From DatePicker
  const [toDatePickerVisible, setToDatePickerVisible] = useState(false); // State for showing To DatePicker
  const [AppUserId, setAppUserId] = useState("")
  const [Name, setName] = useState('')
  const [show, setShow] = useState(true);
  const [Id, setId] = useState("");
  const [LoomOrTrader, setLoomOrTrader] = useState("");
  const [mobileno, setMobileNo] = useState("");
  const [gstno, setGSTNO] = useState("")

  const tableHead = ['Enquiry ID', 'Enquiry Date', 'Trader ID'];

  const [showmsg, setShowMsg] = useState(true)
  const [isConected, setisConnected] = useState(false)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setisConnected(state.isConnected)


      if (state.isConnected == true) {
        setTimeout(() => {
          setShowMsg(false)
        }, 5000)
      } else {
        setShowMsg(true)
      }
    })



    return () => {
      unsubscribe();
    }
  })


  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchEnquiries();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  const getData = async () => {
    const Email = await AsyncStorage.getItem("AppUserId");
    const Name = await AsyncStorage.getItem("Name");
    const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")
    const Id = await AsyncStorage.getItem("Id")
    const PrimaryContact = await AsyncStorage.getItem("PrimaryContact")
    const GSTNumber = await AsyncStorage.getItem("GSTNumber")


    setAppUserId(Email)
    setName(Name)
    setLoomOrTrader(LoomOrTrader)
    setId(Id)
    setMobileNo(PrimaryContact)
    setGSTNO(GSTNumber)
  }


  useEffect(() => {
    getData();
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get('https://textileapp.microtechsolutions.co.in/php/getenquiry.php');
      setEnquiries(response.data);
    } catch (error) {
      alert('Error fetching data');
    }
  };

  const fetchEnquiryDetails = async (enquiryId) => {
    try {
      const response = await axios.get(`https://textileapp.microtechsolutions.co.in/php/getjoin.php?EnquiryId=${enquiryId}`);
      setSelectedEnquiry(response.data[0]);
      response.data.map((item) => {
        console.log("FQ = ", item.FabricQuality)
        calculatePPI(item.FabricQuality)
      })
    } catch (error) {
      alert('Error fetching enquiry details');
    }
    setShowED(true);
    setShowE(false);

  };

  const formatDate = (date) => {
    // Format date as YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  const handleFromDateChange = (event, selectedDate) => {
    setFromDatePickerVisible(Platform.OS === 'ios'); // Hide DatePicker for iOS
    if (selectedDate) {
      setFromDate(formatDate(selectedDate));
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    setToDatePickerVisible(Platform.OS === 'ios'); // Hide DatePicker for iOS
    if (selectedDate) {
      setToDate(formatDate(selectedDate));
    }
  };

  const [loomdata, setLoomdata] = useState([])

  const postLoomData = async () => {
    console.log(fromDate, toDate)
    console.log("ID = ", Id)
    const qs = require('qs');
    let data = qs.stringify({
      'LoomDetailId': Id,
      'MachineType': selectedEnquiry.MachineType,
      'Width': selectedEnquiry.Width,
      'RPM': selectedEnquiry.RPM,
      'SheddingType': selectedEnquiry.SheddingType,
      'NoofFrames': selectedEnquiry.NoofFrame,
      'NoofFeeders': selectedEnquiry.NoofFeedero,
      'SelvageJacquard': selectedEnquiry.SelvageJacquard,
      'TopBeam': selectedEnquiry.TopBeam,
      'Cramming': selectedEnquiry.Cramming,
      'LenoDesignEquipment': selectedEnquiry.LenoDesignEquipment,
      'FromDate': fromDate || selectedEnquiry.BookingFrom.date.substring(0, 10),
      'ToDate': toDate || selectedEnquiry.BookingTo.date.substring(0, 10)
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://textileapp.microtechsolutions.co.in/php/postloom.php',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios.request(config)
      .then(response => {
        console.log("Looms Available = ", response.data)
        let temp = JSON.stringify(response.data);
        setLoomdata(response.data)
      })
      .catch((error) => {
        console.log(error);
        setLoomdata(null)
      });
  };




  const CheckLoomAvailability = () => {
    console.log(updatedDateFrom, updatedDateTo)
    console.log("ID = ", Id)
    const qs = require('qs');
    let data = qs.stringify({
      'LoomDetailId': Id,
      'MachineType': selectedEnquiry.MachineType,
      'Width': selectedEnquiry.Width,
      'RPM': selectedEnquiry.RPM,
      'SheddingType': selectedEnquiry.SheddingType,
      'NoofFrames': selectedEnquiry.NoofFrame,
      'NoofFeeders': selectedEnquiry.NoofFeedero,
      'SelvageJacquard': selectedEnquiry.SelvageJacquard,
      'TopBeam': selectedEnquiry.TopBeam,
      'Cramming': selectedEnquiry.Cramming,
      'LenoDesignEquipment': selectedEnquiry.LenoDesignEquipment,
      'FromDate': fromDate,
      'ToDate': toDate
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://textileapp.microtechsolutions.co.in/php/postloom.php',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios.request(config)
      .then(response => {
        console.log("Looms Available = ", response.data)
        let temp = JSON.stringify(response.data);
        setLoomdata(response.data)
      })
      .catch((error) => {
        console.log(error);
        setLoomdata(null)
      });
  }

  const EnquiryConfirm = () => {



    const qs = require('qs');
    let data = qs.stringify({
      'EnquiryId': selectedEnquiry.EnquiryId,
      'LoomTraderId': Id,
      'DatePossibleFrom': fromDate || selectedEnquiry.BookingFrom.date.substring(0, 10),
      'DatePossibleTo': toDate || selectedEnquiry.BookingTo.date.substring(0, 10),
      'JobRateExp': counterOffer,
      'Status': false,
      'LoomPossible': loomPossible,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://textileapp.microtechsolutions.co.in/php/postenquiryconfirm.php',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios.request(config)
      .then(response => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }



  const calculatePPI = (fabricQuality) => {
    // Assuming fabric quality is in the format: EPI*PPI/WC*WC:Width
    const parts = fabricQuality.split('*');
    if (parts.length >= 2) {
      // Extract PPI from the second part of the string
      const secondPart = parts[1].split('/');
      if (secondPart.length >= 2) {
        return secondPart[0];
      }
    }
    return 'N/A'; // Return N/A if PPI cannot be extracted
  };


  const renderHeader = () => {
    return (
      <View style={styles.header}>
        {tableHead.map((item, index) => (
          <Text key={index} style={[styles.headerText, { width: index === 0 ? width * 0.3 : width * 0.35 }]}>
            {item}
          </Text>
        ))}
      </View>
    );
  };

  const NotInterested = () => {
    setShowE(true);
    setShowED(false)
  }

  const renderRows = () => {
    return enquiries.map((enquiry, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
        onPress={() => {
          fetchEnquiryDetails(enquiry.EnquiryId);
        }}>
        <Text style={[styles.text, styles.cell, { width: width * 0.3 }]}>{enquiry.EnquiryId}</Text>
        <Text style={[styles.text, styles.cell, { width: width * 0.35 }]}>{enquiry.EnquiryDate.date.substring(0, 10)}</Text>
        <Text style={[styles.text, styles.cell, { width: width * 0.35 }]}>{enquiry.TraderId}</Text>
      </TouchableOpacity>
    ));
  };

  const renderEnquiryDetails = () => {
    if (!selectedEnquiry) return null;

    return (
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Enquiry ID</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.EnquiryId}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Enquiry No</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.EnquiryNo}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Enquiry Date</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.EnquiryDate.date.substring(0, 10)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Trader ID</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.TraderId}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Booking From</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.BookingFrom.date.substring(0, 10)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Booking To</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.BookingTo.date.substring(0, 10)}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Fabric Quality</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.FabricQuality}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Fabric Length</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.FabricLength}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Loom Required</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.LoomRequired}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Agent Name</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.AgentName}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Machine Type</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.MachineType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Width</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.Width}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>RPM</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.RPM}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Shedding Type</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.SheddingType}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>No of Frame</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.NoofFrame}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>No of Feeder</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.NoofFeedero}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          <View style={[styles.detailItem]}>
            <Text style={styles.detailLabel}>Loom No</Text>
            <Text style={styles.detailValue}>{selectedEnquiry.LoomNo}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>PPI</Text>
            <Text style={styles.detailValue}>{calculatePPI(selectedEnquiry.FabricQuality)}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          {selectedEnquiry.SelvageJacquard === 1 ? (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Selvadge Jacquard</Text>
              <Text style={[styles.detailValue, { color: '#007bff' }]}>Required</Text>
            </View>
          ) : null}
          {selectedEnquiry.TopBeam === 1 ? (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Top Beam</Text>
              <Text style={[styles.detailValue, { color: '#007bff' }]}>Required</Text>
            </View>
          ) : null}
          {selectedEnquiry.Cramming === 1 ? (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cramming</Text>
              <Text style={[styles.detailValue, { color: '#007bff' }]}>Required</Text>
            </View>
          ) : null}
          {selectedEnquiry.LenoDesignEquipment === 1 ? (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Leno Design Equipment</Text>
              <Text style={[styles.detailValue, { color: '#007bff' }]}>Required</Text>
            </View>
          ) : null}
        </View>
        <View style={[styles.detailItem, { borderBottomWidth: 1, marginTop: "6%" }]}>

          <View style={{ marginHorizontal: "5%" }}>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={[styles.textInput, { borderWidth: 1, width: "70%", borderColor: "#000" }]}
                value={selectedEnquiry.BookingFrom.date.substring(0, 10)}
                onChangeText={setFromDate}
                keyboardType="numeric"
                placeholderTextColor={'#000'} 
              />
              <TouchableOpacity onPress={() => setFromDatePickerVisible(true)}>
                <ImageBackground
                  source={require('../Images/calendar.png')}
                  style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#006A4E", marginLeft: "20%", marginTop: "10%" }}
                  imageStyle={{ borderRadius: 0 }}
                />

              </TouchableOpacity>
              {fromDatePickerVisible && (
                <DatePicker
                  testID="fromDatePicker"
                  value={selectedEnquiry.BookingFrom.date.substring(0, 10) ? new Date(fromDate) : new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  minimumDate={new Date()}
                  onChange={handleFromDateChange}
                />
              )}
            </View>
            <View style={{ flexDirection: "row", marginTop: "5%" }}>

              <TextInput
                style={[styles.textInput, { borderWidth: 1, width: "70%", borderColor: "#000" }]}
                value={selectedEnquiry.BookingTo.date.substring(0, 10)}
                onChangeText={setToDate}
                keyboardType="numeric"
                placeholderTextColor={'#000'} 
              />
              <TouchableOpacity onPress={() => setToDatePickerVisible(true)}>
                <ImageBackground
                  source={require('../Images/calendar.png')}
                  style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#006A4E", marginLeft: "20%", marginTop: "10%" }}
                  imageStyle={{ borderRadius: 0 }}
                />
              </TouchableOpacity>
              {toDatePickerVisible && (
                <DatePicker
                  testID="toDatePicker"
                  value={selectedEnquiry.BookingFrom.date.substring(0, 10) ? new Date(toDate) : new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  minimumDate={new Date()}
                  onChange={handleToDateChange}
                />
              )}
            </View>
            <TouchableOpacity style={styles.checkAvailabilityButton} onPress={() => postLoomData()}>
              <Text style={styles.checkAvailabilityText}>Check Availability</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', marginTop: 20, width: "50%", marginBottom: 20 }}>
              <Text style={{ fontSize: 16, color: "#000" }}>Available Loom No : </Text>

              {loomdata.map((item, index) => (
                <View key={index} >
                  <Text style={{ fontSize: 17, fontWeight: 500, color: "#000" }}> {item.LoomNo} </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={[styles.detailItem, { marginTop: "7%", width: "70%" }]}>
          <Text style={styles.detailLabel}>Loom Possible To Assign</Text>
          <TextInput
            style={[styles.textInput, { borderWidth: 1, borderColor: "#000", marginTop: "5%" }]}
            value={loomPossible}
            onChangeText={setLoomPossible}
            keyboardType="numeric"
            placeholderTextColor={"#000"}
          />
        </View>

        <View style={[styles.detailItem, { marginTop: "7%" }]}>
          <Text style={styles.detailLabel}>Offered Job Rate:</Text>
          <Text style={styles.detailValue}>{selectedEnquiry.OfferedJobRate}</Text>
        </View>

        <View style={[styles.detailItem, { marginTop: "7%", width: "100%" }]}>
          <Text style={styles.detailLabel}>Counter Offer</Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={[styles.textInput, { borderWidth: 1, borderColor: "#000", width: "70%", marginTop: "5%" }]}
              value={counterOffer}
              onChangeText={setCounterOffer}
              keyboardType="numeric"
              placeholderTextColor={"#000"}
            />
            <Text style={[styles.detailLabel, { marginLeft: "5%", marginTop: "5%" }]}>In Paise</Text>

          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.checkAvailabilityButton, { backgroundColor: "blue" }]} onPress={() => EnquiryConfirm()}>
            <Text style={styles.checkAvailabilityText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.checkAvailabilityButton, { backgroundColor: "red" }]} onPress={() => NotInterested()}>
            <Text style={styles.checkAvailabilityText}>Not Interested</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (

    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{ backgroundColor: "#71B7E1", flexDirection: "row" }}>
          {
            showE ?
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <ImageBackground
                  source={require("../Images/drawer.png")}
                  style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#71B7E1", marginTop: 15, marginRight: 0, marginLeft: 10 }}
                  imageStyle={{ borderRadius: 0 }}
                />
              </TouchableOpacity> :
              <TouchableOpacity onPress={() => { setShowE(true); setShowED(false); setLoomdata([]) }}>
                <ImageBackground
                  source={require("../Images/back.png")}
                  style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#71B7E1", marginTop: 15, marginRight: 0, marginLeft: 10 }}
                  imageStyle={{ borderRadius: 0 }}
                />
              </TouchableOpacity>
          }
          <Text style={{ fontSize: 25, color: "white", margin: "2.5%", marginLeft: "25%" }}>Job Enquiry</Text>
        </View>


        {showE ? (
          <>
            {renderHeader()}
            <ScrollView style={styles.dataWrapper}>{renderRows()}</ScrollView>
          </>
        ) : null}
        {showED ? (
          <View style={styles.dataWrapper}>{renderEnquiryDetails()}</View>
        ) : null}
      </ScrollView>
      {
        showmsg ? <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-end" }}>
          <View style={{
            bottom: 0,
            height: 20,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isConected ? 'green' : 'red'

          }}>
          <Text style={{ color: "#fff" }}>
              {(()=>{
                if(isConected === true) {
                  'Back Online'
                }else{
                  navigation.navigate("NoInternet")
                }
              })}
            </Text>

          </View>
        </View> : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 16 },
  header: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#007bff', paddingBottom: 10, marginBottom: 10 },
  headerText: { fontWeight: 'bold', textAlign: 'center', color: '#333', fontSize: 16 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingTop: 10, paddingBottom: 10 },
  rowEven: { backgroundColor: '#e6f7ff' },
  rowOdd: { backgroundColor: '#fff' },
  text: { textAlign: 'center', color: '#333', fontSize: 14 },
  cell: { padding: 5 },
  dataWrapper: { marginTop: 10 },
  detailsContainer: { paddingHorizontal: 16, paddingTop: 20 },
  detailGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginLeft: "10%" },
  detailItem: { flex: 1, marginTop: "2%" },
  detailLabel: { fontWeight: 'bold', color: '#555', fontSize: 16 },
  detailValue: { color: '#333', fontSize: 16 },
  textInput: { borderColor: '#ccc', paddingLeft: 10, fontSize: 16, borderRadius: 5, height: 40 },
  buttonContainer: { flexDirection: 'row', justifyContent: "space-evenly", marginTop: 20, marginBottom: "40%" },
  checkAvailabilityButton: { backgroundColor: '#007bff', padding: 15, alignItems: 'center', borderRadius: 5, marginTop: 20, marginBottom: 10 },
  checkAvailabilityText: { color: '#fff', fontSize: 16 },
});

export default JobWorkEnquires;
