import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const GeneratedEnquires = ({ navigation }) => {

    const [enquiries, setEnquiries] = useState([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [username, setUserName] = useState("");
    const [AppUserId, setAppUserId] = useState("")
    const [LoomOrTrader, SetLoomOrTrader] = useState("")
    const [id, setId] = useState("")

    useEffect(async () => {
        getData();
        const traderId = await AsyncStorage.getItem("Id");
        fetch('https://textileapp.microtechsolutions.co.in/php/getjoin.php?TraderId=' + traderId)
            .then((response) => response.json())
            .then((data) => setEnquiries(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const renderEnquiryItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => setSelectedEnquiry(item)}>
            <Text style={styles.enquiryNumber}>Enquiry No: {item.EnquiryNo}</Text>
        </TouchableOpacity>
    );

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
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ width: "12%" }} onPress={() => navigation.navigate("PlanLooms")}>
                    <ImageBackground
                        source={require("../Images/back.png")}
                        style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003c43", marginTop: 0, marginRight: 0, marginLeft: 10 }}
                        imageStyle={{ borderRadius: 0 }}
                    />
                </TouchableOpacity>
                <Text style={styles.header}>Enquires</Text>
            </View>
            <View style={styles.container}>
                {selectedEnquiry ? (
                    <ScrollView contentContainerStyle={styles.detailsContainer}>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>EnquiryId:</Text>
                            <Text style={styles.value}>{selectedEnquiry.EnquiryId}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>EnquiryDate:</Text>
                            <Text style={styles.value}>{selectedEnquiry.EnquiryDate.date.substring(0, 10)}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>TraderId:</Text>
                            <Text style={styles.value}>{selectedEnquiry.TraderId}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>BookingFrom:</Text>
                            <Text style={styles.value}>{selectedEnquiry.BookingFrom.date.substring(0, 10)}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>BookingTo:</Text>
                            <Text style={styles.value}>{selectedEnquiry.BookingTo.date.substring(0, 10)}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>FabricQuality:</Text>
                            <Text style={styles.value}>{selectedEnquiry.FabricQuality}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>FabricLength:</Text>
                            <Text style={styles.value}>{selectedEnquiry.FabricLength}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>LoomRequired:</Text>
                            <Text style={styles.value}>{selectedEnquiry.LoomRequired}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>AgentName:</Text>
                            <Text style={styles.value}>{selectedEnquiry.AgentName}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>MachineType:</Text>
                            <Text style={styles.value}>{selectedEnquiry.MachineType}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Width:</Text>
                            <Text style={styles.value}>{selectedEnquiry.Width}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>RPM:</Text>
                            <Text style={styles.value}>{selectedEnquiry.RPM}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>SheddingType:</Text>
                            <Text style={styles.value}>{selectedEnquiry.SheddingType}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>NoofFrame:</Text>
                            <Text style={styles.value}>{selectedEnquiry.NoofFrame}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>NoofFeeder:</Text>
                            <Text style={styles.value}>{selectedEnquiry.NoofFeeder}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>SelvageJacquard:</Text>
                            <Text style={styles.value}>{selectedEnquiry.SelvageJacquard}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>TopBeam:</Text>
                            <Text style={styles.value}>{selectedEnquiry.TopBeam}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Cramming:</Text>
                            <Text style={styles.value}>{selectedEnquiry.Cramming}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>LenoDesignEquipment:</Text>
                            <Text style={styles.value}>{selectedEnquiry.LenoDesignEquipment}</Text>
                        </View>
                        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedEnquiry(null)}>
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                    </ScrollView>
                ) : (
                    <FlatList
                        data={enquiries}
                        renderItem={renderEnquiryItem}
                        keyExtractor={(item) => item.EnquiryId.toString()}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

export default GeneratedEnquires

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
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f4f5',
    },
    card: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 8,
    },
    enquiryNumber: {
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
    detailTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
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
})