import { AnnualAccommodationBookingScreen } from '../screens/AnnualAccommodationBookingScreen';
import { AnnualAccommodationScreen } from '../screens/AnnualAccommodationScreen';
import { NewsViewsScreen } from '../screens/NewsViewsScreen';
import { NewsViewDetailScreen } from '../screens/NewsViewDetailScreen';
import { AIOSUpdatesScreen } from '../screens/AIOSUpdatesScreen';
import { AIOSUpdateDetailScreen } from '../screens/AIOSUpdateDetailScreen';
import { AdverseRegistryScreen } from '../screens/AdverseRegistryScreen';
import { GrievanceFormScreen } from '../screens/GrievanceFormScreen';
import { GrievanceScreen, GrievanceOtpScreen } from '../screens/GrievanceScreen';
import { MeetingCalendarScreen } from '../screens/MeetingCalendarScreen';
import { SpecialityScreen } from '../screens/SpecialityScreen';
import { PrivacyScreen } from '../screens/PrivacyScreen';
import { GoGreenScreen } from '../screens/GoGreenScreen';
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
          options={{ headerShown: false, gestureEnabled: false }}
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
        <Stack.Screen name="NewsViews" component={NewsViewsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NewsViewDetail" component={NewsViewDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AnnualAccommodationBooking" component={AnnualAccommodationBookingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AnnualAccommodation" component={AnnualAccommodationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AIOSUpdates" component={AIOSUpdatesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AIOSUpdateDetail" component={AIOSUpdateDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdverseRegistry" component={AdverseRegistryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GrievanceForm" component={GrievanceFormScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Grievance" component={GrievanceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GrievanceOtp" component={GrievanceOtpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MeetingCalendar" component={MeetingCalendarScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GoGreen" component={GoGreenScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Speciality" component={SpecialityScreen} options={{ headerShown: false }} />
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
