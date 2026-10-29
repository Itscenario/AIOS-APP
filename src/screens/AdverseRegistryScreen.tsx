import { AppHeader } from '../components/AppHeader';
import { colors } from '../theme/colors';
import React, { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowBackIcon, DocumentIcon } from '../components/Icons';
import { CalendarPickerModal } from '../components/CalendarPickerModal';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { useAppSelector } from '../store';

const STEPS = ['Centre', 'Clinical', 'Surgery', 'Products'];
const SOLUTIONS = ['Ringer Lactate', 'BSS', 'BSS+', 'Addition to irrigating solution (Epinephrine / antibiotic, any other)'];
const PRODUCTS = [
  { id: 'iol', title: 'Intraocular lens (IOL)', options: ['Hydrophobic Acrylic', 'Hydrophilic Acrylic', 'Silicone IOL', 'PMMA'] },
  { id: 'irrigating', title: 'Irrigating solution (drugs used)', options: SOLUTIONS },
  { id: 'viscoelastic', title: 'Viscoelastic used' },
  { id: 'antibiotic', title: 'Intracameral antibiotic use' },
  { id: 'moxifloxacin', title: 'Antibiotic use (with dosage) – Moxifloxacin', options: SOLUTIONS },
  { id: 'vancomycin', title: 'Antibiotic use (with dosage) – Vancomycin', options: SOLUTIONS },
  { id: 'cefuroxime', title: 'Antibiotic use (with dosage) – Cefuroxime', options: SOLUTIONS },
  { id: 'anaesthetic', title: 'Intracameral Anaesthetic', options: SOLUTIONS },
  { id: 'dye', title: 'Intracameral capsule stain dye', options: SOLUTIONS },
  { id: 'pilocarpine', title: 'Intracameral Pilocarpine', options: SOLUTIONS },
];

export const AdverseRegistryScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const profile = useAppSelector(state => state.auth.profile);
  const scroll = useRef<React.ElementRef<typeof ScrollView>>(null);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({
    msno: profile?.membershipId || '', email: '', phone: '',
  });
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [dateField, setDateField] = useState<string | null>(null);
  const [error, setError] = useState('');
  const setField = (key: string, value: string) => { setValues(current => ({ ...current, [key]: value })); setError(''); };
  const field = (key: string, label: string, kind: 'text' | 'email' | 'phone' | 'number' | 'long' | 'date' = 'text') => (
    <View key={key} style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {kind === 'date' ? (
        <TouchableOpacity style={styles.dateInput} onPress={() => setDateField(key)} accessibilityRole="button" accessibilityLabel={label}><Text style={values[key] ? styles.inputText : styles.placeholder}>{values[key] || 'Select date'}</Text><Text style={styles.dateSymbol}>▦</Text></TouchableOpacity>
      ) : (
        <TextInput style={[styles.input, kind === 'long' && styles.multiline]} value={values[key] || ''} onChangeText={value => setField(key, kind === 'number' ? value.replace(/\D/g, '') : value)} placeholder={`Enter ${label.toLowerCase()}`} placeholderTextColor="#94A3B8" multiline={kind === 'long'} textAlignVertical={kind === 'long' ? 'top' : 'center'} keyboardType={kind === 'email' ? 'email-address' : kind === 'phone' ? 'phone-pad' : kind === 'number' ? 'number-pad' : 'default'} autoCapitalize={kind === 'email' ? 'none' : 'sentences'} accessibilityLabel={label} />
      )}
    </View>
  );
  const choices = (key: string, label: string, options: string[], multiple = false) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>{options.map(option => {
        const selected = (selections[key] || []).includes(option);
        return <TouchableOpacity key={option} style={[styles.option, selected && styles.optionSelected]} accessibilityRole={multiple ? 'checkbox' : 'radio'} accessibilityState={{ checked: selected }} onPress={() => setSelections(current => ({ ...current, [key]: multiple ? selected ? (current[key] || []).filter(value => value !== option) : [...(current[key] || []), option] : selected ? [] : [option] }))}><View style={[styles.check, multiple && styles.squareCheck, selected && styles.checkSelected]} /><Text style={[styles.optionText, selected && styles.selectedText]}>{option}</Text></TouchableOpacity>;
      })}</View>
    </View>
  );
  const changeStep = (next: number) => { setStep(next); setError(''); scroll.current?.scrollTo({ y: 0, animated: false }); };
  const submit = () => {
    if (!values.centre?.trim() || !values.doctor?.trim()) { changeStep(0); setError('Please enter the centre details and referring doctor / contact person.'); return; }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) { changeStep(0); setError('Please enter a valid email address.'); return; }
    if (values.affected && values.total && Number(values.affected) > Number(values.total)) { changeStep(0); setError('Affected cases cannot exceed total surgeries.'); return; }
    Alert.alert('Submission pending', 'This report has not been submitted. Adverse Registry submission will be available when the backend service is connected.');
  };
  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <AppHeader style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back"><ArrowBackIcon size={21} color="#FFFFFF" /></TouchableOpacity>
        <View style={styles.flex}><Text style={styles.headerTitle}>Adverse Registry</Text></View>
      </AppHeader>
      <View style={styles.stepper}>
        {STEPS.map((title, index) => <TouchableOpacity key={title} onPress={() => changeStep(index)} style={styles.stepItem} accessibilityRole="button" accessibilityState={{ selected: step === index }} accessibilityLabel={`Step ${index + 1}, ${title}`}><View style={[styles.stepNumber, step === index && styles.stepNumberActive]}><Text style={[styles.stepDigit, step === index && styles.stepDigitActive]}>{index + 1}</Text></View><Text style={[styles.stepTitle, step === index && styles.stepTitleActive]}>{title}</Text></TouchableOpacity>)}
      </View>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.intro}><Text style={styles.eyebrow}>STEP {step + 1} OF 4</Text><Text style={styles.title}>{['Surgical centre contact', 'Clinical findings', 'Surgery & sterilization', 'Products & materials'][step]}</Text><Text style={styles.copy}>{['Start with the reporting centre and contact details.', 'Record the patient factors and clinical observations.', 'Document the procedure and instrument handling.', 'Add the products introduced during anterior chamber procedures.'][step]}</Text></View>
          {!!error && <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>}
          {step === 0 && <View style={styles.card}>
            <Text style={styles.cardTitle}>Basic information</Text>
            {field('msno', 'MSNO')}
            {field('centre', 'Name and address of centre / institution', 'long')}
            {field('doctor', 'Referring doctor / contact person')}
            {field('email', 'Email ID', 'email')}
            {field('phone', 'Telephone number', 'phone')}
            {field('affected', 'Number of affected cases', 'number')}
            {field('total', 'Number of total surgeries', 'number')}
          </View>}
          {step === 1 && <>
            <View style={styles.card}><Text style={styles.cardTitle}>Patient & case</Text>
              {choices('factors', 'Patient factors', ['DM', 'HTN', 'Hyperlipidemia'], true)}
              {field('case', 'Case number')}
              {field('summary', 'TASS summary / clinical features', 'long')}
              {field('bcva', 'Best corrected visual acuity (BCVA)')}
            </View>
            <View style={styles.card}><Text style={styles.cardTitle}>Examination & investigations</Text>
              {field('steroids', 'Response to the steroid drops', 'long')}
              {field('pupil', 'Pupil')}
              {field('iop', 'Intraocular pressure')}
              {field('culture', 'Bacterial or fungal growth from cultures of aqueous tap / vitreous tap', 'long')}
              {field('posterior', 'Posterior segment evaluation / USG B-Scan', 'long')}
              {field('grade', 'Grade of TASS')}
            </View>
          </>}
          {step === 2 && <View style={styles.card}><Text style={styles.cardTitle}>Procedure details</Text>
            {choices('surgery', 'Type of surgery', ['Phacoemulsification', 'Small Incision Cataract Surgery (SICS)', 'Extracapsular Cataract Extraction (ECCE)', 'Other surgical procedures', 'Other'])}
            {field('otherSurgery', 'Other surgery details')}
            {choices('incision', 'Site of incision', ['Corneal', 'Scleral'])}
            {choices('sutures', 'Sutures given', ['Yes', 'No'])}
            {choices('sterilization', 'Method of sterilization', ['Autoclave', 'ETO', 'Plasma gas', 'Glutaraldehyde', 'Other'], true)}
            {field('otherSterilization', 'Other sterilization details')}
            {choices('reuse', 'Reuse of instruments', ['Reusing Phaco tips', 'Reusing I/A tips', 'Reusing cannulae'], true)}
          </View>}
          {step === 3 && <>
            {PRODUCTS.map((product, index) => <View key={product.id} style={styles.card}><View style={styles.productHeading}><Text style={styles.productNumber}>{String(index + 1).padStart(2, '0')}</Text><Text style={[styles.cardTitle, styles.flex]}>{product.title}</Text></View>
              {product.options ? choices(product.id, 'Product / solution used', product.options, product.id !== 'iol') : field(product.id + '_details', 'Product details')}
              {product.id.includes('floxacin') || product.id === 'vancomycin' || product.id === 'cefuroxime' ? field(product.id + '_dose', 'Dosage') : null}
              {field(product.id + '_manufacturer', 'Manufacturer')}
              {field(product.id + '_date', 'Manufacturing date', 'date')}
              {field(product.id + '_lot', 'Lot number')}
              {field(product.id + '_trade', 'Trade name')}
            </View>)}
            <View style={styles.card}>{field('suspect', 'Suspect product (any)', 'long')}</View>
          </>}
          <View style={styles.actions}>
            {step > 0 && <TouchableOpacity style={styles.previous} onPress={() => changeStep(step - 1)} accessibilityRole="button"><Text style={styles.previousText}>Previous</Text></TouchableOpacity>}
            <TouchableOpacity style={styles.next} onPress={() => step < 3 ? changeStep(step + 1) : submit()} accessibilityRole="button"><Text style={styles.nextText}>{step < 3 ? 'Continue →' : 'Submit report'}</Text></TouchableOpacity>
          </View>
          <Text style={styles.note}>Form preview · Submission service pending</Text>
        </ScrollView>
      </KeyboardAvoidingView>
      <CalendarPickerModal visible={dateField !== null} value={dateField ? values[dateField] : undefined} onClose={() => setDateField(null)} onSelectDate={date => { if (dateField) setField(dateField, date); setDateField(null); }} title="Manufacturing date" maximumDate={new Date()} />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 }, screen: { flex: 1, backgroundColor: '#F4F7FC' },
  header: { backgroundColor: '#0B1728', flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#20314B', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 21, color: '#FFFFFF', fontWeight: '700' }, headerSubtitle: { fontSize: 11, color: '#AEC3DE', marginTop: 4 },
  headerIcon: { padding: 10, backgroundColor: '#1A3050', borderRadius: 14 },
  stepper: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E6ECF5' },
  stepItem: { flex: 1, alignItems: 'center', gap: 6 },
  stepNumber: { width: 30, height: 30, borderRadius: 11, backgroundColor: '#F0F3F8', alignItems: 'center', justifyContent: 'center' },
  stepNumberActive: { backgroundColor: '#2D619B' }, stepDigit: { color: '#94A3B8', fontSize: 12, fontWeight: '700' }, stepDigitActive: { color: '#FFFFFF' },
  stepTitle: { color: '#94A3B8', fontSize: 10, fontWeight: '600' }, stepTitleActive: { color: '#2D619B' },
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', padding: 16, gap: 16 },
  intro: { padding: 5, paddingTop: 8 }, eyebrow: { color: '#6283AA', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: '#17233E', fontSize: 25, lineHeight: 33, fontWeight: '700', marginTop: 8 },
  copy: { color: '#64748B', fontSize: 12, lineHeight: 20, marginTop: 8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, borderWidth: 1, borderColor: '#E2EAF4', padding: 20 },
  cardTitle: { color: '#253D60', fontSize: 16, lineHeight: 23, fontWeight: '700' },
  field: { marginTop: 18 }, label: { color: '#52647C', fontSize: 12, lineHeight: 18, fontWeight: '600', marginBottom: 8 },
  input: { minHeight: 52, color: '#17233E', fontSize: 14, paddingHorizontal: 13, borderWidth: 1, borderColor: '#DDE5EF', borderRadius: 12, backgroundColor: '#FAFBFE' },
  multiline: { minHeight: 100, paddingTop: 12, paddingBottom: 12 },
  dateInput: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 13, borderWidth: 1, borderColor: '#DDE5EF', borderRadius: 12, backgroundColor: '#FAFBFE' },
  inputText: { color: '#17233E', fontSize: 14 }, placeholder: { color: '#94A3B8', fontSize: 14 }, dateSymbol: { color: '#6283AA', fontSize: 22 },
  options: { gap: 8 }, option: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E4EAF3' },
  optionSelected: { backgroundColor: '#EEF5FE', borderColor: '#91B3DD' },
  check: { width: 16, height: 16, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8 }, squareCheck: { borderRadius: 4 }, checkSelected: { backgroundColor: '#3C73AD', borderColor: '#3C73AD', borderWidth: 4 },
  optionText: { flex: 1, color: '#64748B', fontSize: 12, lineHeight: 18 }, selectedText: { color: '#28558B', fontWeight: '600' },
  productHeading: { flexDirection: 'row', alignItems: 'center', gap: 12 }, productNumber: { padding: 9, backgroundColor: '#EAF2FC', borderRadius: 10, color: '#3C73AD', fontSize: 12, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: 12 }, previous: { flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.buttonBackground, borderRadius: 14 }, previousText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  next: { flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.buttonBackground, borderRadius: 14 }, nextText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  error: { color: '#B45353', backgroundColor: '#FFF1F2', padding: 12, borderRadius: 12, fontSize: 12, lineHeight: 19 },
  note: { color: '#94A3B8', fontSize: 10, textAlign: 'center' },
});
