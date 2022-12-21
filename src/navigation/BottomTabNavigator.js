import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import React from 'react';
import ScheduleServiceScreen from '../screens/ScheduleServiceScreen';

import WorkOrderDetails from '../screens/WorkOrderDetails';
import WorkOrderScreen from '../screens/WorkOrderScreen';
import MyTabBar from './CustomBottomTab';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      {/* <Tab.Screen name="WorkOrder" component={WorkOrderScreen} /> */}

      {/* <Tab.Screen name="ScheduleService" component={ScheduleServiceScreen} /> */}

      <Tab.Screen name="SetRecurringScreen" component={WorkOrderDetails} />
    </Tab.Navigator>
  );
}
