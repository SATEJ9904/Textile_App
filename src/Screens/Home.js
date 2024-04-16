import { TouchableOpacity, SafeAreaView, StyleSheet, Text, View, ImageBackground, StatusBar, RefreshControl,ScrollView, TextInput, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Table, Row, Rows } from 'react-native-table-component';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOTP } from "totp-generator"
import notifee from '@notifee/react-native';
import email from 'react-native-email'
import Mailer from 'react-native-mail';
import SendSMS from 'react-native-sms'
import { getAllCountries, getStatesOfCountry, getCitiesOfState, Country, State, City } from 'country-state-city';
import { Dropdown } from 'react-native-element-dropdown';
import CheckBox from '@react-native-community/checkbox';
import NetInfo from "@react-native-community/netinfo";
import Video from 'react-native-video';


const Home = ({ navigation }) => {


  const [machineNo, setMachineNo] = useState([]);
  const [machineType, setMachineType] = useState([]);
  const [width, setWidth] = useState([]);
  const [rpm, setRPM] = useState([]);
  const [sheddingType, setSheddingType] = useState([]);
  const [noOfFrames, setNoOfFrames] = useState([]);
  const [noOfFeeders, setNoOfFeeders] = useState([]);
  const [MonoJac, setMonoJac] = useState([]);
  const [topBeam, setTopBeam] = useState([]);
  const [cramming, setCramming] = useState([]);
  const [otherDesc, setOtherDesc] = useState([]);
  const [Name, setName] = useState("");
  const [AppUserId, setAppUserId] = useState("")
  const [LoomOrTrader, SetLoomOrTrader] = useState("")
  const [id, setId] = useState("")
  const [otpinput, setotpInput] = useState("")
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState("");
  const [isFocus2, setIsFocus2] = useState("");
  const [isFocus3, setIsFocus3] = useState("");
  const [isFocus4, setIsFocus4] = useState("");

  const [variables, setVariables] = useState({});
  const [show, setShow] = useState('')

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const [showmsg, setShowMsg] = useState(true)
  const [isConected, setisConnected] = useState(false)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection Type', state.type);
      console.log('Is Connected ? ', state.isConnected);
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


  handleEmail = () => {
    Mailer.mail({
      subject: 'need help',
      recipients: ['satejshendage@gmail.com'],
      ccRecipients: ['prasannaa@microtechsolutions.co.in'],
      bccRecipients: [''],
      body: '<b>A Bold Body</b>',
      customChooserTitle: 'This is my new title', // Android only (defaults to "Send Mail")
      isHTML: true,
    }, (error, event) => {
      Alert.alert(
        error,
        event,
        [
          { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
          { text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response') }
        ],
        { cancelable: true }
      )
    });
  }


  const sms = () => {
    SendSMS.send({
      body: ' email from satej for testing of Application',
      recipients: ['9119405279904'],
      successTypes: ['sent', 'queued'],
      allowAndroidSendWithoutReadPermission: true
    }, (completed, cancelled, error) => {

      console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);

    });
  }


  //   handleEmail = () => {
  //     const to = ['satejshendage@gmail.com'] // string or array of email addresses
  //     email(to, {
  //         // Optional additional arguments
  //         cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
  //         bcc: 'mee@mee.com', // string or array of email addresses
  //         subject: 'Show how to use',
  //         body: 'Some body right here',
  //         checkCanOpen: false // Call Linking.canOpenURL prior to Linking.openURL
  //     }).catch(console.error)
  // }




  const generateotp = async () => {
    const { otp } = TOTP.generate("JBSWY3DPEHPK3PXP", {
      digits: 6,
      algorithm: "SHA-512",
      period: 2,
    })
    console.log(otp)
    setOtherDesc(otp)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Your Verification Code is',
      body: otp,
      android: {
        channelId,
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  const checkotp = () => {
    if (otpinput == otherDesc) {
      console.log("User Verified")
    } else {
      console.log("User not verified")
    }
  }


  useEffect(() => {
    getData();
    console.log(Name, AppUserId, LoomOrTrader, id)
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

  const DeleteStorage = async () => {
    try {
      await AsyncStorage.removeItem('Name');
      await AsyncStorage.removeItem('AppUserId');

      console.log("data deleted")
      navigation.navigate("Splash")
    } catch (err) {
      console.log('Error', err)
    }


  }


  const submit = () => {
    console.log("Table Data = ", tableData)
  }

  const data = [width, machineNo, machineType, rpm, sheddingType, noOfFrames, topBeam, noOfFeeders, MonoJac, cramming, otherDesc,]


  const [tableData, setTableData] = useState([
    {
      id: 1,
      machineNo: '',
      machineType: '',
      width: '',
      rpm: '',
      sheddingType: '',
      noOfFrames: '',
      noOfFeeders: '',
      monogramJacquard: false,
      topBeam: false,
      cramming: false,
      otherDescription: '',
    },
  ]);
  const [rowCount, setRowCount] = useState(1);

  const addRow = () => {
    const newRow = {
      id: rowCount + 1,
      machineNo: '',
      machineType: '',
      width: '',
      rpm: '',
      sheddingType: '',
      noOfFrames: '',
      noOfFeeders: '',
      monogramJacquard: false,
      topBeam: false,
      cramming: false,
      otherDescription: '',
    };
    setTableData([...tableData, newRow]);
    setRowCount(rowCount + 1);
  };

  const handleInputChange = (value, fieldName, index) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][fieldName] = value;
    setTableData(updatedTableData);
  };


  const handleCheckBoxChange = (fieldName, index) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][fieldName] = !updatedTableData[index][fieldName];
    setTableData(updatedTableData);
  };

  // const handleInputChange = (value, fieldName, index) => {
  //   const updatedTableData = [...tableData];
  //   updatedTableData[index][fieldName] = value;
  //   setTableData(updatedTableData);
  //   console.log(tableData)
  // };


  const removeRow = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  };


  const countries = Country.getAllCountries().map(Country => ({ label: Country.name, value: Country.isoCode }));


  const handleAddVariable = () => {
    if (!machineNo || !machineType || !width || !rpm || !sheddingType || !noOfFrames || !noOfFeeders || !MonoJac || !topBeam || !cramming || !otherDesc) return; // Ensure both name and value are provided
    setVariables({
      ...variables,
      [variableName]: variableValue // Dynamically create a property with variableName as key and variableValue as value
    });
    setMachineNo(); // Clear input fields
    setMachineType();
    setWidth();
    setRPM();
    setSheddingType();
    setNoOfFrames();
    setNoOfFeeders();
    setMonoJac();
    setTopBeam();
    setCramming();
    setOtherDesc();

  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e5f2fe" }}>
      <View>
        <StatusBar backgroundColor={"#0b659a"}></StatusBar>
        <View style={{ backgroundColor: "#71B7E1", flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <ImageBackground
              source={require("../Images/drawer.png")}
              style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#71B7E1", marginTop: 15, marginRight: 0, marginLeft: 10 }}
              imageStyle={{ borderRadius: 0 }}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, color: "white", margin: "2.5%", marginLeft: "30%" }}>Home</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 22, color: "#000", marginLeft: "0%", marginTop: "5%", marginRight: "5%", marginLeft: "5%" }}>Welcome :{Name},{id}</Text>
        </View>



        {/* <ScrollView horizontal={true}>
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <Text style={[styles.headerText, styles.box]}>Machine No.</Text>
              <Text style={[styles.headerText, styles.box]}>Machine Type</Text>
              <Text style={[styles.headerText, styles.box]}>Width</Text>
              <Text style={[styles.headerText, styles.box]}>RPM</Text>
              <Text style={[styles.headerText, styles.box]}>Shedding Type</Text>
              <Text style={[styles.headerText, styles.box]}>No. of Frames</Text>
              <Text style={[styles.headerText, styles.box]}>No. of Feeders</Text>
              <Text style={[styles.headerText, styles.box]}>Monogram Jacquard</Text>
              <Text style={[styles.headerText, styles.box]}>Top Beam</Text>
              <Text style={[styles.headerText, styles.box]}>Cramming</Text>
              <Text style={[styles.headerText, styles.box]}>Other Description</Text>
            </View>

            {tableData.map((rowData, index) => (
              <View key={rowData.id} style={styles.dataRow}>
                <TextInput
                  style={[styles.input, styles.box]}
                  value={rowData.machineNo}
                  onChangeText={(value) => handleInputChange(value, 'machineNo', index)}
                />
                <Dropdown
                  style={[styles.input, isFocus, styles.box, { marginRight: 0 }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={countries}
                  search
                  itemTextStyle={{ color: "#000" }}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Select Country' : '...'}
                  searchPlaceholder="Search..."
                  value={rowData.machineType}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => handleInputChange(item.value, 'machineType', index)} />


                <TextInput
                  style={[styles.input, styles.box]}
                  value={rowData.width}
                  onChangeText={(value) => handleInputChange(value, 'width', index)}
                />
                <TextInput
                  style={[styles.input, styles.box]}
                  value={rowData.rpm}
                  onChangeText={(value) => handleInputChange(value, 'rpm', index)}
                />
                <Dropdown
                  style={[styles.input, isFocus, styles.box, { marginRight: 0 }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={countries}
                  search
                  itemTextStyle={{ color: "#000" }}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus2 ? 'Select Country' : '...'}
                  searchPlaceholder="Search..."
                  value={rowData.sheddingType}
                  onFocus={() => setIsFocus2(true)}
                  onBlur={() => setIsFocus2(false)}
                  onChange={(item) => handleInputChange(item.value, 'sheddingType', index)} />

                <Dropdown
                  style={[styles.input, isFocus, styles.box, { marginRight: 0 }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={countries}
                  search
                  itemTextStyle={{ color: "#000" }}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus2 ? 'Select Country' : '...'}
                  searchPlaceholder="Search..."
                  value={rowData.noOfFrames}
                  onFocus={() => setIsFocus3(true)}
                  onBlur={() => setIsFocus3(false)}
                  onChange={(item) => handleInputChange(item.value, 'noOfFrames', index)} />

                <Dropdown
                  style={[styles.input, isFocus, styles.box, { marginRight: 0 }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={countries}
                  search
                  itemTextStyle={{ color: "#000" }}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus2 ? 'Select Country' : '...'}
                  searchPlaceholder="Search..."
                  value={rowData.noOfFeeders}
                  onFocus={() => setIsFocus4(true)}
                  onBlur={() => setIsFocus4(false)}
                  onChange={(item) => handleInputChange(item.value, 'noOfFeeders', index)} />
              
                <View style={[styles.input, styles.box, { flexDirection: "row" }]}>
                  <CheckBox
                    disabled={false}
                    value={rowData.monogramJacquard}
                    onValueChange={() => handleCheckBoxChange('monogramJacquard', index)}
                  />
                  <Text style={{ color: "#000", marginLeft: "5%", fontSize: 20 }}>yes</Text>
                </View>
                <View style={[styles.input, styles.box, { flexDirection: "row" }]}>
                  <CheckBox
                    disabled={false}
                    value={rowData.topBeam}
                    onValueChange={() => handleCheckBoxChange('topBeam', index)}
                  />
                  <Text style={{ color: "#000", marginLeft: "5%", fontSize: 20 }}>yes</Text>
                </View>
                <View style={[styles.input, styles.box, { flexDirection: "row" }]}>
                  <CheckBox
                    disabled={false}
                    value={rowData.cramming}
                    onValueChange={() => handleCheckBoxChange('cramming', index)}
                  />
                  <Text style={{ color: "#000", marginLeft: "5%", fontSize: 20 }}>yes</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.box, { flex: 2 }]}
                  value={rowData.otherDescription}
                  onChangeText={(value) => handleInputChange(value, 'otherDescription', index)}
                />
                <TouchableOpacity onPress={() => removeRow(index)} style={styles.addRowButton}>
                  <Text style={{color:"#fff"}}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={addRow} style={styles.addRowButton}>
                  <Text style={{color:"#fff"}}>Add Row</Text>
                </TouchableOpacity>
              </View>

            ))}

          </View>
        </ScrollView> 
        <TouchableOpacity
          onPress={() => submit()}
          style={{ justifyContent: "center" }}
        >
          <Text style={{ color: "#fff", fontSize: 25, backgroundColor: "blue", marginLeft: "38%", marginRight: "25%", padding: "0%", paddingHorizontal: "8%", padding: "3%", borderRadius: 30 }}>Submit</Text>
        </TouchableOpacity>
        <View style={{ justifyContent: 'flex-end', alignItems: "flex-end", marginTop: "150%" }}>
          <TouchableOpacity
            onPress={() => handleEmail()}
            style={{ justifyContent: "center" }}
          >
            <Text style={{ color: "#fff", fontSize: 25, backgroundColor: "red", marginLeft: "25%", marginRight: "25%", padding: "0%", paddingHorizontal: "8%", padding: "3%", borderRadius: 30 }}>Delete User</Text>
          </TouchableOpacity>
        </View>

*/}

      </View>



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
              {isConected ? 'Back Online' : 'no Internet Connection'}
            </Text>

          </View>
        </View> : null
      }

      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Text>Pull down to see RefreshControl indicator</Text>
      </ScrollView>

    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  loginButton: {
    width: '40%',
    height: 50,
    backgroundColor: '#E2A76F',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: '30%',
    marginTop: '15%',
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 21,
  },

  container: {
    flex: 1,
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  headerText: {
    fontWeight: 'bold',
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    marginRight: 0,
    paddingHorizontal: 5,
    borderTopWidth: 0
  },
  addRowButton: {
    alignItems: 'center',
    backgroundColor: '#71B7E1',
    padding: 10,
  },
  box: {
    borderWidth: 1,
    height: 40,
    width: 150,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'grey',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    color: "#000",
    fontSize: 15
  },
  selectedTextStyle: {
    color: "#000"
  },
  iconStyle: {
    width: "20%",
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    width: "120%",
    color: "#000"
  },

})
