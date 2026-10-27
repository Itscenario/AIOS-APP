import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { State } from 'country-state-city';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { rounded, shadows, spacing } from '../theme/spacing';
import {
  ArrowBackIcon,
  Background,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  DocumentIcon,
  FilePicker,
  pickDocumentFile,
  Typography,
} from '../components';

interface QualificationRow {
  id: string;
  degree: string;
  university: string;
  yearOfPassing: string;
  copyName?: string;
  copyUri?: string;
}

const SPECIALITY_OPTIONS = [
  'Glaucoma',
  'Retina & Vitreous',
  'Cornea',
  'Cataract & Refractive Surgery',
  'Pediatric Ophthalmology & Strabismus',
  'Uvea & Ocular Immunology',
  'Oculoplasty & Facial Aesthetics',
  'Comprehensive Ophthalmology',
  'Cataract/Phaco',
  'Refractive Surgery',
  'Neurophthalmology',
  'Ocular Pathology',
  'Microbiology',
  'None',
];

interface GoGreenPublication {
  id: string;
  title: string;
}

const GO_GREEN_PUBLICATIONS: GoGreenPublication[] = [
  { id: 'ijo', title: 'Indian Journal of Ophthalmology' },
  { id: 'proceedings', title: 'AIOS Proceedings' },
  { id: 'abstract_book', title: 'Abstract Book of Annual Conference' },
  { id: 'cme_series', title: 'AIOS CME Series' },
  { id: 'news', title: 'AIOS News' },
  { id: 'times', title: 'AIOS Times - Bulletin of AIOS' },
];

type GoGreenOption = 'hard_copy' | 'online' | 'both';

const GOV_ID_OPTIONS = [
  'Voter ID Card',
  'Aadhaar Card',
  'Passport',
  'PAN Card',
  'Driving License',
];

export const BecomeMemberScreen: React.FC = () => {
  const formScroll = useRef<React.ElementRef<typeof ScrollView>>(null);
  const captchaFocused = useRef(false);
  const scrollToCaptcha = () => {
    if (captchaFocused.current) {
      formScroll.current?.scrollToEnd({ animated: true });
    }
  };
  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidShow', () => {
      if (captchaFocused.current) {
        requestAnimationFrame(() => formScroll.current?.scrollToEnd({ animated: true }));
      }
    });
    return () => subscription.remove();
  }, []);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  // Basic Organization details
  const [passportNo, setPassportNo] = useState<string>('');
  const [institution, setInstitution] = useState<string>('ITS');
  const [orgType, setOrgType] = useState<'Govt.' | 'Private'>('Private');

  // File uploads
  const [passportPhotoName, setPassportPhotoName] = useState<string>('');
  const [signaturePhotoName, setSignaturePhotoName] = useState<string>('');
  const [certificateName, setCertificateName] = useState<string>('');

  // Qualifications list
  const [qualifications, setQualifications] = useState<QualificationRow[]>([
    {
      id: '1',
      degree: '',
      university: '',
      yearOfPassing: '',
      copyName: '',
    },
  ]);

  const [stateRegistered, setStateRegistered] = useState<string>('');
  const [registrationNo, setRegistrationNo] = useState<string>('');
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>(
    [],
  );

  const [stateModalVisible, setStateModalVisible] = useState<boolean>(false);
  const [stateSearch, setStateSearch] = useState<string>('');
  const indianStates = State.getStatesOfCountry('IN').map(s => s.name);

  const [goGreenSelections, setGoGreenSelections] = useState<
    Record<string, GoGreenOption>
  >({});

  const [mobileConsent, setMobileConsent] = useState<
    'office_only' | 'can_be_shared' | ''
  >('office_only');

  const [emailConsent, setEmailConsent] = useState<
    'office_only' | 'can_be_shared' | ''
  >('office_only');

  const [proposerMembershipNo, setProposerMembershipNo] = useState<string>('');
  const [proposerName, setProposerName] = useState<string>('');
  const [proposerMobile, setProposerMobile] = useState<string>('');
  const [proposerEmail, setProposerEmail] = useState<string>('');
  const [proposerConsent, setProposerConsent] = useState<boolean>(false);

  const [seconderMembershipNo, setSeconderMembershipNo] = useState<string>('');
  const [seconderName, setSeconderName] = useState<string>('');
  const [seconderMobile, setSeconderMobile] = useState<string>('');
  const [seconderEmail, setSeconderEmail] = useState<string>('');
  const [seconderConsent, setSeconderConsent] = useState<boolean>(false);

  const [govIdType, setGovIdType] = useState<string>('Voter ID Card');
  const [govIdFile, setGovIdFile] = useState<string>('');
  const [govIdModalVisible, setGovIdModalVisible] = useState<boolean>(false);
  const [fbsTerms1, setFbsTerms1] = useState<boolean>(false);
  const [fbsTerms2, setFbsTerms2] = useState<boolean>(false);
  const [fbsTerms3, setFbsTerms3] = useState<boolean>(false);
  const [fbsInterest, setFbsInterest] = useState<
    'interested' | 'not_interested' | ''
  >('not_interested');

  const [declarationAccepted, setDeclarationAccepted] =
    useState<boolean>(false);

  const handleSelectGoGreen = (pubId: string, option: GoGreenOption) => {
    setGoGreenSelections(prev => ({
      ...prev,
      [pubId]: prev[pubId] === option ? ('' as any) : option,
    }));
  };

  const [captchaCode, setCaptchaCode] = useState<string>('52ffa');
  const [captchaInput, setCaptchaInput] = useState<string>('');

  const handlePickFile = async (
    onSuccess: (fileName: string, uri: string) => void,
  ) => {
    try {
      const result = await pickDocumentFile();
      if (result) {
        onSuccess(result.name, result.uri);
      }
    } catch {
      Alert.alert('Error', 'Unable to pick file. Please try again.');
    }
  };

  const handleAddDegree = () => {
    const newId = (qualifications.length + 1).toString();
    setQualifications(prev => [
      ...prev,
      {
        id: newId,
        degree: '',
        university: '',
        yearOfPassing: '',
        copyName: '',
      },
    ]);
  };

  const handleDeleteDegree = (indexToRemove?: number) => {
    if (qualifications.length <= 1) {
      Alert.alert('Notice', 'At least one qualification entry is required.');
      return;
    }
    if (typeof indexToRemove === 'number') {
      setQualifications(prev => prev.filter((_, i) => i !== indexToRemove));
    } else {
      setQualifications(prev => prev.slice(0, prev.length - 1));
    }
  };

  const updateQualification = (
    index: number,
    field: keyof QualificationRow,
    value: string,
  ) => {
    setQualifications(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const toggleSpeciality = (item: string) => {
    if (selectedSpecialities.includes(item)) {
      setSelectedSpecialities(prev => prev.filter(s => s !== item));
    } else {
      if (selectedSpecialities.length >= 3) {
        Alert.alert(
          'Limit Reached',
          'You can select a maximum of three specialities.',
        );
        return;
      }
      setSelectedSpecialities(prev => [...prev, item]);
    }
  };

  const handleRefreshCaptcha = () => {
    const chars = '23456789abcdefghkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  const handlePayNow = () => {
    if (!institution.trim()) {
      Alert.alert('Missing Field', 'Please enter Institution / Organization.');
      return;
    }
    if (!declarationAccepted) {
      Alert.alert(
        'Declaration Required',
        'Please accept the Life member declaration before proceeding to payment.',
      );
      return;
    }
    if (captchaInput.trim().toLowerCase() !== captchaCode.toLowerCase()) {
      Alert.alert(
        'Invalid Captcha',
        'Please enter the correct captcha code shown.',
      );
      return;
    }

    Alert.alert(
      'Proceed to Payment',
      'Total Amount to Pay: ₹11,030/- (Registration Fee: ₹10,700 + Internet Handling: ₹330)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: () => {
            Alert.alert(
              'Application Submitted',
              'Thank you! Your AIOS membership registration application has been received successfully.',
              [{ text: 'OK', onPress: () => navigation.goBack() }],
            );
          },
        },
      ],
    );
  };

  const filteredStates = indianStates.filter(s =>
    s.toLowerCase().includes(stateSearch.toLowerCase()),
  );

  return (
    <Background
      keyboardAvoiding={false}
      style={styles.fixedLayout}
    >
      <KeyboardAvoidingView
        style={styles.formScroll}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          <Typography
            variant="headlineSm"
            weight="bold"
            color={colors.white}
            numberOfLines={1}
          >
            Become an AIOS Member
          </Typography>
        </View>
      </View>
      <ScrollView
        ref={formScroll}
        onLayout={scrollToCaptcha}
        onContentSizeChange={scrollToCaptcha}
        style={styles.formScroll}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.mainCard}>
        <View style={styles.sectionHeader}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.tertiarySaffron}
            style={styles.sectionTitle}
          >
            Organization Details
          </Typography>
          <View style={styles.orangeAccentBar} />
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            Passport No.
          </Typography>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Passport No. (Optional)"
            placeholderTextColor={colors.textMuted}
            value={passportNo}
            onChangeText={setPassportNo}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            * Institution / Organization
          </Typography>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Institution / Organization"
            placeholderTextColor={colors.textMuted}
            value={institution}
            onChangeText={setInstitution}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            Type of Organization
          </Typography>
          <View style={styles.radioRow}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setOrgType('Govt.')}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.radioCircle,
                  orgType === 'Govt.' && styles.radioCircleActive,
                ]}
              >
                {orgType === 'Govt.' && <View style={styles.radioDot} />}
              </View>
              <Typography
                variant="bodyMd"
                weight={orgType === 'Govt.' ? 'bold' : 'regular'}
                color={colors.textPrimary}
              >
                Govt.
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setOrgType('Private')}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.radioCircle,
                  orgType === 'Private' && styles.radioCircleActive,
                ]}
              >
                {orgType === 'Private' && <View style={styles.radioDot} />}
              </View>
              <Typography
                variant="bodyMd"
                weight={orgType === 'Private' ? 'bold' : 'regular'}
                color={colors.textPrimary}
              >
                Private
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.uploadCard}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.uploadTitle}
          >
            Upload Passport Size Photograph*
          </Typography>
          <View style={styles.fileActionRow}>
            <TouchableOpacity
              style={styles.chooseFileButton}
              onPress={() => handlePickFile(name => setPassportPhotoName(name))}
              activeOpacity={0.8}
            >
              <Typography
                variant="bodySm"
                weight="bold"
                color={colors.primaryNavy}
              >
                Choose Files
              </Typography>
            </TouchableOpacity>
            <View style={styles.fileSelectedBox}>
              <Typography
                variant="bodySm"
                color={
                  passportPhotoName ? colors.primaryNavy : colors.textMuted
                }
                numberOfLines={1}
                weight={passportPhotoName ? 'medium' : 'regular'}
                style={styles.fileSelectedText}
              >
                {passportPhotoName || 'no files selected'}
              </Typography>
            </View>
          </View>
          <Typography
            variant="caption"
            color={colors.textMuted}
            style={styles.helperNotice}
          >
            Image size should be 600 X 400 Pixels and not more than 200KB.
          </Typography>
        </View>

        <View style={styles.uploadCard}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.uploadTitle}
          >
            Upload User Signature*
          </Typography>
          <View style={styles.fileActionRow}>
            <TouchableOpacity
              style={styles.chooseFileButton}
              onPress={() =>
                handlePickFile(name => setSignaturePhotoName(name))
              }
              activeOpacity={0.8}
            >
              <Typography
                variant="bodySm"
                weight="bold"
                color={colors.primaryNavy}
              >
                Choose Files
              </Typography>
            </TouchableOpacity>
            <View style={styles.fileSelectedBox}>
              <Typography
                variant="bodySm"
                color={
                  signaturePhotoName ? colors.primaryNavy : colors.textMuted
                }
                numberOfLines={1}
                weight={signaturePhotoName ? 'medium' : 'regular'}
                style={styles.fileSelectedText}
              >
                {signaturePhotoName || 'no files selected'}
              </Typography>
            </View>
          </View>
          <Typography
            variant="caption"
            color={colors.textMuted}
            style={styles.helperNotice}
          >
            Image size should be 131 X 60 Pixels and not more than 200KB.
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
            Qualifications
          </Typography>
          <View style={styles.orangeAccentBar} />
        </View>

        {qualifications.map((q, index) => (
          <View key={q.id} style={styles.qualificationBox}>
            <View style={styles.fieldGroup}>
              <Typography
                variant="labelSm"
                weight="bold"
                color={colors.textPrimary}
                style={styles.fieldLabel}
              >
                Degree (i.e. MBBS, MD)*
              </Typography>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Degree"
                placeholderTextColor={colors.textMuted}
                value={q.degree}
                onChangeText={val => updateQualification(index, 'degree', val)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Typography
                variant="labelSm"
                weight="bold"
                color={colors.textPrimary}
                style={styles.fieldLabel}
              >
                Full University *
              </Typography>
              <TextInput
                style={styles.textInput}
                placeholder="Enter University"
                placeholderTextColor={colors.textMuted}
                value={q.university}
                onChangeText={val =>
                  updateQualification(index, 'university', val)
                }
              />
            </View>

            <View style={styles.fieldGroup}>
              <Typography
                variant="labelSm"
                weight="bold"
                color={colors.textPrimary}
                style={styles.fieldLabel}
              >
                Year of Passing *
              </Typography>
              <TextInput
                style={styles.textInput}
                placeholder="MM/DD/YYYY"
                placeholderTextColor={colors.textMuted}
                value={q.yearOfPassing}
                onChangeText={val =>
                  updateQualification(index, 'yearOfPassing', val)
                }
              />
            </View>

            <View style={styles.fieldGroup}>
              <Typography
                variant="labelSm"
                weight="bold"
                color={colors.textPrimary}
                style={styles.fieldLabel}
              >
                Copy of Degree *
              </Typography>
              <View style={styles.fileActionRow}>
                <TouchableOpacity
                  style={styles.chooseFileButton}
                  onPress={() =>
                    handlePickFile(name =>
                      updateQualification(index, 'copyName', name),
                    )
                  }
                  activeOpacity={0.8}
                >
                  <Typography
                    variant="bodySm"
                    weight="bold"
                    color={colors.primaryNavy}
                  >
                    Choose Files
                  </Typography>
                </TouchableOpacity>
                <View style={styles.fileSelectedBox}>
                  <Typography
                    variant="bodySm"
                    color={q.copyName ? colors.primaryNavy : colors.textMuted}
                    numberOfLines={1}
                    weight={q.copyName ? 'medium' : 'regular'}
                    style={styles.fileSelectedText}
                  >
                    {q.copyName || 'no files selected'}
                  </Typography>
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.degreeActionRow}>
          <TouchableOpacity
            style={styles.addDegreeButton}
            onPress={handleAddDegree}
            activeOpacity={0.85}
          >
            <Typography variant="bodySm" weight="bold" color={colors.white}>
              + Add More Degree
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deleteDegreeButton,
              qualifications.length <= 1 && { opacity: 0.5 },
            ]}
            onPress={() => handleDeleteDegree()}
            activeOpacity={0.85}
          >
            <Typography variant="bodySm" weight="bold" color={colors.white}>
              Delete Degree
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.tertiarySaffron}
            style={styles.sectionTitle}
          >
            Sub - Speciality
          </Typography>
          <Typography
            variant="caption"
            color={colors.textSecondary}
            style={styles.sectionSubtitle}
          >
            (i. e. Cataract, Refractive Surgery, Vitreo-Retina, Cornea etc)
          </Typography>
          <View style={styles.orangeAccentBar} />
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            State Registered *
          </Typography>
          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => {
              setStateSearch('');
              setStateModalVisible(true);
            }}
            activeOpacity={0.8}
          >
            <Typography
              variant="bodyMd"
              color={stateRegistered ? colors.textPrimary : colors.textMuted}
              numberOfLines={1}
              style={styles.dropdownText}
            >
              {stateRegistered || 'Enter State'}
            </Typography>
            <ChevronDownIcon size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            Registration No. *
          </Typography>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Registration No."
            placeholderTextColor={colors.textMuted}
            value={registrationNo}
            onChangeText={setRegistrationNo}
          />
        </View>

        <View style={styles.uploadCard}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.uploadTitle}
          >
            Upload Certificate*
          </Typography>
          <View style={styles.fileActionRow}>
            <TouchableOpacity
              style={styles.chooseFileButton}
              onPress={() => handlePickFile(name => setCertificateName(name))}
              activeOpacity={0.8}
            >
              <Typography
                variant="bodySm"
                weight="bold"
                color={colors.primaryNavy}
              >
                Choose Files
              </Typography>
            </TouchableOpacity>
            <View style={styles.fileSelectedBox}>
              <Typography
                variant="bodySm"
                color={certificateName ? colors.primaryNavy : colors.textMuted}
                numberOfLines={1}
                weight={certificateName ? 'medium' : 'regular'}
                style={styles.fileSelectedText}
              >
                {certificateName || 'no files selected'}
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.specialityHeaderBox}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
          >
            *Speciality (Maximum Three)
          </Typography>
          <Typography variant="caption" color={colors.textMuted}>
            Select up to 3 sub-specialities ({selectedSpecialities.length}/3
            selected)
          </Typography>
        </View>

        <View style={styles.specialityList}>
          {SPECIALITY_OPTIONS.map(item => {
            const isChecked = selectedSpecialities.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.specialityItem,
                  isChecked && styles.specialityItemActive,
                ]}
                onPress={() => toggleSpeciality(item)}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.checkboxSquare,
                    isChecked && styles.checkboxSquareActive,
                  ]}
                >
                  {isChecked && <CheckIcon size={11} color={colors.white} />}
                </View>
                <Typography
                  variant="bodySm"
                  color={isChecked ? colors.secondaryRoyal : colors.textPrimary}
                  weight={isChecked ? 'bold' : 'regular'}
                  style={styles.specialityItemText}
                >
                  {item}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.tertiarySaffron}
            style={styles.sectionTitle}
          >
            Proposed by
          </Typography>
          <View style={styles.tealAccentBar} />
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            Membership No *
          </Typography>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Membership No"
            placeholderTextColor={colors.textMuted}
            value={proposerMembershipNo}
            onChangeText={setProposerMembershipNo}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            Name*
          </Typography>
          <TextInput
            style={styles.textInput}
            placeholder="Proposed By"
            placeholderTextColor={colors.textMuted}
            value={proposerName}
            onChangeText={setProposerName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            Mobile No.*
          </Typography>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Mobile No"
            placeholderTextColor={colors.textMuted}
            value={proposerMobile}
            onChangeText={setProposerMobile}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            Email Id*
          </Typography>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Email Id"
            placeholderTextColor={colors.textMuted}
            value={proposerEmail}
            onChangeText={setProposerEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.consentCheckboxRow}
          onPress={() => setProposerConsent(!proposerConsent)}
          activeOpacity={0.75}
        >
          <View
            style={[
              styles.checkboxSquare,
              proposerConsent && styles.checkboxSquareActive,
            ]}
          >
            {proposerConsent && <CheckIcon size={11} color={colors.white} />}
          </View>
          <Typography
            variant="bodySm"
            weight={proposerConsent ? 'bold' : 'regular'}
            color={colors.textPrimary}
          >
            I have taken consent from Proposer
          </Typography>
        </TouchableOpacity>

        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.tertiarySaffron}
            style={styles.sectionTitle}
          >
            Seconded by
          </Typography>
          <View style={styles.tealAccentBar} />
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            Membership No *
          </Typography>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Membership No"
            placeholderTextColor={colors.textMuted}
            value={seconderMembershipNo}
            onChangeText={setSeconderMembershipNo}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            Name*
          </Typography>
          <TextInput
            style={styles.textInput}
            placeholder="Seconded By"
            placeholderTextColor={colors.textMuted}
            value={seconderName}
            onChangeText={setSeconderName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            Mobile No.*
          </Typography>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Mobile No"
            placeholderTextColor={colors.textMuted}
            value={seconderMobile}
            onChangeText={setSeconderMobile}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            Email Id*
          </Typography>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Email Id"
            placeholderTextColor={colors.textMuted}
            value={seconderEmail}
            onChangeText={setSeconderEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.consentCheckboxRow}
          onPress={() => setSeconderConsent(!seconderConsent)}
          activeOpacity={0.75}
        >
          <View
            style={[
              styles.checkboxSquare,
              seconderConsent && styles.checkboxSquareActive,
            ]}
          >
            {seconderConsent && <CheckIcon size={11} color={colors.white} />}
          </View>
          <Typography
            variant="bodySm"
            weight={seconderConsent ? 'bold' : 'regular'}
            color={colors.textPrimary}
          >
            I have taken consent from Seconder
          </Typography>
        </TouchableOpacity>

        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.tertiarySaffron}
            style={styles.sectionTitle}
          >
            Government ID Proofs
          </Typography>
          <View style={styles.tealAccentBar} />
        </View>
        <View style={styles.fieldGroup}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fieldLabel}
          >
            Please select id proof which you wish to upload *
          </Typography>
          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => setGovIdModalVisible(true)}
            activeOpacity={0.8}
          >
            <Typography
              variant="bodyMd"
              color={colors.textPrimary}
              style={styles.dropdownText}
            >
              {govIdType}
            </Typography>
            <ChevronDownIcon size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        <View style={styles.uploadCard}>
          <Typography
            variant="labelSm"
            weight="bold"
            color={colors.textPrimary}
            style={styles.uploadTitle}
          >
            Upload Certificate *
          </Typography>
          <View style={styles.fileActionRow}>
            <TouchableOpacity
              style={styles.chooseFileButton}
              onPress={() => handlePickFile(name => setGovIdFile(name))}
              activeOpacity={0.8}
            >
              <Typography
                variant="bodySm"
                weight="bold"
                color={colors.primaryNavy}
              >
                Choose Files
              </Typography>
            </TouchableOpacity>
            <View style={styles.fileSelectedBox}>
              <Typography
                variant="bodySm"
                color={govIdFile ? colors.primaryNavy : colors.textMuted}
                numberOfLines={1}
                weight={govIdFile ? 'medium' : 'regular'}
                style={styles.fileSelectedText}
              >
                {govIdFile || 'no files selected'}
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.tertiarySaffron}
            style={styles.sectionTitle}
          >
            * AIOS - Go Green Initiative
          </Typography>
          <View style={styles.tealAccentBar} />
        </View>

        <View style={styles.goGreenTableContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.goGreenTable}>
              <View style={styles.goGreenTableHeaderRow}>
                <View style={styles.goGreenColTitle}></View>
                <View style={styles.goGreenColRadioHeader}>
                  <Typography
                    variant="caption"
                    weight="bold"
                    color={colors.textPrimary}
                    style={styles.radioHeaderText}
                  >
                    I need hard copy
                  </Typography>
                </View>
                <View style={styles.goGreenColRadioHeader}>
                  <Typography
                    variant="caption"
                    weight="bold"
                    color={colors.textPrimary}
                    style={styles.radioHeaderText}
                  >
                    Online version
                  </Typography>
                </View>
                <View style={styles.goGreenColRadioHeader}>
                  <Typography
                    variant="caption"
                    weight="bold"
                    color={colors.textPrimary}
                    style={styles.radioHeaderText}
                  >
                    I need both
                  </Typography>
                </View>
              </View>

              {GO_GREEN_PUBLICATIONS.map(pub => {
                const selected = goGreenSelections[pub.id];
                return (
                  <View key={pub.id} style={styles.goGreenTableRow}>
                    <View style={styles.goGreenColTitle}>
                      <Typography
                        variant="bodySm"
                        color={colors.textPrimary}
                        style={styles.pubTitleText}
                      >
                        {pub.title}
                      </Typography>
                    </View>
                    <TouchableOpacity
                      style={styles.goGreenColRadio}
                      onPress={() => handleSelectGoGreen(pub.id, 'hard_copy')}
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
                          selected === 'both' && styles.radioCircleSmallActive,
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

        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.tertiarySaffron}
            style={styles.sectionTitle}
          >
            * Use of your mobile number (please tick)
          </Typography>
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
                styles.radioCircle,
                mobileConsent === 'office_only' && styles.radioCircleActive,
              ]}
            >
              {mobileConsent === 'office_only' && (
                <View style={styles.radioDot} />
              )}
            </View>
            <Typography
              variant="bodySm"
              color={colors.textPrimary}
              style={styles.mobileConsentText}
            >
              My{' '}
              <Typography
                variant="bodySm"
                weight="bold"
                color={colors.textPrimary}
              >
                mobile number
              </Typography>{' '}
              should be used only for AIOS Office purpose.
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mobileConsentRow}
            onPress={() => setMobileConsent('can_be_shared')}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.radioCircle,
                mobileConsent === 'can_be_shared' && styles.radioCircleActive,
              ]}
            >
              {mobileConsent === 'can_be_shared' && (
                <View style={styles.radioDot} />
              )}
            </View>
            <Typography
              variant="bodySm"
              color={colors.textPrimary}
              style={styles.mobileConsentText}
            >
              My{' '}
              <Typography
                variant="bodySm"
                weight="bold"
                color={colors.textPrimary}
              >
                mobile number
              </Typography>{' '}
              can be shared with other (as per office policy) if they ask for it
              apart from official purpose as well.
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.tertiarySaffron}
            style={styles.sectionTitle}
          >
            * Use of your email id (please tick)
          </Typography>
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
                styles.radioCircle,
                emailConsent === 'office_only' && styles.radioCircleActive,
              ]}
            >
              {emailConsent === 'office_only' && (
                <View style={styles.radioDot} />
              )}
            </View>
            <Typography
              variant="bodySm"
              color={colors.textPrimary}
              style={styles.mobileConsentText}
            >
              My{' '}
              <Typography
                variant="bodySm"
                weight="bold"
                color={colors.textPrimary}
              >
                email id
              </Typography>{' '}
              should be used only for AIOS Office purpose.
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mobileConsentRow}
            onPress={() => setEmailConsent('can_be_shared')}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.radioCircle,
                emailConsent === 'can_be_shared' && styles.radioCircleActive,
              ]}
            >
              {emailConsent === 'can_be_shared' && (
                <View style={styles.radioDot} />
              )}
            </View>
            <Typography
              variant="bodySm"
              color={colors.textPrimary}
              style={styles.mobileConsentText}
            >
              My{' '}
              <Typography
                variant="bodySm"
                weight="bold"
                color={colors.textPrimary}
              >
                email id
              </Typography>{' '}
              can be shared with other (as per office policy) if they ask for it
              apart from official purpose as well.
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />
        <View style={styles.fbsHeaderRow}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.textPrimary}
            style={styles.fbsTitle}
          >
            Wish to join FBS AIOS{' '}
            <Typography
              variant="caption"
              color={colors.error}
              style={styles.fbsSubtitle}
            >
              Verify the terms & conditions by clicking the button
            </Typography>
          </Typography>
        </View>

        {/* 3 FBS Terms Checkboxes */}
        <View style={styles.fbsTermsList}>
          {/* Term 1 */}
          <TouchableOpacity
            style={styles.fbsTermRow}
            onPress={() => setFbsTerms1(!fbsTerms1)}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.checkboxSquare,
                fbsTerms1 && styles.checkboxSquareActive,
              ]}
            >
              {fbsTerms1 && <CheckIcon size={11} color={colors.white} />}
            </View>
            <Typography
              variant="bodySm"
              color={colors.textPrimary}
              style={styles.fbsTermText}
            >
              <Typography variant="bodySm" color={colors.error}>
                *{' '}
              </Typography>
              AIOS facilitates a Family Benefit Scheme (AIOS FBS) for benefit of
              its life members. This is a voluntary scheme in which life members
              can participate.
            </Typography>
          </TouchableOpacity>

          {/* Term 2 */}
          <TouchableOpacity
            style={styles.fbsTermRow}
            onPress={() => setFbsTerms2(!fbsTerms2)}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.checkboxSquare,
                fbsTerms2 && styles.checkboxSquareActive,
              ]}
            >
              {fbsTerms2 && <CheckIcon size={11} color={colors.white} />}
            </View>
            <Typography
              variant="bodySm"
              color={colors.textPrimary}
              style={styles.fbsTermText}
            >
              <Typography variant="bodySm" color={colors.error}>
                *{' '}
              </Typography>
              AIOS FBS is an independent registered society and is a separate
              entity from AIOS. AIOS only acts as a facilitator for members and
              has no role in the governance of the FBS.
            </Typography>
          </TouchableOpacity>

          {/* Term 3 */}
          <TouchableOpacity
            style={styles.fbsTermRow}
            onPress={() => setFbsTerms3(!fbsTerms3)}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.checkboxSquare,
                fbsTerms3 && styles.checkboxSquareActive,
              ]}
            >
              {fbsTerms3 && <CheckIcon size={11} color={colors.white} />}
            </View>
            <Typography
              variant="bodySm"
              color={colors.textPrimary}
              style={styles.fbsTermText}
            >
              <Typography variant="bodySm" color={colors.error}>
                *{' '}
              </Typography>
              The FBS is governed by its own set of rules and regulations and
              AIOS does not take responsibility for the running of the scheme.
            </Typography>
          </TouchableOpacity>
        </View>

        {/* FBS Interest Radio Options */}
        <View style={styles.fbsRadioGroup}>
          {/* I am interested */}
          <TouchableOpacity
            style={styles.fbsRadioRow}
            onPress={() => setFbsInterest('interested')}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.radioCircle,
                fbsInterest === 'interested' && styles.radioCircleActive,
              ]}
            >
              {fbsInterest === 'interested' && <View style={styles.radioDot} />}
            </View>
            <Typography
              variant="bodyMd"
              weight="bold"
              color={colors.textPrimary}
            >
              I am interested
            </Typography>
          </TouchableOpacity>

          {/* I am not interested */}
          <TouchableOpacity
            style={styles.fbsRadioRow}
            onPress={() => setFbsInterest('not_interested')}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.radioCircle,
                fbsInterest === 'not_interested' && styles.radioCircleActive,
              ]}
            >
              {fbsInterest === 'not_interested' && (
                <View style={styles.radioDot} />
              )}
            </View>
            <Typography
              variant="bodyMd"
              weight="bold"
              color={colors.textPrimary}
            >
              I am not interested
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* ========================================================= */}
        {/* SECTION 8: AMOUNT & DECLARATION */}
        {/* ========================================================= */}
        <View style={styles.amountDeclarationSection}>
          <Typography
            variant="headlineLg"
            weight="bold"
            color={colors.primaryNavy}
            style={styles.amountTitle}
          >
            Amount : INR 10700
          </Typography>

          <Typography
            variant="bodySm"
            weight="bold"
            color={colors.tertiarySaffron}
            style={styles.handlingNotice}
          >
            An Internet Handling Charges of Rs. 330 will be applied. Details
            will be shown at the checkout page.
          </Typography>

          {/* Final Life Member Declaration Checkbox */}
          <TouchableOpacity
            style={styles.declarationRow}
            onPress={() => setDeclarationAccepted(!declarationAccepted)}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.checkboxSquare,
                declarationAccepted && styles.checkboxSquareActive,
              ]}
            >
              {declarationAccepted && (
                <CheckIcon size={11} color={colors.white} />
              )}
            </View>
            <Typography
              variant="bodySm"
              color={colors.textPrimary}
              style={styles.declarationText}
            >
              I hereby declare that all the above details are correct. I wish to
              be a Life member. I have carefully read the instructions. I shall
              abide by the Rules, Regulations & Bye-Laws of the Society as in
              force and any subsequent amendment(s) made from time to time.
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.paymentSummaryCard}>
          <View style={styles.paymentCardHeader}>
            <DocumentIcon size={18} color={colors.white} />
            <Typography
              variant="headlineSm"
              weight="bold"
              color={colors.white}
              style={styles.paymentCardTitle}
            >
              Payment Summary
            </Typography>
          </View>

          <View style={styles.paymentCardBody}>
            {/* Reg Fee Row */}
            <View style={styles.paymentLineRow}>
              <Typography variant="bodyMd" color="rgba(255, 255, 255, 0.85)">
                Reg. Fee
              </Typography>
              <Typography variant="bodyMd" weight="bold" color={colors.white}>
                10700/-
              </Typography>
            </View>

            {/* Handling Charges Row */}
            <View style={styles.paymentLineRow}>
              <Typography variant="bodyMd" color="rgba(255, 255, 255, 0.85)">
                Internet Handling Charges
              </Typography>
              <Typography variant="bodyMd" weight="bold" color={colors.white}>
                330/-
              </Typography>
            </View>

            <View style={styles.paymentInnerDivider} />

            {/* Total Row */}
            <View style={styles.paymentLineRow}>
              <Typography
                variant="bodyMd"
                weight="bold"
                color={colors.tertiarySaffron}
              >
                Total Amount
              </Typography>
              <Typography
                variant="headlineSm"
                weight="bold"
                color={colors.tertiarySaffron}
              >
                ₹ 11,030/-
              </Typography>
            </View>

            {/* Captcha Section */}
            <View style={styles.captchaSection}>
              <Typography
                variant="caption"
                color="rgba(255, 255, 255, 0.9)"
                style={styles.captchaPrompt}
              >
                Enter the contents of image :
              </Typography>

              {/* Captcha Badge + Input in One Clean Line */}
              <View style={styles.captchaInputRow}>
                <TouchableOpacity
                  style={styles.captchaBadge}
                  onPress={handleRefreshCaptcha}
                  activeOpacity={0.7}
                >
                  <Typography
                    variant="headlineSm"
                    weight="bold"
                    color={colors.primaryNavy}
                    style={styles.captchaBadgeText}
                  >
                    {captchaCode}
                  </Typography>
                </TouchableOpacity>

                <TextInput
                  style={styles.captchaTextInput}
                  placeholder="Enter Captcha"
                  placeholderTextColor="#94A3B8"
                  value={captchaInput}
                  onFocus={() => {
                    captchaFocused.current = true;
                    requestAnimationFrame(scrollToCaptcha);
                  }}
                  onBlur={() => { captchaFocused.current = false; }}
                  onChangeText={setCaptchaInput}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Pay Now Button */}
            <TouchableOpacity
              style={styles.payNowButton}
              onPress={handlePayNow}
              activeOpacity={0.85}
            >
              <Typography variant="labelLg" weight="bold" color={colors.white}>
                Pay Now
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      </ScrollView>
      </KeyboardAvoidingView>

      {/* State Selection Modal */}
      <Modal
        visible={stateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setStateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Typography
                variant="headlineSm"
                weight="bold"
                color={colors.primaryNavy}
              >
                Select State
              </Typography>
              <TouchableOpacity
                onPress={() => setStateModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <CloseIcon size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search State..."
              placeholderTextColor={colors.textMuted}
              value={stateSearch}
              onChangeText={setStateSearch}
            />

            <FlatList
              data={filteredStates}
              keyExtractor={item => item}
              showsVerticalScrollIndicator
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOptionItem}
                  onPress={() => {
                    setStateRegistered(item);
                    setStateModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Typography variant="bodyMd" color={colors.textPrimary}>
                    {item}
                  </Typography>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Gov ID Selection Modal */}
      <Modal
        visible={govIdModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGovIdModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Typography
                variant="headlineSm"
                weight="bold"
                color={colors.primaryNavy}
              >
                Select ID Proof
              </Typography>
              <TouchableOpacity
                onPress={() => setGovIdModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <CloseIcon size={16} color={colors.textMuted} />
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
                <Typography
                  variant="bodyMd"
                  weight={govIdType === item ? 'bold' : 'regular'}
                  color={
                    govIdType === item
                      ? colors.secondaryRoyal
                      : colors.textPrimary
                  }
                >
                  {item}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </Background>
  );
};

const styles = StyleSheet.create({
  fixedLayout: { flex: 1, paddingTop: 8 },
  formScroll: { flex: 1 },
  container: {
    paddingBottom: 32,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerTitleContainer: {
    flex: 1,
  },

  /* Main Card */
  mainCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    marginHorizontal: 14,
    marginTop: 14,
    padding: 18,
    ...shadows.level1,
  },

  /* Section Header */
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  orangeAccentBar: {
    width: 48,
    height: 2.5,
    backgroundColor: colors.tertiarySaffron,
    borderRadius: 1.5,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderNeutral,
    marginVertical: 20,
  },

  /* Form Fields */
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    marginBottom: 6,
    fontSize: 13,
  },
  textInput: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.borderField,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.textPrimary,
  },

  /* Radio Row */
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    marginTop: 4,
    paddingVertical: 4,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderFieldHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: colors.secondaryRoyal,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.secondaryRoyal,
  },

  /* Upload Card */
  uploadCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 14,
  },
  uploadTitle: {
    marginBottom: 8,
    fontSize: 13,
  },
  fileActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chooseFileButton: {
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  fileSelectedBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    justifyContent: 'center',
  },
  fileSelectedText: {
    fontSize: 12,
  },
  helperNotice: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 6,
  },

  /* Qualifications Box */
  qualificationBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 14,
  },
  qualificationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  qualificationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteSingleDegreeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  degreeIndexBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primaryNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  degreeActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
    marginBottom: 6,
  },
  addDegreeButton: {
    flex: 1,
    backgroundColor: colors.primaryNavy,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteDegreeButton: {
    flex: 1,
    backgroundColor: colors.primaryNavy,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Dropdown Input */
  dropdownInput: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.borderField,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
  },

  /* Speciality Checkboxes */
  specialityHeaderBox: {
    marginBottom: 10,
    marginTop: 4,
  },
  specialityList: {
    gap: 8,
    marginBottom: 8,
  },
  specialityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    gap: 10,
  },
  specialityItemActive: {
    borderColor: colors.secondaryRoyal,
    backgroundColor: '#EFF6FF',
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.8,
    borderColor: colors.borderFieldHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSquareActive: {
    backgroundColor: colors.secondaryRoyal,
    borderColor: colors.secondaryRoyal,
  },
  specialityItemText: {
    flex: 1,
    fontSize: 13,
  },

  /* Payment Summary Card */
  paymentSummaryCard: {
    backgroundColor: colors.primaryNavy,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 6,
    ...shadows.level2,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
  },
  paymentCardTitle: {
    fontSize: 17,
  },
  paymentCardBody: {
    padding: 16,
  },
  paymentLineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  paymentInnerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 10,
  },
  captchaSection: {
    marginTop: 14,
    marginBottom: 16,
  },
  captchaPrompt: {
    marginBottom: 8,
  },
  captchaInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  captchaBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captchaBadgeText: {
    letterSpacing: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 18,
  },
  captchaTextInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.textPrimary,
  },
  payNowButton: {
    backgroundColor: colors.tertiarySaffron,
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.md,
    maxHeight: '75%',
    padding: spacing.spaceMd,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderNeutral,
    marginBottom: 10,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalSearchInput: {
    height: 42,
    borderWidth: 1,
    borderColor: colors.borderField,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  modalOptionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainer,
  },

  /* Teal Accent Bar */
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
    marginBottom: 8,
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
    borderColor: colors.secondaryRoyal,
  },
  radioDotSmall: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.secondaryRoyal,
  },

  /* Mobile Consent Section */
  mobileConsentList: {
    gap: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  mobileConsentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 6,
  },
  mobileConsentText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },

  /* Consent Checkbox Row */
  consentCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },

  /* FBS Section */
  fbsHeaderRow: {
    marginBottom: 8,
  },
  fbsTitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  fbsSubtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
  fbsTermsList: {
    gap: 10,
    marginTop: 6,
    marginBottom: 12,
  },
  fbsTermRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  fbsTermText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  fbsRadioGroup: {
    gap: 12,
    marginTop: 6,
    marginBottom: 6,
  },
  fbsRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
  },

  /* Amount & Declaration Section */
  amountDeclarationSection: {
    paddingVertical: 4,
  },
  amountTitle: {
    fontSize: 22,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  handlingNotice: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  declarationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 4,
  },
  declarationText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
});

export default BecomeMemberScreen;
