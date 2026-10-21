import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Country, State } from 'country-state-city';
import type { RootStackParamList } from '../navigation/types';
import { useAppDispatch } from '../store';
import { setCredentials } from '../store/slices/authSlice';
import {
  ArrowBackIcon,
  Background,
  Button,
  CalendarIcon,
  CalendarPickerModal,
  CheckIcon,
  EmailInput,
  GroupIcon,
  Image,
  images,
  PasswordInput,
  PhoneInput,
  ProfileImagePicker,
  Typography,
} from '../components';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validatePhone,
} from '../utils';
import { colors } from '../theme/colors';
import { rounded, shadows, spacing } from '../theme/spacing';

const TITLE_OPTIONS = ['Dr.', 'Prof.'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

interface PickerOption {
  label: string;
  value: string;
  extra?: string;
}
export const SignupScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Signup'>>();

  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (route.params?.emailVerified) {
      setIsEmailVerified(true);
      if (route.params.email) {
        setEmail(route.params.email);
      }
    }
  }, [route.params?.emailVerified, route.params?.email]);

  const handleOpenOtp = () => {
    navigation.navigate('OtpVerification', {
      email: email.trim() || 'doctor@hospital.org',
    });
  };
  const [title, setTitle] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const phoneDigits = phone.replace(/\D/g, '');
  const isPhoneVerified = verifiedPhone === phoneDigits;

  useEffect(() => {
    if (route.params?.phoneVerified && route.params.phone) {
      setPhone(route.params.phone);
      setVerifiedPhone(route.params.phone.replace(/\D/g, ''));
    }
  }, [route.params?.phoneVerified, route.params?.phone]);
  const [houseNo, setHouseNo] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [country, setCountry] = useState<string>('India');
  const [stateName, setStateName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [titleError, setTitleError] = useState<string | undefined>();
  const [surnameError, setSurnameError] = useState<string | undefined>();
  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [genderError, setGenderError] = useState<string | undefined>();
  const [dobError, setDobError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [houseNoError, setHouseNoError] = useState<string | undefined>();
  const [streetError, setStreetError] = useState<string | undefined>();
  const [landmarkError, setLandmarkError] = useState<string | undefined>();
  const [countryError, setCountryError] = useState<string | undefined>();
  const [stateError, setStateError] = useState<string | undefined>();
  const [cityError, setCityError] = useState<string | undefined>();
  const [pincodeError, setPincodeError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | undefined
  >();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalOptions, setModalOptions] = useState<PickerOption[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSelectField, setActiveSelectField] = useState<
    'title' | 'gender' | 'country' | 'state' | null
  >(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const handleSelectDob = (formattedDate: string) => {
    setDob(formattedDate);
    if (dobError) setDobError(undefined);
    setShowDatePicker(false);
  };

  const handlePincodeChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
    setPincode(cleaned);
    if (pincodeError) setPincodeError(undefined);
  };

  const openPicker = (
    fieldName: 'title' | 'gender',
    dialogTitle: string,
    options: string[],
  ) => {
    setActiveSelectField(fieldName);
    setModalTitle(dialogTitle);
    setSearchQuery('');
    setModalOptions(options.map(opt => ({ label: opt, value: opt })));
    setModalVisible(true);
  };

  const openCountryPicker = () => {
    setActiveSelectField('country');
    setModalTitle('Select Country');
    setSearchQuery('');
    const allCountries = Country.getAllCountries();
    const india = allCountries.find(c => c.isoCode === 'IN');
    const others = allCountries.filter(c => c.isoCode !== 'IN');
    const sorted = india ? [india, ...others] : allCountries;
    const countryList = sorted.map(c => ({
      label: `${c.flag ? c.flag + '  ' : ''}${c.name}`,
      value: c.isoCode,
      extra: c.name,
    }));
    setModalOptions(countryList);
    setModalVisible(true);
  };

  const openStatePicker = () => {
    setActiveSelectField('state');
    setModalTitle('Select State');
    setSearchQuery('');
    const states = State.getStatesOfCountry('IN');
    const stateList = states.map(s => ({
      label: s.name,
      value: s.name,
    }));
    setModalOptions(stateList);
    setModalVisible(true);
  };

  const handleSelectOption = (option: PickerOption) => {
    switch (activeSelectField) {
      case 'title':
        setTitle(option.value);
        if (titleError) setTitleError(undefined);
        break;
      case 'gender':
        setGender(option.value);
        if (genderError) setGenderError(undefined);
        break;
      case 'country':
        setCountry(option.extra || option.label);
        if (countryError) setCountryError(undefined);
        break;
      case 'state':
        setStateName(option.label);
        if (stateError) setStateError(undefined);
        break;
    }
    setModalVisible(false);
  };

  const filteredModalOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return modalOptions;
    }
    const q = searchQuery.toLowerCase();
    return modalOptions.filter(
      opt =>
        opt.label.toLowerCase().includes(q) ||
        (opt.extra && opt.extra.toLowerCase().includes(q)),
    );
  }, [modalOptions, searchQuery]);

  const handleSubmit = () => {
    let hasError = false;

    if (!title.trim()) {
      setTitleError('Title is required');
      hasError = true;
    }

    if (!surname.trim()) {
      setSurnameError('Surname is required');
      hasError = true;
    }

    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      hasError = true;
    }

    if (!gender.trim()) {
      setGenderError('Gender is required');
      hasError = true;
    }

    if (!dob.trim()) {
      setDobError('Date of birth is required');
      hasError = true;
    } else {
      const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      if (!dobRegex.test(dob)) {
        setDobError('Enter valid date (DD/MM/YYYY)');
        hasError = true;
      }
    }

    const phoneRes = validatePhone(phone);
    if (!phoneRes.isValid) {
      setPhoneError(phoneRes.error);
      hasError = true;
    }

    if (!houseNo.trim()) {
      setHouseNoError('House/Flat number is required');
      hasError = true;
    }

    if (!street.trim()) {
      setStreetError('Street/Locality is required');
      hasError = true;
    }

    if (!landmark.trim()) {
      setLandmarkError('Landmark is required');
      hasError = true;
    }

    if (!country.trim()) {
      setCountryError('Country is required');
      hasError = true;
    }

    if (!stateName.trim()) {
      setStateError('State is required');
      hasError = true;
    }

    if (!city.trim()) {
      setCityError('City is required');
      hasError = true;
    }

    if (!pincode.trim()) {
      setPincodeError('Pin code is required');
      hasError = true;
    } else if (pincode.trim().length !== 6) {
      setPincodeError('Pin code must be 6 digits');
      hasError = true;
    }

    const emailRes = validateEmail(email);
    if (!emailRes.isValid) {
      setEmailError(emailRes.error);
      hasError = true;
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
    }

    const matchRes = validateConfirmPassword(password, confirmPassword);
    if (!matchRes.isValid) {
      setConfirmPasswordError(matchRes.error);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    dispatch(
      setCredentials({
        user: {
          avatar: profileImage,
          title,
          surname,
          firstName,
          name: `${title} ${firstName} ${surname}`.trim(),
          gender,
          dob,
          phone,
          houseNo,
          street,
          landmark,
          country,
          state: stateName,
          city,
          pincode,
          email,
        },
      }),
    );

    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  return (
    <Background
      scrollable
      keyboardAvoiding
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowBackIcon size={20} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerLogoContainer}>
          <Image
            source={images.logo}
            style={styles.headerLogoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerTitleContainer}>
          <Typography variant="headlineSm" weight="bold" color={colors.white}>
            Create your account
          </Typography>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.noticeBox}>
          <View style={styles.noticeIconContainer}>
            <GroupIcon size={24} color={colors.secondaryRoyal} />
          </View>
          <Typography
            variant="bodyMd"
            color={colors.textPrimary}
            style={styles.noticeText}
          >
            Join AIOS to access your member profile, conferences and
            certificates.
          </Typography>
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionHeader}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.primaryNavy}
            style={styles.sectionTitle}
          >
            Personal information
          </Typography>
          <View style={styles.orangeAccentBar} />
        </View>

        <ProfileImagePicker
          imageUri={profileImage}
          onImageSelected={uri => setProfileImage(uri)}
          onImageRemoved={() => setProfileImage(null)}
        />

        <View style={styles.row2Col}>
          <View style={styles.titleCol}>
            <Typography
              variant="labelMd"
              weight="bold"
              color={colors.textPrimary}
              style={styles.labelAbove}
            >
              Title <Typography color={colors.error}>*</Typography>
            </Typography>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => openPicker('title', 'Select Title', TITLE_OPTIONS)}
              activeOpacity={0.8}
            >
              <Typography
                variant="bodyMd"
                color={title ? colors.textPrimary : colors.textMuted}
                numberOfLines={1}
                style={styles.selectValue}
              >
                {title || 'Select'}
              </Typography>
              <View style={styles.doubleArrowCol}>
                <Typography
                  variant="caption"
                  color={colors.textMuted}
                  style={styles.arrowUp}
                >
                  ▲
                </Typography>
                <Typography
                  variant="caption"
                  color={colors.textMuted}
                  style={styles.arrowDown}
                >
                  ▼
                </Typography>
              </View>
            </TouchableOpacity>
            {titleError ? (
              <View style={styles.fieldErrorContainerLeft}>
                <Typography
                  variant="labelSm"
                  color={colors.error}
                  align="left"
                  style={styles.fieldErrorTextLeft}
                >
                  {titleError}
                </Typography>
              </View>
            ) : null}
          </View>

          <View style={styles.flex1Col}>
            <Typography
              variant="labelMd"
              weight="bold"
              color={colors.textPrimary}
              style={styles.labelAbove}
            >
              Surname <Typography color={colors.error}>*</Typography>
            </Typography>
            <TextInput
              style={styles.inputBox}
              placeholder="Surname"
              placeholderTextColor={colors.textMuted}
              value={surname}
              onChangeText={text => {
                setSurname(text);
                if (surnameError) setSurnameError(undefined);
              }}
            />
            {surnameError ? (
              <View style={styles.fieldErrorContainer}>
                <Typography
                  variant="labelSm"
                  color={colors.error}
                  align="left"
                  style={styles.fieldErrorText}
                >
                  {surnameError}
                </Typography>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.fullWidthField}>
          <Typography
            variant="labelMd"
            weight="bold"
            color={colors.textPrimary}
            style={styles.labelAbove}
          >
            First Name <Typography color={colors.error}>*</Typography>
          </Typography>
          <TextInput
            style={styles.inputBox}
            placeholder="First name"
            placeholderTextColor={colors.textMuted}
            value={firstName}
            onChangeText={text => {
              setFirstName(text);
              if (firstNameError) setFirstNameError(undefined);
            }}
          />
          {firstNameError ? (
            <View style={styles.fieldErrorContainer}>
              <Typography
                variant="labelSm"
                color={colors.error}
                align="left"
                style={styles.fieldErrorText}
              >
                {firstNameError}
              </Typography>
            </View>
          ) : null}
        </View>

        <View style={styles.row2Col}>
          <View style={styles.halfCol}>
            <Typography
              variant="labelMd"
              weight="bold"
              color={colors.textPrimary}
              style={styles.labelAbove}
            >
              Gender <Typography color={colors.error}>*</Typography>
            </Typography>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() =>
                openPicker('gender', 'Select Gender', GENDER_OPTIONS)
              }
              activeOpacity={0.8}
            >
              <Typography
                variant="bodyMd"
                color={gender ? colors.textPrimary : colors.textMuted}
                numberOfLines={1}
                style={styles.selectValue}
              >
                {gender || 'Select'}
              </Typography>
              <View style={styles.doubleArrowCol}>
                <Typography
                  variant="caption"
                  color={colors.textMuted}
                  style={styles.arrowUp}
                >
                  ▲
                </Typography>
                <Typography
                  variant="caption"
                  color={colors.textMuted}
                  style={styles.arrowDown}
                >
                  ▼
                </Typography>
              </View>
            </TouchableOpacity>
            {genderError ? (
              <View style={styles.fieldErrorContainerLeft}>
                <Typography
                  variant="labelSm"
                  color={colors.error}
                  align="left"
                  style={styles.fieldErrorTextLeft}
                >
                  {genderError}
                </Typography>
              </View>
            ) : null}
          </View>

          <View style={styles.halfCol}>
            <Typography
              variant="labelMd"
              weight="bold"
              color={colors.textPrimary}
              style={styles.labelAbove}
            >
              Date of Birth <Typography color={colors.error}>*</Typography>
            </Typography>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Typography
                variant="bodyMd"
                color={dob ? colors.textPrimary : colors.textMuted}
                numberOfLines={1}
                style={styles.selectValue}
              >
                {dob || 'DD/MM/YYYY'}
              </Typography>
              <CalendarIcon
                size={18}
                color={dob ? colors.secondaryRoyal : colors.textMuted}
              />
            </TouchableOpacity>
            {dobError ? (
              <View style={styles.fieldErrorContainer}>
                <Typography
                  variant="labelSm"
                  color={colors.error}
                  align="left"
                  style={styles.fieldErrorText}
                >
                  {dobError}
                </Typography>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.fullWidthField}>
          <PhoneInput
            label="Phone No."
            value={phone}
            onChangeText={text => {
              setPhone(text);
              setVerifiedPhone(null);
              if (phoneError) setPhoneError(undefined);
            }}
            error={phoneError}
            defaultCountryCode="IN"
            placeholder="Enter phone number"
            showSuccessIndicator={false}
            rightIcon={
              isPhoneVerified ? (
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
              ) : validatePhone(phone).isValid ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('OtpVerification', {
                      phone: phoneDigits,
                      from: 'signup',
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Verify phone number"
                  activeOpacity={0.7}
                >
                  <Typography
                    variant="labelSm"
                    weight="bold"
                    color={colors.secondaryRoyal}
                    style={styles.verifyBtnText}
                  >
                    Verify
                  </Typography>
                </TouchableOpacity>
              ) : undefined
            }
          />
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.sectionHeader}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.primaryNavy}
            style={styles.sectionTitle}
          >
            Address
          </Typography>
          <View style={styles.orangeAccentBar} />
        </View>

        <View style={styles.fullWidthField}>
          <Typography
            variant="labelMd"
            weight="bold"
            color={colors.textPrimary}
            style={styles.labelAbove}
          >
            House No/ Flat No<Typography color={colors.error}>*</Typography>
          </Typography>
          <TextInput
            style={styles.inputBox}
            placeholder="House or flat number"
            placeholderTextColor={colors.textMuted}
            value={houseNo}
            onChangeText={text => {
              setHouseNo(text);
              if (houseNoError) setHouseNoError(undefined);
            }}
          />
          {houseNoError ? (
            <View style={styles.fieldErrorContainer}>
              <Typography
                variant="labelSm"
                color={colors.error}
                align="left"
                style={styles.fieldErrorText}
              >
                {houseNoError}
              </Typography>
            </View>
          ) : null}
        </View>

        <View style={styles.fullWidthField}>
          <Typography
            variant="labelMd"
            weight="bold"
            color={colors.textPrimary}
            style={styles.labelAbove}
          >
            Street/Locality<Typography color={colors.error}>*</Typography>
          </Typography>
          <TextInput
            style={styles.inputBox}
            placeholder="Street or locality"
            placeholderTextColor={colors.textMuted}
            value={street}
            onChangeText={text => {
              setStreet(text);
              if (streetError) setStreetError(undefined);
            }}
          />
          {streetError ? (
            <View style={styles.fieldErrorContainer}>
              <Typography
                variant="labelSm"
                color={colors.error}
                align="left"
                style={styles.fieldErrorText}
              >
                {streetError}
              </Typography>
            </View>
          ) : null}
        </View>

        <View style={styles.fullWidthField}>
          <Typography
            variant="labelMd"
            weight="bold"
            color={colors.textPrimary}
            style={styles.labelAbove}
          >
            Landmark<Typography color={colors.error}>*</Typography>
          </Typography>
          <TextInput
            style={styles.inputBox}
            placeholder="Nearby landmark"
            placeholderTextColor={colors.textMuted}
            value={landmark}
            onChangeText={text => {
              setLandmark(text);
              if (landmarkError) setLandmarkError(undefined);
            }}
          />
          {landmarkError ? (
            <View style={styles.fieldErrorContainer}>
              <Typography
                variant="labelSm"
                color={colors.error}
                align="left"
                style={styles.fieldErrorText}
              >
                {landmarkError}
              </Typography>
            </View>
          ) : null}
        </View>

        <View style={styles.row2Col}>
          <View style={styles.halfCol}>
            <Typography
              variant="labelMd"
              weight="bold"
              color={colors.textPrimary}
              style={styles.labelAbove}
            >
              Country <Typography color={colors.error}>*</Typography>
            </Typography>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={openCountryPicker}
              activeOpacity={0.8}
            >
              <Typography
                variant="bodyMd"
                color={country ? colors.textPrimary : colors.textMuted}
                numberOfLines={1}
                style={styles.selectValue}
              >
                {country || 'Select'}
              </Typography>
              <View style={styles.doubleArrowCol}>
                <Typography
                  variant="caption"
                  color={colors.textMuted}
                  style={styles.arrowUp}
                >
                  ▲
                </Typography>
                <Typography
                  variant="caption"
                  color={colors.textMuted}
                  style={styles.arrowDown}
                >
                  ▼
                </Typography>
              </View>
            </TouchableOpacity>
            {countryError ? (
              <View style={styles.fieldErrorContainerLeft}>
                <Typography
                  variant="labelSm"
                  color={colors.error}
                  align="left"
                  style={styles.fieldErrorTextLeft}
                >
                  {countryError}
                </Typography>
              </View>
            ) : null}
          </View>

          <View style={styles.halfCol}>
            <Typography
              variant="labelMd"
              weight="bold"
              color={colors.textPrimary}
              style={styles.labelAbove}
            >
              State <Typography color={colors.error}>*</Typography>
            </Typography>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={openStatePicker}
              activeOpacity={0.8}
            >
              <Typography
                variant="bodyMd"
                color={stateName ? colors.textPrimary : colors.textMuted}
                numberOfLines={1}
                style={styles.selectValue}
              >
                {stateName || 'Select'}
              </Typography>
              <View style={styles.doubleArrowCol}>
                <Typography
                  variant="caption"
                  color={colors.textMuted}
                  style={styles.arrowUp}
                >
                  ▲
                </Typography>
                <Typography
                  variant="caption"
                  color={colors.textMuted}
                  style={styles.arrowDown}
                >
                  ▼
                </Typography>
              </View>
            </TouchableOpacity>
            {stateError ? (
              <View style={styles.fieldErrorContainer}>
                <Typography
                  variant="labelSm"
                  color={colors.error}
                  align="left"
                  style={styles.fieldErrorText}
                >
                  {stateError}
                </Typography>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.row2Col}>
          <View style={styles.halfCol}>
            <Typography
              variant="labelMd"
              weight="bold"
              color={colors.textPrimary}
              style={styles.labelAbove}
            >
              City <Typography color={colors.error}>*</Typography>
            </Typography>
            <TextInput
              style={styles.inputBox}
              placeholder="City"
              placeholderTextColor={colors.textMuted}
              value={city}
              onChangeText={text => {
                setCity(text);
                if (cityError) setCityError(undefined);
              }}
            />
            {cityError ? (
              <View style={styles.fieldErrorContainerLeft}>
                <Typography
                  variant="labelSm"
                  color={colors.error}
                  align="left"
                  style={styles.fieldErrorTextLeft}
                >
                  {cityError}
                </Typography>
              </View>
            ) : null}
          </View>

          <View style={styles.halfCol}>
            <Typography
              variant="labelMd"
              weight="bold"
              color={colors.textPrimary}
              style={styles.labelAbove}
            >
              Pin Code <Typography color={colors.error}>*</Typography>
            </Typography>
            <TextInput
              style={styles.inputBox}
              placeholder="Pin code"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              value={pincode}
              onChangeText={handlePincodeChange}
            />
            {pincodeError ? (
              <View style={styles.fieldErrorContainer}>
                <Typography
                  variant="labelSm"
                  color={colors.error}
                  align="left"
                  style={styles.fieldErrorText}
                >
                  {pincodeError}
                </Typography>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.sectionHeader}>
          <Typography
            variant="title"
            weight="bold"
            color={colors.primaryNavy}
            style={styles.sectionTitle}
          >
            Account details
          </Typography>
          <View style={styles.orangeAccentBar} />
        </View>

        <View style={styles.fullWidthField}>
          <EmailInput
            label="Email Address"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (isEmailVerified) {
                setIsEmailVerified(false);
              }
              if (emailError) {
                setEmailError(undefined);
              }
            }}
            error={emailError}
            placeholder="Enter Email"
            rightIcon={
              isEmailVerified ? (
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
              ) : validateEmail(email.trim()).isValid ? (
                <TouchableOpacity onPress={handleOpenOtp} activeOpacity={0.7}>
                  <Typography
                    variant="labelSm"
                    weight="bold"
                    color={colors.secondaryRoyal}
                    style={styles.verifyBtnText}
                  >
                    Verify
                  </Typography>
                </TouchableOpacity>
              ) : undefined
            }
          />
        </View>

        <View style={styles.fullWidthField}>
          <PasswordInput
            label="Password"
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (passwordError) {
                setPasswordError(undefined);
              }
            }}
            error={passwordError}
            showStrengthMeter={true}
            showRequirements={true}
            minLength={8}
            placeholder="Create password"
          />
        </View>

        <View style={styles.fullWidthField}>
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              if (confirmPasswordError) {
                setConfirmPasswordError(undefined);
              }
            }}
            error={
              confirmPasswordError ||
              (confirmPassword.length > 0 && confirmPassword !== password
                ? 'Passwords do not match.'
                : undefined)
            }
            minLength={1}
            requireUppercase={false}
            requireLowercase={false}
            requireNumber={false}
            placeholder="Confirm password"
          />
        </View>

        <Button
          title="Submit Registration"
          onPress={handleSubmit}
          variant="primary"
          size="lg"
          style={styles.submitButton}
        />

        <View style={styles.loginLinkRow}>
          <Typography variant="bodyMd" color={colors.textSecondary}>
            Already registered?{' '}
          </Typography>
          <TouchableOpacity
            style={styles.signInLink}
            accessibilityRole="button"
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Typography
              variant="bodyMd"
              weight="semibold"
              color={colors.secondaryRoyal}
            >
              Sign In
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Typography
                variant="headlineSm"
                weight="bold"
                color={colors.primaryNavy}
              >
                {modalTitle}
              </Typography>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Typography variant="headlineSm" color={colors.textMuted}>
                  ✕
                </Typography>
              </TouchableOpacity>
            </View>

            {(activeSelectField === 'country' ||
              activeSelectField === 'state') && (
              <View style={styles.modalSearchBox}>
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder={`Search ${
                    activeSelectField === 'country' ? 'country' : 'state'
                  }...`}
                  placeholderTextColor={colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCorrect={false}
                />
              </View>
            )}

            <FlatList
              data={filteredModalOptions}
              keyExtractor={(item, index) => `${item.value}_${index}`}
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              initialNumToRender={20}
              maxToRenderPerBatch={30}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOptionItem}
                  onPress={() => handleSelectOption(item)}
                  activeOpacity={0.7}
                >
                  <Typography variant="bodyMd" color={colors.textPrimary}>
                    {item.label}
                  </Typography>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <CalendarPickerModal
        visible={showDatePicker}
        value={dob}
        onClose={() => setShowDatePicker(false)}
        onSelectDate={handleSelectDob}
        maximumDate={new Date()}
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  topHeader: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  headerLogoContainer: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  headerLogoImage: {
    width: '100%',
    height: '100%',
  },
  headerTitleContainer: {
    flex: 1,
  },

  cardContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    ...shadows.level1,
  },

  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#EFF6FF',
  },
  noticeIconContainer: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    backgroundColor: '#DBEAFE',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
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
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  orangeAccentBar: {
    width: 50,
    height: 2.5,
    backgroundColor: colors.tertiarySaffron,
    borderRadius: 1,
  },

  row2Col: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  titleCol: {
    flex: 0.8,
    minWidth: 0,
  },
  flex1Col: {
    flex: 1.4,
    minWidth: 0,
  },
  halfCol: {
    flex: 1,
    minWidth: 0,
  },
  fullWidthField: {
    width: '100%',
    marginBottom: 16,
  },

  inputBox: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.borderField,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 14,
    color: colors.textPrimary,
  },
  emailInputWrapper: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.borderField,
    borderRadius: 6,
    backgroundColor: colors.surfaceContainerLowest,
    paddingLeft: 12,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emailInputBox: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
    paddingRight: 8,
  },
  // verifyBtn: {
  //   backgroundColor: colors.successBg,
  //   borderColor: colors.successBorder,
  //   borderWidth: 1,
  //   paddingHorizontal: 10,
  //   paddingVertical: 5,
  //   borderRadius: 4,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  verifyBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: colors.successBg,
    // borderColor: colors.successBorder,
    // borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  passwordBox: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.borderField,
    borderRadius: 6,
    backgroundColor: colors.surfaceContainerLowest,
    paddingLeft: 12,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
    height: 44,
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: 0,
    paddingRight: 4,
  },
  eyeBtn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelAbove: {
    marginBottom: 8,
    fontSize: 13,
  },
  selectValue: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
  },
  signInLink: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },

  doubleArrowCol: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  arrowUp: {
    fontSize: 8,
    lineHeight: 8,
  },
  arrowDown: {
    fontSize: 8,
    lineHeight: 8,
  },

  submitButton: {
    marginTop: 20,
    backgroundColor: colors.primaryNavy,
    borderRadius: 12,
    minHeight: 52,
  },
  loginLinkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: spacing.gutterMobile + 4,
  },
  modalContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.md,
    maxHeight: '70%',
    padding: spacing.spaceMd,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.spaceSm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderNeutral,
    marginBottom: spacing.spaceSm,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalSearchBox: {
    marginBottom: 8,
  },
  modalSearchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.borderField,
    borderRadius: 6,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  modalOptionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainer,
  },
  fieldErrorContainer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 4,
    paddingRight: 2,
  },
  fieldErrorText: {
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  fieldErrorContainerLeft: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 4,
    paddingLeft: 2,
  },
  fieldErrorTextLeft: {
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
});

export default SignupScreen;
