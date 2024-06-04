import React, { useEffect, useState,useRef  } from 'react'
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  DrawerItem
} from '@react-navigation/drawer';
import { PermissionsAndroid } from 'react-native';


import Login from '../Screens/Login';
import Home from '../Screens/Home';
import CustomDrawer from '../Screens/CustomDrawer';
import Signup from '../Screens/Signup';
import Splash from '../Screens/Splash';
import SignupTrader from '../Screens/SignupTrader';
import LoginTrader from '../Screens/LoginTrader';
import LoginOptions from '../Screens/LoginOptions';
import Storage from '../Screens/Storage';
import Data from '../Screens/Data';
import Splash2 from '../Screens/Splash2';
import JobWorkEnquires from '../Screens/JobWorkEnquires';
import LoomBooking from '../Screens/LoomBooking';
import CompletedOrders from '../Screens/CompletedOrders';
import GetYarnRates from '../Screens/GetYarnRates';
import LiveOrders from '../Screens/LiveOrders';
import Icon from 'react-native-vector-icons/FontAwesome';


import AsyncStorage from '@react-native-async-storage/async-storage';
import LiveOrderstrader from '../Screens/LiveOrderstrader';
import PlanLooms from '../Screens/PlanLooms';
import GetYarnRatesTrader from '../Screens/GetYarnRatesTrader';
import CalculationsTrader from '../Screens/CalculationsTrader';
import CompletedOrdersTrader from '../Screens/CompletedOrdersTrader';
import IncompleteOrders from '../Screens/IncompleteOrders';
import HomeTrader from '../Screens/HomeTrader';
import LoomsDetails from '../Screens/LoomsDetails';
import ConfirmEnquires from '../Screens/ConfirmEnquires';
import NoInternetScreen from '../Screens/NoInternet';






//https://github.com/itzpradip/react-navigation-v6-mix/blob/master/src/navigation/AppStack.js


const LoomDrawer = createDrawerNavigator();
const LoomDrawerNavigator = () => (
  <LoomDrawer.Navigator drawerContent={props => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerActiveBackgroundColor: '#033E3E',
      drawerActiveTintColor: '#FFF',
      drawerInactiveTintColor: '#033E3E',
      drawerLabelStyle: {
        marginLeft: 0,
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
      },
    }}>
    <LoomDrawer.Screen

      name="Home"
      component={Home}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'home' : 'home'} size={25} color={'grey'} />
        ),
        title: 'Home',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },


      }} />

    <LoomDrawer.Screen

      name="LoomDetails"
      component={LoomsDetails}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'address-card' : 'address-card'} size={25} color={'grey'} />
        ),
        title: 'Looms Details',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />


    <LoomDrawer.Screen

      name="JobWorkEnquires"
      component={JobWorkEnquires}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'briefcase' : 'briefcase'} size={25} color={'grey'} />
        ),
        title: 'Job Work Enquires',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />


    <LoomDrawer.Screen

      name="LoomBooking"
      component={LoomBooking}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'shopping-cart' : 'shopping-cart'} size={25} color={'grey'} />
        ),
        title: 'LoomBooking',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />


    <LoomDrawer.Screen

      name="CompletedOrders"
      component={CompletedOrders}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'check' : 'check'} size={25} color={'grey'} />
        ),

        title: 'Completed Orders',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />

    <LoomDrawer.Screen

      name="GetYarnRates"
      component={GetYarnRates}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'rupee' : 'rupee'} size={25} color={'grey'} />
        ),
        title: 'Get Yarn Rates',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />

    <LoomDrawer.Screen

      name="Live orders"
      component={LiveOrders}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'truck' : 'truck'} size={25} color={'grey'} />
        ),
        title: 'Live Orders',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />


    <LoomDrawer.Screen

      name="Storage"
      component={Storage}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'sign-out' : 'sign-out'} size={25} color={'grey'} />
        ),
        title: 'Exit',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />

  </LoomDrawer.Navigator>
);

// Define drawer navigator for trader
const TraderDrawer = createDrawerNavigator();
const TraderDrawerNavigator = () => (
  <TraderDrawer.Navigator drawerContent={props => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerActiveBackgroundColor: '#033E3E',
      drawerActiveTintColor: '#FFF',
      drawerInactiveTintColor: '#033E3E',
      drawerLabelStyle: {
        marginLeft: 10,
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
      },
    }}
  >

    <TraderDrawer.Screen

      name="Home"
      component={Home}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'home' : 'home'} size={25} color={'grey'} />
        ),
        title: 'Home',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />


    <TraderDrawer.Screen

      name="LiveOrderstrader"
      component={LiveOrderstrader}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'truck' : 'truck'} size={25} color={'grey'} />
        ),
        title: 'Live Orders',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <TraderDrawer.Screen

      name="PlanLooms"
      component={PlanLooms}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000', 
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'briefcase' : 'briefcase'} size={25} color={'grey'} />
        ),
        title: 'PlanLooms',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <TraderDrawer.Screen

      name="GetYarnRatesTrader"
      component={GetYarnRatesTrader}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000', 
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'rupee' : 'rupee'} size={25} color={'grey'} />
        ),
        title: 'Get Yarn Rates',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <TraderDrawer.Screen

      name="CalculationsTrader"
      component={CalculationsTrader}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000', 
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'calculator' : 'calculator'} size={25} color={'grey'} />
        ),
        title: 'Calculations',
        drawerLabelStyle: {
          marginLeft: 5,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <TraderDrawer.Screen

      name="IncompleteOrders"
      component={IncompleteOrders}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000', 
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'exclamation-circle' : 'exclamation-circle'} size={25} color={'grey'} />
        ),
        title: 'Incomplete Orders',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <TraderDrawer.Screen

      name="CompletedOrdersTrader"
      component={CompletedOrdersTrader}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000', 
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'check-circle' : 'check-circle'} size={25} color={'grey'} />
        ),
        title: 'Completed Orders',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <TraderDrawer.Screen

      name="Storage"
      component={Storage}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000', 
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'sign-out' : 'sign-out'} size={25} color={'grey'} />
        ),
        title: 'Exit',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />
  </TraderDrawer.Navigator>
);


const LTDIFF = ({navigation}) => {

  const loomOrTraderRef = useRef("");

  useEffect(() => {
    permission();
  }, [])

  const permission = async () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
  }

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    const ID = await AsyncStorage.getItem("AppUserId");
    const Name = await AsyncStorage.getItem("Name");
    const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader");
    loomOrTraderRef.current = LoomOrTrader;
    console.log("Difference = ",loomOrTraderRef.current);
    navigation.navigate("Navigator")
  }

}

export default LTDIFF;
