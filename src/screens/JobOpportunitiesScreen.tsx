import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import { HeaderBackButton } from '../components/HeaderBackButton';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { images } from '../constants/images';
import type { RootStackParamList } from '../navigation/types';
import {
  SearchIcon,
  LocationPinIcon,
  PhoneIcon,
  MailIcon,
  BookmarkIcon,
  SendPaperPlaneIcon,
  PlusIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  HospitalIcon,
} from '../components/Icons';

export interface JobItem {
  id: string;
  hospitalName: string;
  location: string;
  positionTitle: string;
  employmentType: string;
  vacancies: string;
  deadline: string;
  isUrgent?: boolean;
  summary: string;
  contactName: string;
  contactRole?: string;
  phone: string;
  whatsappNumber?: string;
  email: string;
  specialty: string;
  salary?: string;
  accommodation?: string;
  qualifications?: string;
  selectionCriteria?: string;
}

const JOBS_DATA: JobItem[] = [
  {
    id: 'sankara-01',
    hospitalName: 'Sankara Eye Hospital',
    location: 'Bengaluru, Karnataka',
    positionTitle: 'Consultant Vitreo-Retinal Surgeon',
    employmentType: 'Full-time',
    vacancies: '2 Vacancies',
    deadline: '15 Mar 2025',
    isUrgent: true,
    summary:
      'Seeking experienced surgical retina consultant with minimum 3 years post-fellowship in complex vitreoretinal procedures.',
    contactName: 'Dr. Anandita Roy',
    contactRole: 'HR Medical Services',
    phone: '+91 80 2854 3000',
    whatsappNumber: '8028543000',
    email: 'careers@sankaraeye.in',
    specialty: 'Retina',
    salary: '₹2.8L - ₹3.5L / month (Negotiable)',
    accommodation: 'Furnished residential quarters provided inside campus.',
    qualifications:
      'MS / DNB / MD Ophthalmology + 2-year Vitreo-Retina surgical fellowship.',
    selectionCriteria:
      'Clinical case discussion & surgical video evaluation followed by board interview.',
  },
];

const CATEGORIES = [
  'All Openings',
  'Retina',
  'Cornea & Refractive',
  'Glaucoma',
  'Pediatric',
  'Cataract',
];

export const JobOpportunitiesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Openings');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['sankara-01']);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleApply = (job: JobItem) => {
    const parentNav = navigation.getParent();
    if (parentNav) {
      (parentNav as any).navigate('JobApplication', { job });
    } else {
      navigation.navigate('JobApplication', { job });
    }
  };

  const filteredJobs = useMemo(() => {
    return JOBS_DATA.filter(job => {
      const matchesCategory =
        selectedCategory === 'All Openings' ||
        job.specialty.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        job.hospitalName.toLowerCase().includes(query) ||
        job.positionTitle.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.specialty.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const renderJobCard = ({ item: job }: { item: JobItem }) => {
    const isBookmarked = bookmarkedIds.includes(job.id);
    const isExpanded = expandedId === job.id;

    return (
      <View style={styles.jobCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.hospitalLogoBox}>
            <HospitalIcon size={20} color="#0284C7" />
          </View>
          <View style={styles.hospitalInfoCol}>
            <View style={styles.hospitalNameRow}>
              <Text style={styles.hospitalName} numberOfLines={1}>
                {job.hospitalName}
              </Text>
              <ShieldCheckIcon size={14} color="#0284C7" />
            </View>
            <View style={styles.locationRow}>
              <LocationPinIcon size={12} color="#64748B" />
              <Text style={styles.locationText}>{job.location}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.bookmarkBtn}
            onPress={() => toggleBookmark(job.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          ></TouchableOpacity>
        </View>

        <Text style={styles.positionTitle}>{job.positionTitle}</Text>
        <View style={styles.badgesRow}>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>{job.employmentType}</Text>
          </View>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>👥 {job.vacancies}</Text>
          </View>
          <View
            style={[
              styles.badgePill,
              job.isUrgent ? styles.deadlineBadgeUrgent : styles.deadlineBadge,
            ]}
          >
            <Text style={styles.deadlineBadgeText}>
              ⏰ {job.isUrgent ? 'Deadline' : 'Ends'}: {job.deadline}
            </Text>
          </View>
        </View>

        <View style={styles.contactBox}>
          <View style={styles.contactTopRow}>
            <View style={styles.contactNameRow}>
              <View style={styles.personIconBullet} />
              <Text style={styles.contactLabel}>
                Contact:{' '}
                <Text style={styles.contactBold}>{job.contactName}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.contactDetailRow}>
            <PhoneIcon size={12} color="#0284C7" />
            <Text style={styles.contactDetailText}>{job.phone}</Text>
          </View>

          <View style={styles.contactDetailRow}>
            <MailIcon size={12} color="#E06A26" />
            <Text style={styles.contactDetailText}>{job.email}</Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.expandedDetailsBox}>
            {job.salary && (
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Salary / Remuneration:</Text>
                <Text style={styles.detailVal}>{job.salary}</Text>
              </View>
            )}
            {job.accommodation && (
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Accommodation:</Text>
                <Text style={styles.detailVal}>{job.accommodation}</Text>
              </View>
            )}
            {job.qualifications && (
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>
                  Eligibility & Qualifications:
                </Text>
                <Text style={styles.detailVal}>{job.qualifications}</Text>
              </View>
            )}
            {job.selectionCriteria && (
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Selection Mode:</Text>
                <Text style={styles.detailVal}>{job.selectionCriteria}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.actionButtonsRow}>
          <Button
            customLayout
            style={styles.viewDetailsBtn}
            activeOpacity={0.8}
            onPress={() => toggleExpand(job.id)}
          >
            <Text style={styles.viewDetailsText}>
              {isExpanded ? 'Hide Details' : 'View Details →'}
            </Text>
          </Button>

          <Button

            customLayout
            style={styles.applyNowBtn}
            activeOpacity={0.85}
            onPress={() => handleApply(job)}
          >
            <Text style={styles.applyNowText}>Apply Now</Text>
          </Button>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      <View style={styles.searchContainer}>
        <SearchIcon size={18} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search position, specialty, hospital, or city..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
        renderItem={({ item: category }) => {
          const isActive = selectedCategory === category;
          return (
            <TouchableOpacity
              style={[
                styles.categoryPill,
                isActive && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  isActive && styles.categoryPillTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <HospitalIcon size={36} color="#94A3B8" />
      <Text style={styles.emptyTitle}>No Openings Found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search criteria or explore other specialties.
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View>
      <View style={{ height: 40 }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenStatusBar barStyle="dark-content" />
      <AppHeader style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <View style={styles.headerLeft}>
          <HeaderBackButton />
          <View style={styles.logoBadge}>
            <Image
              source={images.logo}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerTitleCol}>
            <Text style={styles.brandTitle}>Job Opportunities</Text>
          </View>
        </View>
      </AppHeader>

      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.id}
        renderItem={renderJobCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        style={styles.flatList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 3,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#0A1E3F',
    letterSpacing: 0.5,
    marginRight: 6,
  },
  officialPill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  officialPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#93C5FD',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
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
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: {
    position: 'relative',
  },
  avatarImg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  avatarStatusDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F97316',
    borderWidth: 1.5,
    borderColor: '#0A1E3F',
  },

  titleBar: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FED7AA',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#9A3412',
  },
  portalBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  portalBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C2410C',
    letterSpacing: 0.4,
  },
  subtitleText: {
    fontSize: 11,
    color: '#7C2D12',
    marginTop: 2,
  },

  scrollView: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.04,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },

  categoryScroll: {
    paddingBottom: 14,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  jobList: {
    gap: 14,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },

  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalLogoBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  hospitalInfoCol: {
    flex: 1,
  },
  hospitalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hospitalName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: '#64748B',
  },
  bookmarkBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  positionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A1E3F',
    marginTop: 12,
    marginBottom: 8,
  },

  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  badgePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  deadlineBadgeUrgent: {
    backgroundColor: '#450A0A',
  },
  deadlineBadge: {
    backgroundColor: '#1E293B',
  },
  deadlineBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FEF2F2',
  },

  summaryText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },

  contactBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    marginBottom: 14,
    gap: 4,
  },
  contactTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  contactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  personIconBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
  },
  contactLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  contactBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  contactRoleText: {
    fontSize: 10,
    color: '#64748B',
  },
  contactDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactDetailText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },

  expandedDetailsBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 14,
    gap: 6,
  },
  detailRow: {
    gap: 2,
  },
  detailTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  detailVal: {
    fontSize: 11,
    color: '#0C4A6E',
    lineHeight: 16,
  },

  /* Action Buttons */
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  viewDetailsBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  applyNowBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#0B63F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#0B63F6',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  applyNowText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  postJobBannerBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  postJobLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plusIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postJobTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  membersOnlyBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  membersOnlyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#CBD5E1',
  },
});
