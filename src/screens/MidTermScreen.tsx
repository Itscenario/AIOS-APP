import { PaymentInformation } from '../components/PaymentInformation';
import { CertificateArchive } from '../components/CertificateArchive';
import { formatProfileName } from '../utils/profileName';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Keyboard,
  KeyboardAvoidingView,
  ToastAndroid,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
  Modal,
  TextInput,
  Share,
  Alert,
  NativeModules,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { colors } from '../theme/colors';
import { Typography } from '../components/Typography';
import {
  CalendarIcon,
  LocationPinIcon,
  WhatsAppIcon,
  ShareIcon,
  EditPencilIcon,
  AwardMedalIcon,
  DocumentIcon,
  CloseIcon,
  CheckIcon,
  PersonIcon,
  VerifiedBadgeIcon,
  QrCodeIcon,
} from '../components/Icons';
import { images } from '../constants/images';
import { useAppSelector } from '../store';
import { downloadCertificate } from '../services/CertificateDownloader';

// Custom icons matching the user's screenshot
const PrinterIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = '#EA580C',
}) => (
  <View
    style={{
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {/* Top Paper */}
    <View
      style={{
        width: size * 0.55,
        height: size * 0.28,
        backgroundColor: color,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        marginBottom: 1,
      }}
    />
    <View
      style={{
        width: size * 0.9,
        height: size * 0.36,
        backgroundColor: color,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: size * 0.65,
          height: 1.5,
          backgroundColor: '#FFFFFF',
          opacity: 0.8,
        }}
      />
    </View>
    <View
      style={{
        width: size * 0.65,
        height: size * 0.26,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        borderWidth: 1.5,
        borderColor: color,
        borderTopWidth: 0,
        backgroundColor: '#FFFFFF',
        marginTop: 1,
      }}
    />
  </View>
);

const BedIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = '#EA580C',
}) => (
  <View style={{ width: size, height: size, justifyContent: 'center' }}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: size * 0.6,
      }}
    >
      <View
        style={{
          width: 3,
          height: size * 0.55,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          flex: 1,
          height: size * 0.38,
          backgroundColor: color,
          borderRadius: 2,
          marginHorizontal: 1.5,
        }}
      />
      <View
        style={{
          width: 3,
          height: size * 0.38,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </View>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 0.5,
        marginTop: 1,
      }}
    >
      <View style={{ width: 2.5, height: 3.5, backgroundColor: color }} />
      <View style={{ width: 2.5, height: 3.5, backgroundColor: color }} />
    </View>
  </View>
);

const RupeeIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 22,
  color = '#EA580C',
}) => (
  <View
    style={{
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text
      style={{
        fontSize: size * 0.95,
        fontWeight: '900',
        color: color,
        lineHeight: size * 1.1,
      }}
    >
      ₹
    </Text>
  </View>
);

const PencilBadgeIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: 5,
      backgroundColor: '#EA580C',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <EditPencilIcon size={size * 0.62} color="#FFFFFF" />
  </View>
);

const SelectArrowsIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 11,
  color = '#64748B',
}) => (
  <View
    style={{
      width: size,
      height: size * 1.5,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text
      style={{
        fontSize: size * 0.7,
        color,
        lineHeight: size * 0.75,
        fontWeight: '800',
      }}
    >
      ▲
    </Text>
    <Text
      style={{
        fontSize: size * 0.7,
        color,
        lineHeight: size * 0.75,
        fontWeight: '800',
      }}
    >
      ▼
    </Text>
  </View>
);

const DELEGATE_CATEGORIES = [
  'AIOS Member',
  'Non - AIOS Member',
  'International Delegate',
  'Trade Delegate',
];

const DELEGATE_TYPES = ['Ophthalmologist', 'Resident / Trainee', 'Exhibitor'];

const ACCOMPANYING_OPTIONS = ['0', '1', '2', '3', '4'];

interface MidtermCertificateItem {
  id: string;
  title: string;
  year: string;
  location: string;
  dates: string;
  theme: string;
}

interface PersonCertificateItem extends MidtermCertificateItem {
  recipientName: string;
  memberId: string;
}

const MIDTERM_CERTIFICATES: MidtermCertificateItem[] = [
  {
    id: 'mt-2026',
    title: '5th AIOS Mid-Term Conference 2026',
    year: '2026',
    location: 'Hotel Chanakya BNR, Ranchi',
    dates: 'September 25 - 27, 2026',
    theme: 'Advancing Frontiers in Clinical Ophthalmology',
  },
  {
    id: 'mt-2024',
    title: 'AIOS Midterm 2024',
    year: '2024',
    location: 'Dehradun, Uttarakhand',
    dates: 'October 11 - 13, 2024',
    theme: 'Clinical Cornea & Refractive Advances',
  },
  {
    id: 'mt-2023',
    title: 'AIOS Midterm 2023',
    year: '2023',
    location: 'Visakhapatnam, Andhra Pradesh',
    dates: 'September 22 - 24, 2023',
    theme: 'Glaucoma & Pediatric Ophthalmology',
  },
];

const SPECIALITY_OPTIONS = [
  'Glaucoma',
  'Retina & Vitreous',
  'Cornea',
  'Comprehensive Ophthalmology',
  'Uvea',
  'Cataract/Phaco',
  'Pediatric Ophthalmology & Strabismus',
  'Oculoplastic Surgery',
  'Refractive Surgery',
  'Neurophthalmology',
  'Ocular Pathology',
  'Microbiology',
  'None',
];

const SCIENTIFIC_COURSES = {
  SSTC: [
    'Phacoemulsification with foldable intraocular lens implantation',
    'Small incision cataract surgery',
    'Iris Fixated IOLs',
    'Anterior Vitrectomy',
    'INTACS Rings',
    'Phakic IOLs',
    'Trabeculectomy',
    'iStent Implantation',
    'AGV – Ahmed Glaucoma Valve',
    'KDB – Kahook Dual Blade Goniotomy',
    'Hydrus implant',
    'Corneal Suturing',
    'Penetrating keratoplasty',
    'Deep anterior lamellar keratoplasty',
  ],
  DSTC: [
    'Mock MS/DNB Practical Exam with Examiner Feedback',
    'Slit Lamp Biomicroscopy & 78/90D',
    'Indirect Ophthalmoscopy & Scleral Depression',
    'Macular OCT Made Simple',
    'OCT Angiography Decoded',
    'FFA & ICG: Pattern Recognition',
    'Ultra-widefield Imaging & Autofluorescence',
    'Ocular Ultrasound: Hands-on Scanning & Interpretation',
    'Retinal Laser: PRP & Barrage',
    'ERG, VEP & EOG Interpretation',
  ],
  TSTC: [
    'AI Co-Pilots: Using Large Language Models in Ophthalmic Practice',
    'Deep Learning in Diagnostics: Advanced OCT and Visual Field Analytics',
    'Next-Gen Glaucoma: Virtual Reality Perimetry & Remote Monitoring',
    'Ultra-Widefield Imaging & AI in ROP',
    'Heads-Up! Transitioning to 3D Visualization Systems in the OR',
    'Mastering Complications with VR/AR Surgical Simulators',
    'Next-Gen IOLs & Digital Centration: From Pre-Op AI to OR Execution',
  ],
};

export const MidTermScreen: React.FC<{ variant?: 'midterm' | 'annual' }> = ({
  variant = 'midterm',
}) => {
  const isAnnual = variant === 'annual';
  const bannerSource = isAnnual
    ? images.aioc2027Banner
    : images.conferenceBanner;
  const bannerDimensions = Image.resolveAssetSource(bannerSource);
  const bannerAspectRatio =
    bannerDimensions?.width && bannerDimensions?.height
      ? bannerDimensions.width / bannerDimensions.height
      : isAnnual
      ? 998 / 316
      : 1003 / 212;
  const conferenceTitle = isAnnual
    ? '85th Annual Conference of AIOS'
    : '5th AIOS Mid-Term Conference 2026';
  const conferenceLocation = isAnnual
    ? 'Mahatma Mandir Convention and Exhibition Centre, Gandhinagar, Gujarat'
    : 'Hotel Chanakya BNR, Ranchi';
  const conferenceDates = isAnnual
    ? 'February 18 - 21, 2027'
    : 'September 25 - 27, 2026';
  const conferenceYear = isAnnual ? '2027' : '2026';
  const insets = useSafeAreaInsets();
  const savedProfile = useAppSelector(state => state.auth.profile);
  const profile = savedProfile?.membershipId?.match(/^LM-\d+$/)
    ? { ...savedProfile, membershipId: undefined }
    : savedProfile;
  const isMember = Boolean(profile?.membershipId?.trim());
  const registrationKey = isAnnual ? 'annual-2027' : 'midterm-2026';
  const isRegistered =
    profile?.conferenceRegistrations?.[registrationKey] === 'completed';

  const doctorName = profile
    ? formatProfileName(
        profile.name ||
          [profile.title, profile.firstName, profile.surname]
            .filter(Boolean)
            .join(' ') ||
          'AIOS Member',
      )
    : 'AIOS Member';
  const memberId = profile?.membershipId || 'Not available';
  const regNo = 'AIOC27-REG-10492';

  const [aiocRegistrationModalVisible, setAiocRegistrationModalVisible] =
    useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [printRegModalVisible, setPrintRegModalVisible] = useState(false);
  const [accommodationInfoModalVisible, setAccommodationInfoModalVisible] =
    useState(false);
  const [
    accommodationReceiptModalVisible,
    setAccommodationReceiptModalVisible,
  ] = useState(false);
  const [invitationLetterModalVisible, setInvitationLetterModalVisible] =
    useState(false);

  const [certModalVisible, setCertModalVisible] = useState(false);
  const [selectedCert, setSelectedCert] =
    useState<PersonCertificateItem | null>(null);
  const [certificateDownloading, setCertificateDownloading] = useState(false);
  const [certCategory, setCertCategory] = useState<'Faculty' | 'Delegate'>(
    'Faculty',
  );

  const [institution, setInstitution] = useState('');
  const [orgType, setOrgType] = useState<'Govt' | 'Private' | ''>('Private');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('');
  const [passportNo, setPassportNo] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>(
    ['None'],
  );

  const [delegateCategory, setDelegateCategory] = useState<string>('');
  const [delegateType, setDelegateType] = useState<string>('');
  const [noOfAccompanying, setNoOfAccompanying] = useState<number>(0);
  const [accompanyingNames, setAccompanyingNames] = useState<string[]>([]);
  const [expandedActivity, setExpandedActivity] = useState<
    keyof typeof SCIENTIFIC_COURSES | null
  >(null);
  const [selectedCourses, setSelectedCourses] = useState<
    Record<keyof typeof SCIENTIFIC_COURSES, string[]>
  >({ SSTC: [], DSTC: [], TSTC: [] });
  const [programBook, setProgramBook] = useState<
    'Hard Copy' | 'Online Version' | ''
  >('');
  const [foodChoice, setFoodChoice] = useState<
    'Vegetarian' | 'Non-Vegetarian' | 'Jain Food' | ''
  >('');
  const [cateringChoice, setCateringChoice] = useState<
    'Buffet' | 'Packed Food Box' | ''
  >('');
  const [activePicker, setActivePicker] = useState<
    'category' | 'type' | 'accompanying' | null
  >(null);

  const [paymentMode, setPaymentMode] = useState<'Online' | 'Offline'>(
    'Online',
  );
  const [captchaCode, setCaptchaCode] = useState<string>('7987b');
  const [captchaInput, setCaptchaInput] = useState<string>('');
  const registrationScrollRef =
    useRef<React.ElementRef<typeof ScrollView>>(null);
  const captchaFocused = useRef(false);
  useEffect(() => {
    const listener = Keyboard.addListener('keyboardDidShow', () => {
      if (captchaFocused.current) {
        requestAnimationFrame(() =>
          registrationScrollRef.current?.scrollToEnd({ animated: true }),
        );
      }
    });
    return () => listener.remove();
  }, []);

  const refreshCaptcha = () => {
    const chars = '23456789abcdefghkmnpqrstuvwxyz';
    let res = '';
    for (let i = 0; i < 5; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(res);
  };

  const [paymentReviewVisible, setPaymentReviewVisible] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);

  const archiveConferences: MidtermCertificateItem[] = [
    {
      id: 'annual-2025',
      title: 'APAO AIOS 2025',
      year: '2025',
      location: 'Delhi',
      dates: '',
      theme: '',
    },
    MIDTERM_CERTIFICATES[1],
    {
      id: 'annual-2024',
      title: 'AIOC 2024',
      year: '2024',
      location: 'Kolkata',
      dates: '',
      theme: '',
    },
    MIDTERM_CERTIFICATES[2],
    {
      id: 'annual-2023',
      title: 'AIOC 2023',
      year: '2023',
      location: 'Kochi',
      dates: '',
      theme: '',
    },
    {
      id: 'mt-patna-2023',
      title: 'AIOS Mid-term 2023',
      year: '2023',
      location: 'Patna',
      dates: '',
      theme: '',
    },
  ];

  const regCategory = delegateCategory || delegateType || 'AIOS Member';

  const getBaseFee = () => {
    if (!delegateCategory && !delegateType) return 0;
    if (delegateCategory === 'Non - AIOS Member') {
      return delegateType === 'Resident / Trainee' ? 7000 : 12000;
    }
    if (delegateCategory === 'International Delegate') return 20000;
    if (delegateCategory === 'Trade Delegate') return 15000;
    if (delegateType === 'Resident / Trainee') return 5500;
    return 8500;
  };

  const accompanyingFee = noOfAccompanying * 4000;
  const sstcActivityFee = selectedCourses.SSTC.length * 1000;
  const dstcActivityFee = selectedCourses.DSTC.length * 1000;
  const tstcActivityFee = selectedCourses.TSTC.length * 1000;
  const extraActivitiesFee =
    sstcActivityFee + dstcActivityFee + tstcActivityFee;
  const totalPayable = getBaseFee() + accompanyingFee + extraActivitiesFee;
  const gstAmount = Math.round(totalPayable * 0.18);

  const handleToggleSpeciality = (spec: string) => {
    if (spec === 'None') {
      setSelectedSpecialities(['None']);
      return;
    }
    const current = selectedSpecialities.filter(s => s !== 'None');
    if (selectedSpecialities.includes(spec)) {
      const next = current.filter(s => s !== spec);
      setSelectedSpecialities(next.length ? next : ['None']);
    } else {
      if (current.length >= 3) {
        Alert.alert(
          'Maximum Reached',
          'You can select a maximum of 3 specialities.',
        );
        return;
      }
      setSelectedSpecialities([...current, spec]);
    }
  };

  const handleWhatsApp = () => {
    Linking.openURL(
      'https://wa.me/919697692000?text=Inquiry%20regarding%20AIOS%20Conferences',
    );
  };

  const handleOpenCertificate = (cert: PersonCertificateItem) => {
    setSelectedCert(cert);
    setCertModalVisible(true);
  };

  const handleDownloadSelectedCertificate = async () => {
    if (!selectedCert || certificateDownloading) return;
    setCertificateDownloading(true);
    try {
      if (
        Platform.OS !== 'android' ||
        !NativeModules.CertificateDownloader?.downloadCertificate
      ) {
        throw new Error(
          'PDF download is currently available in the Android app only.',
        );
      }
      const result =
        await NativeModules.CertificateDownloader.downloadCertificate({
          title: `${selectedCert.title} - ${certCategory}`,
          recipientName: selectedCert.recipientName,
          memberId: selectedCert.memberId,
          location: selectedCert.location,
          year: selectedCert.year,
        });
      if (!result.success) throw new Error('Could not download certificate.');
      Alert.alert(
        'Download Complete',
        `${result.fileName} saved successfully.`,
      );
    } catch (error: any) {
      Alert.alert(
        'Download Error',
        error?.message || 'Could not download certificate.',
      );
    } finally {
      setCertificateDownloading(false);
    }
  };

  const handleDownloadDoc = async (title: string, subName?: string) => {
    try {
      const res = await downloadCertificate({
        title: title,
        recipientName: subName || doctorName,
        memberId: memberId,
        location: conferenceLocation,
        year: conferenceYear,
      });
      Alert.alert('Download Complete', `${res.fileName} saved successfully.`);
    } catch (e: any) {
      Alert.alert('Download Error', e?.message || 'Could not download PDF.');
    }
  };

  const handleShareDoc = (title: string, extra?: string) => {
    Share.share({
      title: title,
      message: `${title} - All India Ophthalmological Society (AIOS).\nIssued to: ${doctorName} (${memberId}).\n${
        extra || ''
      }`,
    });
  };

  return (
    <View style={styles.container}>
      <ScreenStatusBar barStyle="dark-content" />
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + (Platform.OS === 'ios' ? 8 : 10) },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Image
              source={images.logo}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>
              {isAnnual ? 'AIOS Annual Conference' : 'AIOC & Mid-Term'}
            </Text>
            <Text style={styles.headerSubtitle}>
              Conference Portal & Registration
            </Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>AIOC 2027</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.bannerWrapper, { aspectRatio: bannerAspectRatio }]}
        >
          <Image
            source={bannerSource}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>
        {!isMember && !isRegistered ? (
          <TouchableOpacity
            style={styles.registrationClosedCard}
            activeOpacity={0.85}
            disabled={!isAnnual}
            onPress={() => setAiocRegistrationModalVisible(true)}
            accessibilityRole={isAnnual ? 'button' : 'text'}
            accessibilityLabel={
              isAnnual
                ? 'AIOC Registration 2027. Open registration form'
                : 'Mid-term 2026 Registration Closed'
            }
          >
            <View style={styles.registrationClosedIcon}>
              <EditPencilIcon size={28} color="#1689BE" />
            </View>
            <Text style={styles.registrationClosedText}>
              {isAnnual
                ? 'AIOC Registration\n2027'
                : 'Mid-term 2026\nRegistration Closed'}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            {!isAnnual && (
              <TouchableOpacity
                style={styles.aiocHeroBtn}
                activeOpacity={0.85}
                onPress={() => setAiocRegistrationModalVisible(true)}
              >
                <View style={styles.aiocHeroIconBadge}>
                  <EditPencilIcon size={26} color="#FFFFFF" />
                </View>
                <View style={styles.aiocHeroTextCol}>
                  <Text style={styles.aiocHeroTitle}>AIOC Registration</Text>
                  <Text style={styles.aiocHeroYear}>2027</Text>
                </View>
                <View style={styles.aiocHeroActionTag}>
                  <Text style={styles.aiocHeroActionText}>Register Now ➔</Text>
                </View>
              </TouchableOpacity>
            )}
            {isAnnual ? (
              <FlatList
                scrollEnabled={false}
                numColumns={2}
                style={styles.actionGridContainer}
                columnWrapperStyle={styles.actionGridRow}
                data={[
                  {
                    id: 'registration',
                    title: 'AIOC Registration 2027',
                    icon: <PencilBadgeIcon size={24} />,
                    onPress: () => setAiocRegistrationModalVisible(true),
                  },
                  {
                    id: 'payment',
                    title: 'Payment Details',
                    icon: <RupeeIcon size={24} color="#F59E0B" />,
                    onPress: () => setPaymentModalVisible(true),
                  },
                  {
                    id: 'print',
                    title: 'Print Registration Detail',
                    icon: <PrinterIcon size={24} color="#F59E0B" />,
                    onPress: () => setPrintRegModalVisible(true),
                  },
                  {
                    id: 'invitation',
                    title: 'Print Invitation Letter',
                    icon: <PrinterIcon size={24} color="#F59E0B" />,
                    onPress: () => setInvitationLetterModalVisible(true),
                  },
                  {
                    id: 'accommodation',
                    title: 'Accommodation Booking',
                    icon: <BedIcon size={24} color="#F59E0B" />,
                    onPress: () => setAccommodationInfoModalVisible(true),
                  },
                ].filter(item => item.id === 'registration' || isRegistered)}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.annualActionBtn}
                    onPress={item.onPress}
                    activeOpacity={0.8}
                  >
                    {item.icon}
                    <Text style={styles.actionBtnText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={styles.actionGridContainer}>
                <View style={styles.actionGridRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.8}
                    onPress={() => setAiocRegistrationModalVisible(true)}
                  >
                    <PencilBadgeIcon size={24} />
                    <Text style={styles.actionBtnText}>
                      {'AIOC Registration\n2027'}
                    </Text>
                  </TouchableOpacity>
                  {isRegistered && (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      activeOpacity={0.8}
                      onPress={() => setPaymentModalVisible(true)}
                    >
                      <RupeeIcon size={22} color="#EA580C" />
                      <Text style={styles.actionBtnText}>
                        {'Payment\nDetails'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {isRegistered && (
                  <>
                    <View style={styles.actionGridRow}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        activeOpacity={0.8}
                        onPress={() => setPrintRegModalVisible(true)}
                      >
                        <PrinterIcon size={22} color="#EA580C" />
                        <Text style={styles.actionBtnText}>
                          {'Print Registration\nDetail'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        activeOpacity={0.8}
                        onPress={() => setAccommodationInfoModalVisible(true)}
                      >
                        <BedIcon size={22} color="#EA580C" />
                        <Text style={styles.actionBtnText}>
                          {'Accommodation Booking\nClosed'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.actionGridRow}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        activeOpacity={0.8}
                        onPress={() =>
                          setAccommodationReceiptModalVisible(true)
                        }
                      >
                        <PrinterIcon size={22} color="#EA580C" />
                        <Text style={styles.actionBtnText}>
                          {'Accommodation Booking\nPayment Receipt'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtn}
                        activeOpacity={0.8}
                        onPress={() => setInvitationLetterModalVisible(true)}
                      >
                        <PrinterIcon size={22} color="#EA580C" />
                        <Text style={styles.actionBtnText}>
                          {'Print Invitation\nLetter'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            )}
          </>
        )}
        <CertificateArchive
          conferences={archiveConferences}
          onOpen={(conference, person) => {
            setCertCategory(person.memberType);
            handleOpenCertificate({
              ...conference,
              recipientName: person.name,
              memberId: person.registrationNo,
            });
          }}
        />

        {isMember && (
          <>
            <View style={styles.infoCard}>
              <Typography
                variant="labelMd"
                weight="bold"
                color="#1E293B"
                style={{ marginBottom: 12 }}
              >
                {isAnnual
                  ? 'AIOC 2027 Conference Details'
                  : '5th Mid-Term Conference Details'}
              </Typography>

              <View style={styles.infoRow}>
                <View style={styles.iconCircleOrange}>
                  <CalendarIcon size={16} color="#EA580C" />
                </View>
                <View style={{ flex: 1 }}>
                  <Typography variant="caption" color="#64748B">
                    Dates
                  </Typography>
                  <Typography variant="bodySm" weight="bold" color="#1E293B">
                    {conferenceDates}
                  </Typography>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconCircleBlue}>
                  <LocationPinIcon size={16} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Typography variant="caption" color="#64748B">
                    Venue
                  </Typography>
                  <Typography variant="bodySm" weight="bold" color="#1E293B">
                    {conferenceLocation}
                  </Typography>
                  <Typography variant="caption" color="#64748B">
                    {isAnnual
                      ? 'Organised by All Gujarat Ophthalmological Society'
                      : 'Under the aegis of Jharkhand Ophthalmological Society'}
                  </Typography>
                </View>
              </View>
            </View>

            <View style={styles.contactCard}>
              <Typography
                variant="labelMd"
                weight="bold"
                color="#1E293B"
                style={{ marginBottom: 10 }}
              >
                Secretariat & Support
              </Typography>
              <TouchableOpacity
                style={styles.contactActionRow}
                onPress={handleWhatsApp}
                activeOpacity={0.8}
              >
                <View style={styles.whatsAppBadge}>
                  <WhatsAppIcon size={18} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Typography variant="labelSm" weight="bold" color="#1E293B">
                    AIOS Helpline WhatsApp
                  </Typography>
                  <Typography variant="caption" color="#25D366">
                    +91 96976 92000 (Tap to Chat)
                  </Typography>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
      <Modal
        visible={aiocRegistrationModalVisible}
        animationType="slide"
        onRequestClose={() =>
          paymentReviewVisible
            ? setPaymentReviewVisible(false)
            : setAiocRegistrationModalVisible(false)
        }
      >
        {paymentReviewVisible ? (
          <PaymentInformation
            amount={totalPayable}
            onBack={() => setPaymentReviewVisible(false)}
          />
        ) : (
          <KeyboardAvoidingView
            style={[styles.aiocFormContainer, { paddingTop: insets.top }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.aiocFormNav}>
              <TouchableOpacity
                style={styles.backToDashboardBtn}
                onPress={() => {
                  setAiocRegistrationModalVisible(false);
                  setPaymentCompleted(false);
                }}
              >
                <Text style={styles.backToDashboardText}>
                  ← Back to Dashboard
                </Text>
              </TouchableOpacity>

              <View style={styles.aiocBadge}>
                <Text style={styles.aiocBadgeText}>AIOC 2027</Text>
              </View>
            </View>

            <ScrollView
              ref={registrationScrollRef}
              style={styles.aiocFormScroll}
              contentContainerStyle={[
                styles.aiocFormScrollContent,
                { paddingBottom: Math.max(insets.bottom, 16) },
              ]}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none"
              nestedScrollEnabled
              onLayout={() => {
                if (captchaFocused.current)
                  registrationScrollRef.current?.scrollToEnd({
                    animated: true,
                  });
              }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.memberSummaryStrip}>
                <View style={styles.memberAvatarCircle}>
                  <PersonIcon size={24} color="#0A1E3F" filled={true} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.memberStripName}>{doctorName}</Text>
                  <Text style={styles.memberStripMeta}>
                    {memberId} • {profile?.email || 'Email not added'}
                  </Text>
                </View>
                <View style={styles.verifiedTag}>
                  <Text style={styles.verifiedTagText}>AIOS Member</Text>
                </View>
              </View>

              {!paymentCompleted ? (
                <>
                  <View style={styles.aiocSectionCard}>
                    {/* Row 1: Date of Birth & Nationality (Labels on top) */}
                    <View style={styles.formRow2Col}>
                      <View style={styles.formCol}>
                        <Text style={styles.aiocFieldLabel}>
                          * Date of Birth
                        </Text>
                        <TextInput
                          style={styles.aiocTextInput}
                          value={dob}
                          onChangeText={setDob}
                          placeholder="DD/MM/YYYY"
                          placeholderTextColor="#94A3B8"
                        />
                      </View>
                      <View style={styles.formCol}>
                        <Text style={styles.aiocFieldLabel}>*Nationality</Text>
                        <TextInput
                          style={styles.aiocTextInput}
                          value={nationality}
                          onChangeText={setNationality}
                          placeholder="IN"
                          placeholderTextColor="#94A3B8"
                        />
                      </View>
                    </View>

                    {/* Row 2: Passport no & Passport Expiry (Labels on top) */}
                    <View style={styles.formRow2Col}>
                      <View style={styles.formCol}>
                        <Text style={styles.aiocFieldLabel}>Passport no</Text>
                        <TextInput
                          style={styles.aiocTextInput}
                          value={passportNo}
                          onChangeText={setPassportNo}
                          placeholder="Passport no"
                          placeholderTextColor="#94A3B8"
                        />
                      </View>
                      <View style={styles.formCol}>
                        <Text style={styles.aiocFieldLabel}>
                          Passport Expiry
                        </Text>
                        <TextInput
                          style={styles.aiocTextInput}
                          value={passportExpiry}
                          onChangeText={setPassportExpiry}
                          placeholder="Passport Expiry"
                          placeholderTextColor="#94A3B8"
                        />
                      </View>
                    </View>

                    {/* Row 3: Mobile No & Institution / Organization */}
                    <View style={styles.formRow2Col}>
                      <View style={styles.formCol}>
                        <Text style={styles.aiocFieldLabel}>* Mobile No</Text>
                        <TextInput
                          style={styles.aiocTextInput}
                          value={mobileNo}
                          onChangeText={setMobileNo}
                          placeholder="Mobile No"
                          keyboardType="phone-pad"
                          placeholderTextColor="#94A3B8"
                        />
                      </View>
                      <View style={[styles.formCol, styles.institutionColumn]}>
                        <Text style={styles.aiocFieldLabel}>
                          * Institution / Organization
                        </Text>
                        <TextInput
                          style={[
                            styles.aiocTextInput,
                            !institution && styles.institutionPlaceholderInput,
                          ]}
                          value={institution}
                          onChangeText={setInstitution}
                          placeholder="Institution / Organization"
                          placeholderTextColor="#94A3B8"
                        />
                      </View>
                    </View>

                    {/* Type of Organization */}
                    <Text style={[styles.aiocFieldLabel, { marginTop: 4 }]}>
                      * Type of Organization
                    </Text>
                    <View style={styles.radioGroupRow}>
                      <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => setOrgType('Govt')}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            orgType === 'Govt' && styles.radioOuterActive,
                          ]}
                        >
                          {orgType === 'Govt' && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>Govt.</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => setOrgType('Private')}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            orgType === 'Private' && styles.radioOuterActive,
                          ]}
                        >
                          {orgType === 'Private' && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>Private</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.aiocSectionCard}>
                    <View style={styles.specialityHeaderRow}>
                      <Text style={styles.aiocFieldLabel}>
                        * Speciality{' '}
                        <Text style={styles.hintSub}>(Maximum Three)</Text>
                      </Text>
                      <Text style={styles.selectionCount}>
                        {selectedSpecialities.length}/3 Selected
                      </Text>
                    </View>

                    <FlatList
                      data={SPECIALITY_OPTIONS}
                      scrollEnabled={false}
                      contentContainerStyle={styles.specialityGrid}
                      keyExtractor={spec => spec}
                      extraData={selectedSpecialities}
                      renderItem={({ item: spec }) => {
                        const isSelected = selectedSpecialities.includes(spec);
                        return (
                          <TouchableOpacity
                            key={spec}
                            style={[
                              styles.checkboxRow,
                              isSelected && styles.checkboxRowActive,
                            ]}
                            onPress={() => handleToggleSpeciality(spec)}
                            activeOpacity={0.7}
                          >
                            <View
                              style={[
                                styles.checkboxSquare,
                                isSelected && styles.checkboxSquareActive,
                              ]}
                            >
                              {isSelected && (
                                <CheckIcon size={12} color="#FFFFFF" />
                              )}
                            </View>
                            <Text
                              style={[
                                styles.checkboxLabel,
                                isSelected && styles.checkboxLabelActive,
                              ]}
                            >
                              {spec}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>

                  {/* Delegate Details, Accompanying & Scientific Activities Card */}
                  <View style={styles.aiocSectionCard}>
                    {/* Row: Delegate Category & Delegate Type (Labels on Top) */}
                    <View style={styles.formRow2Col}>
                      <View style={styles.formCol}>
                        <Text style={styles.aiocFieldLabel}>
                          Delegate Category
                        </Text>
                        <TouchableOpacity
                          style={styles.selectBox}
                          activeOpacity={0.7}
                          onPress={() => setActivePicker('category')}
                        >
                          <Text
                            style={[
                              styles.selectBoxText,
                              !delegateCategory && styles.selectBoxPlaceholder,
                            ]}
                            numberOfLines={1}
                          >
                            {delegateCategory || '(Please Select)'}
                          </Text>
                          <SelectArrowsIcon />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.formCol}>
                        <Text style={styles.aiocFieldLabel}>
                          *Delegate Type
                        </Text>
                        <TouchableOpacity
                          style={styles.selectBox}
                          activeOpacity={0.7}
                          onPress={() => setActivePicker('type')}
                        >
                          <Text
                            style={[
                              styles.selectBoxText,
                              !delegateType && styles.selectBoxPlaceholder,
                            ]}
                            numberOfLines={1}
                          >
                            {delegateType || '(Please Select)'}
                          </Text>
                          <SelectArrowsIcon />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.formSectionDivider} />

                    {/* Accompanying Person */}
                    <View style={styles.accompanyingContainer}>
                      <Text style={styles.accompanyingSubtext}>
                        Accompanying Person(s)(Family i.e. Spouse/Children - Non
                        Ophthalmologist)
                      </Text>

                      <View style={styles.accompanyingControlRow}>
                        <View style={styles.accompanyingCountField}>
                          <TouchableOpacity
                            style={styles.accompanyingInputBox}
                            accessibilityRole="button"
                            accessibilityLabel={`Number of accompanying persons: ${noOfAccompanying}`}
                            activeOpacity={0.7}
                            onPress={() => setActivePicker('accompanying')}
                          >
                            <Text style={styles.accompanyingInputText}>
                              {noOfAccompanying}
                            </Text>
                            <SelectArrowsIcon />
                          </TouchableOpacity>
                          <Text style={styles.accompanyingFieldLabel}>
                            *No. of Accompanying Person
                          </Text>
                        </View>
                      </View>
                      {noOfAccompanying > 0 && (
                        <FlatList
                          data={Array.from(
                            { length: noOfAccompanying },
                            (_, index) => index,
                          )}
                          numColumns={2}
                          scrollEnabled={false}
                          style={styles.accompanyingNamesGrid}
                          columnWrapperStyle={styles.accompanyingNamesRow}
                          keyExtractor={index => String(index)}
                          extraData={accompanyingNames}
                          renderItem={({ item: index }) => (
                            <View
                              key={index}
                              style={styles.accompanyingNameField}
                            >
                              <TextInput
                                style={styles.aiocTextInput}
                                placeholder="Enter Name"
                                placeholderTextColor="#94A3B8"
                                accessibilityLabel={`Accompanying person ${
                                  index + 1
                                } name`}
                                autoCapitalize="words"
                                value={accompanyingNames[index] || ''}
                                onChangeText={name =>
                                  setAccompanyingNames(previous => {
                                    const updated = [...previous];
                                    updated[index] = name;
                                    return updated;
                                  })
                                }
                              />
                              <Text style={styles.accompanyingFieldLabel}>
                                * Accompanying Name
                                {noOfAccompanying > 1 ? ` ${index + 1}` : ''}
                              </Text>
                            </View>
                          )}
                        />
                      )}
                    </View>

                    <View style={styles.formSectionDivider} />

                    {/* Extra Scientific activities */}
                    <Text style={styles.extraActivityTitle}>
                      Registration for Extra Scientific activities (Optional) -
                      Per course is chargeable 1000/-
                    </Text>

                    <FlatList
                      data={['SSTC', 'DSTC', 'TSTC'] as const}
                      numColumns={3}
                      scrollEnabled={false}
                      columnWrapperStyle={styles.extraActivitiesRow}
                      keyExtractor={activity => activity}
                      extraData={{ expandedActivity, selectedCourses }}
                      renderItem={({ item: activity }) => {
                        const expanded = expandedActivity === activity;
                        return (
                          <View key={activity} style={styles.formCol}>
                            <TouchableOpacity
                              style={[
                                styles.extraActivityBtn,
                                expanded && styles.extraActivityHeaderActive,
                              ]}
                              onPress={() =>
                                setExpandedActivity(previous =>
                                  previous === activity ? null : activity,
                                )
                              }
                              activeOpacity={0.7}
                              accessibilityRole="button"
                              accessibilityState={{ expanded }}
                              accessibilityLabel={activity}
                            >
                              <View
                                style={[
                                  styles.extraActivityIndicator,
                                  expanded && styles.extraActivityBtnActive,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.extraActivityPlus,
                                    expanded && styles.extraActivityPlusActive,
                                  ]}
                                >
                                  {expanded ? '−' : '+'}
                                </Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={styles.extraActivityText}>
                                  {activity}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                    />

                    {expandedActivity && (
                      <FlatList
                        data={SCIENTIFIC_COURSES[expandedActivity]}
                        scrollEnabled={false}
                        contentContainerStyle={styles.extraActivityDropdown}
                        keyExtractor={course => course}
                        extraData={selectedCourses[expandedActivity]}
                        ListHeaderComponent={
                          <View style={styles.extraActivityDropdownHeader}>
                            <Text style={styles.extraActivityDropdownTitle}>
                              {expandedActivity} courses
                            </Text>
                          </View>
                        }
                        renderItem={({ item: course }) => {
                          const activity = expandedActivity;
                          const selected =
                            selectedCourses[activity].includes(course);
                          return (
                            <TouchableOpacity
                              key={course}
                              style={[
                                styles.extraActivityCourse,
                                selected && styles.extraActivityCourseActive,
                              ]}
                              activeOpacity={0.7}
                              accessibilityRole="checkbox"
                              accessibilityState={{ checked: selected }}
                              accessibilityLabel={course}
                              onPress={() =>
                                setSelectedCourses(previous => ({
                                  ...previous,
                                  [activity]: selected
                                    ? previous[activity].filter(
                                        item => item !== course,
                                      )
                                    : [...previous[activity], course],
                                }))
                              }
                            >
                              <View
                                style={[
                                  styles.extraActivityCheckbox,
                                  selected &&
                                    styles.extraActivityCheckboxActive,
                                ]}
                              >
                                {selected && (
                                  <CheckIcon size={12} color="#FFFFFF" />
                                )}
                              </View>
                              <Text
                                style={[
                                  styles.extraActivityCourseText,
                                  selected &&
                                    styles.extraActivityCourseTextActive,
                                ]}
                              >
                                {course}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    )}

                    {/* Program Book Required */}
                    <Text style={styles.aiocFieldLabel}>
                      *Program Book Required
                    </Text>
                    <View style={styles.radioGroupVertical}>
                      <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => setProgramBook('Hard Copy')}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            programBook === 'Hard Copy' &&
                              styles.radioOuterActive,
                          ]}
                        >
                          {programBook === 'Hard Copy' && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>Hard Copy</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => setProgramBook('Online Version')}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            programBook === 'Online Version' &&
                              styles.radioOuterActive,
                          ]}
                        >
                          {programBook === 'Online Version' && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>Online Version</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Food Choice */}
                    <Text style={[styles.aiocFieldLabel, { marginTop: 12 }]}>
                      *Food Choice
                    </Text>
                    <View style={styles.radioGroupVertical}>
                      <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => setFoodChoice('Vegetarian')}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            foodChoice === 'Vegetarian' &&
                              styles.radioOuterActive,
                          ]}
                        >
                          {foodChoice === 'Vegetarian' && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>Vegetarian</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => setFoodChoice('Non-Vegetarian')}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            foodChoice === 'Non-Vegetarian' &&
                              styles.radioOuterActive,
                          ]}
                        >
                          {foodChoice === 'Non-Vegetarian' && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>Non-Vegetarian</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => setFoodChoice('Jain Food')}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            foodChoice === 'Jain Food' &&
                              styles.radioOuterActive,
                          ]}
                        >
                          {foodChoice === 'Jain Food' && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>Jain Food</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Catering Choice */}
                    <Text style={[styles.aiocFieldLabel, { marginTop: 16 }]}>
                      *Catering Choice
                    </Text>
                    <View style={styles.radioGroupVertical}>
                      <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => setCateringChoice('Buffet')}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            cateringChoice === 'Buffet' &&
                              styles.radioOuterActive,
                          ]}
                        >
                          {cateringChoice === 'Buffet' && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>Buffet</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => setCateringChoice('Packed Food Box')}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            cateringChoice === 'Packed Food Box' &&
                              styles.radioOuterActive,
                          ]}
                        >
                          {cateringChoice === 'Packed Food Box' && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>Packed Food Box</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Payment Summary */}
                  <View style={styles.paymentSummaryCard}>
                    <View style={styles.paymentSummaryHeading}>
                      <View style={styles.paymentSummaryIcon}>
                        <RupeeIcon size={23} color="#FDBA74" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.paymentSummaryTitle}>
                          Payment Summary
                        </Text>
                        <Text style={styles.paymentSummarySubtitle}>
                          Review your registration charges
                        </Text>
                      </View>
                    </View>
                    <View style={styles.paymentSummaryDivider} />
                    <FlatList
                      scrollEnabled={false}
                      data={[
                        { label: 'Registration fee', amount: getBaseFee() },
                        {
                          label: `Accompanying persons (${noOfAccompanying})`,
                          amount: accompanyingFee,
                        },
                        {
                          label: `SSTC courses (${selectedCourses.SSTC.length})`,
                          amount: sstcActivityFee,
                        },
                        {
                          label: `DSTC courses (${selectedCourses.DSTC.length})`,
                          amount: dstcActivityFee,
                        },
                        {
                          label: `TSTC courses (${selectedCourses.TSTC.length})`,
                          amount: tstcActivityFee,
                        },
                      ]}
                      keyExtractor={item => item.label}
                      renderItem={({ item }) => (
                        <View style={styles.payRowNavy}>
                          <Text style={styles.payRowNavyLabel}>
                            {item.label}
                          </Text>
                          <Text style={styles.payRowNavyValue}>
                            ₹ {item.amount.toLocaleString('en-IN')}
                          </Text>
                        </View>
                      )}
                    />

                    {/* TOTAL */}
                    <View style={styles.payRowNavyTotal}>
                      <Text style={styles.payTotalNavyLabel}>
                        Total payable
                      </Text>
                      <Text style={styles.payTotalNavyValue}>
                        ₹ {totalPayable.toLocaleString('en-IN')}
                      </Text>
                    </View>

                    {/* Payment Mode */}
                    <View style={styles.paymentModeSection}>
                      <View style={styles.paymentModeLabelCol}>
                        <Text style={styles.paymentModeText}>Payment mode</Text>
                      </View>

                      <View style={styles.paymentModeRadiosRow}>
                        <TouchableOpacity
                          style={[
                            styles.paymentModeRadioItem,
                            paymentMode === 'Online' &&
                              styles.paymentModeRadioItemActive,
                          ]}
                          onPress={() => setPaymentMode('Online')}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.payRadioOuter,
                              paymentMode === 'Online' &&
                                styles.payRadioOuterActive,
                            ]}
                          >
                            {paymentMode === 'Online' && (
                              <View style={styles.payRadioInner} />
                            )}
                          </View>
                          <Text style={styles.payRadioLabel}>Online</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.paymentModeRadioItem,
                            paymentMode === 'Offline' &&
                              styles.paymentModeRadioItemActive,
                          ]}
                          onPress={() => setPaymentMode('Offline')}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.payRadioOuter,
                              paymentMode === 'Offline' &&
                                styles.payRadioOuterActive,
                            ]}
                          >
                            {paymentMode === 'Offline' && (
                              <View style={styles.payRadioInner} />
                            )}
                          </View>
                          <Text style={styles.payRadioLabel}>Offline</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Captcha Section */}
                    <View style={styles.captchaSection}>
                      <Text style={styles.captchaHeaderLabel}>
                        Enter the contents of image
                      </Text>
                      <View style={styles.captchaControlRow}>
                        <Text style={styles.captchaColon}>:</Text>
                        <TouchableOpacity
                          style={styles.captchaCodeBox}
                          onPress={refreshCaptcha}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.captchaCodeText}>
                            {captchaCode}
                          </Text>
                        </TouchableOpacity>
                        <TextInput
                          style={styles.captchaInputBox}
                          value={captchaInput}
                          onFocus={() => {
                            captchaFocused.current = true;
                            registrationScrollRef.current?.scrollToEnd({
                              animated: true,
                            });
                          }}
                          onBlur={() => {
                            captchaFocused.current = false;
                          }}
                          onChangeText={setCaptchaInput}
                          placeholder=""
                          placeholderTextColor="#94A3B8"
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    {/* Submit / Pay Button */}
                    <TouchableOpacity
                      style={styles.payNowBtn}
                      activeOpacity={0.85}
                      onPress={() => {
                        if (
                          paymentMode === 'Offline' &&
                          (!delegateCategory || !delegateType)
                        ) {
                          const message = !delegateCategory
                            ? 'Please select delegate category.'
                            : 'Please select delegate type.';
                          if (Platform.OS === 'android')
                            ToastAndroid.show(message, ToastAndroid.SHORT);
                          else
                            Alert.alert('Delegate details required', message);
                          setActivePicker(
                            !delegateCategory ? 'category' : 'type',
                          );
                          return;
                        }
                        const captchaError =
                          paymentMode === 'Offline'
                            ? null
                            : !captchaInput.trim()
                            ? 'Please enter the captcha.'
                            : captchaInput.trim() !== captchaCode
                            ? 'Incorrect captcha. Please try again.'
                            : null;
                        if (captchaError) {
                          if (Platform.OS === 'android') {
                            ToastAndroid.show(captchaError, ToastAndroid.SHORT);
                          } else {
                            Alert.alert('Captcha required', captchaError);
                          }
                          return;
                        }
                        Keyboard.dismiss();
                        if (paymentMode === 'Online') {
                          setPaymentReviewVisible(true);
                        } else {
                          handleDownloadDoc(
                            'AIOC_2027_Offline_Registration',
                            `${doctorName} • Offline payment pending`,
                          );
                        }
                      }}
                    >
                      <Text style={styles.payNowBtnText}>
                        {paymentMode === 'Online'
                          ? 'PROCEED TO PAY ➔'
                          : 'SAVE AND PRINT'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                /* Success / Verified Slip Card */
                <View style={styles.successConfirmedCard}>
                  <View style={styles.successIconCircle}>
                    <CheckIcon size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.successTitle}>
                    Registration Confirmed!
                  </Text>
                  <Text style={styles.successSubtitle}>
                    Thank you, {doctorName}. Your seat is confirmed for AIOC
                    2027.
                  </Text>

                  <View style={styles.successDetailsBox}>
                    <View style={styles.successDetailRow}>
                      <Text style={styles.successDetailLabel}>
                        Registration ID:
                      </Text>
                      <Text style={styles.successDetailValue}>{regNo}</Text>
                    </View>
                    <View style={styles.successDetailRow}>
                      <Text style={styles.successDetailLabel}>Category:</Text>
                      <Text style={styles.successDetailValue}>
                        {regCategory}
                      </Text>
                    </View>
                    <View style={styles.successDetailRow}>
                      <Text style={styles.successDetailLabel}>
                        Institution:
                      </Text>
                      <Text style={styles.successDetailValue}>
                        {institution} ({orgType})
                      </Text>
                    </View>
                    <View style={styles.successDetailRow}>
                      <Text style={styles.successDetailLabel}>
                        Specialities:
                      </Text>
                      <Text style={styles.successDetailValue}>
                        {selectedSpecialities.join(', ')}
                      </Text>
                    </View>
                    <View style={styles.successDetailRow}>
                      <Text style={styles.successDetailLabel}>Total Paid:</Text>
                      <Text
                        style={[
                          styles.successDetailValue,
                          { color: '#0284C7', fontWeight: '800' },
                        ]}
                      >
                        ₹ {totalPayable.toLocaleString('en-IN')} (Incl. GST)
                      </Text>
                    </View>
                  </View>

                  <View style={styles.successActionsRow}>
                    <TouchableOpacity
                      style={styles.successDownloadBtn}
                      onPress={() =>
                        handleDownloadDoc('AIOC_2027_Registration_Confirmation')
                      }
                    >
                      <PrinterIcon size={16} color="#FFFFFF" />
                      <Text style={styles.successDownloadText}>
                        Download Slip (PDF)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.successShareBtn}
                      onPress={() =>
                        handleShareDoc(
                          'AIOC 2027 Registration Confirmed',
                          `Reg ID: ${regNo} | Amount: ₹ ${totalPayable}`,
                        )
                      }
                    >
                      <ShareIcon size={16} color="#0284C7" />
                      <Text style={styles.successShareText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Modal>
      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Payment Details</Text>
                <Text style={styles.modalSubtitle}>
                  AIOS Official Transaction Receipt
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPaymentModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 480 }}
            >
              <View style={styles.receiptContainer}>
                <View style={styles.receiptHeaderRow}>
                  <View style={styles.receiptStatusPill}>
                    <CheckIcon size={12} color="#FFFFFF" />
                    <Text style={styles.receiptStatusText}>
                      PAYMENT SUCCESSFUL
                    </Text>
                  </View>
                  <Text style={styles.receiptDate}>25 Sep 2026 • 10:42 AM</Text>
                </View>

                <View style={styles.receiptAmountBox}>
                  <Text style={styles.receiptAmountLabel}>
                    Total Amount Paid
                  </Text>
                  <Text style={styles.receiptAmountValue}>₹ 8,850.00</Text>
                  <Text style={styles.receiptTxnId}>
                    Txn ID: AIOS-MT26-TXN-94812
                  </Text>
                </View>

                <View style={styles.receiptTable}>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>Order ID</Text>
                    <Text style={styles.receiptTableValue}>ORD-MT26-0814</Text>
                  </View>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>Payer Name</Text>
                    <Text style={styles.receiptTableValue}>{doctorName}</Text>
                  </View>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>Member ID</Text>
                    <Text style={styles.receiptTableValue}>{memberId}</Text>
                  </View>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>Payment Mode</Text>
                    <Text style={styles.receiptTableValue}>
                      HDFC NetBanking / UPI
                    </Text>
                  </View>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>
                      Registration Fee
                    </Text>
                    <Text style={styles.receiptTableValue}>₹ 7,500.00</Text>
                  </View>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>
                      CGST + SGST (18%)
                    </Text>
                    <Text style={styles.receiptTableValue}>₹ 1,350.00</Text>
                  </View>
                  <View
                    style={[styles.receiptTableRow, { borderBottomWidth: 0 }]}
                  >
                    <Text style={styles.receiptTableLabel}>Bank Ref No</Text>
                    <Text style={styles.receiptTableValue}>REF-7102948172</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() =>
                  handleShareDoc(
                    'Payment Receipt',
                    'Total: ₹ 8,850.00 | Status: SUCCESSFUL',
                  )
                }
              >
                <ShareIcon size={16} color="#0284C7" />
                <Text style={styles.modalSecondaryBtnText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setPaymentModalVisible(false);
                  handleDownloadDoc('AIOS_Payment_Receipt_MT26');
                }}
              >
                <PrinterIcon size={16} color="#FFFFFF" />
                <Text style={styles.modalPrimaryBtnText}>
                  Print Invoice (PDF)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={printRegModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPrintRegModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Print Registration Detail</Text>
                <Text style={styles.modalSubtitle}>
                  Official Delegate Confirmation Slip
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPrintRegModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 480 }}
            >
              <View style={styles.slipCard}>
                <View style={styles.slipHeader}>
                  <Image
                    source={images.logo}
                    style={{ width: 34, height: 34 }}
                    resizeMode="contain"
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.slipSocietyName}>
                      ALL INDIA OPHTHALMOLOGICAL SOCIETY
                    </Text>
                    <Text style={styles.slipConfTitle}>
                      {isAnnual
                        ? 'AIOC 2027 Annual Conference'
                        : 'AIOC & Mid-Term Conference Portal'}
                    </Text>
                  </View>
                </View>

                <View style={styles.slipDivider} />

                <View style={styles.slipBarcodeRow}>
                  <View style={styles.barcodeVisual}>
                    <Text style={styles.barcodeLines}>
                      ||||| | |||| ||| | ||||| || ||||
                    </Text>
                    <Text style={styles.barcodeText}>{regNo}</Text>
                  </View>
                  <View style={styles.qrBadgeBox}>
                    <QrCodeIcon size={34} color="#0A1E3F" />
                  </View>
                </View>

                <View style={styles.slipDetailsGrid}>
                  <View style={styles.slipDetailItem}>
                    <Text style={styles.slipDetailLabel}>DELEGATE NAME</Text>
                    <Text style={styles.slipDetailValue}>{doctorName}</Text>
                  </View>
                  <View style={styles.slipDetailItem}>
                    <Text style={styles.slipDetailLabel}>AIOS MEMBER ID</Text>
                    <Text style={styles.slipDetailValue}>{memberId}</Text>
                  </View>
                  <View style={styles.slipDetailItem}>
                    <Text style={styles.slipDetailLabel}>CATEGORY</Text>
                    <Text
                      style={[
                        styles.slipDetailValue,
                        { color: '#0284C7', fontWeight: '800' },
                      ]}
                    >
                      {regCategory}
                    </Text>
                  </View>
                  <View style={styles.slipDetailItem}>
                    <Text style={styles.slipDetailLabel}>ORGANIZATION</Text>
                    <Text style={styles.slipDetailValue}>
                      {institution} ({orgType})
                    </Text>
                  </View>
                  <View style={styles.slipDetailItem}>
                    <Text style={styles.slipDetailLabel}>SPECIALITY</Text>
                    <Text style={styles.slipDetailValue}>
                      {selectedSpecialities.join(', ')}
                    </Text>
                  </View>
                </View>

                <View style={styles.slipNoticeBox}>
                  <Text style={styles.slipNoticeText}>
                    Please show this confirmation slip at the registration desk
                    for physical badge and kit collection.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() =>
                  handleShareDoc('Registration Slip', `Reg No: ${regNo}`)
                }
              >
                <ShareIcon size={16} color="#0284C7" />
                <Text style={styles.modalSecondaryBtnText}>Share Slip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setPrintRegModalVisible(false);
                  handleDownloadDoc('AIOS_Registration_Slip');
                }}
              >
                <PrinterIcon size={16} color="#FFFFFF" />
                <Text style={styles.modalPrimaryBtnText}>Print / Save PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={accommodationInfoModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAccommodationInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Accommodation Booking</Text>
                <Text style={styles.modalSubtitle}>
                  Venue & Partner Hotels Status
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setAccommodationInfoModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 460 }}
            >
              <View style={styles.closedNoticeBox}>
                <BedIcon size={24} color="#EA580C" />
                <Text style={styles.closedNoticeTitle}>
                  Official Booking Closed
                </Text>
                <Text style={styles.closedNoticeText}>
                  Rooms at the primary venue have reached full capacity. Contact
                  secretariat desk for spot assistance.
                </Text>
              </View>

              <Text style={styles.partnerHotelsHeading}>
                Recommended Partner Hotels:
              </Text>

              <View style={styles.partnerHotelItem}>
                <Text style={styles.partnerHotelName}>
                  1. Radisson Blu Hotel
                </Text>
                <Text style={styles.partnerHotelDetail}>
                  Main Road (approx. 2.4 km from venue)
                </Text>
                <Text style={styles.partnerHotelPhone}>
                  📞 Contact: +91 651 660 2222
                </Text>
              </View>

              <View style={styles.partnerHotelItem}>
                <Text style={styles.partnerHotelName}>
                  2. Hotel Capitol Hill
                </Text>
                <Text style={styles.partnerHotelDetail}>
                  MG Marg (approx. 1.8 km from venue)
                </Text>
                <Text style={styles.partnerHotelPhone}>
                  📞 Contact: +91 651 233 1331
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setAccommodationInfoModalVisible(false);
                  handleWhatsApp();
                }}
              >
                <WhatsAppIcon size={18} color="#FFFFFF" />
                <Text style={styles.modalPrimaryBtnText}>
                  Contact Secretariat Desk
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={accommodationReceiptModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAccommodationReceiptModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Accommodation Receipt</Text>
                <Text style={styles.modalSubtitle}>
                  Hotel Booking Voucher & Payment
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setAccommodationReceiptModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 460 }}
            >
              <View style={styles.receiptContainer}>
                <View style={styles.receiptHeaderRow}>
                  <View
                    style={[
                      styles.receiptStatusPill,
                      { backgroundColor: '#0284C7' },
                    ]}
                  >
                    <CheckIcon size={12} color="#FFFFFF" />
                    <Text style={styles.receiptStatusText}>
                      BOOKING CONFIRMED
                    </Text>
                  </View>
                  <Text style={styles.receiptDate}>
                    Voucher # ACC-MT26-0219
                  </Text>
                </View>

                <View style={styles.receiptAmountBox}>
                  <Text style={styles.receiptAmountLabel}>
                    Total Paid (2 Nights)
                  </Text>
                  <Text style={styles.receiptAmountValue}>₹ 12,000.00</Text>
                  <Text style={styles.receiptTxnId}>{conferenceLocation}</Text>
                </View>

                <View style={styles.receiptTable}>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>Guest Name</Text>
                    <Text style={styles.receiptTableValue}>{doctorName}</Text>
                  </View>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>Room Type</Text>
                    <Text style={styles.receiptTableValue}>
                      Deluxe Double Room
                    </Text>
                  </View>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>
                      Check-in / Check-out
                    </Text>
                    <Text style={styles.receiptTableValue}>
                      {conferenceDates}
                    </Text>
                  </View>
                  <View
                    style={[styles.receiptTableRow, { borderBottomWidth: 0 }]}
                  >
                    <Text style={styles.receiptTableLabel}>
                      Confirmation Code
                    </Text>
                    <Text
                      style={[
                        styles.receiptTableValue,
                        { fontWeight: '800', color: '#0A1E3F' },
                      ]}
                    >
                      BNR-CONF-9281
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() =>
                  handleShareDoc('Hotel Booking Voucher', 'Conf: BNR-CONF-9281')
                }
              >
                <ShareIcon size={16} color="#0284C7" />
                <Text style={styles.modalSecondaryBtnText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setAccommodationReceiptModalVisible(false);
                  handleDownloadDoc('AIOS_Hotel_Voucher');
                }}
              >
                <PrinterIcon size={16} color="#FFFFFF" />
                <Text style={styles.modalPrimaryBtnText}>
                  Print Voucher (PDF)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={invitationLetterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setInvitationLetterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Print Invitation Letter</Text>
                <Text style={styles.modalSubtitle}>
                  Official AIOS Conference Invitation
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setInvitationLetterModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 480 }}
            >
              <View style={styles.letterheadFrame}>
                <View style={styles.letterheadTop}>
                  <Image
                    source={images.logo}
                    style={{ width: 38, height: 38 }}
                    resizeMode="contain"
                  />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.letterheadTitle}>
                      ALL INDIA OPHTHALMOLOGICAL SOCIETY
                    </Text>
                    <Text style={styles.letterheadSub}>
                      Secretariat: AIOS Headquarters, New Delhi
                    </Text>
                  </View>
                </View>

                <View style={styles.letterheadGoldLine} />

                <View style={styles.letterMetaRow}>
                  <Text style={styles.letterMetaText}>
                    Ref: AIOS/INV-2027/0482
                  </Text>
                  <Text style={styles.letterMetaText}>
                    Date: 15 August 2026
                  </Text>
                </View>

                <Text style={styles.letterRecipient}>
                  To,{'\n'}
                  <Text style={{ fontWeight: '800' }}>{doctorName}</Text>
                  {'\n'}
                  Member ID: {memberId}
                  {'\n'}
                  Category: {regCategory}
                </Text>

                <Text style={styles.letterSalutation}>Dear Doctor,</Text>

                <Text style={styles.letterBody}>
                  On behalf of the All India Ophthalmological Society (AIOS), we
                  have the honor of inviting you to participate in the upcoming
                  AIOS conferences. Your participation will contribute immensely
                  to the scientific deliberations and clinical exchange.
                </Text>

                <View style={styles.letterSigBlock}>
                  <View style={{ alignItems: 'flex-start' }}>
                    <Text style={styles.letterSigName}>
                      Dr. President, AIOS
                    </Text>
                    <Text style={styles.letterSigDesig}>President, AIOS</Text>
                  </View>
                  <View style={styles.letterSeal}>
                    <AwardMedalIcon size={18} color="#D97706" />
                    <Text
                      style={{
                        fontSize: 7,
                        fontWeight: '800',
                        color: '#D97706',
                      }}
                    >
                      SEAL
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.letterSigName}>
                      Dr. Hon. Gen. Secretary
                    </Text>
                    <Text style={styles.letterSigDesig}>
                      General Secretary, AIOS
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() =>
                  handleShareDoc('Official AIOS Invitation Letter')
                }
              >
                <ShareIcon size={16} color="#0284C7" />
                <Text style={styles.modalSecondaryBtnText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setInvitationLetterModalVisible(false);
                  handleDownloadDoc('AIOS_Invitation_Letter');
                }}
              >
                <PrinterIcon size={16} color="#FFFFFF" />
                <Text style={styles.modalPrimaryBtnText}>
                  Print Letter (PDF)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={certModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCertModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.certCanvasContainer}>
            <View style={styles.certModalHeader}>
              <View style={styles.verifiedHeaderBadge}>
                <VerifiedBadgeIcon size={14} color="#10B981" />
                <Text style={styles.verifiedHeaderText}>
                  OFFICIAL AIOS CREDENTIAL
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setCertModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.certDocumentFrame}>
                <View style={styles.certTopRow}>
                  <Image
                    source={images.logo}
                    style={{ width: 42, height: 42 }}
                    resizeMode="contain"
                  />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.certHeadingText}>
                      ALL INDIA OPHTHALMOLOGICAL SOCIETY
                    </Text>
                    <Text style={styles.certSubheadingText}>
                      Established 1930 • From Darkness to Light
                    </Text>
                  </View>
                </View>

                <View style={styles.certGoldLine} />

                <Text style={styles.certTitleText}>
                  {certCategory === 'Faculty'
                    ? 'CERTIFICATE OF APPRECIATION'
                    : 'CERTIFICATE OF PARTICIPATION'}
                </Text>

                <Text style={styles.certPresentedText}>
                  This is proudly presented to
                </Text>
                <Text style={styles.certRecipientName}>
                  {selectedCert?.recipientName}
                </Text>

                <Text style={styles.certBodyText}>
                  {certCategory === 'Faculty'
                    ? `in grateful appreciation for distinguished contribution and valuable service as Faculty in the ${
                        selectedCert?.title || conferenceTitle
                      } held at ${
                        selectedCert?.location || conferenceLocation
                      } (${selectedCert?.year || conferenceYear}).`
                    : `for active and distinguished participation as a Delegate in the ${
                        selectedCert?.title || conferenceTitle
                      } held at ${
                        selectedCert?.location || conferenceLocation
                      } (${selectedCert?.year || conferenceYear}).`}
                </Text>

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

                <Text style={styles.certDocId}>
                  Document ID: AIOS-{isAnnual ? 'ANNUAL' : 'MIDTERM'}-
                  {selectedCert?.year || conferenceYear}-
                  {selectedCert?.memberId}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() =>
                  Share.share({
                    title: selectedCert?.title,
                    message: `${selectedCert?.title} - ${certCategory}\nIssued to: ${selectedCert?.recipientName} (${selectedCert?.memberId})\n${selectedCert?.location} • ${selectedCert?.year}`,
                  })
                }
              >
                <ShareIcon size={16} color="#0284C7" />
                <Text style={styles.modalSecondaryBtnText}>Share Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={handleDownloadSelectedCertificate}
                disabled={certificateDownloading}
              >
                <DocumentIcon size={16} color="#FFFFFF" />
                <Text style={styles.modalPrimaryBtnText}>
                  {certificateDownloading ? 'Downloading…' : 'Download PDF'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Generic Select Picker Modal */}
      <Modal
        visible={activePicker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActivePicker(null)}
      >
        <TouchableOpacity
          style={styles.pickerModalOverlay}
          activeOpacity={1}
          onPress={() => setActivePicker(null)}
        >
          <View style={styles.pickerModalCard}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>
                {activePicker === 'category'
                  ? 'Select Delegate Category'
                  : activePicker === 'type'
                  ? 'Select Delegate Type'
                  : 'Select No. of Accompanying Persons'}
              </Text>
              <TouchableOpacity
                onPress={() => setActivePicker(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CloseIcon size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
            <FlatList
              style={{ maxHeight: 300 }}
              keyboardShouldPersistTaps="handled"
              data={
                activePicker === 'category'
                  ? DELEGATE_CATEGORIES
                  : activePicker === 'type'
                  ? DELEGATE_TYPES
                  : ACCOMPANYING_OPTIONS
              }
              keyExtractor={opt => opt}
              extraData={{
                activePicker,
                delegateCategory,
                delegateType,
                noOfAccompanying,
              }}
              renderItem={({ item: opt }) => {
                const isSelected =
                  activePicker === 'category'
                    ? delegateCategory === opt
                    : activePicker === 'type'
                    ? delegateType === opt
                    : String(noOfAccompanying) === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.pickerOptionItem,
                      isSelected && styles.pickerOptionItemActive,
                    ]}
                    onPress={() => {
                      if (activePicker === 'category') setDelegateCategory(opt);
                      else if (activePicker === 'type') setDelegateType(opt);
                      else setNoOfAccompanying(parseInt(opt, 10) || 0);
                      setActivePicker(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        isSelected && styles.pickerOptionTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                    {isSelected && <CheckIcon size={16} color="#0284C7" />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  registrationClosedCard: {
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 6,
    backgroundColor: '#1689BE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  registrationClosedIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F5A021',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registrationClosedText: {
    flex: 1,
    fontSize: 22,
    lineHeight: 25,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  facultyCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
  },
  facultyYearBadge: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  facultyYearText: {
    color: '#1D4ED8',
    fontSize: 12,
  },
  facultyFooter: {
    borderTopColor: '#EFF6FF',
    marginTop: 12,
    paddingTop: 12,
  },
  facultyCategoryBadge: {
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  facultyHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  facultyMedal: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facultyEyebrow: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.7,
    fontWeight: '700',
    color: '#92400E',
  },
  facultyYearLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  facultyRecipient: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
    color: '#0A1E3F',
    marginBottom: 6,
  },
  facultyConference: {
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
  },
  facultyLocationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginTop: 6,
  },
  facultyLocation: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: '#64748B',
  },
  facultyViewButton: {
    backgroundColor: '#0A1E3F',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 16,
  },
  facultyArrow: {
    marginLeft: 'auto',
    fontSize: 18,
    color: '#FFFFFF',
  },
  annualActionBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#168BC1',
    borderRadius: 10,
    padding: 14,
    minHeight: 76,
    marginBottom: 10,
  },
  certificateNameFilter: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  certificateSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    marginBottom: 14,
  },
  certificateFilterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 7,
  },
  certificateResultsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  certificatePersonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  certificatePersonDetails: {
    flex: 1,
    minWidth: 0,
  },
  certificateRowFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  certificateCategoryBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#E2E8F0',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 6,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: colors.white,
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
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 3,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  bannerWrapper: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  /* Prominent Hero AIOC Registration Button (Matching Image 1) */
  aiocHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#0284C7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  aiocHeroIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  aiocHeroTextCol: {
    flex: 1,
  },
  aiocHeroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  aiocHeroYear: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  aiocHeroActionTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  aiocHeroActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* 6 Buttons Grid */
  actionGridContainer: {
    marginBottom: 16,
    gap: 8,
  },
  actionGridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    minHeight: 58,
    gap: 8,
    shadowColor: '#0284C7',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtnText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14.5,
  },

  /* Midterm Certificates Card */
  certCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  certCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  certIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certCategoryToggle: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  certCategoryRow: {
    gap: 4,
  },
  certCategoryChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 9,
  },
  certCategoryChipFaculty: {
    backgroundColor: '#0A1E3F',
  },
  certCategoryChipDelegate: {
    backgroundColor: '#0A1E3F',
  },
  certCategoryChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  certCategoryChipTextActive: {
    color: '#FFFFFF',
  },
  certItemRow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  certYearCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  certYearText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  certItemTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  certItemSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
    marginTop: 2,
  },
  viewCertBtn: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },
  viewCertBtnFaculty: {
    backgroundColor: '#0A1E3F',
  },
  viewCertBtnDelegate: {
    backgroundColor: '#0A1E3F',
  },
  viewCertBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Info & Support */
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircleOrange: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconCircleBlue: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsAppBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aiocFormContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  aiocFormNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0A1E3F',
    borderBottomWidth: 1,
    borderBottomColor: '#162C54',
  },
  backToDashboardBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backToDashboardText: {
    color: '#60A5FA',
    fontSize: 13,
    fontWeight: '700',
  },
  aiocBadge: {
    backgroundColor: '#D97706',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  aiocBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  aiocFormScroll: {
    flex: 1,
  },
  aiocFormScrollContent: {
    padding: 16,
  },

  /* Member Summary Strip */
  memberSummaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  memberAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberStripName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  memberStripMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  verifiedTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },

  /* Section Cards */
  aiocSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formRow2Col: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  formCol: {
    flex: 1,
    minWidth: 0,
  },
  institutionColumn: {
    flex: 1.4,
  },
  institutionPlaceholderInput: {
    fontSize: 11,
    paddingHorizontal: 6,
  },
  formFullWidth: {
    width: '100%',
    marginBottom: 12,
  },
  formDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  aiocFieldLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 6,
  },
  hintSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  aiocTextInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 9 : 7,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
    minHeight: 38,
    width: '100%',
  },

  /* Select Box Dropdown (Matching Native Select) */
  selectBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 9 : 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 38,
  },
  selectBoxText: {
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '500',
    flex: 1,
    marginRight: 6,
  },
  selectBoxPlaceholder: {
    color: '#64748B',
  },

  /* Form Section Divider */
  formSectionDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },

  /* Accompanying Persons Box */
  accompanyingContainer: {
    marginBottom: 4,
  },
  accompanyingSubtext: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 16,
  },
  accompanyingControlRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  accompanyingFieldLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#000000',
    marginTop: 6,
  },
  accompanyingNameField: {
    width: '48%',
    marginBottom: 12,
  },
  accompanyingCountField: {
    width: '48%',
  },
  accompanyingNamesGrid: {
    marginTop: 12,
  },
  accompanyingNamesRow: {
    justifyContent: 'space-between',
  },
  accompanyingInputBox: {
    width: '100%',
    minHeight: 38,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accompanyingInputText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* Extra Scientific Activities */
  extraActivityTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 10,
    lineHeight: 18,
  },
  extraActivitiesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  extraActivityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    minHeight: 66,
    gap: 10,
  },
  extraActivityHeaderActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FB923C',
  },
  extraActivityBtnActive: {
    backgroundColor: '#FF8838',
  },
  extraActivityIndicator: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraActivityDropdown: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    marginBottom: 18,
    gap: 8,
  },
  extraActivityDropdownHeader: {
    paddingBottom: 12,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  extraActivityDropdownTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0A1E3F',
  },
  extraActivityCourse: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    minHeight: 48,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  extraActivityCourseActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
  },
  extraActivityCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraActivityCheckboxActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  extraActivityCourseText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 21,
    color: '#1E293B',
  },
  extraActivityCourseTextActive: {
    color: '#9A3412',
    fontWeight: '600',
  },
  extraActivityPlus: {
    fontSize: 15,
    fontWeight: '900',
    color: '#334155',
  },
  extraActivityPlusActive: {
    color: '#FFFFFF',
  },
  extraActivityText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  extraActivityTextActive: {
    color: '#FFFFFF',
  },

  /* Radio Group Vertical */
  radioGroupVertical: {
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },

  /* Generic Picker Modal */
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 30, 63, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerModalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 8,
  },
  pickerModalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  pickerOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  pickerOptionItemActive: {
    backgroundColor: '#F0F9FF',
  },
  pickerOptionText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  pickerOptionTextActive: {
    color: '#0284C7',
    fontWeight: '700',
  },

  /* Radio Buttons */
  radioGroupRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 4,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioOuterActive: {
    borderColor: '#0284C7',
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#0284C7',
  },
  radioLabel: {
    fontSize: 12.5,
    color: '#1E293B',
    fontWeight: '600',
  },

  /* Speciality Checkboxes */
  specialityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectionCount: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  specialityGrid: {
    gap: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkboxRowActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  checkboxSquare: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxSquareActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  checkboxLabelActive: {
    color: '#0369A1',
    fontWeight: '700',
  },

  /* Category Chips */
  catChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    width: '48.5%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0284C7',
  },
  catChipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  catChipTitleActive: {
    color: '#0284C7',
  },
  catChipFee: {
    fontSize: 13,
    fontWeight: '900',
    color: '#64748B',
    marginTop: 4,
  },
  catChipFeeActive: {
    color: '#0A1E3F',
  },

  /* Accompanying Persons */
  accompanyingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
    gap: 8,
  },
  counterStepBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterStepText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  counterNum: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0A1E3F',
    minWidth: 20,
    textAlign: 'center',
  },

  /* SSTC Options */
  sstcOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 6,
  },
  sstcOptionRowActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  sstcOptionTitle: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  sstcOptionFee: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },

  /* Banquet & Meal */
  banquetToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  banquetLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  mealChoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  mealChoiceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },

  /* Payment summary */
  paymentSummaryCard: {
    backgroundColor: '#0A1E3F',
    borderRadius: 16,
    padding: 18,
    marginTop: 6,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  paymentSummaryTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  paymentSummaryHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  paymentSummaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#203452',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentSummarySubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#94A3B8',
  },
  paymentSummaryDivider: {
    height: 1,
    backgroundColor: '#2A3E5C',
    marginBottom: 8,
  },
  payRowNavy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 12,
  },
  payRowNavyLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  payRowNavyValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  payRowNavyTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    padding: 14,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#203452',
    borderWidth: 1,
    borderColor: '#38516E',
  },
  payTotalNavyLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  payTotalNavyValue: {
    fontSize: 23,
    fontWeight: '800',
    color: '#FDBA74',
    fontVariant: ['tabular-nums'],
  },
  paymentModeSection: {
    marginTop: 22,
    marginBottom: 16,
  },
  paymentModeLabelCol: {
    marginBottom: 10,
  },
  paymentModeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  paymentModeRadiosRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  paymentModeRadioItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#38516E',
    borderRadius: 10,
    backgroundColor: '#142B4B',
  },
  paymentModeRadioItemActive: {
    borderColor: '#FDBA74',
    backgroundColor: '#203452',
  },
  payRadioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payRadioOuterActive: {
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  payRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#273C75',
  },
  payRadioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  captchaSection: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  captchaHeaderLabel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  captchaControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  captchaColon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  captchaCodeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 5,
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  captchaCodeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
    fontStyle: 'italic',
    letterSpacing: 2,
    textDecorationLine: 'line-through',
  },
  captchaInputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    height: 36,
    width: 130,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: 'bold',
  },
  payNowBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 6,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  payNowBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },

  /* Success Confirmed Card */
  successConfirmedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  successIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0A1E3F',
  },
  successSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  successDetailsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    marginBottom: 16,
  },
  successDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  successDetailLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  successDetailValue: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0A1E3F',
    flex: 1,
    textAlign: 'right',
  },
  successActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  successDownloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  successDownloadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  successShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  successShareText: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '700',
  },

  /* Modals Base */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 30, 63, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalSheet: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  modalPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingVertical: 11,
    gap: 6,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  modalSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 6,
  },
  modalSecondaryBtnText: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '700',
  },

  /* Receipt Modal Styles */
  receiptContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
  },
  receiptHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  receiptStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  receiptStatusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  receiptDate: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  receiptAmountBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  receiptAmountLabel: {
    fontSize: 10,
    color: '#0369A1',
    fontWeight: '700',
  },
  receiptAmountValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0A1E3F',
    marginVertical: 2,
  },
  receiptTxnId: {
    fontSize: 10,
    color: '#64748B',
  },
  receiptTable: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  receiptTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  receiptTableLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  receiptTableValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* Slip Styles */
  slipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  slipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slipSocietyName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  slipConfTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0284C7',
    marginTop: 2,
  },
  slipDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  slipBarcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  barcodeVisual: {
    flex: 1,
  },
  barcodeLines: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#0F172A',
  },
  barcodeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
    marginTop: 2,
  },
  qrBadgeBox: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slipDetailsGrid: {
    gap: 8,
  },
  slipDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  slipDetailLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
  },
  slipDetailValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A1E3F',
  },
  slipNoticeBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 6,
    padding: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  slipNoticeText: {
    fontSize: 10,
    color: '#B45309',
    lineHeight: 14,
  },

  /* Accommodation Notices & Partner Hotels */
  closedNoticeBox: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  closedNoticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#EA580C',
    marginTop: 6,
    marginBottom: 4,
  },
  closedNoticeText: {
    fontSize: 11,
    color: '#9A3412',
    textAlign: 'center',
    lineHeight: 16,
  },
  partnerHotelsHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A1E3F',
    marginBottom: 8,
  },
  partnerHotelItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  partnerHotelName: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  partnerHotelDetail: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  partnerHotelPhone: {
    fontSize: 10.5,
    color: '#0284C7',
    fontWeight: '700',
    marginTop: 3,
  },

  /* Letterhead Styles */
  letterheadFrame: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 14,
  },
  letterheadTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  letterheadTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0A1E3F',
    textAlign: 'center',
  },
  letterheadSub: {
    fontSize: 8.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 1,
  },
  letterheadGoldLine: {
    height: 1.5,
    backgroundColor: '#D97706',
    marginVertical: 10,
  },
  letterMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  letterMetaText: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
  },
  letterRecipient: {
    fontSize: 11,
    color: '#1E293B',
    lineHeight: 16,
    marginBottom: 10,
  },
  letterSalutation: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A1E3F',
    marginBottom: 8,
  },
  letterBody: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 16,
    marginBottom: 8,
  },
  letterSigBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  letterSigName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  letterSigDesig: {
    fontSize: 8.5,
    color: '#64748B',
  },
  letterSeal: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Certificate Preview Modal */
  certCanvasContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  certModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verifiedHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  verifiedHeaderText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#065F46',
  },
  certDocumentFrame: {
    backgroundColor: '#FCFCF9',
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  certTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  certHeadingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0A1E3F',
    textAlign: 'center',
  },
  certSubheadingText: {
    fontSize: 8.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 1,
  },
  certGoldLine: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#D4AF37',
    marginVertical: 10,
  },
  certTitleText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 6,
  },
  certPresentedText: {
    fontSize: 10,
    color: '#64748B',
    fontStyle: 'italic',
  },
  certRecipientName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0A1E3F',
    marginVertical: 4,
    textAlign: 'center',
  },
  certBodyText: {
    fontSize: 10,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 15,
    marginVertical: 6,
    paddingHorizontal: 6,
  },
  certSignaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
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
    fontSize: 9,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  certSigSub: {
    fontSize: 7.5,
    color: '#64748B',
  },
  certSealCenter: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  certSealCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
  },
  certSealText: {
    fontSize: 6,
    fontWeight: '800',
    color: '#D97706',
  },
  certDocId: {
    fontSize: 8,
    color: '#94A3B8',
    marginTop: 10,
  },
});

export default MidTermScreen;
