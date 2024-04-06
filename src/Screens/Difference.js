import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './Home';
import JobWorkEnquires from './JobWorkEnquires';
import CompletedOrders from './CompletedOrders';
import GetYarnRates from './GetYarnRates';
import LiveOrders from './LiveOrders';
import CustomDrawer from './CustomDrawer';
import CompletedOrdersTrader from './CompletedOrdersTrader';
import IncompleteOrders from './IncompleteOrders';
import CalculationsTrader from './CalculationsTrader';
import GetYarnRatesTrader from './GetYarnRatesTrader';
import PlanLooms from './PlanLooms';
import LiveOrderstrader from './LiveOrderstrader';



const Drawer = createDrawerNavigator();


const Difference = ({navigation}) => {


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
  }

  useEffect(() => {
    getData();

  }, [])


  return (

    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >



      {
        loomOrtrader === "L" ?

          <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
              headerShown: false,
            }}

          >
            <Drawer.Screen

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



            <Drawer.Screen

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


            <Drawer.Screen

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

            <Drawer.Screen

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

            <Drawer.Screen

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

          </Drawer.Navigator>

          :

          <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
              headerShown: false,
            }}

          >


            <Drawer.Screen

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

            <Drawer.Screen

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

            <Drawer.Screen

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

            <Drawer.Screen

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

            <Drawer.Screen

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

            <Drawer.Screen

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

            <Drawer.Screen

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

          </Drawer.Navigator>
      }






    </Drawer.Navigator>

  );
}

export default Difference

const styles = StyleSheet.create({})