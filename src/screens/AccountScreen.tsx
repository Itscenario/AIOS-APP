import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import { LogoutConfirmation } from '../components/LogoutConfirmation';
import { Toast, ToastNotification } from '../components/Toast';
import { PaymentInformation } from '../components/PaymentInformation';
import { formatProfileName } from '../utils/profileName';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { images } from '../constants/images';
import { useAppSelector, useAppDispatch, updateProfile, logout } from '../store';
import type { RootStackParamList } from '../navigation/types';
import {
  ArrowBackIcon,
  BellIcon,
  LockIcon,
  BookOpenIcon,
  LogoutIcon,
  CheckIcon,
  ShieldCheckIcon,
  PersonIcon,
  DocumentIcon,
  CloseIcon,
  ChevronDownIcon,
  EditPencilIcon,
} from '../components/Icons';
import { pickDocumentFile } from '../components/FilePicker';

export interface QualificationItem {
  id: string;
  degree: string;
  university: string;
  yearOfPassing: string;
  fileName: string;
}

export interface GoGreenPublication {
  id: string;
  title: string;
}

export const GO_GREEN_PUBLICATIONS: GoGreenPublication[] = [
  { id: 'ijo', title: 'Indian Journal of Ophthalmology' },
  { id: 'proceedings', title: 'AIOS Proceedings' },
  { id: 'abstract_book', title: 'Abstract Book of Annual Conference' },
  { id: 'cme_series', title: 'AIOS CME Series' },
  { id: 'news', title: 'AIOS News' },
  { id: 'times', title: 'AIOS Times - Bulletin of AIOS' },
];

export type GoGreenOption = 'hard_copy' | 'online' | 'both';

type PreferencePage = 'green' | 'privacy' | 'speciality';
export const AccountScreen: React.FC<{ preferencePage?: PreferencePage }> = ({ preferencePage }) => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const savedProfile = useAppSelector(state => state.auth.profile);
  const profile = savedProfile?.membershipId?.match(/^LM-\d+$/)
    ? { ...savedProfile, membershipId: undefined }
    : savedProfile;
  const dispatch = useAppDispatch();


  const [logoutVisible, setLogoutVisible] = useState(false);
  const handleLogout = () => setLogoutVisible(true);

  // Profile edit modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState('Dr.');
  const [editFirstName, setEditFirstName] = useState('');
  const [editSurname, setEditSurname] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');

  const currentDoctorName = profile
    ? formatProfileName(
        profile.name ||
          [profile.title, profile.firstName, profile.surname]
            .filter(Boolean)
            .join(' ') ||
          '',
      )
    : '';

  const currentMemberSub = profile?.membershipId
    ? `All India Ophthalmological Society • ${profile.membershipId}`
    : profile
    ? 'All India Ophthalmological Society • Member'
    : '';

  const currentAvatarUri = profile?.avatar || null;

  const handleSaveProfile = () => {
    const fullName = `${editTitle} ${editFirstName} ${editSurname}`.trim();
    dispatch(
      updateProfile({
        title: editTitle,
        firstName: editFirstName,
        surname: editSurname,
        name: fullName,
        phone: editPhone,
        email: editEmail,
        city: editCity,
        state: editState,
      }),
    );
    setEditModalVisible(false);
    Alert.alert('Success', 'Profile details updated successfully.');
  };

  const [passportNo, setPassportNo] = useState('');
  const [institution, setInstitution] = useState('');
  const [orgType, setOrgType] = useState<'Govt' | 'Private' | null>(null);

  const [qualifications, setQualifications] = useState<QualificationItem[]>([
    {
      id: '1',
      degree: '',
      university: '',
      yearOfPassing: '',
      fileName: '',
    },
  ]);

  const handleAddDegree = () => {
    const newId = (qualifications.length + 1).toString();
    setQualifications(prev => [
      ...prev,
      {
        id: newId,
        degree: '',
        university: '',
        yearOfPassing: '',
        fileName: '',
      },
    ]);
  };

  const handleDeleteDegree = (indexToRemove?: number) => {
    if (qualifications.length <= 1) {
      Alert.alert('Notice', 'At least one qualification entry is required.');
      return;
    }
    if (typeof indexToRemove === 'number') {
      setQualifications(prev => prev.filter((_, idx) => idx !== indexToRemove));
    } else {
      setQualifications(prev => prev.slice(0, prev.length - 1));
    }
  };

  const updateQualification = (
    index: number,
    field: keyof QualificationItem,
    value: string,
  ) => {
    setQualifications(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handlePickDegreeFile = async (index: number) => {
    try {
      const file = await pickDocumentFile();
      if (file) {
        updateQualification(index, 'fileName', file.name);
      }
    } catch {
      Alert.alert(
        'File Selection',
        'Unable to pick document. Please try again.',
      );
    }
  };

  const [photoFileName, setPhotoFileName] = useState('');
  const [signatureFileName, setSignatureFileName] = useState('');

  const [stateRegistrar, setStateRegistrar] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [regCertFileName, setRegCertFileName] = useState('');

  const handlePickPhoto = async () => {
    try {
      const file = await pickDocumentFile();
      if (file) {
        setPhotoFileName(file.name);
      }
    } catch {}
  };

  const handlePickSignature = async () => {
    try {
      const file = await pickDocumentFile();
      if (file) {
        setSignatureFileName(file.name);
      }
    } catch {}
  };

  const handlePickRegCert = async () => {
    try {
      const file = await pickDocumentFile();
      if (file) {
        setRegCertFileName(file.name);
      }
    } catch {}
  };

  const [specialities, setSpecialities] = useState<string[]>(profile?.specialities || []);

  const [goGreenSelections, setGoGreenSelections] = useState<
    Record<string, GoGreenOption>
  >(profile?.publicationPreferences || {});

  const handleSelectGoGreen = (pubId: string, option: GoGreenOption) => {
    setGoGreenSelections(prev => ({
      ...prev,
      [pubId]: option,
    }));
  };

  const [mobileConsent, setMobileConsent] = useState<
    'office_only' | 'can_be_shared' | ''
  >(profile?.contactPrivacy?.mobile || 'office_only');
  const [emailConsent, setEmailConsent] = useState<
    'office_only' | 'can_be_shared' | ''
  >(profile?.contactPrivacy?.email || 'office_only');

  const [proposerMembershipNo, setProposerMembershipNo] = useState('');
  const [proposerName, setProposerName] = useState('');
  const [proposerMobile, setProposerMobile] = useState('');
  const [proposerEmail, setProposerEmail] = useState('');
  const [proposerConsent, setProposerConsent] = useState(false);

  const [seconderMembershipNo, setSeconderMembershipNo] = useState('');
  const [seconderName, setSeconderName] = useState('');
  const [seconderMobile, setSeconderMobile] = useState('');
  const [seconderEmail, setSeconderEmail] = useState('');
  const [seconderConsent, setSeconderConsent] = useState(false);
  const [lifeMemberDeclaration, setLifeMemberDeclaration] = useState(false);
  const [fbsAcknowledgements, setFbsAcknowledgements] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [fbsInterest, setFbsInterest] = useState<
    'interested' | 'not_interested' | null
  >(null);

  const GOV_ID_OPTIONS = [
    'Voter ID Card',
    'Aadhaar Card',
    'Passport',
    'PAN Card',
    'Driving License',
  ];
  const [govIdType, setGovIdType] = useState('Voter ID Card');
  const [govIdFile, setGovIdFile] = useState('');
  const [govIdModalVisible, setGovIdModalVisible] = useState(false);

  const handlePickGovIdFile = async () => {
    try {
      const file = await pickDocumentFile();
      if (file) {
        setGovIdFile(file.name);
      }
    } catch {
      // Ignored
    }
  };

  const [captchaInput, setCaptchaInput] = useState('');
  const formScroll = useRef<React.ElementRef<typeof ScrollView>>(null);
  const formViewport = useRef<React.ElementRef<typeof View>>(null);
  const captchaFocused = useRef(false);
  const keyboardTop = useRef<number | null>(null);
  const [keyboardOverlap, setKeyboardOverlap] = useState(0);
  const updateScrollSpace = () => {
    formViewport.current?.measureInWindow((_x, y, _width, height) => {
      setKeyboardOverlap(
        Platform.OS === 'android' && keyboardTop.current !== null
          ? Math.max(0, y + height - keyboardTop.current)
          : 0,
      );
      if (captchaFocused.current)
        requestAnimationFrame(() =>
          formScroll.current?.scrollToEnd({ animated: true }),
        );
    });
  };
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', event => {
      keyboardTop.current = event.endCoordinates.screenY;
      requestAnimationFrame(updateScrollSpace);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      keyboardTop.current = null;
      setKeyboardOverlap(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  const [captchaCode, setCaptchaCode] = useState('5b33m');

  const ALL_SPECIALITIES = [
    'Glaucoma',
    'Retina & Vitreous',
    'Cornea',
    'Cataract & IOL',
    'Refractive Surgery',
    'Pediatric & Strabismus',
  ];

  const toggleSpeciality = (item: string) => {
    if (specialities.includes(item)) {
      setSpecialities(specialities.filter(s => s !== item));
    } else {
      if (specialities.length >= 3) {
        Alert.alert('Maximum Limit', 'You can select up to 3 specialities.');
        return;
      }
      setSpecialities([...specialities, item]);
    }
  };

  const refreshCaptcha = () => {
    const chars = '23456789abcdefghkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [paymentInformationVisible, setPaymentInformationVisible] =
    useState(false);
  const showToast = (message: string) => {
    setToast(previous => ({
      message,
      id: (previous?.id || 0) + 1,
      type: 'error',
    }));
  };

  const handlePayNow = () => {
    const requiredFields: [string, string][] = [
      ['Passport Number', passportNo],
      ['Institute / Organization', institution],
      ['Type of Organization', orgType || ''],
      ['Passport-size Photograph', photoFileName],
      ['Signature', signatureFileName],
      ['State Medical Registrar', stateRegistrar],
      ['Medical Registration Number', registrationNo],
      ['Registration Certificate', regCertFileName],
      ['Proposer Membership Number', proposerMembershipNo],
      ['Proposer Name', proposerName],
      ['Proposer Mobile', proposerMobile],
      ['Proposer Email', proposerEmail],
      ['Seconder Membership Number', seconderMembershipNo],
      ['Seconder Name', seconderName],
      ['Seconder Mobile', seconderMobile],
      ['Seconder Email', seconderEmail],
      ['Government ID Type', govIdType],
      ['Government ID Proof', govIdFile],
    ];
    const missing = requiredFields.find(([, value]) => !value.trim());
    if (missing) {
      showToast(`Please complete ${missing[0]}.`);
      return;
    }
    if (
      !qualifications.length ||
      qualifications.some(
        item =>
          !item.degree.trim() ||
          !item.university.trim() ||
          !item.yearOfPassing.trim() ||
          !item.fileName.trim(),
      )
    ) {
      showToast(
        'Please complete every qualification and attach its certificate.',
      );
      return;
    }
    if (!specialities.length) {
      showToast('Please select your speciality or None.');
      return;
    }
    if (
      GO_GREEN_PUBLICATIONS.some(
        publication => !goGreenSelections[publication.id],
      )
    ) {
      showToast('Please choose a preference for every publication.');
      return;
    }
    if (
      !mobileConsent ||
      !emailConsent ||
      !proposerConsent ||
      !seconderConsent
    ) {
      showToast(
        'Please complete the mobile and email preferences and accept proposer and seconder consent.',
      );
      return;
    }
    if (!fbsInterest) {
      showToast('Please select whether you are interested in FBS AIOS.');
      return;
    }
    if (fbsInterest === 'interested' && !fbsAcknowledgements.every(Boolean)) {
      showToast('Please acknowledge all three FBS terms.');
      return;
    }
    if (!lifeMemberDeclaration) {
      showToast('Please accept the Life Member declaration.');
      return;
    }
    if (!captchaInput.trim()) {
      showToast('Please enter the captcha shown above.');
      return;
    }
    if (captchaInput.trim().toLowerCase() !== captchaCode.toLowerCase()) {
      showToast('Please enter the correct characters shown in the image.');
      return;
    }
    Keyboard.dismiss();
    setPaymentInformationVisible(true);
  };

  if (preferencePage) {
    const title = { green: 'Go Green', privacy: 'Privacy', speciality: 'Speciality' }[preferencePage];
    return (
      <View style={styles.container}>
        <ScreenStatusBar />
        <AppHeader style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.preferenceBack} accessibilityRole="button" accessibilityLabel="Go back">
              <ArrowBackIcon size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.brandTitle}>{title}</Text>
          </View>
        </AppHeader>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}>
          {preferencePage === 'green' && (<>
          <View style={styles.formSectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionOrangeHeading}>
                * AIOS - Go Green Initiative
              </Text>
              <View style={styles.tealAccentBar} />
            </View>

            <View style={styles.goGreenTableContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.goGreenTable}>
                  <View style={styles.goGreenTableHeaderRow}>
                    <View style={styles.goGreenColTitle} />
                    <View style={styles.goGreenColRadioHeader}>
                      <Text style={styles.radioHeaderText}>
                        I need hard copy
                      </Text>
                    </View>
                    <View style={styles.goGreenColRadioHeader}>
                      <Text style={styles.radioHeaderText}>Online version</Text>
                    </View>
                    <View style={styles.goGreenColRadioHeader}>
                      <Text style={styles.radioHeaderText}>I need both</Text>
                    </View>
                  </View>

                  {GO_GREEN_PUBLICATIONS.map(pub => {
                    const selected = goGreenSelections[pub.id];
                    return (
                      <View key={pub.id} style={styles.goGreenTableRow}>
                        <View style={styles.goGreenColTitle}>
                          <Text style={styles.pubTitleText}>{pub.title}</Text>
                        </View>

                        <TouchableOpacity
                          style={styles.goGreenColRadio}
                          onPress={() =>
                            handleSelectGoGreen(pub.id, 'hard_copy')
                          }
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.radioCircleSmall,
                              selected === 'hard_copy' &&
                                styles.radioCircleSmallActive,
                            ]}
                          >
                            {selected === 'hard_copy' && (
                              <View style={styles.radioDotSmall} />
                            )}
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.goGreenColRadio}
                          onPress={() => handleSelectGoGreen(pub.id, 'online')}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.radioCircleSmall,
                              selected === 'online' &&
                                styles.radioCircleSmallActive,
                            ]}
                          >
                            {selected === 'online' && (
                              <View style={styles.radioDotSmall} />
                            )}
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.goGreenColRadio}
                          onPress={() => handleSelectGoGreen(pub.id, 'both')}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.radioCircleSmall,
                              selected === 'both' &&
                                styles.radioCircleSmallActive,
                            ]}
                          >
                            {selected === 'both' && (
                              <View style={styles.radioDotSmall} />
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
          </>)}
          {preferencePage === 'privacy' && (<>
          <View style={styles.formSectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionOrangeHeading}>
                * Use of your mobile number (please tick)
              </Text>
              <View style={styles.tealAccentBar} />
            </View>

            <View style={styles.mobileConsentList}>
              <TouchableOpacity
                style={styles.mobileConsentRow}
                onPress={() => setMobileConsent('office_only')}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.mobileConsentCircle,
                    mobileConsent === 'office_only' &&
                      styles.mobileConsentCircleActive,
                  ]}
                >
                  {mobileConsent === 'office_only' && (
                    <View style={styles.mobileConsentDot} />
                  )}
                </View>
                <Text style={styles.mobileConsentText}>
                  My <Text style={{ fontWeight: '700' }}>mobile number</Text>{' '}
                  should be used only for AIOS Office purpose.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mobileConsentRow}
                onPress={() => setMobileConsent('can_be_shared')}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.mobileConsentCircle,
                    mobileConsent === 'can_be_shared' &&
                      styles.mobileConsentCircleActive,
                  ]}
                >
                  {mobileConsent === 'can_be_shared' && (
                    <View style={styles.mobileConsentDot} />
                  )}
                </View>
                <Text style={styles.mobileConsentText}>
                  My <Text style={{ fontWeight: '700' }}>mobile number</Text>{' '}
                  can be shared with other (as per office policy) if they ask
                  for it apart from official purpose as well.
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionOrangeHeading}>
                * Use of your email id (please tick)
              </Text>
              <View style={styles.tealAccentBar} />
            </View>

            <View style={styles.mobileConsentList}>
              <TouchableOpacity
                style={styles.mobileConsentRow}
                onPress={() => setEmailConsent('office_only')}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.mobileConsentCircle,
                    emailConsent === 'office_only' &&
                      styles.mobileConsentCircleActive,
                  ]}
                >
                  {emailConsent === 'office_only' && (
                    <View style={styles.mobileConsentDot} />
                  )}
                </View>
                <Text style={styles.mobileConsentText}>
                  My <Text style={{ fontWeight: '700' }}>email id</Text> should
                  be used only for AIOS Office purpose.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mobileConsentRow}
                onPress={() => setEmailConsent('can_be_shared')}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.mobileConsentCircle,
                    emailConsent === 'can_be_shared' &&
                      styles.mobileConsentCircleActive,
                  ]}
                >
                  {emailConsent === 'can_be_shared' && (
                    <View style={styles.mobileConsentDot} />
                  )}
                </View>
                <Text style={styles.mobileConsentText}>
                  My <Text style={{ fontWeight: '700' }}>email id</Text> can be
                  shared with other (as per office policy) if they ask for it
                  apart from official purpose as well.
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          </>)}
          {preferencePage === 'speciality' && (<>
          <View style={styles.formSectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionOrangeHeading}>
                Sub - Speciality{' '}
                <Text style={styles.subHeadingMuted}>
                  (i.e. Cataract, Refractive Surgery, Vitreo-Retina, Cornea etc)
                </Text>
              </Text>
              <View style={styles.headingUnderline} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>State Registrar *</Text>
              <TextInput
                style={styles.textInput}
                value={stateRegistrar}
                onChangeText={setStateRegistrar}
                placeholder="Enter State Registrar"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Registration No. *</Text>
              <TextInput
                style={styles.textInput}
                value={registrationNo}
                onChangeText={setRegistrationNo}
                placeholder="Enter Registration No."
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>
                Upload State Medical Council Registration Certificate *
              </Text>
              <TouchableOpacity
                style={styles.fileUploadBox}
                activeOpacity={0.75}
                onPress={handlePickRegCert}
              >
                <View style={styles.chooseFileBtn} pointerEvents="none">
                  <Text style={styles.chooseFileText}>Choose Files</Text>
                </View>
                <Text
                  style={styles.fileNameText}
                  numberOfLines={1}
                  pointerEvents="none"
                >
                  {regCertFileName || 'no file selected'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.uploadHelperText}>
                Image size should be 200 x 200 Pixels and not more than 200 KB
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>
                Speciality{' '}
                <Text style={styles.subHeadingMuted}>(Maximum Three)</Text>
              </Text>
              <View style={styles.checkboxList}>
                {ALL_SPECIALITIES.map(item => {
                  const isChecked = specialities.includes(item);
                  return (
                    <TouchableOpacity
                      key={item}
                      style={styles.checkboxRow}
                      activeOpacity={0.8}
                      onPress={() => toggleSpeciality(item)}
                    >
                      <View
                        style={[
                          styles.checkboxSquare,
                          isChecked && styles.checkboxSquareChecked,
                        ]}
                      >
                        {isChecked && <CheckIcon size={12} color="#FFFFFF" />}
                      </View>
                      <Text
                        style={[
                          styles.checkboxLabel,
                          isChecked && styles.checkboxLabelChecked,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
          </>)}
          {preferencePage && (
            <Button customLayout style={styles.preferenceSave} onPress={() => {
              dispatch(updateProfile({ specialities, publicationPreferences: goGreenSelections, contactPrivacy: { mobile: mobileConsent, email: emailConsent } }));
              navigation.goBack();
              showToast('Preferences saved.');
            }} accessibilityRole="button">
              <Text style={styles.preferenceSaveText}>Save preferences</Text>
            </Button>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenStatusBar />
      <Toast notification={toast} />
      <LogoutConfirmation
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={() => {
          setLogoutVisible(false);
          dispatch(logout());
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }}
      />
      <AppHeader style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Image
              source={images.logo}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerTitleCol}>
            <Text style={styles.brandTitle}>My Account</Text>
            <Text style={styles.brandSubtitle}>
              All India Ophthalmological Society
            </Text>
          </View>
        </View>
      </AppHeader>
      <View
        ref={formViewport}
        style={styles.scrollView}
        onLayout={updateScrollSpace}
        collapsable={false}
      >
        <ScrollView
          ref={formScroll}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 16 + keyboardOverlap },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          nestedScrollEnabled
          onContentSizeChange={() => {
            if (captchaFocused.current)
              formScroll.current?.scrollToEnd({ animated: true });
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.doctorCardWrapper}>
            <TouchableOpacity
              style={styles.doctorCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('MyProfile')}
              accessibilityRole="button"
              accessibilityLabel="View full profile"
            >
              <View style={styles.doctorAvatarContainer}>
                {currentAvatarUri ? (
                  <Image
                    source={{ uri: currentAvatarUri }}
                    style={styles.doctorCardImg}
                  />
                ) : (
                  <View style={styles.doctorCardAvatarPlaceholder}>
                    <PersonIcon size={24} color="#0284C7" />
                  </View>
                )}
                {profile ? (
                  <View style={styles.doctorVerifiedCheck}>
                    <CheckIcon size={10} color="#FFFFFF" />
                  </View>
                ) : null}
              </View>

              <View style={styles.doctorDetailsCol}>
                <View style={styles.doctorNameRow}>
                  <Text style={styles.doctorCardName} numberOfLines={1}>
                    {currentDoctorName}
                  </Text>
                  {profile && <ShieldCheckIcon size={14} color="#0284C7" />}
                </View>
                <Text style={styles.doctorCardSub} numberOfLines={1}>
                  {currentMemberSub}
                </Text>
              </View>
            </TouchableOpacity>
          </View>


          <View style={styles.accountMenu}>
            {[
              { title: 'Update Profile', subtitle: 'Manage your personal details', Icon: EditPencilIcon, color: '#2563EB', background: '#EFF6FF', action: () => navigation.navigate('MyProfile') },
              { title: 'Change Password', subtitle: 'Keep your account secure', Icon: LockIcon, color: '#7C3AED', background: '#F5F3FF', action: () => navigation.navigate('ChangePassword') },
              { title: 'Go Green', subtitle: 'Choose your publication preferences', Icon: BookOpenIcon, color: '#059669', background: '#ECFDF5', action: () => navigation.navigate('GoGreen') },
              { title: 'Privacy', subtitle: 'Control sharing of your contact details', Icon: ShieldCheckIcon, color: '#0891B2', background: '#ECFEFF', action: () => navigation.navigate('Privacy') },
              { title: 'Speciality', subtitle: 'Select your areas of expertise', Icon: DocumentIcon, color: '#EA580C', background: '#FFF7ED', action: () => navigation.navigate('Speciality') },
              { title: 'Logout', subtitle: 'Sign out of your account', Icon: LogoutIcon, color: '#DC2626', background: '#FFF1F2', action: handleLogout },
            ].map(({ title, subtitle, Icon, color, background, action }) => (
              <TouchableOpacity key={title} style={styles.accountMenuCard} onPress={action} activeOpacity={0.8} accessibilityRole="button">
                <View style={[styles.accountMenuAccent, { backgroundColor: color }]} />
                <View style={[styles.accountMenuIcon, { backgroundColor: background }]}><Icon size={22} color={color} /></View>
                <View style={styles.accountMenuCopy}>
                  <Text style={styles.accountMenuTitle}>{title}</Text>
                  {/* <Text style={styles.accountMenuSubtitle}>{subtitle}</Text> */}
                </View>
                <View style={[styles.accountMenuArrowCircle, { backgroundColor: background }]}>
                  <Text style={[styles.accountMenuArrow, { color }]}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {/* Membership form is available on the dedicated BecomeMember screen. */}
          {false && (<>
          <View style={styles.formSectionCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Passport No.</Text>
              <TextInput
                style={styles.textInput}
                value={passportNo}
                onChangeText={setPassportNo}
                placeholder="Enter Passport Number"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>
                * Institution / Organization
              </Text>
              <TextInput
                style={styles.textInput}
                value={institution}
                onChangeText={setInstitution}
                placeholder="ITS"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Type of Organization</Text>
              <View style={styles.radioRow}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setOrgType('Govt')}
                  activeOpacity={0.8}
                >
                  <View style={styles.radioOuterCircle}>
                    {orgType === 'Govt' && (
                      <View style={styles.radioInnerCircle} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>Govt.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setOrgType('Private')}
                  activeOpacity={0.8}
                >
                  <View style={styles.radioOuterCircle}>
                    {orgType === 'Private' && (
                      <View style={styles.radioInnerCircle} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>Private</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>
                Upload Passport Size Photograph*
              </Text>
              <TouchableOpacity
                style={styles.fileUploadBox}
                activeOpacity={0.75}
                onPress={handlePickPhoto}
              >
                <View style={styles.chooseFileBtn} pointerEvents="none">
                  <Text style={styles.chooseFileText}>Choose Files</Text>
                </View>
                <Text
                  style={styles.fileNameText}
                  numberOfLines={1}
                  pointerEvents="none"
                >
                  {photoFileName || 'no file selected'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.uploadHelperText}>
                Image size should be 200 x 200 Pixels and not more than 200 KB
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Upload User Signature*</Text>
              <TouchableOpacity
                style={styles.fileUploadBox}
                activeOpacity={0.75}
                onPress={handlePickSignature}
              >
                <View style={styles.chooseFileBtn} pointerEvents="none">
                  <Text style={styles.chooseFileText}>Choose Files</Text>
                </View>
                <Text
                  style={styles.fileNameText}
                  numberOfLines={1}
                  pointerEvents="none"
                >
                  {signatureFileName || 'no file selected'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.uploadHelperText}>
                Image size should be 200 x 200 Pixels and not more than 200 KB
              </Text>
            </View>
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionOrangeHeading}>Qualifications</Text>
              <View style={styles.headingUnderline} />
            </View>

            {qualifications.map((q, index) => (
              <View
                key={q.id}
                style={[
                  styles.qualificationEntryBox,
                  index > 0 && styles.qualificationEntryBoxBorder,
                ]}
              >
                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>Degree i.e. MBBS, MD*</Text>
                  <TextInput
                    style={styles.textInput}
                    value={q.degree}
                    onChangeText={val =>
                      updateQualification(index, 'degree', val)
                    }
                    placeholder="Enter Degree"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>Full University *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={q.university}
                    onChangeText={val =>
                      updateQualification(index, 'university', val)
                    }
                    placeholder="Enter University"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>Year of Passing *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={q.yearOfPassing}
                    onChangeText={val =>
                      updateQualification(index, 'yearOfPassing', val)
                    }
                    placeholder="MM/DD/YYYY"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>Copy of Degree *</Text>
                  <TouchableOpacity
                    style={styles.fileUploadBox}
                    activeOpacity={0.75}
                    onPress={() => handlePickDegreeFile(index)}
                  >
                    <View style={styles.chooseFileBtn} pointerEvents="none">
                      <Text style={styles.chooseFileText}>Choose Files</Text>
                    </View>
                    <Text
                      style={styles.fileNameText}
                      numberOfLines={1}
                      pointerEvents="none"
                    >
                      {q.fileName || 'no file selected'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.degreeActionsRow}>
              <Button
                customLayout
                style={styles.navyPillBtn}
                activeOpacity={0.8}
                onPress={handleAddDegree}
              >
                <Text style={styles.navyPillBtnText}>+ Add More Degree</Text>
              </Button>

              <TouchableOpacity
                style={[
                  styles.navyPillBtnSecondary,
                  qualifications.length <= 1 && { opacity: 0.5 },
                ]}
                activeOpacity={0.8}
                onPress={() => handleDeleteDegree()}
              >
                <Text style={styles.navyPillBtnSecondaryText}>
                  Delete Degree
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionOrangeHeading}>
                Sub - Speciality{' '}
                <Text style={styles.subHeadingMuted}>
                  (i.e. Cataract, Refractive Surgery, Vitreo-Retina, Cornea etc)
                </Text>
              </Text>
              <View style={styles.headingUnderline} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>State Registrar *</Text>
              <TextInput
                style={styles.textInput}
                value={stateRegistrar}
                onChangeText={setStateRegistrar}
                placeholder="Enter State Registrar"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Registration No. *</Text>
              <TextInput
                style={styles.textInput}
                value={registrationNo}
                onChangeText={setRegistrationNo}
                placeholder="Enter Registration No."
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>
                Upload State Medical Council Registration Certificate *
              </Text>
              <TouchableOpacity
                style={styles.fileUploadBox}
                activeOpacity={0.75}
                onPress={handlePickRegCert}
              >
                <View style={styles.chooseFileBtn} pointerEvents="none">
                  <Text style={styles.chooseFileText}>Choose Files</Text>
                </View>
                <Text
                  style={styles.fileNameText}
                  numberOfLines={1}
                  pointerEvents="none"
                >
                  {regCertFileName || 'no file selected'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.uploadHelperText}>
                Image size should be 200 x 200 Pixels and not more than 200 KB
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>
                Speciality{' '}
                <Text style={styles.subHeadingMuted}>(Maximum Three)</Text>
              </Text>
              <View style={styles.checkboxList}>
                {ALL_SPECIALITIES.map(item => {
                  const isChecked = specialities.includes(item);
                  return (
                    <TouchableOpacity
                      key={item}
                      style={styles.checkboxRow}
                      activeOpacity={0.8}
                      onPress={() => toggleSpeciality(item)}
                    >
                      <View
                        style={[
                          styles.checkboxSquare,
                          isChecked && styles.checkboxSquareChecked,
                        ]}
                      >
                        {isChecked && <CheckIcon size={12} color="#FFFFFF" />}
                      </View>
                      <Text
                        style={[
                          styles.checkboxLabel,
                          isChecked && styles.checkboxLabelChecked,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
          <View style={styles.formSectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionOrangeHeading}>
                * AIOS - Go Green Initiative
              </Text>
              <View style={styles.tealAccentBar} />
            </View>

            <View style={styles.goGreenTableContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.goGreenTable}>
                  <View style={styles.goGreenTableHeaderRow}>
                    <View style={styles.goGreenColTitle} />
                    <View style={styles.goGreenColRadioHeader}>
                      <Text style={styles.radioHeaderText}>
                        I need hard copy
                      </Text>
                    </View>
                    <View style={styles.goGreenColRadioHeader}>
                      <Text style={styles.radioHeaderText}>Online version</Text>
                    </View>
                    <View style={styles.goGreenColRadioHeader}>
                      <Text style={styles.radioHeaderText}>I need both</Text>
                    </View>
                  </View>

                  {GO_GREEN_PUBLICATIONS.map(pub => {
                    const selected = goGreenSelections[pub.id];
                    return (
                      <View key={pub.id} style={styles.goGreenTableRow}>
                        <View style={styles.goGreenColTitle}>
                          <Text style={styles.pubTitleText}>{pub.title}</Text>
                        </View>

                        <TouchableOpacity
                          style={styles.goGreenColRadio}
                          onPress={() =>
                            handleSelectGoGreen(pub.id, 'hard_copy')
                          }
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.radioCircleSmall,
                              selected === 'hard_copy' &&
                                styles.radioCircleSmallActive,
                            ]}
                          >
                            {selected === 'hard_copy' && (
                              <View style={styles.radioDotSmall} />
                            )}
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.goGreenColRadio}
                          onPress={() => handleSelectGoGreen(pub.id, 'online')}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.radioCircleSmall,
                              selected === 'online' &&
                                styles.radioCircleSmallActive,
                            ]}
                          >
                            {selected === 'online' && (
                              <View style={styles.radioDotSmall} />
                            )}
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.goGreenColRadio}
                          onPress={() => handleSelectGoGreen(pub.id, 'both')}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.radioCircleSmall,
                              selected === 'both' &&
                                styles.radioCircleSmallActive,
                            ]}
                          >
                            {selected === 'both' && (
                              <View style={styles.radioDotSmall} />
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={styles.formSectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionOrangeHeading}>
                * Use of your mobile number (please tick)
              </Text>
              <View style={styles.tealAccentBar} />
            </View>

            <View style={styles.mobileConsentList}>
              <TouchableOpacity
                style={styles.mobileConsentRow}
                onPress={() => setMobileConsent('office_only')}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.mobileConsentCircle,
                    mobileConsent === 'office_only' &&
                      styles.mobileConsentCircleActive,
                  ]}
                >
                  {mobileConsent === 'office_only' && (
                    <View style={styles.mobileConsentDot} />
                  )}
                </View>
                <Text style={styles.mobileConsentText}>
                  My <Text style={{ fontWeight: '700' }}>mobile number</Text>{' '}
                  should be used only for AIOS Office purpose.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mobileConsentRow}
                onPress={() => setMobileConsent('can_be_shared')}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.mobileConsentCircle,
                    mobileConsent === 'can_be_shared' &&
                      styles.mobileConsentCircleActive,
                  ]}
                >
                  {mobileConsent === 'can_be_shared' && (
                    <View style={styles.mobileConsentDot} />
                  )}
                </View>
                <Text style={styles.mobileConsentText}>
                  My <Text style={{ fontWeight: '700' }}>mobile number</Text>{' '}
                  can be shared with other (as per office policy) if they ask
                  for it apart from official purpose as well.
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionOrangeHeading}>
                * Use of your email id (please tick)
              </Text>
              <View style={styles.tealAccentBar} />
            </View>

            <View style={styles.mobileConsentList}>
              <TouchableOpacity
                style={styles.mobileConsentRow}
                onPress={() => setEmailConsent('office_only')}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.mobileConsentCircle,
                    emailConsent === 'office_only' &&
                      styles.mobileConsentCircleActive,
                  ]}
                >
                  {emailConsent === 'office_only' && (
                    <View style={styles.mobileConsentDot} />
                  )}
                </View>
                <Text style={styles.mobileConsentText}>
                  My <Text style={{ fontWeight: '700' }}>email id</Text> should
                  be used only for AIOS Office purpose.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mobileConsentRow}
                onPress={() => setEmailConsent('can_be_shared')}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.mobileConsentCircle,
                    emailConsent === 'can_be_shared' &&
                      styles.mobileConsentCircleActive,
                  ]}
                >
                  {emailConsent === 'can_be_shared' && (
                    <View style={styles.mobileConsentDot} />
                  )}
                </View>
                <Text style={styles.mobileConsentText}>
                  My <Text style={{ fontWeight: '700' }}>email id</Text> can be
                  shared with other (as per office policy) if they ask for it
                  apart from official purpose as well.
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionOrangeHeading}>Proposed by</Text>
              <View style={styles.tealAccentBar} />
            </View>

            <View style={styles.formGridRow}>
              <View style={styles.formGridCol}>
                <Text style={styles.fieldLabel}>Membership No *</Text>
                <TextInput
                  style={styles.fieldBoxInput}
                  placeholder="Enter Membership No"
                  placeholderTextColor="#94A3B8"
                  value={proposerMembershipNo}
                  onChangeText={setProposerMembershipNo}
                />
              </View>

              <View style={styles.formGridCol}>
                <Text style={styles.fieldLabel}>Name*</Text>
                <TextInput
                  style={styles.fieldBoxInput}
                  placeholder="Proposed By"
                  placeholderTextColor="#94A3B8"
                  value={proposerName}
                  onChangeText={setProposerName}
                />
              </View>
            </View>

            <View style={styles.formGridRow}>
              <View style={styles.formGridCol}>
                <Text style={styles.fieldLabel}>Mobile No.*</Text>
                <TextInput
                  style={styles.fieldBoxInput}
                  placeholder="Enter Mobile No"
                  placeholderTextColor="#94A3B8"
                  value={proposerMobile}
                  onChangeText={setProposerMobile}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGridCol}>
                <Text style={styles.fieldLabel}>Email Id*</Text>
                <TextInput
                  style={styles.fieldBoxInput}
                  placeholder="Enter Email Id"
                  placeholderTextColor="#94A3B8"
                  value={proposerEmail}
                  onChangeText={setProposerEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.consentCheckboxRow}
              onPress={() => setProposerConsent(!proposerConsent)}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.checkboxSquare,
                  proposerConsent && styles.checkboxSquareChecked,
                ]}
              >
                {proposerConsent && <CheckIcon size={12} color="#FFFFFF" />}
              </View>
              <Text style={styles.consentCheckboxText}>
                I have taken consent from Proposer
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionOrangeHeading}>Seconded by</Text>
              <View style={styles.tealAccentBar} />
            </View>

            <View style={styles.formGridRow}>
              <View style={styles.formGridCol}>
                <Text style={styles.fieldLabel}>Membership No *</Text>
                <TextInput
                  style={styles.fieldBoxInput}
                  placeholder="Enter Membership No"
                  placeholderTextColor="#94A3B8"
                  value={seconderMembershipNo}
                  onChangeText={setSeconderMembershipNo}
                />
              </View>

              <View style={styles.formGridCol}>
                <Text style={styles.fieldLabel}>Name*</Text>
                <TextInput
                  style={styles.fieldBoxInput}
                  placeholder="Seconded By"
                  placeholderTextColor="#94A3B8"
                  value={seconderName}
                  onChangeText={setSeconderName}
                />
              </View>
            </View>

            <View style={styles.formGridRow}>
              <View style={styles.formGridCol}>
                <Text style={styles.fieldLabel}>Mobile No.*</Text>
                <TextInput
                  style={styles.fieldBoxInput}
                  placeholder="Enter Mobile No"
                  placeholderTextColor="#94A3B8"
                  value={seconderMobile}
                  onChangeText={setSeconderMobile}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGridCol}>
                <Text style={styles.fieldLabel}>Email Id*</Text>
                <TextInput
                  style={styles.fieldBoxInput}
                  placeholder="Enter Email Id"
                  placeholderTextColor="#94A3B8"
                  value={seconderEmail}
                  onChangeText={setSeconderEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.consentCheckboxRow}
              onPress={() => setSeconderConsent(!seconderConsent)}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.checkboxSquare,
                  seconderConsent && styles.checkboxSquareChecked,
                ]}
              >
                {seconderConsent && <CheckIcon size={12} color="#FFFFFF" />}
              </View>
              <Text style={styles.consentCheckboxText}>
                I have taken consent from Seconder
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionOrangeHeading}>
                Government ID Proofs
              </Text>
              <View style={styles.tealAccentBar} />
            </View>

            <View style={styles.govIdRow}>
              <View style={styles.govIdCol}>
                <TouchableOpacity
                  style={styles.dropdownInputBox}
                  onPress={() => setGovIdModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownInputText} numberOfLines={1}>
                    {govIdType}
                  </Text>
                  <ChevronDownIcon size={14} color="#64748B" />
                </TouchableOpacity>
                <Text style={styles.fieldLabelBelow}>
                  Please select id proof which you wish to upload *
                </Text>
              </View>

              <View style={styles.govIdCol}>
                <TouchableOpacity
                  style={styles.fileUploadBox}
                  activeOpacity={0.75}
                  onPress={handlePickGovIdFile}
                >
                  <View style={styles.chooseFileBtn} pointerEvents="none">
                    <Text style={styles.chooseFileText}>Choose Files</Text>
                  </View>
                  <Text
                    style={styles.fileNameText}
                    numberOfLines={1}
                    pointerEvents="none"
                  >
                    {govIdFile || 'no files selected'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.fieldLabelBelow}>Upload Certificate *</Text>
              </View>
            </View>
          </View>

          <View style={styles.membershipDeclarationCard}>
            <Text style={styles.fbsTitle}>Wish to join FBS AIOS</Text>
            <Text style={styles.fbsNote}>
              Verify the terms &amp; conditions below.
            </Text>
            {[
              'AIOS facilitates a Family Benefit Scheme (AIOS FBS) for benefit of its life members. This is a voluntary scheme in which life members can participate.',
              'AIOS FBS is an independent registered society and is a separate entity from AIOS. AIOS only acts as a facilitator for members and has no role in the governance of the FBS.',
              'The FBS is governed by its own set of rules and regulations and AIOS does not take responsibility for the running of the scheme.',
            ].map((term, index) => (
              <TouchableOpacity
                key={term}
                style={styles.declarationRow}
                onPress={() =>
                  setFbsAcknowledgements(current =>
                    current.map((checked, i) =>
                      i === index ? !checked : checked,
                    ),
                  )
                }
                accessibilityRole="checkbox"
                accessibilityState={{ checked: fbsAcknowledgements[index] }}
                accessibilityLabel={term}
              >
                <View
                  style={[
                    styles.checkboxSquare,
                    styles.declarationCheckbox,
                    fbsAcknowledgements[index] && styles.checkboxSquareChecked,
                  ]}
                >
                  {fbsAcknowledgements[index] && (
                    <CheckIcon size={14} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.declarationText}>
                  <Text style={styles.fbsNote}>* </Text>
                  {term}
                </Text>
              </TouchableOpacity>
            ))}
            <View accessibilityRole="radiogroup">
              {(['interested', 'not_interested'] as const).map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.fbsRadioRow}
                  onPress={() => setFbsInterest(option)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: fbsInterest === option }}
                >
                  <View
                    style={[
                      styles.fbsRadio,
                      fbsInterest === option && styles.fbsRadioSelected,
                    ]}
                  >
                    {fbsInterest === option && (
                      <View style={styles.fbsRadioDot} />
                    )}
                  </View>
                  <Text style={styles.fbsChoice}>
                    {option === 'interested'
                      ? 'I am interested'
                      : 'I am not interested'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.membershipDeclarationCard}>
            <Text style={styles.membershipAmount}>Amount : INR 10700</Text>
            <Text style={styles.handlingNote}>
              An Internet Handling Charges of Rs. 330 will be applied. Details
              will be shown at the checkout page.
            </Text>
            <TouchableOpacity
              style={styles.declarationRow}
              onPress={() => setLifeMemberDeclaration(value => !value)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: lifeMemberDeclaration }}
              accessibilityLabel="Accept Life Member declaration"
            >
              <View
                style={[
                  styles.checkboxSquare,
                  styles.declarationCheckbox,
                  lifeMemberDeclaration && styles.checkboxSquareChecked,
                ]}
              >
                {lifeMemberDeclaration && (
                  <CheckIcon size={14} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.declarationText}>
                I hereby declare that all the above details are correct. I wish
                to be a Life member. I have carefully read the instructions. I
                shall abide by the Rules, Regulations &amp; Bye-Laws of the
                Society as in force and any subsequent amendment(s) made from
                time to time.
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.paymentSummaryCard}>
            <Text style={styles.paymentTitle}>Payment Summary</Text>

            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Reg. Fee</Text>
              <Text style={styles.paymentValue}>10700/-</Text>
            </View>

            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Internet Handling Charges</Text>
              <Text style={styles.paymentValue}>330/-</Text>
            </View>

            <View style={styles.paymentDivider} />

            <View style={styles.captchaSection}>
              <Text style={styles.captchaLabel}>
                * Enter the contents of image
              </Text>
              <View style={styles.captchaRow}>
                <TouchableOpacity
                  style={styles.captchaDisplayBox}
                  onPress={refreshCaptcha}
                  activeOpacity={0.7}
                >
                  <Text style={styles.captchaCodeText}>{captchaCode}</Text>
                  <Text style={styles.captchaRefreshHint}>↻</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.captchaInput}
                  value={captchaInput}
                  onFocus={() => {
                    captchaFocused.current = true;
                    formScroll.current?.scrollToEnd({ animated: true });
                  }}
                  onBlur={() => {
                    captchaFocused.current = false;
                  }}
                  onChangeText={setCaptchaInput}
                  placeholder="CAPTCHA"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <Button

              customLayout
              style={styles.payNowBtn}
              activeOpacity={0.85}
              onPress={handlePayNow}
            >
              <Text style={styles.payNowBtnText}>Pay Now ➔</Text>
            </Button>

            <Text style={styles.paymentDisclaimer}>
              * Online payment to the society / Member Registration. All
              transactions are SSL encrypted. Terms & conditions apply.
            </Text>
          </View>
          </>)}
        </ScrollView>
      </View>

      <Modal
        visible={paymentInformationVisible}
        animationType="slide"
        onRequestClose={() => setPaymentInformationVisible(false)}
      >
        <PaymentInformation
          amount={10700}
          transactionCharge={330}
          subtitle="AIOS · Membership Registration"
          onBack={() => setPaymentInformationVisible(false)}
        />
      </Modal>
      <Modal
        visible={govIdModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGovIdModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setGovIdModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select ID Proof</Text>
              <TouchableOpacity
                onPress={() => setGovIdModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <CloseIcon size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            {GOV_ID_OPTIONS.map(item => (
              <TouchableOpacity
                key={item}
                style={styles.modalOptionItem}
                onPress={() => {
                  setGovIdType(item);
                  setGovIdModalVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    govIdType === item && styles.modalOptionTextActive,
                  ]}
                >
                  {item}
                </Text>
                {govIdType === item && <CheckIcon size={14} color="#0A1E3F" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.editModalOverlay}>
          <View style={styles.editModalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <EditPencilIcon size={16} color="#0A1E3F" />
                <Text style={styles.modalTitle}>Edit Profile Details</Text>
              </View>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <CloseIcon size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.editModalScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.editModalForm}>
                <View style={styles.editFormRow}>
                  <View style={{ width: 80 }}>
                    <Text style={styles.fieldLabel}>Title</Text>
                    <TextInput
                      style={styles.fieldBoxInput}
                      value={editTitle}
                      onChangeText={setEditTitle}
                      placeholder="Dr."
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>First Name</Text>
                    <TextInput
                      style={styles.fieldBoxInput}
                      value={editFirstName}
                      onChangeText={setEditFirstName}
                      placeholder="First Name"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                <View style={styles.editFormField}>
                  <Text style={styles.fieldLabel}>Surname / Last Name</Text>
                  <TextInput
                    style={styles.fieldBoxInput}
                    value={editSurname}
                    onChangeText={setEditSurname}
                    placeholder="Surname"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.editFormField}>
                  <Text style={styles.fieldLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.fieldBoxInput}
                    value={editPhone}
                    onChangeText={setEditPhone}
                    placeholder="+91 Mobile number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.editFormField}>
                  <Text style={styles.fieldLabel}>Email Address</Text>
                  <TextInput
                    style={styles.fieldBoxInput}
                    value={editEmail}
                    onChangeText={setEditEmail}
                    placeholder="Email address"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.editFormRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>City</Text>
                    <TextInput
                      style={styles.fieldBoxInput}
                      value={editCity}
                      onChangeText={setEditCity}
                      placeholder="City"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>State</Text>
                    <TextInput
                      style={styles.fieldBoxInput}
                      value={editState}
                      onChangeText={setEditState}
                      placeholder="State"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.editModalButtonsRow}>
              <Button
                customLayout
                style={styles.editModalCancelBtn}
                onPress={() => setEditModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.editModalCancelBtnText}>Cancel</Text>
              </Button>

              <Button

                customLayout
                style={styles.editModalSaveBtn}
                onPress={handleSaveProfile}
                activeOpacity={0.8}
              >
                <Text style={styles.editModalSaveBtnText}>Save Changes</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  preferenceBack: { padding: 10, marginRight: 8 },
  accountMenu: { marginHorizontal: 2, gap: 12, paddingBottom: 8 },
  accountMenuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    gap: 14,
    shadowColor: '#20385B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  accountMenuAccent: {
    position: 'absolute',
    left: 0,
    width: 3,
    height: 26,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  accountMenuIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  accountMenuCopy: { flex: 1 },
  accountMenuTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', letterSpacing: 0.1 },
  accountMenuSubtitle: { fontSize: 12, lineHeight: 18, color: '#64748B', marginTop: 4 },
  accountMenuArrowCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  accountMenuArrow: { fontSize: 24, lineHeight: 26, textAlign: 'center' },
  preferenceSave: { margin: 16, padding: 16, borderRadius: 16, backgroundColor: '#2563EB', alignItems: 'center' },
  preferenceSaveText: { color: '#FFFFFF', fontWeight: '700' },

  fbsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  fbsNote: {
    fontSize: 14,
    lineHeight: 22,
    color: '#EA580C',
  },
  fbsRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
  },
  fbsRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fbsRadioSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#2196F3',
  },
  fbsRadioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  fbsChoice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flexShrink: 1,
  },
  membershipDeclarationCard: {
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
  },
  membershipAmount: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
    color: '#1E293B',
  },
  handlingNote: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
    color: '#D97706',
  },
  declarationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 4,
  },
  declarationCheckbox: {
    marginTop: 3,
    flexShrink: 0,
  },
  declarationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 24,
    color: '#334155',
    includeFontPadding: false,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0A1E3F',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#162C54',
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
    color: '#FFFFFF',
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

  /* Title subheader */
  portalBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FDBA74',
    marginBottom: 8,
  },
  portalBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C2410C',
    letterSpacing: 0.4,
  },

  /* Scroll container */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 14,
  },

  /* Doctor Card */
  doctorCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
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
  doctorCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  doctorCardImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#0284C7',
  },
  doctorCardAvatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarPlaceholder: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1E3A8A',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorVerifiedCheck: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#0284C7',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  doctorDetailsCol: {
    flex: 1,
  },
  doctorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doctorCardName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  doctorCardSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  doctorCardRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 6,
  },
  doctorCardEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F0F9FF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  doctorCardEditText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  doctorCardChevronBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorCardChevronRotated: {
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
  doctorExpandedDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 14,
  },
  doctorExpandedDetails: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    paddingTop: 12,
  },
  doctorDetailsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  doctorDetailsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E06A26',
    letterSpacing: 0.5,
  },
  doctorMemberIdPill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  doctorMemberIdPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailGridItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailGridLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  detailGridVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  expandedActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  expandedEditBtn: {
    flex: 1,
    backgroundColor: '#0A1E3F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 38,
    borderRadius: 8,
  },
  expandedEditBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  expandedViewFullBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 38,
    borderRadius: 8,
  },
  expandedViewFullBtnText: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '700',
  },
  memberIdBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  memberIdBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  editModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  editModalContainer: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
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
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editModalScroll: {
    maxHeight: 380,
  },
  editModalForm: {
    paddingVertical: 8,
    gap: 10,
  },
  editFormRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editFormField: {
    gap: 4,
  },
  editModalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  editModalCancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  editModalCancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editModalSaveBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#E06A26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editModalSaveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Section Card */
  formSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  /* Section Headings */
  sectionHeaderRow: {
    marginBottom: 4,
  },
  sectionOrangeHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 0.2,
  },
  subHeadingMuted: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  headingUnderline: {
    height: 2,
    backgroundColor: '#FED7AA',
    marginTop: 4,
    borderRadius: 1,
  },

  /* Input Group */
  inputGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    color: '#0F172A',
  },

  /* Radio Group */
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 2,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radioOuterCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0F172A',
  },
  radioLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },

  /* File Upload Box */
  fileUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 6,
    height: 42,
  },
  chooseFileBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  chooseFileText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  fileNameText: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
  },
  uploadHelperText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },

  /* Qualification Entry */
  qualificationEntryBox: {
    gap: 12,
  },
  qualificationEntryBoxBorder: {
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  qualificationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  degreeIndexBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  degreeIndexBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
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
  deleteDegreeSingleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },

  /* Degree Action Buttons */
  degreeActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  navyPillBtn: {
    flex: 1,
    backgroundColor: '#0A1E3F',
    borderRadius: 20,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navyPillBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navyPillBtnSecondary: {
    flex: 1,
    backgroundColor: '#0A1E3F',
    borderRadius: 20,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navyPillBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Checkbox List */
  checkboxList: {
    gap: 8,
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkboxSquare: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSquareChecked: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#334155',
  },
  checkboxLabelChecked: {
    fontWeight: '700',
    color: '#0F172A',
  },

  /* Teal/Blue Accent Bar */
  tealAccentBar: {
    width: 48,
    height: 2.5,
    backgroundColor: '#0284C7',
    borderRadius: 1.5,
    marginTop: 4,
  },

  /* Go Green Matrix Table */
  goGreenTableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 8,
  },
  goGreenTable: {
    minWidth: 420,
    paddingVertical: 4,
  },
  goGreenTableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  goGreenColTitle: {
    width: 170,
    paddingRight: 8,
  },
  goGreenColRadioHeader: {
    width: 82,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 14,
  },
  goGreenTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pubTitleText: {
    fontSize: 12,
    color: '#1E293B',
    lineHeight: 16,
  },
  goGreenColRadio: {
    width: 82,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  radioCircleSmall: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioCircleSmallActive: {
    borderColor: '#0284C7',
  },
  radioDotSmall: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#0284C7',
  },

  /* Mobile Consent Section */
  mobileConsentList: {
    gap: 14,
    marginTop: 10,
  },
  mobileConsentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  mobileConsentCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 1,
  },
  mobileConsentCircleActive: {
    borderColor: '#0284C7',
  },
  mobileConsentDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#0284C7',
  },
  mobileConsentText: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
  },

  /* Payment Summary Card */
  paymentSummaryCard: {
    backgroundColor: '#0A1E3F',
    borderRadius: 14,
    padding: 16,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 13,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  paymentValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  paymentDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 4,
  },

  /* Captcha */
  captchaSection: {
    gap: 6,
    marginTop: 2,
  },
  captchaLabel: {
    fontSize: 11,
    color: '#93C5FD',
  },
  captchaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  captchaDisplayBox: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 8,
  },
  captchaCodeText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 4,
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
  captchaRefreshHint: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748B',
  },
  captchaInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* Pay Now Button */
  payNowBtn: {
    backgroundColor: '#EA580C',
    borderRadius: 10,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#EA580C',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  payNowBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  paymentDisclaimer: {
    fontSize: 9.5,
    color: '#94A3B8',
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 2,
  },
  /* Form Grid & Below Labels */
  formGridRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  formGridCol: {
    flex: 1,
    gap: 4,
  },
  fieldBoxInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 42,
    fontSize: 12,
    color: '#0F172A',
  },
  fieldLabelBelow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  consentCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  consentCheckboxText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },

  /* Gov ID Styles */
  govIdRow: {
    gap: 12,
    marginTop: 8,
  },
  govIdCol: {
    gap: 4,
  },
  dropdownInputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownInputText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A1E3F',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#334155',
  },
  modalOptionTextActive: {
    fontWeight: '700',
    color: '#0A1E3F',
  },
});
