import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  Dashboard: undefined;
  Jobs: undefined;
  Certificates: undefined;
  MidTerm: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  // Home: undefined;
  AboutAIOS: undefined;
  GoverningCouncil: undefined;
  OfficeBearersSubCommittee: undefined;
  OfficeBearers: undefined;
  PastPresidents: undefined;
  AIOSThemeSong: undefined;
  PresidentAIOS: undefined;
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
  NewsViews: undefined;
  NewsViewDetail: { articleId: string };
  AnnualAccommodationBooking: {
    checkInDates?: { value: string; label: string }[];
    checkOutDates?: { value: string; label: string }[];
  } | undefined;
  AnnualAccommodation: undefined;
  AIOSUpdates: undefined;
  AIOSUpdateDetail: { updateId: string };
  AdverseRegistry: undefined;
  GrievanceForm: undefined;
  Grievance: undefined;
  GrievanceOtp: { identifier: string };
  MeetingCalendar: undefined;
  ChangePassword: undefined;
  GoGreen: undefined;
  Privacy: undefined;
  Speciality: undefined;
  JobOpportunities: undefined;
  JobApplication: { job: any } | undefined;
};
