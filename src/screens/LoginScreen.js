import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {CheckBox} from 'react-native-elements';
import Joi from 'joi-react-native';
import DeviceInfo from 'react-native-device-info';
import validateSchema from '../helpers/validation';

import {postRequest} from '../services/request';
import {storeData} from '../store/storage';

import ScreenWrapper from './../components/ScreenWrapper';
import BoxWithShadow from './../components/BoxWithShadow';
import Loader from './../components/Loader';
import Input from '../components/Input';
import CustomButton from '../components/CustomButton';
import Images from '../constants/Images';
import Colors from '../constants/Colors';

import BoostlingoSdk, {BLVideoView, BLEventEmitter} from '../../BoostlingoSDK';

const loginSchema = Joi.object({
  username: Joi.string().trim().min(5).max(100).required(),
  password: Joi.string().min(5).max(25).required(),
});

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      isTablet: false,
      loginForm: {
        username: '',
        password: '',
        rememberCheck: false,
      },
      loginErrors: {
        username: '',
        password: '',
      },
    };
  }

  componentDidMount() {
    const isTablet = DeviceInfo.isTablet();
    this.setState({isTablet});
  }

  _rememberCheckPressed = () => {
    const {loginForm} = this.state;
    loginForm.rememberCheck = !loginForm.rememberCheck;
    this.setState({loginForm});
  };
  _loginPressed = async () => {
    const {loginForm} = this.state;
    const loginErrors = validateSchema(loginForm, loginSchema, {
      username: {'any.empty': 'Username is required'},
      password: {'any.empty': 'Password is required'},
    });
    if (loginErrors) return this.setState({loginErrors});

    const body = {
      grant_type: 'password',
      username: loginForm.username,
      password: loginForm.password,
    };
    this.setState({showLoader: true});
    const res = await postRequest('Token', body);
    console.log('res', res);
    if (res.result !== null) {
      if (res.result.data.access_token) {
        storeData('AccessToken', res.result.data.access_token);
        storeData(
          'AllColors',
          JSON.stringify({
            primaryColor: res.result.data.primaryColor,
            secondaryColor: res.result.data.secondaryColor,
            logoUrl: res.result.data.logoUrl,
          }),
        );
        const {navigation} = this.props;
        const resetAction = CommonActions.reset({
          index: 1,
          routes: [{name: 'Home'}],
        });

        navigation.dispatch(resetAction);
      } else {
        Alert.alert(
          `Error`,
          `Something went wrong.`,
          [
            {
              text: 'OK',
            },
          ],
          {cancelable: false},
        );
      }
    } else {
      this.setState({showLoader: false});
      Alert.alert(
        `Error`,
        `Username or Password is incorrect.`,
        [
          {
            text: 'OK',
          },
        ],
        {cancelable: false},
      );
    }
  };
  _forgotPressed = () => {
    this.props.navigation.navigate('ForgotPassword');
  };
  render() {
    const {showLoader, isTablet, loginForm, loginErrors} = this.state;
    return (
      <ScreenWrapper background={true}>
        {showLoader ? (
          <Loader />
        ) : (
          <ScrollView>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : ''}
              style={{flex: 1}}>
              <View style={styles.container}>
                <View style={styles.logoContainer}>
                  <Image
                    source={Images.Logo}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.inputsContainer}>
                  <BoxWithShadow offStyle={true} style={styles.shadowBox}>
                    <Input
                      placeholder="Username"
                      autoCapitalize="none"
                      onChangeText={(text) => {
                        loginForm.username = text;
                        loginErrors.username = '';
                        this.setState({loginForm, loginErrors});
                      }}
                      error={loginErrors.username}
                    />
                    <Input
                      placeholder="Password"
                      secureTextEntry={true}
                      onChangeText={(text) => {
                        loginForm.password = text;
                        loginErrors.password = '';
                        this.setState({loginForm, loginErrors});
                      }}
                      error={loginErrors.password}
                    />
                    <View style={styles.checkAndForgotContainer}>
                      <TouchableOpacity
                        style={styles.checkContainer}
                        activeOpacity={1}
                        onPress={this._rememberCheckPressed}>
                        <CheckBox
                          containerStyle={styles.checkStyle}
                          iconType="material-community"
                          checkedIcon="checkbox-marked-circle-outline"
                          uncheckedIcon="checkbox-blank-circle-outline"
                          size={18}
                          checkedColor={Colors.accentColor}
                          uncheckedColor={Colors.accentColor}
                          checked={loginForm.rememberCheck}
                          onPress={this._rememberCheckPressed}
                        />
                        <Text style={styles.rememberText}>Remember me</Text>
                      </TouchableOpacity>
                      {false && isTablet && (
                        <TouchableOpacity onPress={this._forgotPressed}>
                          <Text style={styles.forgotText}>
                            Forgot your password?
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </BoxWithShadow>
                  {false && !isTablet && (
                    <TouchableOpacity onPress={this._forgotPressed}>
                      <Text style={styles.forgotText}>
                        Forgot your password?
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <CustomButton
                  buttonStyle={styles.loginBtn}
                  text="Log In"
                  onPress={this._loginPressed}
                />
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        )}
      </ScreenWrapper>
    );
  }
}
const {height, width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    height: height * 0.25,
    justifyContent: 'flex-end',
    marginTop: 50,
  },
  logoImage: {
    height: 100,
    width: width * 0.65,
  },
  inputsContainer: {
    width: '85%',
    justifyContent: 'center',
    maxWidth: 500,
    marginTop: 20,
  },
  shadowBox: {
    paddingVertical: 5,
  },
  checkAndForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 15,
  },
  checkStyle: {
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
    margin: 0,
  },
  rememberText: {
    color: Colors.darkGray,
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
  },
  forgotText: {
    color: Colors.accentColor,
    fontFamily: 'Montserrat-Medium',
    alignSelf: 'flex-end',
    fontSize: 12,
    padding: 10,
  },
  loginBtn: {
    marginVertical: 20,
  },
});
export default LoginScreen;
