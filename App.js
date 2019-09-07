import React, {Component} from 'react';
import { StyleSheet, Text, View, SafeAreaView} from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { Button } from 'react-native-elements';


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
        
        <View style={styles.top}>
          <Text style={styles.itemName}>Type</Text>
          <View style={styles.picker}>
            <SegmentedControlTab
              style={styles.picker}
              tabStyle={styles.tabStyle}
              tabTextStyle={styles.buttonTextStyle}
              values={["Any", "Train", "Bus"]}
              selectedIndex={this.state.type + 1}
              onTabPress={this.handleIndexChange}
            />
          </View>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemName}>From:</Text>
          <Text style={styles.label}>{this.fromDateString()}</Text>
          <View style={styles.button}>
            <Button
              icon={{
                name: "today",
                size: 20,
                color: "gray"
              }}
              type="outline"
              title="Change" 
              onPress={this.showFromDateTimePicker} 
              titleStyle={styles.buttonTextStyle}

            />
          </View>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemName}>To:</Text>
          <Text style={styles.label}>{this.toDateString()} </Text>
          <View style={styles.button}>
            <Button
              icon={{
                name: "today",
                size: 20,
                color: "gray"
              }}            
              type="outline"
              title="Change" 
              onPress={this.showToDateTimePicker} 
              titleStyle={styles.buttonTextStyle}
            />
          </View>
        </View>

        <View style={styles.bottom}>
          <Button
              icon={{
                name: "search",
                size: 20,
                color: "gray"
              }}  
              type="outline"
              title="Search" 
              onPress={this.search} 
              titleStyle={{fontSize: 16}}
            />
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
    flexDirection: 'column',
    padding: 20,
    width: '100%'
  },
  itemContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    width: '80%',
    borderRadius: 5,
    padding: 10,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '600',
  },
  label: {
    fontSize: 18,
    color: "gray",
    padding: 5,
  },
  contentView:{
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
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
  },
  button: {
    flex: 1,
    width: '40%',
  },
  top: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 36,
  },
  bottom: {
    flex: 1,
    width: '40%',
    justifyContent: 'flex-end',
    marginBottom: 36
  },
  tabStyle: {
    backgroundColor: "#F5FCFF"
  },
  buttonTextStyle: {
    fontSize: 16
  },
});
