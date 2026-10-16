import { API_ROUTES } from '../constants/apiRoutes';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  [key: string]: any;
}

export interface LoginParams {
  identifier: string; // Membership No. or Email
  password: string;
}

export interface RegisterParams {
  title?: string;
  firstName: string;
  surname?: string;
  gender?: string;
  dob?: string;
  phone?: string;
  houseNo?: string;
  street?: string;
  landmark?: string;
  country?: string;
  stateName?: string;
  city?: string;
  pincode?: string;
  email: string;
  password: string;
}

export interface SendOtpParams {
  email?: string;
  phone?: string;
  purpose?: 'registration' | 'forgot_password' | 'verification';
}

export interface VerifyOtpParams {
  email?: string;
  phone?: string;
  otp: string;
}

export interface ForgotPasswordParams {
  identifier: string;
}

export interface ResetPasswordParams {
  email: string;
  newPassword: string;
}

/**
 * Generic Fetch Helper with Error Handling & Timeout
 */
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(endpoint, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    const json = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: json.message || `Request failed with status ${response.status}`,
        ...json,
      };
    }

    return json;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timed out. Please check your backend connection.',
      };
    }
    return {
      success: false,
      message: error.message || 'Network error. Make sure backend server is running.',
    };
  }
}

/**
 * Authentication API Service
 * Call these functions from your screens to integrate with the backend API
 */
export const authApi = {
  /**
   * Health Check
   */
  checkHealth: () => request(API_ROUTES.HEALTH, { method: 'GET' }),

  /**
   * User Login with Email/Membership No.
   */
  login: (data: LoginParams) =>
    request(API_ROUTES.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * User Registration / Signup
   */
  register: (data: RegisterParams) =>
    request(API_ROUTES.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Send 6-Digit OTP to Email or Phone
   */
  sendOtp: (data: SendOtpParams) =>
    request(API_ROUTES.AUTH.SEND_OTP, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Verify 6-Digit OTP
   */
  verifyOtp: (data: VerifyOtpParams) =>
    request(API_ROUTES.AUTH.VERIFY_OTP, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Request Password Reset OTP
   */
  forgotPassword: (data: ForgotPasswordParams) =>
    request(API_ROUTES.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Reset Password with New Password
   */
  resetPassword: (data: ResetPasswordParams) =>
    request(API_ROUTES.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Get List of Registered Users (Dev/Testing)
   */
  getUsers: () => request(API_ROUTES.AUTH.USERS, { method: 'GET' }),
};

export default authApi;
