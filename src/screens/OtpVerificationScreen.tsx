import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import {
  ArrowBackIcon,
  ArrowRightIcon,
  Background,
  Image,
  images,
  PinCodeInput,
  ShieldCheckIcon,
  Typography,
} from '../components';
import { colors } from '../theme/colors';
import { rounded, shadows } from '../theme/spacing';

export const OtpVerificationScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'OtpVerification'>>();
  const email =
    route.params?.email || route.params?.phone || 'doctor@hospital.org';

  const [otp, setOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string | undefined>();
  const [timer, setTimer] = useState<number>(26);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      setOtp('');
      setOtpError(undefined);
    }
  };

  const handleVerify = () => {
    const trimmed = otp.trim();
    if (!trimmed) {
      setOtpError('OTP is required.');
      return;
    }
    if (trimmed.length < 6) {
      setOtpError('Please enter complete 6-digit OTP.');
      return;
    }

    setOtpError(undefined);
    if (route.params?.from === 'forgot_password') {
      navigation.navigate('ResetPassword', { email });
    } else if (route.params?.phone) {
      navigation.popTo(
        'Signup',
        { phoneVerified: true, phone: route.params.phone },
        { merge: true },
      );
    } else {
      navigation.popTo(
        'Signup',
        { emailVerified: true, email },
        { merge: true },
      );
    }
  };

  const maskedContact = email.includes('@')
    ? `${email.slice(0, 3)}••••@${email.split('@')[1]}`
    : `${email} (Registered Mobile/Email)`;

  return (
    <Background scrollable keyboardAvoiding>
      <AppHeader style={styles.topHeader}>
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
              OTP Verification
            </Typography>
          </View>
        </View>

        <View style={styles.headerRightActions} />
      </AppHeader>

      <View style={styles.cardContainer}>
        <View style={styles.shieldEmblemContainer}>
          <View style={styles.shieldEmblemCircle}>
            <ShieldCheckIcon size={32} color={colors.secondaryBright} />
          </View>
        </View>
        <Typography
          variant="headlineLg"
          weight="bold"
          align="center"
          color={colors.primaryNavy}
          style={styles.verifyTitle}
        >
          Verify OTP
        </Typography>

        <Typography
          variant="bodyMd"
          align="center"
          color={colors.textMuted}
          style={styles.verifySubtitle}
        >
          Enter the 6-digit code sent to
        </Typography>
        <Typography
          variant="bodyMd"
          weight="bold"
          align="center"
          color={colors.textPrimary}
          style={styles.recipientText}
        >
          {maskedContact}
        </Typography>

        <View style={styles.pinWrapper}>
          <PinCodeInput
            length={6}
            value={otp}
            onChangePin={val => {
              setOtp(val);
              if (otpError) setOtpError(undefined);
            }}
            error={otpError}
          />
        </View>

        <View style={styles.resendRow}>
          <Typography variant="bodySm" color={colors.textMuted}>
            Didn't receive code?
          </Typography>
          <TouchableOpacity
            onPress={handleResend}
            disabled={timer > 0}
            activeOpacity={0.7}
          >
            <Typography
              variant="bodySm"
              weight="bold"
              color={timer > 0 ? colors.textMuted : colors.secondaryBright}
            >
              {timer > 0
                ? `Resend in (${timer < 10 ? '0' : ''}${timer}s)`
                : 'Resend OTP'}
            </Typography>
          </TouchableOpacity>
        </View>

        <Button

          customLayout
          style={styles.verifyButton}
          onPress={handleVerify}
          activeOpacity={0.8}
        >
          <Typography variant="labelLg" weight="bold" color="#FFFFFF">
            Verify & Proceed
          </Typography>
          <ArrowRightIcon size={16} color={colors.onPrimary} />
        </Button>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
  },
  profileCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
  },

  cardContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    marginHorizontal: 16,
    marginTop: 48,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: 'center',
    ...shadows.level1,
  },
  shieldEmblemContainer: {
    marginBottom: 14,
  },
  shieldEmblemCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  securityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 16,
    gap: 6,
  },
  securityPillText: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  verifyTitle: {
    fontSize: 22,
    marginBottom: 6,
  },
  verifySubtitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  recipientText: {
    fontSize: 14,
    marginBottom: 24,
  },
  pinWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 6,
    marginBottom: 24,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryNavy,
    borderRadius: rounded.default,
    width: '100%',
    height: 48,
    gap: 8,
    ...shadows.level1,
  },
  footerNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  footerNoteText: {
    fontSize: 11,
  },
});

export default OtpVerificationScreen;
