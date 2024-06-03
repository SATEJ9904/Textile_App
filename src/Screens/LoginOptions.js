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

            <LinearGradient style={{
                flex: 1,
            }}
                colors={["#003C43", "#135D66", "#77B0AA","#FF7722"]}>

           

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

                <TouchableOpacity
                    style={styles.btn1}

                >
                    <Image
                        source={require("../Images/company.png")}
                        style={{
                            borderRadius: 40, height: 120,
                            width: "180%", marginLeft: 40, marginTop: 10
                        }}
                    />


                </TouchableOpacity>



            </View>

            {
                show ? <ActivityIndicator size={70} color="green" /> : null
            }

            <View style={{ flex: 0.9, alignItems: "center", marginTop: 20 }}>
                <View style={{ flex: 0.5, justifyContent: "center" }}>
                    <Text style={{ fontSize: 26, fontWeight: "600", color: "#003C43" }}> Select Your Role </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => navigation.navigate("Signup")}
                        >

                            <Image
                                style={{ height: 100, width: "90%", resizeMode: 'contain', margin: 15 }}
                                source={require("../Images/loom.png")}

                            />
                            <Text style={styles.txt}>Loom Unit</Text>

                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => navigation.navigate("SignupTrader")}
                        >

                            <Image
                                style={{ height: 100, width: "90%", resizeMode: 'contain', margin: 15 }}
                                source={require("../Images/trader_.png")}

                            />
                            <Text style={styles.txt}> Trader </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>


           
              </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
       // backgroundColor: 'white',
    },
    btn: {
        borderWidth: 3.7,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderColor: '#003C43',
        margin: 10,
        borderRadius: 20,
    },
    btn1: {
        height: "80%",
        width: '80%',
        //backgroundColor: 'rgba(0, 60, 67, 0.8)',
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 200,
        marginTop: 25
    },
    txt: {
        fontSize: 24,
        fontWeight: "400",
        color: "#fff",
        backgroundColor: '#003C43',
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,

    }

});

export default LoginOptions;
