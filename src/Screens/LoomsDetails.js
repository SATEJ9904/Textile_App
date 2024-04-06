import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CheckBox from '@react-native-community/checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const LoomsDetails = ({ navigation }) => {


    const [Name, setName] = useState("");
    const [AppUserId, setAppUserId] = useState("")
    const [LoomOrTrader, SetLoomOrTrader] = useState("")
    const [id, setId] = useState("")

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

    const [isFocus3, setIsFocus3] = useState(false);
    const [isFocus4, setIsFocus4] = useState(false);
    const [isFocus5, setIsFocus5] = useState(false);
    const [isFocus6, setIsFocus6] = useState(false);


    const [rows, setRows] = useState([{ LoomTraderId: 69, LoomNo: null, MachineType: '', Width: '', RPM: '', SheddingType: '', NoofFrames: '', NoofFeeders: '', SelvageJacquard: false, TopBeam: false, Cramming: false, LenoDesignEquipment: false, Available: false }]);

    const addRow = () => {
        setRows([...rows, { LoomTraderId: 69, LoomNo: null, MachineType: '', Width: '', RPM: '', SheddingType: '', NoofFrames: '', NoofFeeders: '', SelvageJacquard: false, TopBeam: false, Cramming: false, LenoDesignEquipment: false, Available: false }]);
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
        newRows[index][fieldName] = text;
        setRows(newRows);
    
    };

    const handleSubmit = () => {
        const formdata = new FormData();
        formdata.append("Value", rows);

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


    const postAPI = () => {
     
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://textileapp.microtechsolutions.co.in/php/postloomdetail.php',
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : {
                'Value': rows,
            }
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });
         // console.log('Form submitted:', rows);

    }


    const Submit = () => {


        

        const qs = require('qs');
        let data = qs.stringify({
            'Value': rows
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://textileapp.microtechsolutions.co.in/php/postloomdetail.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
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
    }, [])

    return (
        <SafeAreaView>
            <View style={styles.header2}>
                <TouchableOpacity style={styles.header1} onPress={() => navigation.openDrawer()}>
                    <Image
                        style={{ width: "60%", height: "60%" }}
                        source={require("../Images/drawer.png")}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText1}>Loom Details</Text>
            </View>
            <View style={styles.container}>
                <Text style={{ color: "#000", fontSize: 25 }}>{id}</Text>
                <ScrollView horizontal={true}>
                    <View style={styles.table}>
                        <View style={styles.headerRow}>
                            <Text style={[styles.header, styles.fieldName]}>Loom No</Text>
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
                        </View>
                        {rows.map((row, index) => (
                            <View style={styles.row} key={index}>
                                <View style={styles.field}>
                                    <TextInput style={styles.input} value={row.LoomNo} keyboardType='number-pad' onChangeText={(text) => handleChange(text, index, 'LoomNo')} />
                                </View>
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
                                    <TextInput style={styles.input} value={row.Width} onChangeText={(text) => handleChange(text, index, 'Width')} />
                                </View>
                                <View style={styles.field}>
                                    <TextInput style={styles.input} value={row.RPM} onChangeText={(text) => handleChange(text, index, 'RPM')} />
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
                                        <Text style={{ fontSize: 17, color: "#000", marginLeft: 0 }}>yes</Text>
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
                                        <Text style={{ fontSize: 17, color: "#000", marginLeft: 0 }}>yes</Text>
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
                                        <Text style={{ fontSize: 17, color: "#000", marginLeft: 0 }}>yes</Text>
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
                                        <Text style={{ fontSize: 17, color: "#000", marginLeft: 0 }}>yes</Text>
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
                                        <Text style={{ fontSize: 17, color: "#000", marginLeft: 0 }}>yes</Text>
                                    </View>
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
                <TouchableOpacity onPress={postAPI} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={getData} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>refresh</Text>
                </TouchableOpacity>
            </View>
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
        backgroundColor: "#71B7E1",
        justifyContent: "space-between"
    },
    header1: {
        alignItems: "center",
        width: "20%",
        height: "100%",
        flexDirection: "row",
        backgroundColor: "#71B7E1",
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
        marginRight: 10,
        fontWeight: 'bold',
        minWidth: 100, // Adjust this value as needed
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
        backgroundColor: 'blue',
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