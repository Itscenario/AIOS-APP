import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/DashboardScreen';
import { JobOpportunitiesScreen } from '../screens/JobOpportunitiesScreen';
import { AnnualConferenceScreen } from '../screens/AnnualConferenceScreen';
import { MidTermScreen } from '../screens/MidTermScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { CurvedBottomTabBar } from '../components/CurvedBottomTabBar';
import type { BottomTabParamList } from './types';

export type { BottomTabParamList };
const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => (
  <Tab.Navigator
    initialRouteName="Dashboard"
    detachInactiveScreens={false}
    tabBar={props => <CurvedBottomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
      animation: 'none',
      lazy: false,
    }}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Jobs" component={JobOpportunitiesScreen} />
    <Tab.Screen name="Certificates" component={AnnualConferenceScreen} />
    <Tab.Screen name="MidTerm" component={MidTermScreen} />
    <Tab.Screen name="Profile" component={AccountScreen} />
  </Tab.Navigator>
);

export default BottomTabNavigator;
