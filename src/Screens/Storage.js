import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { withDelay } from "react-native-reanimated";
import ExitApp from 'react-native-exit-app';


const Storage = ({ navigation }) => {

    // const route = useRoute()
    // const item = route.params.item1
    const [AppUserId, setAppUserId] = useState("")
    const [Name, setName] = useState('')
    const [show, setShow] = useState(true)
    const [loomOrtrader,setLoomOrTrader]=useState("")

    const closeApp = () => {
        Alert.alert(
            'Exit App',
            'Are you sure you want to exit the app?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => ExitApp.exitApp(),
              },
            ],
            { cancelable: false }
          );
      };

    const getData = async () => {
        const ID = await AsyncStorage.getItem("AppUserId");
        const Name = await AsyncStorage.getItem("Name");
        const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")

        setAppUserId(ID)
        setName(Name)
        setLoomOrTrader(LoomOrTrader)
    }

    useEffect(() => {
        getData();

    }, [])

    useEffect(() => {
        checkLogin();
    }, [])


    const checkLogin = async () => {
        const AppUserId = await AsyncStorage.getItem('AppUserId');
        if (AppUserId == null || AppUserId == undefined || AppUserId == '') {
            navigation.navigate('Splash');
        } else {
            navigation.navigate('Splash2')
        }

    }

    return (

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {show ? <View>
                <Text style={{ fontSize: 40, color: "#000" }}> Want to Exit App </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignSelf: "stretch", marginTop: "10%" }}>
                    <TouchableOpacity onPress={() => closeApp()}>
                        <Text style={{ color: "red", fontSize: 20 }} >Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Splash2")}>
                        <Text style={{ color: "blue", fontSize: 20 }} >No</Text>
                    </TouchableOpacity>
                </View>
            </View> : null}

        </View>
    )
}

export default Storage


