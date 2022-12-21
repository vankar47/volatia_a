import React from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import Colors from '../constants/Colors';

export default (props) => {
  const {
    placeholder,
    error,
    inputWrapperStyle,
    inputWrapperErrorStyle,
    inputStyle,
    errorStyle,
    containerStyle,
  } = props;

  const wrapperErrorStyle = error
    ? {borderBottomWidth: 1, borderColor: 'red', ...inputWrapperErrorStyle}
    : {};
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <View style={[styles.inputWrapper, inputWrapperStyle, wrapperErrorStyle]}>
        <TextInput
          {...props}
          style={[styles.input, inputStyle]}
          selectionColor={Colors.primaryColor}
          placeholder={placeholder}
        />
      </View>
      {error ? <Text style={[styles.error, errorStyle]}>{error}</Text> : null}
    </View>
  );
};
const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 15,
    marginBottom: 0,
  },
  inputWrapper: {
    marginTop: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.veryDarkGrey,
  },
  input: {
    minHeight: 40,
    maxHeight: 180,
    fontSize: 15,
    paddingHorizontal: 15,
    fontFamily: 'Montserrat-Regular',
    color: '#000',
  },
  error: {
    color: 'red',
    marginTop: 3,
    fontSize: 15,
  },
});
