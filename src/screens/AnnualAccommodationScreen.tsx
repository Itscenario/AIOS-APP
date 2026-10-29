import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowBackIcon, LocationPinIcon } from '../components/Icons';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { ANNUAL_HOTELS } from '../constants/annualAccommodation';

const money = (value: number | null) => value === null ? '—' : '₹' + value.toLocaleString('en-IN');
export const AnnualAccommodationScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <AppHeader style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back"><ArrowBackIcon size={21} color="#FFFFFF" /></TouchableOpacity>
        <View style={styles.flex}><Text style={styles.headerTitle}>Accommodation</Text><Text style={styles.headerSubtitle}>AIOC 2027 · Gandhinagar</Text></View>
      </AppHeader>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <LinearGradient colors={['#233C6D', '#53668F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Text style={styles.eyebrow}>YOUR CONFERENCE STAY</Text><Text style={styles.heroTitle}>Stay comfortably.{'\n'}Connect effortlessly.</Text>
          <Text style={styles.heroCopy}>Explore accommodation options for your visit.</Text>
          <View style={styles.breakfast}><Text style={styles.breakfastText}>Buffet breakfast included</Text></View>
        </LinearGradient>
        <View style={styles.sectionRow}><Text style={styles.sectionTitle}>Choose your stay</Text><Text style={styles.count}>{ANNUAL_HOTELS.length} hotels</Text></View>
        {ANNUAL_HOTELS.map(hotel => (
          <View key={hotel.id} style={styles.hotel}>
            <View style={styles.hotelTop}><View style={styles.starBadge}><Text style={styles.stars}>★ {hotel.stars} Star</Text></View>{hotel.soldOut && <View style={styles.soldOut}><Text style={styles.soldOutText}>Sold out</Text></View>}</View>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            {!!hotel.room && <Text style={styles.room}>{hotel.room}</Text>}
            <View style={styles.distance}><LocationPinIcon size={15} color="#7C8AA4" /><Text style={styles.distanceText}>{hotel.distance} from venue</Text></View>
            <View style={styles.rates}>
              <View style={styles.rate}><Text style={styles.rateLabel}>SINGLE TARIFF</Text><Text style={styles.price}>{money(hotel.single)}</Text></View>
              <View style={styles.divider} />
              <View style={styles.rate}><Text style={styles.rateLabel}>DOUBLE TARIFF</Text><Text style={styles.price}>{money(hotel.double)}</Text></View>
            </View>
            <Text style={styles.perNight}>Per room, per night</Text>
          </View>
        ))}
        <View style={styles.policyCard}>
          <Text style={styles.sectionTitle}>Before you book</Text>
          {['Rates include buffet breakfast.', 'Rates are per room, per night.', 'Extras are payable directly to the hotel at check-out.'].map(text => <View key={text} style={styles.noteRow}><View style={styles.dot} /><Text style={styles.noteText}>{text}</Text></View>)}
          <View style={styles.times}><View style={styles.flex}><Text style={styles.timeLabel}>CHECK-IN</Text><Text style={styles.time}>15:00 hrs</Text></View><View style={styles.flex}><Text style={styles.timeLabel}>CHECK-OUT</Text><Text style={styles.time}>12:00 hrs</Text></View></View>
          <Text style={styles.policyTitle}>Payment policy</Text><Text style={styles.noteText}>100% advance payment is required for room confirmation.</Text>
          <Text style={styles.policyTitle}>Cancellation policy</Text><Text style={styles.noteText}>Payment is non-refundable.</Text>
        </View>
        <Button customLayout style={styles.book} onPress={() => navigation.navigate('AnnualAccommodationBooking')} accessibilityRole="button"><Text style={styles.bookText}>Book Now</Text><Text style={styles.bookArrow}>→</Text></Button>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  flex: { flex: 1 }, screen: { flex: 1, backgroundColor: '#F4F7FC' },
  header: { backgroundColor: '#0B1728', flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#20314B', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#FFFFFF', fontSize: 21, fontWeight: '700' }, headerSubtitle: { color: '#B8C7DB', fontSize: 11, marginTop: 4 },
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', padding: 16 },
  hero: { borderRadius: 26, padding: 24 }, eyebrow: { color: '#BFDBFE', fontSize: 9, fontWeight: '800', letterSpacing: 1.6 },
  heroTitle: { color: '#FFFFFF', fontSize: 27, lineHeight: 35, fontWeight: '700', marginTop: 12 }, heroCopy: { color: '#D5E2F5', fontSize: 12, lineHeight: 20, marginTop: 12 },
  breakfast: { backgroundColor: 'rgba(255,255,255,0.13)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginTop: 18, alignSelf: 'flex-start' }, breakfastText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 16 }, sectionTitle: { fontSize: 19, fontWeight: '700', color: '#17233E' }, count: { fontSize: 11, color: '#64748B' },
  hotel: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 22, borderWidth: 1, borderColor: '#E3EAF4', marginBottom: 14 },
  hotelTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  starBadge: { backgroundColor: '#FFF7E6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9 }, stars: { color: '#A87B2B', fontSize: 11, fontWeight: '700' },
  soldOut: { backgroundColor: '#FFF1F2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9 }, soldOutText: { color: '#B45353', fontSize: 11, fontWeight: '700' },
  hotelName: { fontSize: 18, fontWeight: '700', lineHeight: 25, color: '#17233E' }, room: { color: '#64748B', fontSize: 12, lineHeight: 19, marginTop: 5 },
  distance: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 12 }, distanceText: { color: '#7C8AA4', fontSize: 11 },
  rates: { flexDirection: 'row', backgroundColor: '#F4F7FC', borderRadius: 14, paddingVertical: 15, marginTop: 18 },
  rate: { flex: 1, paddingHorizontal: 14 }, rateLabel: { fontSize: 8, fontWeight: '700', letterSpacing: 1, color: '#7C8AA4' }, price: { fontSize: 21, color: '#2B4974', fontWeight: '700', marginTop: 6 }, divider: { width: 1, backgroundColor: '#DEE6F2' },
  perNight: { color: '#94A3B8', fontSize: 10, marginTop: 9 },
  policyCard: { padding: 22, backgroundColor: '#EDF2FA', borderRadius: 22, marginTop: 8, borderWidth: 1, borderColor: '#DBE5F3' },
  noteRow: { flexDirection: 'row', gap: 9, marginTop: 13 }, dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#7C94BA', marginTop: 7 }, noteText: { flexShrink: 1, color: '#64748B', fontSize: 12, lineHeight: 20 },
  times: { flexDirection: 'row', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginTop: 20 }, timeLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700', letterSpacing: 1 }, time: { fontSize: 16, fontWeight: '700', color: '#334B70', marginTop: 6 },
  policyTitle: { fontSize: 13, fontWeight: '700', color: '#334B70', marginTop: 20, marginBottom: 6 },
  book: { minHeight: 56, backgroundColor: '#2E5791', borderRadius: 16, flexDirection: 'row', gap: 20, alignItems: 'center', justifyContent: 'center', marginTop: 20 }, bookText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' }, bookArrow: { color: '#FFFFFF', fontSize: 22 },
});
