import React, {Component} from 'react';
import { StyleSheet, Text, View, Picker, SafeAreaView, Button} from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import SegmentedControlTab from "react-native-segmented-control-tab";

const moment = require('moment');

export default class App extends Component {
  state = {
    type: -1,
    isDateTimePickerVisible: false,
  };

  handleIndexChange = index => {
    this.setState({
      type: index - 1
    });
  };

  showFromDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true, datePicker: "from" });
  };

  showToDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true, datePicker: "to" });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    if (this.state.datePicker == "from" ) {
      this.setState({ fromDate: date, datePicker: null });
    } else if (this.state.datePicker == "to" ) {
      this.setState({ toDate: date, datePicker: null });
    }

    this.hideDateTimePicker();
  };

  search = () => {
    console.log(this.state);
    alert(JSON.stringify(this.state));
  };

  toDateString = () => {
    if (this.state.toDate) {
      return moment(this.state.toDate).format('Do MMM YYYY, h:mm a');
    }

    return "Any"
  }

  fromDateString = () => {
    if (this.state.fromDate) {
      return moment(this.state.fromDate).format('Do MMM YYYY, h:mm a');
    }

    return "Any"
  }

  render() {

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.appHeader}>
          <Text style={styles.title}>Departures</Text>
        </View>
        
        <View style={styles.itemContainer}>
          <Text style={styles.itemName}>Type</Text>
          <View style={styles.picker}>
            <SegmentedControlTab
              style={styles.picker}
              values={["Any", "Train", "Bus"]}
              selectedIndex={this.state.type + 1}
              onTabPress={this.handleIndexChange}
            />
          </View>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemName}>From:</Text>
          <Text style={styles.label}>{this.fromDateString()}</Text>
          <Button title="Change" onPress={this.showFromDateTimePicker} />
            
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemName}>To:</Text>
          <Text style={styles.label}>{this.toDateString()} </Text>
          <Button title="Change" onPress={this.showToDateTimePicker} />
        </View>

        <View style={styles.itemContainer}>
          <Button title="Search" onPress={this.search} />
        </View>

        <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
              mode="datetime"
        />
        
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column'

  },
  gridView: {
    marginTop: 10,
    width: '100%',
    height: '100%',
  },
  itemContainer: {
    width: '100%',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    borderRadius: 5,
    padding: 10,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '600',
  },
  label: {
    fontSize: 18,
    color: "gray"
  },
  sectionHeader: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    alignItems: 'center',
    backgroundColor: '#636e72',
    color: 'white',
    padding: 10,
  },
  image: {
    resizeMode: 'cover',
    flex: 1, 
  },
  button:{
    width: 150,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#68a0cf',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  contentView:{
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  buttonText:{
      color:'#fff',
      textAlign:'center',
      fontSize: 18,
      fontWeight: '600',
  },
  appHeader: {
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    padding: 10
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: 'black',
  }
});
