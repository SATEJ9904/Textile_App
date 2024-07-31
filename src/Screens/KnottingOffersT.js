import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Image, Modal, Pressable, Alert, RefreshControl, ScrollView } from 'react-native';
import { TextInput, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const KnottingOffersT = ({ navigation }) => {
    const [reed, setReed] = useState('');
    const [reedSpace, setReedSpace] = useState('');
    const [date, setDate] = useState(null); // Set date to null initially
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [isAllOffersActive, setIsAllOffersActive] = useState(false); // State to manage All Offers tab
    const [refreshing, setRefreshing] = useState(false);
    const [loomNames, setLoomNames] = useState({});
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        fetchData();
        return () => { isMounted.current = false; };
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=KnottingOffer');
            const result = await response.json();

            const initialFilterData = result.filter(item => !item.ConfirmTrader);
            setFilteredData(initialFilterData);
            setData(initialFilterData);
            fetchLoomNames(initialFilterData.map(item => item.LoomId));
            console.log(initialFilterData.map(item => item.LoomId))
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchLoomNames = async (loomIds) => {
        try {
            const uniqueLoomIds = [...new Set(loomIds)];
            const loomNamePromises = uniqueLoomIds.map(id => 
                fetch(`https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=${id}`)
                    .then(response => response.json())
                    .catch(error => {
                        console.error(`Error fetching loom name for ID ${id}:`, error);
                        return { Name: 'Unknown' }; // Provide a default value in case of an error
                    })
            );
    
            const loomNameResults = await Promise.all(loomNamePromises);
            console.log('Loom name results:', loomNameResults); // Log the results to inspect the response
    
            const loomNameMap = loomNameResults.reduce((map, result, index) => {
                console.log(`Processing result for Loom ID ${uniqueLoomIds[index]}:`, result); // Log each result
               result.map((item)=>{
                if (item && item.Name) {
                    map[uniqueLoomIds[index]] = item.Name;
                    console.log(item.Name)
                } else {
                    map[uniqueLoomIds[index]] = 'Unknown'; // Default value if Name is not present
                }
               })
                return map;
            }, {});
    
            setLoomNames(loomNameMap);
            console.log(loomNameMap)
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
        setIsAllOffersActive(false); // Deactivate All Offers tab when a new date is selected
    };

    const handleSubmit = async (offerId) => {
        setLoading(true);
        try {
            const traderId = await AsyncStorage.getItem('Id');
            const formdata = new FormData();
            formdata.append("Id", offerId);
            formdata.append("TraderId", traderId);

            const response = await fetch("https://textileapp.microtechsolutions.co.in/php/updateknottingoffer.php", {
                method: "POST",
                body: formdata,
                redirect: "follow"
            });

            const result = await response.text();
            setLoading(false);
            if (result.trim() === "Knotting Offer Confirmed") {
                setModal(true);
            } else {
                Alert.alert("Error", result.trim());
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
            Alert.alert("Error", "An error occurred while processing your request.");
        }
    };

    const handleAllOffersClick = () => {
        if (isAllOffersActive) {
            // Reapply previous filters if All Offers tab is clicked again
            const filtered = data.filter(item =>
                (reed ? item.Reed.toLowerCase().includes(reed.toLowerCase()) : true) &&
                (reedSpace ? item.ReedSpace.toLowerCase().includes(reedSpace.toLowerCase()) : true) &&
                (date ? new Date(item.AvailableFrom.date) >= date : true)
            );
            setFilteredData(filtered);
        } else {
            // Show all offers when All Offers tab is clicked
            setFilteredData(data.filter(item => item.ConfirmTrader === null));
            setDate(null);
        }
        setIsAllOffersActive(!isAllOffersActive); // Toggle tab active state
    };

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

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData(); // Refresh the data on pull down
        setTimeout(() => {
            if (isMounted.current) {
                setRefreshing(false);
            }
        }, 2000);
        console.log("refreshed");
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Image source={require('../Images/drawer1.png')} style={styles.drawerIcon} />
                    </TouchableOpacity>
                    <View style={{ justifyContent: "center", alignItems: "center", width: "90%" }}>
                        <Text style={styles.headerText}>Knotting Offers</Text>
                    </View>
                </View>

                <View style={styles.content}>
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
                            style={styles.calendarIcon}
                        />
                    </View>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, isAllOffersActive && styles.activeTab]}
                            onPress={handleAllOffersClick}
                        >
                            <Text style={[styles.tabText, isAllOffersActive && styles.activeTabText]}>All Offers</Text>
                        </TouchableOpacity>
                    </View>
                    {show && (
                        <DateTimePicker
                            value={date || new Date()}
                            mode="date"
                            display="default"
                            onChange={onChange}
                        />
                    )}
                    {filteredData.length > 0 ? (
                        <FlatList
                            data={filteredData}
                            keyExtractor={(item) => item.KnottingId}
                            renderItem={({ item }) => (
                                <Card style={styles.card}>
                                    <Card.Content>
                                        <Title style={styles.cardTitle}>Offer No: {item.KnottingId}</Title>
                                        <Paragraph style={styles.cardText}>Loom Unit: {loomNames[item.LoomId]}</Paragraph>
                                        <Paragraph style={styles.cardText}>Reed: {item.Reed}</Paragraph>
                                        <Paragraph style={styles.cardText}>Draft: {item.Draft}</Paragraph>
                                        <Paragraph style={styles.cardText}>Reed Space: {item.ReedSpace}</Paragraph>
                                        <Paragraph style={styles.cardText}>No of Looms: {item.NoofLooms}</Paragraph>
                                        <Paragraph style={styles.cardText}>Available From: {new Date(item.AvailableFrom.date).toDateString()}</Paragraph>
                                        <View style={styles.button}>
                                            <TouchableOpacity
                                                style={styles.buttonContainer}
                                                onPress={() => handleSubmit(item.Id)}
                                            >
                                                <Text style={styles.buttonText}>Book Offer</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Card.Content>
                                </Card>
                            )}
                        />
                    ) : (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>No offers found.</Text>
                        </View>
                    )}
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modal}
                    onRequestClose={() => setModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Offer Confirmed</Text>
                            <Pressable
                                style={styles.modalButton}
                                onPress={() => {
                                    setModal(false);
                                    navigation.goBack();
                                }}
                            >
                                <Text style={styles.modalButtonText}>Go Back</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
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
        padding: 10,
        backgroundColor: "#003C43",
    },
    drawerIcon: {
        width: 30,
        height: 30,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    content: {
        padding: 10,
    },
    input: {
        marginBottom: 10,
        backgroundColor: "white",
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
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
        marginTop: 10,
    },
    buttonContainer: {
        backgroundColor: "#003C43",
        padding: 10,
        borderRadius: 5,
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    checkImage: {
        width: 50,
        height: 50,
        marginBottom: 20,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: "#003C43",
        padding: 10,
        borderRadius: 5,
    },
    modalButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    animationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    redirectText: {
        marginTop: 20,
        fontSize: 16,
        color: '#003C43',
    },
});

export default KnottingOffersT;
