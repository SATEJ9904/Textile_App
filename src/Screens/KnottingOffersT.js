import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Image, Modal, Pressable, Alert } from 'react-native';
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=KnottingOffer');
                const result = await response.json();

                const initialFilterData = result.filter(item => !item.ConfirmTrader);
                setFilteredData(initialFilterData);
                setData(initialFilterData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image source={require('../Images/drawer1.png')} style={styles.drawerIcon} />
                </TouchableOpacity>
                <View style={{ justifyContent:"center",alignItems:"center",width:"90%"}}>
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
                        keyExtractor={(item) => item.Id.toString()}
                        renderItem={({ item }) => (
                            <Card style={styles.card}>
                                <Card.Content>
                                    <Title style={styles.cardTitle}>Offer No: {item.Id}</Title>
                                    <Paragraph style={styles.cardText}>Loom Unit: {item.LoomId}</Paragraph>
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
                                            <Text style={styles.ButtonText}>Confirm Order</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Card.Content>
                            </Card>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }} // Ensures some padding at the bottom
                    />
                ) : (
                    <Text style={styles.noDataText}>No data available</Text>
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modal}
                    onRequestClose={() => {
                        setModal(!modal);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Data Submitted Successfully</Text>
                            <View style={{ flexDirection: "column", alignItems: "center" }}>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require("../Images/success.png")}
                                />
                                <Pressable
                                    style={[styles.button1, styles.buttonClose1]}
                                    onPress={() => setModal(false)}>
                                    <Text style={styles.textStyle1}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#003C43',
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        paddingHorizontal: 10,

    },
    drawerIcon: {
        width: 28,
        height: 22,
    },
    headerText: {
        fontSize: 24,
        color: 'white',
        marginLeft: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    tab: {
        padding: 10,
        borderBottomWidth: 2,
        borderColor: 'transparent',
    },
    activeTab: {
        borderColor: '#003C43',
    },
    tabText: {
        fontSize: 16,
        color: '#003C43',
    },
    activeTabText: {
        fontWeight: 'bold',
    },
    content: {
        padding: 10,
        marginTop: "5%"
    },
    input: {
        marginBottom: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    calendarIcon: {
        marginLeft: 10,
    },
    card: {
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardText: {
        fontSize: 14,
        marginVertical: 2,
    },
    button: {
        alignItems: 'center',
        marginTop: 10,
    },
    buttonContainer: {
        backgroundColor: '#003C43',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    ButtonText: {
        color: 'white',
        fontSize: 16,
    },
    animationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    redirectText: {
        marginTop: 10,
        fontSize: 16,
        color: '#003C43',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#003C43',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button1: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
    },
    buttonClose1: {
        backgroundColor: "#2196F3",
    },
    textStyle1: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default KnottingOffersT;
