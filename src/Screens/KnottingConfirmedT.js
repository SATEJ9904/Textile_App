import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Modal,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Paragraph, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const KnottingConfirmedT = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enlargeImage, setEnlargeImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const traderId = await AsyncStorage.getItem('Id');
      const response = await fetch(
        `https://textileapp.microtechsolutions.co.in/php/getknottingoffer.php?TraderId=${traderId}`
      );
      const result = await response.json();
  
      // Sort the data by KnottingId in descending order
      const sortedData = result.sort((a, b) => b.KnottingId - a.KnottingId);
  
      setData(sortedData); // Set the sorted data to the state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to fetch data.');
    }
  };
  

  const renderCard = ({ item }) => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Offer No: {item.OfferNo}</Title>
          <Paragraph>Reed Space: {item.ReedSpace} inches</Paragraph>
          <Paragraph>Draft: {item.Draft}</Paragraph>
          <Paragraph>Reed: {item.Reed}</Paragraph>
          <Paragraph>Job Rate Required: {item.JobRateRequired} paisa</Paragraph>
          <Paragraph>Available From: {item.AvailableFrom.date.substring(0, 10)}</Paragraph>
          <Paragraph>No. of Looms: {item.NoofLooms}</Paragraph>
          <Paragraph>Name: {item.Name}</Paragraph>
          <Paragraph>Contact No.: {item.PrimaryContact}</Paragraph>

          {item.DesignPaper && (
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(item.DesignPaper);
                setEnlargeImage(true);
              }}
              style={styles.attachmentContainer}
            >
              <Text style={styles.attachmentText}>View Design Paper</Text>
            </TouchableOpacity>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#003C43', '#135D66']} style={styles.header}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={50} color="#FFF"  />
        </TouchableOpacity>
        <View
          style={{ justifyContent: 'center', width: '80%' }}
        >
          <View style={{ flex: 0.9, alignItems: 'center',marginLeft:"-7%", }}>
            <Text style={styles.headerTitle}>Confirmed Orders</Text>
          </View>
        </View>
      </LinearGradient>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.KnottingId.toString()}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No confirmed orders found.</Text>}
        />
      )}

      {/* Modal for Enlarged Image */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={enlargeImage}
        onRequestClose={() => setEnlargeImage(false)}
      >
        <View style={styles.enlargeImageContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.enlargeImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={() => setEnlargeImage(false)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default KnottingConfirmedT;

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
    marginTop:"-5%",
    marginLeft:"-5%"
  },
  headerTitle: {
    fontSize: 23,
    color: '#FFF',
    fontWeight: '500',
  },
  listContent: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#FFF',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  attachmentContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#003C43',
    borderRadius: 5,
    alignItems: 'center',
  },
  attachmentText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  enlargeImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enlargeImage: {
    width: '90%',
    height: '70%',
  },
  backButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#003C43',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#999',
  },
});
