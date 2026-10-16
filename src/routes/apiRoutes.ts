import { Platform } from 'react-native';

/**
 * ============================================================================
 * BACKEND BASE URL CONFIGURATION
 * ============================================================================
 * Backend developer aapko jo URL provide kare (e.g. https://api.yourdomain.com/api),
 * aap use yahan replace kar sakte hain:
 */
export const BACKEND_BASE_URL = 'http://localhost:5000/api';

// Android Emulator ke liye host mapping (10.0.2.2):
export const ANDROID_LOCAL_URL = 'http://10.0.2.2:5000/api';

// Platform ke hisab se automatic active URL:
export const BASE_URL = Platform.select({
  android: ANDROID_LOCAL_URL,
  ios: BACKEND_BASE_URL,
  default: BACKEND_BASE_URL,
});

/**
 * ============================================================================
 * BACKEND API ROUTES / ENDPOINTS
 * ============================================================================
 * Backend developer ke sath integrate karne ke liye saare routes:
 */
export const API_ROUTES = {
  // Base
  BASE_URL: BASE_URL,

  // Auth Endpoints
  AUTH: {
    // 1. Login (Email / Membership No. + Password)
    LOGIN: `${BASE_URL}/auth/login`,

    // 2. Signup / Registration
    REGISTER: `${BASE_URL}/auth/register`,

    // 3. OTP Send
    SEND_OTP: `${BASE_URL}/auth/send-otp`,

    // 4. OTP Verify
    VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,

    // 5. OTP Resend
    RESEND_OTP: `${BASE_URL}/auth/resend-otp`,

    // 6. Forgot Password Request
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,

    // 7. Reset Password with new password
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,

    // 8. User Profile
    PROFILE: `${BASE_URL}/auth/profile`,

    // 9. Logout
    LOGOUT: `${BASE_URL}/auth/logout`,
  },
} as const;

export default API_ROUTES;
