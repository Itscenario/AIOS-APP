import { formatProfileName } from '../utils/profileName';
import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store';
import { colors } from '../theme/colors';
import { rounded, shadows, spacing } from '../theme/spacing';
import {
  ArrowBackIcon,
  Background,
  CalendarIcon,
  CheckIcon,
  PersonIcon,
  Typography,
  VerifiedBadgeIcon,
} from '../components';

export const MyProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const savedProfile = useAppSelector((state) => state.auth.profile);
  const profile = savedProfile?.membershipId?.match(/^LM-\d+$/)
    ? { ...savedProfile, membershipId: undefined }
    : savedProfile;

  const fullName = formatProfileName(profile?.name || [profile?.title, profile?.firstName, profile?.surname].filter(Boolean).join(' '));


  return (
    <Background
      scrollable
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 8 }]}
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
          <Typography variant="headlineSm" weight="bold" color={colors.white}>
            My Profile
          </Typography>
        </View>
        {profile?.membershipId ? (
          <View style={styles.verifiedBadgeTop}>
            <VerifiedBadgeIcon size={14} color={colors.tertiarySaffron} />
            <Typography variant="labelSm" weight="bold" color={colors.tertiarySaffron}>
              {profile.membershipId}
            </Typography>
          </View>
        ) : null}
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            {profile?.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <PersonIcon size={46} color={colors.secondaryRoyal} />
              </View>
            )}
          </View>
          {fullName ? (
            <Typography
              variant="headlineSm"
              weight="bold"
              color={colors.primaryNavy}
              style={styles.doctorName}
            >
              {fullName}
            </Typography>
          ) : null}
          <Typography variant="bodySm" color={colors.tertiarySaffron} weight="semibold">
            All India Ophthalmological Society
          </Typography>
        </View>

        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.tertiarySaffron}
            style={styles.sectionTitle}
          >
            PERSONAL INFORMATION
          </Typography>
          <View style={styles.orangeAccentBar} />
        </View>
        <View style={styles.row2Col}>
          <View style={styles.titleCol}>
            <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
              Title
            </Typography>
            <View style={styles.displayBox}>
              <Typography variant="bodyMd" color={colors.textPrimary}>
                {profile?.title || ''}
              </Typography>
            </View>
          </View>

          <View style={styles.flex1Col}>
            <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
              Surname
            </Typography>
            <View style={styles.displayBox}>
              <Typography variant="bodyMd" color={colors.textPrimary}>
                {profile?.surname || ''}
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.fullWidthField}>
          <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
            First Name
          </Typography>
          <View style={styles.displayBox}>
            <Typography variant="bodyMd" color={colors.textPrimary}>
              {profile?.firstName || ''}
            </Typography>
          </View>
        </View>
        <View style={styles.row2Col}>
          <View style={styles.halfCol}>
            <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
              Gender
            </Typography>
            <View style={styles.displayBox}>
              <Typography variant="bodyMd" color={colors.textPrimary}>
                {profile?.gender || ''}
              </Typography>
            </View>
          </View>

          <View style={styles.halfCol}>
            <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
              Date of Birth
            </Typography>
            <View style={styles.displayBox}>
              <Typography variant="bodyMd" color={colors.textPrimary}>
                {profile?.dob || ''}
              </Typography>
              {profile?.dob ? <CalendarIcon size={18} color={colors.secondaryRoyal} /> : null}
            </View>
          </View>
        </View>

        <View style={styles.fullWidthField}>
          <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
            Phone No.
          </Typography>
          <View style={styles.displayBox}>
            <Typography variant="bodyMd" color={colors.textPrimary}>
              {profile?.phone || ''}
            </Typography>
          </View>
        </View>

        <View style={[styles.sectionHeader, styles.sectionSpacing]}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.tertiarySaffron}
            style={styles.sectionTitle}
          >
            ADDRESS
          </Typography>
          <View style={styles.orangeAccentBar} />
        </View>

        <View style={styles.fullWidthField}>
          <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
            House No/ Flat No
          </Typography>
          <View style={styles.displayBox}>
            <Typography variant="bodyMd" color={colors.textPrimary}>
              {profile?.houseNo || ''}
            </Typography>
          </View>
        </View>

        <View style={styles.fullWidthField}>
          <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
            Street/Locality
          </Typography>
          <View style={styles.displayBox}>
            <Typography variant="bodyMd" color={colors.textPrimary}>
              {profile?.street || ''}
            </Typography>
          </View>
        </View>

        <View style={styles.fullWidthField}>
          <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
            Landmark
          </Typography>
          <View style={styles.displayBox}>
            <Typography variant="bodyMd" color={colors.textPrimary}>
              {profile?.landmark || ''}
            </Typography>
          </View>
        </View>
        <View style={styles.row2Col}>
          <View style={styles.halfCol}>
            <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
              Country
            </Typography>
            <View style={styles.displayBox}>
              <Typography variant="bodyMd" color={colors.textPrimary}>
                {profile?.country || ''}
              </Typography>
            </View>
          </View>

          <View style={styles.halfCol}>
            <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
              State
            </Typography>
            <View style={styles.displayBox}>
              <Typography variant="bodyMd" color={colors.textPrimary}>
                {profile?.state || ''}
              </Typography>
            </View>
          </View>
        </View>
        <View style={styles.row2Col}>
          <View style={styles.halfCol}>
            <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
              City
            </Typography>
            <View style={styles.displayBox}>
              <Typography variant="bodyMd" color={colors.textPrimary}>
                {profile?.city || ''}
              </Typography>
            </View>
          </View>

          <View style={styles.halfCol}>
            <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
              Pin Code
            </Typography>
            <View style={styles.displayBox}>
              <Typography variant="bodyMd" color={colors.textPrimary}>
                {profile?.pincode || ''}
              </Typography>
            </View>
          </View>
        </View>

        <View style={[styles.sectionHeader, styles.sectionSpacing]}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.tertiarySaffron}
            style={styles.sectionTitle}
          >
            ACCOUNT DETAILS
          </Typography>
          <View style={styles.orangeAccentBar} />
        </View>

        <View style={styles.fullWidthField}>
          <Typography variant="labelMd" weight="bold" color={colors.textPrimary} style={styles.labelAbove}>
            Email Address
          </Typography>
          <View style={[styles.displayBox, styles.emailDisplayBox]}>
            <Typography variant="bodyMd" color={colors.textPrimary}>
              {profile?.email || ''}
            </Typography>
            {profile?.email ? (
              <View style={styles.verifiedBadge}>
                <CheckIcon size={12} color={colors.success} />
                <Typography
                  variant="labelSm"
                  weight="bold"
                  color={colors.success}
                  style={styles.verifiedBadgeText}
                >
                  Verified
                </Typography>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  topHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  verifiedBadgeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: rounded.full,
  },

  cardContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 18,
    ...shadows.level1,
  },

  avatarSection: {
    alignItems: 'center',
    marginVertical: 8,
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 2.5,
    borderColor: colors.borderNeutral,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    ...shadows.level1,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorName: {
    marginBottom: 2,
    textAlign: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderNeutral,
    marginVertical: 16,
  },

  sectionHeader: {
    marginBottom: 14,
  },
  sectionSpacing: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 14,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  orangeAccentBar: {
    width: 50,
    height: 2.5,
    backgroundColor: colors.tertiarySaffron,
    borderRadius: 1,
  },

  row2Col: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  titleCol: {
    width: 100,
  },
  flex1Col: {
    flex: 1,
  },
  halfCol: {
    flex: 1,
  },
  fullWidthField: {
    width: '100%',
    marginBottom: 12,
  },

  labelAbove: {
    marginBottom: 6,
    fontSize: 13,
  },
  displayBox: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.borderField,
    borderRadius: 6,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emailDisplayBox: {
    paddingRight: 10,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  /* Qualification Card */
  qualificationCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 10,
  },
  qualificationCardSpacing: {
    marginTop: 4,
  },
  qualificationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  degreeIndexBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  deleteDegreeSingleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
  },
  textInputField: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.borderField,
    borderRadius: 6,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  fileUploadBox: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.borderField,
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  chooseFileBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  fileNameText: {
    flex: 1,
    fontSize: 12,
  },
  degreeActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    marginBottom: 4,
  },
  addDegreeBtn: {
    flex: 1,
    backgroundColor: colors.primaryNavy,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteDegreeBtn: {
    flex: 1,
    backgroundColor: colors.primaryNavy,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MyProfileScreen;
