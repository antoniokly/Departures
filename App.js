import React, {Component} from 'react';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator} from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { Button } from 'react-native-elements';
import MapView from 'react-native-maps';
import Modal from "react-native-modal";
import Cache from './model/cache';
import DataSource from './model/dataSource';

const {transportationURL, transportationAPIKey, defaultTtl} = require('./model/constants');
const moment = require('moment');
const fetch = require('node-fetch');
const cache = new Cache(defaultTtl);
const dataSource = new DataSource(transportationURL, transportationAPIKey, cache, fetch);


async function getData(filters, callback) {
  try {
    const data = await dataSource.getData(filters);
    callback(data);
  } catch (err) {
    callback(null, err);
  }
}

function getDisplayTime(date) {
  return  moment(date).format('Do MMM YYYY, h:mm a');
}

function getDisplayType(item) {
  var text = ["Train", "Bus"][item.typeId];
  if (item.route) {
    text += ` ${item.route}`
  }
  return text;
} 

export default class App extends Component {
  state = {
    type: -1,
    isDateTimePickerVisible: false,
    modalVisible: false,
    isLoading: false,
    modes: []
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
    this.setState({isLoading: true})
    var filters = {};

    if (this.state.type >= 0) {
      filters.typeId = this.state.type;
    }

    if (this.state.fromDate) {
      filters.departureTimeMin = this.state.fromDate;
    }

    if (this.state.toDate) {
      filters.departureTimeMax = this.state.toDate;
    }

    var app = this;

    getData(filters, function(data, err) {
      app.setState({isLoading: false})
      if (data) {
        console.log(data);
                
        app.setState({
          modalVisible: true,
          modes: data.transportation.modes
        });
        // alert(JSON.stringify(markers));

        app.fitAllMarkers();
      } else {

        alert(err);
      }

    });    
  };

  markers = () => {
    const modes = this.state.modes;
    return (
      modes.map((item) => 
        <MapView.Marker.Animated
          coordinate={{latitude: item.latitude,
          longitude: item.longitude}}
          title={`${item.name} (${getDisplayType(item)})`}
          description={getDisplayTime(item.departureTime)}
        />)
    )
  }

  fitAllMarkers() {
    this.mapView.fitToCoordinates(this.state.modes, {
      edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
      animated: true,
    });
  }

  fitToMarkersToMap() {
    const {members} = this.state;
    this.map.fitToSuppliedMarkers(members.map(m => m.id), true);
  }

  toDateString = () => {
    if (this.state.toDate) {
      return getDisplayTime(this.state.toDate);
    }

    return "Any"
  }

  fromDateString = () => {
    if (this.state.fromDate) {
      return getDisplayTime(this.state.fromDate);
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

        <View style={styles.itemContainer}>

          <View style={styles.bottom}>
            <Button
                icon={{
                  name: "search",
                  size: 20,
                  color: "gray"
                }}  
                type="outline"
                title="Search" 
                loading={this.state.isLoading}
                onPress={this.search} 
                titleStyle={{fontSize: 16}}
              />
          </View>
        </View>

        <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
              mode="datetime"
        />

        <Modal
          style={{ flex: 1, marginTop: 90,  marginHorizontal: 0 , marginBottom: 0}}
          visible={this.state.modalVisible}
          onBackdropPress={() => this.setState({ modalVisible: false })}
          >
            <View style={{ flex: 1 }}>
              <MapView 
                ref={c => this.mapView = c}
                style={{height: '100%', width: "100%"}}
                >
                {
                  this.markers()
                }
               
              </MapView>
              
            </View>
            
        </Modal>
        
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCF1',
    flexDirection: 'column',
    padding: 0,
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
    borderBottomWidth: 0.2,
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
    backgroundColor: "#F5FCF1"
  },
  buttonTextStyle: {
    fontSize: 16
  },
});
