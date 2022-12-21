import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../constants/Colors';
import {getData} from '../store/storage';

export default (props) => {
  const [primaryColor, setPrimaryColor] = useState('#00b7ff');
  const [accentColor, setAccentColor] = useState('#9cd445');

  useEffect(() => {
    (async () => {
      const color = await getData('AllColors');
      const output = JSON.parse(color);
      setPrimaryColor(output.primaryColor);
      setAccentColor(output.secondaryColor);
    })();
  }, []);

  const {text, buttonStyle, textStyle, onPress} = props;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.buttonStyle(primaryColor), buttonStyle]}>
      <Text style={[styles.textStyle, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  buttonStyle: (primaryColor) => {
    return {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 45,
      backgroundColor: primaryColor,
      borderRadius: 5,
      marginVertical: 10,
    };
  },
  textStyle: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 17,
  },
});
