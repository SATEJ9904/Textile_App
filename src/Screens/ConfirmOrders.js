import { SafeAreaView, StyleSheet, Text, View, Modal, Pressable, StatusBar, FlatList, RefreshControl, TouchableOpacity, ImageBackground, TextInput, ScrollView, Image, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import ImageCropPicker from 'react-native-image-crop-picker';
import { PermissionsAndroid } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";



const ConfirmOrders = ({ navigation }) => {

    const [username, setUserName] = useState("");
    const [AppUserId, setAppUserId] = useState("")
    const [LoomOrTrader, SetLoomOrTrader] = useState("")
    const [id, setId] = useState("")


    useEffect(() => {
        getData();
        console.log(username, AppUserId, LoomOrTrader, id)
    }, [])

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
        const Name = await AsyncStorage.getItem("Name");
        const AppUserId = await AsyncStorage.getItem("AppUserId");
        const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")
        const Id = await AsyncStorage.getItem("Id")

        setUserName(Name)
        setAppUserId(AppUserId)
        SetLoomOrTrader(LoomOrTrader)
        setId(Id)

    }


    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
        getCurrentDate();
        fetchDataFPAD();
        getData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);



    useEffect(() => {
        onRefresh();
        fetchData();
        handleButtonPress();
    }, []);


    const [orders, setOrders] = useState([]);


    const fetchData = async () => {
        try {
            const response = await fetch('https://textileapp.microtechsolutions.co.in/php/loomliveorder.php?LoomTraderId=' + await AsyncStorage.getItem("Id"));
            const json = await response.json();
            setOrders(json);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {

        getCurrentDate();
    }, []);

    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        setCurrentDate(`${year}-${month}-${day}`);
    };


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

    const [getOrderNo, setGetOrderNo] = useState(null)

    const handleOrderPress = (order) => {
        setGetOrderNo(order.LoomOrderId)
        console.log(order.LoomOrderId)
        setSelectedOrder(order);
        setShowBlocks(false);
        fetchDataFPAD(order)
        handleButtonPress()
    };

    const [Action, setAction] = useState("")

    const handleButtonPress = (action) => {
        if (selectedOrder) {
            console.log(`Order No: ${selectedOrder.OrderNo}, Party Name: ${selectedOrder.PartyName}, Action: ${action}`);
            setAction("Order No. : " + selectedOrder.OrderNo + "\nParty Name : " + selectedOrder.PartyName + "\nQuality : " + selectedOrder.Quality)
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


    const [beamIn, setBeamIn] = useState([{ date: new Date(), SizingTippanNo: null, PhotoPath: BIImage }]);

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

    const BIImage = require('../Images/camera.png')

    const handleAddRowBI = () => {
        const newFormData = [...beamIn, { date: new Date(), SizingTippanNo: '', PhotoPath: BIImage }];
        setBeamIn(newFormData);
    };

    const handleRemoveRowBI = (index) => {
        const newFormData = [...beamIn];
        newFormData.splice(index, 1);
        setBeamIn(newFormData);
    };

    const HandleSubmitBeamIn1 = (item) => {

        for (let i = 0; i < beamIn.length; i++) {
            if (!item.SizingTippanNo || isNaN(parseInt(item.SizingTippanNo, 10))) {
                Alert.alert(`Please enter a valid Sizing Tippan No for row ${i + 1}`);
                return false;
            } else {
                const integerNumber = parseInt(item.SizingTippanNo, 10);
                console.log("Converted to Integer", integerNumber, item.date.toISOString().split('T')[0])
                let formatteddate = item.date.toISOString().split('T')[0]

                const formdata = new FormData();
                formdata.append("OrderNoId", getOrderNo);
                formdata.append("Date", formatteddate);
                formdata.append("SizingTippanNo", integerNumber);
                if (item.PhotoPath && item.PhotoPath.uri) {
                    formdata.append('PhotoPath', {
                        uri: item.PhotoPath.uri,
                        type: "image/jpg",
                        name: "cprograming.jpg",
                    });
                } else {
                    formdata.append('PhotoPath', null);
                }

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
                setBeamInForm(false)
            }
        }



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


    const HandleSubmitBeamIn = () => {

        {
            beamIn.map((item) => {
                HandleSubmitBeamIn1(item);
            })
        }
    }

    //WEFT Yard In Form 

    const WEFTImage = require('../Images/camera.png')
    const [Weft, setWeft] = useState([{ date: new Date(), GatePassNo: '', PhotoPathweft: require("../Images/camera.png") }]);

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
        const newFormData = [...Weft, { date: new Date(), GatePassNo: '', PhotoPathweft: require("../Images/camera.png") }];
        setWeft(newFormData);
    };

    const handleRemoveRowWEFT = (index) => {
        const newFormData = [...Weft];
        newFormData.splice(index, 1);
        setWeft(newFormData);
    };

    const HandleSubmitWEFT1 = (itemweft) => {

        for (let i = 0; i < Weft.length; i++) {
            if (!itemweft.GatePassNo || isNaN(parseInt(itemweft.GatePassNo, 10))) {
                Alert.alert(`Please enter a valid Gate Pass No. for row ${i + 1}`);
                return false;
            } else {
                const integerNumber = parseInt(itemweft.GatePassNo);
                console.log("Converted to Integer = ", integerNumber)
                let formatteddate = itemweft.date.toISOString().split('T')[0]



                const formdata = new FormData();
                formdata.append("OrderNoId", getOrderNo);
                formdata.append("Date", formatteddate);
                formdata.append("GatePassNo", integerNumber);
                if (itemweft.PhotoPath && itemweft.PhotoPath.uri) {
                    formdata.append('PhotoPath', {
                        uri: itemweft.PhotoPath.uri,
                        type: "image/jpg",
                        name: "cprograming.jpg",
                    });
                } else {
                    formdata.append('PhotoPath', null);
                }

                const requestOptions = {
                    method: "POST",
                    body: formdata,
                    redirect: "follow"
                };

                fetch("https://textileapp.microtechsolutions.co.in/php/postorderyarn.php ", requestOptions)
                    .then((response) => response.text())
                    .then((result) => console.log(result))
                    .catch((error) => console.error(error));
                setModalVisible(true)
                setWeftform(false)

            }


        }
    }

    const handleImagePickerWEFT = async (index) => {
        try {
            const image = await ImageCropPicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
            });

            const updatedRows = [...Weft];
            updatedRows[index].PhotoPathweft = { uri: image.path };
            console.log({ uri: image.path })
            setWeft(updatedRows);
        } catch (error) {
            console.log('ImagePicker Error: ', error);
        }
    };


    const HandleSubmitWEFT = () => {

        {
            Weft.map((itemweft) => {
                HandleSubmitWEFT1(itemweft);
            })
        }
    }

    // Drawing In

    const [DrawingIn, setDrawingIn] = useState(false)

    const SubmitDrawingIn = () => {
        const formdata = new FormData();
        formdata.append("OrderNoId", getOrderNo);
        formdata.append("Status", DrawingIn);

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/postorderdrawingin.php", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        setDrawingInForm(false)
        setDrawingIn(false)
        console.log(DrawingIn)
    }

    // Beam Getting

    const [beamgetting, setBeamGetting] = useState(false)

    const SubmitBeamInGetting = () => {
        const formdata = new FormData();
        formdata.append("OrderNoId", getOrderNo);
        formdata.append("Status", beamgetting);

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/postorderbeamgetting.php", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        setBeamGettingForm(false)
        setBeamGetting(false)
        console.log(beamgetting)
    }

    // First Piece Approval sending

    const [first_piece_approval, setFirst_Piece_Approval] = useState(" ")


    const SubmitFPA = async () => {


        console.log("Submitted Data = ", "User Id = ", id, "Order No = ", getOrderNo, "Comment = ", first_piece_approval)

        const formdata = new FormData();
        formdata.append("LoomTraderId", id);
        formdata.append("OrderNoId", getOrderNo);
        formdata.append("Comment", first_piece_approval);

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/postorderfirstpiece.php", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        console.log(first_piece_approval)
        setFPAForm(false)
        setFirst_Piece_Approval(" ")
        setModalVisible(true)
    }


    // First Piece Approval Display

    const [FPAD, setFPAD] = useState([]);


    const fetchDataFPAD = async (order) => {

        console.log("Got Id = ", order.LoomOrderId)

        try {
            const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getname.php?OrderNoId=' + order.LoomOrderId);
            const json = await response.json();
            setFPAD(json);

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

    // Fabric Dispatch

    const [tableRows, setTableRows] = useState([{ date: new Date(), Meter: '', Weight: '', PhotoPathFFD: require("../Images/camera.png") }]);
    const [showDatePickerFD, setShowDatePickerFD] = useState(false);
    const [selectedDateIndexFD, setSelectedDateIndexFD] = useState(0);
    const FDImage = require('../Images/camera.png')



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
        const newFormData = [...tableRows, { date: new Date(), Meter: '', weight: '', PhotoPathFFD: require("../Images/camera.png") }];
        setTableRows(newFormData);
    };

    const handleRemoveRowFD = (index) => {
        const newFormData = [...tableRows];
        newFormData.splice(index, 1);
        setTableRows(newFormData);
    };

    const HandleSubmitFD1 = (item, index) => {
        if (!item.Meter || isNaN(parseInt(item.Meter, 10))) {
            Alert.alert(`Please enter a valid Meter value for row ${index + 1}`);
            return false;
        }

        if (!item.Weight || isNaN(parseInt(item.Weight, 10))) {
            Alert.alert(`Please enter a valid Weight value for row ${index + 1}`);
            return false;
        }

        let formatteddate = item.date.toISOString().split('T')[0];
        const integerNumber = parseInt(item.Meter, 10);
        const integerNumber2 = parseInt(item.Weight, 10);
        console.log("Converted to Integer", integerNumber, integerNumber2, item.PhotoPathFFD.uri);

        const formdata = new FormData();
        formdata.append("OrderNoId", getOrderNo);
        formdata.append("Date", formatteddate);
        formdata.append("Weight", integerNumber2);
        formdata.append("Meter", integerNumber);

        if (item.PhotoPathFFD && item.PhotoPathFFD.uri) {
            formdata.append('PhotoPath', {
                uri: item.PhotoPathFFD.uri,
                type: "image/jpg",
                name: "cprograming.jpg",
            });
        } else {
            formdata.append('PhotoPath', null);
        }

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/postorderfabric.php", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        setModalVisible(true)
        setFdForm(false)

    };

    const HandleSubmitFD = () => {
        for (let i = 0; i < tableRows.length; i++) {
            const item = tableRows[i];
            if (!HandleSubmitFD1(item, i)) {
                return;
            }
        }
        setModalVisible(true);
        setWeftform(false);
    };

    const handleImagePickerFD = async (index) => {
        try {
            const image = await ImageCropPicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
            });

            const updatedRows = [...tableRows];
            updatedRows[index].PhotoPathFFD = { uri: image.path };
            console.log({ uri: image.path })
            setTableRows(updatedRows);
        } catch (error) {
            console.log('ImagePicker Error: ', error);
        }
    };

    //REMAINING GOODS RETURN 

    const [remaining_goods_return, setRemaining_Goods_Return] = useState([{ GpNo: '', YarnCount: '', Weight: '', CutPiece: '', Meter: '' }]);


    const handleInputChangeRGR = (text, index, field) => {
        const updatedRows = [...remaining_goods_return];
        updatedRows[index][field] = text;
        setRemaining_Goods_Return(updatedRows);
    };

    const handleAddRowRGR = () => {
        const newFormData = [...remaining_goods_return, { GpNo: '', YarnCount: '', Weight: '', CutPiece: '', Meter: '' }];
        setRemaining_Goods_Return(newFormData);
    };

    const handleRemoveRowRGR = (index) => {
        const newFormData = [...remaining_goods_return];
        newFormData.splice(index, 1);
        setRemaining_Goods_Return(newFormData);
    };

    const HandleSubmiRGR1 = (item, index) => {
        if (!item.GpNo || isNaN(parseInt(item.GpNo, 10))) {
            Alert.alert(`Please enter a valid GpNo for row ${index + 1}`);
            return false;
        }
        if (!item.YarnCount || isNaN(parseInt(item.YarnCount, 10))) {
            Alert.alert(`Please enter a valid YarnCount for row ${index + 1}`);
            return false;
        }
        if (!item.Weight || isNaN(parseInt(item.Weight, 10))) {
            Alert.alert(`Please enter a valid Weight for row ${index + 1}`);
            return false;
        }
        if (!item.CutPiece || isNaN(parseInt(item.CutPiece, 10))) {
            Alert.alert(`Please enter a valid CutPiece for row ${index + 1}`);
            return false;
        }
        if (!item.Meter || isNaN(parseInt(item.Meter, 10))) {
            Alert.alert(`Please enter a valid Meter for row ${index + 1}`);
            return false;
        }

        const integerNumber = parseInt(item.GpNo, 10);
        const integerNumber2 = parseInt(item.YarnCount, 10);
        const integerNumber3 = parseInt(item.Weight, 10);
        const integerNumber4 = parseInt(item.CutPiece, 10);
        const integerNumber5 = parseInt(item.Meter, 10);

        console.log("Converted to Integer", integerNumber, integerNumber2, integerNumber3, integerNumber4, integerNumber5);

        const formdata = new FormData();
        formdata.append("OrderNoId", getOrderNo);
        formdata.append("GpNo", integerNumber);
        formdata.append("YarnCount", integerNumber2);
        formdata.append("Weight", integerNumber3);
        formdata.append("CutPiece", integerNumber4);
        formdata.append("Meter", integerNumber5);

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/postorderreturn.php", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));

        setModalVisible(true)
        setremaining_Goods_ReturnForm(false)
    };

    const HandleSubmitRGR = () => {
        for (let i = 0; i < remaining_goods_return.length; i++) {
            const item = remaining_goods_return[i];
            if (!HandleSubmiRGR1(item, i)) {
                return;
            }
        }
        setModalVisible(true);
        setWeftform(false);
    };


    const startOrder = async (order) => {
        const confirmed = true
        try {
            const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/updateloomorder.php?LoomOrderId=${order.LoomOrderId}&Confirmed=${confirmed}`);

            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            console.log('Order updated successfully');
            navigation.navigate("LoomBooking")
        } catch (error) {
            console.error(error);
        }
    };

    const cancelOrder = async (order) => {
        const confirmed = false
        try {
            const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/updateloomorder.php?LoomOrderId=${order.LoomOrderId}&Confirmed=${confirmed}`);

            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            console.log('Order updated successfully');
        } catch (error) {
            console.error(error);
        }
    };




    return (
        <SafeAreaView style={{ backgroundColor: "#e5f2fe", flex: 1 }}>
            <StatusBar backgroundColor={"#003c43"}></StatusBar>
            <View style={{ backgroundColor: "#003c43", flexDirection: "row" }}>
                <TouchableOpacity onPress={() => navigation.navigate("Live orders")}>
                    <ImageBackground
                        source={require("../Images/back.png")}
                        style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003c43", marginTop: 15, marginRight: 0, marginLeft: 10 }}
                        imageStyle={{ borderRadius: 0 }}
                    />
                </TouchableOpacity>
                <Text style={{ fontSize: 25, color: "white", margin: "2.5%", marginLeft: "25%" }}>Live Orders</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View>
                    <View style={styles.container}>


                        {/* FORM OPTIONS */}




                        {showBlocks ? (
                            <View style={styles.ordersContainer}>
                                {orders.map((order, index) => (
                                    order.Confirmed === 1 ? (
                                        <View key={index} style={styles.orderWrapper}>
                                            <TouchableOpacity style={styles.orderContainer} onPress={() => handleOrderPress(order)}>
                                                <Text style={styles.orderText}>{`Order No: ${order.OrderNo}\nParty Name: ${order.PartyName}\nQuality: ${order.Quality}`}</Text>
                                            </TouchableOpacity>
                                            <View style={styles.buttonContainer}>
                                                <TouchableOpacity style={styles.button} onPress={() => cancelOrder(order)}>
                                                    <Text style={styles.buttonText}>Cancel Order</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ) : null
                                ))}
                            </View>
                        ) : null}









                        {selectedOrder && (
                            <View>
                                <Text style={{ color: "#000", fontSize: 22 }}>{Action}</Text>
                                <View style={{ alignItems: "center", justifyContent: "center", marginTop: "10%" }}>
                                    <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Beam in'); FalseOthersBeamIn() }}>
                                        <Text style={[styles.buttonText, styles.BeamInCss]}>Beam in</Text>
                                    </TouchableOpacity>
                                    {Beaminform ? <View style={{ width: "100%" }}>
                                        <ScrollView horizontal={true} vertical={true}>
                                            <View style={[styles.table, { width: 520 }]}>
                                                <View style={styles.header1}>
                                                    <Text style={styles.headerText1}>Date</Text>
                                                    <Text style={[styles.headerText1, { marginRight: 80 }]}>Sizing Tippan Number</Text>
                                                    <Text style={[styles.headerText1, { marginRight: 40 }]}>Image</Text>

                                                </View>





                                                {/* BEAM IN FORM  */}













                                                {beamIn.map((row, index) => (
                                                    <ScrollView>
                                                        <View key={index} style={styles.rowContainer}>

                                                            <View style={styles.row}>
                                                                <View>
                                                                    <Text style={styles.dateText}>{row.date.toLocaleDateString()}</Text>

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
                                                                        minimumDate={new Date()}
                                                                        onChange={handleDateChangeBI}
                                                                    />
                                                                )}
                                                                <TextInput
                                                                    style={[styles.input, { width: 200 }]}
                                                                    value={row.SizingTippanNo}
                                                                    onChangeText={(text) => handleInputChangeBI(text, index, 'SizingTippanNo')}
                                                                    keyboardType="numeric"
                                                                    placeholderTextColor={"#000"}
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
                                                    <Text style={[styles.headerText1, { marginRight: 30 }]}>Gate Pass Number</Text>
                                                    <Text style={[styles.headerText1, { marginRight: 20 }]}>Image</Text>


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
                                                                    minimumDate={new Date()}
                                                                    display="default"
                                                                    placeholderTextColor={"#000"}
                                                                    onChange={handleDateChangeWEFT}
                                                                />
                                                            )}
                                                            <TextInput
                                                                style={[styles.input, { width: "45%" }]}
                                                                value={row.GatePassNo}
                                                                onChangeText={(text) => handleInputChangeWEFT(text, index, 'GatePassNo')}
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
                                                                                            source={row.PhotoPathweft}
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
                                                    <Text style={{ color: "#000", marginLeft: 15, fontSize: 20 }}>Done</Text>
                                                </View>
                                                <Text style={styles.text}>{currentDate}</Text>
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
                                                    <Text style={{ color: "#000", marginLeft: 15, fontSize: 20 }}>Done</Text>
                                                </View>
                                                <Text style={styles.text}>{currentDate}</Text>
                                            </View>
                                        </ScrollView>
                                        <TouchableOpacity style={styles.submitButton} onPress={() => SubmitBeamInGetting()}>
                                            <Text style={styles.submitButtonText}>Submit</Text>
                                        </TouchableOpacity>
                                    </View> : null}


                                    <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('First Piece Approval'); FalseOthersFPA() }}>
                                        <Text style={styles.buttonText}>First Piece Approval</Text>
                                    </TouchableOpacity>
                                    {fpaform ?
                                        <View style={{ borderWidth: 1 }}>
                                            <View style={styles.tableHeader}>
                                                <Text style={styles.headerText}>Messages</Text>
                                                <TouchableOpacity onPress={() => setFPAForm(false)}>
                                                    <Image
                                                        source={require("../Images/cross.png")}
                                                        style={{ width: 30, height: 30 }}
                                                    />
                                                </TouchableOpacity>
                                            </View>


                                            {FPAD.map((item, index) => (
                                                <View key={index} style={{ padding: 10, alignItems: "flex-start", justifyContent: "center", width: 400, borderBottomWidth: 1 }}>
                                                    <Text style={{ color: "#000" }}>{item.UpdatedOn.date.substring(0, 10)}</Text>
                                                    <Text style={{ color: "#000" }}>{item.Name} : {item.Comment}</Text>
                                                </View>
                                            ))}


                                            <View style={{ width: "100%", marginTop: 15 }}>
                                                <ScrollView horizontal={true} vertical={true}>
                                                    <View style={[{ marginLeft: 10, width: 500 }, styles.table]}>




                                                        {/*First Piece Approval FORM  */}






                                                        <View style={{ flexDirection: "row", width: "100%" }}>
                                                            <TextInput
                                                                style={{ width: "80%", borderRadius: 15 }}
                                                                placeholder='Any Comments....'
                                                                placeholderTextColor={"#000"}
                                                                value={first_piece_approval}
                                                                onChangeText={(txt) => setFirst_Piece_Approval(txt)}
                                                                multiline={true} // Allows multiple lines of input
                                                                numberOfLines={5} // Sets the initial number of lines
                                                            />
                                                        </View>
                                                    </View>
                                                </ScrollView>
                                                <TouchableOpacity style={styles.submitButton} onPress={() => SubmitFPA()}>
                                                    <Text style={styles.submitButtonText}>Submit</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View> : null}
                                    <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Fabric Dispatch'), FalseOthersFD() }}>
                                        <Text style={styles.buttonText}>Fabric Dispatch</Text>
                                    </TouchableOpacity>



                                    {/*                          



                                      FABRIC DISPATCH FORM 






*/}

                                    {fdFrom ? <View style={{ justifyContent: "space-between", width: "100%", }}>
                                        <ScrollView horizontal={true}>
                                            <View style={[styles.table, { width: 700, justifyContent: "space-between" }]}>
                                                <View style={styles.header1}>
                                                    <Text style={[styles.headerText1, { marginLeft: -70 }]}>Date</Text>
                                                    <Text style={[styles.headerText1, { marginRight: 50 }]}>Meter</Text>
                                                    <Text style={[styles.headerText1, { marginLeft: 0 }]}>Weight</Text>
                                                    <Text style={[styles.headerText1, { marginRight: -50 }]}>Image</Text>
                                                </View>

                                                {tableRows.map((row, index) => (
                                                    <View key={index} style={styles.rowContainer}>
                                                        <View style={styles.row}>

                                                            <View style={styles.headerText1}>
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
                                                                    minimumDate={new Date()}
                                                                    display="default"
                                                                    onChange={handleDateChangeFD}
                                                                />
                                                            )}
                                                            <TextInput
                                                                style={[styles.input, { width: 200 }]}
                                                                value={row.Meter}
                                                                onChangeText={(text) => handleInputChangeFD(text, index, 'Meter')}
                                                                keyboardType="numeric"
                                                                placeholderTextColor={"#000"}
                                                                placeholder="Meter"
                                                            />
                                                            <TextInput
                                                                style={[styles.input, { width: 200 }]}
                                                                value={row.Weight}
                                                                onChangeText={(text) => handleInputChangeFD(text, index, 'Weight')}
                                                                keyboardType="numeric"
                                                                placeholderTextColor={"#000"}
                                                                placeholder="Weight"
                                                            />

                                                            <View>
                                                                <TouchableOpacity onPress={() => { handleImagePickerFD(index); setShow1(1) }}>


                                                                    {
                                                                        (() => {

                                                                            if (show1 === 1) {
                                                                                return (
                                                                                    <View>
                                                                                        <Image
                                                                                            source={row.PhotoPathFFD}
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
                                                    <Text style={[styles.headerText1, { marginRight: 110 }]}>Meter</Text>

                                                </View>

                                                {remaining_goods_return.map((row, index) => (
                                                    <View key={index} style={styles.rowContainer}>
                                                        <SafeAreaView style={[styles.row, { width: 600 }]}>
                                                            <TextInput
                                                                style={[styles.input, { width: "18%" }]}
                                                                value={row.GpNo}
                                                                onChangeText={(text) => handleInputChangeRGR(text, index, 'GpNo')}
                                                                keyboardType="numeric"
                                                                placeholder="GP_NO"
                                                                placeholderTextColor={"#000"}
                                                            />
                                                            <TextInput
                                                                style={[styles.input, { width: "18%" }]}
                                                                value={row.YarnCount}
                                                                onChangeText={(text) => handleInputChangeRGR(text, index, 'YarnCount')}
                                                                keyboardType="numeric"
                                                                placeholder="Yarn_count"
                                                                placeholderTextColor={"#000"}

                                                            />
                                                            <TextInput
                                                                style={[styles.input, { width: "18%" }]}
                                                                value={row.Weight}
                                                                onChangeText={(text) => handleInputChangeRGR(text, index, 'Weight')}
                                                                keyboardType="numeric"
                                                                placeholder="Weight"
                                                                placeholderTextColor={"#000"}

                                                            />
                                                            <TextInput
                                                                style={[styles.input, { width: "18%" }]}
                                                                value={row.CutPiece}
                                                                onChangeText={(text) => handleInputChangeRGR(text, index, 'CutPiece')}
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
                    <View style={{ marginTop: "5%" }}>
                        <TouchableOpacity style={styles.submitButton} onPress={() => console.log('Table Data:', Weft)}>
                            <Text style={styles.submitButtonText}>Order Completed</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={{ marginTop: "18%" }}></Text>
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
            <View style={{ flexDirection: "row", justifyContent: 'space-evenly', borderWidth: 1, borderColor: "#0A5D47" }}>
                <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#0A5D47", width: "52%", borderRadius: 20 }}>
                    <Text style={{ color: "#fff", fontSize: 20, padding: 5 }}>Confirmed Orders</Text>
                </View>
                <Text style={{ color: "#0A5D47", fontSize: 20 }}>|</Text>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Live orders")}>
                        <Text style={{ color: "#0A5D47", fontSize: 20 }}>Live Orders</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView >
    )
}


export default ConfirmOrders

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

    header1: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#e5f2fe',
        borderWidth: 1,
        justifyContent: 'space-evenly'
    },
    headerText1: {
        fontWeight: 'bold',
        marginLeft: 0,
        color: "#000"
    },

    ordersContainer: {
        padding: 10,
    },
    orderWrapper: {
        marginBottom: 20,
    },
    orderContainer: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: "#0A5D47",
    },
    startedOrder: {
        backgroundColor: '#4CAF50', // Green for started orders
    },
    cancelledOrder: {
        backgroundColor: '#F44336', // Red for cancelled orders
    },
    orderText: {
        color: '#fff', // Text color for better contrast
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#0E8C6B',
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#4CAF50', // Green for start button
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#F44336', // Red for cancel button
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    button1: {
        alignItems: "center",
        backgroundColor: '#0E8C6B',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        width: "70%",
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
        width: 500
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
    tableHeader: {
        width: 400,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#0E8C6B',
        marginBottom: 15,


    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: "#fff"
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableCell: {
        flex: 1,
        fontSize: 16,
    },
    '@media (max-width: 768px)': {
        container: {
            padding: 10,
        },
        heading: {
            fontSize: 20,
        },
        orderContainer: {
            width: '95%',
        },
        button1: {
            width: "80%",
        },
        input: {
            width: '30%',
        },
        button: {
            fontSize: 20,
        },
        table: {
            width: '100%',
        },
        tableHeader: {
            width: '100%',
        },
        row: {
            width: '100%',
        },
    },
    '@media (max-width: 480px)': {
        heading: {
            fontSize: 18,
        },
        orderContainer: {
            width: '100%',
        },
        button1: {
            width: "100%",
        },
        input: {
            width: '40%',
        },
        button: {
            fontSize: 18,
        },
    },
    '@media (max-width: 320px)': {
        heading: {
            fontSize: 16,
        },
        orderContainer: {
            width: '100%',
        },
        button1: {
            width: "100%",
        },
        input: {
            width: '50%',
        },
        button: {
            fontSize: 16,
        },
    }


})