import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DashboardScreen } from '../screens/DashboardScreen';
import { JobOpportunitiesScreen } from '../screens/JobOpportunitiesScreen';
import { AnnualConferenceScreen } from '../screens/AnnualConferenceScreen';
import { MidTermScreen } from '../screens/MidTermScreen';
import { AccountScreen } from '../screens/AccountScreen';
import {
  DashboardIcon,
  JobsTabIcon,
  CalendarIcon,
  AwardMedalIcon,
  ProfileTabIcon,
} from '../components/Icons';
import { BottomTabParamList } from './types';

export type { BottomTabParamList };

const Tab = createBottomTabNavigator<BottomTabParamList>();

const ACTIVE_COLOR = '#FF5722';
const INACTIVE_COLOR = '#6D819C';
const TAB_BAR_BG = '#0B1728';

const AnimatedTabIcon: React.FC<{
  focused: boolean;
  size: number;
  Icon: typeof DashboardIcon;
}> = ({ focused, size, Icon }) => {
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    }).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => { mounted = false; subscription.remove(); };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(focused ? 1 : 0);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: focused ? 1 : 0,
      duration: focused ? 200 : 160,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [focused, progress, reduceMotion]);

  return (
    <View style={styles.iconWrapper}>
      <Animated.View style={{ transform: [
        { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) },
      ] }}>
        <Icon size={size} color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
      </Animated.View>
    </View>
  );
};

export const BottomTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { width, fontScale } = useWindowDimensions();
  const bottomPadding = Math.max(insets.bottom, 6);
  const availableWidth = width - insets.left - insets.right;
  const labelFontSize = availableWidth < 360 ? 9 : 10;
  const tabContentHeight = 58 + Math.ceil(12 * (Math.min(fontScale, 1.3) - 1));

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        animation: 'none',
        lazy: false,
        tabBarLabelPosition: 'below-icon',
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabContentHeight + bottomPadding,
            paddingBottom: bottomPadding,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ],
        tabBarItemStyle: styles.tabBarItem,
        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={{ color: 'transparent' }}
            style={() => [
              props.style,
              { opacity: 1 },
            ]}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={[
                styles.tabBarLabel,
                { fontSize: labelFontSize, color: focused ? ACTIVE_COLOR : INACTIVE_COLOR },
              ]}
            >
              Dashboard
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} size={22} Icon={DashboardIcon} />
          ),
        }}
      />

      <Tab.Screen
        name="Jobs"
        component={JobOpportunitiesScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={[
                styles.tabBarLabel,
                { fontSize: labelFontSize, color: focused ? ACTIVE_COLOR : INACTIVE_COLOR },
              ]}
            >
              Jobs
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} size={24} Icon={JobsTabIcon} />
          ),
        }}
      />

      <Tab.Screen
        name="Certificates"
        component={AnnualConferenceScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={[
                styles.tabBarLabel,
                { fontSize: labelFontSize, color: focused ? ACTIVE_COLOR : INACTIVE_COLOR },
              ]}
            >
              Annual
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} size={24} Icon={CalendarIcon} />
          ),
        }}
      />

      <Tab.Screen
        name="MidTerm"
        component={MidTermScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={[
                styles.tabBarLabel,
                { fontSize: labelFontSize, color: focused ? ACTIVE_COLOR : INACTIVE_COLOR },
              ]}
            >
              Mid-Term
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} size={24} Icon={AwardMedalIcon} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={AccountScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={[
                styles.tabBarLabel,
                { fontSize: labelFontSize, color: focused ? ACTIVE_COLOR : INACTIVE_COLOR },
              ]}
            >
              Profile
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} size={22} Icon={ProfileTabIcon} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: TAB_BAR_BG,
    borderTopColor: '#16253B',
    borderTopWidth: 1,
    paddingTop: 6,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  tabBarItem: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 2,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
});

export default BottomTabNavigator;
