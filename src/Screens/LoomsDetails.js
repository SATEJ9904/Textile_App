import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, Button, RefreshControl, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CheckBox from '@react-native-community/checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import moment from 'moment';



const LoomsDetails = ({ navigation }) => {

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        getData()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

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

    const [Name, setName] = useState("");
    const [AppUserId, setAppUserId] = useState("")
    const [LoomOrTrader, SetLoomOrTrader] = useState("")
    const [id, setId] = useState(null);
    const [currentDate, setCurrentDate] = useState('');
    const [sixMonthsLaterDate, setSixMonthsLaterDate] = useState('');

    useEffect(() => {
        onRefresh();
        getData();
        //console.log(Name, AppUserId, LoomOrTrader, id)
        const fetchData = async () => {
            try {
              // Fetching the ID from AsyncStorage
              const storedId = await AsyncStorage.getItem('Id');
              if (storedId !== null) {
                setId(storedId);
                console.log(storedId)
              } else {
                console.log('No ID found in AsyncStorage');
              }
      
              // Setting current date
              const today = moment().format('YYYY-MM-DD');
              setCurrentDate(today);
      
              // Setting date six months later
              const sixMonthsLater = moment().add(6, 'months').format('YYYY-MM-DD');
              setSixMonthsLaterDate(sixMonthsLater);
            } catch (error) {
                console.error('Error fetching data from AsyncStorage or API', error);
              }
            }
            fetchData();
    }, [])



    const getData = async () => {
        const Name = await AsyncStorage.getItem("Name");
        const AppUserId = await AsyncStorage.getItem("AppUserId");
        const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader");
        const Id = await AsyncStorage.getItem("Id");

        setName(Name);
        setAppUserId(AppUserId);
        SetLoomOrTrader(LoomOrTrader);
        setId(parseInt(Id)); // Parse Id to integer
        console.log('ID', id);
        setRows((prevRows) =>
            prevRows.map((row) => ({ ...row, LoomTraderId: parseInt(Id) })) // Parse LoomTraderId to integer
        );
    };


    const [isFocus3, setIsFocus3] = useState(false);
    const [isFocus4, setIsFocus4] = useState(false);
    const [isFocus5, setIsFocus5] = useState(false);
    const [isFocus6, setIsFocus6] = useState(false);


    const [rows, setRows] = useState([{ LoomTraderId: id, LoomNo: null, MachineType: '', Width: '', RPM: '', SheddingType: '', NoofFrames: '', NoofFeeders: '', SelvageJacquard: false, TopBeam: false, Cramming: false, LenoDesignEquipment: false, Available: false,  NoOfLooms: null }]);

    const addRow = () => {
        setRows([...rows, { LoomTraderId: id, LoomNo: null, MachineType: '', Width: '', RPM: '', SheddingType: '', NoofFrames: '', NoofFeeders: '', SelvageJacquard: false, TopBeam: false, Cramming: false, LenoDesignEquipment: false, Available: false,NoOfLooms: null }]);
    };

    const removeRow = (index) => {
        if (rows.length > 1) {
            const newRows = [...rows];
            newRows.splice(index, 1);
            setRows(newRows);
        }
    };
    const handleChange = (text, index, fieldName) => {
        const newRows = [...rows];

        if (fieldName === 'SelvageJacquard' || fieldName === 'TopBeam' || fieldName === 'Cramming' || fieldName === 'LenoDesignEquipment' || fieldName === 'Available') {
            // For checkbox fields, set the value directly
            newRows[index][fieldName] = text;
        } else if (['LoomNo', 'NoOfLooms', 'Width', 'RPM', 'NoofFrames', 'NoofFeeders'].includes(fieldName)) {
            newRows[index][fieldName] = parseFloat(text) || null;
        } else {
            newRows[index][fieldName] = text.toString();
        }

        setRows(newRows);
    };


    const handleSubmit = () => {
        const formdata = new FormData();


        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/postloomdetail.php", requestOptions)
            .then((response) => response.toString())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        // // setRows([{ loomNo: '', machineType: '', width: '', rpm: '', sheddingType: '', noOfFrames: '', noOfFeeders: '', selvageJacquard: '', topBeam: '', cramming: '', lenoDesignEquipment: '', available: '' }]);
        console.log('Form submitted:', rows);
    };

    

    const postAPI = async (item) => {
        // Validate if all input fields are filled
        if (!isItemValid(item)) {
            console.log('Validation failed for item:', item);
            Alert.alert('Please fill out all fields before submitting.');
            return;
        }
    
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://textileapp.microtechsolutions.co.in/php/postloomdetail.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                'LoomTraderId': id,
                'LoomNo': item.LoomNo,
                'MachineType': item.MachineType,
                'Width': item.Width,
                'RPM': item.RPM,
                'SheddingType': item.SheddingType,
                'NoofFrames': item.NoofFrames,
                'NoofFeeders': item.NoofFeeders,
                'SelvageJacquard': item.SelvageJacquard,
                'TopBeam': item.TopBeam,
                'Cramming': item.Cramming,
                'LenoDesignEquipment': item.LenoDesignEquipment,
                'NoOfLooms': item.NoOfLooms,
                'Available': item.Available,
                'LoomAvailableFrom': currentDate,
                'LoomAvailableTo': sixMonthsLaterDate,
                'OrderNoId': null
            }
        };
    
        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                Alert.alert("Data Submitted Successfully")
            })
            .catch((error) => {
                console.log(error);
            });
        console.log('Form submitted:', item);
    }
    
    const isItemValid = (item) => {
        for (const key in item) {
            if (!item[key] && item[key] !== 0 && item[key] !== false) {
                return false;
            }
        }
        return true;
    }


    const HandleSubmitRows = () => {

        {
            rows.map((item) => {
                postAPI(item);
            })
        }
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
                .then(getData())
                .then(NOFds())
                .then(NOFRs())
                .then(Shedd())
                .then(mactype())
        }

        callfuns();
        handleDate();
    }, [])

    const [date, setDate] = useState()
    const [date2, setDate2] = useState()

    const handleDate = () => {
        const dt = new Date()
        const x = dt.toISOString().split('T');
        const x1 = x[0].split('-')
        setDate(x1[0] + '/' + x1[1] + '/' + x1[2]);
        let year = dt.getFullYear();
        let year1 = year + 1;
        setDate2(year1 + '/' + x1[1] + '/' + x1[2]);
    };


    return (
        <SafeAreaView style={{ height: "100%" }}>
            <View style={styles.header2}>
                <TouchableOpacity style={styles.header1} onPress={() => navigation.openDrawer()}>
                    <Image
                        style={{ width: "35%", height: "35%" ,marginLeft:"25%"}}
                        source={require("../Images/drawer1.png")}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText1}>Loom Details</Text>
            </View>
            <View >
            <Text style={{ color: 'black', fontSize: 20, padding: 10 }}>Loom Owner : {Name} </Text>
            </View>
            <View style={styles.container}>
                <ScrollView horizontal={true} contentContainerStyle={styles.scrollView}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <View style={styles.table}>
                        <View style={styles.headerRow}>
                            <Text style={[styles.header, styles.fieldName]}>Machine Type</Text>
                            <Text style={[styles.header, styles.fieldName]}>Width</Text>
                            <Text style={[styles.header, styles.fieldName]}>RPM</Text>
                            <Text style={[styles.header, styles.fieldName]}>Shedding Type</Text>
                            <Text style={[styles.header, styles.fieldName]}>No of Frames</Text>
                            <Text style={[styles.header, styles.fieldName]}>No of Feeders</Text>
                            <Text style={[styles.header, styles.fieldName]}>Selvage Jacquard</Text>
                            <Text style={[styles.header, styles.fieldName]}>Top Beam</Text>
                            <Text style={[styles.header, styles.fieldName]}>Cramming</Text>
                            <Text style={[styles.header, styles.fieldName]}>Leno Design</Text>
                            <Text style={[styles.header, styles.fieldName]}>Available</Text>
                            <Text style={[styles.header, styles.fieldName]}>Loom No</Text>
                            <Text style={[styles.header, styles.fieldName]}>No Of Looms</Text>


                        </View>
                        {rows.map((row, index) => (
                            <View style={styles.row} key={index}>

                                <View style={[styles.field, {}]}>
                                    <Dropdown
                                        style={[styles.dropdown, isFocus3 && { borderColor: 'blue', width: 150 }]}
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
                                        value={row.MachineType}
                                        onFocus={() => setIsFocus3(true)}
                                        onBlur={() => setIsFocus3(false)}
                                        onChange={(text) => handleChange(text.value, index, 'MachineType')} />

                                </View>
                                <View style={styles.field}>
                                <TextInput style={styles.input} placeholder='Width' placeholderTextColor={'#000'} value={row.Width} onChangeText={(text) => handleChange(text, index, 'Width')} />
                                </View>
                                <View style={styles.field}>
                                <TextInput style={styles.input} placeholder='RPM' placeholderTextColor={'#000'} value={row.RPM} onChangeText={(text) => handleChange(text, index, 'RPM')} />
                                </View>
                                <View style={styles.field}>
                                    <Dropdown
                                        style={[styles.dropdown, isFocus4 && { borderColor: 'blue', width: 150 }]}
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
                                        value={row.SheddingType}
                                        onFocus={() => setIsFocus4(true)}
                                        onBlur={() => setIsFocus4(false)}
                                        onChange={(text) => handleChange(text.value, index, 'SheddingType')} />
                                </View>
                                <View style={styles.field}>
                                    <Dropdown
                                        style={[styles.dropdown, isFocus5 && { borderColor: 'blue' }]}
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
                                        value={row.NoofFrames}
                                        onFocus={() => setIsFocus5(true)}
                                        onBlur={() => setIsFocus5(false)}
                                        onChange={(text) => handleChange(text.value, index, 'NoofFrames')} />
                                </View>
                                <View style={styles.field}>
                                    <Dropdown
                                        style={[styles.dropdown, isFocus6 && { borderColor: 'blue' }]}
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
                                        value={row.NoofFeeders}
                                        onFocus={() => setIsFocus6(true)}
                                        onBlur={() => setIsFocus6(false)}
                                        onChange={(text) => handleChange(text.value, index, 'NoofFeeders')} />
                                </View>
                                <View style={[styles.field, { flexDirection: "row", width: 150, justifyContent: "space-between" }]}>
                                    <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#000", width: 150, height: 50, justifyContent: "center", alignItems: "center" }}>
                                        <CheckBox
                                            tintColors={{ true: 'blue', false: 'black' }} // Change color when checked and unchecked
                                            tintColor="black" // Change the box color when unchecked
                                            onCheckColor="blue" // Change the check color when checked
                                            value={row.SelvageJacquard}
                                            onValueChange={(text) => handleChange(text, index, 'SelvageJacquard')}
                                        />
                                        <Text style={{ fontSize: 17, color: "#000", marginLeft: 0 }}>Available</Text>
                                    </View>

                                </View>
                                <View style={styles.field}>
                                    <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#000", width: 150, height: 50, justifyContent: "center", alignItems: "center" }}>
                                        <CheckBox
                                            tintColors={{ true: 'blue', false: 'black' }} // Change color when checked and unchecked
                                            tintColor="black" // Change the box color when unchecked
                                            onCheckColor="blue" // Change the check color when checked
                                            value={row.TopBeam}
                                            onValueChange={(text) => handleChange(text, index, 'TopBeam')}
                                        />
                                        <Text style={{ fontSize: 17, color: "#000", marginLeft: 0 }}>Available</Text>
                                    </View>
                                </View>
                                <View style={styles.field}>
                                    <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#000", width: 150, height: 50, justifyContent: "center", alignItems: "center" }}>
                                        <CheckBox
                                            tintColors={{ true: 'blue', false: 'black' }} // Change color when checked and unchecked
                                            tintColor="black" // Change the box color when unchecked
                                            onCheckColor="blue" // Change the check color when checked
                                            value={row.Cramming}
                                            onValueChange={(text) => handleChange(text, index, 'Cramming')}
                                        />
                                        <Text style={{ fontSize: 17, color: "#000", marginLeft: 0 }}>Available</Text>
                                    </View>
                                </View>
                                <View style={styles.field}>
                                    <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#000", width: 150, height: 50, justifyContent: "center", alignItems: "center" }}>
                                        <CheckBox
                                            tintColors={{ true: 'blue', false: 'black' }} // Change color when checked and unchecked
                                            tintColor="black" // Change the box color when unchecked
                                            onCheckColor="blue" // Change the check color when checked
                                            value={row.LenoDesignEquipment}
                                            onValueChange={(text) => handleChange(text, index, 'LenoDesignEquipment')}
                                        />
                                        <Text style={{ fontSize: 17, color: "#000", marginLeft: 0 }}>Available</Text>
                                    </View>
                                </View>
                                <View style={styles.field}>
                                    <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#000", width: 150, height: 50, justifyContent: "center", alignItems: "center" }}>
                                        <CheckBox
                                            tintColors={{ true: 'blue', false: 'black' }} // Change color when checked and unchecked
                                            tintColor="black" // Change the box color when unchecked
                                            onCheckColor="blue" // Change the check color when checked
                                            value={row.Available}
                                            onValueChange={(text) => handleChange(text, index, 'Available')}
                                        />
                                        <Text style={{ fontSize: 17, color: "#000", marginLeft: 0 }}>Yes</Text>
                                    </View>
                                </View>
                                <View style={styles.field}>


                                    <TextInput style={styles.input} placeholder='Loom No' placeholderTextColor={'#000'} value={row.LoomNo} keyboardType='number-pad' onChangeText={(text) => handleChange(text, index, 'LoomNo')} />
                                    <TextInput style={styles.input} placeholder='No Of Looms' placeholderTextColor={'#000'} value={row.NoOfLooms} keyboardType='number-pad' onChangeText={(text) => handleChange(text, index, 'NoOfLooms')} />

                                </View>
                                {/* <View style={styles.field}>
                                    <TextInput style={styles.input} value={row.Available} onChangeText={(text) => handleChange(text, index, 'Available')} />
                                </View> */}
                                {index !== 0 && (
                                    <TouchableOpacity onPress={() => removeRow(index)} style={styles.removeButton}>
                                        <Text style={styles.removeButtonText}>-</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}

                    </View>
                </ScrollView>
                <TouchableOpacity onPress={addRow} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={HandleSubmitRows} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={getData} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>refresh</Text>
                </TouchableOpacity>
            </View>
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
                                    navigation.navigate("NoInternet")
                                }
                            })}
                        </Text>

                    </View>
                </View> : null
            }
        </SafeAreaView>
    )
}

export default LoomsDetails

const styles = StyleSheet.create({
    header2: {
        alignItems: "center",
        width: '100%',
        height: 70,
        flexDirection: "row",
        backgroundColor: "#003c43",
        justifyContent: "space-between"
    },
    header1: {
        alignItems: "center",
        width: "20%",
        height: "100%",
        flexDirection: "row",
        backgroundColor: "#003c43",
        justifyContent: "space-between"
    },
    headerText1: {
        color: "#fff",
        fontSize: 23,
        fontWeight: "600",
        marginRight: "30%"
    },
    container: {
        marginTop: 50,
        alignItems: 'center',
    },
    table: {
        marginTop: 10,
    },
    headerRow: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingBottom: 5,
        width: 1800
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingBottom: 5,
    },
    header: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fieldName: {
        marginRight: 50,
        fontWeight: 'bold',
        minWidth: 100,
        color: "#000"// Adjust this value as needed
    },
    inputLabel: {
        flex: 0,
    },
    input: {
        borderWidth: 1,
        paddingHorizontal: 5,
        width: 150
    },
    removeButton: {
        backgroundColor: 'red',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: 'green',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#003c43',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    dropdown: {
        height: 50,
        borderColor: '#000',
        borderWidth: 1,
        paddingHorizontal: 5,
        width: 150
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
        fontSize: 15,
        color: "#000"
    },
    selectedTextStyle: {
        color: "#000"
    },
    iconStyle: {
        width: 40,
        height: 30,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 17,
    },
})