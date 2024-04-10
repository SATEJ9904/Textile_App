import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ImageBackground, StyleSheet, FlatList, ScrollView, Modal, Pressable, Image } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";



const ConfirmEnquires = ({ navigation }) => {


  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [Name, setName] = useState("");
  const [selectedData, setSelectedData] = React.useState(null);
  const [confirmed, setConfirmed] = React.useState(new Set());
  const [cancelModalVisible, setCancelModalVisible] = React.useState(false);



  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    const Name = await AsyncStorage.getItem("Name");


    setName(Name)
    setShowBlocks(false)
  }

  const yesbutton = () => {
    setModalVisible(false)
    setCancelModalVisible(true)
    handleConfirm();
  }

  const yesbutton2 = () => {
    UpdateEnquiryConfirm();
    setCancelModalVisible(false)
    navigation.navigate("PlanLooms")
  }


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getjoin2.php');
      const json = await response.json();
      setData(json);
      {
        data ?
          data.map((item) => {
            console.log("LoomId", item.LoomTraderId)
          }) : null
      }
      console.log(json)
    };

    fetchData();
  }, []);

const handleLoomDetails=(LoomTraderId)=>{
  setConfirmed((prev) => {
    const newConfirmed = new Set(prev);
    if (newConfirmed.has(LoomTraderId)) {
      newConfirmed.delete(LoomTraderId);
    } else {
      newConfirmed.add(LoomTraderId);
    }
    return newConfirmed;
  });
     
  const selectedItem = data.find((item) => item.LoomTraderId === LoomTraderId);
  setSelectedData(selectedItem);
  setModalVisible(true);
}


  const handleConfirm = (LoomTraderId) => {

  };

  const UpdateEnquiryConfirm = () => {
    const formdata = new FormData();
    formdata.append("Status", true);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/updateenquiryconfirm.php?Id=" + selectedData?.Id, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }


  if (!data) {
    return <View>
      <View style={{ backgroundColor: "#71B7E1", flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <ImageBackground
            source={require("../Images/drawer.png")}
            style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#71B7E1", marginTop: 15, marginRight: 0, marginLeft: 10 }}
            imageStyle={{ borderRadius: 0 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: "white", margin: "2.5%", marginLeft: "20%" }}>Confirm Enquires</Text>
      </View>
      <Text>Loading....</Text>
    </View>
      ;
  }


  return (
    <SafeAreaView>
      <StatusBar backgroundColor={"#0b659a"}></StatusBar>
      <View style={{ backgroundColor: "#71B7E1", flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.navigate("PlanLooms")}>
          <ImageBackground
            source={require("../Images/back.png")}
            style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#71B7E1", marginTop: 15, marginRight: 0, marginLeft: 10 }}
            imageStyle={{ borderRadius: 0 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: "white", margin: "2.5%", marginLeft: "20%" }}>Confirm Enquires</Text>
      </View>
      <ScrollView horizontal>
        <View style={styles.container}>
          <View style={styles.row}>
            <Text style={[styles.cell, { fontWeight: "600" }]}>EnquiryId</Text>
            <Text style={[styles.cell, { fontWeight: "600" }]}>From Date</Text>
            <Text style={[styles.cell, { fontWeight: "600" }]}>     To Date </Text>
            <Text style={[styles.cell, { fontWeight: "600" }]}>Loom Assign</Text>
            <Text style={[styles.cell, { fontWeight: "600" }]}>Job Rate </Text>
            <Text style={[styles.cell, { fontWeight: "600" }]}>             Status </Text>
          </View>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View>
                <View style={[styles.row, { marginTop: 20 }]}>
                  <Text style={styles.cell}>{item.EnquiryId}</Text>
                  <Text style={[styles.cell, { marginLeft: -10 }]}>{item.DatePossibleFrom.date.substring(0, 10)}</Text>
                  <Text style={[styles.cell, { marginLeft: -30 }]}>{item.DatePossibleTo.date.substring(0, 10)}</Text>
                  <Text style={[styles.cell, { marginLeft: -20 }]}>{item.LoomPossible}</Text>
                  <Text style={[styles.cell, { marginLeft: -20 }]}>    {item.JobRateExp}</Text>

                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      confirmed.has(item.LoomTraderId) ? styles.confirmButton : null,
                    ]}
                    onPress={() => handleLoomDetails(item.LoomTraderId)}
                  >
                    <Text style={styles.text}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.LoomTraderId.toString()}
          />
        </View>
      </ScrollView>

      <View>
        <View>
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
                <View style={{flexDirection:"row"}}>
                <Text style={styles.modalText}>LoomDetails</Text>
                <TouchableOpacity onPress={()=>setModalVisible(false)} style={{justifyContent:"flex-start",alignItems:"flex-end",marginRight:"-30%"}}>
                <Image
                style={{width:22,height:22,marginLeft:100,marginTop:-30}}
                source={require("../Images/cross.png")}
                />
                </TouchableOpacity>
                </View>
                <Text style={styles.modalText}>Enquiry ID  : {selectedData?.EnquiryId} , Looms Possible :  {selectedData?.LoomPossible} , Loom Name: {selectedData?.Name} , job rate : {selectedData?.JobRateExp} paise  , From Date:   {selectedData?.DatePossibleFrom.date.substring(0, 10)} , To Date : {selectedData?.DatePossibleTo.date.substring(0, 10)}
                <Text> , </Text>
                 Loom Email : {selectedData?.AppUserId}, Loom Address : {selectedData?.Address} , Loom Contact No. {selectedData?.PrimaryContact} </Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                </View>
              </View>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Pressable
                  style={[styles.button1, styles.buttonClose1]}
                  onPress={() => yesbutton(!modalVisible)}>
                  <Text style={styles.textStyle1}>OKAY</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View >
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={cancelModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!cancelModalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}> !!! {" "} {Name}</Text>
                <Text style={styles.modalText}>Your order number  {selectedData?.EnquiryId} of {selectedData?.LoomPossible} Looms is Confirmed with {selectedData?.LoomTraderId}  With the job rate of {selectedData?.JobRateExp} paise from  {selectedData?.DatePossibleFrom.date.substring(0, 10)} to  {selectedData?.DatePossibleTo.date.substring(0, 10)}  please proceed for contract formation contact details of {selectedData?.Name} :- (NAME,CONTACT NO., MAIL ID,ADDRESS) Dalal/Agent Name & Contact No. </Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                </View>
              </View>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Pressable
                  style={[styles.button1, styles.buttonClose1]}
                  onPress={() => yesbutton2(!cancelModalVisible)}>
                  <Text style={styles.textStyle1}>OKAY</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View >
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5FCFF',
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  cell: {
    flex: 1,
    paddingHorizontal: 8,
    color: "#000"
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
  text: {
    color: '#fff',
    fontSize: 16,
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
  buttonClose1: {
    backgroundColor: "green",
    margin: "5%",
    width: 200,
  },
  textStyle1: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: "green"
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: "#000",
    fontSize: 17
  },
})

export default ConfirmEnquires;