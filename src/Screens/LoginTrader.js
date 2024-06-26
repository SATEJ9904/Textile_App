import React, { useState } from 'react';
import { ToastAndroid, Text, ActivityIndicator, TextInput, Alert, StyleSheet, Image, View, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedLoader from 'react-native-animated-loader';
import axios from 'axios';



const LoginTrader = ({ navigation }) => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [visible, setVisible] = useState(false)
    const dataArray = [Email, Password];

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


    return (
        <SafeAreaView style={styles.container}>



            <LinearGradient style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center"
            }}
                colors={["#16E2F5", "#16E2F5", "#0059FF", "#0059FF", "#0000A0",]}>
                <Text style={{
                    textShadowRadius: 10,
                    textShadowColor: "#0059FF",
                    fontSize: 35,
                    color: "#fff",
                    marginTop: "-0%",
                    marginLeft: "5%",
                    fontWeight: "800"
                }}>Login </Text>


                <Image
                    style={{
                        height: "25%",
                        width: "80%",
                        borderRadius: 20,
                        marginLeft: "0%",
                        marginTop: "10%"
                    }}
                    source={require("../Images/logoweave.png")}

                />

                {
                    show ? <AnimatedLoader
                        visible={true}
                        overlayColor="rgba(255,255,255,0.75)"
                        animationStyle={styles.lottie}
                        speed={5}
                    /> : null
                }

                <View style={{
                    width: "80%",
                    flexDirection: "row",
                    borderWidth: 1.5,
                    borderColor: "#fff",
                    borderRadius: 20,
                    marginTop: "20%"
                }}>

                    {/* <Image
                        style={{ width: "10%", height: "55%", marginTop: "3%", margin: "5%" }}
                        source={require("../Images/email2.png")}
                    /> */}

                    <TextInput
                        style={{ marginLeft: "5%", color: "#fff", width: "70%" }}
                        placeholder='Email'
                        placeholderTextColor={"#fff"}
                        onChangeText={(txt) => setEmail(txt)}
                        value={Email}

                    />
                </View>

                <View style={{
                    width: "80%",
                    flexDirection: "row",
                    borderWidth: 1.5,
                    borderColor: "#fff",
                    borderRadius: 20,
                    marginTop: "8%"
                }}>

                    {/* <Image
                        style={{ width: "10%", height: "65%", marginTop: "3%", margin: "5%" }}
                        source={require("../Images/lock-128.png")}
                    /> */}

                    <TextInput
                        style={{ marginLeft: "5%", color: "#fff", width: "70%" }}
                        placeholder='Password'
                        placeholderTextColor={"#fff"}
                        onChangeText={(txt) => setPassword(txt)}
                        value={Password}
                        secureTextEntry
                    />
                </View>


                <TouchableOpacity
                    style={{ width: "70%", marginTop: "15%", borderRadius: 20, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}
                    onPress={() => NewLogin()}>
                    <Text style={{ color: "#0000A0", fontSize: 25, padding: 7, marginLeft: "3%", fontWeight: "400" }}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ width: "70%", marginTop: "15%", borderRadius: 20, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#fff" }}
                    onPress={() => navigation.navigate("SignupTrader")}>
                    <Text style={{ color: "#fff", fontSize: 25, padding: 7, marginLeft: "3%", fontWeight: "400" }}>Sign Up</Text>
                </TouchableOpacity>


            </LinearGradient>


        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#003C43',

    },

});


export default LoginTrader;
