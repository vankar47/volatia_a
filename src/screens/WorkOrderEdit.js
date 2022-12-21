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
  TextInput,
  Button,
  Platform,
  TouchableHighlight,
  Alert,
} from 'react-native';

import {Formik, Field, ErrorMessage} from 'formik';

import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../constants/Colors';
import Images from '../constants/Images';

import {getWorkSiteFacility} from '../store/api/workOrderPicker';
import {getInterpratorFacility} from '../store/api/interprators';
import {getServicesType} from '../store/api/services';
import {getLanguageTo} from '../store/api/language';
import {getAssignTo} from '../store/api/assign';
import {setServices} from '../store/serviceType/serviceReducer';

import RNPicker from 'rn-modal-picker';

import moment from 'moment';

import DatePicker from 'react-native-datepicker';

import InputScrollView from 'react-native-input-scroll-view';

import {postRequestForm} from '../services/request';
import {getData} from '../store/storage';

import * as yup from 'yup';
import {connect} from 'react-redux';
import {getWorkOrders} from '../store/api/workOrderPicker';

const {height, width} = Dimensions.get('screen');

class WorkOrderScreen extends Component {
  constructor(props) {
    super(props);
    this.serviceId = this.props.list.ServiceID;
    this.serviceName = this.props.list.Service;
    this.languageId = this.props.list.LanguageToID;
    this.languageName = this.props.list.LanguageTo;
    this.interId = this.props.list.InterpreterPreference;
    this.interName = this.props.list.InterpreterPreference;
    this.facilityId = this.props.list.FacilityID;
    this.facilityName = this.props.list.Facility;
    this.myRef = React.createRef();
    this.state = {
      primaryColor: '#00b7ff',
      secondaryColor: '#d3dbdb',
      LogoImg: '',
      orientation: '',
      isTablet: false,
      toolTipVisible: false,
      showLoader: false,
      screenHeight: 0,

      SelectedAssign: false,

      placeHolderText: 'Please Select ',

      selectedText: {
        id: this.facilityId,

        name: this.facilityName,
      },
      serviceText: {
        id: this.serviceId,

        name: this.serviceName,
      },
      languageText: {
        id: this.languageId,

        name: this.languageName,
      },
      interperatorText: {
        id: this.interId,

        name: this.interName,
      },
      assignToText: '',

      selectedFacilityId: '',
      selectedServiceType: '',
      selectedLanguageToId: '',
      selectedInterpretor: '',
      selectedAssingTo: '',

      selectedDate: '',
      costCenterId: '',
      recipientName: '',
      department: '',
      recipientID: '',
      provider: '',
      providerEmail: '',
      comments: '',
      selectedDate: '',
      modalVisible: false,
      disableReccuringButton: false,

      headerText:
        'Use this page to schedule new appointments for language services.',
    };
  }

  componentDidMount = async () => {
    const result = await getData('AllColors');
    const output = JSON.parse(result);
    this.setState({
      primaryColor: output.primaryColor,
      secondaryColor: output.secondaryColor,
      LogoImg: output.logoUrl,
    });

    // console.log('result', output);
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

    //reseting assign to

    this.props.getWorkSiteFacility();
    this.props.getInterpratorFacility();
    this.props.getServicesType();
    this.props.getLanguageTo();
  };

  ReviewSchema = yup.object({
    FacilityID: yup.string().required(),
    ServiceID: yup.string().required(),
    Subject: yup.string().required(),
    LanguageToID: yup.string().required(),
    Start: yup.date().required('Enter a Date in the given format'),
  });

  updateSize = (height) => {
    this.setState({
      height,
    });
  };

  onSubmitHandler = (values, formik) => {
    persistYourData(values)
      .then((r) => {
        formik.setSubmitting(false);
      })
      .catch((error) => console.log(error));
  };

  handleChangeOption(val) {
    if (val !== 0) {
      this.setState({selectedValue: val});
    }
  }

  _selectedValue(index, item) {
    this.setState({selectedText: item.name});
  }

  closeModal = () => {
    this.setState({modalVisible: false});
  };
  closeModalWithNavigation = () => {
    this.setState({modalVisible: false});
    this.props.navigation.goBack();
  };

  disableRecurringButton = () => {
    if (
      this.state.languageText == '' &&
      this.state.selectedDate == '' &&
      this.state.recipientName == ''
    ) {
      this.setState({disableReccuringButton: true});
    } else {
      this.setState({disableReccuringButton: false});
    }
  };

  render() {
    const {isTablet, orientation, headerText, showLoader} = this.state;

    let pickerStyle = {
      marginLeft: 18,
      width: '90%',
      elevation: 3,
      paddingRight: 25,
      borderColor: Colors.primaryColor,
      borderRadius: 50,
      // marginRight: 10,
      // marginBottom: 2,
      shadowOpacity: 1.0,
      shadowOffset: {
        width: 1,
        height: 1,
      },
      borderWidth: 1,
      shadowRadius: 10,
      backgroundColor: this.state.primaryColor,

      shadowColor: '#d3d3d3',

      flexDirection: 'row',
    };

    const utcDate = moment(Date.parse(this.props.list.Start))
      .format()
      .slice(0, 16);

    console.log('UTECCC Data', utcDate);

    return (
      <>
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <InputScrollView style={{flex: 1}}>
            {/* <KeyboardAvoidingView
              enabled={Platform.OS === 'ios'}
              behavior={Platform.OS === 'ios' ? 'padding' : ''}
              style={{flex: 1}}> */}
            <View style={styles.container}>
              {isTablet ? (
                <View style={styles.headerWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={styles.menuBtnContainer}
                    onPress={() => this.props.navigation.goBack()}>
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
                    onPress={() =>
                      this.props.navigation.navigate('TabNavigator')
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
                      source={{uri:this.state.LogoImg}}
                      style={{width: 230, height: 70}}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              )}
            </View>

            <Formik
              initialValues={{
                CostCenterID: this.props.list.CostCenterID,
                Address2: this.props.list.Address2,
                Subject: this.props.list.Subject,
                FacilityID: this.facilityId,
                ServiceID: this.serviceId,
                LanguageToID: this.languageId,
                InterpreterPreference: this.interId,
                MRN: this.props.list.MRN,
                Start: utcDate,
                Provider: this.props.list.Provider,
                ProviderEmail: this.props.list.ProviderEmail,

                RequestedBy: this.props.list.RequestedBy,
                RequestedByEmail: this.props.list.RequestedByEmail,
                RequestedPhone: this.props.list.Telephone,
              }}
              validationSchema={this.ReviewSchema}
              enableReinitialize={true}
              innerRef={this.myRef}
              onSubmit={async (value, {resetForm}) => {
                if (!value.isSecondButton) {
                  console.log('this isi value', value);
                  const accessToken = await getData('AccessToken');

                  try {
                    const res = await postRequestForm(
                      '/api/WorkOrders/Update',
                      accessToken,
                      {
                        Id: this.props.list.Id,
                        Subject: value.Subject,

                        MRN: value.MRN,
                        ServiceID: value.ServiceID,

                        Start: value.Start,
                        RequestedBy: value.RequestedBy,
                        RequestedByEmail: value.RequestedByEmail,
                        Address2: value.Address2,
                        Telephone: value.RequestedPhone,

                        LanguageToID: value.LanguageToID,

                        FacilityID: value.FacilityID,
                        CostCenterID: value.CostCenterID,

                        InterpreterPreference: value.InterpreterPreference,
                      },
                    );

                    if (res.result.status === 200) {
                      Alert.alert(
                        'Your Work Order Has Been Updated!!',
                        '',
                        [
                          {
                            text: 'Ok',
                            onPress: () => {
                              this.props.getWorkOrders(this.props.list.Id);
                              this.props.navigation.navigate('TabNavigator');
                            },
                          },
                        ],
                        {cancelable: false},
                      );
                    } else {
                      alert('Please enter valid information');
                    }

                    resetForm();
                  } catch (err) {
                    alert(err.message);
                  }
                }
              }}
              validateOnBlur={true}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                setFieldValue,
                isSubmitting,
                dirty,
                isValid,
                errors,
                touched,
              }) => (
                <>
                  <View style={styles.pickerText}>
                    <Text style={styles.someText}>
                      Select Work Site Facility :
                    </Text>
                  </View>
                  <View style={Styles.container}>
                    <RNPicker
                      data={this.props.work.list}
                      showSearchBar={true}
                      selectedText={this.state.selectedText.name}
                      placeHolderText={this.state.placeHolderText}
                      searchBarStyle={this.props.searchBarContainerStyle}
                      pickerStyle={pickerStyle}
                      itemSeparatorStyle={Styles.itemSeparatorStyle}
                      listTextStyle={Styles.listTextViewStyle}
                      selectedTextStyle={Styles.selectLabelTextStyle}
                      placeHolderTextStyle={Styles.placeHolderTextStyle}
                      dropDownImageStyle={Styles.dropDownImageStyle}
                      dropDownImage={require('../assets/backgrounds/dropdown.png')}
                      selectedValue={(index, itemValue) => {
                        this.setState((prevState) => ({
                          selectedText: {
                            ...prevState.name,
                            name: itemValue.name,
                          },
                        }));

                        setFieldValue('FacilityID', itemValue.id);
                      }}
                    />
                  </View>

                  <View style={styles.someTextWrapper}>
                    <Text style={styles.someText}>Cost Center ID :</Text>
                  </View>

                  <View style={styles.container}>
                    <View style={styles.textinputContainer}>
                      <TextInput
                        onChangeText={(value) => {
                          setFieldValue('CostCenterID', value);
                          this.setState({costCenterId: value});
                        }}
                        onBlur={handleBlur('CostCenterID')}
                        value={values.CostCenterID}
                        multiline={true}
                        style={styles.textinput}
                        textAlign="left"
                        keyboardType="default"
                      />
                    </View>
                  </View>

                  <View style={styles.someTextWrapper}>
                    <Text style={styles.someText}>
                      Department, Suite, Floor, Room # :
                    </Text>
                  </View>
                  <View style={styles.container}>
                    <View style={styles.textinputContainer}>
                      <TextInput
                        onChangeText={handleChange('Address2')}
                        onChangeText={(value) => {
                          setFieldValue('Address2', value);
                          this.setState({department: value});
                        }}
                        onBlur={handleBlur('Address2')}
                        value={values.Address2}
                        multiline={true}
                        style={styles.textinput}
                        textAlign="left"
                        keyboardType="default"
                      />
                    </View>
                  </View>

                  <View style={styles.someTextWrapper}>
                    <Text style={styles.someText}>Requested Service Type:</Text>
                  </View>
                  <View style={Styles.container}>
                    <RNPicker
                      data={this.props.services.list}
                      showSearchBar={true}
                      selectedText={this.state.serviceText.name}
                      placeHolderText={this.state.placeHolderText}
                      searchBarStyle={this.props.searchBarContainerStyle}
                      pickerStyle={pickerStyle}
                      itemSeparatorStyle={Styles.itemSeparatorStyle}
                      listTextStyle={Styles.listTextViewStyle}
                      selectedTextStyle={Styles.selectLabelTextStyle}
                      placeHolderTextStyle={Styles.placeHolderTextStyle}
                      dropDownImageStyle={Styles.dropDownImageStyle}
                      dropDownImage={require('../assets/backgrounds/dropdown.png')}
                      selectedValue={(index, itemValue) => {
                        this.setState((prevState) => ({
                          serviceText: {
                            ...prevState.name,
                            name: itemValue.name,
                          },
                        }));

                        setFieldValue('ServiceID', itemValue.id);
                      }}
                    />
                  </View>

                  <View style={styles.someTextWrapper}>
                    <Text style={styles.someText}>
                      Patient or Service Recipient:
                    </Text>
                  </View>

                  <View style={styles.container}>
                    <View style={styles.textinputContainer}>
                      <TextInput
                        onChangeText={(value) => {
                          setFieldValue('Subject', value);
                          this.setState({recipientName: value});
                        }}
                        onBlur={handleBlur('Subject')}
                        value={values.Subject}
                        multiline={true}
                        style={styles.textinput}
                        textAlign="left"
                        keyboardType="default"
                      />
                    </View>
                  </View>

                  <View style={styles.someTextWrapper}>
                    <Text style={styles.someText}>
                      LEP Recipient ID or DOB:
                    </Text>
                  </View>

                  <View style={styles.container}>
                    <View style={styles.textinputContainer}>
                      <TextInput
                        onChangeText={(value) => {
                          setFieldValue('MRN', value);
                          this.setState({recipientID: value});
                        }}
                        onBlur={handleBlur('MRN')}
                        value={values.MRN}
                        multiline={true}
                        style={styles.textinput}
                        textAlign="left"
                        keyboardType="default"
                      />
                    </View>
                  </View>

                  <View style={styles.someTextWrapper}>
                    <Text style={styles.someText}>Language</Text>
                  </View>

                  <View style={Styles.container}>
                    <RNPicker
                      data={this.props.languages.list}
                      showSearchBar={true}
                      selectedText={this.state.languageText.name}
                      placeHolderText={this.state.placeHolderText}
                      searchBarStyle={this.props.searchBarContainerStyle}
                      pickerStyle={pickerStyle}
                      itemSeparatorStyle={Styles.itemSeparatorStyle}
                      listTextStyle={Styles.listTextViewStyle}
                      selectedTextStyle={Styles.selectLabelTextStyle}
                      placeHolderTextStyle={Styles.placeHolderTextStyle}
                      dropDownImageStyle={Styles.dropDownImageStyle}
                      dropDownImage={require('../assets/backgrounds/dropdown.png')}
                      selectedValue={(index, itemValue) => {
                        this.setState((prevState) => ({
                          languageText: {
                            ...prevState.name,
                            name: itemValue.name,
                          },
                        }));

                        setFieldValue('LanguageToID', itemValue.id);

                        if (!itemValue.id)
                          //reseting assign to
                          return this.props.setAssignData([
                            {
                              name: 'Network',
                              id: null,
                            },
                          ]);

                        this.props.getAssignTo(itemValue.id);
                      }}
                    />
                  </View>

                  <View style={styles.someTextWrapper}>
                    <Text style={styles.someText}>Service Date and Time:</Text>
                  </View>

                  <View style={styles.container}>
                    <View style={styles.pickerContainer}>
                      <DatePicker
                        style={{
                          width: '100%',
                          color: '#fff',
                        }}
                        getDateStr={(date) => {
                          const momentDate = moment(date).format(
                            'MM/DD/YYYY h:mm a',
                          );

                          // return date.toLocaleString('en-US', options);
                          return momentDate;
                        }}
                        customStyles={{
                          dateInput: {
                            borderRadius: 50,
                            backgroundColor: this.state.primaryColor,
                            borderColor: this.state.primaryColor,
                            alignItems: 'flex-start',
                            paddingLeft: 10,
                          },
                          dateText: {
                            color: 'white',
                          },
                          placeholderText: {
                            color: 'white',
                          },
                          datePicker: {
                            // backgroundColor: '#d1d3d8',
                            justifyContent: 'center',
                          },
                        }}
                        showIcon={false}
                        is24Hour={false}
                        placeholder="Select Date & Time"
                        mode="datetime"
                        date={values.Start}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={(itemValue) => {
                          const utcDate = moment(Date.parse(itemValue))
                            .format()
                            .slice(0, 16);

                          console.log('this is item value', utcDate);
                          setFieldValue('Start', utcDate);
                        }}
                      />
                    </View>
                  </View>

                  <View style={styles.someTextWrapper}>
                    <Text style={styles.someText}>Provider :</Text>
                  </View>

                  <View style={styles.container}>
                    <View style={styles.textinputContainer}>
                      <TextInput
                        onChangeText={(value) => {
                          setFieldValue('Provider', value);
                          this.setState({provider: value});
                        }}
                        onBlur={handleBlur('Provider')}
                        value={values.Provider}
                        multiline={true}
                        style={styles.textinput}
                        textAlign="left"
                        keyboardType="default"
                      />
                    </View>
                  </View>

                  <View style={styles.someTextWrapper}>
                    <Text style={styles.someText}>Provider Email :</Text>
                  </View>

                  <View style={styles.container}>
                    <View style={styles.textinputContainer}>
                      <TextInput
                        onChangeText={(value) => {
                          setFieldValue('ProviderEmail', value);
                          this.setState({providerEmail: value});
                        }}
                        onBlur={handleBlur('ProviderEmail')}
                        value={values.ProviderEmail}
                        multiline={true}
                        style={styles.textinput}
                        textAlign="left"
                        keyboardType="email-address"
                      />
                    </View>
                  </View>

                  <View style={styles.someTextWrapper}>
                    <Text style={styles.someText}>Interpreter Preference:</Text>
                  </View>

                  <View style={Styles.container}>
                    <RNPicker
                      data={this.props.interperator.list}
                      showSearchBar={true}
                      selectedText={this.state.interperatorText.name}
                      placeHolderText={this.state.placeHolderText}
                      searchBarStyle={this.props.searchBarContainerStyle}
                      pickerStyle={pickerStyle}
                      itemSeparatorStyle={Styles.itemSeparatorStyle}
                      listTextStyle={Styles.listTextViewStyle}
                      selectedTextStyle={Styles.selectLabelTextStyle}
                      placeHolderTextStyle={Styles.placeHolderTextStyle}
                      dropDownImageStyle={Styles.dropDownImageStyle}
                      dropDownImage={require('../assets/backgrounds/dropdown.png')}
                      selectedValue={(index, itemValue) => {
                        this.setState((prevState) => ({
                          interperatorText: {
                            ...prevState.name,
                            name: itemValue.name,
                          },
                        }));

                        setFieldValue('InterpreterPreference', itemValue.id);
                      }}
                    />
                  </View>

                  <View style={styles.someTextWrapper}>
                    <Text style={styles.someText}>Service Requested By:</Text>
                  </View>
                  <View style={styles.container}>
                    <View style={styles.textinputContainer}>
                      <TextInput
                        onChangeText={handleChange('Address2')}
                        onChangeText={(value) => {
                          setFieldValue('RequestedBy', value);
                          this.setState({department: value});
                        }}
                        onBlur={handleBlur('RequestedBy')}
                        value={values.RequestedBy}
                        multiline={true}
                        style={styles.textinput}
                        textAlign="left"
                        keyboardType="default"
                      />
                    </View>
                  </View>

                  <View style={styles.someTextWrapper}>
                    <Text style={styles.someText}>Requested By Email:</Text>
                  </View>

                  <View style={styles.container}>
                    <View style={styles.textinputContainer}>
                      <TextInput
                        onChangeText={(value) => {
                          setFieldValue('RequestedByEmail', value);
                          this.setState({providerEmail: value});
                        }}
                        onBlur={handleBlur('RequestedByEmail')}
                        value={values.RequestedByEmail}
                        multiline={true}
                        style={styles.textinput}
                        textAlign="left"
                        keyboardType="email-address"
                      />
                    </View>
                  </View>

                  <View style={styles.someTextWrapper}>
                    <Text style={styles.someText}>Requester's Phone #:</Text>
                  </View>

                  <View style={styles.container}>
                    <View style={styles.textinputContainer}>
                      <TextInput
                        onChangeText={(value) => {
                          setFieldValue('RequestedPhone', value);
                          this.setState({providerEmail: value});
                        }}
                        onBlur={handleBlur('RequestedPhone')}
                        value={values.RequestedPhone}
                        multiline={true}
                        style={styles.textinput}
                        textAlign="left"
                        keyboardType="email-address"
                      />
                    </View>
                  </View>

                  <View style={styles.errorConatiner}>
                    <Text style={styles.errorText}>
                      <ErrorMessage name="Start" />
                    </Text>
                  </View>

                  <View style={styles.errorConatiner}>
                    <Text style={styles.errorText}>
                      <ErrorMessage name="ProviderEmail" />
                    </Text>
                  </View>

                  <View
                    style={{
                      justifyContent: 'space-evenly',
                      flexDirection: 'row',
                      marginBottom: 10,
                    }}>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',

                        width: '30%',
                        height: 40,
                        borderRadius: 5,

                        backgroundColor: this.state.primaryColor,
                      }}>
                      <View>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 11,
                            fontFamily: 'Montserrat-bold',
                          }}>
                          Update
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',

                        width: '30%',
                        height: 40,
                        borderRadius: 5,

                        backgroundColor: this.state.primaryColor,
                      }}
                      onPress={() => {
                        this.props.navigation.navigate('TabNavigator');
                      }}>
                      <View>
                        <Text
                          style={{
                            color: 'white',
                            fontFamily: 'Montserrat-bold',

                            fontSize: 11,
                          }}>
                          Cancel
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Formik>
            {/* </KeyboardAvoidingView> */}
          </InputScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const {workOrder} = state;
  const {inteperatorPreferance} = state;
  const {ServicesType} = state;
  const {LanguageTo} = state;
  const {AssignTo} = state;

  const {list, loading} = state.workOrder.getWorkOrders;

  // const {inteperatorPreferance} = state;

  return {
    work: workOrder.workOrderPicker,
    interperator: inteperatorPreferance.Interperators,
    services: ServicesType.allServicesReducer,
    languages: LanguageTo.allLanguageReducer,
    assign: AssignTo.allAssignTo,
    list,
    loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getWorkSiteFacility: (params) => {
      dispatch(getWorkSiteFacility(params));
    },
    getInterpratorFacility: (params) => {
      dispatch(getInterpratorFacility(params));
    },
    getServicesType: (params) => {
      dispatch(getServicesType(params));
    },
    getLanguageTo: (params) => {
      dispatch(getLanguageTo(params));
    },
    getAssignTo: (params) => {
      dispatch(getAssignTo(params));
    },
    setServices: (params) => dispatch(setServices(params)),
    getWorkOrders: (params) => dispatch(getWorkOrders(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkOrderScreen);

const styles = StyleSheet.create({
  container: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: 70,

    height: 40,
    borderRadius: 5,

    backgroundColor: '#DBDADA',
  },
  buttonContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: 110,

    height: 40,
    borderRadius: 5,

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
    marginHorizontal: 15,
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

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemSeparatorStyle: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#D3D3D3',
  },
  searchBarContainerStyle: {
    marginBottom: 10,
    flexDirection: 'row',
    height: 40,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#d3d3d3',
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10,
  },

  selectLabelTextStyle: {
    color: 'white',
    textAlign: 'left',
    width: '99%',
    padding: 10,
    flexDirection: 'row',
  },
  placeHolderTextStyle: {
    color: 'white',
    padding: 10,
    textAlign: 'left',
    width: '99%',
    flexDirection: 'row',
  },
  dropDownImageStyle: {
    // marginLeft: 10,
    width: 10,
    height: 10,
    alignSelf: 'center',
  },
  listTextViewStyle: {
    color: '#000',
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: 'left',
  },
  pickerStyle: {
    marginLeft: 18,
    width: '90%',
    elevation: 3,
    paddingRight: 25,
    borderColor: Colors.primaryColor,
    borderRadius: 50,
    // marginRight: 10,
    // marginBottom: 2,
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    borderWidth: 1,
    shadowRadius: 10,
    backgroundColor: Colors.primaryColor,

    shadowColor: '#d3d3d3',

    flexDirection: 'row',
  },
});
