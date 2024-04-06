import { SafeAreaView, StyleSheet, TextInput, Text, View, StatusBar, ImageBackground, Image, Button, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';

const LoomBooking = ({ navigation }) => {


  const [blocks, setBlocks] = useState(Array.from({ length: 20 }, (_, index) => index + 1));
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [formData, setFormData] = useState({
    Enter_order_no: '',
    Quality: '',
    fromDate: new Date(),
    toDate: new Date(),
    partyName: '',
    job_rate: '',
  });
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatepicker, setShowToDatepicker] = useState(false);
  const [blockSubmitted, setBlockSubmitted] = useState(Array(20).fill(false));

  const handleBlockPress = (index) => {
    setSelectedBlock(index);
  };

  const handleFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData({ ...formData, fromDate: selectedDate });
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    setShowToDatepicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData({ ...formData, toDate: selectedDate });
    }
  };

  const showFromDatepicker = () => {
    setShowFromDatePicker(true);
  };

  const showTo_Datepicker = () => {
    setShowToDatepicker(true);
  };

  const handleFormSubmit = () => {
    if (
      formData.Enter_order_no &&
      formData.Quality &&
      formData.partyName &&
      formData.job_rate
    ) {
      console.log("Block Number:", blocks[selectedBlock]);
      console.log("Submitted Data:", formData);
      const updatedBlockSubmitted = [...blockSubmitted];
      updatedBlockSubmitted[selectedBlock] = true;
      setBlockSubmitted(updatedBlockSubmitted);
    }
    setSelectedBlock(null);
    setFormData({
      Enter_order_no: '',
      Quality: '',
      fromDate: new Date(),
      toDate: new Date(),
      partyName: '',
      job_rate: '',
    });
  };

  const isWithinBookingPeriod = (fromDate, toDate) => {
    const now = new Date();
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return now >= from && now <= to;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e5f2fe" }}>
      <StatusBar backgroundColor={"#0b659a"}></StatusBar>
      <View style={{ backgroundColor: "#71B7E1", flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <ImageBackground
            source={require("../Images/back.png")}
            style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#71B7E1", marginTop: 15, marginRight: 0, marginLeft: 10 }}
            imageStyle={{ borderRadius: 0 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, color: "white", margin: "2.5%", marginLeft: "25%" }}>Loom Booking</Text>
      </View>
      <ScrollView>


        <View style={styles.container}>
          <View style={styles.blocksContainer}>
            {blocks.map((number, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.block,
                  {
                    backgroundColor: blockSubmitted[index]
                      ? isWithinBookingPeriod(formData.fromDate, formData.toDate)
                        ? 'green'
                        : 'red'
                      : 'green',
                  },
                ]}
                onPress={() => handleBlockPress(index)}
                disabled={blockSubmitted[index]}
              >
                <Text style={styles.blockText}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedBlock !== null && (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter Order No"
                placeholderTextColor={"#000"}
                value={formData.Enter_order_no}
                onChangeText={(text) => setFormData({ ...formData, Enter_order_no: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Quality"
                placeholderTextColor={"#000"}

                value={formData.Quality}
                onChangeText={(text) => setFormData({ ...formData, Quality: text })}
              />
              <View style={styles.dateContainer}>

                <View style={styles.dateContaine1r}>
                  <TextInput
                    style={[styles.input,{marginLeft:"12%"}]}
                    placeholder="From Date"
                    placeholderTextColor={"#000"}

                    value={formData.fromDate.toDateString()}
                    onChangeText={(text) => setFormData({ ...formData, fromDate: text })}
                  />

                  <TouchableOpacity  onPress={showFromDatepicker} >
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={require("../Images/calendar.png")}
                    />
                  </TouchableOpacity>
                </View>

                {showFromDatePicker && (
                  <DateTimePicker
                    testID="fromDatePicker"
                    value={formData.fromDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleFromDateChange}
                  />
                )}
              </View>
              <View style={styles.dateContainer}>
                <View style={styles.dateContaine1r}>
                  <TextInput
                    style={[styles.input,{marginLeft:"12%"}]}
                    placeholder="To Date"
                    placeholderTextColor={"#000"}

                    value={formData.toDate.toDateString()}
                    onChangeText={(text) => setFormData({ ...formData, toDate: text })}
                  />
                  <TouchableOpacity  onPress={showTo_Datepicker} >
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={require("../Images/calendar.png")}
                    />
                  </TouchableOpacity>
                </View>
                {showToDatepicker && (
                  <DateTimePicker
                    testID="toDatePicker"
                    value={formData.toDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleToDateChange}
                  />
                )}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Party Name"
                placeholderTextColor={"#000"}

                value={formData.partyName}
                onChangeText={(text) => setFormData({ ...formData, partyName: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Job Rate"
                placeholderTextColor={"#000"}

                value={formData.job_rate}
                onChangeText={(text) => setFormData({ ...formData, job_rate: text })}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleFormSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LoomBooking

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "25%",
    backgroundColor: '#e5f2fe',
  },
  blocksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  block: {
    width: 50,
    height: 50,
    backgroundColor: 'green',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockText: {
    color: 'white',
    fontSize: 18,
  },
  formContainer: {
    alignItems: 'center',
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "#000"
  },
  submitButton: {
    backgroundColor: '#71B7E1',
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateContaine1r: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})