import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { OtpVerificationScreen } from '../screens/OtpVerificationScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { MyProfileScreen } from '../screens/MyProfileScreen';
import { BecomeMemberScreen } from '../screens/BecomeMemberScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { JobOpportunitiesScreen } from '../screens/JobOpportunitiesScreen';
import { JobApplicationScreen } from '../screens/JobApplicationScreen';
import DrawerNavigator from './DrawerNavigator';
import { RootStackParamList } from './types';
import { useAppSelector } from '../store';

export type { RootStackParamList };

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <NavigationContainer
      onReady={() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => SplashScreen.hide());
        });
      }}
    >
      <Stack.Navigator initialRouteName={isAuthenticated ? 'MainTabs' : 'Login'}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyProfile"
          component={MyProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BecomeMember"
          component={BecomeMemberScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobOpportunities"
          component={JobOpportunitiesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobApplication"
          component={JobApplicationScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
