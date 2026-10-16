import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import {
  ArrowBackIcon,
  Background,
  CheckIcon,
  Image,
  images,
  LockIcon,
  PasswordInput,
  Typography,
} from '../components';
import { validateConfirmPassword, validatePassword } from '../utils';
import { colors } from '../theme/colors';
import { shadows } from '../theme/spacing';

export const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ResetPassword'>>();
  const email = route.params?.email || '';

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [newPasswordError, setNewPasswordError] = useState<string | undefined>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>();

  const handleResetPassword = () => {
    let hasError = false;

    if (!newPassword.trim()) {
      setNewPasswordError('New Password is required.');
      hasError = true;
    } else {
      const passVal = validatePassword(newPassword, { minLength: 8 });
      if (!passVal.isValid) {
        setNewPasswordError(passVal.error || 'Password must be at least 8 characters long.');
        hasError = true;
      } else {
        setNewPasswordError(undefined);
      }
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirm Password is required.');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      hasError = true;
    } else {
      setConfirmPasswordError(undefined);
    }

    if (hasError) {
      return;
    }

    navigation.navigate('Login');
  };

  return (
    <Background
      scrollable
      keyboardAvoiding
    >
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
            <Typography variant="headlineSm" weight="bold" color={colors.white}>
              Reset Password
            </Typography>
          </View>
        </View>

        <View style={styles.headerRightActions} />
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.emblemContainer}>
          <View style={styles.emblemCircle}>
            <LockIcon size={32} color={colors.secondaryBright} />
          </View>
        </View>

        <Typography
          variant="headlineLg"
          weight="bold"
          align="center"
          color={colors.primaryNavy}
          style={styles.title}
        >
          Reset Password
        </Typography>

        {/* <Typography
          variant="bodyMd"
          align="center"
          color={colors.textMuted}
          style={styles.subtitle}
        >
          {email ? `Create a new password for ${email}` : 'Create a new secure password for your AIOS account.'}
        </Typography> */}

        <View style={styles.inputGroup}>
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              if (newPasswordError) setNewPasswordError(undefined);
            }}
            error={newPasswordError}
            showStrengthMeter={true}
            showRequirements={true}
            minLength={8}
            placeholder="Enter new password"
            validateOn="blur"
          />
        </View>

        <View style={styles.inputGroup}>
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) setConfirmPasswordError(undefined);
            }}
            error={confirmPasswordError}
            placeholder="Confirm new password"
            required={true}
            validateOn="blur"
            minLength={1}
            requireUppercase={false}
            requireLowercase={false}
            requireNumber={false}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleResetPassword}
          activeOpacity={0.8}
        >
          <Typography variant="labelLg" weight="bold" color={colors.onPrimary} style={styles.buttonText}>
            Update Password
          </Typography>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerLogoContainer: {
    width: 38,
    height: 38,
    borderRadius: 9,
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
  headerRightActions: {
    width: 36,
  },

  cardContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    marginHorizontal: 16,
    marginTop: 40,
    marginBottom: 24,
    paddingHorizontal: 22,
    paddingVertical: 34,
    alignItems: 'center',
    ...shadows.level1,
  },
  emblemContainer: {
    marginBottom: 16,
  },
  emblemCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
  },
  title: {
    fontSize: 23,
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  inputGroup: {
    width: '100%',
    marginBottom: 18,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 13.5,
  },
  inputBox: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.borderField,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: 13.5,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryNavy,
    borderRadius: 8,
    width: '100%',
    height: 50,
    gap: 8,
    marginTop: 8,
    ...shadows.level1,
  },
  buttonText: {
    letterSpacing: 0.3,
  },

  loginLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 4,
  },
});

export default ResetPasswordScreen;
