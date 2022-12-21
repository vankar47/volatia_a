import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Text,
} from 'react-native';

import ScreenWrapper from './../components/ScreenWrapper';
import Images from '../constants/Images';
import DeviceInfo from 'react-native-device-info';
import CustomButton from '../components/CustomButton';
import PickerSelect from '../components/PickerSelect';
import {getRequest, postWithParams} from '../services/request';
import {getData, removeData, storeData} from '../store/storage';
import Colors from '../constants/Colors';

class ScheduleServiceFilterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      primaryColor: '#00b7ff',
      secondaryColor: '#d3dbdb',
      LogoImg: '',
      isTablet: false,
      filterData: {
        year: '',
        month: '',
        status: '',
        interpreterPreference: '',

        language: '',
        service: '',
        facility: '',
      },
      selectedYear: false,

      year: [{label: ' ', value: ''}],
      month: [{label: '', value: ''}],
      service: [{label: ' ', value: ''}],
      interpreterPreference: [{label: ' ', value: ''}],
      status: [{label: ' ', value: ''}],
      // interpreter: [{label: ' ', value: ''}],
      language: [{label: ' ', value: ''}],
      facility: [{label: ' ', value: ''}],
    };
  }

  async componentDidMount() {
    const {filterData} = this.state;

    const result = await getData('AllColors');
    const output = JSON.parse(result);
    console.log('result filter', result);
    this.setState({
      primaryColor: output.primaryColor,
      secondaryColor: output.secondaryColor,
      LogoImg: output.logoUrl,
    });

    const isTablet = DeviceInfo.isTablet();
    let orientation;
    if (isTablet) {
      if (height > width) {
        orientation = 'portrait';
      } else {
        orientation = 'landscape';
      }
    }
    this.setState({isTablet, orientation});

    if (isTablet) {
      for (let key in filterData) {
        if (this.props.route.params.filterData[key]) {
          filterData[key] = this.props.route.params.filterData[key];
        }
      }
      this.setState({filterData});
    } else {
      for (let key in filterData) {
        if (this.props.route.params[key]) {
          filterData[key] = this.props.route.params[key];
        }
      }
    }

    console.log('params', this.props.route.params);

    // this._GetData();
    const accessToken = await getData('AccessToken');

    try {
      const pickerData = {};

      this.setState({pickerData});
      const res = await getRequest(
        '/api/Options/GetWorkOrderSearchOptions',
        accessToken,
      );
      const responseData = res.result.data;

      console.log(responseData);

      // const {year} = this.state;

      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          responseData[key] = responseData[key].map((obj) => ({
            label: obj.Name,
            value: key === 'years' ? obj.Name : obj.Value,
          }));
        }
      }
      const {
        years,
        months,
        services,
        statuses,
        interpreterPreferences,
        // interpreters,
        languages,
        facilities,
      } = responseData;

      console.log(years);

      // let array = years.map((obj) => ({label: obj.Name, value: obj.Value}));

      this.setState({
        ...this.state,
        ...{
          year: years,
          month: months,
          service: services,
          status: statuses,
          interpreterPreference: interpreterPreferences,
          // interpreter: interpreters,
          language: languages,
          facility: facilities,
        },
      });
    } catch (err) {
      console.log(err.message);
    }
    // const storeFilterData = storeData(
    //   'filteredData',
    //   JSON.stringify(this.state.filterData),
    // );

    const getFilteredData = await removeData('filteredData');

    // const updatedData = JSON.parse(getStoredData);

    // console.log('updatedData', updatedData);
  }

  _GetData = async (selectedMenu) => {
    console.log('testttt');
    this.setState({selectedMenu});
    const accessToken = await getData('AccessToken');

    try {
      const pickerData = {};

      this.setState({pickerData});
      const res = await getRequest(
        '/api/Options/GetWorkOrderSearchOptions',
        accessToken,
      );
      const responseData = res.result.data;

      console.log('this is response of picker', responseData);

      // const {year} = this.state;

      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          responseData[key] = responseData[key].map((obj) => ({
            label: obj.Name,
            value: key === 'years' ? obj.Name : obj.Value,
          }));
        }
      }
      const {
        years,
        months,
        services,
        statuses,
        interpreterPreferences,
        // interpreters,
        languages,
        facilities,
      } = responseData;

      console.log(years);

      // let array = years.map((obj) => ({label: obj.Name, value: obj.Value}));

      this.setState({
        ...this.state,
        ...{
          year: years,
          month: months,
          service: services,
          status: statuses,
          interpreterPreference: interpreterPreferences,
          // interpreter: interpreters,
          language: languages,
          facility: facilities,
        },
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  render() {
    const {
      filterData,
      year,
      month,
      status,
      // interpreter,
      interpreterPreference,
      language,
      service,
      facility,
    } = this.state;
    console.log(year);

    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <TouchableOpacity
              activeOpacity={0.3}
              style={styles.crossBtnContainer}
              onPress={() => this.props.navigation.goBack()}>
              <Image
                source={Images.CancelIcon}
                style={styles.crossBtn}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={styles.filtersContainer}>
              <PickerSelect
                list={year}
                value={filterData.year}
                placeholder="Year"
                onSelectChange={(value, index) => {
                  filterData.year = value;

                  console.log('value', value);
                  this.setState({value});
                }}
              />
              <PickerSelect
                list={month}
                value={filterData.month}
                placeholder="Month"
                onSelectChange={(value) => {
                  filterData.month = value;
                  this.setState({filterData});
                }}
              />

              <PickerSelect
                list={service}
                value={filterData.service}
                placeholder="Service"
                onSelectChange={(value) => {
                  filterData.service = value;
                  this.setState({filterData});
                }}
              />

              <PickerSelect
                list={status}
                value={filterData.status}
                placeholder="Status"
                onSelectChange={(value) => {
                  filterData.status = value;
                  this.setState({filterData});
                }}
              />
              <PickerSelect
                list={interpreterPreference}
                value={filterData.interpreterPreference}
                placeholder="Interpreter Preference"
                onSelectChange={(value) => {
                  filterData.interpreterPreference = value;
                  this.setState({filterData});
                }}
              />
              {/* <PickerSelect
                list={interpreter}
                value={filterData.interpreter}
                placeholder="Interpreter"
                onSelectChange={(value) => {
                  filterData.interpreter = value;
                  this.setState({filterData});
                }}
              /> */}
              <PickerSelect
                list={language}
                value={filterData.language}
                placeholder="Language"
                onSelectChange={(value) => {
                  filterData.language = value;
                  this.setState({filterData});
                }}
              />

              <PickerSelect
                list={facility}
                value={filterData.facility}
                placeholder="Facilities"
                onSelectChange={(value) => {
                  filterData.facility = value;
                  this.setState({filterData});
                }}
              />
            </View>
            <View
              style={{
                width: '40%',
                // paddingHorizontal: 15,
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 88,
                // marginBottom: 30,
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 40,
                  backgroundColor: this.state.primaryColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginTop: 30,
                }}
                onPress={() =>
                  this.props.navigation.navigate('ScheduleService', {
                    filterData,
                  })
                }>
                <Text style={styles.fieldTextStyle}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const {height, width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  crossBtnContainer: {
    alignSelf: 'flex-end',
    margin: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossBtn: {
    width: 20,
    height: 20,
  },
  fieldTextStyle: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    fontWeight: 'bold',
  },
  filtersContainer: {
    width: '85%',
  },
});
export default ScheduleServiceFilterScreen;
