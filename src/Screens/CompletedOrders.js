import { SafeAreaView, StyleSheet, Text, View, StatusBar, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const CompletedOrders = ({ navigation }) => {
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View style={{ backgroundColor: "#003C43", flexDirection: "row", alignItems: 'center', height: 50 }}>

        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
        >
          <Image
            source={require("../Images/drawer1.png")}
            style={{ width: 28, height: 22, marginLeft: 10, }}

          />
        </TouchableOpacity>


        <View style={{ flex: 0.9, alignItems: 'center' }}>
          <Text style={{ fontSize: 26, color: "white", fontWeight: 500 }}>  Orders </Text>
        </View>

      </View>


      <Text style={{ fontSize: 18, color: "black", fontWeight: 500 }}>  This service is not available yet </Text>

    </SafeAreaView>
  )
}

export default CompletedOrders

const styles = StyleSheet.create({})