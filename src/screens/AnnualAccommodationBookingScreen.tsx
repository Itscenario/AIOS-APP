import React, { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowBackIcon, CalendarIcon } from '../components/Icons';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { ANNUAL_HOTELS } from '../constants/annualAccommodation';
import { useAppSelector } from '../store';
import { formatProfileName } from '../utils/profileName';

const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};
const makeCaptcha = () => Math.random().toString(36).slice(2, 7).padEnd(5, 'x');
const money = (value: number) => '₹' + value.toLocaleString('en-IN');

export const AnnualAccommodationBookingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'AnnualAccommodationBooking'>>();
  // Backend supplies ISO date values and display labels.
  const checkInOptions = route.params?.checkInDates || [];
  const checkOutOptions = route.params?.checkOutDates || [];
  const insets = useSafeAreaInsets();
  const profile = useAppSelector(state => state.auth.profile);
  const scroll = useRef<React.ElementRef<typeof ScrollView>>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [dateField, setDateField] = useState<'in' | 'out' | null>(null);
  const [hotelId, setHotelId] = useState('');
  const [hotelPicker, setHotelPicker] = useState(false);
  const [occupancy, setOccupancy] = useState<'single' | 'double' | null>(null);
  const [captcha, setCaptcha] = useState(makeCaptcha);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const hotel = ANNUAL_HOTELS.find(item => item.id === hotelId);
  const nights = checkIn && checkOut ? Math.max(0, Math.round((parseDate(checkOut).getTime() - parseDate(checkIn).getTime()) / 86400000)) : 0;
  const rate = hotel && occupancy ? hotel[occupancy] || 0 : 0;
  const total = rate * nights;
  const name = formatProfileName(profile?.name || [profile?.title, profile?.firstName, profile?.surname].filter(Boolean).join(' '));
  const pay = () => {
    if (!checkIn || !checkOut || !hotel || !occupancy) { setError('Please select your dates, hotel and occupancy.'); return; }
    if (!nights) { setError('Check-out must be after check-in.'); return; }
    if (hotel.soldOut || !rate) { setError('This room option is unavailable. Please choose another.'); return; }
    if (answer.trim().toLowerCase() !== captcha.toLowerCase()) { setError('Please enter the correct captcha.'); return; }
    setError('');
    Alert.alert('Payment unavailable', 'Booking and payment will be available when the accommodation service is connected. No payment has been taken and no room has been booked.');
  };
  const dateOptions = (dateField === 'in' ? checkInOptions : checkOutOptions).filter(option => dateField === 'in' || !checkIn || parseDate(option.value) > parseDate(checkIn));
  const dateButton = (label: string, value: string, type: 'in' | 'out') => <View style={styles.dateColumn}><Text style={styles.label}>{label} *</Text><TouchableOpacity style={styles.dateButton} onPress={() => setDateField(type)} accessibilityRole="button" accessibilityLabel={label}><CalendarIcon size={17} color="#5474A6" /><Text style={[styles.dateText, !value && styles.muted]}>{(type === 'in' ? checkInOptions : checkOutOptions).find(option => option.value === value)?.label || 'Select date'}</Text><Text style={styles.dropdownArrow}>⌄</Text></TouchableOpacity></View>;

  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}><TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back"><ArrowBackIcon size={21} color="#FFFFFF" /></TouchableOpacity><View><Text style={styles.headerTitle}>Book your stay</Text><Text style={styles.headerSubtitle}>AIOC 2027 · Accommodation</Text></View></View>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.intro}><Text style={styles.eyebrow}>PLAN YOUR CONFERENCE STAY</Text><Text style={styles.title}>A comfortable stay,{'\n'}a memorable conference.</Text></View>
          <View style={styles.guest}><Text style={styles.guestLabel}>GUEST DETAILS</Text><Text style={styles.guestName}>{name || 'Your account'}</Text><Text style={styles.guestNote}>Conference registration number will be provided with your booking details.</Text></View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Stay details</Text>
            <View style={styles.dateRow}>{dateButton('Check-in', checkIn, 'in')}{dateButton('Check-out', checkOut, 'out')}</View>
            <Text style={styles.label}>Hotel *</Text>
            <TouchableOpacity style={styles.select} onPress={() => setHotelPicker(true)} accessibilityRole="button" accessibilityLabel="Select hotel"><View style={styles.flex}><Text style={[styles.selectText, !hotel && styles.muted]}>{hotel?.name || 'Choose your hotel'}</Text></View><Text style={styles.chevron}>⌄</Text></TouchableOpacity>
            <Text style={styles.label}>Occupancy type *</Text>
            <View style={styles.occupancyRow}>{(['single', 'double'] as const).map(type => {
              const disabled = !hotel || hotel[type] === null;
              return <TouchableOpacity key={type} disabled={disabled} onPress={() => { setOccupancy(type); setError(''); }} style={[styles.occupancy, occupancy === type && styles.occupancySelected, disabled && styles.unavailable]} accessibilityRole="radio" accessibilityState={{ checked: occupancy === type, disabled }}><Text style={styles.occupancyTitle}>{type === 'single' ? 'Single' : 'Double'}</Text><Text style={styles.occupancyRate}>{hotel && hotel[type] !== null ? money(hotel[type]!) : '—'}</Text><Text style={styles.perNight}>{disabled && hotel ? 'Unavailable' : 'per room / night'}</Text></TouchableOpacity>;
            })}</View>
            <Text style={styles.label}>Payment mode</Text><View style={styles.online}><View style={styles.onlineDot} /><Text style={styles.onlineText}>Online payment</Text></View>
          </View>
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Payment summary</Text>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Room rate / night</Text><Text style={styles.summaryValue}>{money(rate)}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Number of nights</Text><Text style={styles.summaryValue}>{nights}</Text></View>
            <View style={styles.totalRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.total}>{money(total)}</Text></View>
            <Text style={styles.breakfast}>Buffet breakfast included · 1 room</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Final check</Text><Text style={styles.help}>Enter the code shown below. Tap the code to refresh.</Text>
            <View style={styles.captchaRow}><TouchableOpacity style={styles.captchaBadge} onPress={() => { setCaptcha(makeCaptcha()); setAnswer(''); }} accessibilityRole="button" accessibilityLabel="Refresh captcha"><Text style={styles.captchaText}>{captcha}</Text><Text style={styles.chevron}>↻</Text></TouchableOpacity><TextInput style={styles.captchaInput} value={answer} onChangeText={setAnswer} placeholder="Enter code" placeholderTextColor="#94A3B8" autoCapitalize="none" autoCorrect={false} onFocus={() => requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: true }))} accessibilityLabel="Enter captcha" /></View>
            <View style={styles.notice}><Text style={styles.noticeText}>Please check all entries before proceeding. Full advance payment is required; payments are non-refundable.</Text></View>
            {!!error && <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>}
            <TouchableOpacity style={styles.pay} onPress={pay} accessibilityRole="button"><Text style={styles.payText}>Pay Now</Text><Text style={styles.payText}>{money(total)} →</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={dateField !== null} transparent animationType="slide" onRequestClose={() => setDateField(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHeading}><Text style={styles.sectionTitle}>{dateField === 'in' ? 'Check-in date' : 'Check-out date'}</Text><TouchableOpacity onPress={() => setDateField(null)} style={styles.close} accessibilityRole="button" accessibilityLabel="Close date selection"><Text style={styles.chevron}>×</Text></TouchableOpacity></View>
            <ScrollView>
              {dateOptions.length ? dateOptions.map(option => (
                <TouchableOpacity key={option.value} style={[styles.hotelOption, (dateField === 'in' ? checkIn : checkOut) === option.value && styles.occupancySelected]} accessibilityRole="button" onPress={() => {
                  if (dateField === 'in') {
                    setCheckIn(option.value);
                    if (checkOut && parseDate(checkOut) <= parseDate(option.value)) setCheckOut('');
                  } else setCheckOut(option.value);
                  setDateField(null);
                  setError('');
                }}><Text style={styles.selectText}>{option.label}</Text></TouchableOpacity>
              )) : <Text style={styles.help}>{dateField === 'out' && !checkIn ? 'Select a check-in date first. Dates will be available once provided.' : 'No booking dates available yet.'}</Text>}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal visible={hotelPicker} transparent animationType="slide" onRequestClose={() => setHotelPicker(false)}>
        <View style={styles.modalOverlay}><View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}><View style={styles.sheetHeading}><Text style={styles.sectionTitle}>Choose your hotel</Text><TouchableOpacity onPress={() => setHotelPicker(false)} style={styles.close} accessibilityRole="button" accessibilityLabel="Close hotel selection"><Text style={styles.chevron}>×</Text></TouchableOpacity></View><ScrollView>{ANNUAL_HOTELS.map(item => <TouchableOpacity key={item.id} disabled={!!item.soldOut} accessibilityRole="button" accessibilityState={{ disabled: !!item.soldOut, selected: hotelId === item.id }} style={[styles.hotelOption, hotelId === item.id && styles.occupancySelected, item.soldOut && styles.unavailable]} onPress={() => { setHotelId(item.id); setOccupancy(null); setHotelPicker(false); setError(''); }}><Text style={styles.selectText}>{item.name}</Text>{item.soldOut && <Text style={styles.hotelRoom}>Sold out</Text>}</TouchableOpacity>)}</ScrollView></View></View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownArrow: { color: '#6283AA', fontSize: 18 },
  flex: { flex: 1 }, screen: { flex: 1, backgroundColor: '#F4F7FC' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#0B1728', paddingHorizontal: 16, paddingBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#20314B', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#FFFFFF', fontSize: 21, fontWeight: '700' }, headerSubtitle: { color: '#B8C7DB', fontSize: 11, marginTop: 4 },
  content: { padding: 16, gap: 18, width: '100%', maxWidth: 640, alignSelf: 'center' },
  intro: { paddingVertical: 10 }, eyebrow: { color: '#6283AA', fontSize: 9, fontWeight: '800', letterSpacing: 1.4 }, title: { color: '#17233E', fontSize: 26, lineHeight: 35, fontWeight: '700', marginTop: 10 },
  guest: { padding: 20, backgroundColor: '#EAF1FC', borderRadius: 20 }, guestLabel: { color: '#7087AA', fontSize: 9, fontWeight: '800', letterSpacing: 1 }, guestName: { color: '#253D60', fontSize: 17, fontWeight: '700', marginTop: 8 }, guestNote: { color: '#7087AA', fontSize: 11, lineHeight: 18, marginTop: 8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E3EAF4' }, sectionTitle: { fontSize: 18, color: '#253D60', fontWeight: '700' },
  label: { fontSize: 12, fontWeight: '600', color: '#52647C', marginTop: 20, marginBottom: 10 },
  dateRow: { flexDirection: 'row', gap: 12 }, dateColumn: { flex: 1 }, dateButton: { borderWidth: 1, borderColor: '#DDE5EF', borderRadius: 12, paddingHorizontal: 10, minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 6 }, dateText: { flex: 1, color: '#253D60', fontSize: 12 }, muted: { color: '#94A3B8' },
  select: { flexDirection: 'row', alignItems: 'center', padding: 14, minHeight: 54, borderRadius: 12, borderWidth: 1, borderColor: '#DDE5EF', gap: 8 }, selectText: { fontSize: 14, lineHeight: 21, color: '#253D60', fontWeight: '600' }, hotelRoom: { fontSize: 11, color: '#7C8AA4', lineHeight: 18, marginTop: 5 }, chevron: { color: '#6283AA', fontSize: 24 },
  occupancyRow: { flexDirection: 'row', gap: 12 }, occupancy: { flex: 1, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#DDE5EF' }, occupancySelected: { borderColor: '#6C94C7', backgroundColor: '#EFF5FF' }, occupancyTitle: { fontSize: 13, color: '#52647C', fontWeight: '600' }, occupancyRate: { fontSize: 18, color: '#2D619B', fontWeight: '700', marginTop: 8 }, perNight: { fontSize: 9, color: '#94A3B8', marginTop: 5 }, unavailable: { opacity: 0.45 },
  online: { flexDirection: 'row', gap: 8, alignItems: 'center' }, onlineDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 4, borderColor: '#4B80B7' }, onlineText: { fontSize: 13, color: '#52647C' },
  summary: { backgroundColor: '#253D68', padding: 22, borderRadius: 22 }, summaryTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 16 }, summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }, summaryLabel: { color: '#BECDE4', fontSize: 13 }, summaryValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' }, totalRow: { borderTopWidth: 1, borderTopColor: '#4B6187', paddingTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, totalLabel: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }, total: { color: '#FFFFFF', fontSize: 27, fontWeight: '700' }, breakfast: { color: '#B8CAE1', fontSize: 10, marginTop: 14 },
  help: { fontSize: 12, lineHeight: 19, color: '#94A3B8', marginTop: 8 }, captchaRow: { flexDirection: 'row', gap: 12, marginTop: 18 }, captchaBadge: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#EAF0FA', minHeight: 54, borderRadius: 12 }, captchaText: { fontSize: 20, letterSpacing: 3, color: '#334A76', fontWeight: '700' }, captchaInput: { flex: 1, minWidth: 0, borderWidth: 1, borderColor: '#DDE5EF', borderRadius: 12, paddingHorizontal: 12, color: '#253D60' },
  notice: { backgroundColor: '#FFF7E9', padding: 12, borderRadius: 12, marginTop: 18 }, noticeText: { color: '#987345', fontSize: 11, lineHeight: 19 }, error: { color: '#B45353', fontSize: 12, lineHeight: 19, marginTop: 12 },
  pay: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 54, backgroundColor: '#2E5791', paddingHorizontal: 18, borderRadius: 14, marginTop: 18 }, payText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7,19,38,0.6)', justifyContent: 'flex-end' }, sheet: { maxHeight: '80%', backgroundColor: '#FFFFFF', borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20 }, sheetHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }, close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, hotelOption: { borderWidth: 1, borderColor: '#E3EAF4', padding: 16, borderRadius: 16, marginBottom: 10 },
});
