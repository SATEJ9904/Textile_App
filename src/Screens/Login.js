import React, { useState } from 'react';
import { ToastAndroid, Text, ActivityIndicator, TextInput, Alert, StyleSheet, Image, View, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedLoader from 'react-native-animated-loader';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Login = ({ navigation }) => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(0);
    const [visible, setVisible] = useState(false)
    const dataArray = [Email, Password];
    const [otp, setOtp] = useState('');
    const [newpassword, setNewpassword] = useState('');


    const validateInputs = () => {
        if (!Email || !Password) {
            Alert.alert("Please fill in all the fields");
            return false;
        }else{
            NewLogin()
        }
        return true;
    }

    const clear = () => {
        setEmail(""),
            setPassword("")
    }

    const checkcrediantials = () => {
        console.log("Started")

        if (!Email, !Password) {
            Alert.alert("! Please Fillup Crediantials Properly")
        } else {
            getAPIData();
        }
        console.log("Ended")
    }



    const getAPIData = async () => {
        try {
            const url = "https://textileapp.microtechsolutions.co.in/php/getappuser.php";
            let result = await fetch(url);
            result = await result.json();

            result.length ? result.map((item) => {
                (() => {

                    if (Email === item.AppUserId && Password === item.Password) {
                        console.log("successful")
                        console.log(item.id)
                        navigation.navigate("Data", { item1: item })
                        clear();
                    } else {
                    }
                })()
            }
            ) : null
        } catch (error) {
            console.log("Error", error)
        }
        setShow(false);
    }

    const [response, setResponse] = useState([])


    const NewLogin = () => {
        const qs = require('qs');
        let data = qs.stringify({
            'AppUserId': Email,
            'Password': Password,
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://textileapp.microtechsolutions.co.in/php/postlogin.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(response.data.Name)
                let item = response.data
                navigation.navigate("Data", { item1: item })
                console.log("Login Name", item.AppUserId)
            })
            .catch((error) => {
                console.log(error);
            });
    }


    const verifyotp = async () => {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://textileapp.microtechsolutions.co.in/php/verifyotp.php?otp=' + otp,
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setShow1(2);
            })
            .catch((error) => {
                console.log(error);
            });

    }


    const handleLogin = () => {
        setShow(true);
        if (!Email) {
            Alert.alert("Please Insert Your Email")
            setShow(false);
        } else if (!Password) {
            Alert.alert("Please Insert Your Password")
            setShow(false);
        } else {
            getAPIData();
        }
    };

    const reset = () => {
        const qs = require('qs');
        let data = qs.stringify({
            'AppUserId': Email,
            'Password': newpassword,
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://textileapp.microtechsolutions.co.in/php/updatepassword.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(response.data)
                setShow1(0)
            })
            .catch((error) => {
                console.log(error);
            });
    }




    return (
        <SafeAreaView style={styles.container}>


            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.8 }}
                style={{ flex: 1, }}
                colors={["#003C43", "#77B0AA"]}>


                <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        style={{
                            height: "100%",
                            width: "120%",
                            marginLeft: 20,
                            // backgroundColor: '#003C43',
                        }}
                        source={require("../Images/company.png")}

                    />

                    {
                        show ? <AnimatedLoader
                            visible={true}
                            overlayColor="rgba(255,255,255,0.75)"
                            animationStyle={styles.lottie}
                            speed={5}
                        /> : null
                    }
                </View>

                <View style={{ flex: 1.5, backgroundColor: 'white', borderTopLeftRadius: 60, borderTopRightRadius: 60 }}>

                    {(() => {

                        if (show1 === 1) {
                            return (
                                <View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{
                                            fontSize: 35,
                                            color: "#003C43",
                                            marginTop: '15%',
                                            fontWeight: "700"
                                        }}> Verify OTP </Text>

                                        <View style={styles.input}>


                                            <Icon name="form-textbox-password" color="#003C43" size={32} padding={8} marginLeft={8} />

                                            <TextInput
                                                style={{ marginLeft: "5%", color: "black", width: "70%" }}
                                                placeholder='OTP'
                                                placeholderTextColor={"#003C43"}
                                                onChangeText={(txt) => setOtp(txt)}
                                                value={otp}

                                            />
                                        </View>


                                        <TouchableOpacity
                                            style={{ width: "70%", marginTop: "8%", borderRadius: 20, backgroundColor: "#003C43", justifyContent: "center", alignItems: "center" }}
                                            onPress={() => verifyotp()}>
                                            <Text style={{ color: "#fff", fontSize: 25, padding: 8, marginLeft: "3%", fontWeight: "500" }}> Verify </Text>

                                        </TouchableOpacity>

                                    </View>
                                </View>
                            )
                        }
                        if (show1 === 2) {
                            return (
                                <View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{
                                            fontSize: 30,
                                            color: "#003C43",
                                            marginTop: '15%',
                                            fontWeight: "700"
                                        }}> Reset Password </Text>

                                        <View style={styles.input}>


                                            <Icon name="lock-open-outline" color="#003C43" size={32} padding={8} marginLeft={8} />

                                            <TextInput
                                                style={{ marginLeft: "5%", color: "black", width: "70%" }}
                                                placeholder='New password'
                                                placeholderTextColor={"#003C43"}
                                                onChangeText={(txt) => setNewpassword(txt)}
                                                value={newpassword}

                                            />
                                        </View>


                                        <TouchableOpacity
                                            style={{ width: "70%", marginTop: "10%", borderRadius: 20, backgroundColor: "#FF7722", justifyContent: "center", alignItems: "center" }}
                                            onPress={() => reset()}>
                                            <Text style={{ color: "#fff", fontSize: 25, padding: 8, marginLeft: "3%", fontWeight: "500" }}> Confirm </Text>

                                        </TouchableOpacity>

                                    </View>
                                </View>
                            )
                        }

                        else {
                            return (
                                <View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{
                                            fontSize: 35,
                                            color: "#003C43",
                                            marginTop: 20,
                                            fontWeight: "700"
                                        }}> Login </Text>

                                        <View style={{
                                            width: "85%",
                                            flexDirection: "row",
                                            borderWidth: 2,
                                            borderColor: "#003C43",
                                            borderRadius: 20,
                                            marginTop: "10%",

                                        }}>


                                            <Icon name="email-outline" color="#003C43" size={32} padding={8} marginLeft={8} />

                                            <TextInput
                                                style={{ marginLeft: "5%", color: "black", width: "70%" }}
                                                placeholder='Email'
                                                placeholderTextColor={"#003C43"}
                                                onChangeText={(txt) => setEmail(txt)}
                                                value={Email}

                                            />
                                        </View>

                                        <View style={{
                                            width: "85%",
                                            flexDirection: "row",
                                            borderWidth: 1.5,
                                            borderColor: "#003C43",
                                            borderRadius: 20,
                                            marginTop: "5%"
                                        }}>


                                            <Icon name="lock-open-outline" color="#003C43" size={30} padding={8} marginLeft={8} />

                                            <TextInput
                                                style={{ marginLeft: "5%", color: "black", width: "70%" }}
                                                placeholder='Password'
                                                placeholderTextColor={"#003C43"}
                                                onChangeText={(txt) => setPassword(txt)}
                                                value={Password}
                                                secureTextEntry={true}

                                            />
                                        </View>
                                    </View>

                                    <View style={{ alignItems: 'flex-end', marginTop: 2, paddingRight: 45 }}>
                                        <TouchableOpacity
                                            onPress={() => setShow1(1)}
                                        >
                                            <Text style={{ color: "#FF7722", fontSize: 15, fontWeight: "500" }}> Forgot password ? </Text>

                                        </TouchableOpacity>

                                    </View>

                                    <View style={{ alignItems: 'center' }}>

                                        <TouchableOpacity
                                            style={{ width: "70%", marginTop: "8%", borderRadius: 20, backgroundColor: "#003C43", justifyContent: "center", alignItems: "center" }}
                                            onPress={() => validateInputs()}
                                            >
                                            <Text style={{ color: "#fff", fontSize: 25, padding: 8, marginLeft: "3%", fontWeight: "500" }}>Log In</Text>

                                        </TouchableOpacity>

                                        <View style={{ marginTop: "20%", marginBottom: 10 }}>
                                            <Text style={{ color: "#FF7722", fontSize: 15, fontWeight: "500" }}> Don't have an account ? </Text>
                                        </View>

                                        <TouchableOpacity
                                            style={{ width: "70%", borderRadius: 20, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#003C43" }}
                                            onPress={() => navigation.navigate("LoginOptions")}>
                                            <Text style={{ color: "#003C43", fontSize: 25, padding: 7, marginLeft: "3%", fontWeight: "500" }}>Sign Up</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        }
                    })()}


                </View>

            </LinearGradient>


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        width: "83%",
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "#003C43",
        borderRadius: 20,
        marginTop: '10%',
        marginBottom: 10,
        padding: 2

    },
});

export default Login;
