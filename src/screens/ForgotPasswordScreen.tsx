import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import {
  ArrowBackIcon,
  ArrowRightIcon,
  Background,
  Image,
  images,
  LockIcon,
  MembershipOrEmailInput,
  Typography,
} from '../components';
import { validateMembershipOrEmail } from '../utils';
import { colors } from '../theme/colors';
import { shadows } from '../theme/spacing';

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [identifier, setIdentifier] = useState<string>('');
  const [emailError, setEmailError] = useState<string | undefined>();

  const handleSendOtp = () => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      setEmailError('Membership No./Email is required.');
      return;
    }

    const val = validateMembershipOrEmail(trimmed, {
      requiredErrorMessage: 'Membership No./Email is required.',
      invalidErrorMessage: 'Invalid Membership No. or Email',
    });

    if (!val.isValid) {
      setEmailError('Invalid Membership No. or Email');
      return;
    }

    setEmailError(undefined);
    navigation.navigate('OtpVerification', {
      email: trimmed,
      from: 'forgot_password',
    });
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
              Forgot Password
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
          Forgot Password
        </Typography>

        <View style={styles.inputGroup}>
          <MembershipOrEmailInput
            label="Membership No./Email"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (emailError) setEmailError(undefined);
            }}
            error={emailError}
            placeholder="Membership No. or Email"
            style={styles.identifierInput}
            inputContainerStyle={styles.identifierInputContainer}
            required={true}
            validateOn="blur"
            requiredErrorMessage="Membership No./Email is required."
            invalidErrorMessage="Invalid Membership No. or Email"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSendOtp}
          activeOpacity={0.8}
        >
          <Typography variant="labelLg" weight="bold" color={colors.onPrimary} style={styles.buttonText}>
            Send Verification Code
          </Typography>
          <ArrowRightIcon size={16} color={colors.onPrimary} />
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
    marginBottom: 28,
  },

  inputGroup: {
    width: '100%',
    marginBottom: 26,
  },
  identifierInput: {
    minWidth: 0,
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 0,
    textAlignVertical: 'center',
  },
  identifierInputContainer: {
    minHeight: 52,
    paddingHorizontal: 10,
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
    gap: 12,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: 14.5,
    color: colors.textPrimary,
    paddingVertical: 0,
  },

  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryNavy,
    borderRadius: 8,
    width: '100%',
    height: 50,
    gap: 10,
    ...shadows.level1,
  },
  buttonText: {
    letterSpacing: 0.3,
  },
});

export default ForgotPasswordScreen;
