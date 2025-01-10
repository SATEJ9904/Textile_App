import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const GenerateOffers = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedIdentity, setSelectedIdentity] = useState(0);
  const [dropdownValue, setDropdownValue] = useState(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [open, setOpen] = useState(false);

  const [radioOptions, setRadioOptions] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  useEffect(() => {
    // Fetch radio button options
    fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=OfferOpt')
      .then(response => response.json())
      .then(data => {
        setRadioOptions(data);
        // Set default selection if data is available
        if (data.length > 0) {
          setSelectedOption(data[0].Name);
        }
      })
      .catch(error => console.error('Error fetching radio button options:', error));

    // Fetch dropdown menu options
    fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=ProductOpt')
      .then(response => response.json())
      .then(data => {
        setDropdownOptions(data);
        // Set default dropdown value if data is available
        if (data.length > 0) {
          setDropdownValue(data[0].Id.toString());
        }
      })
      .catch(error => console.error('Error fetching dropdown menu options:', error));
  }, []);

  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Accept all file types
        allowMultiSelection: true
      });
      setDocument(doc);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled the upload", err);
      } else {
        console.log(err);
      }
    }
  };
  const handleCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(image);
    });
  };

  const handleGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(image);
    });
  };

  const handleCreateOffer = async () => {

    let radio = radioOptions.find(option => option.Name === selectedOption)?.Id || null

    // console.log(radio,"Image Data Source = ",image.path,"Document Data Source",document[0]?.uri,selectedOption,selectedIdentity,dropdownValue,description)

    try {
      const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader");
      let LoomId = "";
      let TraderId = "";
      let YarnId = "";

      if (LoomOrTrader === "L") {
        LoomId = await AsyncStorage.getItem("Id");
      } else if (LoomOrTrader === "T") {
        TraderId = await AsyncStorage.getItem("Id");
      } else if (LoomOrTrader === "Y") {
        YarnId = await AsyncStorage.getItem("Id");
      }

      const formData = new FormData();
      formData.append("YarnId", YarnId || "");
      formData.append("LoomId", LoomId || "");
      formData.append("TraderId", TraderId || "");
      formData.append("OfferOptId", radio);
      formData.append("ProductOptId", dropdownValue || "");
      formData.append("Description", description);

      if (image) {
        formData.append("Photopath", {
          uri: image.path,
          name: 'photo.jpg',
          type: image.mime
        });
      }

      if (document && document.length > 0) {
        formData.append("Document", {
          uri: document[0]?.uri,
          name: document[0]?.name,
          type: document[0]?.type
        });
      }

      formData.append("Privacy", selectedIdentity);

      const requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow"
      };

      fetch("https://textileapp.microtechsolutions.co.in/php/postmarketoffer.php", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result);
          Alert.alert("Success", "Offer created successfully!");
        })
        .catch(error => {
          console.error(error);
          Alert.alert("Error", "Failed to create offer.");
        });

    } catch (error) {
      console.log("Error fetching AsyncStorage data", error);
      Alert.alert("Error", "Failed to retrieve data.");
    }

    // setSelectedOption(null)
     setSelectedIdentity("Don't show my identity & message me")
    // setDropdownValue(null)
    // setDescription(null)
    // setImage(null)
    // setDocument(null)
  };

  const handleCancelImage = () => {
    setImage(null);
  };

  const handleCancelDocument = () => {
    setDocument(null);
  };

  const renderImagePreview = () => {
    if (image) {
      return (
        <View style={styles.previewContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelImage}>
            <Ionicons name="close-circle" size={28} color="red" />
          </TouchableOpacity>
          <Image
            source={{ uri: image.path }}
            style={styles.imagePreview}
          />
        </View>
      );
    }
    return null;
  };

  const renderDocumentPreview = () => {
    if (document && document.length > 0) {
      return (
        <View style={styles.previewContainer}>
          {document.map((doc, index) => (
            <View key={index} style={styles.documentContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelDocument}>
                <Ionicons name="close-circle" size={24} color="red" />
              </TouchableOpacity>
              <Text style={styles.documentText}>{doc.name}</Text>
            </View>
          ))}
        </View>
      );
    }
    return null;
  };

  const items = dropdownOptions.map(option => ({
    label: option.Name, // Displayed in the dropdown
    value: option.Id.toString(), // Value when selected
  }));


  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#003C43', '#006A6B']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../Images/back.png")}
            style={styles.drawerIcon}
          />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={styles.title}>Generate Offers</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.heading}>Select an option:</Text>
          <View style={styles.radioButtonContainer}>
            {radioOptions.map(option => (
              <TouchableOpacity
                key={option.Id}
                style={selectedOption === option.Name ? styles.radioButtonSelected : styles.radioButton}
                onPress={() => setSelectedOption(option.Name)}
              >
                <Text style={selectedOption === option.Name ? styles.radioButtonTextSelected : styles.radioButtonText}>
                  {option.Name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>

      
        <DropDownPicker
        open={open}
        value={dropdownValue}
        items={items}
        setOpen={setOpen}
        setValue={setDropdownValue}
        placeholder="Select an option"
        showArrowIcon={true} // Adds a dropdown arrow
        style={styles.dropdownStyle} // Styles the dropdown input
        dropDownContainerStyle={styles.dropDownContainerStyle} // Styles the dropdown list
      />
    </View>

        <View style={styles.section}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Description"
            placeholderTextColor={"#888"}
            multiline={true}
            numberOfLines={5}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>

        <View style={styles.section}>
          {renderImagePreview()}
          {renderDocumentPreview()}
        </View>

        <View style={styles.uploadContainer}>
          <TouchableOpacity style={styles.uploadButton} onPress={handleCamera}>
            <Ionicons name="camera" size={24} color="#003C43" />
            <Text style={styles.uploadButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={handleGallery}>
            <Ionicons name="images" size={24} color="#003C43" />
            <Text style={styles.uploadButtonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={selectDoc}>
            <Ionicons name="document" size={24} color="#003C43" />
            <Text style={styles.uploadButtonText}>Document</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Identity Preference:</Text>
          <View style={styles.radioButtonContainer}>
            <TouchableOpacity
              style={selectedIdentity === 0 ? styles.radioButtonSelected : styles.radioButton}
              onPress={() => setSelectedIdentity(0)}
            >
              <Text style={selectedIdentity === 0 ? styles.radioButtonTextSelected : styles.radioButtonText}>
                Don't show my identity & message me
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={selectedIdentity === 1 ? styles.radioButtonSelected : styles.radioButton}
              onPress={() => setSelectedIdentity(1)}
            >
              <Text style={selectedIdentity === 1 ? styles.radioButtonTextSelected : styles.radioButtonText}>
                Show my identity & message me
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.createOfferButton}
            onPress={handleCreateOffer}
          >
            <Text style={styles.createOfferButtonText}>Create Offer</Text>
          </TouchableOpacity>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: height * 0.060, // Adjusted height for the header
    paddingHorizontal: width * 0.05, // Adjusted padding
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  drawerIcon: {
    width: width * 0.05, // Adjusted icon size
    height: height * 0.03,
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 25, // Adjusted font size
    color: "white",
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
  },
  content: {
    padding: width * 0.05, // Responsive padding
  },
  section: {
    marginBottom: height * 0.03, // Responsive margin
  },
  heading: {
    fontSize: 22, // Adjusted font size
    color: "#003C43",
    marginBottom: height * 0.02, // Responsive margin
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
  },
  dropdownStyle: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    color:"#000",
    borderRadius: 5,
  },
  dropDownContainerStyle: {
    backgroundColor: '#f9f9f9',
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04, // Adjusted padding
    backgroundColor: "#fff",
    borderColor: "#003C43",
    borderWidth: 2,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: width * 0.02, // Responsive margin
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  radioButtonSelected: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04, // Adjusted padding
    backgroundColor: "#006A6B",
    borderColor: "#006A6B",
    borderWidth: 2,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  radioButtonText: {
    fontSize: 18, // Adjusted font size
    color: "#003C43",
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
  },
  radioButtonTextSelected: {
    fontSize: 18, // Adjusted font size
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
  },
  descriptionInput: {
    borderColor: "#003C43",
    borderWidth: 2,
    borderRadius: 12,
    padding: width * 0.05, // Responsive padding
    fontSize: 18, // Adjusted font size
    fontFamily: "sans-serif-condensed",
    color: "#003C43",
    backgroundColor: "#fff",
    textAlignVertical: 'top',
    elevation: 3,
  },
  uploadContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Adjusted for better spacing
  },
  uploadButton: {
    padding: width * 0.03, // Responsive padding
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: width * 0.02, // Responsive margin
    elevation: 3,
  },
  uploadButtonText: {
    marginTop: height * 0.01, // Responsive margin
    fontSize: 15, // Responsive font size
    color: "#003C43",
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
  },
  createOfferButton: {
    backgroundColor: "#006A6B",
    paddingVertical: height * 0.007, // Responsive padding
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    marginTop: "5%"
  },
  createOfferButtonText: {
    fontSize: 20, // Responsive font size
    color: "white",
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
  },
  previewContainer: {
    marginBottom: height * 0.02, // Responsive margin
  },
  imagePreview: {
    width: '100%',
    height: height * 0.3, // Adjusted height
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01, // Responsive margin
  },
  documentText: {
    fontSize: width * 0.045, // Responsive font size
    color: "#003C43",
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
    marginRight: width * 0.02, // Responsive margin
  },
  cancelButton: {
    marginRight: width * 0.02, // Responsive margin
    alignSelf: "flex-end"
  },
  pickerSelectStyles: {
    inputIOS: {
      fontSize: width * 0.045, // Responsive font size
      paddingVertical: height * 0.015, // Responsive padding
      paddingHorizontal: width * 0.05,
      borderWidth: 2,
      borderColor: "#003C43",
      borderRadius: 12,
      color: "#003C43",
      paddingRight: 30,
      backgroundColor: "#fff",
      elevation: 3,
    },
    inputAndroid: {
      fontSize: width * 0.045, // Responsive font size
      paddingVertical: height * 0.015, // Responsive padding
      paddingHorizontal: width * 0.05,
      borderWidth: 2,
      borderColor: "#003C43",
      borderRadius: 12,
      color: "#003C43",
      paddingRight: 30,
      backgroundColor: "#fff",
      elevation: 3,
    },
  }
});

export default GenerateOffers;
