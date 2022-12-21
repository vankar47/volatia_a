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
import Loader from './../components/Loader';

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
import {setAssignData} from '../store/assignTo/assignReducer';

import RNPicker from 'rn-modal-picker';

import moment from 'moment';

import DatePicker from 'react-native-datepicker';

import InputScrollView from 'react-native-input-scroll-view';

import {postRequestForm} from '../services/request';
import {getData} from '../store/storage';

import ReccuringWorkOrder from '../components/RecurringWorkOrder';

import * as yup from 'yup';
import {connect} from 'react-redux';

const {height, width} = Dimensions.get('screen');

class WorkOrderScreen extends Component {
  constructor(props) {
    super(props);
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

      selectedText: '',
      serviceText: '',
      languageText: '',
      interperatorText: {
        id: '',

        name: 'None',
      },
      assignToText: {
        id: 'Network',

        name: 'Network',
      },

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
      modalVisible: false,
      disableReccuringButton: false,

      headerText:
        'Use this page to schedule new appointments for language services.',
    };
  }

  componentDidMount = async () => {
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
    const {assignToText, interperatorText} = this.state;

    const result = await getData('AllColors');
    const output = JSON.parse(result);
    this.setState({
      primaryColor: output.primaryColor,
      secondaryColor: output.secondaryColor,
      LogoImg: output.logoUrl,
    });
    // this.setState({assignToText: 'Network', interperatorText: 'None'});

    if (this.props.route.params?.selectedLang !== undefined) {
      console.log(this.props.route.params);
      this.setState({
        selectedServiceType: 3,
        serviceText: 'Video (VRI)',
        selectedLanguageToId: this.props.route.params?.selectedLangId,
        languageText: this.props.route.params?.selectedLang,
        selectedText: this.props.route.params?.facilityName,
        selectedFacilityId: this.props.route.params?.facility,
      });
    }
    //reseting assign to
    // this.props.setAssignData([
    //   {
    //     name: 'Network',
    //     id: null,
    //   },
    // ]);
    this.props.getWorkSiteFacility();
    this.props.getInterpratorFacility();
    this.props.getServicesType();

    this.props.getLanguageTo();
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (this.props.route.params?.selectedLang !== undefined) {
      if (
        this.props.route.params?.selectedLangId !==
        this.state.selectedLanguageToId
      ) {
        if (this.props.route.params?.selectedLang !== undefined) {
          console.log(this.props.route.params);
          this.setState({
            selectedServiceType: 3,
            serviceText: 'Video (VRI)',
            selectedLanguageToId: this.props.route.params?.selectedLangId,
            languageText: this.props.route.params?.selectedLang,
            selectedText: this.props.route.params?.facilityName,
            selectedFacilityId: this.props.route.params?.facility,
          });
        } else {
          this.setState({
            selectedServiceType: '',
            serviceText: '',
            selectedLanguageToId: '',
            languageText: '',
          });
        }
      }
    }
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
      height: 40,
      width: '90%',
      elevation: 3,
      paddingRight: 25,
      borderColor: this.state.primaryColor,
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

    console.log('this is service', this.state.costCenterId);

    return (
      <>
        {this.props.languages.loading ? (
          <Loader />
        ) : (
          <>
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
              <ReccuringWorkOrder
                isVisible={this.state.modalVisible}
                workOrder={this.state.selectedText}
                serviceType={this.state.selectedServiceType}
                facilityId={this.state.selectedFacilityId}
                languages={this.state.selectedLanguageToId}
                selectedDate={this.state.selectedDate}
                interperator={this.state.selectedInterpretor}
                assignToText={this.state.selectedAssingTo}
                closeModal={this.closeModal}
                costCenterId={this.state.costCenterId}
                department={this.state.department}
                recipientName={this.state.recipientName}
                recipientID={this.state.recipientID}
                provider={this.state.provider}
                providerEmail={this.state.providerEmail}
                comments={this.state.comments}
                closeModalWithNavigation={this.closeModalWithNavigation}
              />

              <InputScrollView>
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
                        onPress={() => {
                          this.props.navigation.goBack();
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
                  ) : (
                    <View style={styles.headerWrapper}>
                      <TouchableOpacity
                        activeOpacity={0.3}
                        style={styles.menuBtnContainer}
                        onPress={() => {
                          this.props.navigation.goBack();
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
                </View>
                <View style={styles.workHeading}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Montserrat-Medium',
                      color: this.state.primaryColor,
                    }}>
                    {' '}
                    New Work Order
                  </Text>
                </View>

                <View style={styles.someTextWrapper}>
                  <Text style={styles.someText}>{headerText}</Text>
                </View>
                <View style={styles.pickerText}>
                  <Text style={styles.mainsomeText}>
                    Select Work Site Facility :
                  </Text>
                </View>
                <Formik
                  initialValues={{
                    CostCenterID: '',
                    Address2: '',
                    Subject: '',
                    FacilityID: '',
                    ServiceID: '',
                    LanguageToID: '',
                    InterpreterPreference: '',
                    MRN: '',
                    Start: '',
                    Provider: '',
                    ProviderEmail: '',
                    AssignedTo: '',
                    ClientComments: '',
                    isSecondButton: false,
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
                          '/api/WorkOrders/Create',
                          accessToken,
                          value,
                        );

                        console.log('response', res);
                        if (res.result.status === 200) {
                          Alert.alert(
                            'Thank You',
                            'Your Work Order Has Been Submitted!!',
                          );
                          this.props.navigation.goBack();
                        } else {
                          alert('Please enter valid information');
                        }
                        resetForm();
                      } catch (err) {
                        alert(err.message);
                      }
                    } else {
                      console.log('this isi value', value);
                      const accessToken = await getData('AccessToken');

                      try {
                        const res = await postRequestForm(
                          '/api/WorkOrders/Create',
                          accessToken,
                          value,
                        );

                        console.log('response', res);
                        if (res.result.status === 200) {
                          Alert.alert(
                            'Thank You',
                            'Your Work Order Has Been Submitted! You can now enter another one for this same recipient',
                          );
                        } else {
                          alert('Please enter valid information');
                        }
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
                      <View style={Styles.container}>
                        <RNPicker
                          // placeholderTextColor="red"
                          data={this.props.work.list}
                          placeHolderTextColor={'white'}
                          showSearchBar={true}
                          searchBarStyle={this.props.searchBarContainerStyle}
                          pickerStyle={pickerStyle}
                          itemSeparatorStyle={Styles.itemSeparatorStyle}
                          listTextStyle={Styles.listTextViewStyle}
                          selectedText={this.state.selectedText}
                          placeHolderText={this.state.placeHolderText}
                          selectedTextStyle={Styles.selectLabelTextStyle}
                          placeHolderTextStyle={Styles.placeHolderTextStyle}
                          dropDownImageStyle={Styles.dropDownImageStyle}
                          dropDownImage={require('../assets/backgrounds/dropdown.png')}
                          selectedValue={(index, itemValue) => {
                            this.setState({
                              selectedText: itemValue.name,
                              selectedFacilityId: itemValue.id,
                            });

                            console.log('Thias is item selected', itemValue);

                            setFieldValue('FacilityID', itemValue.id);
                          }}
                        />
                      </View>

                      <View style={styles.someTextWrapper}>
                        <Text style={styles.mainsomeText}>
                          Work Site Address :
                        </Text>
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
                        <Text style={styles.someText}>Service Type :</Text>
                      </View>
                      <View style={Styles.container}>
                        <RNPicker
                          placeHolderTextColor={'white'}
                          data={this.props.services.list}
                          showSearchBar={true}
                          searchBarStyle={this.props.searchBarContainerStyle}
                          pickerStyle={pickerStyle}
                          itemSeparatorStyle={Styles.itemSeparatorStyle}
                          listTextStyle={Styles.listTextViewStyle}
                          selectedTextStyle={Styles.selectLabelTextStyle}
                          placeHolderTextStyle={Styles.placeHolderTextStyle}
                          dropDownImageStyle={Styles.dropDownImageStyle}
                          selectedText={this.state.serviceText}
                          placeHolderText={this.state.placeHolderText}
                          dropDownImage={require('../assets/backgrounds/dropdown.png')}
                          selectedValue={(index, itemValue) => {
                            this.setState({
                              serviceText: itemValue.name,
                              selectedServiceType: itemValue.id,
                            });

                            setFieldValue('ServiceID', itemValue.id);
                          }}
                        />
                      </View>

                      <View style={styles.someTextWrapper}>
                        <Text style={styles.someText}>
                          LEP Recipient Name :
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
                        <Text style={styles.someText}>Languages to:</Text>
                      </View>

                      <View style={Styles.container}>
                        <RNPicker
                          placeHolderTextColor={'white'}
                          data={this.props.languages.list}
                          showSearchBar={true}
                          selectedText={this.state.languageText}
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
                            this.setState({
                              languageText: itemValue.name,
                              selectedLanguageToId: itemValue.id,
                            });

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
                            // console.log('this is language value ', itemValue);
                          }}
                        />
                      </View>

                      <View style={styles.someTextWrapper}>
                        <Text style={styles.someText}>
                          Service Date and Time:
                        </Text>
                      </View>

                      <View style={styles.container}>
                        <View style={styles.pickerContainer}>
                          <DatePicker
                            style={{
                              width: '100%',
                            }}
                            getDateStr={(date) => {
                              const momentDate =
                                moment(date).format('MM/DD/YYYY h:mm a');

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
                              this.setState({selectedDate: utcDate});
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.errorConatiner}>
                        <Text style={styles.errorText}>
                          <ErrorMessage name="Start" />
                        </Text>
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

                      <View style={styles.errorConatiner}>
                        <Text style={styles.errorText}>
                          <ErrorMessage name="ProviderEmail" />
                        </Text>
                      </View>
                      <View style={styles.someTextWrapper}>
                        <Text style={styles.someText}>
                          Interpreter Preference:
                        </Text>
                      </View>

                      <View style={Styles.container}>
                        <RNPicker
                          placeHolderTextColor={'white'}
                          data={this.props.interperator.list}
                          showSearchBar={true}
                          defaultValue
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
                                selectedInterpretor: itemValue.id,
                              },
                            }));

                            setFieldValue(
                              'InterpreterPreference',
                              itemValue.id,
                            );
                          }}
                        />
                      </View>

                      <View style={styles.someTextWrapper}>
                        <Text style={styles.someText}>Assign To :</Text>
                      </View>

                      <View style={Styles.container}>
                        <RNPicker
                          placeHolderTextColor={'white'}
                          data={this.props.assign.list}
                          defaultValue
                          selectedText={this.state.assignToText.name}
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
                                selectedAssingTo: itemValue.id,
                              },
                            }));

                            setFieldValue('AssignedTo', itemValue.id);
                          }}
                        />
                      </View>

                      <View style={styles.someTextWrapper}>
                        <Text style={styles.someText}>
                          Comments or Special Instructions :
                        </Text>
                      </View>
                      <View style={styles.container}>
                        <View style={styles.textAreaContainer}>
                          <TextInput
                            onChangeText={(value) => {
                              setFieldValue('ClientComments', value);
                              this.setState({comments: value});
                            }}
                            onBlur={handleBlur('ClientComments')}
                            value={values.ClientComments}
                            multiline={true}
                            style={styles.textArea}
                            textAlign="left"
                            keyboardType="default"
                            numberOfLines={10}
                          />
                        </View>
                      </View>
                      <ScrollView
                        style={{
                          flex: 1,
                          marginHorizontal: 25,
                        }}
                        horizontal>
                        <TouchableOpacity
                          onPress={(e) => {
                            setFieldValue('isSecondButton', false);
                            handleSubmit(e);
                          }}
                          style={
                            !(isValid && dirty)
                              ? styles.buttonContainer(this.state.primaryColor)
                              : {
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginVertical: 20,
                                  width: 70,
                                  height: 40,
                                  borderRadius: 5,

                                  backgroundColor: this.state.primaryColor,
                                }
                          }
                          // disabled={!(isValid && dirty) || isSubmitting}
                        >
                          <View>
                            <Text style={{color: 'white', fontSize: 11}}>
                              Submit
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            width: 10, // or whatever size you need
                            height: 10,
                          }}
                        />
                        <TouchableOpacity
                          style={
                            this.state.selectedDate == '' ||
                            this.state.languageText == '' ||
                            this.state.recipientName == ''
                              ? {
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginVertical: 20,
                                  width: 110,

                                  height: 40,
                                  borderRadius: 5,

                                  backgroundColor: this.state.primaryColor,
                                }
                              : {
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginVertical: 20,
                                  width: 110,

                                  height: 40,
                                  borderRadius: 5,

                                  backgroundColor: this.state.primaryColor,
                                }
                          }
                          // disabled={
                          //   this.state.selectedDate == '' ||
                          //   this.state.languageText == '' ||
                          //   this.state.recipientName == ''
                          // }
                          onPress={() => this.setState({modalVisible: true})}>
                          <View>
                            <Text style={{color: 'white', fontSize: 11}}>
                              Set as Recurring
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            width: 10, // or whatever size you need
                            height: 10,
                          }}
                        />
                        <TouchableOpacity
                          style={
                            !(isValid && dirty)
                              ? styles.buttonContainer2(this.state.primaryColor)
                              : {
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginVertical: 20,
                                  width: 110,
                                  height: 40,
                                  borderRadius: 5,

                                  backgroundColor: this.state.primaryColor,
                                }
                          }
                          // disabled={!(isValid && dirty) || isSubmitting}
                          onPress={(e) => {
                            setFieldValue('isSecondButton', true);
                            handleSubmit(e);
                          }}>
                          <View>
                            <Text style={{color: 'white', fontSize: 11}}>
                              Submit and Replicate
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            width: 10, // or whatever size you need
                            height: 10,
                          }}
                        />
                      </ScrollView>
                    </>
                  )}
                </Formik>
                {/* </KeyboardAvoidingView> */}
              </InputScrollView>
            </SafeAreaView>
          </>
        )}
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

  // const {inteperatorPreferance} = state;

  return {
    work: workOrder.workOrderPicker,
    interperator: inteperatorPreferance.Interperators,
    services: ServicesType.allServicesReducer,
    languages: LanguageTo.allLanguageReducer,
    assign: AssignTo.allAssignTo,
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
    setAssignData: (params) => dispatch(setAssignData(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkOrderScreen);

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
  buttonContainer: (primaryColor) => {
    return {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 20,
      width: 70,

      height: 40,
      borderRadius: 5,

      backgroundColor: primaryColor,
    };
  },
  buttonContainer2: (primaryColor) => {
    return {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 20,
      width: 110,

      height: 40,
      borderRadius: 5,

      backgroundColor: primaryColor,
    };
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
    fontSize: 10,
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
