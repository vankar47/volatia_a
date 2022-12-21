import React from 'react';
import {Dimensions} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DeviceInfo from 'react-native-device-info';

import CustomDrawerContent from './CustomDrawerContent';
import TabNavigator from './BottomTabNavigator';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OPI_VRIScreen from '../screens/OPI_VRIScreen';
import ReportCenterScreen from '../screens/ReportCenterScreen';
import ScheduleServiceScreen from '../screens/ScheduleServiceScreen';
import ScheduleServiceFilterScreen from '../screens/ScheduleServiceFilterScreen';
import AccountMenuScreen from '../screens/AccountMenuScreen';
import CallingScreen from '../screens/CallingScreen';
import WorkOrderScreen from '../screens/WorkOrderScreen';
import WorkOrderDetails from '../screens/WorkOrderDetails';
import WorkOrderEdit from '../screens/WorkOrderEdit';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const {height, width} = Dimensions.get('screen');

const ScheduleServiceStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="ScheduleService"
    screenOptions={{
      ...TransitionPresets.SlideFromRightIOS,
      headerShown: false,
    }}
    openByDefault>
    <Stack.Screen name="ScheduleService" component={ScheduleServiceScreen} />
    <Stack.Screen name="WorkOrder" component={WorkOrderScreen} />
    <Stack.Screen name="WorkOrderDetails" component={WorkOrderDetails} />
    <Stack.Screen name="WorkOrderEdit" component={WorkOrderEdit} />

    <Stack.Screen
      name="ScheduleServiceFilter"
      component={ScheduleServiceFilterScreen}
    />
  </Stack.Navigator>
);

const Home = () => {
  let drawerWidth = '80%';
  const isTablet = DeviceInfo.isTablet();
  if (isTablet) {
    if (height > width) {
      drawerWidth = '60%';
    } else {
      drawerWidth = '40%';
    }
  }

  return (
    <Drawer.Navigator
      initialRouteName="OPI_VRI"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{swipeEnabled: false}}
      drawerStyle={{
        width: drawerWidth,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      }}>
      <Drawer.Screen name="OPI_VRI" component={OPI_VRIScreen} />
      <Drawer.Screen name="ReportCenter" component={ReportCenterScreen} />
      <Drawer.Screen
        name="ScheduleService"
        component={ScheduleServiceStackNavigator}
      />
      <Drawer.Screen name="AccountMenu" component={AccountMenuScreen} />
    </Drawer.Navigator>
  );
};

const Navigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          // initialRouteName="ReportCenterScreen"
          // initialRouteName="Calling"
          screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
          }}>
          <Stack.Screen
            name="ReportCenterScreen"
            component={ReportCenterScreen}
          />

          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            initialParams={'hannan'}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />

          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />

          <Stack.Screen name="Calling" component={CallingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Navigator;
