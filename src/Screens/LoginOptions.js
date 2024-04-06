import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TextInput, Alert, StyleSheet, Image, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const LoginOptions = ({ navigation }) => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [show, setShow] = useState(false)
    const dataArray = [Email, Password];

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar backgroundColor={"#16E2F5"}></StatusBar>


            {/*  */}

            <LinearGradient style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center"
            }}
                colors={["#16E2F5", "#16E2F5", "#0059FF", "#0059FF", "#0000A0",]}>

                <Text style={{ fontSize: 35, color: "#fff", marginTop: "-10%", marginLeft: "5%", fontWeight: "800" }}>Weaveit App</Text>


                <Image
                    style={{ height: "25%", width: "78%", borderRadius: 70, marginLeft: "0%", marginTop: "15%" }}
                    source={require("../Images/logoweave2.png")}

                />

                {
                    show ? <ActivityIndicator size={70} color="green" /> : null
                }

                <Text style={{ fontSize: 25, fontWeight: "600", color: "#fff", marginTop: "20%", fontWeight: "900" }}> Select Your Role</Text>
                <View style={{ flexDirection: "row",width:"100%",justifyContent:'space-evenly',alignItems:"center",marginTop:"10%" }}>
                    <View style={{marginLeft:"12%"}}>
                        <TouchableOpacity style={{ }} onPress={() => navigation.navigate("Login")}>
                            <Image
                                source={require("../Images/looms.png")}
                                style={{ width: 105, height: 105 }}

                            />

                        </TouchableOpacity>
                        <Text style={{ fontSize: 25, fontWeight: "800", color: "#fff", marginLeft: "0%" }}>Loom Unit</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={{ }} onPress={() => navigation.navigate("LoginTrader")}>
                            <Image
                                source={require("../Images/trader.png")}
                                style={{ width: 105, height: 105, marginLeft: "25%",}}

                            />
                            <Text style={{ fontSize: 25, fontWeight: "800", color: "#fff", marginLeft: "15%" }}>Fabric Trader</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: '#DEB887',
        width: '100%',
        marginLeft: '-0%',
    },
    input: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#fff',
        borderColor: '#E2A76F',
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
        backgroundColor: '#E2A76F',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginLeft: '0%',
        marginTop: '15%',
    },
    loginText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 21,
    },
});

export default LoginOptions;
