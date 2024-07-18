import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const Users = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isUserDetailsModalVisible, setIsUserDetailsModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState('');
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [deviceLocationEnabled, setDeviceLocationEnabled] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    await checkLocationPermission();
    

    if (locationPermissionGranted) {
      fetchUsers();
    } else {
      Alert.alert("Please Turn On Device Location To Access Users List")
      setLoading(false);
    }
  };

  const checkLocationPermission = async () => {
    const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    handlePermissionStatus(status, 'location');
  };

  const handlePermissionStatus = (status, type) => {
    switch (status) {
      case RESULTS.UNAVAILABLE:
        Alert.alert(`${type} services are not available on this device.`);
        break;
      case RESULTS.DENIED:
        if (type === 'location') {
          setLocationPermissionGranted(false);
        }
        break;
      case RESULTS.LIMITED:
        Alert.alert(`${type} permission is limited.`);
        break;
      case RESULTS.GRANTED:
        if (type === 'location') {
          setLocationPermissionGranted(true);
          fetchUsers();
        }
        break;
      case RESULTS.BLOCKED:
        if (type === 'location') {
          setLocationPermissionGranted(false);
        }
        break;
    }
  };

  const fetchUsers = () => {
    fetch('https://textileapp.microtechsolutions.co.in/php/getappuser.php')
      .then((response) => response.json())
      .then((data) => {
        const uniqueUsers = getUniqueUsersByAppUserId(data);
        setUsers(uniqueUsers);
        setFilteredUsers(uniqueUsers);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const getUniqueUsersByAppUserId = (users) => {
    const appUserIdSet = new Set();
    return users.filter(user => {
      if (appUserIdSet.has(user.AppUserId) || !user.AppUserId || user.AppUserId === loggedInUserEmail) {
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
    setIsPasswordModalVisible(true);
  };

  const handleBackPress = () => {
    setSelectedUser(null);
  };

  const checkAdminPassword = async (password) => {
    try {
      const url = "https://textileapp.microtechsolutions.co.in/php/getappuser.php";
      let response = await fetch(url);
      let result = await response.json();

      const matchedUser = result.find((item) => item.Password === password);

      if (matchedUser) {
        setPasswordAttempts(0);
        setIsPasswordModalVisible(false);
        setAdminPassword('');
        setIsUserDetailsModalVisible(true);
      } else {
        Alert.alert("Password didn't match", "Please try again.");
        setPasswordAttempts(prev => prev + 1);
        if (passwordAttempts + 1 >= 3) {
          triggerUnusualActivityAlert();
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleLogin = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login', { email: selectedUser?.AppUserId, password: selectedUser?.Password });
    setIsUserDetailsModalVisible(false);
    setSelectedUser(null);
  };

  const triggerUnusualActivityAlert = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        let Latitude = position.coords.latitude;
        let Longitude = position.coords.longitude;

        const formdata = new FormData();
        formdata.append("AppUserId", "satejshendage@gmail.com");
        formdata.append("Body", `Unusual Activity Detected from the Admin Dashboard from Latitude = ${Latitude}, Longitude = ${Longitude}. Please Check.`);

        const requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/sendemail.php", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            console.log(result);
            captureImage();
          })
          .catch((error) => console.error(error));
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceLocationManager: true,
        forceRequestLocation: true,
        showLocationDialog: true
      }
    );
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>User ID: {item.AppUserId}</Text>
      <Text style={styles.cardContent}>Name: {item.Name}</Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.cardContent}>Password: ****** </Text>
        <TouchableOpacity onPress={() => handleCardPress(item)}>
          <Icon name="eye" size={20} color="#003C43" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPasswordModal = () => (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isPasswordModalVisible}
      onRequestClose={() => setIsPasswordModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsPasswordModalVisible(false)}>
            <Icon name="times" size={24} color="#003C43" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Enter Admin Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.modalInput}
              placeholder="Admin Password"
              placeholderTextColor={"#000"}
              secureTextEntry={!showPassword}
              value={adminPassword}
              onChangeText={setAdminPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#003C43" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.modalButton} onPress={() => checkAdminPassword(adminPassword)}>
            <Text style={styles.modalButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderUserDetailsModal = () => (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isUserDetailsModalVisible}
      onRequestClose={() => setIsUserDetailsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsUserDetailsModalVisible(false)}>
            <Icon name="times" size={24} color="#003C43" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>User Details</Text>
          {selectedUser && (
            <>
              <Text style={styles.userDetailsText}>Name: {selectedUser.Name}</Text>
              <Text style={styles.userDetailsText}>Email: {selectedUser.AppUserId}</Text>
              <Text style={styles.userDetailsText}>Password: {selectedUser.Password}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleLogin}>
                <Text style={styles.modalButtonText}>Login as {selectedUser.Name}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={renderCard}
        keyExtractor={item => item.AppUserId}
        contentContainerStyle={styles.listContainer}
      />
      {renderPasswordModal()}
      {renderUserDetailsModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginLeft: 10,
  },
  listContainer: {
    paddingBottom: 20,
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
  icon: {
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#003C43',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordToggle: {
    marginLeft: 10,
  },
  userDetailsText: {
    fontSize: 16,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Users;
