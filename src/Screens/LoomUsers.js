import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native';
import CountryFlag from 'react-native-country-flag'; // use a package like this for country flags

const LoomUsers = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch('https://textileapp.microtechsolutions.co.in/php/getdetail.php')
      .then((response) => response.json())
      .then((data) => {
        const filteredUsers = data.filter(user => user.LoomOrTrader === 'L');
        const uniqueUsers = getUniqueUsersByAppUserId(filteredUsers);
        setUsers(uniqueUsers);
        setFilteredUsers(uniqueUsers);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const getUniqueUsersByAppUserId = (users) => {
    const appUserIdSet = new Set();
    return users.filter(user => {
      if (appUserIdSet.has(user.AppUserId)) {
        return false;
      } else {
        appUserIdSet.add(user.AppUserId);
        return true;
      }
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => user.Name.toLowerCase().includes(query.toLowerCase()));
      setFilteredUsers(filtered);
    }
  };

  const handleCardPress = (user) => {
    setSelectedUser(user);
  };

  const handleBackPress = () => {
    setSelectedUser(null);
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
      <Text style={styles.cardTitle}>Email : {item.AppUserId}</Text>
      <Text style={styles.cardContent}>Name : {item.Name}</Text>
      <Text style={styles.cardContent}>Owner Name : {item.OwnerName}</Text>
      <Text style={styles.cardContent}>Primary Contact : {item.PrimaryContact}</Text>
    </TouchableOpacity>
  );

  const renderDetails = () => {
    if (!selectedUser) return null;

    const loomOrTraderMapping = {
      'L': 'Loom',
      'T': 'Trader',
      'Y': 'Yarn',
      'A': 'Admin'
    };

    return (
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>{selectedUser.Name}</Text>
        <Text style={styles.detailsTitle}>Details :</Text>
        <Text style={styles.detailsContent}>Email: {selectedUser.AppUserId}</Text>
        <Text style={styles.detailsContent}>Company Name: {selectedUser.Name}</Text>
        <Text style={styles.detailsContent}>Owner Name: {selectedUser.OwnerName}</Text>
        <Text style={styles.detailsContent}>Address: {selectedUser.Address}</Text>
        <Text style={styles.detailsContent}>City: {selectedUser.City}</Text>
        <Text style={styles.detailsContent}>State: {selectedUser.State}</Text>
        <Text style={styles.detailsContent}>Country: {selectedUser.Country}</Text>
        <Text style={styles.detailsContent}>Pincode: {selectedUser.Pincode}</Text>
        <Text style={styles.detailsContent}>GST Number: {selectedUser.GSTNumber}</Text>
        <Text style={styles.detailsContent}>Registration Number: {selectedUser.RegistrationNumber}</Text>
        <Text style={styles.detailsContent}>Primary Contact: {selectedUser.PrimaryContact}</Text>
        <Text style={styles.detailsContent}>Role: {loomOrTraderMapping[selectedUser.LoomOrTrader]}</Text>
      </View>
    );
  };

  const getCountryCode = (country) => {
    // Mapping of country names to ISO codes
    const countryCodes = {
      'India': 'IN',
      'United States': 'US',
      // Add more country mappings as needed
    };
    return countryCodes[country] || "IN";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {selectedUser ? (
          <TouchableOpacity style={{padding:"2%"}} onPress={handleBackPress}>
            <Image source={require("../Images/back.png")} style={styles.drawerIcon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image source={require("../Images/drawer1.png")} style={styles.drawerIcon} />
          </TouchableOpacity>
        )}
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Loom Users</Text>
        </View>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#003C43" style={styles.loader} />
      ) : selectedUser ? (
        renderDetails()
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderCard}
          keyExtractor={item => item.AppUserId.toString()}
          contentContainerStyle={styles.cardContainer}
        />
      )}
    </SafeAreaView>
  );
};

export default LoomUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f9',
  },
  header: {
    backgroundColor: "#003C43",
    flexDirection: "row",
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe3e6',
  },
  drawerIcon: {
    width: 28,
    height: 22,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: "white",
    fontWeight: '700',
  },
  loader: {
    marginTop: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#dfe3e6',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    margin: 20,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  cardContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#003C43',
  },
  cardContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003C43',
    marginBottom: 20,
  },
  detailsContent: {
    fontSize: 17,
    color: '#333',
    marginBottom: 18,
    fontWeight: "500"
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
