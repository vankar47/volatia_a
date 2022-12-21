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
  Alert,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

import {getWorkOrders} from '../store/api/workOrderPicker';

import moment from 'moment';

import Colors from '../constants/Colors';
import Images from '../constants/Images';

import InputScrollView from 'react-native-input-scroll-view';

import {getData} from '../store/storage';

import {connect} from 'react-redux';

import Loader from '../components/Loader';

const {height, width} = Dimensions.get('screen');

class WorkOrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      primaryColor: '#00b7ff',
      secondaryColor: '#d3dbdb',

      LogoImg: '',
      orientation: '',
      isTablet: false,
      toolTipVisible: false,
      showLoader: false,
      screenHeight: 0,
      billableDate: '',
      curTime: '',

      SelectedAssign: false,

      placeHolderText: 'Please Select ',
      selectedText: 'abc',
      serviceText: '',
      languageText: '',
      interperatorText: '',
      assignToText: '',

      headerText:
        'Use this page to schedule new appointments for language services.',
    };
  }

  componentDidMount = async () => {
    const {list, loading} = this.props;

    setInterval(() => {
      this.setState({
        curTime: moment().format(' h:mm:ss a'),
      });
    }, 1000);
    const result = await getData('AllColors');
    const output = JSON.parse(result);
    this.setState({
      primaryColor: output.primaryColor,
      secondaryColor: output.secondaryColor,
      LogoImg: output.logoUrl,
    });
    // const billableData = moment(Date.parse(list.BillDate))
    //   .format('MM/DD/YYYY')
    //   .slice(0, 16);
    // console.log('billableData', billableData);
    // this.setState({billableDate: billableData});

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
  };

  // async componentDidUpdate() {
  //   const {list} = this.props;
  //   this.props.getClientComments(list.Id);
  // }

  render() {
    const {list, loading} = this.props;
    const utcDate = moment(Date.now()).format('MMMM-DD-YYYY');
    const utcDate2 = moment(Date.parse(utcDate)).format('MMMM DD,YYYY');
    const currentTime = moment().format(' h:mm:ss a');
    const actualEndTime = moment(Date.parse(list.ActualEnd)).format(
      'MM/DD/YYYY h:mm:ss a',
    );
    const cancelationData = moment(
      Date.parse(list.CancellationDeadlineLocal),
    ).format('MM/DD/YYYY h:mm:ss a');

    const actualStart = moment(Date.parse(list.ActualStart)).format(
      'MM/DD/YYYY h:mm:ss a',
    );

    const billableData = moment(Date.parse(list.BillDate))
      .format('MM/DD/YYYY')
      .slice(0, 16);

    let momentDates = this.props.commentsList.map(({Submitted}) => {
      return {
        Submitted: moment(Submitted).format('MM/DD/YYYY h:mm:ss a'),
      };
    });

    const dueDate = moment(Date.parse(list.DueDate)).format('MM/DD/YYYY');

    // const userData = {};
    // userData.id = list.Id;
    // userData.individualName = list.Subject
    // userData.status = list.Status
    // userData.payableRate= list.PayableRate
    // userData.requestedBy = list.RequestedBy

    // console.log('workOrderData', userData);

    const {isTablet, orientation, headerText, showLoader} = this.state;
    const {commentsList} = this.props;

    console.log('commentslist arraayyyy', commentsList);

    return (
      <>
        {loading ? (
          <Loader />
        ) : (
          <>
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
              <InputScrollView>
                {isTablet ? (
                  <View style={styles.headerWrapper}>
                    <TouchableOpacity
                      activeOpacity={0.3}
                      style={styles.menuBtnContainer}
                      onPress={() =>
                        this.props.navigation.navigate('ScheduleService')
                      }>
                      {/* <Image
                    source={Images.MenuIcon}
                    style={styles.menuBtn}
                    resizeMode="contain"
                  /> */}
                      <Ionicons
                        name="arrow-left"
                        size={35}
                        color={this.state.secondaryColor}
                        style={{
                          marginTop: 2,
                        }}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        // flex: 1,
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        // width: '100%',
                        // textAlign: 'center',
                        // position: 'absolute',
                        // left: 0,
                        // right: 0,
                        alignItems: 'center',
                        paddingRight: 20,
                        flex: 1,
                      }}>
                      <Image
                        source={{uri: this.state.LogoImg}}
                        style={{width: 230, height: 70}}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.headerWrapper}>
                    <TouchableOpacity
                      activeOpacity={0.3}
                      style={styles.menuBtnContainer}
                      onPress={() => {
                        this.props.navigation.navigate('ScheduleService', {
                          screen: 'ScheduleService',
                        });
                      }}>
                      {/* <Image
                      source={Images.MenuIcon}
                      style={styles.menuBtn}
                      resizeMode="contain"
                    /> */}
                      <Ionicons
                        name="arrow-left"
                        size={35}
                        color={this.state.secondaryColor}
                        style={{
                          marginTop: 2,
                        }}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        // flex: 1,
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        // width: '100%',
                        // textAlign: 'center',
                        // position: 'absolute',
                        // left: 0,
                        // right: 0,
                        alignItems: 'center',
                        paddingRight: 20,
                        flex: 1,
                      }}>
                      <Image
                        source={{uri: this.state.LogoImg}}
                        style={{width: 230, height: 70}}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                )}
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.workHeading}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        fontFamily: 'Montserrat-Medium',
                        color: this.state.primaryColor,
                        width: '100%',
                        marginHorizontal: 13,
                      }}>
                      Work Order Details
                    </Text>
                  </View>

                  <View style={{flexDirection: 'column'}}>
                    <View style={styles.secondHeading}>
                      <Ionicons
                        name="calendar"
                        size={20}
                        color={this.state.secondaryColor}
                        style={{
                          marginTop: 2,
                        }}
                      />
                      <Text style={{padding: 2}}>{utcDate2}</Text>
                    </View>

                    <View style={styles.secondHeading}>
                      <Ionicons
                        name="clock"
                        size={20}
                        color={this.state.secondaryColor}
                        style={{
                          marginTop: 2,
                        }}
                      />
                      <Text style={{padding: 2}}>{this.state.curTime}</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Work Order ID
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.Id ? list.Id : null}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Requested Start Time:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.StartFormatted ? list.StartFormatted : null}
                      </Text>
                    </View>
                  </View>

                  {/* LEP Individual */}
                  {/* <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        LEP Individual
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.Subject ? list.Subject : null}
                      </Text>
                    </View>
                  </View> */}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Status
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.Status ? list.Status : null}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Actual Start Time
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {actualStart === 'Invalid date' ? null : actualStart}
                      </Text>
                    </View>
                  </View>

                  {/* Billable Rate */}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Requested Service Type:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.Service ? list.Service : null}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Actual End Time
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.ActualEnd ? actualEndTime : null}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Requested Language:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.LanguageTo ? list.LanguageTo : null}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Mileage
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.Mileage ? list.Mileage : null}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Service Requested By
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.RequestedBy ? list.RequestedBy : null}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Cancellation Deadline:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.CancellationDeadlineLocal
                          ? cancelationData
                          : null}
                      </Text>
                    </View>
                  </View>

                  {/* <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Requested Language:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.LanguageTo ? list.LanguageTo : null}
                      </Text>
                    </View>
                  </View> */}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  {/* <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Actual Service Start Time:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.StartFormatted ? list.StartFormatted : null}
                      </Text>
                    </View>
                  </View> */}

                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Requester's Email:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.RequestedByEmail ? list.RequestedByEmail : null}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Cancellation Local:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.CancelledTimeLocal
                          ? list.CancelledTimeLocal
                          : null}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Requester's Phone
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.Telephone ? list.Telephone : null}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Actual Minutes:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.ActualMinutes}
                      </Text>
                    </View>
                  </View>

                  {/* <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Local Time Zone
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.StartFormatted ? list.StartFormatted : null}
                      </Text>
                    </View>
                  </View> */}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  {/* <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Actual Service End Time:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.ActualEnd ? actualEndTime : null}
                      </Text>
                    </View>
                  </View> */}
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Work Site Facility:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.Facility}
                        {list.FacilityAddress}
                        {list.FacilityCityStateZip}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Billable Minutes:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.BillableMinutes}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Department/Suite/Floor/Room:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.Department}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Billable Rate
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.BillableRate ? '$' + list.BillableRate : null}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  {/* <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Total Charge:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {'$' + list.TotalCharge}
                      </Text>
                    </View>
                  </View> */}
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Cost Center ID:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.CostCenterID ? list.CostCenterID : null}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Service Charge:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {'$' + list.ServiceCharge}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  {/* LEP Individual */}
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        LEP/Recipient Individual
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.Subject ? list.Subject : null}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Mileage Reimbursement:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {'$' + list.BillableMileage}
                      </Text>
                    </View>
                  </View>
                  {/* <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Cancellation Time (UTC):
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.CancelledTime ? list.CancelledTime : null}
                      </Text>
                    </View>
                  </View> */}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        LEP/Recipient's ID or DOB
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.MRN ? list.MRN : null}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Amount Paid:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {'$' + list.AmountPaid}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Provider:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.Provider ? list.Provider : null}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Cancellation Charge:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {'$' + list.CancellationPay}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Interpreter Preference:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.InterpreterPreference
                          ? list.InterpreterPreference
                          : null}
                      </Text>
                    </View>
                  </View>

                  {/* <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Local Time Zone:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.TimeZone ? list.TimeZone : null}
                      </Text>
                    </View>
                  </View> */}
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Balance Due:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {'$' + list.BalanceDue}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  {/* <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Bill Date:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {billableData}
                      </Text>
                    </View>
                  </View> */}
                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Assigned Interpreter:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.Interpreter ? list.Interpreter : null}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Invoice Date:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {billableData ? billableData : null}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  <View
                    style={{
                      flex: 1,

                      marginHorizontal: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        fontFamily: 'Montserrat-Medium',
                        flexDirection: 'column',

                        width: '100%',
                      }}>
                      Invoice Due Date:
                    </Text>
                    <Text
                      style={{
                        margin: 2,

                        fontFamily: 'Montserrat-Regular',

                        width: '100%',
                      }}>
                      {list.DueDate ? dueDate : null}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}></View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 15,
                  }}>
                  {/* <View style={styles.workHeading}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Montserrat-Medium',

                          width: '100%',
                        }}>
                        Cancellation Local:
                      </Text>
                      <Text
                        style={{
                          margin: 2,

                          fontFamily: 'Montserrat-Regular',

                          width: '100%',
                        }}>
                        {list.CancelledTimeLocal
                          ? list.CancelledTimeLocal
                          : null}
                      </Text>
                    </View>
                  </View> */}
                </View>
                <View style={{marginTop: 20, marginHorizontal: 15}}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      fontFamily: 'Montserrat-Medium',
                      color: this.state.primaryColor,
                      width: '100%',
                      marginHorizontal: 10,
                    }}>
                    Client Comments
                  </Text>
                </View>
                {this.props.commentsLoading ? (
                  <Loader />
                ) : (
                  <ScrollView
                    horizontal
                    style={{marginHorizontal: 3, marginBottom: 10}}
                    showsHorizontalScrollIndicator={false}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        marginHorizontal: 15,
                      }}>
                      <View style={styles.workHeading}>
                        <View style={{flexDirection: 'column'}}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: 'bold',
                              fontFamily: 'Montserrat-Medium',

                              width: '100%',
                            }}>
                            Date Submitted
                          </Text>
                          {momentDates.map((data, index) => (
                            <Text
                              key={index}
                              style={{
                                fontFamily: 'Montserrat-Regular',
                                right: 5,
                                width: '100%',
                                padding: 5,
                              }}>
                              {data.Submitted}
                            </Text>
                          ))}
                        </View>
                      </View>

                      <View style={styles.workHeading}>
                        <View style={{flexDirection: 'column'}}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: 'bold',
                              fontFamily: 'Montserrat-Medium',

                              width: '100%',
                            }}>
                            User
                          </Text>
                          {commentsList.map((data, index) => (
                            <Text
                              key={index}
                              style={{
                                fontFamily: 'Montserrat-Regular',
                                right: 5,
                                width: '100%',
                                padding: 5,
                              }}>
                              {data.UserName}
                            </Text>
                          ))}
                        </View>
                      </View>

                      <View style={styles.workHeading}>
                        <View style={{flexDirection: 'column'}}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: 'bold',
                              fontFamily: 'Montserrat-Medium',

                              width: '100%',
                            }}>
                            Comment
                          </Text>

                          {commentsList.map((data, index) => (
                            <Text
                              key={index}
                              style={{
                                fontFamily: 'Montserrat-Regular',
                                right: 5,
                                width: '100%',
                                padding: 6,
                              }}>
                              {data.Comments}
                            </Text>
                          ))}
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                )}
              </InputScrollView>
            </SafeAreaView>
          </>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },

  errorConatiner: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  filtersContainer: {
    flex: 1,
    padding: 5,
  },
  tabletHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  menuBtnContainer: {
    zIndex: 2,
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
  },
  listItemStyle: {
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 50,
    marginHorizontal: 5,
  },

  listItemText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },

  mainsomeText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Medium',
  },

  pickerText: {
    width: '100%',
    marginHorizontal: 15,
    padding: 5,
  },
  pickerContainer: {
    width: '85%',
  },

  newPickerStyles: {
    backgroundColor: Colors.primaryColor,
  },

  someTextWrapper: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  someText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },
  selectStyle: {
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000000',
    shadowRadius: 5,
    shadowOffset: {height: 10},
    shadowOpacity: 0.3,
  },
  selectLabelTextStyle: {
    color: 'white',
    width: '100%',
  },

  submitButtonContainer: {},
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: 190,
    height: 50,
    borderRadius: 50,
    alignSelf: 'center',

    backgroundColor: '#DBDADA',
  },

  textinputContainer: {
    width: '85%',
    height: 40,
    borderRadius: 50,
    borderColor: 'grey',
    borderWidth: 1,
  },

  textAreaContainer: {
    borderWidth: 1,
    padding: 5,
    borderColor: 'grey',
    width: '85%',
    marginHorizontal: 30,
  },
  textArea: {
    height: 150,

    justifyContent: 'center',
  },
  textinput: {
    paddingTop: 10,
    paddingHorizontal: 10,
    padding: 5,
  },
  workHeading: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: 10,
  },
  secondHeading: {
    // flex: 1,
    flexDirection: 'row',
    marginHorizontal: 25,
  },
  // workText: {
  //   fontSize: 20,
  //   fontFamily: 'Montserrat-Medium',
  //   color: Colors.primaryColor,
  // },
  workSiteAddress: {
    // marginHorizontal: 2,
  },
});

const mapStateToProps = (state) => {
  const {list, loading} = state.workOrder.getWorkOrders;
  const {list: commentsList, loading: commentsLoading} =
    state.workOrder.clientComments;

  // const {inteperatorPreferance} = state;

  console.log('this is state of language', list);
  return {
    list,
    loading,
    commentsList,
    commentsLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getWorkOrders,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkOrderDetails);
