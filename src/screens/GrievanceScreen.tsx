import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowBackIcon, ShieldCheckIcon, DocumentIcon } from '../components/Icons';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import type { RootStackParamList } from '../navigation/types';

const GrievancePage: React.FC<{ verify?: boolean }> = ({ verify = false }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'GrievanceOtp'>>();
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [otpFocused, setOtpFocused] = useState(false);
  const [error, setError] = useState('');
  const next = () => {
    const value = identifier.trim();
    if (!value) { setError('Enter your membership number, registered mobile or email.'); return; }
    if (value.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setError('Enter a valid email address.'); return; }
    navigation.navigate('GrievanceOtp', { identifier: value });
  };
  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back"><ArrowBackIcon size={21} color="#FFFFFF" /></TouchableOpacity>
        <View><Text style={styles.headerTitle}>{verify ? 'OTP Verification' : 'Grievance Corner'}</Text><Text style={styles.headerCaption}>AIOS member support</Text></View>
      </View>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
          <LinearGradient colors={['#203C72', '#326E92']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <View style={styles.heroIcon}>{verify ? <ShieldCheckIcon size={29} color="#FFFFFF" /> : <DocumentIcon size={29} color="#FFFFFF" />}</View>
            <Text style={styles.eyebrow}>{verify ? 'VERIFY YOUR IDENTITY' : 'WE ARE HERE TO HELP'}</Text>
            <Text style={styles.heroTitle}>{verify ? 'One step closer.' : 'Your voice matters.'}</Text>
            <Text style={styles.heroCopy}>{verify ? 'Verify your registered mobile number to continue to the grievance form.' : 'Share your concerns and suggestions with the AIOS team.'}</Text>
          </LinearGradient>
          {!verify && <View style={styles.tags}>{['Adverse Registry', 'Insurance & TPA', 'Trade', 'Any Others'].map(tag => <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>)}</View>}
          <View style={styles.card}>
            <View style={styles.step}><Text style={styles.stepText}>{verify ? '02' : '01'}</Text><Text style={styles.stepLabel}>{verify ? 'VERIFY OTP' : 'IDENTIFY YOUR ACCOUNT'}</Text></View>
            <Text style={styles.title}>{verify ? 'Enter your OTP' : 'Let’s get started'}</Text>
            <Text style={styles.copy}>{verify ? 'Enter the code received on your registered mobile number.' : 'Use your membership number, registered mobile number or email. Your OTP will be delivered to your registered mobile.'}</Text>
            {verify ? <>
              <View style={styles.identifier}><Text style={styles.identifierLabel}>ACCOUNT</Text><Text style={styles.identifierValue}>{route.params?.identifier}</Text></View>
              <Text style={styles.label}>Verification code</Text>
              <View style={styles.otpContainer}>
                <TextInput
                  style={styles.otp}
                  value={otp}
                  onChangeText={text => setOtp(text.replace(/\D/g, ''))}
                  onFocus={() => setOtpFocused(true)}
                  onBlur={() => setOtpFocused(false)}
                  keyboardType="number-pad"
                  maxLength={6}
                  textContentType="oneTimeCode"
                  autoComplete="sms-otp"
                  accessibilityLabel="Enter verification code"
                  selectionColor="#2858A2"
                />
                {!otp && !otpFocused && <View pointerEvents="none" style={styles.otpPlaceholder}><Text style={styles.otpPlaceholderText}>Enter OTP</Text></View>}
              </View>
              <View style={styles.pending}><Text style={styles.pendingText}>OTP delivery and verification will be enabled when the grievance service is connected.</Text></View>
              <TouchableOpacity
                style={[styles.button, otp.length !== 6 && styles.disabled]}
                disabled={otp.length !== 6}
                onPress={() => navigation.navigate('GrievanceForm')}
                accessibilityRole="button"
                accessibilityState={{ disabled: otp.length !== 6 }}
              ><Text style={styles.buttonText}>Verify OTP</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.editIdentifier} accessibilityRole="button"><Text style={styles.editText}>Change account details</Text></TouchableOpacity>
            </> : <>
              <Text style={styles.label}>Membership No. / Mobile / Email</Text>
              <TextInput style={[styles.input, !!error && styles.inputError]} value={identifier} onChangeText={value => { setIdentifier(value); setError(''); }} placeholder="Enter your registered details" placeholderTextColor="#94A3B8" autoCapitalize="none" autoCorrect={false} returnKeyType="done" onSubmitEditing={next} accessibilityLabel="Membership number, registered mobile or email" />
              {!!error && <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>}
              <TouchableOpacity style={styles.button} onPress={next} accessibilityRole="button"><Text style={styles.buttonText}>Send OTP</Text><Text style={styles.buttonArrow}>→</Text></TouchableOpacity>
              <Text style={styles.preview}>OTP screen preview · Delivery service pending</Text>
            </>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export const GrievanceScreen: React.FC = () => <GrievancePage />;
export const GrievanceOtpScreen: React.FC = () => <GrievancePage verify />;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: '#F4F7FC' },
  header: { backgroundColor: '#0B1728', flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#20314B', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 21, fontWeight: '700', color: '#FFFFFF' },
  headerCaption: { fontSize: 12, color: '#B8C7DB', marginTop: 4 },
  content: { padding: 16, width: '100%', maxWidth: 600, alignSelf: 'center', gap: 18 },
  hero: { padding: 24, borderRadius: 26 },
  heroIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  eyebrow: { fontSize: 9, letterSpacing: 1.7, fontWeight: '800', color: '#BAE6FD' },
  heroTitle: { fontSize: 29, lineHeight: 37, color: '#FFFFFF', fontWeight: '700', marginTop: 8 },
  heroCopy: { fontSize: 13, lineHeight: 21, color: '#D8EAF5', marginTop: 10 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#E7EDF7', borderRadius: 10, paddingHorizontal: 11, paddingVertical: 8 },
  tagText: { color: '#425B7E', fontSize: 11, fontWeight: '600' },
  card: { backgroundColor: '#FFFFFF', padding: 22, borderRadius: 24, borderWidth: 1, borderColor: '#E3EAF4' },
  step: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
  stepText: { color: '#2563EB', fontSize: 11, fontWeight: '800', backgroundColor: '#EFF6FF', padding: 7, borderRadius: 8 },
  stepLabel: { fontSize: 9, letterSpacing: 1.2, fontWeight: '700', color: '#64748B' },
  title: { fontSize: 23, fontWeight: '700', color: '#17233E' },
  copy: { fontSize: 13, lineHeight: 21, color: '#64748B', marginTop: 10, marginBottom: 22 },
  label: { fontSize: 12, fontWeight: '700', color: '#334155', marginBottom: 9 },
  input: { minHeight: 56, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#DCE4EF', borderRadius: 14, paddingHorizontal: 14, color: '#17233E', fontSize: 14 },
  inputError: { borderColor: '#FCA5A5' },
  otpContainer: { minHeight: 56, borderWidth: 1, borderColor: '#DCE4EF', borderRadius: 14, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  otp: { width: '100%', height: 56, fontSize: 20, color: '#17233E', textAlign: 'center', textAlignVertical: 'center', writingDirection: 'ltr', padding: 0 },
  otpPlaceholder: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  otpPlaceholderText: { fontSize: 20, color: '#94A3B8' },
  button: { marginTop: 20, minHeight: 54, backgroundColor: '#2858A2', borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  buttonArrow: { color: '#FFFFFF', fontSize: 23 },
  error: { color: '#DC2626', fontSize: 12, marginTop: 8 },
  preview: { color: '#64748B', fontSize: 10, textAlign: 'center', marginTop: 12 },
  identifier: { backgroundColor: '#F0F5FF', padding: 14, borderRadius: 12, marginBottom: 20 },
  identifierLabel: { fontSize: 9, fontWeight: '700', color: '#64748B', letterSpacing: 1 },
  identifierValue: { color: '#253B79', fontWeight: '600', marginTop: 6 },
  pending: { marginTop: 14, padding: 12, backgroundColor: '#FFF8E8', borderRadius: 12 },
  pendingText: { color: '#92702D', fontSize: 12, lineHeight: 18 },
  disabled: { opacity: 0.45 },
  editIdentifier: { padding: 14, alignItems: 'center' },
  editText: { color: '#2858A2', fontSize: 12, fontWeight: '600' },

});
