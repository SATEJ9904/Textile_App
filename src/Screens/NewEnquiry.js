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


const NewEnquiry = ({ navigation }) => {


    const [isFocus3, setIsFocus3] = useState(false);
    const [isFocus4, setIsFocus4] = useState(false);
    const [isFocus5, setIsFocus5] = useState(false);
    const [isFocus6, setIsFocus6] = useState(false);
    const [showDateFrom, setShowDateFrom] = useState(false)
    const [showDateTo, setShowDateTo] = useState(false)
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [datefrom, setDateFrom] = useState(new Date());
    const [dateto, setDateTo] = useState(new Date());
    const [updatedDateFrom, setUpdatedDateFrom] = useState("")
    const [updatedDateTo, setUpdatedDateTo] = useState("")
    const [modefrom, setModeFrom] = useState("date");
    const [modeto, setModeTo] = useState("date");
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
    const [modalVisible2, setModalVisible2] = useState(false);
    const width1 = Dimensions.get('window');


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



    const showModefrom = (currentMode) => {
        setShowDateFrom(true);
        setModeFrom(currentMode);

    }

    const showModeto = (currentMode) => {
        setShowDateTo(true);
        setModeTo(currentMode)
    }


    const yesbutton = () => {
        setModalVisible2(false)
        setModalVisible(false)
        navigation.navigate("PlanLooms")
        setDesignPaper(null)
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

    const [showDate, setShowDate] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');

    const showDatePicker = () => {
        setShowDate(true);
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || selectedDate;
        setShowDate(Platform.OS === 'ios');
        setSelectedDate(currentDate);
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
        setFormattedDate(formattedDate);
    };


    const [EnquiryId, setEnquiryId] = useState("")

    const handleSubmit = (calculatedResult) => {

        if (!updatedDateFrom || !updatedDateTo || !calculatedResult || !fabricLength || !numLoomsRequired || !jobRateOffered || !fabricWidth || !machineType || !sheddingType || !width || !rpm || !numFrames || !numFeeders) {
            Alert.alert(" Please insert all fields")
        } else {


            console.log("Fabric Quality = ", calculatedResult)

            const formdata = new FormData();
            formdata.append("EnquiryDate", TodaysDate);
            formdata.append("TraderId", id);
            formdata.append("BookingFrom", updatedDateFrom);
            formdata.append("BookingTo", updatedDateTo);
            formdata.append("FabricQuality", calculatedResult);
            formdata.append("FabricLength", fabricLength);
            formdata.append("LoomRequired", numLoomsRequired);
            formdata.append("AgentName", dalalAgent);
            formdata.append("OfferedJobRate", jobRateOffered);
            formdata.append("FabricWidth", fabricWidth);
            formdata.append("DeliveryDate", formattedDate);
            formdata.append("Description", description);
            if (designPaper && designPaper.path) {
                formdata.append('Photopath', {
                    uri: designPaper.path,
                    type: "image/jpg",
                    name: "designPaper.jpg",
                });
            } else {
                formdata.append('Photopath', null);
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
        setModalVisible2(true)
        ClearData()
    }

    const ClearData = () => {
        setNumLoomsRequired("")
        setMachineType("")
        setWidth("")
        setRpm("")
        setSheddingType("")
        setNumFrames("")
        setNumFeeders("")
        setSelvadgeJacquard("")
        setTopBeam("")
        setCramming("")
        setLenoDesign("")
        setJobRateOffered("")
        setUpdatedDateFrom("")
        setUpdatedDateTo("")
        setEpi("")
        setPpi("")
        setWarpCount("")
        setWeftCount("")
        setPanna("")
        setFabricLength("")
        setDalalAgent("")
        setFormattedDate("")
        setDescription("")
        setDesignPaper(null)
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
            const epiValue = epi;
            const ppiValue = ppi;
            const warpCountValue = warpCount;
            const weftCountValue = weftCount;
            const pannaValue = panna;

            if (epiValue && ppiValue && warpCountValue && weftCountValue && pannaValue) {
                const calculatedResult = (epiValue + "*" + ppiValue + "/" + warpCountValue + "*" + weftCountValue + ":" + pannaValue);
                handleSubmit(calculatedResult)
            } else {
                setResult('Invalid input in fabric quality');
            }
        }


    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

            <StatusBar backgroundColor={"#003C43"}></StatusBar>
            <View style={{ backgroundColor: "#003C43", flexDirection: "row", alignItems: 'center', height: 50 }}>

                <TouchableOpacity
                    onPress={() => navigation.navigate("PlanLooms")}
                >
                    <Image
                        source={require("../Images/back.png")}
                        style={{ width: 28, height: 22, marginLeft: 10, }}

                    />
                </TouchableOpacity>


                <View style={{ flex: 0.9, alignItems: 'center' }}>
                    <Text style={{ fontSize: 26, color: "white", fontWeight: 500 }}>  Plan Looms </Text>
                </View>

            </View>
            <ScrollView>
                <View style={styles.containerform}>

                    {/* Date Fields */}
                    <View style={{ flexDirection: "column", justifyContent: "space-evenly" }}>
                        <Text style={{ marginTop: "3%", fontSize: 20, marginLeft: "0%", color: "#000" }}>Date : {TodaysDate}</Text>

                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ marginTop: "3%", fontSize: 20, marginLeft: "0%", marginTop: "8%", color: "#000" }}>From :<Text style={styles.redText}>*  </Text></Text>
                            <TextInput
                                style={[styles.input, { width: "60%", marginTop: "5%" }]}
                                value={updatedDateFrom}
                                onChangeText={setFromDate}
                                placeholder="From Date   "
                                keyboardType="numeric"
                                placeholderTextColor={"grey"}

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
                            <Text style={{ marginTop: "3%", fontSize: 20, marginLeft: "0%", paddingRight: "5%", color: "#000" }}>To  :<Text style={styles.redText}>*  </Text> </Text>

                            <TextInput
                                style={[styles.input, { width: "60%" }]}
                                value={updatedDateTo}
                                onChangeText={setToDate}
                                placeholder="To Date    "
                                placeholderTextColor={"grey"}
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

                        <View>
                            <Text style={{ marginTop: "1%", fontSize: 20, marginLeft: "0%", paddingRight: "5%", color: "#000", marginBottom: "2%" }}>Delivery Date  : <Text style={styles.redText}>*</Text> </Text>

                            <View style={{ flexDirection: "row", marginLeft: "15%" }}>
                                <TextInput
                                    style={[styles.input, { width: "70%" }]}
                                    value={formattedDate}
                                    editable={false}
                                    placeholder="Delivery Date    "
                                    placeholderTextColor={"grey"}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity onPress={showDatePicker}>
                                    <ImageBackground
                                        source={require('../Images/calendar.png')}
                                        style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#006A4E", marginLeft: "20%" }}
                                        imageStyle={{ borderRadius: 0 }}
                                    />
                                </TouchableOpacity>
                            </View>
                            {showDate && (
                                <DateTimePicker
                                    testID='dateTimePicker'
                                    value={selectedDate}
                                    mode='date'
                                    is24Hour={true}
                                    display='default'
                                    onChange={handleDateChange}
                                />
                            )}


                        </View>


                    </View>

                    <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%" }}>Fabric Quality :- <Text style={styles.redText}>*</Text> </Text>
                    <View style={styles.fabricQuality}>

                        <TextInput
                            style={styles.fabricDetails}
                            placeholder="Reed"
                            keyboardType="default"
                            placeholderTextColor={"grey"}
                            value={epi}
                            onChangeText={setEpi}
                        />
                        <Text style={{ marginTop: "3%", fontSize: 20, color: "#000" }}> * </Text>
                        <TextInput
                            style={styles.fabricDetails}
                            placeholder="PPI"
                            keyboardType="default"
                            placeholderTextColor={"grey"}
                            value={ppi}
                            onChangeText={setPpi}
                        />
                        <Text style={{ marginTop: "3%", fontSize: 20, color: "#000" }}> / </Text>
                        <TextInput
                            style={styles.fabricDetails}
                            placeholder='Warp Count'
                            keyboardType="default"
                            placeholderTextColor={"grey"}
                            value={warpCount}
                            onChangeText={setWarpCount}
                        />
                        <Text style={{ marginTop: "3%", fontSize: 20, color: "#000" }}> * </Text>
                        <TextInput
                            style={styles.fabricDetails}
                            placeholder="Weft Count"
                            keyboardType="default"
                            placeholderTextColor={"grey"}
                            value={weftCount}
                            onChangeText={setWeftCount}
                        />
                        <Text style={{ marginTop: "3%", fontSize: 20, color: "#000" }}> : </Text>
                        <TextInput
                            style={styles.fabricDetails}
                            placeholder="Reed Space"
                            keyboardType="default"
                            placeholderTextColor={"grey"}
                            value={panna}
                            onChangeText={setPanna}
                        />


                    </View>



                    <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%" }}>Fabric Length :- <Text style={styles.redText}>*</Text> </Text>
                    <TextInput

                        style={styles.input}
                        value={fabricLength}
                        onChangeText={setFabricLength}
                        placeholder="Total Fabric Length (in meters)"
                        keyboardType="numeric"
                        placeholderTextColor={"grey"}

                    />
                    <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%" }}>Fabric Width :- <Text style={styles.redText}>*</Text> </Text>
                    <View style={{ flexDirection: "row", marginTop: "2%" }}>

                        <TextInput
                            style={[styles.input, { width: "100%" }]}
                            value={fabricWidth}
                            onChangeText={setFabricWidth}
                            placeholder="Fabric Width (In inches)"
                            keyboardType="numeric"
                            placeholderTextColor={"grey"}
                        />
                    </View>

                    <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%" }}>Agent Name :-</Text>
                    <TextInput
                        style={[styles.input, { width: "100%" }]}
                        value={dalalAgent}
                        onChangeText={(txt) => setDalalAgent(txt)}
                        placeholder="Dalal / Agent Name"
                        keyboardType='default'
                        placeholderTextColor={"grey"}
                    />


                    <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%" }}>Machine Type :- <Text style={styles.redText}>*</Text> </Text>
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

                    <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%" }}>Machine Width :- <Text style={styles.redText}>*</Text> </Text>
                    <View style={{ flexDirection: "row", marginTop: "2%" }}>
                        <TextInput
                            style={[styles.input, { width: "100%" }]}
                            value={width}
                            onChangeText={setWidth}
                            placeholder="Machine Width In CM"
                            keyboardType="numeric"
                            placeholderTextColor={"grey"}

                        />
                    </View>


                    <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%" }}>RPM:- <Text style={styles.redText}>*</Text> </Text>
                    <TextInput
                        style={styles.input}
                        value={rpm}
                        onChangeText={setRpm}
                        placeholder="RPM"
                        keyboardType="numeric"
                        placeholderTextColor={"grey"}

                    />

                    <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%" }}>Shedding Type :- <Text style={styles.redText}>*</Text> </Text>
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

                    <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%" }}>No Of Feeders :- <Text style={styles.redText}>*</Text> </Text>
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


                    <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%" }}>No Of Frames :- <Text style={styles.redText}>*</Text> </Text>
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


                    <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%" }}>No Of Looms Required :- <Text style={styles.redText}>*</Text> </Text>
                    <TextInput
                        style={styles.input}
                        value={numLoomsRequired}
                        onChangeText={setNumLoomsRequired}
                        placeholder="No. of Looms Required"
                        keyboardType="numeric"
                        placeholderTextColor={"grey"}

                    />


                    <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%" }}>Job Rate:- <Text style={styles.redText}>*</Text> </Text>
                    <View style={{ flexDirection: "row" }}>
                        <TextInput
                            style={[styles.input, { width: "100%" }]}
                            value={jobRateOffered}
                            onChangeText={setJobRateOffered}
                            placeholder="Job Rate Offered (In Paisa)"
                            keyboardType="numeric"
                            placeholderTextColor={"grey"}
                        />
                    </View>


                    <View style={{
                        borderWidth: 1.5,
                        borderColor: "#000",
                        margin: "2%",
                        justifyContent: "center",
                        alignItems: "center",

                    }}>
                        <Text style={{ color: "#003C43", fontSize: 20, fontWeight: "600", margin: "5%" }}>Other Loom Attachments</Text>
                        <View style={styles.checkboxContainer}>

                            <Text style={{ marginRight: "12%", fontSize: 17, color: "#000" }}>Selvadge Jacquard</Text>
                            <CheckBox
                                tintColors={{ true: 'blue', false: 'black' }} // Change color when checked and unchecked
                                tintColor="black" // Change the box color when unchecked
                                onCheckColor="blue" // Change the check color when checked
                                value={selvadgeJacquard}
                                onValueChange={setSelvadgeJacquard}
                            />
                            <Text style={{ fontSize: 17, color: "#000" }}>Required</Text>

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
                            <Text style={{ fontSize: 17, color: "#000" }}>Required</Text>
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
                            <Text style={{ fontSize: 17, color: "#000" }}>Required</Text>

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
                            <Text style={{ fontSize: 17, color: "#000" }}>Required</Text>

                        </View>
                    </View>


                    <View style={{ marginTop: "0%" }}>
                        <Text style={{ marginRight: "3%", fontSize: 17, color: "#000", marginBottom: "2%", marginVertical: "3%", fontWeight: "600" }}>Description (Optional)</Text>

                        <TextInput
                            style={[styles.input, { width: "100%" }]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Description"
                            keyboardType='default'
                            placeholderTextColor={"grey"}
                            multiline={true} // Allows multiple lines of input
                            numberOfLines={5}
                        />
                    </View>



                    <View style={{ flexDirection: "column", marginVertical: "5%", marginTop: "5%" }}>
                        <Text style={{ color: "#000", fontSize: 18 }}>Upload Design Paper (Optional)</Text>
                        <View style={{ flexDirection: "row" }}>
                            {designPaper && (
                                <ImageBackground
                                    source={{ uri: designPaper.path }}
                                    style={{ width: 100, height: 100, margin: 10, marginTop: "10%" }}
                                />
                            )}
                            {
                                designPaper ? null : <TouchableOpacity onPress={openCamera}>
                                    <ImageBackground
                                        source={require('../Images/camera.png')}
                                        style={{ width: 34, height: 30, alignSelf: 'flex-start', marginLeft: "20%" }}
                                        imageStyle={{ borderRadius: 0 }}
                                    />
                                </TouchableOpacity>
                            }
                        </View>

                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: "5%" }}>
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible2(!modalVisible2);
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
                                onPress={() => yesbutton(!modalVisible2)}>
                                <Text style={styles.textStyle1}>Close</Text>
                            </Pressable>

                        </View>
                    </View>
                </View>
            </Modal>

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

export default NewEnquiry

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
        width: width * 0.85,
        flexDirection: "row",
        marginLeft:"-1%"
    },
    fabricDetails: {
        flex: 2,
        height: height * 0.05,
        width: width * 0.12,
        borderColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: height * 0.02,
        fontSize: 15,
        color: "#000",
        fontWeight: "800",
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
    redText: {
        color: 'red',
        fontSize: 24, // You can adjust the size as needed
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