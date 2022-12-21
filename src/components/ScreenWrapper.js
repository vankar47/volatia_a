import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Images from '../constants/Images';

const dimen = Dimensions.get('screen');

export default (props) => {
  const [orientation, setOrientation] = useState(
    dimen.height >= dimen.width ? 'portrait' : 'landscape',
  );
  const [screenDimensions, setScreenDimensions] = useState({
    height: dimen.height,
    width: dimen.width,
  });

  useEffect(() => {
    Dimensions.addEventListener('change', () => {
      const dim = Dimensions.get('screen');
      setScreenDimensions({
        height: dim.height,
        width: dim.width,
      });
      setOrientation(dim.height >= dim.width ? 'portrait' : 'landscape');
    });
  }, []);

  const {background, bgColor} = props;
  let colorBG = 'white';
  if (bgColor) {
    colorBG = bgColor;
  }

  const isTablet = DeviceInfo.isTablet();
  const tabletBG =
    orientation === 'landscape' ? Images.TabBGLandscape : Images.TabBackground;

  return (
    <View style={[styles.wrapper, {backgroundColor: colorBG}]}>
      {!isTablet && (
        <>
          <Image
            source={Images.mTopLeft}
            resizeMode="contain"
            style={[
              styles.cornerImage,
              {width: 115, height: 150, top: -1, left: -1},
            ]}
          />

          <Image
            source={Images.mTopRight}
            resizeMode="contain"
            style={[
              styles.cornerImage,
              {width: 80, height: 85, top: -1, right: -1},
            ]}
          />

          <Image
            source={Images.mBottomRight}
            resizeMode="contain"
            style={[
              styles.cornerImage,
              {width: 90, height: 125, bottom: -1, right: -1},
            ]}
          />

          <Image
            source={Images.mBottomLeft}
            resizeMode="contain"
            style={[
              styles.cornerImage,
              {
                width: 110,
                height: 175,
                bottom: -1,
                left: -1,
              },
            ]}
          />
        </>
      )}
      {isTablet ? (
        <ImageBackground
          source={isTablet ? tabletBG : Images.Background}
          resizeMode="cover"
          style={styles.wrapper}>
          <SafeAreaView style={styles.wrapper}>{props.children}</SafeAreaView>
        </ImageBackground>
      ) : (
        <SafeAreaView style={styles.wrapper}>{props.children}</SafeAreaView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  cornerImage: {
    position: 'absolute',
  },
});
