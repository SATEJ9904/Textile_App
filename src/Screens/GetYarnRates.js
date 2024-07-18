import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GetYarnRates = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('https://textileapp.microtechsolutions.co.in/php/getdetail.php')
      .then(response => response.json())
      .then(data => {
        // Filter data to include only items where LoomorTrader value is 'Y'
        const filteredData = data.filter(item => item.LoomOrTrader === 'Y');
        setData(filteredData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('YarnMsg', { yarnId: item.Id})}
    >
      <Text style={styles.cardTitle}>{item.Name}</Text>
      <Text style={styles.cardSubtitle}>{item.PrimaryContact}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image source={require('../Images/drawer1.png')} style={styles.drawerIcon} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Yarn Rates</Text>
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={renderCard}
        keyExtractor={(item) => item.Id}
      />
      <TouchableOpacity
        style={styles.messageAllButton}
        onPress={() => navigation.navigate('BroadCastScreen', { userType: 'LoomOrTrader' })}
      >
        <Text style={styles.messageAllButtonText}>Message All Yarns</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    backgroundColor: '#003C43',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  drawerIcon: {
    width: 28,
    height: 22,
    marginLeft: 10,
  },
  headerTitleContainer: {
    flex: 0.9,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    color: 'white',
    fontWeight: '500',
  },
  messageAllButton: {
    backgroundColor: '#003C43',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  messageAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f0f0f0',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',

  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
  },
});

export default GetYarnRates;
