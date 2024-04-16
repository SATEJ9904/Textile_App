import { SafeAreaView, StyleSheet, Text, View, StatusBar, ImageBackground, TextInput, RefreshControl, TouchableOpacity, Dimensions, FlatList, Button, ScrollView, Alert, Pressable, Modal, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import CheckBox from '@react-native-community/checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";




const { width } = Dimensions.get('window');

const data = [
  { srNo: 1, enquiryNo: 'ENQ-001', date: '2024-02-26', traderName: 'Trader A' },
  { srNo: 2, enquiryNo: 'ENQ-002', date: '2024-02-26', traderName: 'Trader B' },
  { srNo: 3, enquiryNo: 'ENQ-003', date: '2024-02-25', traderName: 'Trader C' },
  { srNo: 4, enquiryNo: 'ENQ-004', date: '2024-02-25', traderName: 'Trader D' },
  { srNo: 5, enquiryNo: 'ENQ-005', date: '2024-02-24', traderName: 'Trader E' },
];

const arr = [
  { "LoomNo": 1 },
  { "LoomNo": 12 },
  { "LoomNo": 123 },
  { "LoomNo": 124 },
  { "LoomNo": 125 },
  { "LoomNo": 12 },
  { "LoomNo": 123 },
  { "LoomNo": 124 },
  { "LoomNo": 125 }
];

const dropdowndata = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

const JobWorkEnquires = ({ navigation }) => {

  const [showTable, setShowTable] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus3, setIsFocus3] = useState(false);
  const [isFocus4, setIsFocus4] = useState(false);
  const [isFocus5, setIsFocus5] = useState(false);
  const [isFocus6, setIsFocus6] = useState(false);
  const [showDateFrom, setShowDateFrom] = useState(false)
  const [showDateTo, setShowDateTo] = useState(false)


  const [enquiryNo, setEnquiryNo] = useState('');
  const [traderName, setTraderName] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [datefrom, setDateFrom] = useState(new Date());
  const [dateto, setDateTo] = useState(new Date());
  const [updatedDateFrom, setUpdatedDateFrom] = useState("")
  const [updatedDateTo, setUpdatedDateTo] = useState("")
  const [modefrom, setModeFrom] = useState("date");
  const [modeto, setModeTo] = useState("date");
  const [fabricQuality, setFabricQuality] = useState('');
  const [fabricLength, setFabricLength] = useState('');
  const [dalalAgent, setDalalAgent] = useState('');
  const [loomNo, setLoomNo] = useState('');
  const [machineType, setMachineType] = useState(null);
  const [width, setWidth] = useState("");
  const [rpm, setRpm] = useState('');
  const [sheddingType, setSheddingType] = useState('');
  const [numFrames, setNumFrames] = useState('');
  const [numFeeders, setNumFeeders] = useState('');
  const [selvadgeJacquard, setSelvadgeJacquard] = useState(false);
  const [topBeam, setTopBeam] = useState(false);
  const [cramming, setCramming] = useState(false);
  const [lenoDesign, setLenoDesign] = useState(false);
  const [availableLoomDates, setAvailableLoomDates] = useState('');
  const [numLoomsRequired, setNumLoomsRequired] = useState('');
  const [numLoomsPossible, setNumLoomsPossible] = useState('');
  const [jobRateOffered, setJobRateOffered] = useState('');
  const [counterOffer, setCounterOffer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const [Name, setName] = useState("");
  const [AppUserId, setAppUserId] = useState("")
  const [LoomOrTrader, SetLoomOrTrader] = useState("")
  const [id, setId] = useState("")

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getData = async () => {
    const Name = await AsyncStorage.getItem("Name");
    const AppUserId = await AsyncStorage.getItem("AppUserId");
    const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")
    const Id = await AsyncStorage.getItem("Id")

    setName(Name)
    setAppUserId(AppUserId)
    SetLoomOrTrader(LoomOrTrader)
    setId(Id)

  }

  useEffect(() => {


    const fetchselectedEnquiryId = async () => {
      setRefreshing(true);
      setLoading(true)
      try {
        const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getjoin.php?EnquiryId=' + EnquiryId);
        const jsonData = await response.json();
        setStoreEID(jsonData); // Set the fetched data
        storeitems(jsonData);
        console.log("EnquiryId = ", jsonData)
        console.log("Data To Send = ", machineType, width, rpm, sheddingType, numFrames, numFeeders, selvadgeJacquard, topBeam, cramming, lenoDesign)
        setLoading(false)
        setRefreshing(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setRefreshing(false);
      }
    }
    // const loomNos = arr.map(item => item.LoomNo);
    // console.log(loomNos);
    fetchselectedEnquiryId();
    const callfuns = () => {
      fetch("")
        .then(getData())
        .then(fetchData())
        .then(fetchselectedEnquiryId())
        .then(fetchselectedEnquiryId())
        .then(storeitems())

    }

    callfuns();

  }, []);

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getenquiry.php');
      const jsonData = await response.json();
      setData(jsonData); // Set the fetched data
      setLoading(true)
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(true)
    }
  };

  const handleItemPress = (item) => {

    setSelectedItem(item);
    console.log(item.EnquiryId)
    setEnquiryId(item.EnquiryId)
  };


  const [responseLoomNo, setResponseLoomNo] = useState([])
  const [show, setShow] = useState(false)
  const [loomdata, setLoomdata] = useState([])

  const CheckLoomAvailability = () => {
    console.log(updatedDateFrom, updatedDateTo)
    const qs = require('qs');
    let data = qs.stringify({
      'LoomDetailId': id,
      'MachineType': machineType,
      'Width': width,
      'RPM': rpm,
      'SheddingType': sheddingType,
      'NoofFrames': numFrames,
      'NoofFeeders': numFeeders,
      'SelvageJacquard': selvadgeJacquard,
      'TopBeam': topBeam,
      'Cramming': cramming,
      'LenoDesignEquipment': lenoDesign,
      'FromDate': updatedDateFrom,
      'ToDate': updatedDateTo
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
        console.log(response.data)
        let temp = JSON.stringify(response.data);
        setLoomdata(response.data)
      })
      .catch((error) => {
        console.log(error);
        setResponseLoomNo(null)
      });
  }


  const EnquiryConfirm = () => {


    setModalVisible2(true);
    setShowTable(true);
    setShowForm(false);

    console.log("Enquiry Confirm = ", EnquiryId, id, updatedDateFrom, updatedDateTo, counterOffer, numLoomsPossible)

    const qs = require('qs');
    let data = qs.stringify({
      'EnquiryId': EnquiryId,
      'LoomTraderId': id,
      'DatePossibleFrom': updatedDateFrom,
      'DatePossibleTo': updatedDateTo,
      'JobRateExp': counterOffer,
      'Status': false,
      'LoomPossible': numLoomsPossible,
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




  const [EnquiryId, setEnquiryId] = useState("")
  const [storeEID, setStoreEID] = useState([])




  const fetchselectedEnquiryId = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getjoin.php?EnquiryId=' + EnquiryId);
      const jsonData = await response.json();
      setStoreEID(jsonData); // Set the fetched data
      storeitems(jsonData);
      console.log("EnquiryId = ", jsonData)
      console.log("Data To Send = ", machineType, width, rpm, sheddingType, numFrames, numFeeders, selvadgeJacquard, topBeam, cramming, lenoDesign)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const storeitems = (jsonData) => {
    console.log("started", jsonData)
    jsonData ? jsonData.map(item => {
      console.log("Storing the data ", item)
      setMachineType(item.MachineType)
      setWidth(item.Width)
      setRpm(item.RPM)
      setSheddingType(item.SheddingType)
      setNumFrames(item.NoofFrame)
      setNumFeeders(item.NoofFeedero)
      setSelvadgeJacquard(item.SelvageJacquard)
      setTopBeam(item.TopBeam)
      setCramming(item.Cramming)
      setLenoDesign(item.LenoDesignEquipment)
    }
    ) : null
  }



  // const renderItem = ({ item }) => (
  //   <View style={styles.row}>
  //     <View style={[styles.cell, { flex: 1 }]}>
  //       <Text style={{ color: '#000' }}>{item.srNo}</Text>
  //     </View>
  //     <View style={[styles.cell, { flex: 2 }]}>
  //       <Text style={{ color: '#000' }}>{item.enquiryNo}</Text>
  //     </View>
  //     <View style={[styles.cell, { flex: 2 }]}>
  //       <Text style={{ color: '#000' }}>{item.date}</Text>
  //     </View>
  //     <View style={[styles.cell, { flex: 3 }]}>
  //       <Text style={{ color: '#000' }}>{item.traderName}</Text>
  //     </View>
  //   </View>
  // );

  const Toggle = () => {
    setShowTable(false);
    setShowForm(true)
  }

  const notinterestedbutton = () => {
    setShowForm(false)
    setShowTable(true);

  }

  const showModefrom = (currentMode) => {
    setShowDateFrom(true);
    setModeFrom(currentMode);

  }

  const showModeto = (currentMode) => {
    setShowDateTo(true);
    setModeTo(currentMode)
  }


  const yesbutton = () => {
    setSelectedItem(false)
    setShowTable(true)
    setModalVisible(false)
  }

  const yesbutton2 = () => {
    setSelectedItem(false)
    setShowTable(true)

    setModalVisible2(false)
  }


  const DateFrom = (event, selectedDate) => {
    const currentDate = selectedDate || datefrom;
    setShowDateFrom(Platform.OS == 'ios');
    setDateFrom(currentDate);
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate()
    setUpdatedDateFrom(fDate)

    console.log(fDate)
  }

  const DateTo = (event, selectedDate) => {
    const currentDate = selectedDate || dateto;
    setShowDateTo(Platform.OS == 'ios');
    setDateTo(currentDate);
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate()
    setUpdatedDateTo(fDate)

    console.log(fDate)
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log(enquiryNo, traderName, updatedDateFrom, updatedDateTo, fabricQuality, fabricLength, dalalAgent, loomNo, machineType, width, rpm, sheddingType, numFrames, numFeeders, selvadgeJacquard, topBeam, cramming, lenoDesign, availableLoomDates, numLoomsRequired, numLoomsPossible, jobRateOffered, counterOffer);
  };

  const renderItem = ({ item, index }) => (
    <View>
      <Text>{item.LoomNo}</Text>
    </View>

  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e5f2fe" }}>
     <ScrollView contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchselectedEnquiryId} />
      }>
     <StatusBar backgroundColor={"#0b659a"}></StatusBar>
      <View style={{ backgroundColor: "#71B7E1", flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <ImageBackground
            source={require("../Images/drawer.png")}
            style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#71B7E1", marginTop: 15, marginRight: 0, marginLeft: 10 }}
            imageStyle={{ borderRadius: 0 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, color: "white", margin: "2.5%", marginLeft: "25%" }}>Job Enquiry</Text>
        <TouchableOpacity onPress={() => { fetchselectedEnquiryId() }}>
          <Image
            style={{ width: 40, height: 40, marginLeft: "28%", marginTop: "5.5%" }}
            source={require("../Images/refresh2.png")}
          />
        </TouchableOpacity>
      </View>
      {selectedItem ? (
        <ScrollView>
          <View style={styles.containerform}>


            {/* Date Fields */}






            {storeEID.length ? storeEID.map(item =>
              <View>

                <Text style={styles.input1}>ENquiry No.: {item.EnquiryNo}</Text>


                <Text style={styles.input1}>Trader Name: {item.Name}</Text>

                <View style={{ flexDirection: "column", justifyContent: "space-evenly" }}>
                  <Text style={{ marginTop: "3%", fontSize: 20, marginLeft: "0%", color: "#000" }}>Date : </Text>

                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.input1}>From Date : {item.BookingFrom.date.substring(0, 10)}</Text>

                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.input1}>To Date : {item.BookingTo.date.substring(0, 10)}</Text>

                  </View>


                </View>
                <Text style={styles.input1}>Fabric Quality : {item.FabricQuality}</Text>

                <Text style={styles.input1}>Fabric Length : {item.FabricLength}</Text>


                <Text style={styles.input1}>Agent Name : {item.AgentName}</Text>



                <Text style={[styles.input1, { marginTop: "5%" }]}>No. Of Looms Required : {item.LoomRequired}</Text>





                <Text style={styles.input1}>Machine Type : {item.MachineType}</Text>


                <Text style={styles.input1}>Width : {item.Width}</Text>

                <Text style={styles.input1}>RPM : {item.RPM}</Text>



                <Text style={styles.input1}>Shedding Type : {item.SheddingType}</Text>


                <Text style={styles.input1}>No. Of Frames : {item.NoofFrame}</Text>



                <Text style={styles.input1}>No. Of Feeders : {item.NoofFeedero}</Text>


                {
                  (() => {

                    if (item.SelvageJacquard === 1) {
                      return (
                        <View style={styles.checkboxContainer}>

                          <Text style={{ marginRight: "12%", fontSize: 17, color: "#000" }}>Selvadge Jacquard</Text>

                          <Text style={{ fontSize: 17, color: "blue", margin: "3%" }}>Required</Text>

                        </View>
                      )
                    } else {
                      return (
                        <View style={styles.checkboxContainer}>

                          <Text style={{ marginRight: "12%", fontSize: 17, color: "#000" }}>Selvadge Jacquard</Text>

                          <Text style={{ fontSize: 17, color: "red", margin: "3%" }}>Not Required</Text>

                        </View>
                      )


                    }

                  })()
                }

                {
                  (() => {

                    if (item.TopBeam === 1) {
                      return (
                        <View style={styles.checkboxContainer}>

                          <Text style={{ marginRight: "31%", fontSize: 17, color: "#000" }}>Top Beam</Text>
                          <Text style={{ fontSize: 17, color: "blue", margin: "3%" }}>Required</Text>
                        </View>
                      )
                    } else {
                      return (
                        <View>


                        </View>
                      )


                    }

                  })()
                }

                {
                  (() => {

                    if (item.Cramming === 1) {
                      return (
                        <View style={styles.checkboxContainer}>

                          <Text style={{ marginRight: "31%", fontSize: 17, color: "#000" }}>Cramming</Text>
                          <Text style={{ fontSize: 17, color: "blue", margin: "3%" }}>Required</Text>
                        </View>
                      )
                    } else {
                      return (
                        <></>
                      )


                    }

                  })()
                }


                {
                  (() => {

                    if (item.LenoDesignEquipment === 1) {
                      return (
                        <View style={styles.checkboxContainer}>

                          <Text style={{ marginRight: "3%", fontSize: 17, color: "#000" }}>Leno Design Equipment</Text>
                          <Text style={{ fontSize: 17, color: "blue", margin: "3%", marginBottom: "5%" }}>Required</Text>

                        </View>
                      )
                    } else {
                      return (
                        <></>
                      )


                    }

                  })()
                }
              </View>
            ) : <Text style={{color:"#000",fontSize:18}}>Swip Down To Load Data...</Text>}



            <View style={{ margin: 1, borderWidth: 1 }}>
              <View style={{ margin: 15 }}>
                <View style={{ flexDirection: "row" }}>
                  <TextInput
                    style={[styles.input, { width: "60%", marginTop: "5%", color: "#000" }]}
                    value={updatedDateFrom}
                    onChangeText={setFromDate}
                    placeholder={selectedItem.BookingFrom.date.substring(0, 10)}
                    keyboardType="numeric"
                    placeholderTextColor={"#000"}

                  />
                  <TouchableOpacity onPress={() => { fetchselectedEnquiryId(); showModefrom('date') }} style={{}}>
                    <ImageBackground
                      source={require('../Images/calendar.png')}
                      style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#006A4E", marginLeft: "20%", marginTop: "18%" }}
                      imageStyle={{ borderRadius: 0 }}
                    />
                  </TouchableOpacity>

                  {
                    showDateFrom && (
                      <DateTimePicker
                        testID='dateTimePicker'
                        value={datefrom}
                        mode={modefrom}
                        is24Hour={false}
                        display='default'
                        onChange={(DateFrom)} />
                    )
                  }
                </View>


                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                  <TextInput
                    style={[styles.input, { width: "60%", color: "#000" }]}
                    value={updatedDateTo}
                    onChangeText={setToDate}
                    placeholder={selectedItem.BookingTo.date.substring(0, 10)}
                    placeholderTextColor={"#000"}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity onPress={() => { fetchselectedEnquiryId(); showModeto('date') }} style={{}}>
                    <ImageBackground
                      source={require('../Images/calendar.png')}
                      style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#006A4E", marginLeft: "20%" }}
                      imageStyle={{ borderRadius: 0 }}
                    />
                  </TouchableOpacity>

                  {
                    showDateTo && (
                      <DateTimePicker
                        testID='dateTimePicker'
                        value={dateto}
                        mode={modeto}
                        is24Hour={false}
                        display='default'
                        onChange={(DateTo)} />
                    )
                  }
                </View>

                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <TouchableOpacity onPress={() => { CheckLoomAvailability() }} style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#71B7E1", borderRadius: 20, width: "100%" }}>
                    <Text style={{ fontSize: 22, color: "#fff", paddingVertical: "4%" }}>Check Looms Availability</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <Text style={{ fontSize: 16, }}>Available Loom No : </Text>

                  {loomdata.map((item, index) => (
                    <View key={index}  >
                      <Text style={{ fontSize: 17, fontWeight: 500 }}> {item.LoomNo} </Text>
                    </View>
                  ))}
                </View>

              </View>
            </View>


            <TextInput
              style={[styles.input, { marginTop: 30 }]}
              value={numLoomsPossible}
              onChangeText={setNumLoomsPossible}
              placeholder="No. of Looms Possible to Assign"
              keyboardType="numeric"
              placeholderTextColor={"grey"}

            />
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.input1}>Job Rate Offered :        {selectedItem.OfferedJobRate}</Text>

              <Text style={{ fontSize: 20, color: "#000", marginLeft: "10%", marginTop: "2.5%" }}>Paisa</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={[styles.input, { width: "70%" }]}
                value={counterOffer}
                onChangeText={setCounterOffer}
                placeholder="Counter Offer"
                keyboardType="numeric"
                placeholderTextColor={"grey"}

              />
              <Text style={{ fontSize: 20, color: "#000", marginLeft: "5%", marginTop: "2.5%" }}>Paisa</Text>
            </View>


            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
              <TouchableOpacity style={[styles.button]} onPress={EnquiryConfirm}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.notInterestedButton]} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Not Interested</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ marginTop: "20%" }}></Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView>
          {

            showTable ? <View style={styles.container}>
              <View style={styles.header}>
                <View style={[styles.cell, { flex: 2 }]}>
                  <Text style={styles.headerText}>Enquiry No.</Text>
                </View>
                <View style={[styles.cell, { flex: 2 }]}>
                  <Text style={styles.headerText}>Date</Text>
                </View>
                <View style={[styles.cell, { flex: 3 }]}>
                  <Text style={styles.headerText}>Trader Id</Text>
                </View>
              </View>

              {data.length ?
                data.map(item => (
                  <TouchableOpacity key={item.id} onPress={() => { handleItemPress(item); fetchselectedEnquiryId(); }}>
                    <View key={item.EnquiryId} style={[styles.header, { justifyContent: "space-evenly" }]}>
                      <View style={[styles.cell, { flex: 2 }]}>
                        <Text style={styles.headerText}>{item.EnquiryNo}</Text>
                      </View>
                      <View style={[styles.cell, { flex: 2 }]}>
                        <Text style={styles.headerText}>{item.EnquiryDate.date.substring(0, 10)}</Text>
                      </View>
                      <View style={[styles.cell, { flex: 3 }]}>
                        <Text style={styles.headerText}>{item.TraderId}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                )) : null}
              <TouchableOpacity onPress={() => fetchData()} style={{ backgroundColor: '#71B7E1', padding: 10, alignItems: 'center', marginTop: "10%" }}>
                <Text style={{ color: 'white' }}>Refresh</Text>
              </TouchableOpacity>
            </View> : null

          }
        </ScrollView>
      )}


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible2(!modalVisible2);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Data Submitted Successfully</Text>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Image
                style={{ width: 50, height: 50 }}
                source={require("../Images/success.png")}
              />
              <Pressable
                style={[styles.button1, styles.buttonClose1]}
                onPress={() => yesbutton2(!modalVisible2)}>
                <Text style={styles.textStyle1}>close</Text>
              </Pressable>

            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are You Sure To Ignore This Offer ?</Text>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[styles.button1, styles.buttonClose1]}
                onPress={() => yesbutton(!modalVisible)}>
                <Text style={styles.textStyle1}>Yes</Text>
              </Pressable>
              <Pressable
                style={[styles.button1, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Text>Pull down to see RefreshControl indicator</Text>
     </ScrollView>

    </SafeAreaView>
  )
}

export default JobWorkEnquires

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    //   borderWidth: 1,
    borderColor: '#000',
  },
  headerText: {
    fontWeight: 'bold',
    color: "#000"
  },
  row: {
    flexDirection: 'row',
    //   borderWidth: 1,
    borderColor: '#000',
  },
  cell: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    color: "#000"
  },
  flatList: {
    marginTop: 10,
    color: "#000"
  },
  containerform: {
    padding: 20,
    color: "#000"
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 17,
    color: "grey"
  },
  input1: {
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 20,
    color: "#000",
    borderBottomWidth: 1
  },
  button: {
    backgroundColor: '#71B7E1',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notInterestedButton: {
    backgroundColor: 'red',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: "3%"
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 17,
    color: "#000"
  },
  selectedTextStyle: {
    fontSize: 17,
    color: "#000"
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 17,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button1: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    paddingHorizontal: 15
  },
  buttonOpen: {
    backgroundColor: "red",
  },
  buttonClose: {
    backgroundColor: "red",
    margin: "5%"
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: "red"
  },
  buttonOpen1: {
    backgroundColor: "#71B7E1",
  },
  buttonClose1: {
    backgroundColor: "#71B7E1",
    margin: "5%"
  },
  textStyle1: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: "#71B7E1"
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: "#000",
    fontSize: 17
  },
})