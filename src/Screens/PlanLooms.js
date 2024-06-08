import { SafeAreaView, StyleSheet, Text, View, StatusBar, ImageBackground, ActivityIndicator, TextInput, TouchableOpacity, Dimensions, FlatList, Button, ScrollView, Alert, Pressable, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import CheckBox from '@react-native-community/checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import ImagePicker from 'react-native-image-crop-picker';


const { width } = Dimensions.get('window');

const PlanLooms = ({ navigation }) => {

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
  const [machineType, setMachineType] = useState('');
  const [width, setWidth] = useState('');
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
  const [Name, setName] = useState("");
  const [AppUserId, setAppUserId] = useState("")
  const [LoomOrTrader, SetLoomOrTrader] = useState("")
  const [id, setId] = useState("")
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showDeliveryDate, setShowDeliveryDate] = useState(false);
  const [designPaper, setDesignPaper] = useState(null);
  const [fabricWidth, setFabricWidth] = useState("");
  const [description, setDescription] = useState("")

  const handleDeliveryDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deliveryDate;
    setShowDeliveryDate(false);
    setDeliveryDate(currentDate);
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setDesignPaper(image);
    }).catch(error => {
      console.log('ImagePicker Error: ', error);
    });
  };

  // Format date in 'YYYY-MM-DD' format
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchselectedEnquiryId();
    const callfuns = () => {
      fetch("")
        .then(getData())
    }

    callfuns();

  }, [])

  const fetchselectedEnquiryId = async () => {
    try {
      const response = await axios.get('https://textileapp.microtechsolutions.co.in/php/getidenquiry.php?Colname=TraderId&Colvalue=' + id);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };



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

  // Machine Type Data Fetching

  const [machineData, setMachineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const mactype = () => {
    fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=MachineType')
      .then(response => response.json())
      .then(jsonData => {
        setMachineData(jsonData); // Update state with fetched data
        setIsLoading(false); // Update loading state to false
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Update loading state to false even in case of error
      });
  }

  const machineDataType = machineData.map(item => ({ label: item.Name, value: item.Name }));


  //   Shedding Type Fetching

  const [shedding, setShedding] = useState([]);

  const Shedd = () => {
    fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=SheddingType')
      .then(response => response.json())
      .then(jsonData => {
        setShedding(jsonData); // Update state with fetched data
        setIsLoading(false); // Update loading state to false
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Update loading state to false even in case of error
      });
  }

  const sheddingData = shedding.map(item => ({ label: item.Name, value: item.Name }));


  //  No Of Frames Data Fetching 

  const [numofframes, setNumofFrames] = useState([]);


  const NOFRs = () => {
    fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=NoOfFrame')
      .then(response => response.json())
      .then(jsonData => {
        setNumofFrames(jsonData); // Update state with fetched data
        setIsLoading(false); // Update loading state to false
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Update loading state to false even in case of error
      });
  }

  const numofFramesData = numofframes.map(item => ({ label: item.Range.toString(), value: item.Range }));



  // No Of Feeders Data Fetching


  const [nooffeeders, setNumOFFeeders] = useState([]);


  const NOFds = () => {
    fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=NoOfFeeders')
      .then(response => response.json())
      .then(jsonData => {
        setNumOFFeeders(jsonData); // Update state with fetched data
        setIsLoading(false); // Update loading state to false
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Update loading state to false even in case of error
      });
  }

  const nooffeedersdata = nooffeeders.map(item => ({ label: item.Range.toString(), value: item.Range }));



  useEffect(() => {
    const callfuns = () => {
      fetch("")
        .then(NOFds())
        .then(NOFRs())
        .then(Shedd())
        .then(mactype())
    }

    callfuns();
  }, [])

  const handleItemPress = (item) => {
    setSelectedItem(item);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={[styles.cell, { flex: 1 }]}>
        <Text style={{ color: '#000' }}>{item.srNo}</Text>
      </View>
      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={{ color: '#000' }}>{item.enquiryNo}</Text>
      </View>
      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={{ color: '#000' }}>{item.date}</Text>
      </View>
      <View style={[styles.cell, { flex: 3 }]}>
        <Text style={{ color: '#000' }}>{item.traderName}</Text>
      </View>
    </View>
  );

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
    setShowForm(false)
    setShowTable(true)
    setModalVisible(false)
  }


  const DateFrom = (event, selectedDate) => {
    const currentDate = selectedDate || datefrom;
    setShowDateFrom(Platform.OS == 'ios');
    setDateFrom(currentDate);
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    setUpdatedDateFrom(fDate)

    console.log(fDate)
  }

  const DateTo = (event, selectedDate) => {
    const currentDate = selectedDate || dateto;
    setShowDateTo(Platform.OS == 'ios');
    setDateTo(currentDate);
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    setUpdatedDateTo(fDate)

    console.log(fDate)
  }

  const current = (event, selectedDate) => {
    const currentDate = selectedDate || dateto;
    setShowDateTo(Platform.OS == 'ios');
    setDateTo(currentDate);
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    setUpdatedDateTo(fDate)

    console.log(fDate)
  }

  const currentDate = dateto;

  let tempDate = new Date(currentDate);

  const formattedDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();


  const currentDate1 = () => {
    console.log(formattedDate)
  }


  const [EnquiryId, setEnquiryId] = useState("")

  const handleSubmit = (calculatedResult) => {

    console.log("Photo",designPaper.path)

    if (!updatedDateFrom || !updatedDateTo || !fabricQuality || !fabricLength || !numLoomsRequired || !dalalAgent || !jobRateOffered || !numLoomsRequired || !machineType || !width || !rpm || !sheddingType || !numFrames || !numFeeders || !selvadgeJacquard || !topBeam || !cramming || !lenoDesign) {
      Alert.alert("Data Not Filled Properly Please Fill All Input Boxes")
    } else {
      console.log("Fabric Quality = ", calculatedResult)

      const formdata = new FormData();
      formdata.append("EnquiryDate", formattedDate);
      formdata.append("TraderId", id);
      formdata.append("BookingFrom", updatedDateFrom);
      formdata.append("BookingTo", updatedDateTo);
      formdata.append("FabricQuality", fabricQuality);
      formdata.append("FabricLength", fabricLength);
      formdata.append("LoomRequired", numLoomsRequired);
      formdata.append("AgentName", dalalAgent);
      formdata.append("OfferedJobRate", jobRateOffered);
      formdata.append("FabricWidth", jobRateOffered);
      formdata.append("DeliveryDate", jobRateOffered);
      formdata.append("Description", jobRateOffered);
      if (designPaper && designPaper.path) {
        formdata.append('PhotoPath', {
          uri: designPaper.path,
          type: "image/jpg",
          name: "designPaper.jpg",
        });
      } else {
        formdata.append('PhotoPath', null);
      }
      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      };

      fetch("https://textileapp.microtechsolutions.co.in/php/postenquiry.php", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          SubmitEnquiryDetails(result)
        })
        .catch((error) => console.error(error));
      console.log(formattedDate, id, Name, updatedDateFrom, updatedDateTo, calculatedResult, fabricLength, dalalAgent, loomNo, machineType, width, rpm, sheddingType, numFrames, numFeeders, selvadgeJacquard, topBeam, cramming, lenoDesign, availableLoomDates, numLoomsRequired, numLoomsPossible, jobRateOffered, counterOffer);
    }

  };

  const SubmitEnquiryDetails = (result) => {

    const formdata = new FormData();
    formdata.append("EnquiryId", result);
    formdata.append("LoomNo", numLoomsRequired);
    formdata.append("MachineType", machineType);
    formdata.append("Width", width);
    formdata.append("RPM", rpm);
    formdata.append("SheddingType", sheddingType);
    formdata.append("NoofFrame", numFrames);
    formdata.append("NoofFeedero", numFeeders);
    formdata.append("SelvageJacquard", selvadgeJacquard);
    formdata.append("TopBeam", topBeam);
    formdata.append("Cramming", cramming);
    formdata.append("LenoDesignEquipment", lenoDesign);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/postenquirydetail.php", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    setShowForm(false)
    setShowTable(true)
  }


  const [epi, setEpi] = useState('');
  const [ppi, setPpi] = useState('');
  const [warpCount, setWarpCount] = useState('');
  const [weftCount, setWeftCount] = useState('');
  const [panna, setPanna] = useState('');
  const [result, setResult] = useState('');

  const calculateResult = () => {

    if (!epi || !ppi || !warpCount || !weftCount || !panna) {
      Alert.alert("Set The Value Of Fabric Quality")
    } else {
      const epiValue = parseFloat(epi);
      const ppiValue = parseFloat(ppi);
      const warpCountValue = parseFloat(warpCount);
      const weftCountValue = parseFloat(weftCount);
      const pannaValue = parseFloat(panna);

      if (epiValue && ppiValue && warpCountValue && weftCountValue && pannaValue) {
        const calculatedResult = (epiValue + "*" + ppiValue + "/" + warpCountValue + "*" + weftCountValue + ":" + pannaValue);
        handleSubmit(calculatedResult)
      } else {
        setResult('Invalid Input');
      }
    }


  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e5f2fe" }}>
      <StatusBar backgroundColor={"#003C43"}></StatusBar>
      <View style={{ backgroundColor: "#003C43", flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <ImageBackground
            source={require("../Images/drawer.png")}
            style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003C43", marginTop: 15, marginRight: 0, marginLeft: 10 }}
            imageStyle={{ borderRadius: 0 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, color: "white", margin: "2.5%", marginLeft: "25%" }}>Plan Looms</Text>
        <TouchableOpacity onPress={() => fetchselectedEnquiryId()}>
          <ImageBackground
            source={require("../Images/refresh2.png")}
            style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003C43", marginTop: 15, marginRight: -30, marginLeft: 80 }}
            imageStyle={{ borderRadius: 0 }}
          />
        </TouchableOpacity>
      </View>
      {selectedItem ? (
        <View>
          <TouchableOpacity onPress={() => setSelectedItem(null)} style={{ padding: 10, backgroundColor: 'lightgray', alignItems: 'center' }}>
            <Text>Back to List</Text>
          </TouchableOpacity>
          <View style={{ marginVertical: 10, marginHorizontal: 20, padding: 10, backgroundColor: '#eee', borderRadius: 5 }}>
            <Text>ID: {selectedItem.EnquiryId}</Text>
            <Text>EnquiryNo: {selectedItem.EnquiryNo}</Text>
            <Text>EnquiryDate: {selectedItem.EnquiryDate.date.substring(0, 10)}</Text>
            <Text>TraderId: {selectedItem.TraderId}</Text>
            <Text>BookingFrom: {selectedItem.BookingFrom.date.substring(0, 10)}</Text>
            <Text>BookingTo: {selectedItem.BookingTo.date.substring(0, 10)}</Text>
            <Text>FabricQuality: {selectedItem.FabricQuality}</Text>
            <Text>LoomRequired: {selectedItem.LoomRequired}</Text>
            <Text>AgentName: {selectedItem.AgentName}</Text>
            <Text>OfferedJobRate: {selectedItem.OfferedJobRate}</Text>

          </View>
        </View>
      ) : (
        <ScrollView>
          {

            showTable ? <View style={styles.container}>

              <TouchableOpacity onPress={() => Toggle()} style={{ backgroundColor: '#003C43', padding: 10, alignItems: 'center', marginTop: "10%" }}>
                <Text style={{ color: 'white' }}>NEW</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ConfirmEnquires")} style={{ backgroundColor: '#003C43', padding: 10, alignItems: 'center', marginTop: "10%" }}>
                <Text style={{ color: 'white' }}>Confirm Enquires</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Generated_Enquires")} style={{ backgroundColor: '#003C43', padding: 10, alignItems: 'center', marginTop: "10%" }}>
                <Text style={{ color: 'white' }}>Your Enquires</Text>
              </TouchableOpacity>
            </View> : null

          }
        </ScrollView>
      )}

      {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View> : null}

      {
        showForm ?
          <ScrollView>
            <View style={styles.containerform}>

              <Text style={styles.input1}>Trader Name : {Name}</Text>
              <Text style={styles.input1}>Trader Id : {id}</Text>

              {/* Date Fields */}
              <View style={{ flexDirection: "column", justifyContent: "space-evenly" }}>
                <Text style={{ marginTop: "3%", fontSize: 20, marginLeft: "0%", color: "#000" }}>Date : {formattedDate}</Text>

                <View style={{ flexDirection: "row" }}>
                  <Text style={{ marginTop: "3%", fontSize: 20, marginLeft: "0%", marginTop: "8%", color: "#000" }}>From : </Text>
                  <TextInput
                    style={[styles.input, { width: "60%", marginTop: "5%" }]}
                    value={updatedDateFrom}
                    onChangeText={setFromDate}
                    placeholder="From Date   "
                    keyboardType="numeric"
                    placeholderTextColor={"#000"}

                  />
                  <TouchableOpacity onPress={() => showModefrom('date')} style={{}}>
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
                        minimumDate={new Date()}
                        display='default'
                        onChange={(DateFrom)} />
                    )
                  }
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ marginTop: "3%", fontSize: 20, marginLeft: "0%", paddingRight: "5%", color: "#000" }}>To  : </Text>

                  <TextInput
                    style={[styles.input, { width: "60%" }]}
                    value={updatedDateTo}
                    onChangeText={setToDate}
                    placeholder="To Date    "
                    placeholderTextColor={"#000"}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity onPress={() => showModeto('date')} style={{}}>
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
                        minimumDate={new Date()}
                        display='default'
                        onChange={(DateTo)} />
                    )
                  }
                </View>


              </View>
              <TextInput
                style={styles.input}
                value={numLoomsRequired}
                onChangeText={setNumLoomsRequired}
                placeholder="No. of Looms Required"
                keyboardType="numeric"
                placeholderTextColor={"#000"}

              />

              <View style={{ flexDirection: "row" }}>
                <TextInput
                  style={[styles.input, { width: "70%" }]}
                  value={jobRateOffered}
                  onChangeText={setJobRateOffered}
                  placeholder="Job Rate"
                  keyboardType="numeric"
                  placeholderTextColor={"#000"}
                />
                <Text style={{ fontSize: 20, color: "#000", marginLeft: "5%", marginTop: "2.5%" }}>Paisa</Text>
              </View>

              <Text style={{ color: "#000", fontSize: 18, marginLeft: "2%" }}>Fabric Quality :- </Text>
              <View style={{ flexDirection: "row", marginLeft: "10%", marginTop: "5%" }}>

                <TextInput
                  style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, marginBottom: 10 }}
                  placeholder="EPI"
                  keyboardType="numeric"
                  placeholderTextColor={"#000"}
                  value={epi}
                  onChangeText={setEpi}
                />
                <Text style={{ marginTop: "3%", fontSize: 20 }}> * </Text>
                <TextInput
                  style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, marginBottom: 10 }}
                  placeholder="PPI"
                  keyboardType="numeric"
                  placeholderTextColor={"#000"}
                  value={ppi}
                  onChangeText={setPpi}
                />
                <Text style={{ marginTop: "3%", fontSize: 20 }}> / </Text>
                <TextInput
                  style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, marginBottom: 10 }}
                  placeholder="WC"
                  keyboardType="numeric"
                  placeholderTextColor={"#000"}
                  value={warpCount}
                  onChangeText={setWarpCount}
                />
                <Text style={{ marginTop: "3%", fontSize: 20 }}> * </Text>
                <TextInput
                  style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, marginBottom: 10 }}
                  placeholder="WC"
                  keyboardType="numeric"
                  placeholderTextColor={"#000"}
                  value={weftCount}
                  onChangeText={setWeftCount}
                />
                <Text style={{ marginTop: "3%", fontSize: 20 }}> : </Text>
                <TextInput
                  style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, marginBottom: 10 }}
                  placeholder="Width"
                  keyboardType="numeric"
                  placeholderTextColor={"#000"}
                  value={panna}
                  onChangeText={setPanna}
                />


              </View>

              <TextInput
                style={styles.input}
                value={fabricLength}
                onChangeText={setFabricLength}
                placeholder="Fabric Length (in meters)"
                keyboardType="numeric"
                placeholderTextColor={"#000"}

              />

              <TextInput
                style={[styles.input, { width: "100%" }]}
                value={dalalAgent}
                onChangeText={(txt) => setDalalAgent(txt)}
                placeholder="Agent Name"
                keyboardType='default'
                placeholderTextColor={"#000"}
              />

              <Dropdown
                style={[styles.input, isFocus3 && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={machineDataType}
                search
                itemTextStyle={{ color: "#000" }}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus3 ? 'Select Machine Type' : '...'}
                searchPlaceholder="Search..."
                value={machineType}
                onFocus={() => setIsFocus3(true)}
                onBlur={() => setIsFocus3(false)}
                onChange={item => {
                  setMachineType(item.value);
                  setIsFocus3(false);
                }} />


              <TextInput
                style={styles.input}
                value={rpm}
                onChangeText={setRpm}
                placeholder="RPM"
                keyboardType="numeric"
                placeholderTextColor={"#000"}

              />

              <View style={{ flexDirection: "row", marginTop: "5%" }}>
                <TextInput
                  style={[styles.input, { width: "80%" }]}
                  value={width}
                  onChangeText={setWidth}
                  placeholder="Width"
                  keyboardType="numeric"
                  placeholderTextColor={"#000"}

                />
                <Text style={{ color: "#000", fontSize: 17 }}>In cm</Text>
              </View>
              <Dropdown
                style={[styles.input, isFocus4 && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={sheddingData}
                search
                itemTextStyle={{ color: "#000" }}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus4 ? 'Select shedding Type' : '...'}
                searchPlaceholder="Search..."
                value={sheddingType}
                onFocus={() => setIsFocus4(true)}
                onBlur={() => setIsFocus4(false)}
                onChange={item => {
                  setSheddingType(item.value);
                  setIsFocus4(false);
                }} />


              <Dropdown
                style={[styles.input, isFocus5 && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={numofFramesData}
                search
                itemTextStyle={{ color: "#000" }}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus5 ? 'Select No. of Frames' : '...'}
                searchPlaceholder="Search..."
                value={numFrames}
                onFocus={() => setIsFocus5(true)}
                onBlur={() => setIsFocus5(false)}
                onChange={item => {
                  setNumFrames(item.value);
                  setIsFocus5(false);
                }} />

              <Dropdown
                style={[styles.input, isFocus6 && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={nooffeedersdata}
                search
                itemTextStyle={{ color: "#000" }}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus6 ? 'Select No. of Feeders' : '...'}
                searchPlaceholder="Search..."
                value={numFeeders}
                onFocus={() => setIsFocus6(true)}
                onBlur={() => setIsFocus6(false)}
                onChange={item => {
                  setNumFeeders(item.value);
                  setIsFocus6(false);
                }} />

              <View style={styles.checkboxContainer}>

                <Text style={{ marginRight: "12%", fontSize: 17, color: "#000" }}>Selvadge Jacquard</Text>
                <CheckBox
                  tintColors={{ true: 'blue', false: 'black' }} // Change color when checked and unchecked
                  tintColor="black" // Change the box color when unchecked
                  onCheckColor="blue" // Change the check color when checked
                  value={selvadgeJacquard}
                  onValueChange={setSelvadgeJacquard}
                />
                <Text style={{ fontSize: 17, color: "#000" }}>yes</Text>

              </View>
              <View style={styles.checkboxContainer}>

                <Text style={{ marginRight: "31%", fontSize: 17, color: "#000" }}>Top Beam</Text>
                <CheckBox
                  tintColors={{ true: 'blue', false: 'black' }} // Change color when checked and unchecked
                  tintColor="black" // Change the box color when unchecked
                  onCheckColor="blue" // Change the check color when checked
                  value={topBeam}
                  onValueChange={setTopBeam}
                />
                <Text style={{ fontSize: 17, color: "#000" }}>yes</Text>
              </View>
              <View style={styles.checkboxContainer}>

                <Text style={{ marginRight: "31%", fontSize: 17, color: "#000" }}>Cramming</Text>
                <CheckBox
                  tintColors={{ true: 'blue', false: 'black' }} // Change color when checked and unchecked
                  tintColor="black" // Change the box color when unchecked
                  onCheckColor="blue" // Change the check color when checked
                  value={cramming}
                  onValueChange={setCramming}
                />
                <Text style={{ fontSize: 17, color: "#000" }}>yes</Text>

              </View>
              <View style={styles.checkboxContainer}>

                <Text style={{ marginRight: "3%", fontSize: 17, color: "#000" }}>Leno Design Equipment</Text>
                <CheckBox
                  tintColors={{ true: 'blue', false: 'black' }} // Change color when checked and unchecked
                  tintColor="black" // Change the box color when unchecked
                  onCheckColor="blue" // Change the check color when checked
                  value={lenoDesign}
                  onValueChange={setLenoDesign}
                />
                <Text style={{ fontSize: 17, color: "#000" }}>yes</Text>

              </View>

              <View style={{ flexDirection: "row", marginTop: "5%" }}>
                <TextInput
                  style={[styles.input, { width: "80%" }]}
                  value={fabricWidth}
                  onChangeText={setFabricWidth}
                  placeholder="Fabric Width"
                  keyboardType="numeric"
                  placeholderTextColor={"#000"}
                />
                <Text style={{ color: "#000", fontSize: 17 }}>In cm</Text>
              </View>

              {/* Description */}
              <View style={{ marginTop: "0%" }}>
                <TextInput
                  style={[styles.input, { width: "100%" }]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Description"
                  keyboardType='default'
                  placeholderTextColor={"#000"}
                  multiline={true} // Allows multiple lines of input
                  numberOfLines={5}
                />
              </View>

              <View style={{ flexDirection: "row", marginBottom: 20, marginTop: "5%" }}>
                <Text style={{ marginTop: "3%", fontSize: 20, marginLeft: "0%", color: "#000" }}>Delivery Date: </Text>
                <Text style={{ color: "#000", marginTop: "4%", marginHorizontal: "5%", fontSize: 17 }}>{formatDate(deliveryDate)}</Text>
                <TouchableOpacity onPress={() => setShowDeliveryDate(true)}>
                  <ImageBackground
                    source={require('../Images/calendar.png')}
                    style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#006A4E", marginLeft: "20%" }}
                    imageStyle={{ borderRadius: 0 }}
                  />
                </TouchableOpacity>
                {showDeliveryDate && (
                  <DateTimePicker
                    testID='dateTimePicker'
                    value={deliveryDate}
                    mode='date'
                    is24Hour={false}
                    minimumDate={new Date()}
                    display='default'
                    onChange={handleDeliveryDateChange}
                  />
                )}
              </View>

              <View style={{ flexDirection: "row", marginVertical: "5%",marginTop:"15%" }}>
                <Text style={{ color: "#000", fontSize: 18 }}>Design Paper (Optional)</Text>
                {designPaper && (
                  <ImageBackground
                    source={{ uri: designPaper.path }}
                    style={{ width: 100, height: 100,margin:10 ,marginTop:"-10%"}}
                  />
                )}
                <TouchableOpacity onPress={openCamera}>
                  <ImageBackground
                    source={require('../Images/camera.png')}
                    style={{ width: 34, height: 30, alignSelf: 'flex-start', marginLeft: "20%" }}
                    imageStyle={{ borderRadius: 0 }}
                  />
                </TouchableOpacity>

              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-evenly",marginTop:"5%" }}>
                <TouchableOpacity style={[styles.button]} onPress={() => { calculateResult() }}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.notInterestedButton]} onPress={() => setModalVisible(true)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

              </View>
              <Text style={{ marginTop: "20%" }}></Text>
            </View>
          </ScrollView>
          : null
      }

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
            <Text style={styles.modalText}>Are You Sure To Cancel This Offer ?</Text>
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
    </SafeAreaView>
  )
}

export default PlanLooms

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
    color: "#000",
    fontSize: 15
  },
  headerText1: {
    color: "#000",
    fontSize: 15
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
    borderBottomWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 17,
    color: "#000"
  },
  input1: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 20,
    color: "#000"
  },
  button: {
    backgroundColor: '#003C43',
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
    backgroundColor: "#003C43",
  },
  buttonClose1: {
    backgroundColor: "#003C43",
    margin: "5%"
  },
  textStyle1: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: "#003C43"
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: "#000",
    fontSize: 17
  },
})