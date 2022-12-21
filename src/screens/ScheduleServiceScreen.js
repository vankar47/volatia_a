import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  SafeAreaView,
  LogBox,
  AppState,
  TouchableHighlight,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Table, Rows, Row, Col} from 'react-native-table-component';

import Ionicons from 'react-native-vector-icons/Ionicons';

import moment from 'moment';

import ScreenWrapper from './../components/ScreenWrapper';
import SearchInput from './../components/SearchInput';
import Colors from '../constants/Colors';
import Images from '../constants/Images';

import Loader from './../components/Loader';

import {getRequest} from '../services/request';
import {getData, storeData} from '../store/storage';
import {getWorkOrders, getClientComments} from '../store/api/workOrderPicker';
import {connect} from 'react-redux';

const {height, width} = Dimensions.get('screen');

const date = new Date();

let year = date.getFullYear();
let month = moment().month() + 1;

class ScheduleServiceScreen extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      primaryColor: '#00b7ff',
      secondaryColor: '#d3dbdb',
      LogoImg: '',
      orientation: '',
      isTablet: false,
      showLoader: false,
      widthArr: [200, 200, 200, 200, 200, 200, 200],

      tableData: {
        label: '',
        description: '',
        widthArr: [200],
        tableHead: [],
        tableData: [],
      },

      filterData: {
        year: year.toString(),
        month: month.toString(),
        status: '' + 1,
        interpreterPreference: '%',
        language: '%',
        service: '%',
        facility: '%',
      },

      tableHead: [
        'LEP Individual',
        'ID',
        'Work Site',
        'Facility Service Type',
        'Preference',
        'Status',
        'Language',
        'Local Start',
      ],
      tableData: [],
      StatusText: '',
    };

    Dimensions.addEventListener('change', () => {
      const dim = Dimensions.get('screen');
      const screenDimensions = {
        height: dim.height,
        width: dim.width,
      };
      this.setState({
        orientation: dim.height >= dim.width ? 'portrait' : 'landscape',
        screenDimensions,
      });
    });
  }

  async componentDidMount() {
    const result = await getData('AllColors');
    const output = JSON.parse(result);
    this.setState({
      primaryColor: output.primaryColor,
      secondaryColor: output.secondaryColor,
      LogoImg: output.logoUrl,
    });

    const dim = Dimensions.get('screen');
    const screenDimensions = {
      height: dim.height,
      width: dim.width,
    };
    const isTablet = DeviceInfo.isTablet();
    let orientation;
    if (isTablet) {
      orientation = dim.height >= dim.width ? 'portrait' : 'landscape';
    }

    this.setState({isTablet, orientation, screenDimensions});

    this.willFocusListener = this.props.navigation.addListener('focus', () => {
      this._GetWorkData();
    });
  }

  // _GetWorkOrders = async (id) => {
  //   try {
  //     const accessToken = await getData('AccessToken');
  //     const res = await getRequest(
  //       `/api/WorkOrders/Get?id=${id} `,
  //       accessToken,
  //     );
  //     console.log('this is response', res);
  //   } catch (error) {
  //     console.log('this is error', error);
  //   }
  // };

  _resultText = (textStyle) => {
    if (this.state.filterData.status == 1)
      return <Text style={textStyle}>Request Pending Work Order(s):</Text>;
    if (this.state.filterData.status == 2)
      return <Text style={textStyle}>Scheduled Work Order(s):</Text>;
    if (this.state.filterData.status == 3)
      return <Text style={textStyle}>Completed Work Order(s):</Text>;
    if (this.state.filterData.status == 1004)
      return (
        <Text style={textStyle}>Appointment Cancelled Work Order(s):</Text>
      );
    if (this.state.filterData.status == 1005)
      return (
        <Text style={textStyle}>Interpreter Not Available Work Order(s):</Text>
      );
    if (this.state.filterData.status == 2007)
      return <Text style={textStyle}>Incomplete Work Order(s):</Text>;
    if (this.state.filterData.status == 2008)
      return <Text style={textStyle}>Interpreter No Show Work Order(s):</Text>;
    else {
      return <Text style={textStyle}>Work Order(s):</Text>;
    }
  };

  _GetWorkData = async () => {
    const accessToken = await getData('AccessToken');

    try {
      const tableData = {
        widthArr: [150, 150, 150, 150, 150, 150, 150, 150],
        tableHead: [
          'LEP Individual',
          'Id',
          'Work Site',
          'Facility Service Type',
          'Preference',
          'Status',
          'Language',
          'Local Start',
        ],
        tableData: [],
      };
      this.setState({showLoader: true});
      this.setState({...this.state, ...this.props.route.params});

      if (!this.state.filterData) {
        // const res = await getRequest('/api/WorkOrders/Search', accessToken, {
        //   years: 2020,
        //   month: 1,
        // });
        // const rateResponse = (res.result && res.result.data) || [];
        // console.log('this is non filter response ', rateResponse);
        // const allData = rateResponse.map((item) => {
        //   const {
        //     Subject = '',
        //     Id = '',
        //     Facility = '',
        //     Service = '',
        //     InterpreterPreference = '',
        //     Status = '',
        //     LanguageTo = '',
        //     Start = '',
        //   } = item;
        //   return [
        //     Subject,
        //     Id,
        //     Facility,
        //     Service,
        //     InterpreterPreference,
        //     Status,
        //     LanguageTo,
        //     Start,
        //   ];
        // });
        // // tableData.tableData = allData;
        // this.setState({showLoader: false, tableData: allData});
      } else {
        const res = await getRequest(
          '/api/WorkOrders/Search',
          accessToken,
          this.state.filterData,
        );
        const rateResponse = (res.result && res.result.data) || [];

        // console.log('this is  filtered rate response ', rateResponse);

        const allData = rateResponse.map((item) => {
          const {
            Subject = '',
            Id = '',
            Facility = '',
            Service = '',
            InterpreterPreference = '',
            Status = '',
            LanguageTo = '',
            Start = '',
          } = item;
          return [
            Subject,
            Id,
            Facility,
            Service,
            InterpreterPreference,
            Status,
            LanguageTo,
            Start,
          ];
        });

        const storeTableData = storeData('newData', JSON.stringify(allData));

        const getStoredData = await getData('newData');

        const updatedData = JSON.parse(getStoredData);

        // tableData.tableData = allData;

        this.setState({showLoader: false, tableData: updatedData}, () =>
          console.log('this is updated data', updatedData),
        );
      }
    } catch (error) {
      console.log(error.message);
    }

    // console.log('ye non modified hai response data', responseData);
  };
  // componentWillUnmount() {
  //   this._isMounted = false;
  // }

  render() {
    const {
      isTablet,
      orientation,
      tableHead,
      tableData,
      widthArr,
      showLoader,
      StatusText,
      filterData,
    } = this.state;

    let customFieldStyle = {
      justifyContent: 'center',
      marginHorizontal: 5,
      height: 50,
      paddingHorizontal: 10,
      marginVertical: 5,
      backgroundColor: this.state.primaryColor,
      borderRadius: 8,
    };
    // if (orientation === 'landscape') {
    //   customFieldStyle = [styles.fieldStyle, {flex: 1}];
    // }
    let customeResultstyle = {
      alignSelf: 'flex-start',
      marginLeft: 10,
      fontSize: 17,
      color:this.state.primaryColor,
      fontFamily: 'Montserrat-Bold',
      paddingHorizontal: 10,
    };

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        {showLoader ? (
          <Loader />
        ) : (
          <>
            <ScrollView>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : ''}
                style={{flex: 1}}>
                <View style={styles.container}>
                  {isTablet ? (
                    <View style={styles.tabletHeaderWrapper}>
                      <TouchableOpacity
                        activeOpacity={0.3}
                        style={styles.menuBtnContainer}
                        onPress={() => this.props.navigation.openDrawer()}>
                        {/* <Image
                      source={Images.MenuIcon}
                      style={styles.menuBtn}
                      resizeMode="contain"
                    /> */}
                        <Ionicons
                          name="log-out-outline"
                          size={30}
                          color={this.state.secondaryColor}
                          style={{
                            marginTop: -2,
                          }}
                        />
                      </TouchableOpacity>

                      <View style={styles.logoWrapper}>
                        <Image
                          source={{uri: this.state.LogoImg}}
                          style={styles.logoStyle}
                          resizeMode="contain"
                        />
                      </View>
                      {/* <View style={styles.tabletSearchWrapper}>
                    <SearchInput placeholder="Search" />
                  </View> */}
                      <TouchableOpacity
                        activeOpacity={0.3}
                        style={styles.menuBtnContainer}
                        onPress={() =>
                          this.props.navigation.navigate(
                            'ScheduleServiceFilter',
                            {filterData},
                          )
                        }>
                        <Ionicons
                          name="menu-outline"
                          size={32}
                          color={this.state.secondaryColor}
                          style={{
                            marginTop: -2,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.headerWrapper}>
                      <TouchableOpacity
                        activeOpacity={0.3}
                        style={styles.menuBtnContainer}
                        onPress={() => this.props.navigation.openDrawer()}>
                        {/* <Image
                      source={Images.MenuIcon}
                      style={styles.menuBtn}
                      resizeMode="contain"
                    /> */}
                        <Ionicons
                          name="log-out-outline"
                          size={30}
                          color={this.state.secondaryColor}
                          style={{
                            marginTop: -2,
                          }}
                        />
                      </TouchableOpacity>
                      <View style={styles.logoWrapper}>
                        <Image
                          source={{uri: this.state.LogoImg}}
                          style={styles.logoStyle}
                          resizeMode="contain"
                        />
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.3}
                        style={styles.menuBtnContainer}
                        onPress={() =>
                          this.props.navigation.navigate(
                            'ScheduleServiceFilter',
                            this.state.filterData,
                          )
                        }>
                        <Ionicons
                          name="menu-outline"
                          size={32}
                          color={this.state.secondaryColor}
                          style={{
                            marginTop: -2,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  {/* {!isTablet && <SearchInput placeholder="Search" />} */}
                  <View></View>
                  <View
                    style={{
                      width: '100%',
                      paddingHorizontal: 15,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      style={[customFieldStyle, {flex: 1, height: 40}]}
                      onPress={() =>
                        this.props.navigation.navigate('WorkOrder')
                      }>
                      <Text style={styles.fieldTextStyle}>
                        Create Work Order
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('OPI_VRI')}
                      style={[customFieldStyle, {flex: 1, height: 40}]}>
                      <Text style={styles.fieldTextStyle}>
                        Connect to Interpreter Now
                      </Text>
                    </TouchableOpacity>

                    {/* {isTablet && orientation === 'landscape' && (
                  <View style={styles.logoWrapper}>
                    <Image
                      source={Images.Logo}
                      style={styles.logoStyle}
                      resizeMode="contain"
                    />
                  </View>
                )} */}
                  </View>
                  <View
                    style={[styles.listContainer, {alignItems: 'flex-start'}]}>
                    <View style={styles.someTextWrapper}>
                      <Text style={styles.someText} numberOfLines={5}>
                        Use this form to view and manage all work orders.
                      </Text>
                    </View>
                    {/* {isTablet && orientation === 'portrait' && (
                  <View style={styles.logoWrapper}>
                    <Image
                      source={Images.Logo}
                      style={styles.logoStyle}
                      resizeMode="contain"
                    />
                  </View>
                )} */}
                  </View>
                  {/* {this.state.filterData.status == 3 ? (
                    <Text style={customeResultstyle}>
                      Completed Work Order(s)
                    </Text>
                  ) : (
                    <Text style={customeResultstyle}>Work Order(s)</Text>
                  )} */}
                  {this._resultText(customeResultstyle)}

                  <View style={styles.tableContainer}>
                    <View>
                      <Table borderStyle={{borderWidth: 1}}>
                        <Row
                          data={tableHead.slice(0, 1)}
                          widthArr={[200]}
                          style={styles.tableHeader}
                          textStyle={[styles.tableText]}
                        />
                      </Table>

                      <View style={styles.tableDataWrapper}>
                        <Table borderStyle={{borderWidth: 1}}>
                          {tableData.map((data, index) => (
                            <TouchableOpacity
                            key={index}
                              onPress={() => {
                                this.props.getWorkOrders(data[0]);
                                this.props.getClientComments(data[0]);
                                this.props.navigation.navigate('TabNavigator');
                              }}>
                              <Row
                                data={[data[0]]}
                                widthArr={[200]}
                                style={{borderWidth: 0.5}}
                                textStyle={{
                                  paddingVertical: 15,
                                  textAlign: 'center',
                                  // paddingVertical: 15,
                                  flex: 1,
                                  fontFamily: 'Montserrat-Medium',
                                  minHeight: 70,
                                  maxHeight: 'auto',
                                  color: this.state.primaryColor,

                                  fontSize: 11.2,
                                }}
                              />
                            </TouchableOpacity>
                          ))}
                        </Table>
                      </View>
                    </View>

                    <ScrollView horizontal={true} style={{marginRight: 20}}>
                      <View>
                        <Table borderStyle={{borderWidth: 1}}>
                          <Row
                            data={tableHead.slice(1)}
                            widthArr={widthArr}
                            style={styles.tableHeader}
                            textStyle={[styles.tableText, {}]}
                          />
                        </Table>

                        <View style={styles.tableDataWrapper}>
                          <Table borderStyle={{borderWidth: 1}}>
                            <Rows
                              data={tableData.map((obj) => {
                                obj.shift();
                                return obj;
                              })}
                              widthArr={widthArr}
                              textStyle={styles.tableText}
                            />
                          </Table>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  listContainerV2: {
    justifyContent: 'space-between',
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  tabletHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    width: '90%',
  },
  tabletSearchWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 15,
  },
  menuBtnContainer: {
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  menuBtn: {
    width: 25,
    height: 25,
  },
  logoWrapper: {},
  logoStyle: {
    width: 230,
    height: 60,
  },
  listContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
  },
  // listItemStyle: {
  //   padding: 10,
  //   borderRadius: 50,
  //   backgroundColor: Colors.primaryColor,
  //   marginLeft: 5,
  //   elevation: 5,
  //   shadowColor: Colors.primaryColor,
  //   shadowRadius: 5,
  //   shadowOffset: {height: 10},
  //   shadowOpacity: 0.5,
  // },
  listItemText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Montserrat-Medium',
  },
  someTextWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },

  fieldTextStyle: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
  },
  fieldStyle: {
    // justifyContent: 'center',
    // marginHorizontal: 5,
    // height: 50,
    // paddingHorizontal: 10,
    // marginVertical: 5,
    // backgroundColor: Colors.primaryColor,
    // borderRadius: 8,
    // elevation: 3,
    // shadowColor: '#000000',
    // shadowRadius: 5,
    // shadowOffset: {height: 10},
    // shadowOpacity: 0.3,
  },
  someText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },
  resultText: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontSize: 17,
    color: Colors.primaryColor,
    fontFamily: 'Montserrat-Bold',
    paddingHorizontal: 10,
  },
  tableContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    margin: 10,
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
  },
  tableHeader: {
    backgroundColor: Colors.tableHeader,
    // width: %',
  },
  tableDataWrapper: {
    // marginTop: -1,
    width: '100%',
  },
  tableText: {
    paddingVertical: 15,
    textAlign: 'center',
    // paddingVertical: 15,
    flex: 1,
    fontFamily: 'Montserrat-Medium',
    minHeight: 70,
    maxHeight: 'auto',

    fontSize: 11.2,
  },
  tableText2: {
    paddingVertical: 15,
    textAlign: 'center',
    // paddingVertical: 15,
    flex: 1,
    fontFamily: 'Montserrat-Medium',
    minHeight: 72,
    maxHeight: 'auto',

    fontSize: 11.2,
  },
});

export default connect(null, {
  getWorkOrders,
  getClientComments,
})(ScheduleServiceScreen);
// export default ScheduleServiceScreen;
