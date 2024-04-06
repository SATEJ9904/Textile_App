import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const InputTableForm = () => {
  const [rows, setRows] = useState([{ id: 0, date: new Date(), gatePassNumber: '' }]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const addRow = () => {
    const newRow = {
      id: rows.length,
      date: rows[selectedDateIndex].date,
      gatePassNumber: ''
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleChangeDate = (id, selectedDate) => {
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, date: selectedDate || row.date };
      }
      return row;
    });
    setRows(newRows);
  };

  const handleChangeGatePassNumber = (id, value) => {
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, gatePassNumber: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const handleSubmit = () => {
    console.log(rows);
  };

  return (
    <View style={styles.container}>
      {rows.map(row => (
        <View key={row.id} style={styles.row}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{row.date.toDateString()}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Gate Pass Number"
            value={row.gatePassNumber}
            onChangeText={value => handleChangeGatePassNumber(row.id, value)}
          />
          <TouchableOpacity onPress={() => removeRow(row.id)}>
            <Text style={styles.removeButton}>Remove</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                handleChangeDate(row.id, selectedDate || row.date);
              }}
            />
          )}
        </View>
      ))}
      <TouchableOpacity onPress={addRow}>
        <Text style={styles.addButton}>Add Row</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.submitButton}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    marginRight: 10,
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    marginTop: 10,
    fontSize: 16,
    color: 'blue',
  },
  removeButton: {
    fontSize: 16,
    color: 'red',
    marginLeft: 10,
  },
  submitButton: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});

export default InputTableForm;