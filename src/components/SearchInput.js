import React, {useState, useEffect} from 'react';

import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Colors from '../constants/Colors';
import {getData} from '../store/storage';

export default (props) => {
  const {
    placeholder,
    inputWrapperStyle,
    inputStyle,
    onPress,
    handleSearch,
    value,
  } = props;

  const [primaryColor, setPrimaryColor] = useState('#00b7ff');
  const [accentColor, setSecondaryColor] = useState('#d3dbdb');

  useEffect(() => {
    (async () => {
      const color = await getData('AllColors');
      const output = JSON.parse(color);
      setPrimaryColor(output.primaryColor);
      setSecondaryColor(output.secondaryColor);
    })();
  }, []);

  return (
    <View style={[styles.inputWrapper, inputWrapperStyle]}>
      <TextInput
        {...props}
        style={[styles.input, inputStyle]}
        selectionColor={primaryColor}
        placeholder={placeholder}
        value={value}
        onChange={handleSearch}
      />
      <TouchableOpacity onPress={onPress} activeOpacity={0.3}>
        <Fontisto name="search" size={25} color={accentColor} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginVertical: 5,
    // marginBottom: 20,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 180,
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
  },
});
