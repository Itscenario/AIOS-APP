import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  Dashboard: undefined;
  Jobs: undefined;
  Certificates: undefined;
  MidTerm: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  Portal: NavigatorScreenParams<BottomTabParamList> | undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Signup: { emailVerified?: boolean; email?: string; phoneVerified?: boolean; phone?: string } | undefined;
  OtpVerification: { email?: string; phone?: string; from?: 'signup' | 'forgot_password' } | undefined;
  Register?: undefined;
  ForgotPassword?: undefined;
  ResetPassword: { email?: string } | undefined;
  MainTabs: undefined;
  MyProfile: undefined;
  BecomeMember: undefined;
  ChangePassword: undefined;
  JobOpportunities: undefined;
  JobApplication: { job: any } | undefined;
};
