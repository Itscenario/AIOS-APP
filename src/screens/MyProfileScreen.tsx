import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../store';
import { updateProfile, UserProfile } from '../store/slices/authSlice';
import {
  ArrowBackIcon,
  CalendarPickerModal,
  ProfileImagePicker,
} from '../components';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { formatProfileName } from '../utils/profileName';


const OPTIONS = {
  title: ['Dr.', 'Prof.'],
  gender: ['Male', 'Female', 'Other'],
  memberType: ['Life Member', 'Associate Member', 'International Member'],
  organizationType: ['Government', 'Private', 'Other'],
};
type PickerField = keyof typeof OPTIONS;
const SPECIALITIES = [
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
const countWords = (value: string) =>
  value.trim() ? value.trim().split(/\s+/).length : 0;

export const MyProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(state => state.auth.profile);
  const [form, setForm] = useState<UserProfile>(() => ({ ...profile }));
  const [picker, setPicker] = useState<PickerField | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const viewportRef = useRef<React.ElementRef<typeof View>>(null);
  const keyboardTop = useRef<number | null>(null);
  const [keyboardOverlap, setKeyboardOverlap] = useState(0);
  const measureKeyboardOverlap = () => {
    if (Platform.OS !== 'android') return;
    viewportRef.current?.measureInWindow((_x, y, _width, height) => {
      setKeyboardOverlap(
        keyboardTop.current === null
          ? 0
          : Math.max(0, y + height - keyboardTop.current),
      );
    });
  };
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const show = Keyboard.addListener('keyboardDidShow', event => {
      keyboardTop.current = event.endCoordinates.screenY;
      requestAnimationFrame(measureKeyboardOverlap);
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
  const selectedSpecialities =
    form.specialities ||
    (form.speciality
      ? form.speciality
          .split(',')
          .map(value => value.trim())
          .filter(Boolean)
      : ['None']);
  const toggleSpeciality = (option: string) => {
    let next: string[];
    if (option === 'None') {
      next = ['None'];
    } else if (selectedSpecialities.includes(option)) {
      next = selectedSpecialities.filter(value => value !== option);
      if (!next.length) next = ['None'];
    } else {
      const current = selectedSpecialities.filter(value => value !== 'None');
      if (current.length >= 3) {
        Alert.alert(
          'Maximum three specialities',
          'Please deselect a speciality before choosing another.',
        );
        return;
      }
      next = [...current, option];
    }
    setForm(current => ({
      ...current,
      specialities: next,
      speciality: next.join(', '),
    }));
  };
  const setField = (field: keyof UserProfile, value: string | null) => {
    setForm(current => ({ ...current, [field]: value }));
  };
  const field = (
    label: string,
    key: keyof UserProfile,
    options: {
      readonly?: boolean;
      optional?: boolean;
      phone?: boolean;
      multiline?: boolean;
    } = {},
  ) => (
    <View style={styles.field} key={key}>
      <Text style={styles.label}>
        {label}
        {options.optional ? ' (Optional)' : ''}
      </Text>
      <TextInput
        style={[
          styles.input,
          options.readonly && styles.readonly,
          options.multiline && styles.multiline,
        ]}
        value={String(form[key] || '')}
        onChangeText={value => setField(key, value)}
        editable={!options.readonly}
        placeholder={
          options.readonly ? 'Not provided' : `Enter ${label.toLowerCase()}`
        }
        placeholderTextColor="#94A3B8"
        keyboardType={options.phone ? 'phone-pad' : 'default'}
        multiline={options.multiline}
        accessibilityLabel={label}
      />
    </View>
  );
  const dropdown = (label: string, key: PickerField) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.select}
        onPress={() => setPicker(key)}
        accessibilityRole="button"
        accessibilityLabel={`Select ${label}`}
      >
        <Text style={styles.value}>
          {form[key] || `Select ${label.toLowerCase()}`}
        </Text>
        <Text style={styles.chevron}>⌄</Text>
      </TouchableOpacity>
    </View>
  );
  const save = () => {
    if (countWords(form.biodata || '') > 300) {
      Alert.alert(
        'Biodata too long',
        'Please keep your biodata within 300 words.',
      );
      return;
    }
    dispatch(
      updateProfile({
        ...form,
        firstName: profile?.firstName,
        surname: profile?.surname,
        email: profile?.email,
        name: formatProfileName(
          [
            form.title,
            profile?.firstName ||
              profile?.name?.replace(
                /^(Dr\.?|Prof\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i,
                '',
              ),
            profile?.firstName ? profile?.surname : '',
          ]
            .filter(Boolean)
            .join(' '),
        ),
      }),
    );
    Alert.alert('Profile saved', 'Your profile details have been updated.');
  };

  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <AppHeader
        style={[styles.header, { paddingTop: insets.top + 12 }]}
        onLayout={({ nativeEvent }) =>
          setHeaderHeight(nativeEvent.layout.height)
        }
      >
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowBackIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
      </AppHeader>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS === 'ios'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
      >
        <View
          ref={viewportRef}
          style={styles.flex}
          onLayout={measureKeyboardOverlap}
          collapsable={false}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: Math.max(insets.bottom, 16) + keyboardOverlap },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            <View style={[styles.card, styles.profileCardElevation]}>
              <View style={styles.photo}>
                <ProfileImagePicker
                  imageUri={form.avatar}
                  onImageSelected={uri => setField('avatar', uri)}
                  onImageRemoved={() => setField('avatar', null)}
                />
              </View>
              <Text style={styles.section}>Personal information</Text>
              {dropdown('Title', 'title')}
              {field('First Name', 'firstName', { readonly: true })}
              {dropdown('Gender', 'gender')}
              <View style={styles.field}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity
                  style={styles.select}
                  onPress={() => setCalendarOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Select date of birth"
                >
                  <Text style={styles.value}>
                    {form.dob || 'Select date of birth'}
                  </Text>
                  <Text style={styles.chevron}>⌄</Text>
                </TouchableOpacity>
              </View>
              {field('Email', 'email', { readonly: true })}
              {field('Mobile Number', 'phone', { phone: true })}
              {field('Nationality', 'nationality')}
              {field('Passport Number', 'passportNo', { optional: true })}
              {dropdown('Member Type', 'memberType')}
            </View>
            <View style={styles.card}>
              <Text style={styles.section}>Professional details</Text>
              {field('Institute / Organization', 'institution')}
              <View style={styles.field}>
                <Text style={styles.organizationLabel}>
                  *Speciality{' '}
                  <Text style={styles.specialityHint}>(Maximum Three)</Text>
                </Text>
                {SPECIALITIES.map(option => {
                  const selected = selectedSpecialities.includes(option);
                  return (
                    <TouchableOpacity
                      key={option}
                      style={styles.radioOption}
                      onPress={() => toggleSpeciality(option)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected }}
                      accessibilityLabel={option}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          selected && styles.radioSelected,
                        ]}
                      >
                        {selected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={[styles.radioText, styles.specialityText]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.field}>
                <Text style={styles.organizationLabel}>
                  Type of Organization
                </Text>
                <View accessibilityRole="radiogroup">
                  {['Govt.', 'Private'].map(option => {
                    const selected =
                      form.organizationType === option ||
                      (option === 'Govt.' &&
                        form.organizationType === 'Government');
                    return (
                      <TouchableOpacity
                        key={option}
                        style={styles.radioOption}
                        onPress={() => setField('organizationType', option)}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selected }}
                        accessibilityLabel={option}
                      >
                        <View
                          style={[
                            styles.radioCircle,
                            selected && styles.radioSelected,
                          ]}
                        >
                          {selected && <View style={styles.radioDot} />}
                        </View>
                        <Text style={styles.radioText}>{option}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.section}>Address</Text>
              {field('House / Flat Number', 'houseNo')}
              {field('Street / Locality', 'street')}
              {field('Landmark', 'landmark')}
              {field('Country', 'country')}
              {field('State', 'state')}
              {field('City', 'city')}
              {field('PIN Code', 'pincode')}
            </View>
            <View style={styles.card}>
              <Text style={styles.section}>Biodata</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={form.biodata || ''}
                onChangeText={value => {
                  if (countWords(value) <= 300) setField('biodata', value);
                }}
                multiline
                scrollEnabled={false}
                placeholder="Tell us about your experience and interests"
                placeholderTextColor="#94A3B8"
                accessibilityLabel="Biodata, maximum 300 words"
              />
              <Text style={styles.wordCount}>
                {countWords(form.biodata || '')} / 300 words
              </Text>
            </View>
            <Button
              customLayout
              style={styles.save}
              onPress={save}
              accessibilityRole="button"
            >
              <Text style={styles.saveText}>Update</Text>
            </Button>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <CalendarPickerModal
        visible={calendarOpen}
        value={form.dob}
        onClose={() => setCalendarOpen(false)}
        onSelectDate={value => {
          setField('dob', value);
          setCalendarOpen(false);
        }}
      />
      <Modal
        visible={picker !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setPicker(null)}
      >
        <View style={styles.overlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.section}>Select an option</Text>
              <TouchableOpacity
                onPress={() => setPicker(null)}
                accessibilityRole="button"
              >
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
            {picker &&
              OPTIONS[picker].map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.option}
                  onPress={() => {
                    setField(picker, option);
                    setPicker(null);
                  }}
                  accessibilityRole="button"
                >
                  <Text style={styles.value}>{option}</Text>
                  {form[picker] === option && (
                    <Text style={styles.cancel}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0B1728',
    paddingHorizontal: 16,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1C2C42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#B8C7DB',
    fontSize: 12,
    marginTop: 4,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileCardElevation: {
    shadowColor: '#20385B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  photo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  section: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F294A',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    marginBottom: 7,
  },
  organizationLabel: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '700',
    marginBottom: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  radioText: {
    fontSize: 17,
    color: '#0F172A',
  },
  specialityHint: {
    fontWeight: '400',
    fontSize: 14,
  },
  specialityText: {
    flex: 1,
    lineHeight: 24,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 17,
    lineHeight: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    fontSize: 15,
  },
  readonly: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  select: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  value: {
    fontSize: 15,
    color: '#0F172A',
    flexShrink: 1,
  },
  chevron: {
    fontSize: 20,
    color: '#64748B',
  },
  multiline: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  wordCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
  save: {
    backgroundColor: '#996bb4',
    borderRadius: 12,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cancel: {
    color: '#0284C7',
    fontWeight: '700',
    fontSize: 15,
  },
  option: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MyProfileScreen;
