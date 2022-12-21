import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Images from '../constants/Images';
import Colors from '../constants/Colors';
import CustomButton from '../components/CustomButton';
import PickerSelect from '../components/PickerSelect';

export default (props) => {
  const {
    visible,
    filterData,
    facility,
    language,
    onRequestClose,
    onPressAllLanguages = () => {},
    onPressTopLanguages,
    onFacilityChange,
    onLanguageChange,
    onApplyPress,
    languagesFilter,
  } = props;

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onRequestClose}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View style={styles.container}>
            <TouchableOpacity
              activeOpacity={0.3}
              style={styles.crossBtnContainer}
              onPress={onRequestClose}>
              <Image
                source={Images.CancelIcon}
                style={styles.crossBtn}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.filtersContainer}>
              {/* <TouchableOpacity
                activeOpacity={0.3}
                style={[
                  styles.fieldStyle,
                  {
                    backgroundColor:
                      languagesFilter === 'top' ? Colors.primaryColor : 'white',
                    borderColor:
                      languagesFilter === 'top'
                        ? Colors.primaryColor
                        : Colors.gray,
                  },
                  // languagesFilter === 'top' && styles.shadowForSelected,
                ]}
                onPress={onPressTopLanguages}>
                <Text
                  style={[
                    styles.fieldTextStyle,
                    {
                      color: languagesFilter === 'top' ? 'white' : Colors.gray,
                    },
                  ]}>
                  Top Languages
                </Text>
                {languagesFilter === 'top' && (
                  <View style={styles.fieldIcon}>
                    <Ionicons
                      name="md-checkmark-sharp"
                      size={25}
                      color={'white'}
                    />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.3}
                style={[
                  styles.fieldStyle,
                  {
                    backgroundColor:
                      languagesFilter === 'all' ? Colors.primaryColor : 'white',
                    borderColor:
                      languagesFilter === 'all'
                        ? Colors.primaryColor
                        : Colors.gray,
                  },
                  // filterData.allLanguages && styles.shadowForSelected,
                ]}
                onPress={() => onPressAllLanguages()}>
                <Text
                  style={[
                    styles.fieldTextStyle,
                    {
                      color: languagesFilter === 'all' ? 'white' : Colors.gray,
                    },
                  ]}>
                  All Languages
                </Text>
                {languagesFilter === 'all' && (
                  <View style={styles.fieldIcon}>
                    <Ionicons
                      name="md-checkmark-sharp"
                      size={25}
                      color={'white'}
                    />
                  </View>
                )}
              </TouchableOpacity> */}
              <PickerSelect
                list={facility}
                value={filterData.facility}
                placeholder="Choose a Facility"
                onSelectChange={onFacilityChange}
              />
              <PickerSelect
                list={language}
                value={filterData.language}
                placeholder="Source Language"
                onSelectChange={onLanguageChange}
              />
            </View>
            <CustomButton text="Apply" onPress={onApplyPress} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  crossBtnContainer: {
    alignSelf: 'flex-end',
    margin: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossBtn: {
    width: 20,
    height: 20,
  },
  filtersContainer: {
    width: '85%',
  },
  fieldStyle: {
    justifyContent: 'center',
    borderWidth: 1,
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  shadowForSelected: {
    elevation: 3,
    shadowColor: Colors.primaryColor,
    shadowRadius: 5,
    shadowOffset: {height: 10},
    shadowOpacity: 0.3,
  },
  fieldTextStyle: {
    marginLeft: 5,
    fontFamily: 'Montserrat-Regular',
  },
  fieldIcon: {
    position: 'absolute',
    zIndex: 1,
    right: 15,
  },
});
