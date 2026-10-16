/**
 * Validation utilities for AIOS Application
 * Provides standard, robust validation functions and helpers for Email, Password, and Phone Number.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PasswordValidationOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
}

export interface PasswordValidationResult extends ValidationResult {
  score: number; // 0 to 4
  strength: 'weak' | 'medium' | 'strong';
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

/**
 * Validates email address format
 */
export const validateEmail = (
  email: string,
  options?: { required?: boolean; customErrorMessage?: string }
): ValidationResult => {
  const isRequired = options?.required ?? true;
  const trimmed = email.trim();

  if (!trimmed) {
    if (isRequired) {
      return { isValid: false, error: options?.customErrorMessage || 'Email address is required.' };
    }
    return { isValid: true };
  }

  // Standard RFC 5322 compliant regex for practical email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: options?.customErrorMessage || 'Email is invalid',
    };
  }

  return { isValid: true };
};

/**
 * Validates password and calculates strength score
 */
export const validatePassword = (
  password: string,
  options?: PasswordValidationOptions
): PasswordValidationResult => {
  const minLength = options?.minLength ?? 8;
  const requireUppercase = options?.requireUppercase ?? true;
  const requireLowercase = options?.requireLowercase ?? true;
  const requireNumber = options?.requireNumber ?? false;
  const requireSpecialChar = options?.requireSpecialChar ?? false;

  const checks = {
    minLength: password.length >= minLength,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };

  let score = 0;
  if (checks.minLength) score += 1;
  if (checks.hasUppercase && checks.hasLowercase) score += 1;
  if (checks.hasNumber) score += 1;
  if (checks.hasSpecialChar) score += 1;

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 3 && password.length >= 8) {
    strength = 'strong';
  } else if (score >= 2 && password.length >= 6) {
    strength = 'medium';
  }

  // Determine error message if validation fails
  let error: string | undefined;

  if (!password || !password.trim()) {
    error = 'Password is required.';
  } else if (!checks.minLength) {
    error = `Password must be at least ${minLength} characters long.`;
  } else if (requireUppercase && !checks.hasUppercase) {
    error = 'Password must include at least one uppercase letter (A-Z).';
  } else if (requireLowercase && !checks.hasLowercase) {
    error = 'Password must include at least one lowercase letter (a-z).';
  } else if (requireNumber && !checks.hasNumber) {
    error = 'Password must include at least one number (0-9).';
  } else if (requireSpecialChar && !checks.hasSpecialChar) {
    error = 'Password must include at least one special character (!@#$%^&*).';
  }

  const isValid = !error;

  return {
    isValid,
    error,
    score,
    strength,
    checks,
  };
};

/**
 * Validates phone number (defaults to Indian 10-digit mobile numbers)
 */
export const validatePhone = (
  phone: string,
  options?: {
    required?: boolean;
    exactDigits?: number;
    allowInternational?: boolean;
    customErrorMessage?: string;
  }
): ValidationResult => {
  const isRequired = options?.required ?? true;
  const exactDigits = options?.exactDigits ?? 10;
  // Strip non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  if (!phone.trim()) {
    if (isRequired) {
      return { isValid: false, error: options?.customErrorMessage || 'Phone number is required.' };
    }
    return { isValid: true };
  }

  // Check Indian mobile standard: 10 digits starting with 6, 7, 8, or 9
  if (exactDigits === 10) {
    if (digitsOnly.length !== 10) {
      return {
        isValid: false,
        error: options?.customErrorMessage || `Phone number must be exactly 10 digits (currently ${digitsOnly.length}).`,
      };
    }

    if (!/^[6-9]\d{9}$/.test(digitsOnly)) {
      return {
        isValid: false,
        error: options?.customErrorMessage || 'Mobile number must start with 6, 7, 8, or 9.',
      };
    }

    return { isValid: true };
  }

  // Generic digits check
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return {
      isValid: false,
      error: options?.customErrorMessage || 'Please enter a valid phone number (7-15 digits).',
    };
  }

  return { isValid: true };
};

/**
 * Validates confirm password against the original password
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password.' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match.' };
  }
  return { isValid: true };
};

/**
 * Formats a 10-digit number into "XXXXX XXXXX" for readable display
 */
export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return digits;
};

/**
 * Validates Membership No. or Email address for login
 */
export const validateMembershipOrEmail = (
  value: string,
  options?: {
    required?: boolean;
    customErrorMessage?: string;
    requiredErrorMessage?: string;
    invalidErrorMessage?: string;
  }
): ValidationResult => {
  const isRequired = options?.required ?? true;
  const trimmed = value.trim();

  if (!trimmed) {
    if (isRequired) {
      return {
        isValid: false,
        error:
          options?.requiredErrorMessage ||
          options?.customErrorMessage ||
          'Membership No. or Email is required.',
      };
    }
    return { isValid: true };
  }

  // If user entered '@', validate strictly as full email
  if (trimmed.includes('@')) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return {
        isValid: false,
        error:
          options?.invalidErrorMessage ||
          options?.customErrorMessage ||
          'Invalid Membership No. or Email',
      };
    }
    return { isValid: true };
  }

  // Otherwise validate as Membership No:
  // AIOS Membership No. must contain at least one digit and be 4-25 alphanumeric/hyphen/slash characters
  const hasDigit = /\d/.test(trimmed);
  const membershipRegex = /^[a-zA-Z0-9\-\/]{4,25}$/;
  if (!hasDigit || !membershipRegex.test(trimmed)) {
    return {
      isValid: false,
      error:
        options?.invalidErrorMessage ||
        options?.customErrorMessage ||
        'Invalid Membership No. or Email',
    };
  }

  return { isValid: true };
};

