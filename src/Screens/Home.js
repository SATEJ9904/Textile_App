import React, { useEffect, useState } from 'react';
import { TouchableOpacity, SafeAreaView, StyleSheet, Text, View, ImageBackground, StatusBar, RefreshControl, ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const Home = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [showMsg, setShowMsg] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [name, setName] = useState('');
  const [appUserId, setAppUserId] = useState('');
  const [loomOrTrader, setLoomOrTrader] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);

      if (state.isConnected) {
        setTimeout(() => {
          setShowMsg(false);
        }, 5000);
      } else {
        setShowMsg(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const Name = await AsyncStorage.getItem("Name");
    const AppUserId = await AsyncStorage.getItem("AppUserId");
    const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader");
    const Id = await AsyncStorage.getItem("Id");

    setName(Name);
    setAppUserId(AppUserId);
    setLoomOrTrader(LoomOrTrader);
    setId(Id);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e5f2fe" }}>
      <View>
        <StatusBar backgroundColor={"#0b659a"} />
        <View style={{ backgroundColor: "#71B7E1", flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <ImageBackground
              source={require("../Images/drawer.png")}
              style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#71B7E1", marginTop: 15, marginRight: 0, marginLeft: 10 }}
              imageStyle={{ borderRadius: 0 }}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, color: "white", margin: "2.5%", marginLeft: "30%" }}>Home</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 22, color: "#000", marginLeft: "0%", marginTop: "5%", marginRight: "5%", marginLeft: "5%" }}>Welcome :{name},{loomOrTrader}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ></ScrollView>

      {showMsg && (
        <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-end" }}>
          <View style={{
            bottom: 0,
            height: 20,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isConnected ? 'green' : 'red'
          }}>
            <Text style={{ color: "#fff" }}>
              {isConnected ? 'Back Online' : navigation.navigate("NoInternet")}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Home;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});
