import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window")


const ProfileScreen = ({ navigation }) => {





  const navigateToCompanyInfo = () => {
  navigation.navigate("SelfInfo")  
  };

  const navigateToContactInfo = () => {
    navigation.navigate("ContactEdit")
  };

  const [username, setUserName] = useState("");
  const [AppUserId, setAppUserId] = useState("")
  const [LoomOrTrader, SetLoomOrTrader] = useState("")
  const [id, setId] = useState("")


  useEffect(() => {
    getData();
    console.log(username, AppUserId, LoomOrTrader, id)
  }, [])


  const getData = async () => {
    const Name = await AsyncStorage.getItem("Name");
    const AppUserId = await AsyncStorage.getItem("AppUserId");
    const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")
    const Id = await AsyncStorage.getItem("Id")

    setUserName(Name)
    setAppUserId(AppUserId)
    SetLoomOrTrader(LoomOrTrader)
    setId(Id)

  }

  return (
    <View style={styles.container}>

      <View style={{ backgroundColor: "#003C43", flexDirection: "row", alignItems: 'center', height: 50, }}>

        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ padding: "2%", }}
        >
          <Image
            source={require("../Images/drawer.png")}
            style={{ width: 28, height: 22, marginLeft: 10, padding: "1%" }}

          />
        </TouchableOpacity>


        <View style={{ flex: 0.9, alignItems: 'center' }}>
          <Text style={{ fontSize: 26, color: "white", fontWeight: 500 }}> User Profile </Text>
        </View>

      </View>

      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "#f0f0f0" }}>
        <View style={{ justifyContent: "center", alignItems: "center", height: height * 0.42 }}>
          <Image
            source={require("../Images/user3.png")}
            style={{ width: width * 0.5, height: height * 0.27 }}
          />
          <Text style={{ fontSize: 22, fontWeight: "600", color: "#FF7722" }}>Welcome :  {username}</Text>
        </View>
        <View style={{ height: height * 0.52, borderRadius: 30 }}>
          <View style={styles.ItemContainer}>
            <TouchableOpacity style={styles.card} onPress={navigateToCompanyInfo}>
              <Text style={styles.cardText}>Company Info</Text>
              <Image
                source={require("../Images/rightarrow.png")}
                style={{ width: width * 0.06, height: height * 0.03, tintColor: "#fff" }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={navigateToContactInfo}>
              <Text style={styles.cardText}>Contact Info</Text>
              <Image
                source={require("../Images/rightarrow.png")}
                style={{ width: width * 0.06, height: height * 0.03, tintColor: "#fff" }}
              />
            </TouchableOpacity>
            {LoomOrTrader === "L" ? (
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MyLooms')}>
                <Text style={styles.cardText}>My Looms</Text>
                <Image
                  source={require("../Images/rightarrow.png")}
                  style={{ width: width * 0.06, height: height * 0.03, tintColor: "#fff" }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Generated_Enquires")}>
                <Text style={styles.cardText}>My Enquiries</Text>
                <Image
                  source={require("../Images/rightarrow.png")}
                  style={{ width: width * 0.06, height: height * 0.03, tintColor: "#fff" }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  ItemContainer: {
    marginBottom: "20%",
    marginTop: "0%",
    padding: "10%",
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 30,
    elevation: 10, // Add elevation for Android shadows
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    marginVertical: "5%",
    height: height * 0.8
  },
  card: {
    backgroundColor: '#135D66',
    padding: 20,
    borderRadius: 20,
    elevation: 3, // Add elevation for Android shadows
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginVertical: "5%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProfileScreen;
