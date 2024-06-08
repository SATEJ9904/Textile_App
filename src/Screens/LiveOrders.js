import { SafeAreaView, StyleSheet, Text, View, Modal, Pressable, StatusBar, FlatList, RefreshControl, TouchableOpacity, ImageBackground, TextInput, ScrollView, Image, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import ImageCropPicker from 'react-native-image-crop-picker';
import { PermissionsAndroid } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";



const LiveOrders = ({ navigation }) => {

    const [username, setUserName] = useState("");
    const [AppUserId, setAppUserId] = useState("")
    const [LoomOrTrader, SetLoomOrTrader] = useState("")
    const [id, setId] = useState("")
    const [showBlocks, setShowBlocks] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null);


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
        getData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);



    useEffect(() => {
        onRefresh();
        fetchData();
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
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <ImageBackground
                        source={require("../Images/drawer.png")}
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
                                    order.Confirmed !== 1 ? (
                                        <View key={index} style={styles.orderWrapper}>
                                            <View style={styles.orderContainer}>
                                                <Text style={styles.orderText}>{`Order No: ${order.OrderNo}\nParty Name: ${order.PartyName}\nQuality: ${order.Quality}`}</Text>
                                            </View>
                                            <View style={styles.buttonContainer}>
                                                <TouchableOpacity style={styles.button} onPress={() => startOrder(order)}>
                                                    <Text style={styles.buttonText}>Start Order</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.button} onPress={() => cancelOrder(order)}>
                                                    <Text style={styles.buttonText}>Cancel Order</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ) : null
                                ))}
                            </View>
                        ) : null}
                    </View>
                </View >
            </ScrollView >
            <View style={{ flexDirection: "row", justifyContent: 'space-evenly', borderWidth: 1, borderColor: "#0A5D47" }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Confirm_Orders")}>
                        <Text style={{ color: "#0A5D47", fontSize: 20, padding: 5 }}>Confirmed Orders</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ color: "#0A5D47", fontSize: 20 }}>|</Text>
                <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#0A5D47", width: "40%", borderRadius: 50 }}>
                    <TouchableOpacity>
                        <Text style={{ color: "#fff", fontSize: 20 }}>Live Orders</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
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
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#0909ff',
        marginBottom: 15
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