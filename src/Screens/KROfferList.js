import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Alert,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const KROfferList = ({ navigation }) => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                // Retrieve LoomId from AsyncStorage
                const loomId = await AsyncStorage.getItem('Id');
                if (!loomId) {
                    Alert.alert('Error', 'Loom ID not found');
                    setLoading(false);
                    return;
                }

                // Fetch data from the API
                const response = await fetch(
                    `https://textileapp.microtechsolutions.co.in/php/getknottingoffer.php?LoomId=${loomId}`
                );
                const data = await response.json();

                // Filter the data
                const filteredOffers = data
                    .filter(
                        (order) =>
                            order.LoomId == loomId &&
                            order.ConfirmTrader !== 0 &&
                            order.ConfirmLoom !== 1
                    )
                    .sort((a, b) => b.OfferNo.substring(2, 4) - a.OfferNo.substring(2, 4)); // Sort in descending order

                // Remove duplicates by OfferNo
                const uniqueOffers = [];
                const seenOfferNos = new Set();

                for (const offer of filteredOffers) {
                    if (!seenOfferNos.has(offer.OfferNo)) {
                        uniqueOffers.push(offer);
                        seenOfferNos.add(offer.OfferNo);
                    }
                }

                // Update the state
                setOffers(uniqueOffers);
            } catch (error) {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to load offers. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchOffers();
    }, []);

    const renderOffer = ({ item }) => (
        <TouchableOpacity
            style={styles.offerCard}
            onPress={() => navigation.navigate('KnottingResponses', { OfferNo: item.OfferNo })} // Pass KnottingId
        >
            <Text style={styles.offerText}>Offer No: {item.OfferNo}</Text>
        </TouchableOpacity>

    );


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#003C43" />
                <Text>Loading offers...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#003C43', '#135D66']} style={styles.header}>
                <TouchableOpacity
                    style={styles.drawerButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="chevron-left" size={40} color="#FFF" />
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', width: '80%' }}>
                    <View style={{ flex: 0.9, alignItems: 'center', marginLeft: '-7%' }}>
                        <Text style={styles.headerTitle}>Knotting Offers</Text>
                    </View>
                </View>
            </LinearGradient>

            <FlatList
                data={offers}
                keyExtractor={(item) => item.OfferNo.toString()}
                renderItem={renderOffer}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No confirmed offers found.</Text>
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
                        <Text style={{ color: '#fff', fontSize: 20 }}>Kontting Offers</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigation.navigate('ConfirmOrderKnotting')}
                    >
                        <Text style={{ color: '#003C43', fontSize: 20, padding: 5 }}>
                            Confirmed Orders
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        marginLeft: '-3%',
    },
    headerTitle: {
        fontSize: 23,
        color: '#FFF',
        fontWeight: '500',
    },
    listContainer: {
        padding: 15,
    },
    offerCard: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    offerText: {
        fontSize: 18,
        color: '#003C43',
        fontWeight: '500',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default KROfferList;
