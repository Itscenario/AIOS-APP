import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import {
  ArrowBackIcon,
  Background,
  CheckIcon,
  EyeIcon,
  Image,
  images,
  LockIcon,
  Typography,
} from '../components';
import { colors } from '../theme/colors';
import { rounded, shadows, spacing } from '../theme/spacing';

interface RequirementItemProps {
  label: string;
  isMet: boolean;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ label, isMet }) => (
  <View style={styles.requirementRow}>
    <View
      style={[
        styles.requirementIndicator,
        isMet ? styles.requirementIndicatorMet : styles.requirementIndicatorUnmet,
      ]}
    >
      {isMet ? (
        <CheckIcon size={10} color={colors.white} />
      ) : (
        <View style={styles.requirementDot} />
      )}
    </View>
    <Typography
      variant="bodySm"
      weight={isMet ? 'semibold' : 'regular'}
      color={isMet ? colors.successText : colors.textMuted}
      style={styles.requirementLabel}
    >
      {label}
    </Typography>
  </View>
);

export const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [currentPasswordError, setCurrentPasswordError] = useState<string | undefined>();
  const [newPasswordError, setNewPasswordError] = useState<string | undefined>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>();

  const [touched, setTouched] = useState<{
    current?: boolean;
    new?: boolean;
    confirm?: boolean;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Real-time criteria for new password
  const newPasswordChecks = useMemo(() => {
    return {
      minLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecialChar: /[^A-Za-z0-9]/.test(newPassword),
    };
  }, [newPassword]);

  // Strength score
  const strengthInfo = useMemo(() => {
    if (!newPassword) return null;
    let score = 0;
    if (newPasswordChecks.minLength) score += 1;
    if (newPasswordChecks.hasUppercase && newPasswordChecks.hasLowercase) score += 1;
    if (newPasswordChecks.hasNumber) score += 1;
    if (newPasswordChecks.hasSpecialChar) score += 1;

    if (score >= 4 && newPassword.length >= 8) {
      return { score: 3, label: 'Strong', color: colors.success };
    }
    if (score >= 2 && newPassword.length >= 6) {
      return { score: 2, label: 'Medium', color: colors.warning };
    }
    return { score: 1, label: 'Weak', color: colors.error };
  }, [newPassword, newPasswordChecks]);

  // Real-time match verification
  const isConfirmMatching =
    confirmPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword === newPassword;

  // Validation function
  const validateForm = (): boolean => {
    let isValid = true;

    // Validate current password
    if (!currentPassword.trim()) {
      setCurrentPasswordError('Current password is required.');
      isValid = false;
    } else if (currentPassword.length < 6) {
      setCurrentPasswordError('Current password must be at least 6 characters.');
      isValid = false;
    } else {
      setCurrentPasswordError(undefined);
    }

    // Validate new password
    if (!newPassword.trim()) {
      setNewPasswordError('New password is required.');
      isValid = false;
    } else if (!newPasswordChecks.minLength) {
      setNewPasswordError('Password must be at least 8 characters long.');
      isValid = false;
    } else if (!newPasswordChecks.hasUppercase) {
      setNewPasswordError('Password must include at least one uppercase letter (A-Z).');
      isValid = false;
    } else if (!newPasswordChecks.hasLowercase) {
      setNewPasswordError('Password must include at least one lowercase letter (a-z).');
      isValid = false;
    } else if (!newPasswordChecks.hasNumber) {
      setNewPasswordError('Password must include at least one number (0-9).');
      isValid = false;
    } else if (!newPasswordChecks.hasSpecialChar) {
      setNewPasswordError('Password must include at least one special character (!@#$%^&*).');
      isValid = false;
    } else if (newPassword === currentPassword) {
      setNewPasswordError('New password cannot be the same as your current password.');
      isValid = false;
    } else {
      setNewPasswordError(undefined);
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your new password.');
      isValid = false;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    } else {
      setConfirmPasswordError(undefined);
    }

    return isValid;
  };

  const handleUpdatePassword = () => {
    setTouched({ current: true, new: true, confirm: true });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate server call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 900);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTouched({});
    navigation.goBack();
  };

  // Auto-redirect to account screen on successful update
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        handleCloseSuccess();
      }, 1800);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccessModal]);

  return (
    <Background
      scrollable
      keyboardAvoiding
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 8 }]}
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowBackIcon size={20} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <View style={styles.headerLogoContainer}>
            <Image
              source={images.logo}
              style={styles.headerLogoImage}
              resizeMode="contain"
            />
          </View>
          <View>
            <Typography variant="bodySm" color="rgba(255, 255, 255, 0.75)">
              AIOS Security
            </Typography>
            <Typography variant="headlineSm" weight="bold" color={colors.white}>
              Change Password
            </Typography>
          </View>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Main Card */}
      <View style={styles.cardContainer}>
        {/* Emblem & Intro */}
        <View style={styles.emblemContainer}>
          <View style={styles.emblemCircle}>
            <LockIcon size={30} color={colors.secondaryRoyal} />
          </View>
          <Typography
            variant="headlineMd"
            weight="bold"
            color={colors.primaryNavy}
            align="center"
            style={styles.cardHeading}
          >
            Update Your Password
          </Typography>

        </View>

        {/* 1. Current Password Field */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Typography variant="labelMd" weight="bold" color={colors.textPrimary}>
              Current Password
            </Typography>
            <Typography color={colors.error}> *</Typography>
          </View>

          <View
            style={[
              styles.inputContainer,
              currentPasswordError && touched.current && styles.inputErrorBorder,
            ]}
          >
            <View style={styles.inputLeftIcon}>
              <LockIcon size={18} color={colors.textMuted} />
            </View>

            <TextInput
              style={styles.textInput}
              value={currentPassword}
              onChangeText={(text) => {
                setCurrentPassword(text);
                if (currentPasswordError) setCurrentPasswordError(undefined);
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, current: true }));
                if (!currentPassword.trim()) {
                  setCurrentPasswordError('Current password is required.');
                }
              }}
              placeholder="Enter current password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showCurrentPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <EyeIcon size={20} color={colors.textMuted} visible={showCurrentPassword} />
            </TouchableOpacity>
          </View>

          {currentPasswordError && touched.current ? (
            <View style={styles.errorContainer}>
              <Typography
                variant="labelSm"
                color={colors.error}
                align="right"
                style={styles.errorText}
              >
                {currentPasswordError}
              </Typography>
            </View>
          ) : null}
        </View>

        {/* 2. New Password Field */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Typography variant="labelMd" weight="bold" color={colors.textPrimary}>
              New Password
            </Typography>
            <Typography color={colors.error}> *</Typography>
          </View>

          <View
            style={[
              styles.inputContainer,
              newPasswordError && touched.new && styles.inputErrorBorder,
            ]}
          >
            <View style={styles.inputLeftIcon}>
              <LockIcon size={18} color={colors.textMuted} />
            </View>

            <TextInput
              style={styles.textInput}
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (newPasswordError) setNewPasswordError(undefined);
                if (confirmPassword && text !== confirmPassword) {
                  setConfirmPasswordError('Passwords do not match.');
                } else if (confirmPassword && text === confirmPassword) {
                  setConfirmPasswordError(undefined);
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, new: true }));
                if (!newPassword.trim()) {
                  setNewPasswordError('New password is required.');
                }
              }}
              placeholder="Enter new password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowNewPassword(!showNewPassword)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <EyeIcon size={20} color={colors.textMuted} visible={showNewPassword} />
            </TouchableOpacity>
          </View>

          {newPasswordError && touched.new ? (
            <View style={styles.errorContainer}>
              <Typography
                variant="labelSm"
                color={colors.error}
                align="right"
                style={styles.errorText}
              >
                {newPasswordError}
              </Typography>
            </View>
          ) : null}
          <View style={styles.requirementsBox}>
            <Typography
              variant="labelSm"
              weight="bold"
              color={colors.textSecondary}
              style={styles.requirementsHeading}
            >
              Password Requirements:
            </Typography>

            <RequirementItem
              label="Minimum 8 characters"
              isMet={newPasswordChecks.minLength}
            />
            <RequirementItem
              label="At least 1 uppercase letter (A-Z)"
              isMet={newPasswordChecks.hasUppercase}
            />
            <RequirementItem
              label="At least 1 lowercase letter (a-z)"
              isMet={newPasswordChecks.hasLowercase}
            />
            <RequirementItem
              label="At least 1 number (0-9)"
              isMet={newPasswordChecks.hasNumber}
            />
            <RequirementItem
              label="At least 1 special character (!@#$%^&*)"
              isMet={newPasswordChecks.hasSpecialChar}
            />
          </View>
        </View>

        {/* 3. Confirm New Password Field */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Typography variant="labelMd" weight="bold" color={colors.textPrimary}>
              Confirm New Password
            </Typography>
            <Typography color={colors.error}> *</Typography>
          </View>

          <View
            style={[
              styles.inputContainer,
              confirmPasswordError && touched.confirm && styles.inputErrorBorder,
              isConfirmMatching && styles.inputSuccessBorder,
            ]}
          >
            <View style={styles.inputLeftIcon}>
              <LockIcon size={18} color={colors.textMuted} />
            </View>

            <TextInput
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (newPassword && text === newPassword) {
                  setConfirmPasswordError(undefined);
                } else if (newPassword && text !== newPassword) {
                  if (touched.confirm) {
                    setConfirmPasswordError('Passwords do not match.');
                  }
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, confirm: true }));
                if (!confirmPassword.trim()) {
                  setConfirmPasswordError('Please confirm your new password.');
                } else if (confirmPassword !== newPassword) {
                  setConfirmPasswordError('Passwords do not match.');
                } else {
                  setConfirmPasswordError(undefined);
                }
              }}
              placeholder="Re-enter new password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <EyeIcon size={20} color={colors.textMuted} visible={showConfirmPassword} />
            </TouchableOpacity>
          </View>

          {confirmPasswordError && touched.confirm ? (
            <View style={styles.errorContainer}>
              <Typography
                variant="labelSm"
                color={colors.error}
                align="right"
                style={styles.errorText}
              >
                {confirmPasswordError}
              </Typography>
            </View>
          ) : isConfirmMatching ? (
            <View style={styles.matchSuccessRow}>
              <CheckIcon size={12} color={colors.success} />
              <Typography
                variant="labelSm"
                weight="semibold"
                color={colors.successText}
                align="right"
                style={styles.matchSuccessText}
              >
                Passwords match
              </Typography>
            </View>
          ) : null}
        </View>
        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleUpdatePassword}
          activeOpacity={0.85}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <View style={styles.buttonInner}>
              <LockIcon size={18} color={colors.white} />
              <Typography
                variant="labelLg"
                weight="bold"
                color={colors.white}
                style={styles.buttonLabel}
              >
                Update Password
              </Typography>
            </View>
          )}
        </TouchableOpacity>


      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseSuccess}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <CheckIcon size={32} color={colors.white} />
            </View>

            <Typography
              variant="headlineSm"
              weight="bold"
              color={colors.primaryNavy}
              align="center"
              style={styles.modalTitle}
            >
              Update Password Successful!
            </Typography>

            <Typography
              variant="bodyMd"
              color={colors.textSecondary}
              align="center"
              style={styles.modalMessage}
            >
              Your account password has been updated successfully.
            </Typography>

            {/* <View style={styles.redirectBadge}>
              <ActivityIndicator size="small" color={colors.success} style={{ marginRight: 8 }} />
              <Typography variant="labelSm" weight="semibold" color={colors.successText}>
                Redirecting to Account...
              </Typography>
            </View> */}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseSuccess}
              activeOpacity={0.85}
            >
              <Typography variant="labelLg" weight="bold" color={colors.white}>
                Back to Account
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Background >
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.spaceXl,
  },
  topHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerLogoContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  headerLogoImage: {
    width: '100%',
    height: '100%',
  },
  headerRightSpacer: {
    width: 38,
  },

  cardContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 24,
    ...shadows.level2,
  },

  emblemContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emblemCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  cardHeading: {
    marginBottom: 6,
  },
  cardSubheading: {
    paddingHorizontal: 10,
    lineHeight: 20,
  },

  fieldGroup: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: colors.borderField,
    paddingHorizontal: 12,
    height: 50,
  },
  inputErrorBorder: {
    borderColor: colors.error,
    backgroundColor: '#FEF2F2',
  },
  inputSuccessBorder: {
    borderColor: colors.success,
    backgroundColor: '#F0FDF4',
  },
  inputLeftIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Outfit-Regular',
    fontSize: 15,
    color: colors.textPrimary,
    height: '100%',
  },
  eyeButton: {
    padding: 6,
  },
  errorContainer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 4,
    paddingRight: 2,
  },
  errorText: {
    textAlign: 'right',
    alignSelf: 'flex-end',
  },

  // Strength Meter
  strengthMeterContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 6,
    height: 4,
    marginBottom: 4,
  },
  strengthBarSegment: {
    flex: 1,
    borderRadius: 2,
  },
  strengthBarInactive: {
    backgroundColor: '#E2E8F0',
  },
  strengthLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    paddingRight: 2,
  },

  // Requirements checklist
  requirementsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  requirementsHeading: {
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  requirementIndicatorMet: {
    backgroundColor: colors.success,
  },
  requirementIndicatorUnmet: {
    backgroundColor: '#E2E8F0',
  },
  requirementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  requirementLabel: {
    fontSize: 13,
  },

  matchSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: 4,
    paddingRight: 2,
    gap: 6,
  },
  matchSuccessText: {
    fontSize: 12,
    textAlign: 'right',
  },

  submitButton: {
    backgroundColor: colors.primaryNavy,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.level1,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    ...shadows.level2,
  },
  modalIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.level2,
  },
  modalTitle: {
    marginBottom: 8,
  },
  modalMessage: {
    lineHeight: 22,
    marginBottom: 16,
  },
  redirectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  modalButton: {
    width: '100%',
    backgroundColor: colors.primaryNavy,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
