import { Platform } from 'react-native';

export const LOCAL_IOS_URL = 'http://localhost:5000/api';
export const LOCAL_ANDROID_URL = 'http://10.0.2.2:5000/api';

export const API_BASE_URL = Platform.select({
  android: LOCAL_ANDROID_URL,
  ios: LOCAL_IOS_URL,
  default: LOCAL_IOS_URL,
});

export const API_ROUTES = {
  BASE: API_BASE_URL,
  HEALTH: `${API_BASE_URL}/health`,

  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    USERS: `${API_BASE_URL}/auth/users`,
  },
} as const;

export default API_ROUTES;
