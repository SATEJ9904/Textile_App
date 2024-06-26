import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useRoute } from '@react-navigation/native'
import axios from "axios";

const Data = ({ navigation }) => {

    const route = useRoute()
    const item = route.params.item1
    const [AppUserId, setAppUserId] = useState("")
    const [Name, setName] = useState('')
    const [show, setShow] = useState(true);
    const [Id, setId] = useState("");
    const [LoomOrTrader, setLoomOrTrader] = useState("");
    const [mobileno,setMobileNo]=useState("");
    const [gstno,setGSTNO]=useState("")




    const setData = async () => {

        await AsyncStorage.setItem(
            "AppUserId", item.AppUserId,
        )
      
        await AsyncStorage.setItem(
            "Name", item.Name,
        )
       
    }
    const getData = async () => {
        const Email = await AsyncStorage.getItem("AppUserId");
        const Name = await AsyncStorage.getItem("Name");
        const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")
        const Id = await AsyncStorage.getItem("Id")
        const PrimaryContact = await AsyncStorage.getItem("PrimaryContact")
        const GSTNumber = await AsyncStorage.getItem("GSTNumber")


        setAppUserId(Email)
        setName(Name)
        setLoomOrTrader(LoomOrTrader)
        setId(Id)
        setMobileNo(PrimaryContact)
        setGSTNO(GSTNumber)

        console.log(Email, Name, LoomOrTrader, Id, PrimaryContact, GSTNumber)
    }

    const fetchData = async () => {
        try {
            const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getuserdetail.php?AppUserId=' + item.AppUserId);
            const data = await response.json();
            console.log(data);
            {
                console.log("started")
                data.map(async item => (
                    console.log(item.LoomOrTrader),
                    await AsyncStorage.setItem(
                        "LoomOrTrader", item.LoomOrTrader,
                    ),
                    await AsyncStorage.setItem(
                        "Id", item.Id.toString(),
                    ),
                    await AsyncStorage.setItem(
                        "PrimaryContact", item.PrimaryContact.toString(),
                    ),
                    await AsyncStorage.setItem(
                        "GSTNumber", item.GSTNumber.toString(),
                    ),
                    getData()
                ))
                console.log("Ended")
            }
           
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

    useEffect(() => {
       
    const callfuns=()=>{
        fetch("")
        .then(fetchData())
        .then(setData())
        .then(setData())
        .then(getData())

        const loadUser = async () => {
            const Name = await AsyncStorage.getItem('Name');
            const LoomOrTrader = await AsyncStorage.getItem('LoomOrTrader');
            const AppUserId = await AsyncStorage.getItem('AppUserId');
            const Id = await AsyncStorage.getItem('Id');
            const PrimaryContact = await AsyncStorage.getItem('PrimaryContact');
            const GSTNumber = await AsyncStorage.getItem('GSTNumber');
      
            if (Name && AppUserId) {
              setUser({
                Name,
                LoomOrTrader,
                AppUserId,
                Id,
                PrimaryContact,
                GSTNumber,
              });
            }
          };
      
          loadUser();
    }
    callfuns();

    }, [])


      useEffect(()=>{
        const timeoutId = setTimeout(() => {
            // Code to be executed after the timeout
           navigation.navigate("Difference")
          }, 3000); // Adjust the timeout duration as needed (in milliseconds)

          // Cleanup function to clear the timeout if component unmounts or if dependency changes
          return () => clearTimeout(timeoutId);
      },[])




    const [userdata, setUserData] = useState([])



   
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {
                show ? <ActivityIndicator size={70} color="green" /> : null
            }
            {/* <Text>Email : {AppUserId}</Text>
            <Text>Loom Or Trader : {LoomOrTrader}</Text>
            <Button title="Click" onPress={() => fetchData()} /> */}

        </View>
    )
}

export default Data


