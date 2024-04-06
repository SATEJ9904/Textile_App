import { StyleSheet, TextInput, Text, View, SafeAreaView, Modal, StatusBar, Pressable, TouchableOpacity, ImageBackground, ScrollView, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagePicker from 'react-native-image-crop-picker';




const LiveOrderstrader = ({ navigation }) => {


  const [orders, setOrders] = useState([
    { orderNo: 1, partyName: "Loom Unit  A" },
    { orderNo: 2, partyName: "Loom Unit  B" },
    { orderNo: 3, partyName: "Loom Unit  C" },
    { orderNo: 4, partyName: "Loom Unit  D" },
    { orderNo: 5, partyName: "Loom Unit  E" },
    { orderNo: 6, partyName: "Loom Unit  F" },
  ]);

  const [BIList, setBIList] = useState([
    { orderNo: 1, partyName: "Loom Unit  A" },
    { orderNo: 2, partyName: "Loom Unit  B" },
    { orderNo: 3, partyName: "Loom Unit  C" },
    { orderNo: 4, partyName: "Loom Unit  D" },
    { orderNo: 5, partyName: "Loom Unit  E" },
    { orderNo: 6, partyName: "Loom Unit  F" },
  ]);

  const [modalVisible, setModalVisible] = useState(true);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [contractsigned, setCOtractSigned] = useState(false);
  const [Name, setName] = useState("");
  const [AppUserId, setAppUserId] = useState("");
  const [showBlocks, setShowBlocks] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [Beaminform, setBeamInForm] = useState(false)
  const [weftform, setWeftform] = useState(false)
  const [fdFrom, setFdForm] = useState(false)
  const [remaining_goods_returnform, setremaining_Goods_ReturnForm] = useState(false)
  const [DrawingInForm, setDrawingInForm] = useState(false);
  const [beamGettingForm, setBeamGettingForm] = useState(false);
  const [fpaform, setFPAForm] = useState(false)


  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    const Name = await AsyncStorage.getItem("Name");
    const AppUserId = await AsyncStorage.getItem("AppUserId");


    setName(Name)
    setAppUserId(AppUserId)
    setShowBlocks(false)
  }


  const handleOrderPress = (order) => {
    setSelectedOrder(order);
    setShowBlocks(false)

  };

  const yesbutton2 = () => {
    setModalVisible2(false)
  }

  const yesbutton = () => {
    setShowBlocks(true)
    setModalVisible(false)
  }

  const FalseOthersBeamIn = () => {
    setBeamInForm(true);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
    setDrawingInForm(false)
    setBeamGettingForm(false)
    setFPAForm(false)
  }

  const FalseOthersWeft = () => {
    setBeamInForm(false);
    setWeftform(true);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
    setDrawingInForm(false)
    setBeamGettingForm(false)
    setFPAForm(false)

  }

  const FalseOthersFD = () => {
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(true);
    setremaining_Goods_ReturnForm(false);
    setDrawingInForm(false)
    setBeamGettingForm(false)
    setFPAForm(false)

  }

  const FalseOthersrgr = () => {
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(true);
    setDrawingInForm(false)
    setBeamGettingForm(false)
    setFPAForm(false)

  }

  const FalseOthersDI = () => {
    setDrawingInForm(true)
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
    setBeamGettingForm(false)
    setFPAForm(false)

  }

  const FalseOthersBG = () => {
    setBeamGettingForm(true)
    setDrawingInForm(false)
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
    setFPAForm(false)

  }

  const FalseOthersFPA = () => {
    setFPAForm(true)
    setBeamGettingForm(false)
    setDrawingInForm(false)
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
  }


  const handleButtonPress = (action) => {
    if (selectedOrder) {
      console.log(`Order No: ${selectedOrder.orderNo}, Party Name: ${selectedOrder.partyName}, Action: ${action}`);
    }
  };

  const ToggleScreens = () => {
    setSelectedOrder(false)
    setShowBlocks(true)
    setBeamInForm(false)
    setWeftform(false)
    setFdForm(false)
    setremaining_Goods_ReturnForm(false)

  }

  // Beam Form 


  const [beamIn, setBeamIn] = useState([{ id: 1, date: new Date(), sizingTippanNumber: '' }]);

  const [showDatePickerBI, setShowDatePickerBI] = useState(false);
  const [selectedDateIndexBI, setSelectedDateIndexBI] = useState(0);


  const handleDateChangeBI = (event, date) => {
    if (date) {
      const updatedRows = [...beamIn];
      updatedRows[selectedDateIndexBI].date = date;
      setBeamIn(updatedRows);
    }
    setShowDatePickerBI(false);
  };

  const handleInputChangeBI = (text, index, field) => {
    const updatedRows = [...beamIn];
    updatedRows[index][field] = text;
    setBeamIn(updatedRows);
  };

  const handleAddRowBI = () => {
    const newFormData = [...beamIn, { id: 1, date: new Date(), sizingTippanNumber: '' }];
    setBeamIn(newFormData);
  };

  const handleRemoveRowBI = (index) => {
    const newFormData = [...beamIn];
    newFormData.splice(index, 1);
    setBeamIn(newFormData);
  };

  const HandleSubmitBeamIn = () => {
    setModalVisible2(true)
    console.log('Table Data:', beamIn)
    setBeamInForm(false)
    setBeamIn([{ id: 1, date: new Date(), sizingTippanNumber: '' }])
  }

  const handleCameraPickBI = async (index) => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
      });
      const newFormData = [...formData];
      newFormData[index]['imageUri'] = image.path;
      setTableRows(newFormData);
      console.log(tableRows)
    } catch (error) {
      console.log('Error capturing image:', error);
    }
  };


  //WEFT Yard In Form 


  const [Weft, setWeft] = useState([{ id: 1, date: new Date(), gatePassNumber: '' }]);

  const [showDatePickerWEFT, setShowDatePickerWEFT] = useState(false);
  const [selectedDateIndexWEFT, setSelectedDateIndexWEFT] = useState(0);

  const handleDateChangeWEFT = (event, date) => {
    if (date) {
      const updatedRows = [...Weft];
      updatedRows[selectedDateIndexWEFT].date = date;
      setWeft(updatedRows);
    }
    setShowDatePickerWEFT(false);
  };

  const handleInputChangeWEFT = (text, index, field) => {
    const updatedRows = [...Weft];
    updatedRows[index][field] = text;
    setWeft(updatedRows);
  };

  const handleAddRowWEFT = () => {
    setWeft([...Weft, { date: new Date(), gatePassNumber: '' }]);
  };

  const handleRemoveRowWEFT = (index) => {
    const updatedRows = [...Weft];
    updatedRows.splice(index, 1);
    setWeft(updatedRows);
  };

  const HandleSubmitWEFT = () => {
    setModalVisible2(true)
    console.log('Table Data:', Weft)
    setWeftform(false)
    setWeft([{ id: 1, date: new Date(), gatePassNumber: '' }])
  }


  // Drawing In

  const [DrawingIn, setDrawingIn] = useState(false)

  const SubmitDrawingIn = () => {
    setDrawingInForm(false)
    setDrawingIn(false)
    console.log(DrawingIn)
  }

  // Beam Getting

  const [beamgetting, setBeamGetting] = useState(false)

  const SubmitBeamInGetting = () => {
    setBeamGettingForm(false)
    setBeamGetting(false)
    console.log(beamgetting)
  }

  // First Piece Approval

  const [first_piece_approval, setFirst_Piece_Approval] = useState(" ")

  const SubmitFPA = () => {
    console.log(first_piece_approval)
    setFPAForm(false)
    setFirst_Piece_Approval(" ")
  }


  // Fabric Dispatch

  const [tableRows, setTableRows] = useState([{ date: new Date(), meterWidth: '', weight: '', dispatchNumber: '' }]);
  const [showDatePickerFD, setShowDatePickerFD] = useState(false);
  const [selectedDateIndexFD, setSelectedDateIndexFD] = useState(0);
  const [beamInCss, setBeamInCss] = useState(styles.BeamInCss)

  const handleDateChangeFD = (event, date) => {
    if (date) {
      const updatedRows = [...tableRows];
      updatedRows[selectedDateIndexFD].date = date;
      setTableRows(updatedRows);
    }
    setShowDatePickerFD(false);
  };

  const handleInputChangeFD = (text, index, field) => {
    const updatedRows = [...tableRows];
    updatedRows[index][field] = text;
    setTableRows(updatedRows);
  };

  const handleAddRowFD = () => {
    setTableRows([...tableRows, { date: new Date(), meterWidth: '', weight: '', dispatchNumber: '' }]);
  };

  const handleRemoveRowFD = (index) => {
    const updatedRows = [...tableRows];
    updatedRows.splice(index, 1);
    setTableRows(updatedRows);
  };
  const HandleSubmitFD = () => {
    setModalVisible2(true)
    console.log('Table Data:', tableRows)
    setTableRows([{ date: new Date(), meterWidth: '', weight: '', dispatchNumber: '' }])
    setFdForm(false)
  }

  const handleCameraPickFD = async (index) => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
      });
      const newFormData = [...formData];
      newFormData[index]['imageUri'] = image.path;
      setTableRows(newFormData);
      console.log(tableRows)
    } catch (error) {
      console.log('Error capturing image:', error);
    }
  };


  //REMAINING GOODS RETURN 

  const [remaining_goods_return, setRemaining_Goods_Return] = useState([{ GP_NO: '', Yarn_count: '', weight: '', Cut_piece: '', Meter: '' }]);

  const handleInputChangeRGR = (text, index, field) => {
    const updatedRows = [...remaining_goods_return];
    updatedRows[index][field] = text;
    setRemaining_Goods_Return(updatedRows);
  };

  const handleAddRowRGR = () => {
    setRemaining_Goods_Return([...remaining_goods_return, { GP_NO: '', Yarn_count: '', weight: '', Cut_piece: '', Meter: '' }]);
  };

  const handleRemoveRowRGR = (index) => {
    const updatedRows = [...remaining_goods_return];
    updatedRows.splice(index, 1);
    setRemaining_Goods_Return(updatedRows);
  };

  const HandleSubmitRGR = () => {
    setModalVisible2(true)
    console.log('Table Data:', remaining_goods_return);
    setRemaining_Goods_Return([{ GP_NO: '', Yarn_count: '', weight: '', Cut_piece: '', Meter: '' }]);
    setremaining_Goods_ReturnForm(false)

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
        <Text style={{ fontSize: 25, color: "white", margin: "2.5%", marginLeft: "25%" }}>Live Orders</Text>
      </View>
      <ScrollView style={{ marginTop: "25%" }}>
        {showBlocks ? <View style={styles.ordersContainer}>
          {orders.map((order, index) => (
            <TouchableOpacity
              key={index}
              style={styles.orderContainer}
              onPress={() => handleOrderPress(order)}>
              <Text style={styles.orderText}>{`Order No: ${order.orderNo}     ${order.partyName}`}</Text>
            </TouchableOpacity>
          ))}
        </View> : null}
        {selectedOrder && (
          <View>
            <View style={{ alignItems: "center", justifyContent: "center", marginTop: "10%" }}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Beam in'); FalseOthersBeamIn() }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.buttonText, styles.BeamInCss]}>Beam in</Text>
                  </View>
                </TouchableOpacity>
                <Text style={{ color: "#ff0000", textDecorationLine: "underline", marginLeft: "5%" }}>09-03-2024</Text>
              </View>

              {Beaminform ? <View style={{ width: "100%" }}>
                <ScrollView horizontal={true} vertical={true}>
                  <View style={styles.table}>
                    <View style={styles.header1}>
                      <Text style={styles.headerText1}>Date</Text>
                      <Text style={[styles.headerText1, { marginLeft: 20 }]}>Sizing Tippan Number</Text>

                    </View>





                    {/* BEAM IN FORM  */}












                    {beamIn.map((row, index) => (
                      <ScrollView>
                        <View key={index} style={styles.rowContainer}>

                          <View style={styles.row}>
                            <View>
                              <Text style={styles.dateText}>{row.date.toDateString()}</Text>

                              <TouchableOpacity onPress={() => { setShowDatePickerBI(true); setSelectedDateIndexBI(index); }}>
                                <Image
                                  style={{ width: 30, height: 30, marginLeft: 30 }}
                                  source={require("../Images/calendar.png")}
                                />
                              </TouchableOpacity>
                            </View>
                            {showDatePickerBI && selectedDateIndexBI === index && (
                              <DateTimePicker
                                value={row.date}
                                mode="date"
                                display="default"
                                onChange={handleDateChangeBI}
                              />
                            )}
                            <TextInput
                              style={[styles.input, { width: "45%" }]}
                              value={row.sizingTippanNumber}
                              onChangeText={(text) => handleInputChangeBI(text, index, 'sizingTippanNumber')}
                              keyboardType="numeric"
                              placeholder="sizing Tippan Number"
                            />

                              <View style={styles.rowButtons}>
                                {index !== 0 && (
                                  <TouchableOpacity onPress={() => handleRemoveRowBI(index)}>
                                    <Text style={{ fontSize: 35, marginTop: -20 }}>-</Text>
                                  </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={handleAddRowBI}>
                                  <Text style={styles.button}>+</Text>
                                </TouchableOpacity>
                              </View>
                          </View>

                        </View>
                      </ScrollView>
                    ))}
                  </View>
                </ScrollView>
                <TouchableOpacity style={styles.submitButton} onPress={() => HandleSubmitBeamIn()}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View> : null}
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('WEFT yarn in'); FalseOthersWeft() }}>
                  <Text style={styles.buttonText}>WEFT yarn in</Text>
                </TouchableOpacity>
                <Text style={{ color: "#ff0000", textDecorationLine: "underline", marginLeft: "5%" }}>09-03-2024</Text>
              </View>



              {/* WEFTCYARN IN FORM */}









              {weftform ? <View style={{ justifyContent: "space-evenly", width: "100%" }}>
                <ScrollView horizontal={true}>
                  <View style={styles.table}>
                    <View style={styles.header1}>
                      <Text style={styles.headerText1}>Date</Text>
                      <Text style={[styles.headerText1, { marginLeft: 70 }]}>Gate Pass Number</Text>

                    </View>
                    {Weft.map((row, index) => (
                      <View key={index} style={styles.rowContainer}>
                        <View style={styles.row}>
                          <View>
                            <Text style={styles.dateText}>{row.date.toDateString()}</Text>

                            <TouchableOpacity onPress={() => { setShowDatePickerWEFT(true); setSelectedDateIndexWEFT(index); }}>
                              <Image
                                style={{ width: 30, height: 30, marginLeft: 30 }}
                                source={require("../Images/calendar.png")}
                              />
                            </TouchableOpacity>
                          </View>
                          {showDatePickerWEFT && selectedDateIndexWEFT === index && (
                            <DateTimePicker
                              value={row.date}
                              mode="date"
                              display="default"
                              onChange={handleDateChangeWEFT}
                            />
                          )}
                          <TextInput
                            style={[styles.input, { width: "45%" }]}
                            value={row.gatePassNumber}
                            onChangeText={(text) => handleInputChangeWEFT(text, index, 'gatePassNumber')}
                            keyboardType="numeric"
                            placeholder="gatePassNumber"
                          />
                          <View style={styles.rowButtons}>
                            {index !== 0 && (
                              <TouchableOpacity onPress={() => handleRemoveRowWEFT(index)}>
                                <Text style={styles.button}>-</Text>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={handleAddRowWEFT}>
                              <Text style={styles.button}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                    ))}
                  </View>
                </ScrollView>
                <TouchableOpacity style={styles.submitButton} onPress={() => HandleSubmitWEFT()}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View> : null}










              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Drawing in'), FalseOthersDI() }}>
                  <Text style={styles.buttonText}>Drawing in</Text>
                </TouchableOpacity>
                <Text style={{ color: "#ff0000", textDecorationLine: "underline", marginLeft: "5%" }}>09-03-2024</Text>
              </View>
              {DrawingInForm ? <View style={{ width: "100%" }}>
                <ScrollView horizontal={true} vertical={true}>
                  <View style={[{ marginLeft: 100 }, styles.table]}>
                    <View style={styles.header1}>
                      <Text style={styles.headerText1}>Drawing In</Text>

                    </View>





                    {/*DrawingIn FORM  */}













                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center" }}>
                      <CheckBox
                        disabled={false}
                        value={DrawingIn}
                        onValueChange={(newValue) => setDrawingIn(newValue)}
                      />
                      <Text style={{ color: "#000", marginLeft: 15, fontSize: 20 }}>Yes</Text>
                    </View>
                  </View>
                </ScrollView>
                <TouchableOpacity style={styles.submitButton} onPress={() => SubmitDrawingIn()}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View> : null}


              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Beam Getting'), FalseOthersBG() }}>
                  <Text style={styles.buttonText}>Beam Getting</Text>
                </TouchableOpacity>
                <Text style={{ color: "#ff0000", textDecorationLine: "underline", marginLeft: "5%" }}>09-03-2024</Text>
              </View>

              {beamGettingForm ? <View style={{ width: "100%" }}>
                <ScrollView horizontal={true} vertical={true}>
                  <View style={[{ marginLeft: 100 }, styles.table]}>
                    <View style={styles.header1}>
                      <Text style={styles.headerText1}>Beam Getting</Text>

                    </View>











                    {/* BEAM Getting FORM  */}











                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center" }}>
                      <CheckBox
                        disabled={false}
                        value={beamgetting}
                        onValueChange={(newValue) => setBeamGetting(newValue)}
                      />
                      <Text style={{ color: "#000", marginLeft: 15, fontSize: 20 }}>Yes</Text>
                    </View>
                  </View>
                </ScrollView>
                <TouchableOpacity style={styles.submitButton} onPress={() => SubmitBeamInGetting()}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View> : null}


              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('First Piece Approval'); FalseOthersFPA() }}>
                  <Text style={styles.buttonText}>First Piece Approval</Text>
                </TouchableOpacity>
                <Text style={{ color: "#ff0000", textDecorationLine: "underline", marginLeft: "5%" }}>09-03-2024</Text>
              </View>

              {fpaform ? <View style={{ width: "100%" }}>
                <ScrollView horizontal={true} vertical={true}>
                  <View style={[{ marginLeft: 10, width: 500 }, styles.table]}>
                    <View style={styles.header1}>
                      <Text style={styles.headerText1}>Description</Text>

                    </View>





                    {/*First Piece Approval FORM  */}






                    <View style={{ flexDirection: "row", width: "100%" }}>
                      <TextInput
                        style={{ width: "80%", borderRadius: 15 }}
                        placeholder='Description'
                        placeholderTextColor={"#000"}
                        value={first_piece_approval}
                        onChangeText={(txt) => setFirst_Piece_Approval(txt)}
                      />
                    </View>
                  </View>
                </ScrollView>
                <TouchableOpacity style={styles.submitButton} onPress={() => SubmitFPA()}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View> : null}
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Fabric Dispatch'), FalseOthersFD() }}>
                  <Text style={styles.buttonText}>Fabric Dispatch</Text>
                </TouchableOpacity>
                <Text style={{ color: "#ff0000", textDecorationLine: "underline", marginLeft: "5%" }}>09-03-2024</Text>
              </View>




              {/*                          



                                      FABRIC DISPATCH FORM 






*/}

              {fdFrom ? <View style={{ justifyContent: "space-evenly", width: "100%", }}>
                <ScrollView horizontal={true}>
                  <View style={styles.table}>
                    <View style={styles.header1}>
                      <Text style={styles.headerText1}>Dispatch No.</Text>
                      <Text style={styles.headerText1}>Date</Text>
                      <Text style={[styles.headerText1, { marginLeft: 0 }]}>Meter</Text>
                      <Text style={[styles.headerText1, { marginLeft: 0 }]}>Weight</Text>

                    </View>

                    {tableRows.map((row, index) => (
                      <View key={index} style={styles.rowContainer}>
                        <View style={styles.row}>
                          <TextInput
                            style={styles.input}
                            value={row.dispatchNumber}
                            onChangeText={(text) => handleInputChangeFD(text, index, 'dispatchNumber')}
                            keyboardType="numeric"
                            placeholder="Dispatch Number"
                          />
                          <View style={{ flexDirection: "column" }}>
                            <Text style={styles.dateText}>{row.date.toDateString()}</Text>

                            <TouchableOpacity onPress={() => { setShowDatePickerFD(true); setSelectedDateIndexFD(index); }}>
                              <Image
                                style={{ width: 30, height: 30, marginLeft: 30 }}
                                source={require("../Images/calendar.png")}
                              />
                            </TouchableOpacity>
                          </View>
                          {showDatePickerFD && selectedDateIndexFD === index && (
                            <DateTimePicker
                              value={row.date}
                              mode="date"
                              display="default"
                              onChange={handleDateChangeFD}
                            />
                          )}
                          <TextInput
                            style={styles.input}
                            value={row.meterWidth}
                            onChangeText={(text) => handleInputChangeFD(text, index, 'meterWidth')}
                            keyboardType="numeric"
                            placeholder="Meter"
                          />
                          <TextInput
                            style={styles.input}
                            value={row.weight}
                            onChangeText={(text) => handleInputChangeFD(text, index, 'weight')}
                            keyboardType="numeric"
                            placeholder="Weight"
                          />

                        </View>
                        <View style={[styles.rowButtons, { marginRight: 70 }]}>
                          {index !== 0 && (
                            <TouchableOpacity onPress={() => handleRemoveRowFD(index)}>
                              <Text style={styles.button}>-</Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity onPress={handleAddRowFD}>
                            <Text style={styles.button}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}


                  </View>

                  <Text style={{ marginRight: 250 }}></Text>
                </ScrollView>
                <TouchableOpacity style={styles.submitButton} onPress={() => HandleSubmitFD()}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>

              </View> : null}

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Remaining Goods Return'), FalseOthersrgr() }}>
                  <Text style={styles.buttonText}>Remaining Goods Return</Text>
                </TouchableOpacity>
                <Text style={{ color: "#ff0000", textDecorationLine: "underline", marginLeft: "5%" }}>09-03-2024</Text>
              </View>




              {/*                          



                                      FABRIC DISPATCH FORM 
                                    
                                    
                                    
                                    
                
                                      
*/}

              {remaining_goods_returnform ? <View style={{ justifyContent: "space-evenly", width: "110%", }}>
                <ScrollView horizontal={true}>
                  <View style={[styles.table, { marginRight: 120, marginLeft: 10 }]}>
                    <View style={styles.header1}>
                      <Text style={styles.headerText1}>GP. NO.</Text>
                      <Text style={styles.headerText1}>Yarn Count</Text>
                      <Text style={[styles.headerText1, { marginLeft: 0 }]}>Weight</Text>
                      <Text style={[styles.headerText1, { marginLeft: 0 }]}>Cut Piece</Text>
                      <Text style={[styles.headerText1, { marginLeft: 0 }]}>Weight</Text>

                      <TouchableOpacity onPress={() => { setremaining_Goods_ReturnForm(false); setRemaining_Goods_Return([{ GP_NO: '', Yarn_count: '', weight: '', Cut_piece: '', Meter: '' }]) }}>
                        <Image
                          style={{ width: 30, height: 30 }}
                          source={require("../Images/cross.png")}
                        />
                      </TouchableOpacity>
                    </View>

                    {remaining_goods_return.map((row, index) => (
                      <View key={index} style={styles.rowContainer}>
                        <SafeAreaView style={styles.row}>
                          <TextInput
                            style={[styles.input, { width: "18%" }]}
                            value={row.GP_NO}
                            onChangeText={(text) => handleInputChangeRGR(text, index, 'GP_NO')}
                            keyboardType="numeric"
                            placeholder="GP_NO"
                          />
                          <TextInput
                            style={[styles.input, { width: "18%" }]}
                            value={row.Yarn_count}
                            onChangeText={(text) => handleInputChangeRGR(text, index, 'Yarn_count')}
                            keyboardType="numeric"
                            placeholder="Yarn_count"
                          />
                          <TextInput
                            style={[styles.input, { width: "18%" }]}
                            value={row.weight}
                            onChangeText={(text) => handleInputChangeRGR(text, index, 'weight')}
                            keyboardType="numeric"
                            placeholder="Weight"
                          />
                          <TextInput
                            style={[styles.input, { width: "18%" }]}
                            value={row.Cut_piece}
                            onChangeText={(text) => handleInputChangeRGR(text, index, 'Cut_piece')}
                            keyboardType="numeric"
                            placeholder="Cut_piece"
                          />
                          <TextInput
                            style={[styles.input, { width: "18%" }]}
                            value={row.Meter}
                            onChangeText={(text) => handleInputChangeRGR(text, index, 'Meter')}
                            keyboardType="numeric"
                            placeholder="Meter"
                          />
                          <View style={styles.rowButtons}>
                            {index !== 0 && (
                              <TouchableOpacity onPress={() => handleRemoveRowRGR(index)}>
                                <Text style={styles.button}>-</Text>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={handleAddRowRGR}>
                              <Text style={styles.button}>+</Text>
                            </TouchableOpacity>
                          </View>


                        </SafeAreaView>


                      </View>

                    ))}


                  </View>

                  {/* <Text style={{ marginRight: 250 }}></Text> */}
                </ScrollView>
                <TouchableOpacity style={styles.submitButton} onPress={() => HandleSubmitRGR()}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>

              </View> : null}

              <TouchableOpacity style={[styles.button1, { backgroundColor: "red", alignItems: "center", marginTop: 20 }]} onPress={() => ToggleScreens()}>
                <Text style={[styles.buttonText, { color: "#fff" }]}>Back</Text>
              </TouchableOpacity>
              <View style={{ justifyContent: "flex-end", marginTop: "35%" }}>
                <TouchableOpacity style={styles.submitButton} onPress={() => console.log('Table Data:', Weft)}>
                  <Text style={styles.submitButtonText}>Order Completed</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible2}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible2(!modalVisible);
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
                      onPress={() => yesbutton2(!modalVisible)}>
                      <Text style={styles.textStyle1}>close</Text>
                    </Pressable>

                  </View>
                </View>
              </View>
            </Modal>
          </View>

        )}

        <Text style={{ marginTop: "18%" }}></Text>
      </ScrollView>
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
              <Text style={styles.modalText}>Congralutations !!! {" "} {Name}</Text>
              <Text style={styles.modalText}>Your order number XX01 of 5 Looms is placed with LOHAR TEXTILES With the job rate of 9 paise from Date___ to ___ please proceed for contract formation contact details of LOHAR TEXTILES :- (NAME,CONTACT NO., MAIL ID,ADDRESS) Dalal/Agent Name & Contact No. </Text>
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
    </SafeAreaView >
  )
}

export default LiveOrderstrader

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    padding: "5%"
  },
  ordersContainer: {
    flexDirection: 'column',
    alignItems: "center"
  },
  header1: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#e5f2fe',
    borderWidth: 1,
    justifyContent: "space-evenly"
  },
  headerText1: {
    fontWeight: 'bold',
    marginLeft: 10,
    color: "#000"
  },
  orderContainer: {
    width: '88%',
    backgroundColor: '#71B7E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 25
  },
  orderText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: "#fff"
  },
  orderText1: {
    fontSize: 16,
    borderWidth: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: "#000"
  },
  buttonsContainer: {
    marginTop: 10,
  },
  button1: {

    alignItems: "center",
    backgroundColor: '#71B7E1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: "70%",


  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#6495ED',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 20
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    borderBottomColor: '#000',
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
    marginRight: 80
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  rowButtons: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  datePicker: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '25%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    margin: 5
  },
  button: {
    fontSize: 24,
    paddingHorizontal: 10,
  },
  dateText: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingBottom: 5,
    marginRight: 30,
    color: "#000"
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
  BeamInCss: {

  }


})