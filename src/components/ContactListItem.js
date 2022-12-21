import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';
import {getData} from '../store/storage';

export default (props) => {
  const {
    item,
    open,
    containerStyle,
    onListItemPress,
    onVideoPress,
    onCallPress,
    Color,
  } = props;

  return (
    <View style={[containerStyle, styles.container]}>
      <TouchableOpacity
        style={[
          styles.touchableContainer,
          {
            backgroundColor: open ? Color.secondaryColor : 'white',
          },
        ]}
        activeOpacity={0.3}
        onPress={onListItemPress.bind(this, item.Id)}>
        <View style={styles.nameContainer}>
          <Text
            style={[
              styles.name,
              {
                color: open ? 'white' : Color.primaryColor,
              },
            ]}>
            {item.LanguageName}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: open ? 'white' : Color.primaryColor,
              },
            ]}
            numberOfLines={2}>
            {item.TranslatedTitle}
          </Text>
        </View>
        <View style={styles.iconsContainer}>
          <Ionicons
            style={styles.listIconsStyle}
            name="ios-videocam"
            size={25}
            color={open ? 'white' : Color.secondaryColor}
          />
          {item.Id !== 4 && (
            <Ionicons
              style={styles.listIconsStyle}
              name="ios-call"
              size={25}
              color={open ? 'white' : Color.secondaryColor}
            />
          )}
        </View>
      </TouchableOpacity>
      {open && (
        <View
          style={{
            backgroundColor: Color.primaryColor,
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 3,
          }}>
          <TouchableOpacity
            activeOpacity={0.3}
            onPress={onVideoPress.bind(this, item.Id)}
            style={[
              styles.bottomBtnContainer,
              {
                borderRightWidth: item.Id === 4 ? 0 : 0.5,
                borderColor: 'white',
              },
            ]}>
            <Ionicons
              style={styles.listIconsStyle}
              name="ios-videocam"
              size={23}
              color="white"
            />
            <Text style={styles.bottomText}>Video</Text>
          </TouchableOpacity>
          {item.Id !== 4 && (
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={onCallPress.bind(this, item.Id)}
              style={styles.bottomBtnContainer}>
              <Ionicons
                style={styles.listIconsStyle}
                name="ios-call"
                size={23}
                color="white"
              />
              <Text style={styles.bottomText}>Call</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  touchableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  iconsContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flex: 1,
    padding: 5,
    paddingRight: 10,
  },
  name: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
  },
  description: {
    opacity: 0.9,
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
  },
  listIconsStyle: {
    marginVertical: 5,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 3,
  },
  bottomBtnContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    fontSize: 12,
    marginTop: -5,
  },
});
