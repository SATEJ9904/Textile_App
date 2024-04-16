import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';



const LoomBooking = () => {
  const [loomData, setLoomData] = useState([]);
  const [selectedLoom, setSelectedLoom] = useState(null);
  const [loomBookingId, setLoomBookingId] = useState([]);
  const [partyName, setPartyName] = useState('');
  const [jobRate, setJobRate] = useState('');
  const [quality, setQuality] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [bookedDateFrom, setBookedDateFrom] = useState('');
  const [bookedDateTo, setBookedDateTo] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Fetch loom data from API
    // Replace the URL with your API endpoint
    const apifetch = () => {
      fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=LoomBooking')
        .then(response => response.json())
        .then(data => {
          setLoomData(data)
          setLoomBookingId(data)
        }
        )
        .catch(error => console.error('Error fetching loom data:', error));
    }

    apifetch();
  }, []);

  const handleBlockClick = (LoomNo, BookingId) => {
    setSelectedLoom(LoomNo);
    setShowForm(true); // Show the form when a block is clicked
    setLoomBookingId(BookingId);
    console.log(BookingId)
  };

  const handleSubmit = () => {

    //console.log(loomBookingId)

    const integerNumber = parseInt(loomBookingId, 10);
    const integerNumber1 = parseInt(jobRate, 10);




    const formdata = new FormData();
    formdata.append("LoomBookingId", integerNumber);
    formdata.append("PartyName", partyName);
    formdata.append("JobRate", integerNumber1);
    formdata.append("Quality", quality);
    formdata.append("Orderdate", orderDate);
    formdata.append("BookedDateFrom", bookedDateFrom);
    formdata.append("BookedDateTo", bookedDateTo);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/postloomorder.php", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));


    console.log("Submitted Data", {
      integerNumber,
      partyName,
      integerNumber1,
      quality,
      orderDate,
      bookedDateFrom,
      bookedDateTo,
      selectedLoom
    });
   // You can add code here to send the form data to your server

    //Reset form fields after submission
    setLoomBookingId('');
    setPartyName('');
    setJobRate('');
    setQuality('');
    setOrderDate('');
    setBookedDateFrom('');
    setBookedDateTo('');
    setSelectedLoom(null);
    setShowForm(false);
  };

  const isFormFilled = () => {
    return (
      loomBookingId !== '' &&
      partyName !== '' &&
      jobRate !== '' &&
      quality !== '' &&
      orderDate !== '' &&
      bookedDateFrom !== '' &&
      bookedDateTo !== ''
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.loomContainer}>
        {loomData.map((item) => (
          <TouchableOpacity
            key={item.loomNo}
            style={[
              styles.loomBlock,
              selectedLoom === item.LoomNo ? styles.selectedLoom : null
            ]}
            onPress={() => { handleBlockClick(item.LoomNo, item.BookingId) }}>
            <Text style={styles.loomText}>{item.LoomNo}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {showForm && (
        <View style={styles.formContainer}>

          <TextInput
            style={styles.input}
            placeholder="Party Name"
            value={partyName}
            onChangeText={text => setPartyName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Job Rate"
            value={jobRate}
            onChangeText={text => setJobRate(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Quality"
            value={quality}
            onChangeText={text => setQuality(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Order Date"
            value={orderDate}
            onChangeText={text => setOrderDate(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="From Date"
            value={bookedDateFrom}
            onChangeText={date => setBookedDateFrom(date)}
          />

          <TextInput
            style={styles.input}
            placeholder="To Date"
            value={bookedDateTo}
            onChangeText={date => setBookedDateTo(date)}
          />

          <Button title="Submit" onPress={handleSubmit} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loomContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  loomBlock: {
    width: 50,
    height: 50,
    backgroundColor: 'lightgreen',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedLoomFilled: {
    backgroundColor: 'red',
  },
  selectedLoomEmpty: {
    backgroundColor: 'lightgreen',
  },
  loomText: {
    fontWeight: 'bold',
    color: '#000',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 300
  },
  datePicker: {
    marginBottom: 10,
    width: 200, // adjust width as needed
  },
});

export default LoomBooking;
