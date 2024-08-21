import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Modal, Alert,Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { launchCamera } from 'react-native-image-picker';

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
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    await checkLocationPermission();
    if (locationPermissionGranted) {
      fetchUsers();
    } else {
      Alert.alert("Please Turn On Device Location To Access Users List");
      setLoading(false);
    }
  };

  const checkLocationPermission = async () => {
    const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    handlePermissionStatus(status, 'location');
  };

  const requestLocationPermission = async () => {
    const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    handlePermissionStatus(status, 'location');
  };

  const handlePermissionStatus = (status, type) => {
    switch (status) {
      case RESULTS.UNAVAILABLE:
        Alert.alert(`${type} services are not available on this device.`);
        setLoading(false);
        break;
      case RESULTS.DENIED:
        if (type === 'location') {
          Alert.alert(
            "Location Permission Required",
            "Please allow location access to view the users.",
            [
              {
                text: "Grant Permission",
                onPress: requestLocationPermission,
              },
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => setLoading(false),
              },
            ]
          );
          setLocationPermissionGranted(false);
        }
        break;
      case RESULTS.LIMITED:
        Alert.alert(`${type} permission is limited.`);
        setLoading(false);
        break;
      case RESULTS.GRANTED:
        if (type === 'location') {
          setLocationPermissionGranted(true);
          fetchUsers();
        }
        break;
      case RESULTS.BLOCKED:
        if (type === 'location') {
          Alert.alert(
            "Location Permission Blocked",
            "Location permission is blocked. Please go to settings and enable it.",
            [
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => setLoading(false),
              },
            ]
          );
          setLocationPermissionGranted(false);
        }
        break;
    }
  };

  const [userscount, setUsersCount] = useState(null)

  const fetchUsers = () => {
    fetch('https://textileapp.microtechsolutions.co.in/php/getappuser.php')
      .then((response) => response.json())
      .then((data) => {
        const uniqueUsers = getUniqueUsersByAppUserId(data);
        setUsers(uniqueUsers);
        setFilteredUsers(uniqueUsers);
        setLoading(false);
        setUsersCount(uniqueUsers.length)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const getUniqueUsersByAppUserId = (users) => {
    const appUserIdSet = new Set();
    return users.filter(user => {
      if (appUserIdSet.has(user.AppUserId) || !user.AppUserId) {
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
      const filtered = users.filter(user => {
        const lowerQuery = query.toLowerCase();
  
        // Using optional chaining and default values to prevent errors
        return (
          (user.Name?.toLowerCase() || '').includes(lowerQuery) ||
          (user.AppUserId?.toLowerCase() || '').includes(lowerQuery) ||
          (user.OwnerName?.toLowerCase() || '').includes(lowerQuery)
        );
      });
  
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

      const matchedUser = result.find((item) => password === '4685320379');

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

  const captureImage = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'front',
        saveToPhotos: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image capture');
        } else if (response.errorCode) {
          console.log('Camera Error: ', response.errorCode);
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          console.log(uri);
          // Here, you can handle the captured image, e.g., send it to a server
        }
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
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => checkAdminPassword(adminPassword)}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
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
            <View>
              <Text style={styles.modalText}>AppUserId: {selectedUser.AppUserId}</Text>
              <Text style={styles.modalText}>Password: {selectedUser.Password}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login As User</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: "#003C43", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 25, fontWeight: "600", color: "#fff", paddingTop: "5%" }}>Users List</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />

      </View>
      <Text style={[styles.cardTitle,{marginLeft:"5%",fontSize:20}]}>Total Users :- {userscount}</Text>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.AppUserId}
        renderItem={renderCard}
        ListEmptyComponent={() => !loading && <Text style={{ color: "#003C43", fontSize: 28, fontWeight: "600" }}>No users found.</Text>}
      />
      {renderPasswordModal()}
      {renderUserDetailsModal()}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#003C43" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',  // Dark background for the admin screen
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0B0',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', 
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    margin: "5%",
    color:"#000"
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#000"
  },
  searchIcon: {
    marginLeft: 10,
    color: '#A0A0B0',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',  // Card background color matching theme
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    margin: "5%"

  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: '500',
    marginBottom: '10%',
    color: '#003C43',
    marginTop: "5%"
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#003C43',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  modalInput: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#003C43',
    padding: 10,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 8,
    color: '#003C43',
    fontWeight: "500"
  },
  loginButton: {
    backgroundColor: '#003C43',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    marginTop: "10%"

  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    padding: "3%",
  },
});


export default Users;
