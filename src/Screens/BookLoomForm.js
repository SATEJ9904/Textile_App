import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert, Dimensions, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const BookLoomForm = ({ route, navigation }) => {
  const { LoomDetailId } = route.params; // Assuming LoomDetailId is passed as a param

  const [loomNo, setLoomNo] = useState('');
  const [loomAvailableFrom, setLoomAvailableFrom] = useState('N/A');
  const [loomAvailableTo, setLoomAvailableTo] = useState('N/A');
  const [bookedFromDate, setBookedFromDate] = useState('N/A');
  const [bookedToDate, setBookedToDate] = useState('N/A');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [orderNo, setOrderNo] = useState('N/A');
  const [newBookedFromDate, setNewBookedFromDate] = useState(null);
  const [newBookedToDate, setNewBookedToDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to handle loading state
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    const fetchLoomDetails = async () => {
      try {
        const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=LoomBooking&Colname=LoomDetailId&Colvalue=${LoomDetailId}`);
        const result = await response.json();
        console.log(result);
        if (result && Array.isArray(result) && result.length > 0) {
          result.forEach((item) => {
            setLoomNo(item.LoomNo || 'N/A');
            setLoomAvailableFrom(item.LoomAvailableFrom?.date ? item.LoomAvailableFrom.date.substring(0, 10) : 'N/A');
            setLoomAvailableTo(item.LoomAvailableTo?.date ? item.LoomAvailableTo.date.substring(0, 10) : 'N/A');
            setBookedFromDate(item.BookedFromDate?.date ? item.BookedFromDate.date.substring(0, 10) : 'N/A');
            setBookedToDate(item.BookedToDate?.date ? item.BookedToDate.date.substring(0, 10) : 'N/A');
            setOrderNo(item.OrderNoId || 'N/A');
            setBookingId(item.BookingId || 'N/A');
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // Update loading state once fetch is complete
      }
    };

    fetchLoomDetails();
  }, [LoomDetailId]);

  const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const checkBookingDates = async () => {
    const formData = new FormData();
    formData.append('Fromdate', newBookedFromDate.toISOString().split('T')[0]);
    formData.append('Todate', newBookedToDate.toISOString().split('T')[0]);
    formData.append('LoomDetailId', LoomDetailId);

    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    };

    try {
      const response = await fetch("https://textileapp.microtechsolutions.co.in/php/checkbookdate.php", requestOptions);
      const result = await response.text();
      console.log(result);
      if (result === 'Available') {
        Alert.alert('The dates are available for booking.');
        return true;
      } else {
        Alert.alert('Error', 'The dates are not valid for booking.');
        return false;
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check booking dates.');
      console.error(error);
      return false;
    }
  };

  const handleSubmit = async () => {
    const isAvailable = await checkBookingDates();

    if (!isAvailable) {
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('BookingId', bookingId);
    formData.append('BookedFromDate', newBookedFromDate.toISOString().split('T')[0]);
    formData.append('BookedToDate', newBookedToDate.toISOString().split('T')[0]);
    formData.append('LoomAvailableTo', addMonths(newBookedToDate, 4).toISOString().split('T')[0]);

    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    };

    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/updateloomavailabilitynew.php', requestOptions);
      const result = await response.text();
      console.log(result);
      setIsSubmitting(false);
      Alert.alert('Success', 'Loom booking submitted successfully');
      navigation.goBack({BookedLoomNo :loomNo })
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to submit loom booking');
    }

    console.log(bookingId, newBookedFromDate.toISOString().split('T')[0], newBookedToDate.toISOString().split('T')[0], addMonths(newBookedToDate, 4).toISOString().split('T')[0]);
  };

  const onFromDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newBookedFromDate;
    setShowFromDatePicker(false);
    setNewBookedFromDate(currentDate);
  };

  const onToDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newBookedToDate;
    setShowToDatePicker(false);
    setNewBookedToDate(currentDate);
  };

  // Render loading indicator if data is still loading
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003C43" />
      </View>
    );
  }

  // Render form if data is fetched successfully
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../Images/back.png')} style={styles.drawerIcon} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Loom Booking</Text>
        </View>
      </View>

      <View style={styles.loomDetail}>
        <View style={styles.detailContainer}>
          <Text style={styles.detailHeader}>Loom Details :-</Text>
          <Text style={styles.loomDetailText}>Loom No: {loomNo}</Text>
          <Text style={styles.loomDetailText}>Available From: {loomAvailableFrom}</Text>
          <Text style={styles.loomDetailText}>Available To: {loomAvailableTo}</Text>
          <Text style={styles.loomDetailText}>Current Working Order No.: {orderNo}</Text>
          <Text style={styles.loomDetailText}>Booked From: {bookedFromDate}</Text>
          <Text style={styles.loomDetailText}>Booked To: {bookedToDate}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.headerLabel}>Loom Booking Form</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Booking Date From</Text>
          <TouchableOpacity style={styles.datePicker} onPress={() => setShowFromDatePicker(true)}>
            <Text style={styles.dateText}>{newBookedFromDate ? newBookedFromDate.toISOString().split('T')[0] : 'YYYY-MM-DD'}</Text>
            <Image source={require('../Images/calendar.png')} style={styles.calendarIcon} />
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={newBookedFromDate || 'YYYY-MM-DD'}
              mode="date"
              display="default"
              onChange={onFromDateChange}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Booking Date To</Text>
          <TouchableOpacity style={styles.datePicker} onPress={() => setShowToDatePicker(true)}>
            <Text style={styles.dateText}>{newBookedToDate ? newBookedToDate.toISOString().split('T')[0] : 'YYYY-MM-DD'}</Text>
            <Image source={require('../Images/calendar.png')} style={styles.calendarIcon} />
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={newBookedToDate || 'YYYY-MM-DD'}
              mode="date"
              display="default"
              onChange={onToDateChange}
            />
          )}
        </View>

        <View style={styles.submitContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <View style={styles.lottieContainer}>
                <LottieView
                  source={require('../Animation/car_animation.json')}
                  autoPlay
                  loop
                  style={styles.lottieAnimation}
                />
                <Text style={styles.redirectText}>Processing Request....</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookLoomForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#003C43',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  drawerIcon: {
    width: 28,
    height: 22,
    marginLeft: 10,
  },
  headerTitleContainer: {
    flex: 0.9,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    color: 'white',
    fontWeight: '500',
  },
  loomDetail: {
    marginTop: '6%',
    margin: '2%',
    borderRadius: 30,
  },
  detailContainer: {
    padding: '5%',
  },
  detailHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#003C43',
    marginBottom: '5%',
  },
  loomDetailText: {
    color: '#333',
    fontSize: 16,
    marginBottom: '4%',
  },
  formContainer: {
    padding: 20,
  },
  headerLabel: {
    fontSize: 22,
    color: '#003C43',
    marginBottom: 20,
    fontWeight: '600',
    marginTop: '5%',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    color: '#000',
  },
  calendarIcon: {
    width: 20,
    height: 20,
  },
  submitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#003C43',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: '5%',
    width: width * 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  redirectText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  lottieContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 100,
    height: 100,
  },
});
