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
import Icon from 'react-native-vector-icons/FontAwesome';


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
import NoInternetScreen from './src/Screens/NoInternet';
import LTDIFF from './src/Screens/Difference';
import Navigator from './src/Screens/Navigator';






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
        <Stack.Screen name="Navigator" component={Navigator} />
        <Stack.Screen name="Difference" component={LTDIFF} />
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
        <Stack.Screen name="NoInternet" component={NoInternetScreen} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;




