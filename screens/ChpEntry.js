import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ChpEntry = () => {
  const [formData, setFormData] = useState({
    coalMode: "",
    coalType: "",
    coalComponent: "",
    selectDeclared: "",
    selectWasheryOperator: "",
    selectMine: "",
    rrNo: "",
    rrDate: new Date(),
    receiptDate: new Date(),
    noBox: "",
    rakeNo: "",
    rrWt: "",
    tpsWt: "",
    wtAvg: "",
  });
  const [showRRDatePicker, setShowRRDatePicker] = useState(false);
  const [showReceiptDatePicker, setShowReceiptDatePicker] = useState(false);

  const firstOptions = ["Raw Coal", "Washed Coal", "Imported Coal"];
  const declaredGrade = [
    "G1(7001-7300)",
    "G2(6701-7000)",
    "G3(6401-6700)",
    "G4(6100-6400)",
    "G5(5801-6100)",
    "G6(5501-5800)",
    "G7(5201-5500)",
    "G8(4901-5200)",
    "G9(4601-4900)",
    "G10(4301-4600)",
    "G11(4001-4300)",
    "G12(3701-4000)",
    "G13(3401-3700)",
    "G14(3101-3400)",
    "G15(2801-3100)",
    "G16(2501-2800)",
    "G17(2201-2500)",
  ];
  const secondOptions = ["WCL", "MCL", "SECL", "SCCL", "OTHER"];

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        "https://mahagenco.onrender.com/api/v2/chp/chp-entry",
        formData,
        config
      );

      // Reset form data
      setFormData({
        coalMode: "",
        coalType: "",
        coalComponent: "",
        selectDeclared: "",
        selectWasheryOperator: "",
        selectMine: "",
        rrNo: "",
        rrDate: new Date(),
        receiptDate: new Date(),
        noBox: "",
        rakeNo: "",
        rrWt: "",
        tpsWt: "",
        wtAvg: "",
      });

      Alert.alert(
        "Congratulations",
        "Form Submitted Successfully!"
      );

    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to submit the form!"
      );
    }
  };

  const onRRDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.rrDate;
    setShowRRDatePicker(false);
    handleInputChange("rrDate", currentDate);
  };

  const onReceiptDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.receiptDate;
    setShowReceiptDatePicker(false);
    handleInputChange("receiptDate", currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>WTP ENTRY SECTION</Text>
      <View style={styles.inputContainer}>
        <Text>Select Mode:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.coalMode}
            onValueChange={(value) => handleInputChange("coalMode", value)}
          >
            <Picker.Item label="Please select" value="" />
            <Picker.Item label="Road" value="Road" />
            <Picker.Item label="Rail" value="Rail" />
            <Picker.Item label="Conveyor" value="Conveyor" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text>Select Coal Type:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.coalType}
            onValueChange={(value) => handleInputChange("coalType", value)}
          >
            <Picker.Item label="Please select" value="" />
            {firstOptions.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        </View>
      </View>

      {formData.coalType && (
        <View style={styles.inputContainer}>
          <Text>Select Coal Company:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.coalComponent}
              onValueChange={(value) =>
                handleInputChange("coalComponent", value)
              }
            >
              <Picker.Item label="Please select" value="" />
              {secondOptions.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {formData.coalType === "Raw Coal" && (
        <View style={styles.inputContainer}>
          <Text>Select Declared Grade:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.selectDeclared}
              onValueChange={(value) =>
                handleInputChange("selectDeclared", value)
              }
            >
              <Picker.Item label="Please select" value="" />
              {declaredGrade.map((grade, index) => (
                <Picker.Item key={index} label={grade} value={grade} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {(formData.coalType === "Raw Coal" ||
        formData.coalType === "Washed Coal") && (
        <View style={styles.inputContainer}>
          <Text>Select Mine/Siding:</Text>
          <TextInput
            style={styles.textInput}
            value={formData.selectMine}
            onChangeText={(text) => handleInputChange("selectMine", text)}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text>RR No.:</Text>
        <TextInput
          style={styles.textInput}
          value={formData.rrNo}
          onChangeText={(text) => handleInputChange("rrNo", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>RR Date:</Text>
        <TextInput
          style={styles.textInput}
          value={formData.rrDate.toLocaleDateString()}
          onFocus={() => setShowRRDatePicker(true)}
        />
        {showRRDatePicker && (
          <DateTimePicker
            value={formData.rrDate}
            mode="date"
            display="default"
            onChange={onRRDateChange}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text>Receipt Date:</Text>
        <TextInput
          style={styles.textInput}
          value={formData.receiptDate.toLocaleDateString()}
          onFocus={() => setShowReceiptDatePicker(true)}
        />
        {showReceiptDatePicker && (
          <DateTimePicker
            value={formData.receiptDate}
            mode="date"
            display="default"
            onChange={onReceiptDateChange}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text>No. of Boxes:</Text>
        <TextInput
          style={styles.textInput}
          value={formData.noBox}
          onChangeText={(text) => handleInputChange("noBox", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Rake No.:</Text>
        <TextInput
          style={styles.textInput}
          value={formData.rakeNo}
          onChangeText={(text) => handleInputChange("rakeNo", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>RR Wt:</Text>
        <TextInput
          style={styles.textInput}
          value={formData.rrWt}
          onChangeText={(text) => handleInputChange("rrWt", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>TPS Wt:</Text>
        <TextInput
          style={styles.textInput}
          value={formData.tpsWt}
          onChangeText={(text) => handleInputChange("tpsWt", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Wt Avg:</Text>
        <TextInput
          style={styles.textInput}
          value={formData.wtAvg}
          onChangeText={(text) => handleInputChange("wtAvg", text)}
        />
      </View>

      <View style={styles.submitButton}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginVertical: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 5,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
  },
});

export default ChpEntry;
