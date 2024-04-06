import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ImageBackground, StyleSheet, FlatList, ScrollView } from 'react-native';

const ConfirmEnquires = () => {


  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getenquiryconfirm.php');
      const json = await response.json();
      setData(json);
      console.log(json)
    };

    fetchData();
  }, []);

  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(!isPressed);
  };

  if (!data) {
    return <View>
      <View style={{ backgroundColor: "#71B7E1", flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <ImageBackground
            source={require("../Images/drawer.png")}
            style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#71B7E1", marginTop: 15, marginRight: 0, marginLeft: 10 }}
            imageStyle={{ borderRadius: 0 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: "white", margin: "2.5%", marginLeft: "20%" }}>Confirm Enquires</Text>
      </View>
      <Text>Loading....</Text>
    </View>
      ;
  }


  return (
    <SafeAreaView>
      <StatusBar backgroundColor={"#0b659a"}></StatusBar>
      <View style={{ backgroundColor: "#71B7E1", flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <ImageBackground
            source={require("../Images/drawer.png")}
            style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#71B7E1", marginTop: 15, marginRight: 0, marginLeft: 10 }}
            imageStyle={{ borderRadius: 0 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: "white", margin: "2.5%", marginLeft: "20%" }}>Confirm Enquires</Text>
      </View>
      <View>
        <ScrollView horizontal >
          <View style={{ flexDirection: "column", margin: 5, marginTop: "5%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "#000", paddingHorizontal: 29, borderWidth: 1, }}>EnquiryId</Text>
              <Text style={{ color: "#000", paddingHorizontal: 29, borderWidth: 1, }}>DatePossibleFrom</Text>
              <Text style={{ color: "#000", paddingHorizontal: 38, borderWidth: 1, }}>DatePossibleTo</Text>
              <Text style={{ color: "#000", paddingHorizontal: 9, borderWidth: 1, }}>LoomPossible</Text>
              <Text style={{ color: "#000", paddingHorizontal: 4, borderWidth: 1, }}>JobRateExpected</Text>
              <Text style={{ color: "#000", paddingHorizontal: 39, borderWidth: 1, }}>Status</Text>

            </View>
            <View>
              <FlatList
                data={data}
                renderItem={({ item }) => (
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.data} key={item.id}>{item.EnquiryId}</Text>
                    <Text style={styles.data}> {item.DatePossibleFrom.date.substring(0, 10)}</Text>
                    <Text style={styles.data}>{item.DatePossibleTo.date.substring(0, 10)}</Text>
                    <Text style={styles.data}>{item.LoomPossible}</Text>
                    <Text style={styles.data}>{item.JobRateExp}</Text>
                    <TouchableOpacity  onPress={handlePress}  style={{backgroundColor: isPressed ? 'green' : 'blue'}}>
                    <Text style={{
                      color: "#fff", borderWidth: 1,
                      paddingHorizontal: 34,
                      paddingVertical: 5,
                    }}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  data: {
    color: "#000",
    borderWidth: 1,
    paddingHorizontal: 50,
    paddingVertical: 5,

  }
})

export default ConfirmEnquires;