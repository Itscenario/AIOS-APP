import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import React, { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowBackIcon, DocumentIcon, PersonIcon } from '../components/Icons';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { pickDocumentFile, FilePickerResult } from '../components/FilePicker';
import { useAppSelector } from '../store';
import { formatProfileName } from '../utils/profileName';

const ISSUES = ['Insurance & TPA', 'Trade Grievances', 'Any Others'];
const makeCaptcha = () => Math.random().toString(36).slice(2, 7).padEnd(5, 'x');

export const GrievanceFormScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const profile = useAppSelector(state => state.auth.profile);
  const scroll = useRef<React.ElementRef<typeof ScrollView>>(null);
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [documents, setDocuments] = useState<(FilePickerResult | null)[]>([null, null, null]);
  const [captcha, setCaptcha] = useState(makeCaptcha);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const name = formatProfileName(profile?.name || [profile?.title, profile?.firstName, profile?.surname].filter(Boolean).join(' '));
  const pickFile = async (index: number) => {
    const file = await pickDocumentFile();
    if (file) setDocuments(current => current.map((existing, i) => i === index ? file : existing));
  };
  const submit = () => {
    if (!issue) { setError('Please select an issue category.'); return; }
    if (!description.trim()) { setError('Please add a brief description.'); return; }
    if (answer.trim().toLowerCase() !== captcha.toLowerCase()) { setError('The captcha does not match. Please try again.'); return; }
    setError('');
    Alert.alert('Submission pending', 'Your form has not been submitted. Grievance submission will be available when the backend service is connected.');
  };
  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <AppHeader style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back"><ArrowBackIcon size={21} color="#FFFFFF" /></TouchableOpacity>
        <View><Text style={styles.headerTitle}>Share your concern</Text></View>
      </AppHeader>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}>
          <View style={styles.intro}><Text style={styles.eyebrow}>WE ARE LISTENING</Text><Text style={styles.title}>Let’s work towards{'\n'}a resolution.</Text><Text style={styles.copy}>Tell us what happened and attach any relevant documents.</Text></View>
          <View style={styles.profileCard}>
            <View style={styles.profileHeading}><View style={styles.person}><PersonIcon size={22} color="#3561A9" /></View><Text style={styles.sectionTitle}>Your details</Text></View>
            {[['Name', name], ['Email address', profile?.email], ['Mobile number', profile?.phone]].map(([label, value]) => <View style={styles.detail} key={label}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value || 'Not provided'}</Text></View>)}
          </View>
          <View style={styles.adverse}>
            <Text style={styles.adverseTitle}>Reporting an adverse event?</Text>
            <Text style={styles.adverseCopy}>Use the adverse registry for adverse event reports.</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Open Adverse Registry"
              onPress={() => navigation.navigate('AdverseRegistry')}
              activeOpacity={0.75}
              style={styles.registryButton}
            >
              <DocumentIcon size={18} color="#94602D" />
              <Text style={styles.registryText}>Adverse Registry</Text>
              <View style={styles.registryArrowBadge}>
                <Text style={styles.registryArrow}>↗</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.step}>01 / ISSUE DETAILS</Text>
            <Text style={styles.sectionTitle}>How can we help?</Text>
            <Text style={styles.label}>Issue category *</Text>
            <View style={styles.categories}>{ISSUES.map(value => <TouchableOpacity key={value} onPress={() => { setIssue(value); setError(''); }} style={[styles.category, issue === value && styles.categorySelected]} accessibilityRole="radio" accessibilityState={{ checked: issue === value }}><View style={[styles.radio, issue === value && styles.radioSelected]} /><Text style={[styles.categoryText, issue === value && styles.categoryTextSelected]}>{value}</Text></TouchableOpacity>)}</View>
            <Text style={styles.label}>Brief description *</Text>
            <TextInput style={styles.description} value={description} onChangeText={setDescription} multiline textAlignVertical="top" placeholder="Describe your concern or suggestion…" placeholderTextColor="#94A3B8" accessibilityLabel="Brief description" />
          </View>
          <View style={styles.card}>
            <Text style={styles.step}>02 / SUPPORTING DOCUMENTS</Text>
            <Text style={styles.sectionTitle}>Add relevant documents</Text>
            <Text style={styles.copy}>Attach up to 3 files to help us understand your concern.</Text>
            {documents.map((file, index) => <View key={index} style={styles.uploadRow}>
              <Button customLayout onPress={() => pickFile(index)} style={styles.upload} accessibilityRole="button" accessibilityLabel={`Choose document ${index + 1}`}>
                <View style={styles.fileIcon}><DocumentIcon size={20} color="#5363B8" /></View>
                <View style={styles.fileInfo}><Text style={styles.fileTitle} numberOfLines={2}>{file?.name || 'Choose File'}</Text>{file && <Text style={styles.fileHint}>Tap to replace</Text>}</View>
                <Text style={styles.plus}>{file ? '↻' : '+'}</Text>
              </Button>
              {file && <TouchableOpacity onPress={() => setDocuments(current => current.map((value, i) => i === index ? null : value))} style={styles.remove} accessibilityRole="button" accessibilityLabel={`Remove document ${index + 1}`}><Text style={styles.removeText}>Remove</Text></TouchableOpacity>}
            </View>)}
          </View>
          <View style={styles.card}>
            <Text style={styles.step}>03 / FINAL CHECK</Text>
            <Text style={styles.sectionTitle}>Enter the code below</Text>
            <View style={styles.captchaRow}>
              <TouchableOpacity style={styles.captchaBadge} onPress={() => { setCaptcha(makeCaptcha()); setAnswer(''); }} accessibilityRole="button" accessibilityLabel="Refresh captcha"><Text style={styles.captchaCode}>{captcha}</Text><Text style={styles.refresh}>↻</Text></TouchableOpacity>
              <TextInput style={styles.captchaInput} value={answer} onChangeText={setAnswer} placeholder="Enter code" placeholderTextColor="#94A3B8" autoCapitalize="none" autoCorrect={false} accessibilityLabel="Enter captcha" onFocus={() => requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: true }))} />
            </View>
            {!!error && <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>}
            <Button customLayout onPress={submit} style={styles.submit} accessibilityRole="button"><Text style={styles.submitText}>Save & Submit</Text><Text style={styles.submitArrow}>→</Text></Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 }, screen: { flex: 1, backgroundColor: '#F4F7FC' },
  header: { backgroundColor: '#0B1728', flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#20314B', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' }, headerSubtitle: { color: '#B8C7DB', fontSize: 10, marginTop: 5 },
  content: { padding: 16, gap: 18, width: '100%', maxWidth: 600, alignSelf: 'center' },
  intro: { padding: 6, paddingTop: 14 }, eyebrow: { fontSize: 10, color: '#4B72AC', fontWeight: '800', letterSpacing: 1.6 },
  title: { fontSize: 29, lineHeight: 37, color: '#17233E', fontWeight: '700', marginTop: 10 },
  copy: { fontSize: 12, lineHeight: 20, color: '#64748B', marginTop: 8 },
  profileCard: { padding: 20, borderRadius: 22, backgroundColor: '#EAF1FC', borderWidth: 1, borderColor: '#D8E5F8' },
  profileHeading: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  person: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  detail: { marginTop: 14 }, detailLabel: { fontSize: 10, color: '#64748B', marginBottom: 5 }, detailValue: { fontSize: 14, color: '#253B60', fontWeight: '600' },
  adverse: { padding: 18, backgroundColor: '#FFF6E9', borderRadius: 18, borderWidth: 1, borderColor: '#F6E4C6' },
  adverseTitle: { fontSize: 14, color: '#94602D', fontWeight: '700' }, adverseCopy: { fontSize: 12, color: '#A17D53', lineHeight: 19, marginTop: 6 },
  registryButton: { alignSelf: 'stretch', minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBD4B4', borderRadius: 12 },
  registryText: { flex: 1, color: '#825025', fontSize: 13, lineHeight: 20, fontWeight: '700' },
  registryArrowBadge: { width: 28, height: 28, borderRadius: 9, backgroundColor: '#FFF1DC', alignItems: 'center', justifyContent: 'center' },
  registryArrow: { color: '#94602D', fontSize: 19, fontWeight: '600' },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 22, borderWidth: 1, borderColor: '#E3EAF4' },
  step: { color: '#7C8AA4', fontSize: 9, letterSpacing: 1.2, fontWeight: '700', marginBottom: 10 },
  sectionTitle: { color: '#17233E', fontSize: 17, fontWeight: '700' },
  label: { color: '#475569', fontSize: 12, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  categories: { gap: 8 }, category: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12 },
  categorySelected: { backgroundColor: '#EFF4FF', borderColor: '#8EA9D8' },
  categoryText: { fontSize: 13, color: '#64748B' }, categoryTextSelected: { color: '#2858A2', fontWeight: '600' },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1' }, radioSelected: { borderWidth: 5, borderColor: '#3561A9' },
  description: { minHeight: 150, padding: 14, fontSize: 14, lineHeight: 22, color: '#17233E', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14 },
  uploadRow: { marginTop: 12 }, upload: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#CAD5EA', borderRadius: 14, backgroundColor: '#FAFBFF' },
  fileIcon: { padding: 10, backgroundColor: '#EEF0FC', borderRadius: 12 }, fileInfo: { flex: 1 }, fileTitle: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' }, fileHint: { fontSize: 10, color: '#FFFFFF', marginTop: 4 }, plus: { color: '#FFFFFF', fontSize: 23 },
  remove: { alignSelf: 'flex-end', padding: 10, minHeight: 44, justifyContent: 'center' }, removeText: { color: '#B45353', fontSize: 11 },
  captchaRow: { flexDirection: 'row', gap: 12, marginTop: 18 }, captchaBadge: { flex: 1, minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderRadius: 12, backgroundColor: '#EAF0FA' },
  captchaCode: { color: '#334A76', fontSize: 20, letterSpacing: 3, fontWeight: '800' }, refresh: { color: '#6179A6', fontSize: 20 },
  captchaInput: { flex: 1, minWidth: 0, borderWidth: 1, borderColor: '#DCE4EF', borderRadius: 12, paddingHorizontal: 12, color: '#17233E', fontSize: 13 },
  submit: { backgroundColor: '#2858A2', minHeight: 54, borderRadius: 15, flexDirection: 'row', gap: 20, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  submitText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }, submitArrow: { color: '#FFFFFF', fontSize: 22 },
  error: { color: '#DC2626', fontSize: 12, lineHeight: 19, marginTop: 12 }, note: { color: '#94A3B8', fontSize: 10, textAlign: 'center', lineHeight: 16, marginTop: 12 },
});
