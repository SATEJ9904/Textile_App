import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Image,
    Alert,
    FlatList,
    Linking,
    PermissionsAndroid,
    Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native'; // Import LottieView


const KnottingResponses = ({ route, navigation }) => {
    const { OfferNo } = route.params; // Retrieve OfferNo from navigation
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageVisible, setImageVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [traderDetails, setTraderDetails] = useState(null); // Store trader details for modal
    const [traderModalVisible, setTraderModalVisible] = useState(false);
    const [showLottie, setShowLottie] = useState(false); // State to manage Lottie animation visibility
    const [lottieMessage, setLottieMessage] = useState(''); // State to manage Lottie animation message

    useEffect(() => {


        fetchData();
    }, [OfferNo]);

    const fetchData = async () => {
        try {
            const response = await fetch(
                `https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=KnottingOffer&Colname=OfferNo&Colvalue=${OfferNo}`
            );
            const result = await response.json();

            const normalizedData = Array.isArray(result) ? result : result;
            console.log("is array", normalizedData)
            const filteredData = normalizedData.filter(
                (item) => item.ConfirmTrader === 1 && item.ConfirmLoom !== 1 && item.Orderfinish === null
            );

            const updatedData = await Promise.all(
                filteredData.map(async (item) => {
                    try {
                        const traderResponse = await fetch(
                            `https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=${item.TraderId}`
                        );
                        const traderResult = await traderResponse.json();
                        return {
                            ...item,
                            TraderName: traderResult[0]?.Name || 'Unknown',
                            TraderDetails: traderResult[0] || null,
                        };
                    } catch (error) {
                        console.error('Error fetching trader details:', error);
                        return { ...item, TraderName: 'Unknown', TraderDetails: null };
                    }
                })
            );

            setData(updatedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };




    const makeCall = async (phoneNumber) => {
        const url = `tel:${phoneNumber}`; // URL for making the call

        // Handle Android permissions
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CALL_PHONE,
                    {
                        title: 'Call Permission',
                        message: 'This app needs access to make calls.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('Permission Denied', 'Cannot make a call without permission.');
                    return;
                }
            } catch (err) {
                console.error('Error requesting permission:', err);
                Alert.alert('Error', 'Failed to request call permission.');
                return;
            }
        }

        // Attempt to make the call
        try {
            const supported = await Linking.canOpenURL(url);
            if (!supported) {
                Alert.alert('Error', 'Unable to open the dialer.');
            } else {
                await Linking.openURL(url); // Opens the dialer
            }
        } catch (error) {
            console.error('Error while making a call:', error);
            Alert.alert('Error', 'Failed to make the call.');
        }
    };

    const openTraderModal = (details) => {
        setTraderDetails(details);
        setTraderModalVisible(true);
    };


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#003C43" />
                <Text>Loading offer details...</Text>
            </View>
        );
    }

    if (!data || data.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <LinearGradient colors={['#003C43', '#135D66']} style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.drawerButton}>
                        <Icon name="chevron-left" size={50} color="#FFF" />
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center', width: '80%' }}>
                        <View style={{ flex: 0.9, alignItems: 'center', marginLeft: '-7%' }}>
                            <Text style={styles.headerTitle}>Offer Details</Text>
                        </View>
                    </View>
                </LinearGradient>

                <Text style={styles.errorText}>No data available for this offer.</Text>
            </View>
        );
    }




    const renderItem = ({ item }) => (
        <View style={styles.detailsContainer}>
            <TouchableOpacity
                style={styles.infoButton}
                onPress={() => openTraderModal(item.TraderDetails)}
            >
                <Icon name="information-outline" size={24} color="#888" />
            </TouchableOpacity>
            <Text style={styles.detailText}>Offer No: {item.OfferNo}</Text>
            <Text style={styles.detailText}>Reed: {item.Reed}</Text>
            <Text style={styles.detailText}>Draft: {item.Draft}</Text>
            <Text style={styles.detailText}>Reed Space: {item.ReedSpace}</Text>
            <Text style={styles.detailText}>No of Looms: {item.NoofLooms}</Text>
            <Text style={styles.detailText}>Job Rate Required: {item.JobRateRequired}</Text>
            <Text style={styles.detailText}>Trader Name: {item.TraderName}</Text>
            <Text style={styles.detailText}>
                Available From: {item.AvailableFrom?.date?.substring(0, 10)}
            </Text>

            {item.DesignPaper && (
                <TouchableOpacity onPress={() => {
                    setSelectedImage(item.DesignPaper);
                    setImageVisible(true);
                }}>
                    <Text style={styles.attachmentText}>View Design Paper</Text>
                </TouchableOpacity>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => startOrder(item)}
                >
                    <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => cancelOrder(item)}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>


        </View>
    );

    const startOrder = async (order) => {
        Alert.alert(
            "Start Order",
            `Are you sure you want to start this order with  ${order.TraderName}`,
            [
                {
                    text: "No",
                    onPress: () => console.log("Order start canceled"),
                    style: "cancel", // Optional: Styling for the No button
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            setShowLottie(true);
                            const confirmed = true;
                            const formdata = new FormData();
                            formdata.append("Id", order.KnottingId);
                            formdata.append("ConfirmLoom", confirmed);

                            const requestOptions = {
                                method: "POST",
                                body: formdata,
                                redirect: "follow",
                            };

                            const response = await fetch(
                                "https://textileapp.microtechsolutions.co.in/php/confirmknottingoffer.php",
                                requestOptions
                            );
                            const result = await response.text();

                            Alert.alert("Order Confirmed Successfully !!!");
                            console.log("Order updated successfully");
                            setShowLottie(false); // Hide the Lottie animation
                            fetchData();
                            navigation.navigate("LoomBooking", { KnottingId: order.KnottingId });
                            console.log(result);
                        } catch (error) {
                            console.error(error);
                            setShowLottie(false); // Hide the Lottie animation in case of error
                        }
                    },
                },
            ]
        );
    };


    const cancelOrder = async (order) => {
        Alert.alert(
            "Cancel Order",
            `Are you sure you want to Cancel this order with ${order.TraderName}`,
            [
                {
                    text: "No",
                    onPress: () => console.log("Order cancellation canceled"),
                    style: "cancel", // Optional: Styling for the No button
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            setShowLottie(true);
                            const confirmed = false;
                            const formdata = new FormData();
                            formdata.append("Id", order.KnottingId);
                            formdata.append("ConfirmLoom", confirmed);

                            const requestOptions = {
                                method: "POST",
                                body: formdata,
                                redirect: "follow",
                            };

                            const response = await fetch(
                                "https://textileapp.microtechsolutions.co.in/php/confirmknottingoffer.php",
                                requestOptions
                            );
                            const result = await response.text();

                            Alert.alert("Order canceled Successfully !!!");
                            console.log("Order updated successfully");
                            setShowLottie(false); // Hide the Lottie animation
                            console.log(result);
                            fetchData();
                        } catch (error) {
                            console.error(error);
                            setShowLottie(false); // Hide the Lottie animation in case of error
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {showLottie && (
                <View style={styles.lottieContainer}>
                    <LottieView
                        source={require('../Animation/car_animation.json')} // Provide the path to your Lottie JSON file
                        autoPlay
                        loop
                    />
                    <Text style={styles.lottieText}>{lottieMessage}</Text>
                </View>
            )}

            <LinearGradient colors={['#003C43', '#135D66']} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.drawerButton}>
                    <Icon name="chevron-left" size={50} color="#FFF" />
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', width: '80%' }}>
                    <View style={{ flex: 0.9, alignItems: 'center', marginLeft: '-7%' }}>
                        <Text style={styles.headerTitle}>Offer Details</Text>
                    </View>
                </View>
            </LinearGradient>

            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 15 }}
            />

            <Modal visible={traderModalVisible} transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            onPress={() => setTraderModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                        {traderDetails && (
                            <View>
                                <Image
                                    source={{ uri: traderDetails.Profilepic }}
                                    style={styles.profileImage}
                                />
                                <Text style={styles.traderDetailText}>Name:   {traderDetails.Name}</Text>
                                <Text style={styles.traderDetailText}>AppUserId:   {traderDetails.AppUserId}</Text>
                                <Text style={styles.traderDetailText}>Owner Name:   {traderDetails.OwnerName}</Text>
                                <Text style={styles.traderDetailText}>Address:   {traderDetails.Address} {traderDetails.City} {traderDetails.State} {traderDetails.Pincode}</Text>
                                <TouchableOpacity onPress={() => makeCall(traderDetails.PrimaryContact)}>
                                    <Text style={styles.traderDetailText}>
                                        Primary Contact: <Text style={{ color: '#1E90FF', textDecorationLine: 'underline' }}>{traderDetails.PrimaryContact}</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

            <Modal visible={imageVisible} transparent>
                <View style={styles.modalContainer}>
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />
                    <TouchableOpacity
                        onPress={() => setImageVisible(false)}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 15,
        elevation: 5,
    },
    drawerButton: {
        padding: 10,
        marginTop: '-5%',
        marginLeft: '-5%',
    },
    headerTitle: {
        fontSize: 23,
        color: '#FFF',
        fontWeight: '500',
    },
    detailsContainer: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        elevation: 3,
    },
    detailText: {
        fontSize: 16,
        color: '#003C43',
        marginBottom: 10,
    },
    attachmentText: {
        fontSize: 16,
        color: '#1E90FF',
        textDecorationLine: 'underline',
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '90%',
        height: '70%',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#003C43',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,

    },
    errorText: {
        fontSize: 16,
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    startButton: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
    },
    cancelButton: {
        backgroundColor: '#DC3545',
        padding: 15,
        borderRadius: 10,
        flex: 1,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
    },
    infoButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 5, // Increased padding
        borderRadius: 30, // Adjusted radius for a larger circle
        justifyContent: 'center', // Ensure icon stays centered
        alignItems: 'center',
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: "22%",
    },
    traderDetailText: {
        fontSize: 20,
        color: '#000',
        marginBottom: "5%",
        fontWeight: "600"
    },
    closeButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#FF5733',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    closeButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default KnottingResponses;
