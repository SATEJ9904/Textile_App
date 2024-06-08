import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Image, ImageBackground, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';


const Profile = ({ navigation }) => {
    const [view, setView] = useState('profile');
    const [looms, setLooms] = useState([]);
    const [selectedLoom, setSelectedLoom] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loomDetails, setLoomDetails] = useState({});
  
    useEffect(() => {
        mactype();
      if (view === 'looms') {
        fetch('https://textileapp.microtechsolutions.co.in/php/bookingjoin.php?LoomTraderId=493')
          .then(response => response.json())
          .then(data => setLooms(data))
          .catch(error => console.error('Error fetching data:', error));
      }
    }, [view]);
  
    const handleEdit = () => {
      setIsEditing(true);
      setLoomDetails(selectedLoom);
    };
  
    const handleSave = () => {
      // Here you would make a request to save the updated loom details to your backend
      console.log('Saving loom details:', loomDetails);
      setSelectedLoom(loomDetails);
      setIsEditing(false);
    };
  
    const renderLoomItem = ({ item }) => (
      <TouchableOpacity style={styles.card} onPress={() => setSelectedLoom(item)}>
        <Text style={styles.loomNumber}>Loom No: {item.LoomNo}</Text>
      </TouchableOpacity>
    );

    const [isFocus3, setIsFocus3] = useState(false);
    const [isFocus4, setIsFocus4] = useState(false);
    const [isFocus5, setIsFocus5] = useState(false);
    const [isFocus6, setIsFocus6] = useState(false);


    const [machineData, setMachineData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const mactype = () => {
        fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=MachineType')
            .then(response => response.json())
            .then(jsonData => {
                setMachineData(jsonData); // Update state with fetched data
                setIsLoading(false); // Update loading state to false
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false); // Update loading state to false even in case of error
            });
    }

    const machineDataType = machineData.map(item => ({ label: item.Name, value: item.Name }));

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ width: "12%" }} onPress={() => navigation.openDrawer()}>
                    <ImageBackground
                        source={require("../Images/drawer.png")}
                        style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003c43", marginTop: 0, marginRight: 0, marginLeft: 10 }}
                        imageStyle={{ borderRadius: 0 }}
                    />
                </TouchableOpacity>
                <Text style={styles.header}>User Profile</Text>
            </View>
            {view === 'profile' ? (
                <View style={styles.profileContainer}>
                    <View style={styles.profileCard}>
                        <Text style={styles.profileTitle}>User Profile</Text>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Account Info</Text>
                            <Image
                                source={require("../Images/rightarrow2.png")}
                                style={{ width: 30, height: 30 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Company Info</Text>
                            <Image
                                source={require("../Images/rightarrow2.png")}
                                style={{ width: 30, height: 30 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setView('looms')}>
                            <Text style={styles.buttonText}>My Looms</Text>
                            <Image
                                source={require("../Images/rightarrow2.png")}
                                style={{ width: 30, height: 30 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={{ width: "12%" }} onPress={() => setView('profile')}>
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.header}>Looms</Text>
                    </View>
                    <View style={styles.container}>
                        {selectedLoom ? (
                            isEditing ? (
                                <ScrollView contentContainerStyle={styles.detailsContainer}>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Loom No:</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={loomDetails.LoomNo}
                                            onChangeText={(text) => setLoomDetails({ ...loomDetails, LoomNo: text })}
                                        />
                                    </View>

                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>MachineType:</Text>
                                        <Dropdown
                                        style={[styles.dropdown, isFocus3 && { borderColor: 'blue', width: 0 }]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        data={machineDataType}
                                        search
                                        itemTextStyle={{ color: "#000" }}
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocus3 ? 'Select Machine Type' : '...'}
                                        searchPlaceholder="Search..."
                                        value={loomDetails.MachineType}
                                        onFocus={() => setIsFocus3(true)}
                                        onBlur={() => setIsFocus3(false)}
                                        onChange={(text) => setLoomDetails({ ...loomDetails, MachineType: text })} />

                                    </View>
                                   
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Width:</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={loomDetails.Width}
                                            onChangeText={(text) => setLoomDetails({ ...loomDetails, Width: text })}
                                        />
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>RPM:</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={loomDetails.RPM}
                                            onChangeText={(text) => setLoomDetails({ ...loomDetails, RPM: text })}
                                        />
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Shedding Type:</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={loomDetails.SheddingType}
                                            onChangeText={(text) => setLoomDetails({ ...loomDetails, SheddingType: text })}
                                        />
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>No of Frame:</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={loomDetails.NoofFrames}
                                            onChangeText={(text) => setLoomDetails({ ...loomDetails, NoofFrames: text })}
                                        />
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>No of Feeder:</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={loomDetails.NoofFeeders}
                                            onChangeText={(text) => setLoomDetails({ ...loomDetails, NoofFeeders: text })}
                                        />
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Selvage Jacquard:</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={loomDetails.SelvageJacquard}
                                            onChangeText={(text) => setLoomDetails({ ...loomDetails, SelvageJacquard: text })}
                                        />
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Top Beam:</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={loomDetails.TopBeam}
                                            onChangeText={(text) => setLoomDetails({ ...loomDetails, TopBeam: text })}
                                        />
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Cramming:</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={loomDetails.Cramming}
                                            onChangeText={(text) => setLoomDetails({ ...loomDetails, Cramming: text })}
                                        />
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Leno Design Equipment:</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={loomDetails.LenoDesignEquipment}
                                            onChangeText={(text) => setLoomDetails({ ...loomDetails, LenoDesignEquipment: text })}
                                        />
                                    </View>
                                    <TouchableOpacity style={styles.backButton} onPress={handleSave}>
                                        <Text style={styles.backButtonText}>Save</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            ) : (
                                <ScrollView contentContainerStyle={styles.detailsContainer}>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Loom No:</Text>
                                        <Text style={styles.value}>{selectedLoom.LoomNo}</Text>
                                    </View>
                                    
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Machine Type:</Text>
                                        <Text style={styles.value}>{selectedLoom.MachineType}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Width:</Text>
                                        <Text style={styles.value}>{selectedLoom.Width}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>RPM:</Text>
                                        <Text style={styles.value}>{selectedLoom.RPM}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Shedding Type:</Text>
                                        <Text style={styles.value}>{selectedLoom.SheddingType}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>No of Frame:</Text>
                                        <Text style={styles.value}>{selectedLoom.NoofFrames}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>No of Feeder:</Text>
                                        <Text style={styles.value}>{selectedLoom.NoofFeeders}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Selvage Jacquard:</Text>
                                        <Text style={styles.value}>{selectedLoom.SelvageJacquard}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Top Beam:</Text>
                                        <Text style={styles.value}>{selectedLoom.TopBeam}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Cramming:</Text>
                                        <Text style={styles.value}>{selectedLoom.Cramming}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.label}>Leno Design Equipment:</Text>
                                        <Text style={styles.value}>{selectedLoom.LenoDesignEquipment}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                                        <Text style={styles.editButtonText}>Edit Looms</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.backButton} onPress={() => setSelectedLoom(null)}>
                                        <Text style={styles.backButtonText}>Back</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            )
                        ) : (
                            <FlatList
                                data={looms}
                                renderItem={renderLoomItem}
                                keyExtractor={(item) => item.LoomNo.toString()}
                                numColumns={2}
                                columnWrapperStyle={styles.row}
                            />
                        )}
                    </View>
                </View>
            )}
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: "#003c43",
        width: "100%",
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: -20,
        flex: 1,
        textAlign: 'center',
        paddingVertical: "2%",
        color: "#fff"
    },
    profileContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f4f4f5',
        marginTop: "15%"
    },
    profileCard: {
        width: '100%',
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'flex-start',
    },
    profileTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    button: {
        padding: 16,
        backgroundColor: "#0E8C6B",
        borderRadius: 8,
        marginVertical: 8,
        width: '100%',
        marginBottom: "5%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500"
    },
    backText: {
        fontSize: 18,
        color: '#fff',
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f4f5',
    },
    card: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        margin: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loomNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    detailsContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flex: 1,
        fontSize: 16,
        color: '#333',
        padding: -5,
        marginBottom:10
    },
    editButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#28a745',
        borderRadius: 8,
    },
    editButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    backButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#007bff',
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    row: {
        flex: 1,
        justifyContent: "space-around"
    },
    dropdown: {
        height: 50,
        borderColor: '#000',
        paddingHorizontal: 5,
        width: 150,
        marginTop:"-5%"
    },
    icon: {
        marginRight: 5,
    },
    label1: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 15,
        color: "#000"
    },
    selectedTextStyle: {
        color: "#000"
    },
    iconStyle: {
        width: 40,
        height: 30,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 17,
    },
})