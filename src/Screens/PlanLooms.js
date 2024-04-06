import { SafeAreaView, StyleSheet, Text, View, StatusBar, ImageBackground, ActivityIndicator, TextInput, TouchableOpacity, Dimensions, FlatList, Button, ScrollView, Alert, Pressable, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import CheckBox from '@react-native-community/checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';




const { width } = Dimensions.get('window');

const data = [
  { srNo: 1, enquiryNo: 'ENQ-001', date: '2024-02-26', traderName: 'Trader A' },
  { srNo: 2, enquiryNo: 'ENQ-002', date: '2024-02-26', traderName: 'Trader B' },
  { srNo: 3, enquiryNo: 'ENQ-003', date: '2024-02-25', traderName: 'Trader C' },
  { srNo: 4, enquiryNo: 'ENQ-004', date: '2024-02-25', traderName: 'Trader D' },
  { srNo: 5, enquiryNo: 'ENQ-005', date: '2024-02-24', traderName: 'Trader E' },
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



  useEffect(() => {
    getData();
    console.log(Name, AppUserId, LoomOrTrader, id)
    currentDate1();
  }, [])



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


  const [data, setData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchData = async () => {
    setLoading(true)
    fetch('https://textileapp.microtechsolutions.co.in/php/getidenquiry.php?Colname=TraderId&Colvalue=' + id)
      .then(response => response.json())
      .then(jsonData => {setData(jsonData); console.log(jsonData) ; setLoading(false)})
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false)
      });
  };



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
        .then(fetchData())
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

  const handleSubmit = () => {
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
    console.log(formattedDate, id, Name, updatedDateFrom, updatedDateTo, fabricQuality, fabricLength, dalalAgent, loomNo, machineType, width, rpm, sheddingType, numFrames, numFeeders, selvadgeJacquard, topBeam, cramming, lenoDesign, availableLoomDates, numLoomsRequired, numLoomsPossible, jobRateOffered, counterOffer);

  };



  const SubmitEnquiryDetails = (result) => {
    const formdata = new FormData();
    formdata.append("EnquiryId", result);
    formdata.append("LoomNo", numLoomsPossible);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e5f2fe" }}>
      <StatusBar backgroundColor={"#0b659a"}></StatusBar>
      <View style={{ backgroundColor: "#71B7E1", flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <ImageBackground
            source={require("../Images/drawer.png")}
            style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#71B7E1", marginTop: 15, marginRight: 0, marginLeft: 10 }}
            imageStyle={{ borderRadius: 0 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, color: "white", margin: "2.5%", marginLeft: "25%" }}>Plan Looms</Text>
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
              <View style={styles.header}>
                <View style={[styles.cell, { flex: 2 }]}>
                  <Text style={styles.headerText}>Enquiry No.</Text>
                </View>
                <View style={[styles.cell, { flex: 2 }]}>
                  <Text style={styles.headerText}>Date</Text>
                </View>
                <View style={[styles.cell, { flex: 3 }]}>
                  <Text style={styles.headerText}>Trader Name</Text>
                </View>
              </View>

              {data ?
                data.map(item => (
                  <TouchableOpacity key={item.id} onPress={() => handleItemPress(item)}>
                    <View key={item.EnquiryId} style={[styles.header, { justifyContent: "space-evenly" }]}>
                      <View style={[styles.cell, { flex: 2 }]}>
                        <Text style={styles.headerText1}>{item.EnquiryNo}</Text>
                      </View>
                      <View style={[styles.cell, { flex: 2 }]}>
                        <Text style={styles.headerText1}>{item.EnquiryDate.date.substring(0, 10)}</Text>
                      </View>
                      <View style={[styles.cell, { flex: 3 }]}>
                        <Text style={styles.headerText1}>{Name}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                )) : null}

              <TouchableOpacity onPress={() => Toggle()} style={{ backgroundColor: '#71B7E1', padding: 10, alignItems: 'center', marginTop: "10%" }}>
                <Text style={{ color: 'white' }}>NEW</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => fetchData()} style={{ backgroundColor: '#71B7E1', padding: 10, alignItems: 'center', marginTop: "10%" }}>
                <Text style={{ color: 'white' }}>Refresh</Text>
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


              <TextInput
                style={styles.input}
                value={fabricQuality}
                onChangeText={setFabricQuality}
                placeholder="Fabric Quality"
                placeholderTextColor={"#000"}

              />
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
                value={width}
                onChangeText={setWidth}
                placeholder="Width"
                keyboardType="numeric"
                placeholderTextColor={"#000"}

              />
              <TextInput
                style={styles.input}
                value={rpm}
                onChangeText={setRpm}
                placeholder="RPM"
                keyboardType="numeric"
                placeholderTextColor={"#000"}

              />


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





              <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                <TouchableOpacity style={[styles.button]} onPress={() => { handleSubmit() }}>
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