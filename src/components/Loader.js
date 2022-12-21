import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';
import Colors from '../constants/Colors';
const {height, width} = Dimensions.get('screen');
import {getData} from '../store/storage';

export default (props) => {
  var {color = Colors.primaryColor} = props;

  // const [primaryColor, setPrimaryColor] = useState('#00b7ff');

  const [primaryColor, setPrimaryColor] = useState('#00b7ff');
  const [accentColor, setAccentColor] = useState('#9cd445');

  // const [orientation, setOrientation] = useState('');

  useEffect(() => {
    (async () => {
      color = await getData('AllColors');
      const output = JSON.parse(color);
      setPrimaryColor(output.primaryColor);
      setAccentColor(output.secondaryColor);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={primaryColor} {...props} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width,
    height: height * 0.5,
  },
});
