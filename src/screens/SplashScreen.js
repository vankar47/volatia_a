import React, {Component} from 'react';
import {View, Image, Dimensions, StyleSheet} from 'react-native';
import {getData} from '../store/storage';
import {CommonActions} from '@react-navigation/native';
import ScreenWrapper from './../components/ScreenWrapper';

import DeviceInfo, {isTablet} from 'react-native-device-info';
import Images from '../constants/Images';

const dim = Dimensions.get('screen');

class SplashScreen extends Component {
  state = {
    tablet: false,
    orientation: dim.height >= dim.width ? 'portrait' : 'landscape',
  };
  async componentDidMount() {
    const accessToken = await getData('AccessToken');
    let nextScreen = 'Login';
    if (accessToken) {
      nextScreen = 'Home';
    }
    const isTablet = DeviceInfo.isTablet();
    this.setState({tablet: isTablet});

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
    setTimeout(this.navigateToNextScreen.bind(this, nextScreen), 2000);
  }

  navigateToNextScreen = (nextScreen) => {
    const {navigation} = this.props;
    const resetAction = CommonActions.reset({
      index: 1,
      routes: [{name: nextScreen}],
    });
    navigation.dispatch(resetAction);
  };

  render() {
    const {tablet, orientation} = this.state;
    return (
      <ScreenWrapper background={true}>
        <View style={styles.container}>
          <Image
            source={Images.Logo}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </ScreenWrapper>
    );
  }
}
const {height, width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    height: height * 0.6,
    width: width * 0.6,
  },
});
export default SplashScreen;
