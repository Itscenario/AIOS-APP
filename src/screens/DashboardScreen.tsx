import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { DrawerMenuButton } from '../components/DrawerMenuButton';
import { useNavigation } from '@react-navigation/native';
import { images } from '../constants/images';
import { useAppSelector } from '../store';
import { formatProfileName } from '../utils/profileName';
import {
  BellIcon,
  BriefcaseIcon,
  CertificatesTabIcon,
  DocumentIcon,
  MegaphoneIcon,
  MidTermTabIcon,
  PersonIcon,
} from '../components/Icons';

export const DashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [bannerWidth, setBannerWidth] = useState(0);
  const navigation = useNavigation<any>();
  const savedProfile = useAppSelector(state => state.auth.profile);
  const profile = savedProfile?.membershipId?.match(/^LM-\d+$/)
    ? { ...savedProfile, membershipId: undefined }
    : savedProfile;
  const isMember = profile?.membershipStatus === 'active';
  const fullName =
    [profile?.firstName, profile?.surname].filter(Boolean).join(' ').trim() ||
    profile?.name?.trim() ||
    '';
  const displayName = formatProfileName(
    profile?.title &&
      !fullName.toLowerCase().startsWith(profile.title.trim().toLowerCase())
      ? `${profile.title} ${fullName}`
      : fullName,
  );

  return (
    <View style={styles.container}>
      <ScreenStatusBar />
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <View style={styles.headerLeft}>
          <DrawerMenuButton />
          <View style={styles.logoBadge}>
            <Image
              source={images.logo}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerTitleCol}>
            <View style={styles.headerBrandRow}>
              <Text style={styles.brandTitle}>AIOS</Text>
              <View style={styles.officialPill}>
                <Text style={styles.officialPillText}>OFFICIAL</Text>
              </View>
            </View>
            <Text style={styles.brandSubtitle} numberOfLines={1}>
              All India Ophthalmological Society
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.bellBtn}
            activeOpacity={0.75}
            onPress={() => {}}
          >
            <BellIcon size={20} color="#FFFFFF" hasBadge={true} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarBtn}
            activeOpacity={0.75}
            onPress={() => navigation.navigate('MyProfile')}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <View style={styles.avatarCircle}>
              {profile?.avatar ? (
                <Image
                  source={{ uri: profile.avatar }}
                  style={styles.profileAvatarImage}
                  resizeMode="stretch"
                />
              ) : (
                <PersonIcon size={16} color="#FFFFFF" filled={true} />
              )}
            </View>
            <View style={styles.onlineDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusStrip}>
          <View style={styles.stripTopRow}>
            <View style={styles.stripIndicator}>
              <Text style={styles.stripBreadcrumbText}>Dashboard</Text>
            </View>
            <Text style={styles.memberPortalBadge}>
              {isMember ? 'Member' : 'Non Member'}
            </Text>
          </View>
          {!isMember && (
            <TouchableOpacity
              style={styles.welcomeSection}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('MyProfile')}
              accessibilityRole="button"
              accessibilityLabel={`Welcome to All India Ophthalmological Society. ${displayName}. Open full profile`}
            >
              <LinearGradient
                colors={['#182452', '#101438', '#09152A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.welcomeAccentRing} pointerEvents="none" />
              <Image
                source={images.aiosBuilding}
                style={styles.welcomeBuilding}
                resizeMode="contain"
                accessible={false}
              />
              <View style={styles.welcomeContent}>
                <View style={styles.welcomeTopRow}>
                  <View style={styles.welcomeAvatar}>
                    {profile?.avatar ? (
                      <Image
                        source={{ uri: profile.avatar }}
                        style={styles.profileAvatarImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <PersonIcon size={26} color="#FFFFFF" filled />
                    )}
                  </View>
                  <View style={styles.welcomeTitleGroup}>
                    <Text style={styles.welcomeEyebrow}>Welcome to</Text>
                  </View>
                </View>
                <Text
                  style={styles.welcomeBrand}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  All India Ophthalmological Society
                </Text>
                {displayName ? (
                  <Text style={styles.welcomeName}>{displayName}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.conferenceBannerCard}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="AIOC 2027 annual conference. View conference details"
          onPress={() => navigation.navigate('Certificates')}
        >
          <View
            style={styles.conferenceBannerFrame}
            onLayout={({ nativeEvent }) =>
              setBannerWidth(nativeEvent.layout.width)
            }
          >
            {bannerWidth > 0 ? (
              <Image
                source={images.aioc2027Banner}
                style={{
                  width: bannerWidth,
                  height: (bannerWidth * 316) / 998,
                }}
                resizeMode="contain"
                accessibilityLabel="85th Annual Conference of AIOS, AIOC 2027 Gandhinagar, February 18–21"
              />
            ) : null}
          </View>
        </TouchableOpacity>

        <View style={styles.servicesSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Society Services</Text>
            <Text style={styles.sectionSubtitleLink}>Quick Portal</Text>
          </View>

          <View style={styles.servicesGrid}>
            <TouchableOpacity
              style={styles.serviceGridCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Jobs')}
            >
              <View style={styles.serviceCardTop}>
                <View
                  style={[
                    styles.serviceIconPill,
                    { backgroundColor: '#EFF6FF' },
                  ]}
                >
                  <BriefcaseIcon size={18} color="#2563EB" />
                </View>
                <View style={styles.serviceBadgeOrange}>
                  <Text style={styles.serviceBadgeOrangeText}>8 New</Text>
                </View>
              </View>
              <Text style={styles.serviceTitle}>Job Hub</Text>
              <Text style={styles.serviceDesc}>Faculty & Fellowships</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceGridCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Certificates')}
            >
              <View style={styles.serviceCardTop}>
                <View
                  style={[
                    styles.serviceIconPill,
                    { backgroundColor: '#EFF6FF' },
                  ]}
                >
                  <CertificatesTabIcon size={18} color="#2563EB" />
                </View>
                <View style={styles.serviceBadgeGray}>
                  <Text style={styles.serviceBadgeGrayText}>2026</Text>
                </View>
              </View>
              <Text style={styles.serviceTitle}>Annual</Text>
              <Text style={styles.serviceDesc}>
                Registration & Certificates
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceGridCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('MidTerm')}
            >
              <View style={styles.serviceCardTop}>
                <View
                  style={[
                    styles.serviceIconPill,
                    { backgroundColor: '#FFF7ED' },
                  ]}
                >
                  <MidTermTabIcon size={18} color="#EA580C" />
                </View>
                <View style={styles.serviceBadgeGreen}>
                  <Text style={styles.serviceBadgeGreenText}>2026</Text>
                </View>
              </View>
              <Text style={styles.serviceTitle}>Mid-Term Pass</Text>
              <Text style={styles.serviceDesc}>Download Credentials</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceGridCard}
              activeOpacity={0.8}
              onPress={isMember ? undefined : () => navigation.navigate('Profile')}
              disabled={isMember}
            >
              <View style={styles.serviceCardTop}>
                <View
                  style={[
                    styles.serviceIconPill,
                    { backgroundColor: '#F8FAFC' },
                  ]}
                >
                  <DocumentIcon size={18} color="#64748B" />
                </View>
                <View style={styles.serviceBadgeAmber}>
                  <Text style={styles.serviceBadgeAmberText}>Open</Text>
                </View>
              </View>
              <Text style={styles.serviceTitle}>
                {isMember ? 'FAICO Examination 2026' : 'Become an AIOS Member'}
              </Text>
              <Text style={styles.serviceDesc} numberOfLines={1} adjustsFontSizeToFit>
                Apply for AIOS Membership
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.noticeSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.noticeHeaderLeft}>
              <MegaphoneIcon size={18} color="#FF5722" />
              <Text style={styles.noticeSectionTitle}>Notice Board</Text>
            </View>
            {/* <TouchableOpacity onPress={() => Linking.openURL('https://www.aios.org')}>
              <Text style={styles.archiveLink}>Archive</Text>
            </TouchableOpacity> */}
          </View>

          <View style={styles.noticeCard}>
            <View style={styles.noticeCardHeader}>
              <Text style={styles.tagOfficialCircular}>OFFICIAL CIRCULAR</Text>
              <Text style={styles.noticeTimeText}>2h ago</Text>
            </View>
            <Text style={styles.noticeTitle}>
              AIOS Governing Council Elections 2025–27
            </Text>
            <Text style={styles.noticeBody}>
              Filing of nominations opens for State & National representations.
              Verified electoral roll released.
            </Text>
          </View>

          <View style={styles.noticeCard}>
            <View style={styles.noticeCardHeader}>
              <Text style={styles.tagPublications}>PUBLICATIONS</Text>
              <Text style={styles.noticeTimeText}>1d ago</Text>
            </View>
            <Text style={styles.noticeTitle}>
              Indian Journal of Ophthalmology (IJO) Vol 73 Issue 2
            </Text>
            <Text style={styles.noticeBody}>
              Special issue on contemporary robotic vitreoretinal maneuvers and
              clinical outcomes...
            </Text>
          </View>

          <View style={styles.noticeCard}>
            <View style={styles.noticeCardHeader}>
              <Text style={styles.tagAccreditation}>ACCREDITATION</Text>
              <Text style={styles.noticeTimeText}>3d ago</Text>
            </View>
            <Text style={styles.noticeTitle}>
              CME Credit Points Update: 12 Hours Awarded
            </Text>
            <Text style={styles.noticeBody}>
              National Medical Commission (NMC/MCI) certification synced to your
              member profile...
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0B1728',
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#16253B',
    padding: 3,
    borderWidth: 1,
    borderColor: '#223854',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  headerTitleCol: {
    flex: 1,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  officialPill: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  officialPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#16253B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: {
    position: 'relative',
  },
  avatarCircle: {
    overflow: 'hidden',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1E3A8A',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5722',
    borderWidth: 1.5,
    borderColor: '#0B1728',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  statusStrip: {
    marginHorizontal: 16,
    marginTop: 22,
  },
  stripTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  stripIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EA580C',
    marginRight: 6,
  },
  stripBreadcrumbText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  memberPortalBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9A3412',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    letterSpacing: 0.5,
  },
  welcomeSection: {
    marginTop: 18,
    backgroundColor: '#101047',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#28375B',
    minHeight: 186,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  welcomeAccentRing: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 32,
    borderColor: 'rgba(122, 155, 220, 0.08)',
    right: -75,
    top: -90,
  },
  welcomeBuilding: {
    position: 'absolute',
    right: -4,
    bottom: 0,
    width: '30%',
    height: 142,
    opacity: 0.65,
  },
  welcomeContent: {
    padding: 20,
    paddingRight: '27%',
  },
  welcomeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  welcomeAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#273658',
    borderWidth: 1,
    borderColor: '#60749B',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  welcomeTitleGroup: {
    flex: 1,
    minWidth: 0,
  },
  welcomeEyebrow: {
    fontSize: 28,
    lineHeight: 38,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontStyle: 'italic',
    fontWeight: '400',
    color: '#FFFFFF',
  },
  welcomeBrand: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    color: '#FDBA74',
  },
  welcomeName: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#364365',
    fontSize: 20,
    lineHeight: 28,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '500',
    letterSpacing: 0.3,
    color: '#CBD5E1',
  },
  profileAvatarImage: {
    width: '100%',
    height: '100%',
  },
  conferenceBannerCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  conferenceBannerFrame: {
    alignSelf: 'stretch',
    minHeight: 1,
  },
  servicesSection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  sectionSubtitleLink: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceGridCard: {
    width: 'auto',
    flexBasis: '47%',
    flexGrow: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    minHeight: 142,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F294A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  serviceIconPill: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceBadgeOrange: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  serviceBadgeOrangeText: {
    color: '#EA580C',
    fontSize: 9.5,
    fontWeight: '800',
  },
  serviceBadgeGray: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  serviceBadgeGrayText: {
    color: '#475569',
    fontSize: 9.5,
    fontWeight: '800',
  },
  serviceBadgeGreen: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  serviceBadgeGreenText: {
    color: '#16A34A',
    fontSize: 9.5,
    fontWeight: '800',
  },
  serviceBadgeAmber: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  serviceBadgeAmberText: {
    color: '#D97706',
    fontSize: 9.5,
    fontWeight: '800',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  serviceDesc: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748B',
    marginTop: 2,
  },
  noticeSection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  noticeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noticeSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginLeft: 6,
  },
  archiveLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 0,
  },
  noticeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tagOfficialCircular: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 0.5,
  },
  tagPublications: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  tagAccreditation: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  noticeTimeText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  noticeTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  noticeBody: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
  },
});

export default DashboardScreen;
