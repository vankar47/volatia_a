import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import Joi from 'joi-react-native';
import DeviceInfo from 'react-native-device-info';
import validateSchema from '../helpers/validation';

import ScreenWrapper from './../components/ScreenWrapper';
import BoxWithShadow from './../components/BoxWithShadow';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import Input from '../components/Input';
import CustomButton from '../components/CustomButton';

const forgotSchema = Joi.object({
  email: Joi.string().email().min(5).max(100).required(),
});

class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTablet: false,
      forgotForm: {
        email: '',
      },
      forgotErrors: {
        email: '',
      },
    };
  }
  componentDidMount() {
    const isTablet = DeviceInfo.isTablet();
    this.setState({isTablet});
  }

  _loginpressed = () => {
    this.props.navigation.goBack();
  };
  _resetPressed = () => {
    const {forgotForm} = this.state;
    const forgotErrors = validateSchema(forgotForm, forgotSchema, {
      email: {'any.empty': 'Email is required'},
    });
    if (forgotErrors) return this.setState({forgotErrors});
    this.props.navigation.goBack();
  };
  render() {
    const {isTablet, forgotForm, forgotErrors} = this.state;
    return (
      <ScreenWrapper background={true}>
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : ''}
            style={{flex: 1}}>
            <View style={styles.container}>
              <View style={styles.logoContainer}>
                {isTablet && (
                  <Image
                    source={Images.Logo}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.forgotText}>RESET PASSWORD</Text>
              </View>
              <BoxWithShadow
                offStyle={isTablet ? true : false}
                style={styles.inputsContainer}>
                <Text style={styles.forgotDescription}>
                  Enter your email to receive instruction on how to reset your
                  password.
                </Text>
                <Input
                  placeholder="Email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    forgotForm.email = text;
                    forgotErrors.email = '';
                    this.setState({forgotForm, forgotErrors});
                  }}
                  error={forgotErrors.email}
                />
              </BoxWithShadow>
              <CustomButton
                buttonStyle={styles.resetBtn}
                text="Reset"
                onPress={this._resetPressed}
              />
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.forgotDescription}>Or return to </Text>
                <TouchableOpacity onPress={this._loginpressed}>
                  <Text style={[styles.forgotDescription, styles.logintext]}>
                    Log in.
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
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
    alignItems: 'center',
  },
  logoImage: {
    height: 80,
    width: width * 0.4,
  },
  inputsContainer: {
    width: '85%',
    justifyContent: 'center',
    maxWidth: 500,
    paddingTop: 15,
    paddingBottom: 25,
  },
  forgotText: {
    color: Colors.accentColor,
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    marginTop: 10,
    paddingVertical: 10,
  },
  forgotDescription: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
  },
  resetBtn: {
    marginVertical: 25,
  },
  logintext: {
    color: Colors.accentColor,
    borderColor: Colors.accentColor,
    borderBottomWidth: 1,
  },
});
export default ForgotPasswordScreen;
