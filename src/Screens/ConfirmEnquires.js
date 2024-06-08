
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, ImageBackground, ScrollView, FlatList, Pressable, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";


const { width, height } = Dimensions.get('window');


const ConfirmEnquires = ({ navigation }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enquiryDetails, setEnquiryDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showE, setShowE] = useState(true);
  const [showEC, setShowEC] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [confirmed, setConfirmed] = useState(new Set());
  const [AppUserId, setAppUserId] = useState("")
  const [Name, setName] = useState('')
  const [show, setShow] = useState(true);
  const [Id, setId] = useState("");
  const [LoomOrTrader, setLoomOrTrader] = useState("");
  const [mobileno, setMobileNo] = useState("");
  const [gstno, setGSTNO] = useState("")

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


  const getData = async () => {
    const Email = await AsyncStorage.getItem("AppUserId");
    const Name = await AsyncStorage.getItem("Name");
    const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")
    const Id = await AsyncStorage.getItem("Id")
    const PrimaryContact = await AsyncStorage.getItem("PrimaryContact")
    const GSTNumber = await AsyncStorage.getItem("GSTNumber")


    console.log("ID = ", Id)

    setAppUserId(Email)
    setName(Name)
    setLoomOrTrader(LoomOrTrader)
    setId(Id)
    setMobileNo(PrimaryContact)
    setGSTNO(GSTNumber)
  }


  useEffect(() => {
    getData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=Enquiry&Colname=TraderId&Colvalue=' + await AsyncStorage.getItem("Id"));
        const sortedData = response.data.sort((a, b) => b.EnquiryId - a.EnquiryId); // Sort in descending order
        setEnquiries(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };


    fetchData();
  }, []);

  const fetchEnquiryDetails = async (EnquiryId) => {
    try {
      const response = await axios.get('https://textileapp.microtechsolutions.co.in/php/getjoin2.php?EnquiryId='+EnquiryId);
      setEnquiryDetails(response.data);
    } catch (error) {
      console.error('Error fetching enquiry details: ', error);
    }
  };

  const confirmEnquiry = () => {
    setShowModal(false);
    setShowConfirmModal(true);
  };

  const postLoomOrder = async () => {

    const qs = require('qs');
    let data = qs.stringify({
      'EnquiryConfirmId': selectedData?.Id,
      'PartyName': Name,
      'JobRate': selectedData?.JobRateExp,
      'Quality': selectedData?.Quality,
      'Orderdate': new Date().toISOString().split('T')[0],
      'BookedDateFrom': selectedData?.DatePossibleFrom.date.substring(0, 10),
      'BookedDateTo': selectedData?.DatePossibleTo.date.substring(0, 10) 
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://textileapp.microtechsolutions.co.in/php/postloomorder.php',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      SendEmail(response.data)
    })
    .catch((error) => {
      console.log(error);
    });
  };

  const UpdateEnquiryConfirm = () => {

    console.log("Got ID = ", selectedData?.Id)

    const formdata = new FormData();
    formdata.append("Status", true);
    formdata.append("Id", selectedData?.Id);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/updateenquiryconfirm.php", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

      postLoomOrder();

  }

  const yesbutton2 = () => {
    UpdateEnquiryConfirm();
    setShowConfirmModal(false);
    navigation.navigate("PlanLooms");
  }

  const selectEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);
    fetchEnquiryDetails(enquiry.EnquiryId);
    setShowE(false);
    setShowEC(true);
  };

  const renderEnquiries = () => (
    enquiries.map((item, index) => (
      <TouchableOpacity key={index} onPress={() => selectEnquiry(item)}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>Enquiry NO: {item.EnquiryNo}</Text>
        </View>
      </TouchableOpacity>
    ))
  );

const[Email,setEmail]=useState("")

  const handleLoomDetails = (item) => {
    setEmail(item.AppUserId)
    setConfirmed((prev) => {
      const newConfirmed = new Set(prev);
      if (newConfirmed.has(item.LoomTraderId)) {
        newConfirmed.delete(item.LoomTraderId);
      } else {
        newConfirmed.add(item.LoomTraderId);
      }
      return newConfirmed;
    });

    const selectedItem = enquiryDetails.find((i) => i.LoomTraderId === item.LoomTraderId);
    setSelectedData(selectedItem);
    setShowModal(true);
  }


  const SendEmail=(OrderNo)=>{
    console.log("OrderNo = ",OrderNo)
    const formdata = new FormData();
formdata.append("AppUserId", Email );
formdata.append("Body", 'Your Offer is Accepted by the '+Name+' Traders, navigate to Live Orders in Your app To Start Order And Book Your Loom For This Order; To Start Order Your Order No is '+OrderNo+' Thank You'+ "From : KapadaBanao Team");

const requestOptions = {
  method: "POST",
  body: formdata,
  redirect: "follow"
};

fetch("https://textileapp.microtechsolutions.co.in/php/sendemail.php", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }


  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {showE ? (
            <ScrollView style={styles.flatList}>
              <View style={{ flexDirection: "row", backgroundColor: "#003C43", width: "100%", marginBottom: "5%" }}>
                <TouchableOpacity onPress={() => navigation.navigate('PlanLooms')}>
                  <ImageBackground
                    source={require("../Images/back.png")}
                    style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003C43", marginTop: 8, marginRight: 0, marginLeft: 10 }}
                    imageStyle={{ borderRadius: 0 }}
                  />
                </TouchableOpacity>
                <Text style={styles.detailsTitle}>Enquiry List </Text>

              </View>
              {renderEnquiries()}
            </ScrollView>
          ) : null}
          {showEC ? (
            <View>
              <View>
                {
                  showE ?
                    <View style={{ flexDirection: "row", backgroundColor: "#003C43" }}>
                      <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <ImageBackground
                          source={require("../Images/drawer.png")}
                          style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003C43", marginTop: 15, marginRight: 0, marginLeft: 10 }}
                          imageStyle={{ borderRadius: 0 }}
                        />
                      </TouchableOpacity>
                      <Text style={styles.detailsTitle}>Enquiry Details:</Text>

                    </View> :
                    <View style={{ flexDirection: "row", backgroundColor: "#003C43", width: "120%", marginLeft: "-8%", marginTop: "-5%" }}>
                      <TouchableOpacity onPress={() => { setShowE(true); setShowEC(false); }}>
                        <ImageBackground
                          source={require("../Images/back.png")}
                          style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003C43", marginTop: 15, marginRight: 0, marginLeft: 20 }}
                          imageStyle={{ borderRadius: 0 }}
                        />
                      </TouchableOpacity>
                      <Text style={styles.detailsTitle}>Enquiry Details</Text>

                    </View>
                }
              </View>
              <ScrollView>
                <View style={styles.detailsHeaderContainer}>
                  <ScrollView horizontal>
                    <Text style={styles.detailsHeaderText}>Loom</Text>
                    <Text style={styles.detailsHeaderText}>Date Possible</Text>
                    <Text style={styles.detailsHeaderText}>Job Rate Exp</Text>
                    <Text style={[styles.detailsHeaderText]}>Enquiry Id</Text>
                    <Text style={[styles.detailsHeaderText, { marginRight: 30 }]}>Action</Text>

                  </ScrollView>
                </View>
                <View>
                  {
                    enquiryDetails.map((item, index) => (
                      <ScrollView key={index} horizontal={true}>
                        <View style={[styles.detailsItemContainer, index % 2 === 0 ? styles.rowColor1 : styles.rowColor2]}>
                          <Text style={[styles.detailsItemText, styles.column1]}>{item.Name}</Text>
                          <View style={{ flexDirection: "column" }}>
                            <Text style={[styles.detailsItemText, styles.column2]}>{item.DatePossibleFrom.date.substring(0, 10)}</Text>
                            <Text style={[styles.detailsItemText, styles.column2]}>{item.DatePossibleTo.date.substring(0, 10)}</Text>
                          </View>
                          <Text style={[styles.detailsItemText, styles.column3]}>{item.JobRateExp}</Text>
                          <Text style={[styles.detailsItemText, styles.column4]}>{item.EnquiryId}</Text>
                          <TouchableOpacity
                            style={[
                              styles.confirmButton,
                              confirmed.has(item.LoomTraderId) ? styles.confirmedButton : null,
                            ]}
                            onPress={() => handleLoomDetails(item)}
                          >
                            <Text style={styles.buttonText}>View</Text>
                          </TouchableOpacity>
                        </View>
                      </ScrollView>
                    ))
                  }
                </View>
              </ScrollView>
            </View>
          ) : null}
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
                      'No Internet'
                    }
                  })}
                </Text>

              </View>
            </View> : null
          }
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
              setShowModal(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{ justifyContent: "space-between", flexDirection: "row", width: "100%" }}>
                  <Text style={styles.modalTitle}>Details</Text>
                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require("../Images/cross.png")}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalText}>Enquiry ID: {selectedData?.EnquiryId}</Text>
                <Text style={styles.modalText}>Loom Possible To Assign: {selectedData?.LoomPossible}</Text>
                <Text style={styles.modalText}>Loom Name: {selectedData?.Name}</Text>
                <Text style={styles.modalText}>Jobrate (In Paise): {selectedData?.JobRateExp}</Text>
                <Text style={styles.modalText}>From Date: {selectedData?.DatePossibleFrom.date.substring(0, 10)}</Text>
                <Text style={styles.modalText}>To Date: {selectedData?.DatePossibleTo.date.substring(0, 10)}</Text>
                <Text style={styles.modalText}>Email: {selectedData?.AppUserId}</Text>
                <Text style={styles.modalText}>Contact Number: {selectedData?.PrimaryContact}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => confirmEnquiry()}
                >
                  <Text style={styles.buttonText}>Confirm Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showConfirmModal}
            onRequestClose={() => {
              setShowConfirmModal(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Congratulations !!! {Name}</Text>
                <Text style={styles.modalText}>
                  Your order number {selectedData?.EnquiryId} of {selectedData?.LoomPossible} Looms is confirmed with {selectedData?.AppUserId} .
                  with the job rate of {selectedData?.JobRateExp} paise from {selectedData?.DatePossibleFrom.date.substring(0, 10)} to {selectedData?.DatePossibleTo.date.substring(0, 10)}.
                  Please proceed for contract formation. Contact details of ({selectedData?.AppUserId}, {selectedData?.PrimaryContact}, {selectedData?.AppUserId})
                  Dalal/Agent Name & Contact No.
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose1]}
                  onPress={() => yesbutton2()}
                >
                  <Text style={[styles.textStyle1, { margin: -10 }]}>OKAY</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  flatList: {
    width: width * 0.9,
    marginBottom: height * 0.02,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: width * 0.04,
    marginVertical: height * 0.01,
    marginHorizontal: width * 0.02,
    borderRadius: width * 0.02,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: height * 0.005,
    },
    shadowOpacity: 0.23,
    shadowRadius: height * 0.005,
    elevation: 4,
  },
  itemText: {
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
    color: '#2c3e50',
  },
  detailsHeaderContainer: {
    width: width * 1,
    flexDirection: 'row',
    backgroundColor: '#003C43',
    marginBottom: height * 0.01,
    alignItems: 'center',
    height: height * 0.06,
    marginTop: "5%"
  },
  detailsHeaderText: {
    flex: 1,
    fontSize: width * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    paddingHorizontal: width * 0.02,
    width: width * 0.2
  },
  detailsItemContainer: {
    width: width * 1,
    flexDirection: 'row',
    backgroundColor: '#0909ff',
    padding: width * 0.02,
    marginBottom: height * 0.01,
    borderRadius: width * 0.02,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  detailsItemText: {
    flex: 1,
    fontSize: width * 0.04,
    textAlign: 'center',
    color: '#333333',
    paddingHorizontal: width * 0.02,
  },
  column1: {
    flex: 1,
  },
  column2: {
    flex: 1.5,
    flexDirection: "column"
  },
  column3: {
    flex: 1,
  },
  column4: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    paddingTop: height * -0.01,
    marginTop: height * 0.012,
    marginBottom: height * 0.01,
    color: '#fff',
    marginLeft: "20%",
    height: height * 0.035
  },
  rowColor1: {
    backgroundColor: '#f9f9f9',
  },
  rowColor2: {
    backgroundColor: '#ffffff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#ffffff',
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

  container: {
    padding: 16,
    backgroundColor: '#F5FCFF',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 60,
  },
  dateColumn: {
    flexDirection: "column",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 8,
    color: "#000",
    fontFamily: 'Courier',
  },
  confirmButton: {
    backgroundColor: '#0909ff',
    padding: 8,
    borderRadius: 4,
    marginLeft: 16,
  },
  confirmedButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Courier',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    marginBottom: 15,
    fontWeight: '600',
    color: "#000",
    fontSize: 20,
    fontFamily: 'Courier',
  },
  modalText: {
    marginBottom: 10,
    color: "#000",
    fontSize: 17,
    fontFamily: 'Courier',
    margin: 15
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonClose1: {
    backgroundColor: "green",
    margin: 20,
    width: 200,
    height: 30,
    alignItems: 'center',
  },
  textStyle1: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Courier',
  },
});

export default ConfirmEnquires;
