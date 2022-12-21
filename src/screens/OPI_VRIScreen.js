import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  AppState,
  Platform,
  Alert,
  Modal,
  SafeAreaView,
  PermissionsAndroid,
} from 'react-native';
import Modals from 'react-native-modal';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {FlatGrid} from 'react-native-super-grid';
import DeviceInfo, {isTablet} from 'react-native-device-info';

import {CommonActions} from '@react-navigation/native';

import {getRequest, postWithParams} from '../services/request';
import {getData, removeData, storeData} from '../store/storage';

import OPI_VRIFilterScreen from './OPI_VRIFilterScreen';
import ScreenWrapper from './../components/ScreenWrapper';
import SearchInput from './../components/SearchInput';
import ContactListItem from './../components/ContactListItem';
import PickerSelect from '../components/PickerSelect';
import Loader from './../components/Loader';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import Input from '../components/Input';
import CustomButton from '../components/CustomButton';
import Svg, {Circle, Rect} from 'react-native-svg';

import BoostlingoSdk from '../../BoostlingoSDK';

let that;
//let's start
class OPI_VRIScreen extends Component {
  constructor(props) {
    super(props);

    that = this;
    this.activeShareVideoState = true;
    this.refRoomView = (r) => (this.roomView = r);

    this.state = {
      screenDimensions: {
        height: '',
        width: '',
      },
      orientation: '',
      filtersModel: false,
      callModel: false,
      showLoader: false,
      isTablet: false,
      accessToken: '',
      searchText: '',
      filterData: {
        topLanguages: false,
        allLanguages: false,
        facility: '',
        language: '',
      },
      filterDataModel: '',
      facility: [],
      language: [],
      selectedItem: -1,
      contacts: [],
      searchedContacts: [],
      roomDetails: '',
      isConnected: false,
      participants: [],
      shareVideo: true,
      shareAudio: true,
      isVideoAvailable: true,
      isAudioAvailable: true,
      primaryColor: 'green',
      secondaryColor: 'red',
      logoUrl: '',
      token: '',
      error: '',
      status: 'INIT',
      showNotAvailableModal: false,
      // videoCallState: {
      //   isConnected: false,
      //   participants: [],
      //   shareVideo: true,
      //   shareAudio: true,
      //   token: '',
      //   error: '',
      //   status: 'INIT',
      // },
      participantList: [],

      languagesFilter: 'top',
      callingItemId: '',
      callingItemName: '',
      callType: '',
      workOrderForm: false,
      wForm: {
        name: '',
        dob: '',
        costId: '',
      },
      eErrors: {},
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

    AppState.addEventListener('change', this.onAppSateChange);

    const color = await getData('AllColors');
    const output = JSON.parse(color);
    console.log('output', output);
    this.setState({
      primaryColor: output.primaryColor,
      secondaryColor: output.secondaryColor,
      logoUrl: output.logoUrl,
    });

    const accessToken = await getData('AccessToken');
    let languageFilter = await getData('languageFilter');
    languageFilter = languageFilter || 'all';
    this.setState({accessToken, languageFilter: 'top'});
    this.initializeBoostlingo();
    this._GetClientLanguages();

    // if (languageFilter === 'top') {
    //   this._GetClientLanguages();
    // } else {
    //   this._GetAllLanguages();
    // }

    this.getLanguagesforDropdown();
    this._GetClientFacilities();
    this._GetDefaultLanguage();
    this._GetDefaultFacility();

    this._GetMyFacility();
    this._GetMyLanguageFrom();
  }
  initializeBoostlingo = async () => {
    try {
      this.setState({showLoader: true});
      const res = await getRequest(
        '/api/ServiceTokens/GetOverflowServiceToken',
        this.state.accessToken,
      );

      if (res.result.status === 200) {
        console.log('TOKEN ==>>', res.result.data);
        const blToken = res.result.data;
        await BoostlingoSdk.initialize({
          authToken: blToken,
          region: 'us',
        });
      }
      this.setState({showLoader: false});
    } catch (err) {
      this.setState({showLoader: false});
    }
  };

  getLanguagesforDropdown = async () => {
    this.setState({showLoader: true});
    const res = await getRequest('api/Languages', this.state.accessToken);
    if (res.result.status === 200) {
      const language = res.result.data.map((item) => {
        return {
          label: item.LanguageName,
          value: item.Id,
        };
      });
      this.setState({language, showLoader: false});
    } else {
      this.setState({showLoader: false});
      console.log('err', res.error);
    }
  };
  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppSateChange);
  }

  _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Need permission to access microphone',
        message:
          'To run this demo we need permission to access your microphone',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  };

  _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Need permission to access camera',
      message: 'To run this demo we need permission to access your camera',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
  };

  _GetAllLanguages = async () => {
    this.setState({showLoader: true});
    const res = await getRequest('api/Languages', this.state.accessToken);
    if (res.result.status === 200) {
      console.log('LANGUAGES', res.result.data);
      this.setState({
        contacts: res.result.data,
        searchedContacts: res.result.data,
        showLoader: false,
      });
    } else {
      this.setState({showLoader: false});
      console.log('err', res.error);
    }
  };

  _GetClientLanguages = async () => {
    //
    this.setState({showLoader: true});
    const res = await getRequest(
      'api/Languages/GetClientLanguages',
      this.state.accessToken,
    );

    if (res.result.status === 200) {
      this.setState({
        contacts: res.result.data,
        searchedContacts: res.result.data,
        showLoader: false,
      });
    } else {
      this.setState({showLoader: false});
      console.log('err', res.error);
    }
  };

  _GetClientFacilities = async () => {
    this.setState({showLoader: true});
    const res = await getRequest(
      'api/Facilities/GetClientFacilities',
      this.state.accessToken,
    );
    if (res.result.status === 200) {
      const facility = res.result.data.map((item) => {
        return {
          label: item.FacilityName,
          value: item.FacilityID,
        };
      });
      this.setState({facility, showLoader: false});
    } else {
      this.setState({showLoader: false});
      console.log('err', res.error);
    }
  };
  _GetMyFacility = async () => {
    this.setState({showLoader: true});

    const res = await getRequest(
      'api/UserSettings/GetVRIFacilityId',
      this.state.accessToken,
    );
    if (res.result.status === 200) {
      console.log('MY FACILITY ', res.result);

      const {filterData} = this.state;
      filterData.facility = res.result.data;
      this.setState({showLoader: false, filterData});
    } else {
      this.setState({showLoader: false});
      console.log('err', res.error);
    }
  };

  _GetMyLanguageFrom = async () => {
    this.setState({showLoader: true});

    const res = await getRequest(
      'api/UserSettings/GetVRILanguageFromId',
      this.state.accessToken,
    );
    if (res.result.status === 200) {
      console.log('MY Language ', res.result);

      const {filterData} = this.state;
      filterData.language = res.result.data;

      this.setState({showLoader: false, filterData});
    } else {
      this.setState({showLoader: false});
      console.log('err', res.error);
    }
  };

  _GetDefaultLanguage = async () => {
    this.setState({showLoader: true});
    const res = await getRequest(
      'api/UserSettings/GetVRILanguageFromId',
      this.state.accessToken,
    );
    if (res.result.status === 200) {
      const {filterData} = this.state;
      filterData.language = res.result.data;
      this.setState({filterData, showLoader: false});
    } else {
      this.setState({showLoader: false});
      console.log('err', res);
    }
  };

  _GetDefaultFacility = async () => {
    this.setState({showLoader: true});
    const res = await getRequest(
      'api/UserSettings/GetVRIFacilityId',
      this.state.accessToken,
    );
    if (res.result.status === 200) {
      const {filterData} = this.state;
      filterData.facility = res.result.data;
      this.setState({filterData, showLoader: false});
    } else {
      this.setState({showLoader: false});
      console.log('err', res);
    }
  };

  _SetDefaultLanguage = async (langId) => {
    this.setState({showLoader: true});
    const res = await getRequest(
      'api/UserSettings/SetVRILanguageFromId',
      this.state.accessToken,
      {languageFromId: langId || this.state.filterData.language},
    );
    this.setState({showLoader: false});
    if (res.result.status === 200) {
    } else {
      console.log('err', res);
    }
  };

  _SetDefaultFacility = async (facId) => {
    this.setState({showLoader: true});
    const res = await getRequest(
      'api/UserSettings/SetVRIFacilityId',
      this.state.accessToken,
      {facilityId: facId || this.state.filterData.facility},
    );
    this.setState({showLoader: false});
    if (res.result.status === 200) {
    } else {
      console.log('err', res);
    }
  };

  _CreateVideoRoom = async (
    languageId,
    wForm = {
      name: '',
      dob: '',
      costId: '',
    },
  ) => {
    await this._requestAudioPermission();
    await this._requestCameraPermission();
    const {filterData, accessToken} = this.state;

    if (!filterData.facility || filterData.facility == 0) {
      Alert.alert(
        'Error',
        'Set Facility from the settings before requesting the call',
      );
      return;
    }
    if (!filterData.language || filterData.language == 0) {
      Alert.alert(
        'Error',
        'Set Language from the settings before requesting the call',
      );
      return;
    }
    this.setState({showLoader: true});
    const reqBody = {
      languageId,
      facilityId: filterData.facility,
      languageFromId: filterData.language,
      lepName: wForm.name.trim() || 'Not Provided',
      lepId: wForm.dob.trim() || 'Not Provided',
      costCenterId: wForm.costId.trim() || 'Not Provided',
    };
    console.log('Create Video Body =>', reqBody);
    try {
      const res = await postWithParams(
        'api/Video/CreateRoom',
        accessToken,
        reqBody,
      );
      console.log('STATUS => ', res);

      if (res?.result?.status === 200) {
        console.log('CREATE VIDEO ROOM', res.result);

        wForm.name = '';
        wForm.dob = '';
        wForm.costId = '';

        // await BoostlingoSdk.initialize({
        //   authToken: res.result.data.tokenResult,
        //   region: 'us',
        // });

        this.setState({
          roomDetails: res.result.data,
          showLoader: false,
          wForm,
          workOrderForm: false,
          callingItemId: '',
          callType: '',
        });

        this.props.navigation.navigate('Calling', {
          accessToken: res.result.data.tokenResult,
          roomSid: res.result.data.sid,
          roomUniqueName: res.result.data.uniqueName,
          languageName: res.result.data.languageName,
          callType: 'video',

          workOrderId: res.result.data.workOrderID,
          ////
          isOverflow: res.result.data.isOverflow,
          overflowGenderPreferenceId:
            res.result.data.overflowGenderPreferenceId,
          overflowLanguageFromId: res.result.data.overflowLanguageFromId,
          overflowLanguageToId: res.result.data.overflowLanguageToId,
          overflowServiceTypeId: res.result.data.overflowServiceTypeId,
        });
      } else {
        this.setState({showLoader: false});
        console.log('err', res);
      }
    } catch (err) {
      console.log('VIDEO ROOM CREATION ERR', err);
    }
  };

  _CreateAudioRoom = async (
    languageId,
    wForm = {
      name: '',
      dob: '',
      costId: '',
    },
  ) => {
    await this._requestAudioPermission();
    await this._requestCameraPermission();
    const {filterData, accessToken} = this.state;

    if (!filterData.facility || filterData.facility == 0) {
      Alert.alert(
        'Error',
        'Set Facility from the settings before requesting the call',
      );
      return;
    }
    if (!filterData.language || filterData.language == 0) {
      Alert.alert(
        'Error',
        'Set Language from the settings before requesting the call',
      );
      return;
    }

    this.setState({showLoader: true});
    const reqBody = {
      languageId,
      facilityId: filterData.facility,
      languageFromId: filterData.language,
      lepName: wForm.name.trim() || 'Not Provided',
      lepId: wForm.dob.trim() || 'Not Provided',
      costCenterId: wForm.costId.trim() || 'Not Provided',
    };
    console.log('REQ Audio BODY => ', reqBody);

    const res = await postWithParams(
      'api/Voice/CreateRoom',
      accessToken,
      reqBody,
    );
    console.log('RES ->', res);
    if (res?.result?.status === 200) {
      console.log('CREATE Audio ROOM', res.result);

      wForm.name = '';
      wForm.dob = '';
      wForm.costId = '';

      // await BoostlingoSdk.initialize({
      //   authToken: res.result.data.tokenResult,
      //   region: 'us',
      // });
      // console.log('INITIALIZED', {
      //   authToken: res.result.data.tokenResult,
      //   region: 'us',
      // });

      this.setState({
        roomDetails: res.result.data,
        showLoader: false,
        wForm,
        workOrderForm: false,
        callingItemId: '',
        callType: '',
      });

      this.props.navigation.navigate('Calling', {
        accessToken: res.result.data.tokenResult,
        callType: 'audio',
        languageName: res.result.data.languageName,
        roomSid: res.result.data.sid,
        roomUniqueName: res.result.data.uniqueName,
        workOrderId: res.result.data.workOrderID,
        /////
        isOverflow: res.result.data.isOverflow,
        overflowGenderPreferenceId: res.result.data.overflowGenderPreferenceId,
        overflowLanguageFromId: res.result.data.overflowLanguageFromId,
        overflowLanguageToId: res.result.data.overflowLanguageToId,
        overflowServiceTypeId: res.result.data.overflowServiceTypeId,
      });
    } else {
      this.setState({showLoader: false});
      console.log('err', res);
    }
  };

  _onModelApplyPress = () => {
    const {filterDataModel} = this.state;
    this.setState({filterData: filterDataModel, filtersModel: false}, () => {
      this._SetDefaultFacility();
      this._SetDefaultLanguage();
      const {languagesFilter = 'all'} = this.state;

      storeData('languageFilter', languagesFilter);

      if (languagesFilter === 'all') {
        this._GetAllLanguages();
      } else if (languagesFilter === 'top') {
        this._GetClientLanguages();
      }
    });
  };

  _onListItemPress = async (contactId) => {
    console.log(contactId);
    try {
      // this.setState({showLoader: true});
      // https://api.volatia.com/api/Interpreters/GetInterpreterAvailabilty?languageId=284
      const res = await getRequest(
        'api/Interpreters/GetInterpreterAvailabilty?languageId=' + contactId,
        this.state.accessToken,
      );
      console.log(res);

      if (res.result.status === 200) {
        const blToken = res.result.data;
        this.setState({
          isVideoAvailable: blToken.IsVideoAvailable,
          isAudioAvailable: blToken.IsPhoneAvailable,
        });
      }
      // this.setState({showLoader: false});
    } catch (err) {
      console.log(err);
      // this.setState({showLoader: false});
    }
    setTimeout(() => {
      const {selectedItem} = this.state;
      if (selectedItem === contactId) {
        this.setState({selectedItem: -1});
      } else {
        this.setState({selectedItem: contactId});
      }
    }, 300);
  };

  _searchList = () => {
    const {contacts, searchText} = this.state;
    const newData = contacts.filter((item) => {
      const itemData = `${item.LanguageName.toUpperCase()}`;
      const textData = searchText.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({searchedContacts: newData});
  };

  _drawerHamburgerPress = () => {
    // this.props.navigation.openDrawer();
    removeData('AccessToken');
    const {navigation} = this.props;
    const resetAction = CommonActions.reset({
      index: 1,
      routes: [{name: 'Login'}],
    });
    navigation.dispatch(resetAction);
  };

  connect = () => {
    const {token} = this.state;
    this.roomView.nativeConnectWithOptions(token, 'test');
  };
  disConnect = () => {
    this.roomView.nativeDisconnect();
  };
  toggleShareVideo = () => {
    this.setState({shareVideo: !this.state.shareVideo});
  };
  toggleShareAudio = () => {
    const {shareAudio} = this.state;
    this.setState({shareAudio: !shareAudio});
  };
  toggleCamera = () => {
    this.roomView.nativeFlipCamera();
  };
  onAppSateChange = (status) => {
    switch (status) {
      case 'active':
        this.setState({shareVideo: this.activeShareVideoState});
        break;
      case 'background':
        this.activeShareVideoState = this.state.shareVideo;
        this.toggleShareVideo();
    }
  };
  onDidConnect = (participants) => {
    this.setState({participants, isConnected: true});
  };
  onDisConnected = () => {
    this.setState({isConnected: false, participants: []});
  };

  onParticipantConnected = (participants) => {
    this.setState({participants});
  };

  onParticipantDisConnected = (participants) => {
    this.setState({participants});
  };

  renderNotAvailableModal = () => {
    return (
      <Modals
        style={{justifyContent: 'center', alignItems: 'center'}}
        isVisible={this.state.showNotAvailableModal}
        onBackButtonPress={() => {
          this.setState({showNotAvailableModal: false});
        }}
        onBackdropPress={() => {
          this.setState({showNotAvailableModal: false});
        }}>
        <View
          style={{
            paddingVertical: 25,
            paddingHorizontal: 10,
            width: '100%',
            backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: this.state.primaryColor,
            borderRadius: 8,
          }}>
          <Text style={{fontSize: 16, color: 'white', textAlign: 'left'}}>
            Video on-demand is currently NOT available for this language.
            Connect with Audio ONLY or schedule a video session.
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              marginTop: 25,
            }}>
            <TouchableOpacity
              onPress={() => {
                setTimeout(() => {
                  this.setState({
                    callType: 'audio',
                    workOrderForm: true,
                  });
                }, 500);
                this.setState({
                  showNotAvailableModal: false,
                });
              }}
              style={{
                width: 130,
                height: 40,
                backgroundColor: this.state.secondaryColor,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 14,
              }}>
              <Text style={{color: 'white'}}>Connect Audio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showNotAvailableModal: false,
                });
                const subject = this.state.facility.find(
                  (subject) => subject.value === this.state.filterData.facility,
                );
                console.log(subject);
                this.props.navigation.navigate('ScheduleService', {
                  screen: 'WorkOrder',
                  params: {
                    selectedLang: this.state.callingItemName,
                    selectedLangId: this.state.callingItemId,
                    facility: this.state.filterData.facility,
                    facilityName: subject.label,
                  },
                });
              }}
              style={{
                width: 130,
                height: 40,
                backgroundColor: this.state.secondaryColor,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 14,
              }}>
              <Text style={{color: 'white'}}>Schedule Video</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modals>
    );
  };

  renderWorkOrderModal = () => {
    const {workOrderForm, isTablet, wForm, showLoader} = this.state;

    return (
      <Modal
        visible={workOrderForm}
        onRequestClose={() => {
          this.setState({workOrderForm: false});
        }}>
        <SafeAreaView style={{flex: 1}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 30}}>
            Work Order Form
          </Text>
          {showLoader ? (
            <Loader />
          ) : (
            <View style={{paddingHorizontal: 20}}>
              <Input
                placeholder="LEP/Recipient Name"
                value={wForm.name}
                onChangeText={(text) => {
                  wForm.name = text;
                  this.setState({wForm});
                }}
                error={''}
              />
              <Input
                value={wForm.dob}
                placeholder="LEP/Recipient ID or DOB"
                onChangeText={(text) => {
                  wForm.dob = text;
                  this.setState({wForm});
                }}
                error={''}
              />
              <Input
                value={wForm.costId}
                placeholder="Cost Center ID"
                onChangeText={(text) => {
                  wForm.costId = text;
                  this.setState({wForm});
                }}
                error={''}
              />
              <View
                style={{
                  width: '100%',
                  marginTop: 20,
                  flexDirection: isTablet ? 'row' : 'column',
                }}>
                <CustomButton
                  buttonStyle={styles.wBtn}
                  text="Submit & Connect"
                  onPress={() => {
                    const {callingItemId, callType} = this.state;
                    if (!callingItemId || !callType) return;
                    if (callType === 'video') {
                      this._CreateVideoRoom(callingItemId, wForm);
                    } else if (callType === 'audio') {
                      this._CreateAudioRoom(callingItemId, wForm);
                    }
                  }}
                />
                <CustomButton
                  buttonStyle={[
                    styles.wBtn,
                    {backgroundColor: '#ffc107', marginLeft: isTablet ? 10 : 0},
                  ]}
                  text="Information NOT Available: Connect"
                  textStyle={{fontSize: isTablet ? 17 : 14}}
                  onPress={() => {
                    const {callingItemId, callType} = this.state;
                    if (!callingItemId || !callType) return;
                    if (callType === 'video') {
                      this._CreateVideoRoom(callingItemId);
                    } else if (callType === 'audio') {
                      this._CreateAudioRoom(callingItemId);
                    }
                  }}
                />
                <CustomButton
                  buttonStyle={[
                    styles.wBtn,
                    {backgroundColor: '#dc3545', marginLeft: isTablet ? 10 : 0},
                  ]}
                  text="Cancel"
                  onPress={() => {
                    wForm.name = '';
                    (wForm.dob = ''), (wForm.costId = '');
                    this.setState({
                      wForm,
                      workOrderForm: false,
                      callingItemId: '',
                      callType: '',
                    });
                  }}
                />
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    );
  };

  render() {
    const {
      showLoader,
      filtersModel,
      callModel,
      searchText,
      contacts,
      searchedContacts,
      selectedItem,
      filterData,
      filterDataModel,
      facility,
      language,
      isTablet,
      orientation,
      screenDimensions,
      shareVideo,
      shareAudio,
      participants,
      participantList,
    } = this.state;

    const {navigation} = this.props;

    const listData = !searchText
      ? contacts
      : contacts.filter((item) => {
          const itemData = `${item.LanguageName.toUpperCase()}`;
          const textData = searchText.toUpperCase().trim();
          return itemData.indexOf(textData) > -1;
        });

    let customFieldStyle = styles.fieldStyle(this.state.primaryColor);
    if (orientation === 'landscape') {
      customFieldStyle = [
        styles.fieldStyle(this.state.primaryColor),
        {flex: 1},
      ];
    }
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        {showLoader ? (
          <Loader />
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : ''}
            style={{flex: 1}}>
            <View style={styles.container}>
              {isTablet ? (
                <View style={[styles.tabletHeaderWrapper]}>
                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={styles.menuBtnContainer}
                    onPress={() => navigation.toggleDrawer()}>
                    <Ionicons
                      name="log-out-outline"
                      size={30}
                      color={this.state.secondaryColor}
                      style={{
                        marginTop: -2,
                      }}
                    />
                    {/* <Image
                      source={Images.MenuIcon}
                      style={styles.menuBtn}
                      resizeMode="contain"
                    /> */}
                  </TouchableOpacity>
                  <View style={styles.tabletSearchWrapper}>
                    <SearchInput
                      placeholder="Search"
                      value={searchText}
                      onChangeText={(text) => {
                        this.setState({
                          searchText: text,
                        });
                      }}
                    />
                  </View>
                  <View
                    style={[
                      styles.logoWrapper,
                      {
                        width: orientation === 'portrait' ? 250 : 350,
                        height: orientation === 'portrait' ? 80 : 90,
                        paddingRight: 10,
                      },
                    ]}>
                    <Image
                      source={{uri: this.state.logoUrl}}
                      style={[
                        styles.logoStyle,
                        {
                          width: '100%',
                          height: '100%',
                        },
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.headerWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={styles.menuBtnContainer}
                    // onPress={this._drawerHamburgerPress}

                    onPress={() => navigation.toggleDrawer()}>
                    <Ionicons
                      name="log-out-outline"
                      size={30}
                      color={this.state.secondaryColor}
                      style={{marginTop: -2}}
                    />
                    {/* <Image
                      source={Images.MenuIcon}
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                        // marginTop: ,
                      }}
                    /> */}

                    {/* <Image
                      source={Images.MenuIcon}
                      style={styles.menuBtn}
                      resizeMode="contain"
                    /> */}
                  </TouchableOpacity>
                  <Image
                    source={{uri: this.state.logoUrl}}
                    style={{width: 270, height: 60}}
                    resizeMode="contain"
                  />
                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={styles.menuBtnContainer}
                    onPress={() => {
                      const filterDataModel = JSON.parse(
                        JSON.stringify(filterData),
                      );
                      this.setState({
                        filterDataModel: filterDataModel,
                        filtersModel: true,
                      });
                    }}>
                    <Svg height="40px" width="40px" viewBox="0 0 100 100">
                      <Rect
                        class="cls-1"
                        y="4.44"
                        width="72.05"
                        height="4.99"
                        stroke={this.state.secondaryColor}
                        strokeWidth=".5"
                        fill={this.state.secondaryColor}
                      />
                      <Rect
                        class="cls-1"
                        y="26.44"
                        width="72.05"
                        height="4.99"
                        stroke={this.state.secondaryColor}
                        strokeWidth=".5"
                        fill={this.state.secondaryColor}
                      />
                      <Rect
                        class="cls-1"
                        y="48.39"
                        width="72.05"
                        height="4.99"
                        stroke={this.state.secondaryColor}
                        strokeWidth=".5"
                        fill={this.state.secondaryColor}
                      />
                      <Circle
                        class="cls-1"
                        cx="20.56"
                        cy="28.93"
                        r="6.94"
                        stroke={this.state.secondaryColor}
                        strokeWidth=".5"
                        fill={this.state.secondaryColor}
                      />
                      <Circle
                        class="cls-1"
                        cx="51.69"
                        cy="50.89"
                        r="6.94"
                        stroke={this.state.secondaryColor}
                        strokeWidth=".5"
                        fill={this.state.secondaryColor}
                      />
                      <Circle
                        class="cls-1"
                        cx="51.63"
                        cy="6.94"
                        r="6.94"
                        stroke={this.state.secondaryColor}
                        strokeWidth=".5"
                        fill={this.state.secondaryColor}
                      />
                      {/* <Circle
                        cx="50"
                        cy="50"
                        r="50"
                        stroke="purple"
                        strokeWidth=".5"
                        fill="violet"
                      /> */}
                    </Svg>
                    {/* <Image
                      source={Images.FilterIcon}
                      style={styles.menuBtn}
                      resizeMode="contain"
                    /> */}
                  </TouchableOpacity>
                </View>
              )}
              {isTablet ? (
                <View style={styles.allFieldsWrapper}>
                  <View
                    style={[
                      styles.twoFieldsWrapper,
                      {
                        flexDirection:
                          orientation === 'landscape' ? 'row' : 'column',
                      },
                    ]}>
                    <TouchableOpacity
                      activeOpacity={0.3}
                      style={customFieldStyle}
                      onPress={() => {
                        // filterData.allLanguages = !filterData.allLanguages;
                        // this.setState({filterData});
                        this.setState({languagesFilter: 'top'}, () => {
                          this._GetClientLanguages();
                        });
                      }}>
                      <Text style={styles.fieldTextStyle}>Top Languages</Text>
                      {this.state.languagesFilter === 'top' && (
                        <View style={styles.fieldIcon}>
                          <Ionicons
                            name="md-checkmark-sharp"
                            size={25}
                            color={'white'}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.3}
                      style={customFieldStyle}
                      onPress={() => {
                        // filterData.topLanguages = !filterData.topLanguages;
                        // this.setState({filterData});
                        this.setState({languagesFilter: 'all'}, () => {
                          this._GetAllLanguages();
                        });
                      }}>
                      <Text style={styles.fieldTextStyle}>All Languages</Text>
                      {this.state.languagesFilter === 'all' && (
                        <View style={styles.fieldIcon}>
                          <Ionicons
                            name="md-checkmark-sharp"
                            size={25}
                            color={'white'}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.twoFieldsWrapper,
                      {
                        flexDirection:
                          orientation === 'landscape' ? 'row' : 'column',
                      },
                    ]}>
                    <PickerSelect
                      wrapperStyle={[
                        customFieldStyle,
                        {
                          backgroundColor: this.state.secondaryColor,
                        },
                      ]}
                      offStyle={true}
                      whiteStyle={true}
                      list={facility}
                      value={filterData.facility}
                      placeholder="Facility"
                      onSelectChange={(value) => {
                        filterData.facility = value;
                        if (!value) return;
                        this.setState({filterData}, () => {
                          this._SetDefaultFacility(value);
                        });
                        // filterDataModel.facility = value;
                        // this.setState({filterDataModel}, () => {
                        //   // this._onModelApplyPress();
                        // });
                      }}
                    />
                    <PickerSelect
                      wrapperStyle={[
                        customFieldStyle,
                        {
                          backgroundColor: this.state.secondaryColor,
                        },
                      ]}
                      offStyle={true}
                      whiteStyle={true}
                      list={language}
                      value={filterData.language}
                      placeholder="Source Language"
                      onSelectChange={(value) => {
                        if (!value) return;
                        filterData.language = value;
                        this.setState({filterData}, () => {
                          this._SetDefaultLanguage(value);
                        });
                        // filterDataModel.language = value;
                        // this.setState({filterDataModel}, () => {
                        //   // this._onModelApplyPress();
                        // });
                      }}
                    />
                  </View>
                </View>
              ) : (
                <View
                  style={{width: '100%', paddingHorizontal: 10, marginTop: 5}}>
                  <SearchInput
                    placeholder="Search"
                    value={searchText}
                    onChangeText={(text) => {
                      this.setState({
                        searchText: text,
                      });
                    }}
                  />
                </View>
              )}

              {!isTablet && (
                <View
                  style={{
                    width: '100%',
                    paddingHorizontal: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={[customFieldStyle, {flex: 1, height: 40}]}
                    onPress={() => {
                      // filterData.allLanguages = !filterData.allLanguages;
                      // this.setState({filterData});
                      this.setState({languagesFilter: 'top'}, () => {
                        this._GetClientLanguages();
                      });
                    }}>
                    <Text style={styles.fieldTextStyle}>Top Languages</Text>
                    {this.state.languagesFilter === 'top' && (
                      <View style={styles.fieldIcon}>
                        <Ionicons
                          name="md-checkmark-sharp"
                          size={25}
                          color={'white'}
                        />
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={[customFieldStyle, {flex: 1, height: 40}]}
                    onPress={() => {
                      // filterData.topLanguages = !filterData.topLanguages;
                      // this.setState({filterData});
                      this.setState({languagesFilter: 'all'}, () => {
                        this._GetAllLanguages();
                      });
                    }}>
                    <Text style={styles.fieldTextStyle}>All Languages</Text>
                    {this.state.languagesFilter === 'all' && (
                      <View style={styles.fieldIcon}>
                        <Ionicons
                          name="md-checkmark-sharp"
                          size={25}
                          color={'white'}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.listContainer}>
                <FlatGrid
                  keyExtractor={(item, index) => item.Id.toString()}
                  key={
                    isTablet ? (orientation === 'landscape' ? 'l' : 'p') : 'm'
                  }
                  itemDimension={
                    isTablet
                      ? orientation === 'landscape'
                        ? screenDimensions.width / 5
                        : screenDimensions.width / 3
                      : screenDimensions.width
                  }
                  data={listData}
                  renderItem={({item}) => (
                    <ContactListItem
                      item={item}
                      Color={{
                        primaryColor: this.state.primaryColor,
                        secondaryColor: this.state.secondaryColor,
                      }}
                      open={item.Id === selectedItem ? true : false}
                      onListItemPress={this._onListItemPress}
                      onVideoPress={() => {
                        console.log(this.state.facility);
                        if (this.state.isVideoAvailable) {
                          this.setState({
                            callType: 'video',
                            callingItemId: item.Id,
                            callingItemName: item.LanguageName,
                            workOrderForm: true,
                          });
                        } else {
                          this.setState({showNotAvailableModal: true});
                          this.setState({
                            callingItemId: item.Id,
                            callingItemName: item.LanguageName,
                          });
                        }

                        // this._CreateVideoRoom(item.Id);
                      }}
                      onCallPress={() => {
                        this.setState({
                          callType: 'audio',
                          callingItemId: item.Id,
                          callingItemName: item.LanguageName,
                          workOrderForm: true,
                        });
                        // this._CreateAudioRoom(item.Id);
                      }}
                    />
                  )}
                />
              </View>
            </View>
            <OPI_VRIFilterScreen
              visible={filtersModel}
              filterData={filterDataModel}
              facility={facility}
              language={language}
              languagesFilter={this.state.languagesFilter}
              onRequestClose={() => this.setState({filtersModel: false})}
              onPressAllLanguages={() => {
                this.setState({languagesFilter: 'all'});
              }}
              onPressTopLanguages={() => {
                // storeData('languageFilter', 'top');
                this.setState({languagesFilter: 'top'});
              }}
              onFacilityChange={(value) => {
                filterDataModel.facility = value;
                this.setState({filterDataModel});
              }}
              onLanguageChange={(value) => {
                filterDataModel.language = value;
                this.setState({filterDataModel});
              }}
              onApplyPress={this._onModelApplyPress}
            />
          </KeyboardAvoidingView>
        )}
        {this.renderWorkOrderModal()}
        {this.renderNotAvailableModal()}
      </SafeAreaView>
    );
  }
}

const {height, width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  callContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  button: {
    marginTop: 100,
  },
  localVideo: {
    flex: 1,
    width: 150,
    height: 250,
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  remoteVideo: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    width: 100,
    height: 120,
  },
  optionsContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ////////////////////
  container: {
    flex: 1,
    alignItems: 'center',
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  tabletHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    // marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    minHeight: 95,
  },
  tabletSearchWrapper: {
    marginTop: 33,

    flex: 1,

    justifyContent: 'center',
    // paddingTop: 15,
  },
  menuBtnContainer: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  menuBtn: {
    width: 25,
    height: 25,
  },
  logoWrapper: {
    width: width * 0.25,
    height: 50,
  },
  logoStyle: {
    width: '100%',
    height: '100%',
  },
  fieldStyle: (primaryColor) => {
    return {
      justifyContent: 'center',
      marginHorizontal: 5,
      height: 50,
      paddingHorizontal: 10,
      marginVertical: 5,
      backgroundColor: primaryColor,
      borderRadius: 8,
      // elevation: 3,
      // shadowColor: '#000000',
      // shadowRadius: 5,
      // shadowOffset: {height: 10},
      // shadowOpacity: 0.3,
    };
  },
  fieldTextStyle: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
  },
  fieldIcon: {
    position: 'absolute',
    zIndex: 1,
    right: 5,
  },
  allFieldsWrapper: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  twoFieldsWrapper: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    width: '100%',
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
  wBtn: {
    height: 45,
    paddingHorizontal: 10,
  },
});
export default OPI_VRIScreen;
