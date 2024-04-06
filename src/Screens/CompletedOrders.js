import { SafeAreaView, StyleSheet, Text, View, StatusBar, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'

const CompletedOrders = ({navigation}) => {
  return (
    <SafeAreaView style={{backgroundColor:"e5f2fe"}}>
                <StatusBar backgroundColor={"#0b659a"}></StatusBar>
        <View style={{ backgroundColor: "#71B7E1", flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <ImageBackground
              source={require("../Images/drawer.png")}
              style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#71B7E1", marginTop: 15, marginRight: 0, marginLeft: 10 }}
              imageStyle={{ borderRadius: 0 }}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 25, color: "white", margin: "2.5%", marginLeft: "30%" }}>Orders</Text>
        </View>
    </SafeAreaView>
  )
}

export default CompletedOrders

const styles = StyleSheet.create({})