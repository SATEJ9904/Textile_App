import { StyleSheet, TextInput, Text, View, SafeAreaView, Modal, StatusBar, Pressable, TouchableOpacity, ImageBackground, ScrollView, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageView from "react-native-image-viewing";




const LiveOrderstrader = ({ navigation }) => {

  const [orders, setOrders] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=LoomOrder');
        const json = await response.json();
        setOrders(json);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    handleButtonPress();
  }, []);




  const [orderBeam, setOrderBeam] = useState([]);
  const [dateBeamIn, setDateBeam] = useState(null);

  useEffect(() => {


    callfuns();

  }, []);

  const callfuns = () => {
    fetch("")
      .then(fetchData())
      .then(fetchDataWEFT())
      .then(fetchDataDI())
      .then(fetchDataBG())
      .then(fetchDataFD())
      .then(fetchDataRGR())

  }
  useEffect(() => {
    fetch("")
      .then(fetchData())
      .then(fetchDataWEFT())
      .then(fetchDataDI())
      .then(fetchDataBG())
      .then(fetchDataFD())
      .then(fetchDataRGR())


  }, []);


  const fetchData = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=OrderBeam&Colname=OrderNoId&Colvalue=' + selectedOrderID);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOrderBeam(data);
      data.map((item) => {
        setDateBeam(item.UpdatedOn.date.substring(0, 10))
      })

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [orderYarn, setOrderYarn] = useState([]);
  const [dateWEFT, setDatWEFT] = useState(null);
  const [show, setShow] = useState(false)

  const fetchDataWEFT = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=OrderWeftYarn&Colname=OrderNoId&Colvalue=' + selectedOrderID);
      const json = await response.json();
      json.map((item, index) => {
        key = { index }
        setDatWEFT(item.UpdatedOn.date.substring(0, 10))
      })
      setOrderYarn(json);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };





  const [req, setreq] = useState([])
  const [dateDI, setdateDI] = useState(null)



  const fetchDataDI = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=OrderDrawingIn&Colname=OrderNoId&Colvalue=' + selectedOrderID);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length === 0) {
        setreq(0);
      }
      else {
        data.map((item) => {
          setdateDI(item.UpdatedOn.date.substring(0, 10))
          setreq(item.Status)
        })
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const [reqBG, setreqBG] = useState([])
  const [dateBG, setdateBG] = useState(null)


  const fetchDataBG = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=OrderBeamGetting&Colname=OrderNoId&Colvalue=' + selectedOrderID);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length === 0) {
        setreqBG(0);
      }
      else {
        data.map((item) => {
          setdateBG(item.UpdatedOn.date.substring(0, 10))
          setreqBG(item.Status)
        })
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const [orderfd, setOrderFD] = useState([]);
  const [imageSourceFD, setImageSourceFD] = useState(null);
  const [dateFD, setDateFD] = useState(null);


  const fetchDataFD = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=OrderFabric&Colname=OrderNoId&Colvalue=' + selectedOrderID);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOrderFD(data);
      data.map((item) => {
        setDateFD(item.UpdatedOn.date.substring(0, 10))

        setImageSourceFD(item.Photopath);
      })

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const [RGR, setOrderRGR] = useState([]);
  const [dateRGR, setDateRGR] = useState(null);


  const fetchDataRGR = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=OrderGoodRemain&Colname=OrderNoId&Colvalue=' + selectedOrderID);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOrderRGR(data);
      data.map((item) => {
        setDateRGR(item.UpdatedOn.date.substring(0, 10))

      })

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  // First Piece Approval

  const [first_piece_approval, setFirst_Piece_Approval] = useState(" ")

  const SubmitFPA = () => {
    console.log(first_piece_approval)
    setFPAForm(false)
    setFirst_Piece_Approval(" ")
  }

  const [enlargedImage, setEnlargedImage] = React.useState(null);


  const handleImagePress = (image) => {
    setEnlargedImage(image);
    console.log("Selected Image = ", enlargedImage)
    setShow(true);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [contractsigned, setCOtractSigned] = useState(false);
  const [Name, setName] = useState("");
  const [AppUserId, setAppUserId] = useState("");
  const [showBlocks, setShowBlocks] = useState(true)
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
    setShowBlocks(true)
  }

  const [selectedOrderID, setSelectedOrderID] = useState('')
  const handleOrderPress = (order) => {
    setSelectedOrder(order);
    setShowBlocks(false)
    setSelectedOrderID(order.LoomOrderId)
    callfuns();
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
      console.log(`Order No: ${selectedOrder.OrderNo}, Party Name: ${selectedOrder.PartyName}, Action: ${action}`);
    }
    callfuns()
  };

  const ToggleScreens = () => {
    setSelectedOrder(false)
    setShowBlocks(true)
    setBeamInForm(false)
    setWeftform(false)
    setFdForm(false)
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
              <Text style={styles.orderText}>{`Order No: ${order.OrderNo}  ${order.LoomOrderId}    ${order.PartyName}`}</Text>
            </TouchableOpacity>
          ))}
        </View> : null}
        {selectedOrder && (
          <View>
            <View style={{ alignItems: "center", justifyContent: "center", marginTop: "10%" }}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Beam in'); FalseOthersBeamIn(); fetchData(); }}>
                    <Text style={[styles.buttonText, styles.BeamInCss]}>Beam in</Text>
                    <Text style={{ color: "#fff", textDecorationLine: "underline", marginLeft: "10%" }}>{dateBeamIn}</Text>

                </TouchableOpacity>

              </View>

              {Beaminform ? <View style={{ width: "100%" }}>
                <ScrollView horizontal={true} vertical={true}>
                  <View style={styles.table}>
                    <View style={styles.header1}>
                      <Text style={styles.headerText1}>Date</Text>
                      <Text style={[styles.headerText1, { marginLeft: 20 }]}>Sizing Tippan Number</Text>
                      <Text style={styles.headerText1}>Image </Text>

                    </View>





                    {/* BEAM IN FORM  */}






                    <View>

                      {
                        show ?

                          <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => setShow(false)}>
                              <Image
                                source={require('../Images/cross.png')}
                                style={{ width: 27, height: 27, alignSelf: 'flex-start', backgroundColor: "#DADBDD", borderRadius: 50, marginLeft: 370, marginTop: 10, zIndex: 0 }}
                                imageStyle={{ borderRadius: 0 }}
                              />
                            </TouchableOpacity>
                            <Image
                              source={{ uri: enlargedImage }}
                              style={{
                                marginTop: 20,
                                width: 400,
                                height: 300,
                              }}
                            />
                          </View>
                          : null
                      }


                      {orderBeam.map((item, index) => (
                        <View>

                          <View key={index} style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                            <Text style={{ color: "#000", marginHorizontal: 50, margin: 10, marginLeft: 10 }}>{item.Date.date.substring(0, 10)}</Text>
                            <Text style={{ color: "#000", marginHorizontal: 50, margin: 10 }}>{item.SizingTippanNo}</Text>


                            <TouchableOpacity onPress={() => handleImagePress(item.PhotoPath)}>
                              <Image
                                source={{ uri: item.PhotoPath }} // or require('path/to/img.jpeg')
                                style={{ width: 40, height: 40, marginRight: 60, backgroundColor: '#A8A9AD', marginLeft: 30, margin: 10 }}
                              />
                            </TouchableOpacity>

                          </View>
                          <View>

                          </View>
                        </View>
                      ))}
                    </View>

                  </View>
                </ScrollView>
              </View> : null}

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('WEFT yarn in'); FalseOthersWeft(); fetchDataWEFT(); }}>
                  <Text style={styles.buttonText}>WEFT YARN IN</Text>
                  <Text style={{ color: "#fff", textDecorationLine: "underline", marginLeft: "5%" }}>{dateWEFT}</Text>

                </TouchableOpacity>
              </View>



              {/* WEFTCYARN IN FORM  */}









              {weftform ? <View style={{ justifyContent: "space-evenly", width: "100%" }}>
                <ScrollView horizontal={true}>
                  <View style={styles.table}>
                    <View style={styles.header1}>
                      <Text style={styles.headerText1}>Date</Text>
                      <Text style={[styles.headerText1, { marginLeft: 20 }]}>Gate Pass Number</Text>
                      <Text style={styles.headerText1}>Image </Text>


                    </View>
                    <View>
                      {
                        show ?

                          <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => setShow(false)}>
                              <Image
                                source={require('../Images/cross.png')}
                                style={{ width: 27, height: 27, alignSelf: 'flex-start', backgroundColor: "#DADBDD", borderRadius: 50, marginLeft: 370, marginTop: 10, zIndex: 0 }}
                                imageStyle={{ borderRadius: 0 }}
                              />
                            </TouchableOpacity>
                            <Image
                              source={{ uri: enlargedImage }}
                              style={{
                                marginTop: 20,
                                width: 400,
                                height: 300,
                              }}
                            />
                          </View>
                          : null
                      }
                      {orderYarn.map((item, index) => (
                        <View>
                          <View key={index} style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                            <Text style={{ color: "#000", marginHorizontal: 50, margin: 10, marginLeft: 5 }}>{item.Date.date.substring(0, 10)}</Text>
                            <Text style={{ color: "#000", marginHorizontal: 50, margin: 10, marginLeft: -1 }}>{item.GatePassNo}</Text>
                            <TouchableOpacity onPress={() => handleImagePress(item.PhotoPath)} >
                              <Image
                                source={{ uri: item.PhotoPath }}
                                style={{ width: 40, height: 40, marginRight: 60, backgroundColor: "grey", margin: 10 }}
                              />

                            </TouchableOpacity>
                          </View>

                        </View>


                      ))}
                    </View>
                  </View>
                </ScrollView>

              </View> : null}










              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Drawing in'), FalseOthersDI(); fetchDataDI(); }}>
                  <Text style={styles.buttonText}>Drawing in</Text>
                  <Text style={{ color: "#fff", textDecorationLine: "underline", marginLeft: "5%" }}>{dateDI}</Text>
                  {
                    req === 1 ? <Text style={{ color: '#fff' }}>Done</Text > : null
                  }
                </TouchableOpacity>
              </View>
              {DrawingInForm ? <View style={{ width: "100%" }}>
                <ScrollView horizontal={true} vertical={true}>
                  <View style={[{ marginLeft: 100 }, styles.table]}>
                    <View style={styles.header1}>
                      <Text style={styles.headerText1}>Drawing In</Text>

                    </View>





                    {/*DrawingIn FORM  */}












                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center" }}>


                    </View>
                  </View>
                </ScrollView>

              </View> : null}


              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Beam Getting'), FalseOthersBG(); fetchDataBG(); }}>
                  <Text style={styles.buttonText}>Beam Getting</Text>
                  <Text style={{ color: "#fff", textDecorationLine: "underline", marginLeft: "5%" }}>{dateBG}</Text>
                  {
                    reqBG === 1 ? <Text style={{ color: '#fff' }}>Done</Text > :null
                  }
                </TouchableOpacity>
              </View>

              {beamGettingForm ? <View style={{ width: "100%" }}>
                <ScrollView horizontal={true} vertical={true}>
                  <View style={[{ marginLeft: 100 }, styles.table]}>
                    <View style={styles.header1}>
                      <Text style={styles.headerText1}>Beam Getting</Text>

                    </View>











                    {/* BEAM Getting FORM  */}











                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center" }}>

                    </View>
                  </View>
                </ScrollView>

              </View> : null}


              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('First Piece Approval'); FalseOthersFPA() }}>
                  <Text style={styles.buttonText}>First Piece Approval</Text>
                </TouchableOpacity>
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

              </View> : null}
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Fabric Dispatch'), FalseOthersFD(); fetchDataFD(); }}>
                  <Text style={styles.buttonText}>Fabric Dispatch</Text>
                  <Text style={{ color: "#fff", textDecorationLine: "underline", marginLeft: "5%" }}>{dateFD}</Text>

                </TouchableOpacity>
              </View>




              {/*                          



                                      FABRIC DISPATCH FORM 






*/}

              {fdFrom ? <View style={{ justifyContent: "space-evenly", width: "100%", }}>
                <ScrollView horizontal={true}>
                  <View style={styles.table}>
                    <View style={styles.header1}>
                      <View>
                        <Text style={[styles.headerText1, { marginLeft: -1 }]}>Date</Text>
                        <Text style={[styles.headerText1, { marginLeft: -1, color: "blue" }]}>Dispatch No.</Text>
                      </View>
                      <Text style={[styles.headerText1, { marginLeft: -30 }]}>Meter</Text>
                      <Text style={[styles.headerText1, { marginLeft: -1 }]}>Weight</Text>
                      <Text style={[styles.headerText1, { marginLeft: -1 }]}>Image</Text>


                    </View>

                    <View>


                      {
                        show ?

                          <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => setShow(false)}>
                              <Image
                                source={require('../Images/cross.png')}
                                style={{ width: 27, height: 27, alignSelf: 'flex-start', backgroundColor: "#DADBDD", borderRadius: 50, marginLeft: 370, marginTop: 10, zIndex: 0 }}
                                imageStyle={{ borderRadius: 0 }}
                              />
                            </TouchableOpacity>
                            <Image
                              source={{ uri: enlargedImage }}
                              style={{
                                marginTop: 20,
                                width: 400,
                                height: 300,
                              }}
                            />
                          </View>
                          : null
                      }


                      {orderfd.map((item, index) => (
                        <View key={index} style={styles.header1}>
                          <View>
                            <Text style={[styles.headerText1, { marginLeft: -1 }]}>{item.Date.date.substring(0, 10)}</Text>
                            <Text style={[styles.headerText1, { marginLeft: -1, color: "blue" }]}>{item.DispatchNo}</Text>
                          </View>
                          <Text style={[styles.headerText1, { marginLeft: -10 }]}>{item.Meter}</Text>
                          <Text style={[styles.headerText1]}>{item.Weight}</Text>


                          <TouchableOpacity onPress={() => handleImagePress(item.Photopath)} >
                            <Image
                              style={{ width: 40, height: 40, marginHorizontal: 10, margin: 10, marginRight: 60 }}
                              source={{ uri: item.Photopath }}
                            />

                          </TouchableOpacity>


                        </View>
                      ))}
                    </View>


                  </View>

                  <Text style={{ marginRight: 250 }}></Text>
                </ScrollView>

              </View> : null}

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Remaining Goods Return'), FalseOthersrgr(); fetchDataRGR(); }}>
                  <Text style={styles.buttonText}>Remaining Goods Return</Text>
                  <Text style={{ color: "#fff", textDecorationLine: "underline", marginLeft: "5%" }}>{dateRGR}</Text>

                </TouchableOpacity>
              </View>




              {/*                          



                                      Remaining Goods Return
                                    
                                    
                                    
                                    
                
                                      
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

                    {RGR.map((row, index) => (
                      <View key={index} style={styles.rowContainer}>
                        <SafeAreaView style={styles.row}>
                          <Text style={styles.headerText1}>{row.GpNo}</Text>
                          <Text style={[styles.headerText1, { marginLeft: 50 }]}>{row.YarnCount}</Text>
                          <Text style={[styles.headerText1, { marginLeft: 40 }]}>{row.Weight}</Text>
                          <Text style={[styles.headerText1, { marginLeft: 10 }]}>{row.CutPiece}</Text>
                          <Text style={[styles.headerText1, { marginLeft: 10 }]}>{row.Meter}</Text>
                        </SafeAreaView>


                      </View>

                    ))}


                  </View>

                  {/* <Text style={{ marginRight: 250 }}></Text> */}
                </ScrollView>

              </View> : null}

              <TouchableOpacity style={[styles.button1, { backgroundColor: "red", alignItems: "center", marginTop: 20 }]} onPress={() => ToggleScreens()}>
                <Text style={[styles.buttonText, { color: "#fff" }]}>Back</Text>
              </TouchableOpacity>

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
    justifyContent: "space-between",
  },
  headerText1: {
    fontWeight: 'bold',
    marginLeft: 10,
    color: "#000",
    marginHorizontal: 50
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#71B7E1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: "70%",
    justifyContent:"space-between"


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
    marginRight: 80,
    justifyContent: 'space-evenly',
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
})