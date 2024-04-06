import React, { useEffect, useState } from 'react'
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  DrawerItem
} from '@react-navigation/drawer';
import { PermissionsAndroid } from 'react-native';


import Login from './src/Screens/Login';
import Home from './src/Screens/Home';
import CustomDrawer from './src/Screens/CustomDrawer';
import Signup from './src/Screens/Signup';
import Splash from './src/Screens/Splash';
import SignupTrader from './src/Screens/SignupTrader';
import LoginTrader from './src/Screens/LoginTrader';
import LoginOptions from './src/Screens/LoginOptions';
import Storage from './src/Screens/Storage';
import Data from './src/Screens/Data';
import Splash2 from './src/Screens/Splash2';
import JobWorkEnquires from './src/Screens/JobWorkEnquires';
import LoomBooking from './src/Screens/LoomBooking';
import CompletedOrders from './src/Screens/CompletedOrders';
import GetYarnRates from './src/Screens/GetYarnRates';
import LiveOrders from './src/Screens/LiveOrders';


import AsyncStorage from '@react-native-async-storage/async-storage';
import LiveOrderstrader from './src/Screens/LiveOrderstrader';
import PlanLooms from './src/Screens/PlanLooms';
import GetYarnRatesTrader from './src/Screens/GetYarnRatesTrader';
import CalculationsTrader from './src/Screens/CalculationsTrader';
import CompletedOrdersTrader from './src/Screens/CompletedOrdersTrader';
import Difference from './src/Screens/Difference';
import IncompleteOrders from './src/Screens/IncompleteOrders';
import HomeTrader from './src/Screens/HomeTrader';
import LoomsDetails from './src/Screens/LoomsDetails';
import ConfirmEnquires from './src/Screens/ConfirmEnquires';






//https://github.com/itzpradip/react-navigation-v6-mix/blob/master/src/navigation/AppStack.js



const Stack = createStackNavigator();


const LoomDrawer = createDrawerNavigator();
const LoomDrawerNavigator = () => (
  <LoomDrawer.Navigator initialRouteName='Storage' drawerContent={props => <CustomDrawer {...props} />}
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
    }}>
    <LoomDrawer.Screen

      name="Home"
      component={Home}
      options={{
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
        title: 'Home',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <TraderDrawer.Screen

      name="LoomDetails"
      component={LoomsDetails}
      options={{
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
        title: 'Looms Details',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />


    <LoomDrawer.Screen

      name="JobWorkEnquires"
      component={JobWorkEnquires}
      options={{
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
        title: 'Job Work Enquires',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />


    <TraderDrawer.Screen

      name="LoomBooking"
      component={LoomBooking}
      options={{
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
        title: 'LoomBooking',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />


    <LoomDrawer.Screen

      name="CompletedOrders"
      component={CompletedOrders}
      options={{
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
        title: 'Completed Orders',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <LoomDrawer.Screen

      name="GetYarnRates"
      component={GetYarnRates}
      options={{
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
        title: 'Get Yarn Rates',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <LoomDrawer.Screen

      name="Live orders"
      component={LiveOrders}
      options={{
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
        title: 'Live Orders',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />


    <LoomDrawer.Screen

      name="Storage"
      component={Storage}
      options={{
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
        title: 'Storage',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

  </LoomDrawer.Navigator>
);

// Define drawer navigator for trader
const TraderDrawer = createDrawerNavigator();
const TraderDrawerNavigator = () => (
  <TraderDrawer.Navigator initialRouteName='Storage' drawerContent={props => <CustomDrawer {...props} />}
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
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
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
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
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
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
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
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
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
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
        title: 'Calculations',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <TraderDrawer.Screen

      name="IncompleteOrders"
      component={IncompleteOrders}
      options={{
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
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
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
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
        drawerActiveBackgroundColor: '#71B7E1',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#71B7E1',
        title: 'Storage',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />
  </TraderDrawer.Navigator>
);


const App = () => {




  useEffect(() => {
    permission();
  }, [])

  const permission = async () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

  }


  const [AppUserId, setAppUserId] = useState("")
  const [Name, setName] = useState('')
  const [show, setShow] = useState(true)
  const [loomOrtrader, setLoomOrTrader] = useState("")



  const getData = async () => {
    const ID = await AsyncStorage.getItem("AppUserId");
    const Name = await AsyncStorage.getItem("Name");
    const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")

    setAppUserId(ID)
    setName(Name)
    setLoomOrTrader(LoomOrTrader)
    console.log(loomOrtrader)
  }

  useEffect(() => {
    getData();

  }, [])



  const DrawerNavigator = loomOrtrader == 'L' ? LoomDrawerNavigator : TraderDrawerNavigator;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}  >
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        <Stack.Screen name="Difference" component={Difference} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Splash2" component={Splash2} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="LoginOptions" component={LoginOptions} />
        <Stack.Screen name="SignupTrader" component={SignupTrader} />
        <Stack.Screen name="LoginTrader" component={LoginTrader} />
        <Stack.Screen name="Data" component={Data} />
        <Stack.Screen name="LoomBooking" component={LoomBooking} />
        <Stack.Screen name="ConfirmEnquires" component={ConfirmEnquires} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;




