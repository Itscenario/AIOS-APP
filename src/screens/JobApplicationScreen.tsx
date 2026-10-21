import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Platform,
  Modal,
  Alert,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import {
  ArrowBackIcon,
  CheckIcon,
  CloseIcon,
  DocumentIcon,
  HospitalIcon,
  LocationPinIcon,
  MailIcon,
  PhoneIcon,
  VerifiedBadgeIcon,
  WhatsAppIcon,
} from '../components/Icons';
import { pickDocumentFile, FilePickerResult } from '../components/FilePicker';
import type { RootStackParamList } from '../navigation/types';

type JobApplicationRouteProp = RouteProp<RootStackParamList, 'JobApplication'>;

export const JobApplicationScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<JobApplicationRouteProp>();
  const job = route.params?.job;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cityOfEmployment, setCityOfEmployment] = useState('');
  const [cvFile, setCvFile] = useState<FilePickerResult | null>(null);
  const [comment, setComment] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e?.endCoordinates?.height ?? 280);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const handlePickCV = async () => {
    try {
      const result = await pickDocumentFile();
      if (result) {
        setCvFile(result);
        clearFieldError('cv');
      }
    } catch {
      Alert.alert(
        'File Selection',
        'Unable to pick document. Please try again.',
      );
    }
  };

  const handleOpenCV = async () => {
    if (!cvFile?.uri) return;
    try {
      await Linking.openURL(cvFile.uri);
    } catch {
      Alert.alert(
        'Open Document',
        `File: ${cvFile.name}\nUnable to preview directly. Please check installed PDF/document viewer app.`,
      );
    }
  };

  const handleRemoveCV = () => {
    setCvFile(null);
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const digitsOnly = phone.replace(/[^0-9]/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (digitsOnly.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!cityOfEmployment.trim()) {
      newErrors.cityOfEmployment = 'City of Employment is required';
    } else if (cityOfEmployment.trim().length < 2) {
      newErrors.cityOfEmployment = 'Please enter a valid city name';
    }

    if (!cvFile) {
      newErrors.cv = 'Curriculum Vitae (CV) is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    setIsSuccessModalVisible(true);
  };

  const handleWhatsApp = () => {
    if (!job) return;
    const text = `Hello, I am applying for the position of "${
      job.positionTitle
    }" at "${job.hospitalName}".\nName: ${fullName || 'Applicant'}\nPhone: ${
      phone || 'N/A'
    }\nEmail: ${email || 'N/A'}\nCity of Employment: ${
      cityOfEmployment || 'N/A'
    }`;
    Linking.openURL(
      `https://wa.me/91${
        job.whatsappNumber || job.phone
      }?text=${encodeURIComponent(text)}`,
    );
  };

  const handleEmail = () => {
    if (!job) return;
    const subject = `Job Application: ${job.positionTitle} - ${
      fullName || 'Applicant'
    }`;
    const body = `Respected Medical Director / HR,\n\nI am applying for the ${
      job.positionTitle
    } opening at ${job.hospitalName}.\n\nName: ${
      fullName || 'Applicant'
    }\nEmail: ${email || 'N/A'}\nPhone: ${
      phone || 'N/A'
    }\nCity of Employment: ${cityOfEmployment || 'N/A'}\n\nComment / Note:\n${
      comment || 'None'
    }\n\nPlease find my resume attached.\n\nWarm regards,\n${
      fullName || 'Applicant'
    }`;
    Linking.openURL(
      `mailto:${job.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`,
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingLeft: insets.left, paddingRight: insets.right },
      ]}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <ArrowBackIcon size={20} color={colors.primaryNavy} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Job Application</Text>
        </View>
      </View>

      {job && (
        <View style={styles.jobSummaryFixedContainer}>
          <View style={styles.jobSummaryCard}>
            <View style={styles.jobHospitalRow}>
              <View style={styles.hospitalIconBadge}>
                <HospitalIcon size={20} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.jobHospitalName}>{job.hospitalName}</Text>
                  <View style={{ marginLeft: 4 }}>
                    <VerifiedBadgeIcon size={14} color="#0284C7" />
                  </View>
                </View>
                <View style={styles.jobLocationRow}>
                  <LocationPinIcon size={12} color="#64748B" />
                  <Text style={styles.jobLocationText}>{job.location}</Text>
                </View>
              </View>
            </View>

            <View style={styles.jobDivider} />

            <Text style={styles.jobPositionTitle}>{job.positionTitle}</Text>
            <View style={styles.jobMetaRow}>
              <View style={styles.deadlineBadge}>
                <Text style={styles.deadlineBadgeText}>
                  ⏰ Deadline: {job.deadline || 'Active'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              keyboardHeight > 0 ? keyboardHeight + 10 : insets.bottom + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        scrollEventThrottle={16}
        bounces={true}
        alwaysBounceVertical={true}
      >
        <View style={styles.formCard}>
          <Text style={styles.formSectionTitle}>Application Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Full Name <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={text => {
                setFullName(text);
                clearFieldError('fullName');
              }}
              placeholder="Enter full name"
              placeholderTextColor="#94A3B8"
            />
            {errors.fullName ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.fullName}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Email Address <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={text => {
                setEmail(text);
                clearFieldError('email');
              }}
              keyboardType="email-address"
              placeholder="Enter email address"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.email}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Phone Number <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={text => {
                setPhone(text);
                clearFieldError('phone');
              }}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              placeholderTextColor="#94A3B8"
              maxLength={15}
            />
            {errors.phone ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.phone}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              City of Employment <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              value={cityOfEmployment}
              onChangeText={text => {
                setCityOfEmployment(text);
                clearFieldError('cityOfEmployment');
              }}
              placeholder="Enter city of employment"
              placeholderTextColor="#94A3B8"
            />
            {errors.cityOfEmployment ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.cityOfEmployment}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Curriculum Vitae (CV){' '}
              <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            {cvFile ? (
              <View style={styles.cvAttachedCard}>
                <TouchableOpacity
                  style={styles.cvInfoPressable}
                  onPress={handleOpenCV}
                  activeOpacity={0.7}
                >
                  <View style={styles.cvIconCircle}>
                    <DocumentIcon size={20} color="#059669" />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 10 }}>
                    <Text style={styles.resumeFileName} numberOfLines={1}>
                      {cvFile.name}
                    </Text>
                    <Text style={styles.resumeFileSize}>
                      {cvFile.size
                        ? `${formatFileSize(cvFile.size)} • Tap to open`
                        : 'Tap to open document'}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cvRemoveButton}
                  onPress={handleRemoveCV}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.7}
                >
                  <CloseIcon size={14} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.resumeAttachBtn}
                onPress={handlePickCV}
                activeOpacity={0.8}
              >
                <DocumentIcon size={20} color="#64748B" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.uploadCVTitle}>
                    Upload CV / Resume (PDF, DOC)
                  </Text>
                  <Text style={styles.uploadCVSubtext}>
                    Tap to browse and select file from device
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            {errors.cv ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.cv}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Comment (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textAreaInput]}
              value={comment}
              onChangeText={setComment}
              placeholder="Write comment or note (optional)..."
              placeholderTextColor="#94A3B8"
              multiline={true}
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>Submit Application</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.directContactSection}>
          <Text style={styles.directContactHeading}>Or Contact Directly</Text>
          <View style={styles.directContactButtonsRow}>
            <TouchableOpacity
              style={styles.directWhatsAppBtn}
              onPress={handleWhatsApp}
              activeOpacity={0.8}
            >
              <WhatsAppIcon size={16} color="#FFFFFF" />
              <Text style={styles.directBtnText}>Apply on WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.directEmailBtn}
              onPress={handleEmail}
              activeOpacity={0.8}
            >
              <MailIcon size={16} color="#FFFFFF" />
              <Text style={styles.directBtnText}>Send Email CV</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isSuccessModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.successCheckCircle}>
              <CheckIcon size={24} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>Application Submitted!</Text>
            <Text style={styles.successDesc}>
              Your application for{' '}
              <Text style={{ fontWeight: '700', color: '#1E293B' }}>
                {job?.positionTitle || 'this position'}
              </Text>{' '}
              at{' '}
              <Text style={{ fontWeight: '700', color: '#1E293B' }}>
                {job?.hospitalName || 'the employer'}
              </Text>{' '}
              has been successfully received.
            </Text>

            <View style={styles.successDetailsBox}>
              <Text style={styles.successDetailText}>
                • Applicant: {fullName}
              </Text>
              <Text style={styles.successDetailText}>• Phone: {phone}</Text>
              <Text style={styles.successDetailText}>
                • City: {cityOfEmployment}
              </Text>
              <Text style={styles.successDetailText}>
                • CV: {cvFile?.name || 'Attached'}
              </Text>
              <Text style={styles.successDetailText}>
                • Confirmation sent to {email}
              </Text>
              <Text style={styles.successDetailText}>
                • Ref ID: AIOS-APP-{Math.floor(100000 + Math.random() * 900000)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => {
                setIsSuccessModalVisible(false);
                navigation.goBack();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>Back to Jobs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  verifiedHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  verifiedHeaderText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 4,
  },
  jobSummaryFixedContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  jobSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 0,
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
  jobHospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  jobHospitalName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  jobLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  jobLocationText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
  },
  jobDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  jobPositionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  jobMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  deadlineBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deadlineBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#B45309',
  },
  hrContactText: {
    fontSize: 11,
    color: '#64748B',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
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
  formSectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 5,
  },
  requiredAsterisk: {
    color: '#DC2626',
    fontWeight: '800',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 13,
    color: '#0F172A',
  },
  errorContainer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  errorText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
    textAlign: 'right',
  },
  textAreaInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  resumeAttachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
  },
  uploadCVTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  uploadCVSubtext: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  cvAttachedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 8,
    padding: 10,
  },
  cvInfoPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cvIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cvRemoveButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeFileName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  resumeFileSize: {
    fontSize: 10.5,
    color: '#059669',
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#1D4ED8',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  directContactSection: {
    marginTop: 16,
  },
  directContactHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 10,
    textAlign: 'center',
  },
  directContactButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  directWhatsAppBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  directEmailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  directBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  successCheckCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  successDesc: {
    fontSize: 12.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  successDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginBottom: 16,
    gap: 4,
  },
  successDetailText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  doneBtn: {
    width: '100%',
    backgroundColor: '#1D4ED8',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});

export default JobApplicationScreen;
