import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompletedOrdersTrader = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const id = await AsyncStorage.getItem("Id");
        if (!id) {
          console.error('No ID found in AsyncStorage');
          return;
        }

        const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/traderliveorder.php?LoomTraderId=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        setOrders(json);
        console.log(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchOrders();
  }, []);

  const renderOrder = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>{item.OrderNo}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>

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
          <Text style={{ fontSize: 26, color: "white", fontWeight: 500 }}>  Completed Orders </Text>
        </View>

      </View>


      <View style={styles.content}>
        {(() => {
          if (orders.Active !== 1) {
            {
              orders.length ? (
                <FlatList
                  data={orders}
                  renderItem={renderOrder}
                  keyExtractor={(item) => item.OrderNo}
                />
              ) : (
              <Text style={styles.loadingText}>Loading...</Text>
            )
            }
          }
        })}
      </View>
    </SafeAreaView>
  );
};

export default CompletedOrdersTrader;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "white"
  },
  header: {
    backgroundColor: "#71B7E1",
    flexDirection: "row",
    alignItems: "center",
    padding: 15
  },
  drawerIcon: {
    width: 34,
    height: 30,
    marginRight: 10
  },
  drawerIconImage: {
    borderRadius: 0
  },
  headerText: {
    fontSize: 25,
    color: "white",
    marginLeft: "auto",
    marginRight: "auto"
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  orderItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center"
  },
  orderText: {
    color: "#000",
    fontSize: 18
  },
  loadingText: {
    color: "grey",
    fontSize: 18
  }
});
