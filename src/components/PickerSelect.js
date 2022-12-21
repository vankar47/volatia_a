import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import PickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  const {
    onSelectChange,
    placeholder,
    offStyle,
    whiteStyle,
    list,
    value,
    inputColor,
    wrapperStyle,
    placeholderColor = '#fff',
  } = props;

  let defaultStyle = [
    styles.inputWrapper,
    wrapperStyle,
    {
      backgroundColor: primaryColor,
      borderColor: primaryColor,
    },
    value !== '' && styles.shadowForSelected,
  ];

  if (offStyle) {
    defaultStyle = wrapperStyle;
  }

  let inColor = 'white';
  if (inputColor) {
    inColor = inputColor;
  }

  return (
    <View style={defaultStyle}>
      <PickerSelect
        style={{
          inputAndroid: {
            color: inColor,
            fontFamily: 'Montserrat-Regular',
            paddingRight: 30,
          },
          placeholder: {
            color: placeholderColor,
          },
          inputIOS: {
            color: inColor,
            fontFamily: 'Montserrat-Regular',
            paddingRight: 30,
            minHeight: 40,
          },
          iconContainer: {
            right: 5,
          },
        }}
        Icon={() => {
          return (
            <View style={styles.iconContainer}>
              <Ionicons
                name="caret-down"
                size={15}
                color={
                  whiteStyle ? 'white' : value === 0 ? Colors.gray : inColor
                }
              />
            </View>
          );
        }}
        value={value}
        useNativeAndroidPickerStyle={false}
        placeholder={
          typeof placeholder === 'string'
            ? {label: placeholder, value: ''}
            : placeholder
        }
        onValueChange={onSelectChange}
        items={list}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  inputWrapper: {
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  iconContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowForSelected: {
    // elevation: 3,
    // shadowColor: Colors.primaryColor,
    // shadowRadius: 5,
    // shadowOffset: {height: 10},
    // shadowOpacity: 0.3,
  },
});
