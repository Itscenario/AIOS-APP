import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Background,
  Button,
  CheckIcon,
  EmailInput,
  EyeIcon,
  IdCardIcon,
  Image,
  images,
  Input,
  LockIcon,
  MembershipOrEmailInput,
  PasswordInput,
  Typography,
  VerifiedBadgeIcon,
} from '../components';
import { validateMembershipOrEmail, validatePassword } from '../utils';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { setCredentials, useAppDispatch, useAppSelector } from '../store';
import { waitForProfileSave } from '../store/persistence';
import { rounded, shadows, spacing } from '../theme/spacing';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const savedProfile = useAppSelector(state => state.auth.profile);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = () => {
    let hasError = false;

    const identifierRes = validateMembershipOrEmail(email);
    if (!identifierRes.isValid) {
      setEmailError(identifierRes.error);
      hasError = true;
    } else {
      setEmailError(undefined);
    }

    const passRes = validatePassword(password, {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: false,
    });
    if (!passRes.isValid) {
      setPasswordError(passRes.error);
      hasError = true;
    } else {
      setPasswordError(undefined);
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);
    setTimeout(async () => {
      const identifier = email.trim();
      const isEmail = identifier.includes('@');
      const matchesSavedProfile = isEmail
        ? savedProfile?.email?.toLowerCase() === identifier.toLowerCase()
        : savedProfile?.membershipId === identifier;
      dispatch(setCredentials({
        user: {
          ...(matchesSavedProfile ? savedProfile : {}),
          ...(isEmail ? { email: identifier } : { membershipId: identifier }),
        },
      }));
      await waitForProfileSave();
      setIsLoading(false);
      navigation.replace('MainTabs');
    }, 600);
  };

  const handleCreateAccount = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <Background
      scrollable
      keyboardAvoiding
      keyboardShouldPersistTaps="always"
    >
      {/* <View style={styles.accentStrip}>
        <View style={styles.accentGold} />
        <View style={styles.accentBlue} />
      </View> */}

      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image
              source={images.logo}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.brandTextContainer}>
            <View style={styles.brandTitleRow}>
              <Typography
                variant="headlineSm"
                weight="bold"
                color="#C2410C"
                style={styles.brandTitle}
              >
                AIOS
              </Typography>
              <View style={styles.memberBadge}>
                <Typography
                  variant="labelSm"
                  weight="bold"
                  color={colors.secondaryRoyal}
                  style={styles.memberBadgeText}
                >
                  MEMBER
                </Typography>
              </View>
            </View>

            <Typography
              variant="labelSm"
              color={colors.white}
              style={styles.brandSubtitle}
            >
              All India Ophthalmological Society
            </Typography>
          </View>
        </View>

        {/* <TouchableOpacity
          style={styles.supportButton}
          onPress={handleSupport}
          activeOpacity={0.7}
        >
          <SupportIcon size={16} color={colors.secondaryRoyal} />
          <Typography
            variant="labelMd"
            weight="semibold"
            color={colors.secondaryRoyal}
            style={styles.supportText}
          >
            Support
          </Typography>
        </TouchableOpacity> */}
      </View>

      <View style={styles.card}>
        {/* <View style={styles.officialPill}>
          <VerifiedBadgeIcon size={14} color={colors.secondaryRoyal} />
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.secondaryRoyal}
            style={styles.officialPillText}
          >
            OFFICIAL AIOS PORTAL
          </Typography>
        </View> */}

        <Typography
          variant="headlineLg"
          weight="semibold"
          align="center"
          color="orange"
          style={styles.welcomeTitle}
        >
          Login to an existing account
        </Typography>

        <Typography
          variant="bodyMd"
          align="center"
          color={colors.textSecondary}
          style={styles.welcomeSubtitle}
        >
          Access your AIOS dashboard portal
        </Typography>

        <View style={styles.formContainer}>
          <MembershipOrEmailInput
            label="Membership No./Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError(undefined);
            }}
            error={emailError}
            placeholder="Enter your Membership No./Email"
            containerStyle={styles.inputSpacing}
            validateOn="blur"
            required={true}
          />

          <PasswordInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError(undefined);
            }}
            error={passwordError}
            placeholder="••••••••••••••"
            containerStyle={styles.inputSpacing}
            required={true}
            minLength={8}
            requireUppercase={true}
            requireLowercase={true}
            requireNumber={false}
          />

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.8}
            >
              <View
                style={[
                ]}
              >
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleForgotPassword}
              activeOpacity={0.7}
            >
              <Typography
                weight="semibold"
                color={colors.secondaryRoyal}
              >
                Forgot Password?
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Primary Sign In Button */}
          <Button
            title="Sign In"
            onPress={handleSignIn}
            variant="primary"
            size="lg"
            loading={isLoading}
            leftIcon={<LockIcon size={18} color={colors.onPrimary} />}
            style={styles.signInButton}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Typography
              variant="labelSm"
              weight="bold"
              color={colors.textMuted}
              style={styles.dividerText}
            >
              OR
            </Typography>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={handleCreateAccount}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Create an account"
          >
            <View pointerEvents="none">
              <Typography
                variant="labelLg"
                weight="semibold"
                color={colors.primaryNavy}
                style={styles.createAccountButtonText}
              >
                Create an account
              </Typography>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  accentStrip: {
    height: 3,
    width: '100%',
    flexDirection: 'row',
  },
  accentGold: {
    flex: 1,
    backgroundColor: colors.tertiarySaffron,
  },
  accentBlue: {
    flex: 1,
    backgroundColor: colors.secondaryBright,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutterMobile + 4,
    paddingTop: spacing.spaceMd,
    paddingBottom: spacing.spaceLg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    overflow: 'hidden',
    ...shadows.level1,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandTextContainer: {
    marginLeft: 10,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  memberBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  memberBadgeText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  supportText: {
    marginLeft: 6,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    borderBottomWidth: 0,
    paddingHorizontal: spacing.gutterMobile + 4,
    paddingTop: spacing.spaceLg + 4,
    paddingBottom: spacing.spaceXl,
    flexGrow: 1,
    flexShrink: 0,
    ...shadows.level1,
  },

  officialPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderColor: colors.secondaryFixed,
    borderWidth: 1,
    borderRadius: rounded.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  officialPillText: {
    fontSize: 11,
    marginLeft: 6,
    letterSpacing: 0.6,
  },

  // Titles
  welcomeTitle: {
    fontSize: 22,
    marginTop: 14,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    marginBottom: spacing.spaceLg,
  },

  // Form
  formContainer: {
    width: '100%',
  },
  inputSpacing: {
    marginBottom: spacing.spaceMd,
  },

  // Options (Remember Me / Forgot Password)
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: spacing.spaceLg,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.8,
    borderColor: colors.borderField,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: colors.secondaryRoyal,
    borderColor: colors.secondaryRoyal,
  },
  rememberMeText: {
    marginLeft: 8,
  },

  // Buttons
  signInButton: {
    backgroundColor: colors.primaryNavy,
    minHeight: 52,
    borderRadius: rounded.md, // 12px
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.spaceLg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderNeutral,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
  },
  createAccountButton: {
    width: '100%',
    flexShrink: 0,
    minHeight: 52,
    borderRadius: rounded.md,
    borderWidth: 1.5,
    borderColor: colors.borderField,
    backgroundColor: colors.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.spaceMd,
  },
  createAccountButtonText: {
    textAlign: 'center',
  },

  // Security Footer
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.spaceXl,
    paddingTop: spacing.spaceMd,
    borderTopWidth: 1,
    borderTopColor: colors.borderNeutral,
  },
  securityText: {
    marginLeft: 6,
    fontSize: 11,
    textAlign: 'center',
  },
});

export default LoginScreen;
