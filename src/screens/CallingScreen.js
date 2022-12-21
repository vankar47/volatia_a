import React, {Component} from 'react';
import {
  UIManager,
  findNodeHandle,
  requireNativeComponent,
  NativeEventEmitter,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  View,
  Button,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../components/Loader';
import {postWithParams, getRequest} from '../services/request';
import {getData, removeData} from '../store/storage';
import Colors from '../constants/Colors';
import BoostlingoSdk, {BLVideoView, BLEventEmitter} from '../../BoostlingoSDK';
import InCallManager from 'react-native-incall-manager';

const qs = require('querystring');

const {height, width} = Dimensions.get('screen');

class CallingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOverflow: true,
      callType: 'audio',
      orientation: '',
      languageName: 'Language',
      isAudioEnabled: true,
      isVideoEnabled: true,
      primaryColor: '#00a3f9',
      secondaryColor: '#9cd445',
      status: '',
      participants: new Map(),
      videoTracks: new Map(),
      token: '',
      roomUniqueName: '',
      roomSid: '',
      authToken: '',
      waitingParticipant: true,
      disconnectCalled: false,
      workOrderId: '',
      ///
      overflowGenderPreferenceId: 0,
      overflowLanguageFromId: 0,
      overflowLanguageToId: 0,
      overflowServiceTypeId: 0,
      blAccessToken: '',

      hangingUp: false,

      interpreterName: '',
      interpreterId: '',
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

  BLocalView = null;
  BRemoteView = null;

  componentDidMount = async () => {
    KeepAwake.activate();
    this.setColors();
    const {
      accessToken = '',
      callType = '',
      languageName = '',
      roomUniqueName = '',
      roomSid = '',
      isOverflow = false,
      workOrderId = '',
      overflowGenderPreferenceId = null,
      overflowLanguageFromId = 0,
      overflowLanguageToId = 0,
      overflowServiceTypeId = 0,
    } = this.props.route.params;

    // const accessToken =
    //   'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxMSIsInJvbGUiOiJDb3Jwb3JhdGVDbGllbnRSb290QWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoie1wiQ3VycmVudENvbXBhbnlJZFwiOjksXCJNYXN0ZXJDb21wYW55SWRcIjo4fSIsImNyZWF0ZWQiOiIwOS8yMC8yMDIwIDE4OjUwOjMwIiwiY3VsdHVyZUlkIjoiMSIsIm5iZiI6MTYwMDYyNzgzMCwiZXhwIjoxNjAzMjE5ODMwLCJpYXQiOjE2MDA2Mjc4MzAsImlzcyI6IkJvb3N0bGluZ28iLCJhdWQiOiJVc2VycyJ9.RqNJuojLd-cJC7LEkZJwO9aPjvzg1jx_dG94P5kq65INUms7va7YLhq2_3m51QTcqSl55-Umgbw21_2kSqw-xpmHBpA0yOVouLu9xSm0i3TLBayjCdxVi8psBUakqq08t__C6IRI0xflj1YB4pjIqJEVncHWfVyfzTYsiKsl1c4flwYW82SAj9letHGi-RgJRhhYtkf2HcuebtHRMxOKiWJ6gyea7e1A2864RWq8SmLpJSh9KQiI_EsWpFfOTUTXIqqv0w5tFa3v9m26xitlW5TzUE4IXGpnivR9hiCh2Omr2BF1IAx-BtQHxDm3rh4or7mrRt7AEhOMzWLfS4AlEQ';
    // const {
    //   accessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxMSIsInJvbGUiOiJDb3Jwb3JhdGVDbGllbnRSb290QWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoie1wiQ3VycmVudENvbXBhbnlJZFwiOjksXCJNYXN0ZXJDb21wYW55SWRcIjo4fSIsImNyZWF0ZWQiOiIwOS8yMC8yMDIwIDE4OjUwOjMwIiwiY3VsdHVyZUlkIjoiMSIsIm5iZiI6MTYwMDYyNzgzMCwiZXhwIjoxNjAzMjE5ODMwLCJpYXQiOjE2MDA2Mjc4MzAsImlzcyI6IkJvb3N0bGluZ28iLCJhdWQiOiJVc2VycyJ9.RqNJuojLd-cJC7LEkZJwO9aPjvzg1jx_dG94P5kq65INUms7va7YLhq2_3m51QTcqSl55-Umgbw21_2kSqw-xpmHBpA0yOVouLu9xSm0i3TLBayjCdxVi8psBUakqq08t__C6IRI0xflj1YB4pjIqJEVncHWfVyfzTYsiKsl1c4flwYW82SAj9letHGi-RgJRhhYtkf2HcuebtHRMxOKiWJ6gyea7e1A2864RWq8SmLpJSh9KQiI_EsWpFfOTUTXIqqv0w5tFa3v9m26xitlW5TzUE4IXGpnivR9hiCh2Omr2BF1IAx-BtQHxDm3rh4or7mrRt7AEhOMzWLfS4AlEQ",
    //   callType = 'video',
    //   languageName = this.props.route.params.languageName,
    //   workOrderID = this.props.route.params.languageName,
    //   roomUniqueName = '',
    //   roomSid = '',
    //   isOverflow = true,
    //   overflowGenderPreferenceId = null,
    //   overflowLanguageFromId = 0,
    //   overflowLanguageToId = 0,
    //   overflowServiceTypeId = 0,
    // } = {};
    const authToken = await getData('AccessToken');

    this.setState({
      accessToken,
      authToken,
      callType,
      isOverflow,
      overflowGenderPreferenceId,
      overflowLanguageFromId,
      overflowLanguageToId,
      overflowServiceTypeId,
      languageName,
      workOrderId,
      roomUniqueName,
      blAccessToken: accessToken,
    });

    console.log('ROUTE PARAMS', this.props.route.params);
    if (!isOverflow) {
      //twilio
      if (!roomUniqueName || !roomSid) {
        Alert.alert(
          'Error',
          'room name and room id is required to make a call.',
        );
        return;
      }
      if (!accessToken) {
        Alert.alert('Error', 'Invalid call token.');
        this.props.navigation.goBack();
        return;
      }
      this.setState({callType, languageName});

      this.setState({token: accessToken, roomUniqueName, roomSid}),
        this._onConnectButtonPress(accessToken);
    } else {
      //boostlingo goes here

      // Don't forget to unsubscribe, typically in componentWillUnmount
      this.BLcallDidConnect = BLEventEmitter.addListener(
        'callDidConnect',
        (event) => {
          console.log('callDidConnect', event);
          this.setState({waitingParticipant: false});
          this.setState({status: 'connected'});
          this.onBlCallConnect(event);
          //start firing api call for overflow Boostlingo calls
        },
      );

      this.BLcallDidDisconnect = BLEventEmitter.addListener(
        'callDidDisconnect',
        (event) => {
          console.log('callDidDisconnect ' + JSON.stringify(event));
          if (event) {
            Alert.alert(event);
          }
          this.onBlCallDisConnect();
        },
      );
      this.callDidFailToConnect = BLEventEmitter.addListener(
        'callDidFailToConnect',
        (event) => {
          console.log('callDidFailToConnect ' + JSON.stringify(event));
          this.onBlCallDisConnect();
        },
      );

      // BLEventEmitter.addListener('localVideoViewAttached', (event) => {
      //   console.log('localVideoViewAttached ' + JSON.stringify(event))
      // });
      // BLEventEmitter.addListener('remoteVideoViewAttached', (event) => {
      //   console.log('remoteVideoViewAttached ' + JSON.stringify(event))
      // });

      try {
        if (Platform.OS === 'android') {
          const granted = await this._requestAudioPermission();
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the audio');
          } else {
            return alert('RECORD_AUDIO permission denied');
          }

          const cameraGranted = await this._requestCameraPermission();
          if (cameraGranted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the Camera');
          } else {
            return alert('Camera permission denied');
          }
        }

        if (callType === 'video') {
          //video call

          new Promise((resolve) => {
            //     // TODO: detach video views after use
            //     // UIManager.dispatchViewManagerCommand(
            //     //   findNodeHandle(localVideoView),
            //     //   UIManager.getViewManagerConfig('BLVideoView').Commands.detach,
            //     //   []);

            UIManager.dispatchViewManagerCommand(
              findNodeHandle(this.BRemoteView),
              UIManager.getViewManagerConfig('BLVideoView').Commands
                .attachAsRemote,
              [],
            );

            UIManager.dispatchViewManagerCommand(
              findNodeHandle(this.BLocalView),
              UIManager.getViewManagerConfig('BLVideoView').Commands
                .attachAsLocal,
              [],
            );
            //     // TODO: detach video views after use
            //     //   UIManager.dispatchViewManagerCommand(
            //     //     findNodeHandle(remoteVideoView),
            //     //     UIManager.getViewManagerConfig('BLVideoView').Commands.detach,
            //     //     []);

            // NOTE: you can use 'localVideoViewAttached' and 'remoteVideoViewAttached' events instead of waiting
            setTimeout(resolve, 1000);
          })
            .then(() => {
              console.log('BEFORE MAKING CALL', {
                languageFromId: overflowLanguageFromId,
                languageToId: overflowLanguageToId,
                serviceTypeId: overflowServiceTypeId,
                genderId: overflowGenderPreferenceId,
              });
              BoostlingoSdk.makeVideoCall({
                genderId: null,
                languageFromId: overflowLanguageFromId,
                languageToId: overflowLanguageToId,
                serviceTypeId: overflowServiceTypeId,
              })
                .then((call) => {})
                .catch((error) => {
                  console.log('Error', error);
                  this.onBlCallDisConnect();
                });
            })
            .catch(() => {
              this.onBlCallDisConnect();
            });
        } else {
          //audio call

          const boostlingoAudioCall = await BoostlingoSdk.makeVoiceCall({
            languageFromId: overflowLanguageFromId,
            languageToId: overflowLanguageToId,
            serviceTypeId: overflowServiceTypeId,
            genderId: overflowGenderPreferenceId,
          });
        }
      } catch (err) {
        console.log('ERRRR ', err);
        this.onBlCallDisConnect();
      }
    }
  };

  componentWillUnmount = () => {
    KeepAwake.deactivate();

    const {isOverflow, hangingUp} = this.state;
    if (!isOverflow) {
      //twilio
    } else {
      //boostlingo
      //  TODO: detach video views after use
      // UIManager.dispatchViewManagerCommand(
      //   findNodeHandle(this.BLocalView),
      //   UIManager.getViewManagerConfig('BLVideoView').Commands.detach,
      //   [],
      // );
      // // TODO: detach video views after use
      // UIManager.dispatchViewManagerCommand(
      //   findNodeHandle(this.BRemoteView),
      //   UIManager.getViewManagerConfig('BLVideoView').Commands.detach,
      //   [],
      // );
    }
  };

  _onConnectButtonPress = async () => {
    if (Platform.OS === 'android') {
      await this._requestAudioPermission();
      await this._requestCameraPermission();
    }
    const {callType} = this.state;
    const isAudio = callType === 'audio';
    this.refs.twilioVideo.connect({
      accessToken: this.state.token,
      enableVideo: !isAudio,
      enableAudio: true,
    });
    this.setState({status: 'connecting'});
  };

  onBlCallDisConnect = () => {
    InCallManager.stop();
    if (this.BLcallDidConnect) this.BLcallDidConnect.remove();
    if (this.BLcallDidDisconnect) this.BLcallDidDisconnect.remove();
    if (this.callDidFailToConnect) this.callDidFailToConnect.remove();

    this.disconnectCallback();

    // BoostlingoSdk.dispose();
    this.props.navigation.goBack();
  };
  setColors = async () => {
    const color = await getData('AllColors');
    const output = JSON.parse(color);
    this.setState({primaryColor: output.primaryColor});
    this.setState({secondaryColor: output.secondaryColor});
  };

  onBlCallConnect = async (event) => {
    try {
      const {callId, interlocutorInfo} = event;
      const {
        callType,
        authToken,
        blAccessToken,
        roomUniqueName,
        overflowLanguageFromId,
        overflowLanguageToId,
        overflowServiceTypeId,
        workOrderId,
      } = this.state;
      InCallManager.start({media: callType === 'audio' ? 'audio' : 'video'});
      let queryString1 = qs.stringify({
        workOrderId,
        callId,
        accessToken: blAccessToken,
        identity: '',
        videoRoom: '',
        languageFromId: overflowLanguageFromId,
        languageToId: overflowLanguageToId,
        serviceTypeId: overflowServiceTypeId,
      });

      InCallManager.setForceSpeakerphoneOn(true);

      const overflowCallDetailsURL =
        callType === 'audio'
          ? 'api/Voice/SaveOverflowCallDetails'
          : 'api/Video/SaveOverflowCallDetails';

      const saveOverflowInterpreterDetails =
        callType === 'audio'
          ? 'api/Voice/SaveOverflowInterpreterDetails'
          : 'api/Video/SaveOverflowInterpreterDetails';

      const {
        companyName,
        firstName,
        lastName,
        userAccountId,
        requiredName,
        rating,
        imageInfo,
      } = interlocutorInfo;

      console.log('INTERPRETTER', interlocutorInfo);
      this.setState({
        interpreterName: requiredName,
        // interpreterId: userAccountId,
      });

      const queryString2 = qs.stringify({
        workOrderId,
        accountId: userAccountId,
        firstName,
        lastName,
        requiredName,
        imageKey: imageInfo.imageKey,
        companyName,
        rating: Math.round(rating),
      });

      const res = await postWithParams(
        overflowCallDetailsURL + '?' + queryString1,
        authToken,
      );

      const res2 = await postWithParams(
        saveOverflowInterpreterDetails + '?' + queryString2,
        authToken,
      );
    } catch (err) {
      console.log('INFO  ERROR', err);
    }
  };

  _onEndButtonPress = () => {
    const {isOverflow, hangingUp} = this.state;
    if (!isOverflow) {
      //twilio
      try {
        this.refs.twilioVideo.disconnect();
        const {status} = this.state;
        if (status === 'connecting') {
          this.disconnectCallback();
        }
        this.props.navigation.goBack();
      } catch (twilioHangupErr) {
        console.log('twilioHangupErr', twilioHangupErr);
      }
    } else {
      //boostlingo

      if (hangingUp !== false) return;

      this.setState({hangingUp: true}, () => {
        BoostlingoSdk.hangUp()
          .then(() => {
            this.setState({hangingUp: false});
            // this.onBlCallDisConnect();
          })
          .catch(() => {
            this.setState({hangingUp: false});
            Alert.alert('Error', 'Failed to hang up call');
          });
      });
    }
  };
  //isVideoEnabled
  _onMuteButtonPress = () => {
    const {isAudioEnabled, isOverflow} = this.state;
    if (!isOverflow) {
      //twilio
      this.refs.twilioVideo
        .setLocalAudioEnabled(!this.state.isAudioEnabled)
        .then((isEnabled) => this.setState({isAudioEnabled: isEnabled}));
    } else {
      BoostlingoSdk.muteCall(isAudioEnabled);
      this.setState({isAudioEnabled: !isAudioEnabled});
    }
  };

  _onCameraOffButtonPress = () => {
    const {isOverflow} = this.state;
    if (!isOverflow) {
      //twilio
      this.refs.twilioVideo
        .setLocalVideoEnabled(!this.state.isVideoEnabled)
        .then((isVideoEnabled) => {
          this.setState({isVideoEnabled});
        });
    } else {
      BoostlingoSdk.enableVideo(!this.state.isVideoEnabled);
      this.setState({isVideoEnabled: !this.state.isVideoEnabled});
    }
  };

  _onFlipButtonPress = () => {
    const {isOverflow} = this.state;
    if (!isOverflow) {
      //twilio
      this.refs.twilioVideo.flipCamera();
    } else {
      //boostlingo
      BoostlingoSdk.flipCamera();
    }
  };

  _onRoomDidConnect = async (roomData) => {
    console.log('Room DATA ', roomData);
    try {
      const {callType, authToken, roomSid, roomUniqueName} = this.state;
      const {participants} = roomData;
      const requestUrl =
        callType === 'audio'
          ? 'api/Voice/SaveClientParticipant'
          : 'api/Video/SaveClientParticipant';
      const res = await postWithParams(requestUrl, authToken, {
        roomName: roomUniqueName,
        roomSID: roomSid,
        participantIdentity: participants[0].identity,
        participantSID: participants[0].sid,
      });
      console.log('Join res', res);
    } catch (err) {
      console.log('JOIN ERROR', err);
    }

    this.setState({status: 'connected'});
  };

  _onRoomDidDisconnect = async ({error}) => {
    console.log('ERROR: ', error);
    const {status} = this.state;
    this.setState({status: 'disconnected'});

    if (status === 'connected') {
      this.disconnectCallback();
    }
  };

  getInterpreterByWorkOrder = async () => {
    const {callType, workOrderId, authToken} = this.state;

    const url =
      callType === 'video'
        ? 'api/Video/GetInterpreterByWorkOrderId'
        : 'api/Voice/GetInterpreterByWorkOrderId';

    const res = await getRequest(
      url + '?workOrderId=' + workOrderId,
      authToken,
    );

    const {DisplayName} = res.result.data;
    this.setState({interpreterName: DisplayName});
  };

  disconnectCallback = async () => {
    if (this.state.disconnectCalled) return;
    try {
      const {callType, authToken, roomUniqueName} = this.state;

      const requestUrl =
        callType === 'audio'
          ? 'api/Voice/MarkClientAsDisconnected'
          : 'api/Video/MarkClientAsDisconnected';
      const res = await postWithParams(requestUrl, authToken, {
        roomName: roomUniqueName,
      });
      this.props.navigation.navigate('OPI_VRI');
      console.log('MARK CLIENT AS DISCONNECTED', res);
      console.log({
        roomName: roomUniqueName,
      });
      this.setState({disconnectCalled: true});
    } catch (err) {
      console.log('disconnect ERROR', err);
    }
  };

  _onRoomDidFailToConnect = (error) => {
    console.log('CONNECT FAILED ERROR', error);
    Alert.alert('Error', "can't connect to the call.");
    this.props.navigation.goBack();
  };

  _onParticipantAddedVideoTrack = async ({participant, track}) => {
    console.log(participant);
    this.setState({
      waitingParticipant: false,
      videoTracks: new Map([
        ...this.state.videoTracks,
        [
          track.trackSid,
          {participantSid: participant.sid, videoTrackSid: track.trackSid},
        ],
      ]),
    });
    this.getInterpreterByWorkOrder();
  };

  _onParticipantAddedAudioTrack = async ({participant, track}) => {
    this.setState({
      waitingParticipant: false,
    });
    this.getInterpreterByWorkOrder();
  };

  _onParticipantRemovedVideoTrack = ({participant, track}) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const videoTracks = this.state.videoTracks;
    videoTracks.delete(track.trackSid);

    this.setState({videoTracks: new Map([...videoTracks])});
  };

  _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Need permission to access microphone',
        message: 'To Make a call we need microphone permission.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  };

  _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Need permission to access camera',
      message: 'To Make a call we need camera permission.',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
  };

  render() {
    const {
      status,
      callType,
      waitingParticipant,
      languageName,
      isOverflow,
      primaryColor,
      secondaryColor,
    } = this.state;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            waitingParticipant && callType === 'video' ? primaryColor : 'black',
        }}>
        <View style={styles.container(primaryColor)}>
          {/* Twilio Local View */}
          {callType === 'video' && isOverflow === false && (
            <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
          )}

          {/* BoostLingo Local View */}
          {callType === 'video' && isOverflow === true && (
            <BLVideoView
              style={{
                width: status === 'connected' ? 90 : 0,
                height: status === 'connected' ? 150 : 0,
                position: 'absolute',
                right: 10,
                top: 10,
                zIndex: 200,
              }}
              ref={(e) => {
                this.BLocalView = e;
              }}
            />
          )}

          {!waitingParticipant && (
            <View
              style={
                callType === 'video'
                  ? styles.videoLanguage
                  : {
                      width: '100%',
                      height:
                        this.state.orientation == 'landscape'
                          ? height * 0.4
                          : height - 150,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
              }>
              <Text style={{color: '#fff', fontSize: 18}}>
                {languageName} Interpreter
              </Text>
              <Text style={{color: '#fff', fontSize: 18}}>
                {this.state.interpreterName} {this.state.interpreterId}
              </Text>
            </View>
          )}

          <View style={styles.callContainer(primaryColor)}>
            {this.state.waitingParticipant && (
              <View
                style={{
                  flex: 1,
                  backgroundColor: primaryColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={{height: 70}}>
                  <Loader color={'#fff'} style={{transform: [{scale: 2}]}} />
                </View>
              </View>
            )}

            {/* //twilio */}
            {this.state.status === 'connected' && isOverflow === false && (
              <View style={[styles.remoteGrid, {marginTop: 100}]}>
                {Array.from(
                  this.state.videoTracks,
                  ([trackSid, trackIdentifier]) => {
                    return (
                      <TwilioVideoParticipantView
                        style={styles.remoteVideo}
                        key={trackSid}
                        trackIdentifier={trackIdentifier}
                      />
                    );
                  },
                )}
              </View>
            )}

            {/* Boostlingo  */}
            {callType === 'video' && isOverflow === true && (
              <View style={[styles.remoteGrid]}>
                <BLVideoView
                  style={{
                    width: status === 'connected' ? '100%' : 0,
                    height: status === 'connected' ? height - 100 : 0,
                    marginTop: 100,
                  }}
                  ref={(e) => {
                    this.BRemoteView = e;
                  }}
                />
              </View>
            )}

            <View style={[styles.callMenuContainer]}>
              {this.state.waitingParticipant && (
                <>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      fontSize: 30,
                      marginVertical: 20,
                    }}>
                    Connecting to your{' '}
                    <Text style={{fontWeight: 'bold'}}>
                      {this.state.languageName}
                    </Text>{' '}
                    interpreter
                  </Text>
                  <View style={styles.endCallContainer}>
                    <TouchableOpacity
                      style={[styles.optionButton, styles.endBtn]}
                      onPress={this._onEndButtonPress}>
                      <MaterialIcons name="call-end" color="#fff" size={35} />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {!this.state.waitingParticipant && (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={this._onMuteButtonPress}>
                    <MaterialIcons
                      name={this.state.isAudioEnabled ? 'mic' : 'mic-off'}
                      color="#fff"
                      size={25}
                    />
                  </TouchableOpacity>

                  {callType === 'video' && (
                    <>
                      <TouchableOpacity
                        style={styles.optionButton}
                        onPress={this._onFlipButtonPress}>
                        <MaterialIcons
                          name="autorenew"
                          color="#fff"
                          size={25}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.optionButton}
                        onPress={this._onCameraOffButtonPress}>
                        <MaterialCommunityIcons
                          name={
                            this.state.isVideoEnabled ? 'camera' : 'camera-off'
                          }
                          color="#fff"
                          size={25}
                        />
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity
                    style={[styles.optionButton, {backgroundColor: 'red'}]}
                    onPress={this._onEndButtonPress}>
                    <MaterialIcons name="call-end" color="#fff" size={35} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <TwilioVideo
            ref="twilioVideo"
            onRoomDidConnect={this._onRoomDidConnect}
            onRoomDidDisconnect={this._onRoomDidDisconnect}
            onRoomDidFailToConnect={this._onRoomDidFailToConnect}
            onParticipantAddedVideoTrack={this._onParticipantAddedVideoTrack}
            onParticipantAddedAudioTrack={this._onParticipantAddedAudioTrack}
            onParticipantRemovedVideoTrack={() => {
              // this._onParticipantRemovedVideoTrack();
              this._onEndButtonPress();
            }}
            onParticipantRemovedAudioTrack={() => {
              // this._onParticipantRemovedVideoTrack();
              this._onEndButtonPress();
            }}
            onRoomParticipantDidDisconnect={() => {
              // console.log('abc');
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default CallingScreen;

const styles = StyleSheet.create({
  audioLanguage: {
    width: '100%',
    height: height - 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoLanguage: {
    margin: 20,
    width: 250,
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 20,
  },
  container: function (primaryColor) {
    return {
      flex: 1,
      backgroundColor: primaryColor,
    };
  },
  callContainer: function (primaryColor) {
    return {
      flex: 1,
      position: 'relative',
      backgroundColor: primaryColor,
      zIndex: 10,
    };
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
    width: 90,
    height: 150,
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 50,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 50,
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endBtn: {
    width: 70,
    height: 70,
    backgroundColor: 'red',
    marginBottom: 40,
    borderRadius: 0,
    width: 200,
  },
  endCallContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 50,
    marginBottom: 0,
  },
  callMenuContainer: {
    left: 20,
    right: 20,
    position: 'absolute',
    bottom: 30,
    paddingVertical: 10,
  },
});
