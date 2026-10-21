import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Share,
  Platform,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { useAppSelector } from '../store';
import { images } from '../constants/images';
import { downloadCertificate } from '../services/CertificateDownloader';
import {
  VerifiedBadgeIcon,
  DocumentIcon,
  ShareIcon,
  ShieldCheckIcon,
  AwardMedalIcon,
  LocationPinIcon,
  CheckIcon,
  CloseIcon,
  QrCodeIcon,
  SearchIcon,
  PersonIcon,
  ChevronDownIcon,
} from '../components/Icons';

interface CertificateItem {
  id: string;
  title: string;
  location: string;
  year: string;
  type: 'Annual Conference' | 'Mid-term Conference';
  theme?: string;
}

export interface DelegateItem {
  id: string;
  name: string;
  memberId: string;
  regNo?: string;
  category: 'Faculty' | 'Delegate' | string;
}

const DEFAULT_DELEGATES: DelegateItem[] = [
  {
    id: 'apao-faculty',
    name: 'Dr. Rajesh Sharma, MS',
    memberId: 'APAO2500025',
    category: 'Faculty',
  },
  {
    id: 'apao-delegate',
    name: 'Dr. Rajesh Sharma, MS',
    memberId: 'APAO2500025',
    category: 'Delegate',
  },
];

const CONFERENCE_DELEGATES: { [conferenceId: string]: DelegateItem[] } = {
  '1': DEFAULT_DELEGATES,
  '2': DEFAULT_DELEGATES,
  '3': DEFAULT_DELEGATES,
  '4': DEFAULT_DELEGATES,
  '5': DEFAULT_DELEGATES,
  '6': DEFAULT_DELEGATES,
};

const PARTICIPATION_CERTIFICATES: CertificateItem[] = [
  {
    id: '1',
    title: 'APAO AIOS 2025',
    location: 'New Delhi',
    year: '2025',
    type: 'Annual Conference',
    theme: 'Innovations in Vision Care',
  },
  {
    id: '2',
    title: 'AIOS Midterm 2024',
    location: 'Dehradun',
    year: '2024',
    type: 'Mid-term Conference',
    theme: 'Clinical Cornea & Refractive Advances',
  },
  {
    id: '3',
    title: 'AIOC 2024',
    location: 'Kolkata',
    year: '2024',
    type: 'Annual Conference',
    theme: 'Surgical Retina & Vitreous Masterclass',
  },
  {
    id: '4',
    title: 'AIOS Midterm 2023',
    location: 'Visakhapatnam',
    year: '2023',
    type: 'Mid-term Conference',
    theme: 'Glaucoma & Pediatric Ophthalmology',
  },
  {
    id: '5',
    title: 'AIOC 2023',
    location: 'Kochi',
    year: '2023',
    type: 'Annual Conference',
    theme: 'Emerging Technologies in Eye Care',
  },
  {
    id: '6',
    title: 'AIOS Mid-term 2023',
    location: 'Patna',
    year: '2023',
    type: 'Mid-term Conference',
    theme: 'Comprehensive Ophthalmic Practice',
  },
];

export const CertificatesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const profile = useAppSelector(state => state.auth.profile);

  const [activeFilter, setActiveFilter] = useState<
    'All' | 'Annual' | 'Mid-term'
  >('All');
  const [selectedConferenceId, setSelectedConferenceId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    'All' | 'Faculty' | 'Delegate'
  >('All');

  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedCert, setSelectedCert] = useState<{
    title: string;
    subtitle: string;
    location?: string;
    year?: string;
    type?: string;
    theme?: string;
    isMembership?: boolean;
    recipientName?: string;
    recipientId?: string;
    category?: string;
  } | null>(null);

  // Download state
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadCompleted, setDownloadCompleted] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState('');
  const [downloadedFilePath, setDownloadedFilePath] = useState('');
  const [downloadCertTitle, setDownloadCertTitle] = useState('');

  const memberName = profile
    ? (
        profile.name ||
        [profile.title, profile.firstName, profile.surname]
          .filter(Boolean)
          .join(' ') ||
        'DR. AIOS MEMBER'
      ).toUpperCase()
    : 'DR. AIOS MEMBER';

  const memberId = profile?.membershipId || 'LM-12849';

  const filteredCerts = PARTICIPATION_CERTIFICATES.filter(cert => {
    if (activeFilter === 'Annual') return cert.type === 'Annual Conference';
    if (activeFilter === 'Mid-term') return cert.type === 'Mid-term Conference';
    return true;
  });

  const handleSelectConference = (conferenceId: string) => {
    if (selectedConferenceId === conferenceId) {
      setSelectedConferenceId(null);
      setSearchQuery('');
      setSelectedCategoryFilter('All');
    } else {
      setSelectedConferenceId(conferenceId);
      setSearchQuery('');
      setSelectedCategoryFilter('All');
    }
  };

  const getDelegatesForConference = (conferenceId: string) => {
    const list = CONFERENCE_DELEGATES[conferenceId] || DEFAULT_DELEGATES;
    let filtered = list;

    if (selectedCategoryFilter !== 'All') {
      filtered = filtered.filter(
        d => d.category.toLowerCase() === selectedCategoryFilter.toLowerCase(),
      );
    }

    if (!searchQuery.trim()) {
      return filtered;
    }
    const q = searchQuery.toLowerCase().trim();
    return filtered.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        d.memberId.toLowerCase().includes(q) ||
        (d.regNo ? d.regNo.toLowerCase().includes(q) : false) ||
        (d.category ? d.category.toLowerCase().includes(q) : false),
    );
  };

  const handleShare = (
    certTitle: string,
    location?: string,
    year?: string,
    recipient?: string,
    rId?: string,
  ) => {
    const name = recipient || memberName;
    const mId = rId || memberId;
    const details = location && year ? ` (${location}, ${year})` : '';
    Share.share({
      title: certTitle,
      message: `Verified AIOS Certificate: ${certTitle}${details}.\nIssued to: ${name} (${mId}).\nIssued by All India Ophthalmological Society (AIOS).`,
    });
  };

  const handleOpenPreview = (cert: {
    title: string;
    subtitle: string;
    location?: string;
    year?: string;
    type?: string;
    theme?: string;
    isMembership?: boolean;
    recipientName?: string;
    recipientId?: string;
    category?: string;
  }) => {
    setSelectedCert(cert);
    setPreviewModalVisible(true);
  };

  const handleDownload = async (cert: {
    title: string;
    location?: string;
    year?: string;
    isMembership?: boolean;
    recipientName?: string;
    memberId?: string;
  }) => {
    const recipient = cert.recipientName || memberName;
    const mId = cert.memberId || memberId;

    setDownloadCertTitle(cert.title);
    setDownloadProgress(20);
    setDownloadCompleted(false);
    setDownloadedFileName('');
    setDownloadedFilePath('');
    setDownloadModalVisible(true);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 85) return prev;
        return prev + 25;
      });
    }, 200);

    try {
      const result = await downloadCertificate({
        title: cert.title,
        recipientName: recipient,
        memberId: mId,
        location: cert.location,
        year: cert.year,
        isMembership: cert.isMembership,
      });

      clearInterval(interval);
      setDownloadProgress(100);
      setDownloadCompleted(true);
      setDownloadedFileName(result.fileName);
      setDownloadedFilePath(result.filePath);
    } catch (e: any) {
      clearInterval(interval);
      setDownloadModalVisible(false);
      Alert.alert(
        'Download Error',
        e?.message || 'Could not download certificate.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScreenStatusBar />
      {/* 1. Official AIOS Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeft}>
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
              <Text style={styles.brandSubtitle}>
                Credentials & Verified Certificates
              </Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredCerts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        extraData={`${selectedConferenceId}-${searchQuery}`}
        renderItem={({ item: cert }) => {
          const isAnnual = cert.type === 'Annual Conference';
          const isSelected = selectedConferenceId === cert.id;
          const delegates = isSelected
            ? getDelegatesForConference(cert.id)
            : [];

          return (
            <View
              style={[
                styles.certCardWrapper,
                isSelected && styles.certCardWrapperActive,
              ]}
            >
              <TouchableOpacity
                style={[styles.certCard, isSelected && styles.certCardActive]}
                activeOpacity={0.8}
                onPress={() => handleSelectConference(cert.id)}
              >
                <View
                  style={[
                    styles.certYearBox,
                    isAnnual
                      ? styles.certYearBoxAnnual
                      : styles.certYearBoxMidterm,
                  ]}
                >
                  <Text
                    style={[
                      styles.certYearText,
                      isAnnual
                        ? styles.certYearTextAnnual
                        : styles.certYearTextMidterm,
                    ]}
                  >
                    {cert.year}
                  </Text>
                  <Text style={styles.certYearBadgeSub}>CONF</Text>
                </View>

                {/* Center Content */}
                <View style={styles.certTextContainer}>
                  <View style={styles.certTitleRow}>
                    <Text style={styles.certTitle} numberOfLines={1}>
                      {cert.title}
                    </Text>
                    <View
                      style={[
                        styles.certTypeBadge,
                        isAnnual
                          ? styles.certTypeBadgeAnnual
                          : styles.certTypeBadgeMidterm,
                      ]}
                    >
                      <Text
                        style={[
                          styles.certTypeBadgeText,
                          isAnnual
                            ? styles.certTypeBadgeTextAnnual
                            : styles.certTypeBadgeTextMidterm,
                        ]}
                      >
                        {isAnnual ? 'AIOC' : 'MID-TERM'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.certActionsCol}>
                  <View
                    style={[
                      styles.chevronBadge,
                      isSelected && styles.chevronBadgeActive,
                      isSelected && { transform: [{ rotate: '180deg' }] },
                    ]}
                  >
                    <ChevronDownIcon
                      size={14}
                      color={isSelected ? '#0284C7' : '#64748B'}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {isSelected && (
                <View style={styles.delegateSearchExpandedBox}>
                  <View style={styles.searchPromptHeader}>
                    <Text style={styles.searchPromptTitle}>
                      Search Certificate • {cert.title}
                    </Text>
                  </View>

                  <View style={styles.searchInputRow}>
                    <SearchIcon size={16} color="#0284C7" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Type doctor name, reg no or member ID..."
                      placeholderTextColor="#94A3B8"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoCapitalize="words"
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setSearchQuery('')}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <CloseIcon size={14} color="#64748B" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Condition filter chips: All / Faculty / Delegate */}
                  <View style={styles.categoryFilterRow}>
                    {(['All', 'Faculty', 'Delegate'] as const).map(cat => {
                      const isCatActive = selectedCategoryFilter === cat;
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.categoryFilterChip,
                            isCatActive &&
                              (cat === 'Faculty'
                                ? styles.categoryFilterChipActiveFaculty
                                : styles.categoryFilterChipActive),
                          ]}
                          onPress={() => setSelectedCategoryFilter(cat)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.categoryFilterChipText,
                              isCatActive &&
                                styles.categoryFilterChipTextActive,
                            ]}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={styles.delegatesListContainer}>
                    <View style={styles.delegatesCountRow} />

                    {delegates.map(delegate => {
                      const isFaculty = delegate.category === 'Faculty';
                      return (
                        <TouchableOpacity
                          key={delegate.id}
                          style={styles.delegateRowItem}
                          activeOpacity={0.75}
                          onPress={() =>
                            handleOpenPreview({
                              title: cert.title,
                              subtitle: `${cert.type} • ${delegate.category}`,
                              location: cert.location,
                              year: cert.year,
                              type: cert.type,
                              theme: cert.theme,
                              recipientName: delegate.name,
                              recipientId: delegate.memberId,
                              category: delegate.category,
                            })
                          }
                        >
                          <View
                            style={[
                              styles.delegateIconCircle,
                              isFaculty && styles.facultyIconCircle,
                            ]}
                          >
                            <PersonIcon
                              size={15}
                              color={isFaculty ? '#D97706' : '#0284C7'}
                            />
                          </View>
                          <View style={styles.delegateDetailsCol}>
                            <View style={styles.delegateNameRow}>
                              <Text
                                style={styles.delegateNameText}
                                numberOfLines={1}
                              >
                                {delegate.name}
                              </Text>
                              <View
                                style={[
                                  styles.categoryBadge,
                                  isFaculty
                                    ? styles.facultyBadge
                                    : styles.delegateBadge,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.categoryBadgeText,
                                    isFaculty
                                      ? styles.facultyBadgeText
                                      : styles.delegateBadgeText,
                                  ]}
                                >
                                  {delegate.category}
                                </Text>
                              </View>
                            </View>
                            <Text style={styles.delegateSubText}>
                              {delegate.memberId}
                              {delegate.regNo
                                ? ` • Reg: ${delegate.regNo}`
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.showCertPill,
                              isFaculty && styles.facultyShowCertPill,
                            ]}
                          >
                            <Text style={styles.showCertPillText}>Show ➔</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}

                    {delegates.length === 0 && (
                      <View style={styles.noResultsBox}>
                        <Text style={styles.noResultsText}>
                          No attendee found matching "{searchQuery}".
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          );
        }}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />

      <Modal
        visible={previewModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <View style={styles.previewModalOverlay}>
          <View style={styles.previewModalContainer}>
            <View style={styles.previewModalHeader}>
              <View style={styles.previewModalHeaderLeft}>
                <AwardMedalIcon size={18} color="#D97706" />
                <Text style={styles.previewModalHeaderTitle}>
                  Official Certificate Preview
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPreviewModalVisible(false)}
                style={styles.previewModalCloseBtn}
              >
                <CloseIcon size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.certCanvasOuter}>
              <View style={styles.certCanvasInner}>
                <View style={styles.certCanvasLogoRow}>
                  <Image
                    source={images.logo}
                    style={styles.certCanvasLogo}
                    resizeMode="contain"
                  />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.certCanvasHeading}>
                      ALL INDIA OPHTHALMOLOGICAL SOCIETY
                    </Text>
                    <Text style={styles.certCanvasSubheading}>
                      Established 1930 • From Darkness to Light
                    </Text>
                  </View>
                </View>

                <View style={styles.certCanvasGoldLine} />

                <Text style={styles.certAwardTitle}>
                  {selectedCert?.isMembership
                    ? 'CERTIFICATE OF LIFE MEMBERSHIP'
                    : selectedCert?.category === 'Faculty'
                    ? 'CERTIFICATE OF APPRECIATION'
                    : 'CERTIFICATE OF PARTICIPATION'}
                </Text>

                <Text style={styles.certAwardText}>
                  This is proudly presented to
                </Text>
                <Text style={styles.certAwardRecipient}>
                  {selectedCert?.recipientName || memberName}
                </Text>

                {selectedCert?.isMembership ? (
                  <Text style={styles.certAwardBody}>
                    in recognition of enrollment as an esteemed Life Member of
                    the society with Member Registration Number{' '}
                    <Text style={{ fontWeight: '800', color: '#0A1E3F' }}>
                      {selectedCert?.recipientId || memberId}
                    </Text>
                    . Entitled to all rights, honors, and privileges of the
                    Society.
                  </Text>
                ) : selectedCert?.category === 'Faculty' ? (
                  <Text style={styles.certAwardBody}>
                    in grateful appreciation for distinguished contribution and
                    valuable service as{' '}
                    <Text style={{ fontWeight: '800', color: '#0A1E3F' }}>
                      Faculty
                    </Text>{' '}
                    in the{' '}
                    <Text style={{ fontWeight: '800', color: '#0A1E3F' }}>
                      {selectedCert?.title}
                    </Text>{' '}
                    held at {selectedCert?.location} ({selectedCert?.year}).
                  </Text>
                ) : (
                  <Text style={styles.certAwardBody}>
                    for active and distinguished participation as a{' '}
                    <Text style={{ fontWeight: '800', color: '#0A1E3F' }}>
                      Delegate
                    </Text>{' '}
                    in the{' '}
                    <Text style={{ fontWeight: '800', color: '#0A1E3F' }}>
                      {selectedCert?.title}
                    </Text>{' '}
                    held at {selectedCert?.location} ({selectedCert?.year}).
                  </Text>
                )}

                <View style={styles.certSignaturesRow}>
                  <View style={styles.certSigCol}>
                    <View style={styles.certSigLine} />
                    <Text style={styles.certSigTitle}>Dr. President, AIOS</Text>
                    <Text style={styles.certSigSub}>President</Text>
                  </View>

                  <View style={styles.certSealCenter}>
                    <View style={styles.certSealCircle}>
                      <AwardMedalIcon size={20} color="#D97706" />
                      <Text style={styles.certSealText}>SEAL</Text>
                    </View>
                  </View>

                  <View style={styles.certSigCol}>
                    <View style={styles.certSigLine} />
                    <Text style={styles.certSigTitle}>Dr. Hon. Secretary</Text>
                    <Text style={styles.certSigSub}>Honorary General Sec.</Text>
                  </View>
                </View>

                <View style={styles.certBottomVerifyRow}>
                  <QrCodeIcon size={16} color="#059669" />
                  <Text style={styles.certBottomVerifyText}>
                    Document ID: AIOS-VERIFIED-
                    {selectedCert?.recipientId || memberId}-
                    {selectedCert?.year || '2025'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.previewModalActions}>
              <TouchableOpacity
                style={styles.previewShareBtn}
                onPress={() => {
                  setPreviewModalVisible(false);
                  if (selectedCert) {
                    handleShare(
                      selectedCert.category === 'Faculty'
                        ? `${selectedCert.title} (Faculty Certificate)`
                        : selectedCert.title,
                      selectedCert.location,
                      selectedCert.year,
                      selectedCert.recipientName,
                      selectedCert.recipientId,
                    );
                  }
                }}
                activeOpacity={0.8}
              >
                <ShareIcon size={16} color="#0284C7" />
                <Text style={styles.previewShareBtnText}>Share Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.previewDownloadBtn}
                onPress={() => {
                  setPreviewModalVisible(false);
                  if (selectedCert) {
                    handleDownload({
                      title:
                        selectedCert.category === 'Faculty'
                          ? `${selectedCert.title} - Faculty`
                          : selectedCert.title,
                      location: selectedCert.location,
                      year: selectedCert.year,
                      isMembership: selectedCert.isMembership,
                      recipientName: selectedCert.recipientName,
                      memberId: selectedCert.recipientId,
                    });
                  }
                }}
                activeOpacity={0.85}
              >
                <DocumentIcon size={16} color="#FFFFFF" />
                <Text style={styles.previewDownloadBtnText}>Download PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Download Progress / Completion Modal */}
      <Modal
        visible={downloadModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (downloadCompleted) setDownloadModalVisible(false);
        }}
      >
        <View style={styles.downloadModalOverlay}>
          <View style={styles.downloadModalCard}>
            {downloadCompleted ? (
              <View style={styles.downloadSuccessContent}>
                <View style={styles.downloadCheckCircle}>
                  <CheckIcon size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.downloadSuccessTitle}>
                  Certificate Downloaded!
                </Text>
                <Text style={styles.downloadSuccessSub}>
                  Official verified PDF certificate saved to your device.
                </Text>

                <View style={styles.downloadFileInfoBox}>
                  <DocumentIcon size={18} color="#0284C7" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.downloadFileName} numberOfLines={1}>
                      {downloadedFileName}
                    </Text>
                    <Text style={styles.downloadFilePath} numberOfLines={1}>
                      {downloadedFilePath}
                    </Text>
                  </View>
                </View>

                <View style={styles.downloadModalButtonsRow}>
                  <TouchableOpacity
                    style={styles.downloadShareBtn}
                    onPress={() => {
                      setDownloadModalVisible(false);
                      handleShare(downloadCertTitle);
                    }}
                    activeOpacity={0.8}
                  >
                    <ShareIcon size={15} color="#0284C7" />
                    <Text style={styles.downloadShareBtnText}>Share File</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.downloadDoneBtn}
                    onPress={() => setDownloadModalVisible(false)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.downloadDoneBtnText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.downloadProgressContent}>
                <View style={styles.downloadSpinCircle}>
                  <DocumentIcon size={24} color="#E06A26" />
                </View>

                <Text style={styles.downloadProgressTitle}>
                  Downloading Certificate...
                </Text>
                <Text style={styles.downloadProgressSub}>
                  Generating high-resolution AIOS verified PDF document
                </Text>

                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${downloadProgress}%` },
                    ]}
                  />
                </View>

                <Text style={styles.progressPercentText}>
                  {downloadProgress}% Completed
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  header: {
    backgroundColor: '#0A1E3F',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#162C54',
  },
  headerTopRow: {
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
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginRight: 6,
  },
  officialPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  officialPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#93C5FD',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  certList: {
    gap: 12,
  },
  certCardWrapper: {
    marginBottom: 2,
  },
  certCardWrapperActive: {},
  certCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  certCardActive: {
    borderColor: '#0284C7',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    backgroundColor: '#F0F9FF',
  },
  certYearBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  certYearBoxAnnual: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  certYearBoxMidterm: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  certYearText: {
    fontSize: 13,
    fontWeight: '800',
  },
  certYearTextAnnual: {
    color: '#EA580C',
  },
  certYearTextMidterm: {
    color: '#0284C7',
  },
  certYearBadgeSub: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 1,
  },

  certTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  certTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  certTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A1E3F',
    flex: 1,
  },
  certTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  certTypeBadgeAnnual: {
    backgroundColor: '#FFEDD5',
  },
  certTypeBadgeMidterm: {
    backgroundColor: '#E0F2FE',
  },
  certTypeBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  certTypeBadgeTextAnnual: {
    color: '#EA580C',
  },
  certTypeBadgeTextMidterm: {
    color: '#0284C7',
  },
  certMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between',
  },
  certMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certMetaText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  certMetaTapHint: {
    fontSize: 9,
    color: '#0284C7',
    fontWeight: '700',
  },
  certActionsCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronBadgeActive: {
    backgroundColor: '#E0F2FE',
  },

  /* Expanded Delegate Search Container */
  delegateSearchExpandedBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0284C7',
    borderTopWidth: 1,
    borderTopColor: '#E0F2FE',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    padding: 16,
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#0284C7',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchPromptHeader: {
    marginBottom: 12,
  },
  searchPromptTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  searchPromptSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 15,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 7,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '600',
    padding: 0,
  },
  delegatesListContainer: {
    marginTop: 14,
  },
  delegatesCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  delegatesCountLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },
  delegatesCountHint: {
    fontSize: 9,
    color: '#64748B',
    fontStyle: 'italic',
  },
  delegateRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  delegateIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  delegateDetailsCol: {
    flex: 1,
    marginRight: 10,
  },
  delegateNameText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  delegateSubText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 3,
  },
  showCertPill: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
  },
  showCertPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  categoryFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 2,
  },
  categoryFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  categoryFilterChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  categoryFilterChipActiveFaculty: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  categoryFilterChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  categoryFilterChipTextActive: {
    color: '#FFFFFF',
  },
  delegateNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  categoryBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  facultyBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 0.5,
    borderColor: '#F59E0B',
  },
  delegateBadge: {
    backgroundColor: '#E0F2FE',
    borderWidth: 0.5,
    borderColor: '#38BDF8',
  },
  categoryBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
  },
  facultyBadgeText: {
    color: '#B45309',
  },
  delegateBadgeText: {
    color: '#0284C7',
  },
  facultyIconCircle: {
    backgroundColor: '#FEF3C7',
  },
  facultyShowCertPill: {
    backgroundColor: '#D97706',
  },
  noResultsBox: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },

  /* Preview Modal */
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 30, 63, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  previewModalContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  previewModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  previewModalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewModalHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  previewModalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certCanvasOuter: {
    backgroundColor: '#FCFDFE',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F59E0B',
    padding: 6,
  },
  certCanvasInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 14,
    alignItems: 'center',
  },
  certCanvasLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  certCanvasLogo: {
    width: 36,
    height: 36,
  },
  certCanvasHeading: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0A1E3F',
    letterSpacing: 0.5,
  },
  certCanvasSubheading: {
    fontSize: 8,
    color: '#64748B',
    marginTop: 1,
  },
  certCanvasGoldLine: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#F59E0B',
    marginVertical: 10,
  },
  certAwardTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: 1,
    marginBottom: 6,
  },
  certAwardText: {
    fontSize: 9,
    color: '#64748B',
    fontStyle: 'italic',
  },
  certAwardRecipient: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0A1E3F',
    letterSpacing: 0.5,
    marginVertical: 4,
    textAlign: 'center',
  },
  certAwardBody: {
    fontSize: 10,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 14,
    marginHorizontal: 10,
    marginTop: 2,
  },
  certSignaturesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
  },
  certSigCol: {
    alignItems: 'center',
    flex: 1,
  },
  certSigLine: {
    width: 60,
    height: 1,
    backgroundColor: '#94A3B8',
    marginBottom: 3,
  },
  certSigTitle: {
    fontSize: 8,
    fontWeight: '700',
    color: '#0F172A',
  },
  certSigSub: {
    fontSize: 7,
    color: '#64748B',
  },
  certSealCenter: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  certSealCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certSealText: {
    fontSize: 6,
    fontWeight: '900',
    color: '#B45309',
  },
  certBottomVerifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  certBottomVerifyText: {
    fontSize: 8,
    color: '#059669',
    fontWeight: '700',
  },
  previewModalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  previewShareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingVertical: 11,
    borderRadius: 10,
  },
  previewShareBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  previewDownloadBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#E06A26',
    paddingVertical: 11,
    borderRadius: 10,
  },
  previewDownloadBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Download Modal */
  downloadModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 30, 63, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  downloadModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  downloadSuccessContent: {
    width: '100%',
    alignItems: 'center',
  },
  downloadCheckCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  downloadSuccessTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A1E3F',
    textAlign: 'center',
  },
  downloadSuccessSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  downloadFileInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 10,
    width: '100%',
    marginBottom: 16,
  },
  downloadFileName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
  },
  downloadFilePath: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  downloadModalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  downloadShareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingVertical: 11,
    borderRadius: 10,
  },
  downloadShareBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  downloadDoneBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A1E3F',
    paddingVertical: 11,
    borderRadius: 10,
  },
  downloadDoneBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  downloadProgressContent: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  downloadSpinCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  downloadProgressTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  downloadProgressSub: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E06A26',
    borderRadius: 4,
  },
  progressPercentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E06A26',
    marginTop: 8,
  },
});

export default CertificatesScreen;
