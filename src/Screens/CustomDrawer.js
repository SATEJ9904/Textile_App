
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';

import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from "@react-native-async-storage/async-storage";

import Splash from './Splash';

const Drawer = createDrawerNavigator();


const CustomDrawer = (props) => {
  const navigation = useNavigation();

  const showToast1 = () => {
    ToastAndroid.show("Sign out Successfully", ToastAndroid.SHORT);
  };


  const [Name, setName] = useState("");
  const [AppUserId, setAppUserId] = useState("")
  const [LoomOrTrader, SetLoomOrTrader] = useState("")
  const [id, setId] = useState("");
  const [mobileno, setMobileNo] = useState("")
  const [gstno,setGSTNO]=useState("")

  const handleSignOut = () => {
    firestore()
      .collection('Users')
      .doc('sub-collection')
      .delete('email', 'password')
      .then(() => {
        showToast1();
        console.log('User deleted!');
        navigation.navigate("Login")
      });
  };

  const DeleteStorage = async () => {
    try {
      fetch("")
        .then(await AsyncStorage.removeItem('Name'))
        .then(await AsyncStorage.removeItem('LoomOrTrader'))
        .then(await AsyncStorage.removeItem('AppUserId'))
        .then(await AsyncStorage.removeItem("Id"))
        .then(await AsyncStorage.removeItem("PrimaryContact"))
        .then(await AsyncStorage.removeItem("GSTNumber"))
      console.log("data deleted")
      navigation.navigate("Splash")
    } catch (err) {
      console.log('Error', err)
    }
  }

  useEffect(() => {
    getData();
    console.log(Name, AppUserId, LoomOrTrader, id)
  }, [])

  const getData = async () => {
    const Email = await AsyncStorage.getItem("AppUserId");
    const Name = await AsyncStorage.getItem("Name");
    const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")
    const Id = await AsyncStorage.getItem("Id")
    const PrimaryContact = await AsyncStorage.getItem("PrimaryContact")
    const GSTNumber = await AsyncStorage.getItem("GSTNumber")


    setAppUserId(Email)
    setName(Name)
    SetLoomOrTrader(LoomOrTrader)
    setId(Id)
    setMobileNo(PrimaryContact)
    setGSTNO(GSTNumber)
  }


  return (

    <View style={{ flex: 2 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ borderTopRightRadius: 10 }}>

        <View>
          <View style={{ justifyContent: 'flex-start', alignItems: "flex-start", backgroundColor: "#71B7E1", marginLeft: "1%" }}>
          <Text style={{ color: "#fff", fontSize: 22, marginLeft: "5%", marginTop: "5%" ,borderWidth:1,borderColor:"#fff",padding:"3%",borderRadius:35,paddingHorizontal:"5%"}}>{LoomOrTrader}</Text>

          </View>
          <View style={{ justifyContent: 'flex-start', alignItems: "flex-start", backgroundColor: "#71B7E1", marginLeft: "1%", flexDirection: "row" }}>
            <View style={{ marginTop: "7%" }}>
              <Image
                source={require('../Images/logoweave.png')}
                style={{ height: 50, width: 70, borderRadius: 5, marginBottom: 0, marginLeft: 0, marginTop: "0%", backgroundColor: "#e5f2fe" }}
              />
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontFamily: 'Roboto-Medium',
                  marginBottom: 10,
                  fontWeight: '800',
                  marginLeft: "1%"
                }}>
                Weaveit
              </Text>
            </View>

            <View>
              <Text style={{ color: "#fff", fontSize: 22, marginLeft: "5%", marginTop: "-7%",fontWeight:"700" }}>{Name}</Text>
              <Text style={{ color: "#fff", fontSize: 17, marginLeft: "5%", marginTop: "2%" }}>{mobileno}</Text>
              <Text style={{ color: "#fff", fontSize: 17, marginLeft: "5%", marginTop: "2%" }}>{gstno}</Text>
            </View>


          </View>
        </View>

        <View style={{ flex: 1, paddingTop: -80 }}>
          <DrawerItemList

            {...props}

          />

        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity onPress={() => { DeleteStorage(); }} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
                color: "#000"
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default CustomDrawer 