import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ErrorMessage} from 'formik';

function FormikError({error, visible}) {
  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 5,
      }}>
      <Text style={{color: 'red'}}>
        <ErrorMessage name={error} />
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
});

export default FormikError;
