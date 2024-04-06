import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { getAllCountries, getStatesOfCountry, getCitiesOfState, Country, State, City } from 'country-state-city';
import { Dropdown } from 'react-native-element-dropdown';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';



const Signup = ({ navigation }) => {

    const [Email, setEmail] = useState('');
    const [UserId, setUserId] = useState("");
    const [Password, setPassword] = useState('');
    const [loomShade, setLoomShade] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [gstNo, setGstNo] = useState('');
    const [registrationNo, setRegistrationNo] = useState('');
    const [ownercontactDetails, setOwnerContactDetails] = useState('');
    const [managercontactDetails, setManagerContactDetails] = useState('');
    const [otherscontactDetails, setOthersContactDetails] = useState('');
    const [primaryContactNo, setPrimaryContactNo] = useState('');
    const [TotalNoOfLooms, setTotalNoOfLooms] = useState("");
    const [LoomOrTrader, setLoomOrTrader] = useState(null);
    const [value, setValue] = useState(null);
    const [value2, setValue2] = useState(null);
    const [value3, setValue3] = useState(null);
    const [isFocus, setIsFocus] = useState("")
    const [isFocus2, setIsFocus2] = useState("")
    const [isFocus3, setIsFocus3] = useState("")
    const [selectedOption, setSelectedOption] = useState('');
    const [show, setShow] = useState("")
    const [show1, setShow1] = useState("")
    const [show3, setShow3] = useState(true)
    const [show2, setShow2] = useState(false)


    const showToast = () => {
        ToastAndroid.show("Account Created Successfully", ToastAndroid.SHORT);
    };

    const showToast1 = () => {
        ToastAndroid.show("Details Inserted Successfully", ToastAndroid.SHORT);
    };

    const showToast2 = () => {
        ToastAndroid.show("Data Inserted Successfully", ToastAndroid.SHORT);
    };


    const dataArray = [ownercontactDetails, managercontactDetails, otherscontactDetails];


    const postAPI = () => {
        setShow2(true)

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://textileapp.microtechsolutions.co.in/php/postappuser.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                'AppUserId': Email,
                'Name': loomShade,
                'Password': Password,
            }
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                showToast();
            })
            .catch((error) => {
                console.log(error);

            });
        setShow2(false)
        setShow(true)

        setShow3(false)
    }


    const postDetails = () => {
        setShow2(true)
        console.log(Email, loomShade, ownerName, gstNo, address, pincode, value, value2, value3, registrationNo, primaryContactNo, "Total no", TotalNoOfLooms)
        try {
            const formdata = new FormData();
            formdata.append("AppUserId", Email);
            formdata.append("Name", loomShade);
            formdata.append("OwnerName", ownerName);
            formdata.append("GSTNumber", gstNo);
            formdata.append("Address", address);
            formdata.append("Pincode", pincode);
            formdata.append("Country", value);
            formdata.append("State", value2);
            formdata.append("City", value3);
            formdata.append("RegistrationNumber", registrationNo);
            formdata.append("PrimaryContact", primaryContactNo);
            formdata.append("TotalLooms", TotalNoOfLooms);
            formdata.append("LoomOrTrader", "L");

            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };

            fetch("https://textileapp.microtechsolutions.co.in/php/postdetail.php", requestOptions)
                .then((response) => response.text())
                .then((result) => setUserId(result))
                .catch((error) => console.error(error));
            setShow(false)
            setShow1(true)
            setShow2(false)
            console.log("UserId : ", UserId)
        } catch (err) {
            console.log("Error : ", err)
        }
    }




    const getContact = () => {
        setShow2(true)

        try {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://textileapp.microtechsolutions.co.in/php/postcontact.php',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {

                    "LoomTraderDetailId": UserId,
                    "OwnerNo": ownercontactDetails,
                    'ManagerNo': managercontactDetails,
                    'OtherNo':otherscontactDetails
                }
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    showToast2();
                })
                .catch((error) => {
                    console.log(error);

                });
             navigation.navigate("Login")
             setShow(false)
             setShow1(true)
            setShow2(false)

            console.log("Contact Number",dataArray, "Designation",selectedOption, "LoomTraderDetailId",UserId)
        } catch (err) {
            console.log("Error :", err)
        }
    }



    const send = () => {

        if (!Email,
            !Password,
            !value,
            !value3,
            !value2,
            !loomShade,
            !ownerName,
            !address,
            !gstNo,
            !selectedOption,
            !registrationNo,
            !contactDetails,
            !primaryContactNo) {
            handleEmailChange()
            Alert.alert("Please Insert Details Properly")

        } else {
            let data = JSON.stringify({
                "AppUserId": Email,
                "Password": Password,
                "Name": loomShade,
                "OwnerName": ownerName,
                "GSTNumber": gstNo,
                "Address": address,
                "Pincode": pincode,
                "Country": value,
                "State": value2,
                "City": value3,
                "RegistrationNumber": registrationNo,
                "contactDetails": contactDetails,
                "PrimaryContact": primaryContactNo
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://textileapp.microtechsolutions.co.in/php/postdetail.php',
                headers: {
                    'Content-Type': 'application/json'
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

    };





    const countries = Country.getAllCountries().map(Country => ({ label: Country.name, value: Country.isoCode }));
    const states = State.getAllStates().map(State => ({ label: State.name, value: State.name }));
    const cities = City.getAllCities().map(City => ({ label: City.name, value: City.name }));



    return (
        <View style={styles.container}>

            <LinearGradient style={{
                flex: 1,
                width: "180%",
                justifyContent: "center",
                alignItems: "center"
            }}
                colors={["#16E2F5", "#16E2F5", "#0059FF", "#0059FF", "#0000A0",]}>

                <ScrollView>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => { setShow(true), setShow1(false), setShow2(false), setShow3(false) }}>
                            <Image
                                style={{ width: 40, height: 40, marginTop: 20 }}
                                source={require("../Images/back.png")}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 35, color: "#fff", marginTop: "5%", marginLeft: "20%", fontWeight: "800" }}>Sign Up </Text>
                    </View>


                    <Image
                        style={{ height: "20%", width: "120%", borderRadius: 0, marginLeft: "10%", marginTop: "15%" }}
                        source={require("../Images/logoweave.png")}

                    />
                    <TouchableOpacity onPress={() => handleEmailChange()}>
                        <Text style={{ fontSize: 35, color: "#fff", marginTop: "10%", marginLeft: "35%", fontWeight: "800" }}></Text>
                    </TouchableOpacity>



                    {/* https://textileapp.microtechsolutions.co.in/php/getappuser.php */}



                    {show3 ? <View>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>


                            <TextInput
                                placeholder='Email'
                                placeholderTextColor={"#000"}
                                style={[styles.input, styles.input1]}
                                onChangeText={(txt) => setEmail(txt)}
                                value={Email}
                            />


                            <TextInput
                                placeholder='Password'
                                placeholderTextColor={"#000"}
                                style={[styles.input]}
                                onChangeText={(txt) => setPassword(txt)}
                                value={Password}
                            />


                            <TextInput
                                placeholder='Name of Loom Shade'
                                placeholderTextColor={"#000"}
                                style={[styles.input]}
                                onChangeText={(txt) => setLoomShade(txt)}
                                value={loomShade}
                            />

                            <View style={{ flex: 1 }}>
                                {
                                    show2 ? <ActivityIndicator size={70} color="green" /> : null
                                }
                            </View>


                        </View>
                        <TouchableOpacity style={styles.loginButton} onPress={() => postAPI()}>
                            <Text style={styles.loginText}>Submit</Text>
                        </TouchableOpacity>
                    </View> : null}





                    {/* https://textileapp.microtechsolutions.co.in/php/getdetail.php */}


                    {
                        show ? <View>
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>


                                <Text style={{ color: "#fff", fontSize: 22, marginTop: "5%" }}> Welcome:  {loomShade}</Text>


                                <TextInput
                                    placeholder='Name of Owner'
                                    placeholderTextColor={"#000"}
                                    style={[styles.input, { marginTop: "15%" }]}
                                    onChangeText={(txt) => setOwnerName(txt)}
                                    value={ownerName}
                                />

                                <TextInput
                                    placeholder='GST No.'
                                    placeholderTextColor={"#000"}
                                    style={styles.input}
                                    onChangeText={(txt) => setGstNo(txt)}
                                    value={gstNo}
                                />

                                <Dropdown
                                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
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
                                    value={value}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item => {
                                        setValue(item.value);
                                        setIsFocus(false);
                                    }} />

                                <Dropdown
                                    style={[styles.dropdown, isFocus2 && { borderColor: 'blue' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={states}
                                    search
                                    itemTextStyle={{ color: "#000" }}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus2 ? 'Select State' : '...'}
                                    searchPlaceholder="Search..."
                                    value={value2}
                                    onFocus={() => setIsFocus2(true)}
                                    onBlur={() => setIsFocus2(false)}
                                    onChange={item => {
                                        setValue2(item.value);
                                        setIsFocus2(false);
                                    }} />

                                <Dropdown
                                    style={[styles.dropdown, isFocus3 && { borderColor: 'blue' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={cities}
                                    search
                                    itemTextStyle={{ color: "#000" }}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus3 ? 'Select City' : '...'}
                                    searchPlaceholder="Search..."
                                    value={value3}
                                    onFocus={() => setIsFocus3(true)}
                                    onBlur={() => setIsFocus3(false)}
                                    onChange={item => {
                                        setValue3(item.value);
                                        setIsFocus3(false);
                                    }} />


                                <View style={{ flex: 1 }}>
                                    {
                                        show2 ? <ActivityIndicator size={70} color="green" /> : null
                                    }
                                </View>

                                <TextInput
                                    placeholder='Address'
                                    placeholderTextColor={"#000"}
                                    style={styles.input}
                                    onChangeText={(txt) => setAddress(txt)}
                                    value={address}
                                />
                                <TextInput
                                    placeholder='Pincode'
                                    placeholderTextColor={"#000"}
                                    style={styles.input}
                                    onChangeText={(txt) => setPincode(txt)}
                                    value={pincode}
                                />

                                <TextInput
                                    placeholder='Total No Of Looms'
                                    placeholderTextColor={"#000"}
                                    style={[styles.input, { marginTop: "5%" }]}
                                    onChangeText={(txt) => setTotalNoOfLooms(txt)}
                                    value={TotalNoOfLooms}
                                />

                                <TextInput
                                    placeholder='Registration No.'
                                    placeholderTextColor={"#000"}
                                    style={styles.input}
                                    onChangeText={(txt) => setRegistrationNo(txt)}
                                    value={registrationNo}
                                />



                                <TextInput
                                    placeholder='Primary/Operational Contact No.'
                                    placeholderTextColor={"#000"}
                                    style={[styles.input, { marginTop: "5%" }]}
                                    onChangeText={(txt) => setPrimaryContactNo(txt)}
                                    value={primaryContactNo}
                                />
                            </View>


                            <TouchableOpacity style={styles.loginButton} onPress={() => postDetails()}>
                                <Text style={styles.loginText}>Submit</Text>
                            </TouchableOpacity>
                        </View> : null
                    }


                    {/* https://textileapp.microtechsolutions.co.in/php/getcontact.php */}


                    {show1 ?
                        <View>
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>

                                <Text style={{ color: "#fff", fontSize: 22, marginTop: "5%" }}> Welcome:  {loomShade}</Text>

                                <Text style={{ fontSize: 20, color: "#fff", marginLeft: "-40%", marginTop: "10%" }}>Add Contact Details : </Text>


                                <TextInput
                                    placeholder='Owner Contact Details'
                                    placeholderTextColor={"#fff"}
                                    style={[styles.input, { marginTop: "10%" }]}
                                    onChangeText={(txt) => setOwnerContactDetails(txt)}
                                    value={ownercontactDetails}
                                />

                                <TextInput
                                    placeholder='Manager Contact Details'
                                    placeholderTextColor={"#fff"}
                                    style={styles.input}
                                    onChangeText={(txt) => setManagerContactDetails(txt)}
                                    value={managercontactDetails}
                                />

                                <TextInput
                                    placeholder='Others Contact Details'
                                    placeholderTextColor={"#fff"}
                                    style={styles.input}
                                    onChangeText={(txt) => setOthersContactDetails(txt)}
                                    value={otherscontactDetails}
                                />


                                <View style={{ flex: 1 }}>
                                    {
                                        show2 ? <ActivityIndicator size={70} color="green" /> : null
                                    }
                                </View>

                                {/* <View style={{ marginLeft: "-20%", marginTop: "5%" }}>
                                    <Text style={{ fontSize: 18, color: "#fff" }}>Select Role:</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "20%" }}>
                                        <RadioButton
                                            value="owner"
                                            status={selectedOption === 'owner' ? 'checked' : 'unchecked'}
                                            onPress={() => setSelectedOption('owner')}
                                        />
                                        <Text style={{ fontSize: 18, color: "#fff" }}>Owner</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "20%" }}>
                                        <RadioButton
                                            value="manager"
                                            status={selectedOption === 'manager' ? 'checked' : 'unchecked'}
                                            onPress={() => setSelectedOption('manager')}
                                        />
                                        <Text style={{ fontSize: 18, color: "#fff" }}>Manager</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "20%" }}>
                                        <RadioButton
                                            value="others"
                                            status={selectedOption === 'others' ? 'checked' : 'unchecked'}
                                            onPress={() => setSelectedOption('others')}
                                        />
                                        <Text style={{ fontSize: 18, color: "#fff" }}>Others</Text>
                                    </View>

                                </View> */}



                            </View>

                            <TouchableOpacity style={[styles.loginButton, { marginTop: "5%" }]} onPress={() => getContact()}>
                                <Text style={styles.loginText}>Submit</Text>
                            </TouchableOpacity>
                        </View> : null}



                    <Text style={{ marginTop: "80%" }}></Text>
                </ScrollView>
            </LinearGradient>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DEB887',
        width: '100%',
    },
    input: {
        color: "#fff",
        borderBottomWidth: 1.5,
        borderBottomColor: '#fff',
        borderColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '80%',
    },
    input1: {
        marginTop: '5%',
    },
    loginButton: {
        width: '40%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginLeft: '30%',
        marginTop: '15%',
    },
    loginText: {
        color: '#0000A0',
        fontWeight: 'bold',
        fontSize: 21,
    },
    dropdown: {
        width: "80%",
        height: 50,
        borderColor: '#fff',
        borderBottomWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 8,
        color: "black",
        marginBottom: 10,
        textDecorationColor: "grey",
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
        color: "#FFF"
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

});

export default Signup
