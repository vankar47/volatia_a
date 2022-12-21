import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../constants/Colors';
import Images from '../constants/Images';

export default (props) => {
  const {title, textStyle, settings, onPress, onAddPress} = props;

  return (
    <View style={styles.container}>
      {onPress && (
        <TouchableOpacity
          activeOpacity={0.3}
          style={styles.backBtnContainer}
          onPress={onPress}>
          <Image
            source={Images.Back}
            style={styles.backBtn}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      {title && (
        <Text numberOfLines={1} style={[styles.headerText, textStyle]}>
          {title}
        </Text>
      )}
      {onAddPress && (
        <TouchableOpacity
          activeOpacity={0.3}
          style={styles.addBtnContainer}
          onPress={onAddPress}>
          <Image
            source={settings ? Images.SettingsIcon : Images.AddIcon}
            style={styles.addBtn}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 62,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    width: 20,
    height: 20,
  },
  backBtnContainer: {
    left: 0,
    top: 0,
    padding: 20,
    width: 60,
    position: 'absolute',
  },
  headerText: {
    width: '75%',
    textAlign: 'center',
    color: Colors.accentColor,
    fontSize: 25,
    paddingVertical: 10,
    fontWeight: 'bold',
  },
  addBtnContainer: {
    right: 0,
    top: 0,
    padding: 20,
    width: 60,
    position: 'absolute',
  },
  addBtn: {
    width: 24,
    height: 24,
  },
});
