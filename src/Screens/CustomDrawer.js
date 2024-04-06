
import React from 'react';
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
      console.log("data deleted")
      navigation.navigate("Splash")
    } catch (err) {
      console.log('Error', err)
    }


  }

  return (

    <View style={{ flex: 1, backgroundColor: "#e5f2fe" }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#e5f2fe", borderTopRightRadius: 10 }}>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            source={require('../Images/logoweave.png')}
            style={{ height: 170, width: 190, borderRadius: 50, marginBottom: 0, marginLeft: 0, marginTop: "5%", backgroundColor: "#e5f2fe" }}
          />
          <Text
            style={{
              color: '#000',
              fontSize: 20,
              fontFamily: 'Roboto-Medium',
              marginBottom: 20,
              fontWeight: '800',
              marginLeft: "0%"
            }}>
            Weaveit
          </Text>
        </View>

        <View style={{ flex: 1, backgroundColor: '#e5f2fe', paddingTop: -80 }}>
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
                color: "#71B7E1"
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