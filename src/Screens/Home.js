import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, SafeAreaView, StyleSheet, Text, View, Image, StatusBar, RefreshControl, ScrollView, ImageBackground } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import LottieView from 'lottie-react-native';
import Geolocation from 'react-native-geolocation-service';

const Home = ({ navigation }) => {

  const [refreshing, setRefreshing] = useState(false);
  const [showMsg, setShowMsg] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [ProfilePic, setProfilePic] = useState(null);
  const [name, setName] = useState('');
  const [appUserId, setAppUserId] = useState('');
  const [loomOrTrader, setLoomOrTrader] = useState('');

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

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
      isMounted.current = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getData = async () => {
    try {
      const Name = await AsyncStorage.getItem("Name");
      const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader");
      const appUserId = await AsyncStorage.getItem("AppUserId");
      const Profilepic = await AsyncStorage.getItem('Profilepic');

      if (isMounted.current) {
        setName(Name || '');
        setLoomOrTrader(LoomOrTrader || '');
        setAppUserId(appUserId || '');
        setProfilePic(Profilepic || '');
      }
      console.log('Data = ', Name, LoomOrTrader);
    } catch (error) {
      console.error('Failed to load data from AsyncStorage', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData(); // Refresh the data on pull down
    setTimeout(() => {
      if (isMounted.current) {
        setRefreshing(false);
      }
    }, 2000);
    console.log("refreshed");
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"#003C43"} />

      <View style={{ backgroundColor: "#003C43", flexDirection: "row", alignItems: 'center', height: 50 }}>
        <TouchableOpacity
          style={{ padding: "2%" }}
          onPress={() => navigation.openDrawer()}
        >
          <Image
            source={require("../Images/drawer1.png")}
            style={{ width: 28, height: 22, marginLeft: 10 }}
          />
        </TouchableOpacity>

        <View style={{ flex: 0.9, alignItems: 'center' }}>
          <Text style={{ fontSize: 26, color: "white", fontWeight: '500' }}> Home </Text>
        </View>
      </View>

      <Text style={{ fontSize: 30, color: "#000", marginTop: "6%", marginLeft: "5%" }}> Welcome </Text>

      <View style={{ marginTop: 40, margin: 20 }}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("SelfInfo")}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <ImageBackground source={{ uri: ProfilePic }} style={styles.profileImage}>
                {/* Add the profile picture here */}
              </ImageBackground>
            </View>

            <View style={{ flex: 2, justifyContent: 'center', marginLeft: 10 }}>
              <Text style={{ fontSize: 20, color: "#000", marginBottom: 5 }}>{name}</Text>
              <Text style={{ fontSize: 16, color: "#000" }}>{appUserId}</Text>
            </View>

            <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center', backgroundColor: '#135D66', borderTopRightRadius: 20, borderBottomRightRadius: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate("SelfInfo")} style={{ padding: "5%", flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 28, color: "white", fontWeight: '600' }}>{loomOrTrader}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ></ScrollView>

    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flexGrow: 1,
  },
  btn: {
    height: 130,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    elevation: 20,
    shadowColor: 'black'
  },
  profileImage: {
    width: "80%",
    height: "80%",
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#CCCCCC', // Placeholder color for the image
  },
});
