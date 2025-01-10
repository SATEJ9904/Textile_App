import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Modal, Alert, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { TextInput, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

const KnottingOffersT = ({ navigation }) => {
    const [reed, setReed] = useState('');
    const [reedSpace, setReedSpace] = useState('');
    const [date, setDate] = useState(null);
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loomNames, setLoomNames] = useState({});
    const [contactno, setContactNo] = useState({});
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        fetchData();
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=KnottingOffer');
            const result = await response.json();
    
            // Sort by numeric value of OfferNo in descending order (after removing prefix)
            const sortedData = result.sort((a, b) => {
                const numericA = parseInt(a.OfferNo.replace(/^(OF|OR)/, ''), 10);
                const numericB = parseInt(b.OfferNo.replace(/^(OF|OR)/, ''), 10);
                return numericB - numericA;
            });
    
            // Use a Map to store the latest entry for each OfferNo
            const offerMap = new Map();
    
            // Filter out duplicates and keep only the latest entry for each OfferNo
            const uniqueData = sortedData.filter(item => {
                if (!offerMap.has(item.OfferNo)) {
                    offerMap.set(item.OfferNo, item);  // Add the latest item
                    return true;
                }
                return false;  // Skip duplicates
            });
    
            // Filter the data for offers without ConfirmTrader (if required)
            const initialFilterData = uniqueData.filter(item => item.ConfirmLoom === null);
    
            // Update state with sorted and filtered data
            setFilteredData(initialFilterData);
            setData(initialFilterData);
    
            // Fetch loom names for the corresponding LoomIds
            fetchLoomNames(initialFilterData.map(item => item.LoomId));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    

    const fetchLoomNames = async (loomIds) => {
        if (!loomIds || loomIds.length === 0) return;
        try {
            const uniqueLoomIds = [...new Set(loomIds)];
            const loomNamePromises = uniqueLoomIds.map(id =>
                fetch(`https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=${id}`)
                    .then(response => response.json())
                    .catch(() => [{ Name: 'Unknown' }])
            );
            const loomNameResults = await Promise.all(loomNamePromises);

            if (isMounted.current) {
                setLoomNames(loomNameResults.reduce((map, result, index) => {
                    map[uniqueLoomIds[index]] = result[0]?.Name || 'Unknown';
                    return map;
                }, {}));
                setContactNo(loomNameResults.reduce((map, result, index) => {
                    map[uniqueLoomIds[index]] = result[0]?.PrimaryContact || 'Unknown';
                    return map;
                }, {}));
            }
        } catch (error) {
            console.error('Error fetching loom names:', error);
        }
    };

    useEffect(() => {
        const filtered = data.filter(item =>
            (reed ? item.Reed.toLowerCase().includes(reed.toLowerCase()) : true) &&
            (reedSpace ? item.ReedSpace.toLowerCase().includes(reedSpace.toLowerCase()) : true) &&
            (date ? new Date(item.AvailableFrom.date) >= date : true)
        );
        setFilteredData(filtered);
    }, [reed, reedSpace, date, data]);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };

    const handleSubmit = async (item) => {

const TraderId = await AsyncStorage.getItem("Id")

        Alert.alert(
            "Confirm Booking",
            "Are you sure you want to book this offer?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Booking Cancelled"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        setLoading(true);
                        const formdata = new FormData();
                        formdata.append("Reed", item.Reed);
                        formdata.append("Draft", item.Draft);
                        formdata.append("ReedSpace", item.ReedSpace);
                        formdata.append("NoofLooms", item.NoofLooms);
                        formdata.append("AvailableFrom", item.AvailableFrom.date.substring(0, 10));
                        formdata.append("JobRateRequired", item.JobRateRequired);
                        formdata.append("DesignPaper", item.DesignPaper);
                        formdata.append("OfferNo", item.OfferNo);
                        formdata.append("LoomId", item.LoomId);
                        formdata.append("TraderId", TraderId);

                        const requestOptions = {
                            method: "POST",
                            body: formdata,
                            redirect: "follow"
                        };

                        fetch("https://textileapp.microtechsolutions.co.in/php/postknottingtrader.php", requestOptions)
                            .then((response) => response.text())
                            .then((result) => {
                                console.log(result)
                                if (result.trim() === "Value Inserted") {
                                    Alert.alert("Success", "Offer has been successfully booked!");
                                    fetchData(); // Refresh data after booking
                                    setLoading(false);
                                } else {
                                    Alert.alert("Error", result.trim());
                                }

                            })
                            .catch((error) => {
                                setLoading(false);
                                Alert.alert("Error", "An error occurred while processing your request.");
                                console.error(error)});
                    },
                },
            ]
        );
    };

    const [selectedImage, setSelectedImage] = useState(null);


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
        setTimeout(() => {
            if (isMounted.current) {
                setRefreshing(false);
            }
        }, 2000);
    }, []);

    if (loading) {
        return (
            <View style={styles.animationContainer}>
                <LottieView
                    source={require('../Animation/car_animation.json')}
                    autoPlay
                    loop
                />
                <Text style={styles.redirectText}>Processing Your Order...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#003C43', '#135D66']} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.drawerButton}>
                    <Image source={require('../Images/drawer.png')} style={styles.drawerIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Knotting Offers</Text>
            </LinearGradient>

            {/* Search Boxes */}
            <View style={styles.searchContainer}>
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <TextInput
                        label="Reed"
                        value={reed}
                        onChangeText={setReed}
                        style={styles.input}
                        theme={{ colors: { primary: '#003C43' } }}
                    />
                    <TextInput
                        label="Reed Space"
                        value={reedSpace}
                        onChangeText={setReedSpace}
                        style={styles.input}
                        theme={{ colors: { primary: '#003C43' } }}
                    />
                </View>
                <View style={styles.dateContainer}>
                    <TextInput
                        label="Date"
                        value={date ? date.toDateString() : ''}
                        style={[styles.input, { flex: 1 }]}
                        editable={false}
                        theme={{ colors: { primary: '#003C43' } }}
                    />
                    <IconButton
                        icon="calendar"
                        size={30}
                        color="#003C43"
                        onPress={() => setShow(true)}
                    />
                </View>
                {show && (
                    <DateTimePicker
                        value={date || new Date()}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />
                )}


                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => {
                            setReed('');
                            setReedSpace('');
                            setDate(null);
                        }}
                    >
                        <Text style={styles.clearButtonText}>Clear Filters</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.KnottingId.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.cardTitle}>Offer No: {item.OfferNo}</Title>
                            <Paragraph>Loom Unit: {loomNames[item.LoomId]}</Paragraph>
                            <Paragraph>Contact: {contactno[item.LoomId]}</Paragraph>
                            <Paragraph>Reed: {item.Reed}</Paragraph>
                            <Paragraph>Draft: {item.Draft}</Paragraph>
                            <Paragraph>Reed Space: {item.ReedSpace}</Paragraph>
                            <Paragraph>No.Of Looms: {item.NoofLooms}</Paragraph>
                            <Paragraph>Job Rate Required (in paisa): {item.JobRateRequired}</Paragraph>
                            <Paragraph>Available From: {new Date(item.AvailableFrom.date).toDateString()}</Paragraph>
                            {item.DesignPaper ? (
                                <TouchableOpacity
                                    style={styles.attachmentButton}
                                    onPress={() => setSelectedImage(item.DesignPaper)}
                                >
                                    <Text style={styles.attachmentText}>View Design Paper</Text>
                                </TouchableOpacity>
                            ) : null}
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={() => handleSubmit(item)}
                            >
                                <Text style={styles.buttonText}>Book Offer</Text>
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                )}
                ListEmptyComponent={
                    <View style={styles.noDataContainer}>
                        <Text>No offers found.</Text>
                    </View>
                }
            />


            <View
                style={{
                    flexDirection: 'row',
                    borderWidth: 1,
                    height: 50,
                    borderColor: '#0A5D47',
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#135D66',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 20 }}>Knotting Offers</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigation.navigate('KnottingConfirmedT')}
                    >
                        <Text style={{ color: '#003C43', fontSize: 20, padding: 5 }}>
                            Confirmed Offers
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={!!selectedImage}
                transparent={false}
                onRequestClose={() => setSelectedImage(null)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setSelectedImage(null)}
                    >
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    {selectedImage ? (
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.fullScreenImage}
                            resizeMode="contain"
                        />
                    ) : <ActivityIndicator size={70} color="green" />}
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        padding: 0,
        backgroundColor: "#003C43",
    },
    drawerButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    drawerIcon: {
        width: 30,
        height: 35,
        resizeMode: 'contain',
    },
    headerText: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        flex: 1,
    },
    searchContainer: {
        backgroundColor: "#fff",
        padding: 10,
        marginBottom: 10,
    },
    input: {
        marginBottom: 0,
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 0,
        width: "50%",
        borderBottomWidth: 1
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 0,
    },
    calendarIcon: {
        marginLeft: 10,
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
    },
    tab: {
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#003C43",
        marginHorizontal: 5,
    },
    activeTab: {
        backgroundColor: "#003C43",
    },
    tabText: {
        color: "#003C43",
    },
    activeTabText: {
        color: "#fff",
    },
    card: {
        marginBottom: 10,
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    cardText: {
        fontSize: 14,
    },
    button: {
        alignItems: "center",
        marginTop: 20,
    },
    buttonContainer: {
        backgroundColor: "#003C43",
        padding: 10,
        borderRadius: 5,
        marginTop: 20,

    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    noDataContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    noDataText: {
        fontSize: 18,
        color: "#aaa",
    },
    attachmentButton: {

        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: "flex-start",
    },
    attachmentText: {
        color: "#003C43",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        backgroundColor: "#003C43",
        padding: 10,
        borderRadius: 5,
    },
    backButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    fullScreenImage: {
        width: "100%",
        height: "80%",
    },
    clearButton: {
        backgroundColor: '#003C43',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '50%',
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});


export default KnottingOffersT
