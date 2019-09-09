import React, {Component} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert} from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { Button, CheckBox } from 'react-native-elements';
import MapView from 'react-native-maps';
import Modal from "react-native-modal";
import Cache from './model/cache';
import DataSource from './model/dataSource';
import {getDisplayTime, getDisplayType} from './helpers/util'

const fetch = require('node-fetch');
const {transportationURL, transportationAPIKey, defaultTtl, useMockDataForDebug, transportationAPIFilters} = require('./model/constants');
const {filterModes} = require('./model/filter')
const cache = new Cache(defaultTtl);
const dataSource = new DataSource(transportationURL, transportationAPIKey, transportationAPIFilters, cache, fetch);



async function getModes(filters, callback) {
  if (__DEV__ && useMockDataForDebug) {
    const Timeout = require( 'await-timeout');
    const {transportationResponse} = require('./model/mockData')

    dataSource.getData = async function() {
      await Timeout.set(1000);
      return transportationResponse.result;
    }
  }

  try {
    const data = await dataSource.getData(filters);

    if (!data.transportation || !data.transportation.modes) {
      throw {name: "Something went wrong!", message: "Please try again later."} ;
    }
    
    const modes = filterModes(data.transportation.modes, filters)

    if (!modes.length) {
      throw {name: "No result found!", message: "Please adjust the filters."} ;
    }

    callback(modes);
  } catch (err) {
    callback(null, err);
  }
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

  reset = () => {
    cache.resetCache();
    this.setState({
      type: -1,
      fromDate: null,
      toDate: null,
      modes: [],
      topUpOnly: null,
      expressOnly: null
    })
  }

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

    if (this.state.expressOnly) {
      filters.expressOnly = this.state.expressOnly;
    }

    if (this.state.topUpOnly) {
      filters.topUpOnly = this.state.topUpOnly;
    }

    var app = this;

    getModes(filters, function(modes, err) {
      app.setState({isLoading: false})
      if (modes) {
        console.log(modes);
                
        app.setState({
          modalVisible: true,
          modes: modes
        });
        // alert(JSON.stringify(markers));
       
        setTimeout(function(){
          app.fitAllMarkers();
        }
        , 1000)
      } else {

        Alert.alert(err.name, err.message);
      }

    });    
  };

  markers = () => {
    const modes = this.state.modes;
    return (
      modes.map((item) => 
        <MapView.Marker.Animated
          key={`${modes.indexOf(item)}`}
          coordinate={{latitude: item.latitude,
          longitude: item.longitude}}
          title={`${item.name} (${getDisplayType(item)})`}
          description={getDisplayTime(item.departureTime)}
        />)
    )
  }

  fitAllMarkers(padding = 50) {
    this.mapView.fitToCoordinates(this.state.modes, {
      edgePadding: { top: padding, right: padding, bottom: padding, left: padding },
      animated: true,
    });
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
              enabled={!this.state.isLoading}
            />
          </View>
        </View>

        <View style={styles.checkBoxContainer}
          pointerEvents={this.state.isLoading ? 'none' : 'auto'}
        >
          <CheckBox
            center
            containerStyle={styles.checkBox}
            title='Express Only'
            checked={this.state.expressOnly}
            onPress={() => this.setState({expressOnly: !this.state.expressOnly})}
          />
          <CheckBox
            center
            containerStyle={styles.checkBox}
            title='MiKi TopUp Only'
            checked={this.state.topUpOnly}
            onPress={() => this.setState({topUpOnly: !this.state.topUpOnly})}
          />
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
              disabled={this.state.isLoading}
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
              disabled={this.state.isLoading}
              onPress={this.showToDateTimePicker} 
              titleStyle={styles.buttonTextStyle}
            />
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.reset}>
            <Button
                icon={{
                  name: "clear",
                  size: 20,
                  color: "red"
                }}  
                type="outline"
                title="Reset"
                disabled={this.state.isLoading}
                onPress={this.reset}
                titleStyle={{fontSize: 16, color: 'red'}}
                buttonStyle={{borderColor: 'red'}}
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
          animationInTiming={500}
          animationOutTiming={500}
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
    justifyContent: 'center',
    width: '100%',
    // borderBottomWidth: 0.2,
    padding: 0,
    marginTop: 40,
    marginBottom: 20
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
  checkBox: {
    padding: 0,
    margin:0,
    backgroundColor: "#F5FCF1",
    borderColor: "#F5FCF1",
  },
  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  top: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 36,
  },
  reset: {
    flex: 1,
    width: '40%',
    justifyContent: 'flex-end',
    marginBottom: 10
  },
  bottom: {
    flex: 1,
    width: '40%',
    justifyContent: 'flex-end',
    marginBottom: 60
  },
  tabStyle: {
    backgroundColor: "#F5FCF1"
  },
  buttonTextStyle: {
    fontSize: 16
  },
});
