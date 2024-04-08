import { SafeAreaView, StyleSheet, Text, View, Modal, Pressable, StatusBar, Platform, TouchableOpacity, ImageBackground, TextInput, ScrollView, Image, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import ImageCropPicker from 'react-native-image-crop-picker';
import { PermissionsAndroid } from 'react-native';


const LiveOrders = ({ navigation }) => {

    const [orders, setOrders] = useState([
        { orderNo: 1, partyName: "Party A", Quality: "A" },
        { orderNo: 2, partyName: "Party B", Quality: "B" },
        { orderNo: 3, partyName: "Party C", Quality: "C" },
        { orderNo: 4, partyName: "Party D", Quality: "D" },
        { orderNo: 5, partyName: "Party E", Quality: "E" },
        { orderNo: 6, partyName: "Party F", Quality: "F" },
    ]);

    const [showBlocks, setShowBlocks] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [Beaminform, setBeamInForm] = useState(false)
    const [weftform, setWeftform] = useState(false)
    const [fdFrom, setFdForm] = useState(false)
    const [remaining_goods_returnform, setremaining_Goods_ReturnForm] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [DrawingInForm, setDrawingInForm] = useState(false);
    const [beamGettingForm, setBeamGettingForm] = useState(false);
    const [fpaform, setFPAForm] = useState(false);
    const [show1, setShow1] = useState();

    const currentDate = new Date();

    const formattedDate = currentDate.toDateString();


    const yesbutton = () => {
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

    const handleOrderPress = (order) => {
        setSelectedOrder(order);
        setShowBlocks(false);
    };

    const [Action, setAction] = useState("")

    const handleButtonPress = (action) => {
        if (selectedOrder) {
            console.log(`Order No: ${selectedOrder.orderNo}, Party Name: ${selectedOrder.partyName}, Action: ${action}`);
            setAction("Order No. : " + selectedOrder.orderNo + "\nParty Name : " + selectedOrder.partyName + "\nQuality : " + selectedOrder.Quality)
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


    const [beamIn, setBeamIn] = useState([{ SizingTippanNo: '', PhotoPath: null }]);

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
        const newFormData = [...beamIn, { SizingTippanNo: '', PhotoPath: null }];
        setBeamIn(newFormData);
    };

    const handleRemoveRowBI = (index) => {
        const newFormData = [...beamIn];
        newFormData.splice(index, 1);
        setBeamIn(newFormData);
    };

    const HandleSubmitBeamIn = () => {
        const formdata = new FormData();
        formdata.append("OrderNoId", 10);
        formdata.append("Date",'2024-05-08' );
        formdata.append("Value",beamIn );

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/postorderbeam.php", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        setModalVisible(true)
        console.log('Table Data:', beamIn)
        setBeamInForm(false)
      //  setBeamIn([{SizingTippanNo: '', PhotoPath: null }])
    }

    const handleImagePickerBI = async (index) => {
        try {
            const image = await ImageCropPicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
            });

            const updatedRows = [...beamIn];
            updatedRows[index].PhotoPath = { uri: image.path };
            console.log({ uri: image.path })
            setBeamIn(updatedRows);
        } catch (error) {
            console.log('ImagePicker Error: ', error);
        }
    };

    //WEFT Yard In Form 


    const [Weft, setWeft] = useState([{ date: new Date(), gatePassNumber: '', imageUri: null }]);

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
        setWeft([...Weft, { date: new Date(), gatePassNumber: '', imageUri: null }]);
    };

    const handleRemoveRowWEFT = (index) => {
        const updatedRows = [...Weft];
        updatedRows.splice(index, 1);
        setWeft(updatedRows);
    };

    const HandleSubmitWEFT = () => {
        setModalVisible(true)
        console.log('Table Data:', Weft)
        setWeftform(false)
        setWeft([{ id: 1, date: new Date(), gatePassNumber: '', imageUri: null }])
    }


    const handleImagePickerWEFT = async (index) => {
        try {
            const image = await ImageCropPicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
                cropperCircleOverlay: true,
            });

            const updatedRows = [...Weft];
            updatedRows[index].imageUri = { uri: image.path };
            console.log({ uri: image.path })
            setWeft(updatedRows);
        } catch (error) {
            console.log('ImagePicker Error: ', error);
        }
    };


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
        setModalVisible(true)
        console.log('Table Data:', tableRows)
        setTableRows([{ date: new Date(), meterWidth: '', weight: '', dispatchNumber: '' }])
        setFdForm(false)
    }

    const handleCameraPick = async (index) => {
        try {
            const image = await ImageCropPicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
            });

            const newFormData = [...formData];
            newFormData[index]['imageUri'] = image.path;
            setFormData(newFormData);
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
        setModalVisible(true)
        console.log('Table Data:', remaining_goods_return);
        setRemaining_Goods_Return([{ GP_NO: '', Yarn_count: '', weight: '', Cut_piece: '', Meter: '' }]);
        setremaining_Goods_ReturnForm(false)

    }


    return (
        <SafeAreaView style={{ backgroundColor: "#e5f2fe" }}>
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
            <ScrollView>
                <View>
                    <View style={styles.container}>
                        <View style={{ flexDirection: "row", marginBottom: "8%" }}>
                            <View style={{ backgroundColor: "red", width: "55%", alignItems: "center", marginLeft: "22%", borderRadius: 20, marginBottom: "5%" }}>
                                <Text style={styles.heading}>Live Orders</Text>
                            </View>
                        </View>

                        {/* FORM OPTIONS */}

                        <Text style={{ color: "#000", fontSize: 22 }}>{Action}</Text>


                        {showBlocks ? <View style={styles.ordersContainer}>
                            {orders.map((order, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.orderContainer}
                                    onPress={() => handleOrderPress(order)}>
                                    <Text style={styles.orderText}>{`Order No: ${order.orderNo}     party Name : ${order.partyName}   \n\n    Quality :${order.Quality}`}</Text>
                                </TouchableOpacity>
                            ))}
                        </View> : null}







                        {selectedOrder && (
                            <View>
                                <View style={{ alignItems: "center", justifyContent: "center", marginTop: "10%" }}>
                                    <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Beam in'); FalseOthersBeamIn() }}>
                                        <Text style={[styles.buttonText, styles.BeamInCss]}>Beam in</Text>
                                    </TouchableOpacity>
                                    {Beaminform ? <View style={{ width: "100%" }}>
                                        <ScrollView horizontal={true} vertical={true}>
                                            <View style={[styles.table, { width: 520 }]}>
                                                <View style={styles.header1}>
                                                    <Text style={styles.headerText1}>Date</Text>
                                                    <Text style={[styles.headerText1, { marginRight: 120 }]}>Sizing Tippan Number</Text>

                                                </View>





                                                {/* BEAM IN FORM  */}













                                                {beamIn.map((row, index) => (
                                                    <ScrollView>
                                                        <View key={index} style={styles.rowContainer}>

                                                            <View style={styles.row}>
                                                                <View>
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
                                                                    style={[styles.input, { width: "42%" }]}
                                                                    value={row.SizingTippanNo}
                                                                    onChangeText={(text) => handleInputChangeBI(text, index, 'SizingTippanNo')}
                                                                    keyboardType="numeric"
                                                                    placeholder="sizing Tippan Number"
                                                                />
                                                                <View>
                                                                    <TouchableOpacity onPress={() => { handleImagePickerBI(index); setShow1(1) }}>


                                                                        {
                                                                            (() => {

                                                                                if (show1 === 1) {
                                                                                    return (
                                                                                        <View>
                                                                                            <Image
                                                                                                source={row.PhotoPath}
                                                                                                style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                                                                            />
                                                                                        </View>
                                                                                    )
                                                                                } else {
                                                                                    return (
                                                                                        <Image
                                                                                            source={require('../Images/camera.png')}
                                                                                            style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                                                                        />
                                                                                    )


                                                                                }

                                                                            })()
                                                                        }</TouchableOpacity>

                                                                </View>
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
                                    <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('WEFT yarn in'); FalseOthersWeft() }}>
                                        <Text style={styles.buttonText}>WEFT yarn in</Text>
                                    </TouchableOpacity>



                                    {/* WEFT YARN IN FORM */}









                                    {weftform ? <View style={{ justifyContent: "space-evenly", width: "100%" }}>
                                        <ScrollView horizontal={true}>
                                            <View style={[styles.table, { width: 520 }]}>
                                                <View style={styles.header1}>
                                                    <Text style={styles.headerText1}>Date</Text>
                                                    <Text style={[styles.headerText1, { marginRight: 90 }]}>Gate Pass Number</Text>

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
                                                            <View>
                                                                <TouchableOpacity onPress={() => { handleImagePickerWEFT(index); setShow1(1) }}>


                                                                    {
                                                                        (() => {

                                                                            if (show1 === 1) {
                                                                                return (
                                                                                    <View>
                                                                                        <Image
                                                                                            source={row.imageUri}
                                                                                            style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                                                                        />
                                                                                    </View>
                                                                                )
                                                                            } else {
                                                                                return (
                                                                                    <Image
                                                                                        source={require('../Images/camera.png')}
                                                                                        style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                                                                    />
                                                                                )


                                                                            }

                                                                        })()
                                                                    }</TouchableOpacity>

                                                            </View>
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










                                    <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Drawing in'), FalseOthersDI() }}>
                                        <Text style={styles.buttonText}>Drawing in</Text>
                                    </TouchableOpacity>
                                    {DrawingInForm ? <View style={{ width: "100%" }}>
                                        <ScrollView horizontal={true} vertical={true}>
                                            <View style={[styles.table, { width: 200, marginLeft: 30 }]}>
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
                                                <Text style={styles.text}>{formattedDate}</Text>
                                            </View>
                                        </ScrollView>
                                        <TouchableOpacity style={styles.submitButton} onPress={() => SubmitDrawingIn()}>
                                            <Text style={styles.submitButtonText}>Submit</Text>
                                        </TouchableOpacity>
                                    </View> : null}


                                    <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Beam Getting'), FalseOthersBG() }}>
                                        <Text style={styles.buttonText}>Beam Getting</Text>
                                    </TouchableOpacity>
                                    {beamGettingForm ? <View style={{ width: "100%" }}>
                                        <ScrollView horizontal={true} vertical={true}>
                                            <View style={[styles.table, { width: 200, marginLeft: 30 }]}>
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
                                                <Text style={styles.text}>{formattedDate}</Text>
                                            </View>
                                        </ScrollView>
                                        <TouchableOpacity style={styles.submitButton} onPress={() => SubmitBeamInGetting()}>
                                            <Text style={styles.submitButtonText}>Submit</Text>
                                        </TouchableOpacity>
                                    </View> : null}


                                    <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('First Piece Approval'); FalseOthersFPA() }}>
                                        <Text style={styles.buttonText}>First Piece Approval</Text>
                                    </TouchableOpacity>
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
                                    <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Fabric Dispatch'), FalseOthersFD() }}>
                                        <Text style={styles.buttonText}>Fabric Dispatch</Text>
                                    </TouchableOpacity>



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

                                                            <View>
                                                                <TouchableOpacity onPress={() => { handleCameraPickBI(); setShow1(1) }}>


                                                                    {
                                                                        (() => {

                                                                            if (show1 === 1) {
                                                                                return (
                                                                                    <View>
                                                                                        <Image
                                                                                            source={require('../Images/pic1.png')}
                                                                                            style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                                                                        />
                                                                                    </View>
                                                                                )
                                                                            } else {
                                                                                return (
                                                                                    <Image
                                                                                        source={require('../Images/camera.png')}
                                                                                        style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                                                                    />
                                                                                )


                                                                            }

                                                                        })()
                                                                    }</TouchableOpacity>

                                                            </View>
                                                            <View style={[styles.rowButtons, { marginRight: 0 }]}>
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

                                                    </View>
                                                ))}


                                            </View>

                                            <Text style={{ marginRight: 250 }}></Text>
                                        </ScrollView>
                                        <TouchableOpacity style={styles.submitButton} onPress={() => HandleSubmitFD()}>
                                            <Text style={styles.submitButtonText}>Submit</Text>
                                        </TouchableOpacity>

                                    </View> : null}

                                    <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Remaining Goods Return'), FalseOthersrgr() }}>
                                        <Text style={styles.buttonText}>Remaining Goods Return</Text>
                                    </TouchableOpacity>



                                    {/*                          



                                      FABRIC DISPATCH FORM 
                                    
                                    
                                    
                                    
                
                                      
*/}

                                    {remaining_goods_returnform ? <View style={{ justifyContent: "space-evenly", width: "110%", }}>
                                        <ScrollView horizontal={true}>
                                            <View style={[styles.table, { marginRight: 120, marginLeft: 10, width: 700 }]}>
                                                <View style={styles.header1}>
                                                    <Text style={styles.headerText1}>GP. NO.</Text>
                                                    <Text style={styles.headerText1}>Yarn Count</Text>
                                                    <Text style={[styles.headerText1, { marginLeft: 0 }]}>Weight</Text>
                                                    <Text style={[styles.headerText1, { marginLeft: 0 }]}>Cut Piece</Text>
                                                    <Text style={[styles.headerText1, { marginRight: 110 }]}>Weight</Text>

                                                </View>

                                                {remaining_goods_return.map((row, index) => (
                                                    <View key={index} style={styles.rowContainer}>
                                                        <SafeAreaView style={[styles.row, { width: 600 }]}>
                                                            <TextInput
                                                                style={[styles.input, { width: "18%" }]}
                                                                value={row.GP_NO}
                                                                onChangeText={(text) => handleInputChangeRGR(text, index, 'GP_NO')}
                                                                keyboardType="numeric"
                                                                placeholder="GP_NO"
                                                                placeholderTextColor={"#000"}
                                                            />
                                                            <TextInput
                                                                style={[styles.input, { width: "18%" }]}
                                                                value={row.Yarn_count}
                                                                onChangeText={(text) => handleInputChangeRGR(text, index, 'Yarn_count')}
                                                                keyboardType="numeric"
                                                                placeholder="Yarn_count"
                                                                placeholderTextColor={"#000"}

                                                            />
                                                            <TextInput
                                                                style={[styles.input, { width: "18%" }]}
                                                                value={row.weight}
                                                                onChangeText={(text) => handleInputChangeRGR(text, index, 'weight')}
                                                                keyboardType="numeric"
                                                                placeholder="Weight"
                                                                placeholderTextColor={"#000"}

                                                            />
                                                            <TextInput
                                                                style={[styles.input, { width: "18%" }]}
                                                                value={row.Cut_piece}
                                                                onChangeText={(text) => handleInputChangeRGR(text, index, 'Cut_piece')}
                                                                keyboardType="numeric"
                                                                placeholder="Cut_piece"
                                                                placeholderTextColor={"#000"}

                                                            />
                                                            <TextInput
                                                                style={[styles.input, { width: "18%" }]}
                                                                value={row.Meter}
                                                                onChangeText={(text) => handleInputChangeRGR(text, index, 'Meter')}
                                                                keyboardType="numeric"
                                                                placeholder="Meter"
                                                                placeholderTextColor={"#000"}

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

                                    <TouchableOpacity style={[styles.button1, { backgroundColor: "red", alignItems: "center" }]} onPress={() => ToggleScreens()}>
                                        <Text style={[styles.buttonText, { color: "#fff" }]}>Cancel</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        )}













                    </View >
                    <View style={{ justifyContent: "flex-end", marginTop: "35%" }}>
                        <TouchableOpacity style={styles.submitButton} onPress={() => console.log('Table Data:', Weft)}>
                            <Text style={styles.submitButtonText}>Order Completed</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: "18%" }}></Text>
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
                                <Text style={styles.modalText}>Data Submitted Successfully</Text>
                                <View style={{ flexDirection: "column", alignItems: "center" }}>
                                    <Image
                                        style={{ width: 50, height: 50 }}
                                        source={require("../Images/success.png")}
                                    />
                                    <Pressable
                                        style={[styles.button1, styles.buttonClose1]}
                                        onPress={() => yesbutton(!modalVisible)}>
                                        <Text style={styles.textStyle1}>close</Text>
                                    </Pressable>

                                </View>
                            </View>
                        </View>
                    </Modal>
                </View >
            </ScrollView >
        </SafeAreaView >
    )
}


export default LiveOrders

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
        justifyContent: "space-around"
    },
    headerText1: {
        fontWeight: 'bold',
        marginLeft: 0,
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
        justifyContent: "space-between",
        padding: 10,
        borderBottomColor: '#000',
    },
    table: {
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 20,
        marginRight: 0,
        width: 1200
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
        marginRight: 0
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
        color: "#000"
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
    text: {
        fontSize: 15,
        color: "#000",
        marginLeft: "18%"
    },

})