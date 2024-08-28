import { SafeAreaView, StyleSheet, Text, View, StatusBar, Image, ImageBackground, ActivityIndicator, TextInput, TouchableOpacity, Dimensions, FlatList, Button, ScrollView, Alert, Pressable, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import CheckBox from '@react-native-community/checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const PlanLooms = ({ navigation, focused }) => {
  const [showTable, setShowTable] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [Name, setName] = useState("");
  const [AppUserId, setAppUserId] = useState("")
  const [LoomOrTrader, SetLoomOrTrader] = useState("")
  const [id, setId] = useState("")
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  useEffect(() => {
    fetchselectedEnquiryId();
    const callfuns = () => {
      fetch("")
        .then(getData())
    }
    callfuns();

    const getTodaysDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(today.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    };

    const todaysDate = getTodaysDate();
    setTodaysDate(todaysDate);
    console.log(todaysDate)

  }, [])

  const [TodaysDate, setTodaysDate] = useState(null)

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

  const yesbutton = () => {
    setShowForm(false)
    setShowTable(true)
    setModalVisible2(false)
    setModalVisible(false)

    setDesignPaper(null)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor={"#003C43"} />
      <View style={{ backgroundColor: "#003C43", flexDirection: "row", alignItems: 'center', height: 50 }}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
        >
          <Image
            source={require("../Images/drawer1.png")}
            style={{ width: 28, height: 22, marginLeft: 10, }}
          />
        </TouchableOpacity>

        <View style={{ flex: 0.9, alignItems: 'center' }}>
          <Text style={{ fontSize: 26, color: "white", fontWeight: 500 }}>  Plan Looms </Text>
        </View>

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

              <TouchableOpacity
                onPress={() => navigation.navigate("NewEnquiry")}
                style={styles.btn}
              >
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                  <Icon name='user-plus' size={45} color={'#003C43'} />
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <Text style={{ fontSize: 20, color: '#003C43', fontWeight: '500' }}> Generate Enquiry </Text>

                </View>

              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("ConfirmEnquires")}
                style={styles.btn}
              >
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                  <Icon name='check-square-o' size={55} color={'#003C43'} />
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <Text style={{ fontSize: 18, color: '#003C43', fontWeight: '500', height: "100%" }}> Check Enquiry Response </Text>

                </View>

              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Generated_Enquires")}
                style={styles.btn}
              >
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                  <Icon name='list-alt' size={55} color={'#003C43'} />
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <Text style={{ fontSize: 20, color: '#003C43', fontWeight: '500' }}> Your Enquires </Text>

                </View>

              </TouchableOpacity>

            </View> : null

          }
        </ScrollView>
      )}

      {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View> : null}

    </SafeAreaView>
  )
}

export default PlanLooms

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 30,
    alignItems: 'center',
    width: width * 1,
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
  fabricQuality: {
    width: width * 1,
    flexDirection: "row",
  },
  fabricDetails: {
    height: height * 0.05,
    width: width * 0.15,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: height * 0.02,
    fontSize: 10,
    color: "#000",
    fontWeight: "800"
  },
  flatList: {
    marginTop: 10,
    color: "#000"
  },
  containerform: {
    padding: 20,
    color: "#000",
    width: width * 0.99,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 17,
    color: "#000",
    fontWeight: "500"
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
    marginLeft: "3%",

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
    color: "grey"
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
  btn: {
    height: 150,
    width: width * 0.8,
    padding: 10,
    borderRadius: 15,
    borderWidth: 3,
    marginBottom: 30,
    borderColor: '#003C43',
    alignItems: 'center'
  }
})