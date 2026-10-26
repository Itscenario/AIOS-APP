import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { rounded, spacing } from '../theme/spacing';
import {
  CheckIcon,
  EyeIcon,
  IdCardIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
} from './Icons';
import { Typography } from './Typography';
import {
  formatPhoneNumber,
  PasswordValidationOptions,
  validateEmail,
  validateMembershipOrEmail,
  validatePassword,
  validatePhone,
} from '../utils/validation';
import {
  CountryCodePicker,
  CountryItem,
  DEFAULT_COUNTRY,
} from './CountryCodePicker';

// ============================================================================
// Base Validated Input Interface
// ============================================================================
export interface BaseValidationInputProps
  extends Omit<TextInputProps, 'onChangeText'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string; // External override error
  required?: boolean;
  showSuccessIndicator?: boolean;
  validateOn?: 'blur' | 'change' | 'both'; // Default: 'both' (live after first blur)
  onValidationChange?: (isValid: boolean, error?: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Success Check Badge
const SuccessBadge: React.FC = () => (
  <View style={styles.successBadge}>
    <CheckIcon size={10} color={colors.white} />
  </View>
);

// ============================================================================
// 1. Email Validation Input
// ============================================================================
export interface EmailInputProps extends BaseValidationInputProps {
  customErrorMessage?: string;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  label = 'Email Address',
  value,
  onChangeText,
  error: externalError,
  required = true,
  showSuccessIndicator = true,
  validateOn = 'both',
  onValidationChange,
  containerStyle,
  inputContainerStyle,
  labelStyle,
  leftIcon = <MailIcon size={18} color={colors.textMuted} />,
  rightIcon,
  placeholder = 'doctor@aios.org',
  placeholderTextColor = colors.textMuted,
  onBlur,
  onFocus,
  style,
  customErrorMessage,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const validation = useMemo(() => {
    return validateEmail(value, { required, customErrorMessage });
  }, [value, required, customErrorMessage]);

  useEffect(() => {
    onValidationChange?.(validation.isValid, validation.error);
  }, [validation.isValid, validation.error, onValidationChange]);

  useEffect(() => {
    if (externalError) {
      setIsTouched(true);
    }
  }, [externalError]);

  const shouldShowError =
    Boolean(externalError) ||
    (isTouched &&
      !validation.isValid &&
      (validateOn === 'change' || validateOn === 'both'));

  const activeError =
    externalError || (shouldShowError ? validation.error : undefined);
  const isSuccess =
    showSuccessIndicator &&
    value.trim().length > 0 &&
    validation.isValid &&
    !externalError;

  const handleBlur = (e: any) => {
    setIsFocused(false);
    setIsTouched(true);
    onBlur?.(e);
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Typography
          variant="labelMd"
          weight="semibold"
          color={colors.textPrimary}
          style={[styles.label, labelStyle]}
        >
          {label}
          {required ? <Typography color={colors.error}> *</Typography> : null}
        </Typography>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          inputContainerStyle,
        ]}
      >
        {leftIcon ? (
          <View style={styles.leftIconContainer}>{leftIcon}</View>
        ) : null}

        <TextInput
          style={[styles.input, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />

        {rightIcon ? (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        ) : isSuccess ? (
          <View style={styles.rightIconContainer}>
            <SuccessBadge />
          </View>
        ) : null}
      </View>

      {activeError ? (
        <View style={styles.errorContainer}>
          <Typography
            variant="labelSm"
            color={colors.error}
            align="right"
            style={styles.errorText}
          >
            {activeError}
          </Typography>
        </View>
      ) : null}
    </View>
  );
};

export interface MembershipOrEmailInputProps extends BaseValidationInputProps {
  customErrorMessage?: string;
  requiredErrorMessage?: string;
  invalidErrorMessage?: string;
}

export const MembershipOrEmailInput: React.FC<MembershipOrEmailInputProps> = ({
  label = 'Membership No./Email',
  value,
  onChangeText,
  error: externalError,
  required = true,
  showSuccessIndicator = true,
  validateOn = 'both',
  onValidationChange,
  containerStyle,
  inputContainerStyle,
  labelStyle,
  leftIcon,
  rightIcon,
  placeholder = 'Enter your Membership No./Email',
  placeholderTextColor = colors.textMuted,
  onBlur,
  onFocus,
  style,
  customErrorMessage,
  requiredErrorMessage,
  invalidErrorMessage,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const validation = useMemo(() => {
    return validateMembershipOrEmail(value, {
      required,
      customErrorMessage,
      requiredErrorMessage,
      invalidErrorMessage,
    });
  }, [
    value,
    required,
    customErrorMessage,
    requiredErrorMessage,
    invalidErrorMessage,
  ]);

  useEffect(() => {
    onValidationChange?.(validation.isValid, validation.error);
  }, [validation.isValid, validation.error, onValidationChange]);

  useEffect(() => {
    if (externalError) {
      setIsTouched(true);
    }
  }, [externalError]);

  const shouldShowError =
    Boolean(externalError) ||
    (isTouched &&
      !validation.isValid &&
      (validateOn === 'change' || validateOn === 'both'));

  const activeError =
    externalError || (shouldShowError ? validation.error : undefined);
  const isSuccess =
    showSuccessIndicator &&
    value.trim().length > 0 &&
    validation.isValid &&
    !externalError;

  const handleBlur = (e: any) => {
    setIsFocused(false);
    setIsTouched(true);
    onBlur?.(e);
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const isEmail = value.includes('@');
  const resolvedLeftIcon =
    leftIcon ??
    (isEmail ? (
      <MailIcon size={18} color={colors.textMuted} />
    ) : (
      <IdCardIcon size={18} color={colors.textMuted} />
    ));

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Typography
          variant="labelMd"
          weight="semibold"
          color={colors.textPrimary}
          style={[styles.label, labelStyle]}
        >
          {label}
          {required ? <Typography color={colors.error}> *</Typography> : null}
        </Typography>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          inputContainerStyle,
        ]}
      >
        {resolvedLeftIcon ? (
          <View style={styles.leftIconContainer}>{resolvedLeftIcon}</View>
        ) : null}

        <TextInput
          style={[styles.input, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          keyboardType={isEmail ? 'email-address' : 'default'}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />

        {rightIcon ? (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        ) : isSuccess ? (
          <View style={styles.rightIconContainer}>
            <SuccessBadge />
          </View>
        ) : null}
      </View>

      {activeError ? (
        <View style={styles.errorContainer}>
          <Typography
            variant="labelSm"
            color={colors.error}
            align="right"
            style={styles.errorText}
          >
            {activeError}
          </Typography>
        </View>
      ) : null}
    </View>
  );
};

export interface PasswordInputProps
  extends BaseValidationInputProps,
    PasswordValidationOptions {
  showStrengthMeter?: boolean;
  showRequirements?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label = 'Password',
  value,
  onChangeText,
  error: externalError,
  required = true,
  showSuccessIndicator = true,
  validateOn = 'both',
  onValidationChange,
  containerStyle,
  inputContainerStyle,
  labelStyle,
  leftIcon = <LockIcon size={18} color={colors.textMuted} />,
  placeholder = '••••••••••••',
  placeholderTextColor = colors.textMuted,
  minLength = 8,
  requireUppercase = true,
  requireLowercase = true,
  requireNumber = false,
  requireSpecialChar = false,
  showStrengthMeter = false,
  showRequirements = false,
  onBlur,
  onFocus,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const validation = useMemo(() => {
    return validatePassword(value, {
      minLength,
      requireUppercase,
      requireLowercase,
      requireNumber,
      requireSpecialChar,
    });
  }, [
    value,
    minLength,
    requireUppercase,
    requireLowercase,
    requireNumber,
    requireSpecialChar,
  ]);

  useEffect(() => {
    onValidationChange?.(validation.isValid, validation.error);
  }, [validation.isValid, validation.error, onValidationChange]);

  useEffect(() => {
    if (externalError) {
      setIsTouched(true);
    }
  }, [externalError]);

  const shouldShowError =
    Boolean(externalError) ||
    (isTouched &&
      !validation.isValid &&
      (validateOn === 'change' || validateOn === 'both'));

  const activeError =
    externalError || (shouldShowError ? validation.error : undefined);
  const isSuccess =
    showSuccessIndicator &&
    value.length > 0 &&
    validation.isValid &&
    !externalError;

  const handleBlur = (e: any) => {
    setIsFocused(false);
    setIsTouched(true);
    onBlur?.(e);
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // Strength Bar Colors & Label
  const strengthInfo = useMemo(() => {
    if (!value) return null;
    switch (validation.strength) {
      case 'strong':
        return { color: colors.success, label: 'Strong', activeBars: 3 };
      case 'medium':
        return { color: colors.warning, label: 'Medium', activeBars: 2 };
      default:
        return { color: colors.error, label: 'Weak', activeBars: 1 };
    }
  }, [value, validation.strength]);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Typography
          variant="labelMd"
          weight="semibold"
          color={colors.textPrimary}
          style={[styles.label, labelStyle]}
        >
          {label}
          {required ? <Typography color={colors.error}> *</Typography> : null}
        </Typography>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          inputContainerStyle,
        ]}
      >
        {leftIcon ? (
          <View style={styles.leftIconContainer}>{leftIcon}</View>
        ) : null}

        <TextInput
          style={[styles.input, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.rightIconContainer}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <EyeIcon size={20} color={colors.textMuted} visible={showPassword} />
        </TouchableOpacity>
      </View>

      {/* Optional Password Strength Meter */}
      {showStrengthMeter && value.length > 0 && strengthInfo ? (
        <View style={styles.strengthContainer}>
          <View style={styles.strengthBarsRow}>
            {[1, 2, 3].map(barIndex => (
              <View
                key={barIndex}
                style={[
                  styles.strengthBar,
                  barIndex <= strengthInfo.activeBars
                    ? { backgroundColor: strengthInfo.color }
                    : styles.strengthBarInactive,
                ]}
              />
            ))}
          </View>
          {/* <Typography
            variant="labelSm"
            weight="medium"
            style={{ color: strengthInfo.color, marginTop: 4 }}
          >
            Password Strength: {strengthInfo.label}
          </Typography> */}
        </View>
      ) : null}

      {/* Optional Requirements Checklist */}
      {showRequirements && value.length > 0 ? (
        <View style={styles.requirementsContainer}>
          <RequirementItem
            text={`At least ${minLength} characters`}
            satisfied={validation.checks.minLength}
          />
          {requireUppercase ? (
            <RequirementItem
              text="Contains uppercase letter (A-Z)"
              satisfied={validation.checks.hasUppercase}
            />
          ) : null}
          {requireLowercase ? (
            <RequirementItem
              text="Contains lowercase letter (a-z)"
              satisfied={validation.checks.hasLowercase}
            />
          ) : null}
          {requireNumber ? (
            <RequirementItem
              text="Contains at least one number (0-9)"
              satisfied={validation.checks.hasNumber}
            />
          ) : null}
          {requireSpecialChar ? (
            <RequirementItem
              text="Contains special character (!@#$%^&*)"
              satisfied={validation.checks.hasSpecialChar}
            />
          ) : null}
        </View>
      ) : null}

      {activeError ? (
        <View style={styles.errorContainer}>
          <Typography
            variant="labelSm"
            color={colors.error}
            align="right"
            style={styles.errorText}
          >
            {activeError}
          </Typography>
        </View>
      ) : null}
    </View>
  );
};

const RequirementItem: React.FC<{ text: string; satisfied: boolean }> = ({
  text,
  satisfied,
}) => (
  <View style={styles.requirementItem}>
    <View
      style={[
        styles.requirementDot,
        { backgroundColor: satisfied ? colors.success : colors.borderField },
      ]}
    />
    <Typography
      variant="labelSm"
      color={satisfied ? colors.successText : colors.textMuted}
    >
      {text}
    </Typography>
  </View>
);

// ============================================================================
// 3. Phone Validation Input
// ============================================================================
export interface PhoneInputProps extends BaseValidationInputProps {
  countryCode?: string; // Optional legacy code
  defaultCountryCode?: string; // Default: 'IN'
  selectedCountry?: CountryItem;
  onCountryChange?: (country: CountryItem) => void;
  exactDigits?: number; // Default: 10
  formatInput?: boolean; // Default: true (formats as XXXXX XXXXX)
  customErrorMessage?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  rightIcon,
  label = 'Phone Number',
  value,
  onChangeText,
  error: externalError,
  required = true,
  showSuccessIndicator = true,
  validateOn = 'both',
  onValidationChange,
  containerStyle,
  inputContainerStyle,
  labelStyle,
  countryCode,
  defaultCountryCode = 'IN',
  selectedCountry,
  onCountryChange,
  exactDigits = 10,
  formatInput = true,
  placeholder = '98765 43210',
  placeholderTextColor = colors.textMuted,
  onBlur,
  onFocus,
  style,
  customErrorMessage,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const [activeCountry, setActiveCountry] = useState<CountryItem>(() => {
    if (selectedCountry) return selectedCountry;
    return DEFAULT_COUNTRY;
  });

  const currentCountry = selectedCountry || activeCountry;
  const isIndia =
    currentCountry.isoCode.toUpperCase() === 'IN' ||
    currentCountry.phonecode === '91';
  const effectiveExactDigits = isIndia ? exactDigits : undefined;

  const cleanDigits = value.replace(/\D/g, '');

  const validation = useMemo(() => {
    return validatePhone(cleanDigits, {
      required,
      exactDigits: effectiveExactDigits,
      allowInternational: !isIndia,
      customErrorMessage,
    });
  }, [
    cleanDigits,
    required,
    effectiveExactDigits,
    isIndia,
    customErrorMessage,
  ]);

  useEffect(() => {
    onValidationChange?.(validation.isValid, validation.error);
  }, [validation.isValid, validation.error, onValidationChange]);

  const handleChangeText = (text: string) => {
    const maxLen = effectiveExactDigits || 15;
    const rawDigits = text.replace(/\D/g, '').slice(0, maxLen);
    if (formatInput && isIndia) {
      onChangeText(formatPhoneNumber(rawDigits));
    } else {
      onChangeText(rawDigits);
    }
  };

  const handleCountrySelect = (country: CountryItem) => {
    setActiveCountry(country);
    onCountryChange?.(country);
  };

  useEffect(() => {
    if (externalError) {
      setIsTouched(true);
    }
  }, [externalError]);

  const shouldShowError =
    Boolean(externalError) ||
    (isTouched &&
      !validation.isValid &&
      (validateOn === 'change' || validateOn === 'both'));

  const activeError =
    externalError || (shouldShowError ? validation.error : undefined);
  const isSuccess =
    showSuccessIndicator &&
    cleanDigits.length > 0 &&
    validation.isValid &&
    !externalError;

  const handleBlur = (e: any) => {
    setIsFocused(false);
    setIsTouched(true);
    onBlur?.(e);
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Typography
          variant="labelMd"
          weight="semibold"
          color={colors.textPrimary}
          style={[styles.label, labelStyle]}
        >
          {label}
          {required ? <Typography color={colors.error}> *</Typography> : null}
        </Typography>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          inputContainerStyle,
        ]}
      >
        {/* Country Code Picker Trigger with default India (+91) */}
        <CountryCodePicker
          defaultCountryCode={defaultCountryCode}
          selectedCountry={currentCountry}
          onSelectCountry={handleCountrySelect}
        />
        <View style={styles.prefixDivider} />

        <TextInput
          style={[styles.input, style]}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          keyboardType="phone-pad"
          maxLength={formatInput ? exactDigits + 1 : exactDigits}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />

        {rightIcon ? (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        ) : isSuccess ? (
          <View style={styles.rightIconContainer}>
            <SuccessBadge />
          </View>
        ) : null}
      </View>

      {activeError ? (
        <View style={styles.errorContainer}>
          <Typography
            variant="labelSm"
            color={colors.error}
            align="right"
            style={styles.errorText}
          >
            {activeError}
          </Typography>
        </View>
      ) : null}
    </View>
  );
};

// ============================================================================
// 4. Unified ValidatedInput Component (Polymorphic wrapper)
// ============================================================================
export type ValidatedInputType = 'email' | 'password' | 'phone';

export interface ValidatedInputProps extends BaseValidationInputProps {
  type: ValidatedInputType;
  showStrengthMeter?: boolean;
  showRequirements?: boolean;
  countryCode?: string;
  exactDigits?: number;
  formatInput?: boolean;
  minLength?: number;
  customErrorMessage?: string;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  type,
  ...props
}) => {
  switch (type) {
    case 'email':
      return <EmailInput {...props} />;
    case 'password':
      return <PasswordInput {...props} />;
    case 'phone':
      return <PhoneInput {...props} />;
    default:
      return null;
  }
};

// ============================================================================
// Styles
// ============================================================================
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    marginBottom: spacing.spaceSm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.spaceMd,
    minHeight: 52,
  },
  focusedInput: {},
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 12,
  },
  leftIconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconContainer: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  countryCodeText: {
    marginLeft: 6,
  },
  prefixDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: 10,
  },
  successBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: spacing.spaceXs,
    paddingRight: 2,
  },
  errorText: {
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  strengthContainer: {
    marginTop: 6,
  },
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthBarInactive: {
    backgroundColor: colors.border,
  },
  requirementsContainer: {
    marginTop: 8,
    gap: 4,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
});
