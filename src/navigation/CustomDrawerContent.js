import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import {getData, removeData} from '../store/storage';

import Images from '../constants/Images';
import Colors from '../constants/Colors';

const CustomDrawerContent = (route, props) => {
  const [primaryColor, setPrimaryColor] = useState('#00b7ff');
  const [accentColor, setSecondaryColor] = useState('#d3dbdb');
  const [logo, setLogo] = useState('');

  useEffect(() => {
    (async () => {
      const color = await getData('AllColors');
      const output = JSON.parse(color);
      // console.log("output drawer",output);
      setPrimaryColor(output.primaryColor);
      setSecondaryColor(output.secondaryColor);
      setLogo(output.logoUrl);
    })();
  }, []);

  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen;
  let oPI_VRICheck = false,
    reportCenterCheck = false,
    scheduleServiceCheck = false;

  if (routeName === 'OPI_VRI') {
    oPI_VRICheck = true;
  } else if (routeName === 'ReportCenter') {
    reportCenterCheck = true;
  } else if (routeName === 'ScheduleService') {
    scheduleServiceCheck = true;
  }

  return (
    <View style={{flex: 1}}>
      <View style={styles.headerContainer}>
        <Image
          style={{height: 60, width: 230}}
          resizeMode="contain"
          source={{uri: logo}}
        />
      </View>
      <DrawerContentScrollView>
        <TouchableOpacity
          onPress={() => {
            route.navigation.navigate('OPI_VRI');
          }}
          activeOpacity={0.3}
          style={styles.listItemContainer}>
          <View
            style={
              oPI_VRICheck
                ? {
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 15,
                    backgroundColor: primaryColor,
                    borderTopRightRadius: 50,
                    borderBottomRightRadius: 50,
                    elevation: 5,
                  }
                : styles.itemIconContainer
            }>
            <Image
              style={{height: 20, width: 20}}
              resizeMode="contain"
              source={oPI_VRICheck ? Images.OPIIconWhite : Images.OPIIcon}
            />
          </View>
          <View style={styles.itemLabelContainer}>
            <Text
              style={
                oPI_VRICheck
                  ? {
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 14,
                      color: primaryColor,
                    }
                  : styles.itemLabelText
              }>
              OPI & VRI
            </Text>
          </View>
          <Entypo
            name="chevron-small-right"
            size={20}
            color={oPI_VRICheck ? primaryColor : Colors.drawerGray}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            route.navigation.navigate('ReportCenter');
          }}
          activeOpacity={0.3}
          style={styles.listItemContainer}>
          <View
            style={
              reportCenterCheck
                ? {
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 15,
                    backgroundColor: primaryColor,
                    borderTopRightRadius: 50,
                    borderBottomRightRadius: 50,
                    elevation: 5,
                  }
                : styles.itemIconContainer
            }>
            <Image
              style={{height: 20, width: 20}}
              resizeMode="contain"
              source={
                reportCenterCheck
                  ? Images.ReportCenterIconWhite
                  : Images.ReportCenterIcon
              }
            />
          </View>
          <View style={styles.itemLabelContainer}>
            <Text
              style={
                reportCenterCheck
                  ? {
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 14,
                      color: primaryColor,
                    }
                  : styles.itemLabelText
              }>
              Report Center
            </Text>
          </View>
          <Entypo
            name="chevron-small-right"
            size={20}
            color={reportCenterCheck ? primaryColor : Colors.drawerGray}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            route.navigation.navigate('ScheduleService', {
              screen: 'ScheduleService',
            });
          }}
          activeOpacity={0.3}
          style={styles.listItemContainer}>
          <View
            style={
              scheduleServiceCheck
                ? {
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 15,
                    backgroundColor: primaryColor,
                    borderTopRightRadius: 50,
                    borderBottomRightRadius: 50,
                    elevation: 5,
                  }
                : styles.itemIconContainer
            }>
            <Image
              style={{height: 20, width: 20}}
              resizeMode="contain"
              source={
                scheduleServiceCheck
                  ? Images.ScheduleIconWhite
                  : Images.ScheduleIcon
              }
            />
          </View>
          <View style={styles.itemLabelContainer}>
            <Text
              style={
                scheduleServiceCheck
                  ? {
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 14,
                      color: primaryColor,
                    }
                  : styles.itemLabelText
              }>
              Manage Work Order
            </Text>
          </View>
          <Entypo
            name="chevron-small-right"
            size={20}
            color={scheduleServiceCheck ? primaryColor : Colors.drawerGray}
          />
        </TouchableOpacity>
      </DrawerContentScrollView>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.nameWrapper}
          onPress={({navigation}) => {
            removeData('AccessToken');
            removeData('ColorResponse');
            removeData('AllColors');

            route.navigation.navigate('Login');
          }}>
          <Text style={styles.nameText}>Logout</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          activeOpacity={0.3}
          onPress={() => route.navigation.navigate('AccountMenu')}>
          <Entypo
            name="dots-three-horizontal"
            size={25}
            color={Colors.primaryColor}
          />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 130,
    borderBottomWidth: 0.5,
    borderColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
    marginRight: 10,
  },
  itemIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  selectedItemIconContainer: function (primaryColor) {
    return {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15,
      backgroundColor: primaryColor,
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
      elevation: 5,
    };
  },
  itemLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  itemLabelText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: Colors.drawerGray,
  },
  selectedItemLabelText: function (primaryColor) {
    return {
      fontFamily: 'Montserrat-Medium',
      fontSize: 14,
      color: primaryColor,
    };
  },
  footerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    height: 100,
    borderTopWidth: 0.5,
    borderColor: Colors.gray,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
  },
});

export default CustomDrawerContent;
