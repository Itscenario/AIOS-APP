import React from 'react';
import {
  Alert,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowBackIcon,
  CalendarIcon,
  LocationPinIcon,
} from '../components/Icons';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { MEETING_EVENTS, MeetingEvent } from '../constants/meetingCalendar';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const dateLabel = (value: string) => {
  const [year, month, day] = value.split('-');
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
};

export const MeetingCalendarScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const events = MEETING_EVENTS;
  const viewDetails = async (event: MeetingEvent) => {
    if (!event.detailsUrl) return;
    if (!/^https?:\/\//i.test(event.detailsUrl)) return;
    try {
      await Linking.openURL(event.detailsUrl);
    } catch {
      Alert.alert('Unable to open details', 'Please try again later.');
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowBackIcon size={21} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Meeting Calendar</Text>
          <Text style={styles.headerSubtitle}>Connect. Learn. Grow.</Text>
        </View>
      </View>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        ListHeaderComponent={
          <View>
            <LinearGradient
              colors={['#253B79', '#5752AE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <View style={styles.heroCircle} />
              <View style={styles.heroIcon}>
                <CalendarIcon size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.eyebrow}>AIOS EVENTS</Text>
              <Text style={styles.heroTitle}>
                Make room for{'\n'}your next connection.
              </Text>
              <Text style={styles.heroSubtitle}>
                Conferences, meetings and PrayogShala events.
              </Text>
            </LinearGradient>
            <View style={styles.sectionRow}>
              <View>
                {/* <Text style={styles.sectionEyebrow}>YOUR NEXT OPPORTUNITY</Text> */}
                <Text style={styles.sectionTitle}>Explore meetings</Text>
              </View>
              <View style={styles.countPill}>
                <Text style={styles.count}>{events.length} events</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item, index }) => {
          const isWorkshop = item.category === 'PrayogShala';
          const accent = isWorkshop ? '#0D9488' : '#6652C7';
          const tint = isWorkshop ? '#E7F8F3' : '#F0EDFF';
          const showMonth =
            index === 0 ||
            events[index - 1].startDate.slice(0, 7) !==
              item.startDate.slice(0, 7);
          return (
            <View>
              {showMonth && (
                <View style={styles.monthHeading}>
                  <View style={styles.monthDot} />
                  <Text style={styles.monthHeadingText}>
                    {MONTHS[Number(item.startDate.slice(5, 7)) - 1]}{' '}
                    {item.startDate.slice(0, 4)}
                  </Text>
                  <View style={styles.monthRule} />
                </View>
              )}
              <View style={styles.card}>
                <View
                  style={[styles.cardAccent, { backgroundColor: accent }]}
                />
                <View style={styles.eventTop}>
                  <View style={[styles.dateBadge, { backgroundColor: tint }]}>
                    <Text style={[styles.month, { color: accent }]}>
                      {MONTHS[
                        Number(item.startDate.slice(5, 7)) - 1
                      ].toUpperCase()}
                    </Text>
                    <Text style={[styles.day, { color: accent }]}>
                      {Number(item.startDate.slice(8, 10))}
                    </Text>
                    <Text style={styles.year}>
                      {item.startDate.slice(0, 4)}
                    </Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <View
                      style={[styles.categoryPill, { backgroundColor: tint }]}
                    >
                      <Text style={[styles.category, { color: accent }]}>
                        {item.category}
                      </Text>
                    </View>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                  </View>
                </View>
                <View style={styles.metaPanel}>
                  <View style={styles.meta}>
                    <CalendarIcon size={16} color="#64748B" />
                    <Text style={styles.metaText}>
                      {dateLabel(item.startDate)}
                      {item.startDate !== item.endDate
                        ? ` – ${dateLabel(item.endDate)}`
                        : ''}
                    </Text>
                  </View>
                  <View style={styles.meta}>
                    <LocationPinIcon size={16} color="#64748B" />
                    <Text style={styles.metaText}>{item.location}</Text>
                  </View>
                </View>
                <View style={styles.footer}>
                  <TouchableOpacity
                    disabled={!item.detailsUrl}
                    onPress={() => viewDetails(item)}
                    accessibilityRole="link"
                    accessibilityState={{ disabled: !item.detailsUrl }}
                    accessibilityLabel={`View details for ${item.title}`}
                    style={[styles.detailsButton, { backgroundColor: tint }]}
                  >
                    <Text style={[styles.detailsText, { color: '#2563EB' }]}>
                      View Details
                    </Text>
                    <Text style={[styles.arrow, { color: '#2563EB' }]}>↗</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionEyebrow: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  countPill: {
    backgroundColor: '#EDE9FB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  monthHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 14,
    marginTop: 2,
  },
  monthHeadingText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  monthDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#8B7CCF',
  },
  monthRule: { height: 1, flex: 1, backgroundColor: '#DEE4F0' },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 30,
    width: 3,
    height: 36,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 8,
  },
  metaPanel: {
    backgroundColor: '#F8FAFD',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 2,
  },

  screen: { flex: 1, backgroundColor: '#F5F7FC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0B1728',
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#20314B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 21, fontWeight: '700', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 12, color: '#AFBED6', marginTop: 4 },
  content: { padding: 16, width: '100%', maxWidth: 640, alignSelf: 'center' },
  hero: { borderRadius: 24, padding: 22, overflow: 'hidden' },
  heroCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 28,
    borderColor: 'rgba(255,255,255,0.06)',
    right: -65,
    top: -55,
  },
  heroIcon: {
    position: 'absolute',
    right: 22,
    bottom: 24,
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#BFDBFE',
  },
  heroTitle: {
    fontSize: 25,
    lineHeight: 33,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    paddingRight: 28,
  },
  heroSubtitle: {
    fontSize: 12,
    lineHeight: 19,
    color: '#DFE5FF',
    marginTop: 12,
    paddingRight: 48,
  },
  filters: { gap: 8, paddingVertical: 20 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipSelected: { backgroundColor: '#253B79', borderColor: '#253B79' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  chipTextSelected: { color: '#FFFFFF' },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 26,
    marginBottom: 18,
  },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#17233E' },
  count: { fontSize: 11, fontWeight: '700', color: '#6252AF' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E6EAF3',
    shadowColor: '#243D68',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  eventTop: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 18,
  },
  dateBadge: {
    width: 62,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  month: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  day: { fontSize: 28, fontWeight: '800', lineHeight: 35 },
  year: { fontSize: 10, color: '#64748B' },
  eventInfo: { flex: 1 },
  category: { fontSize: 9, fontWeight: '800', letterSpacing: 0.2 },
  eventTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '700',
    color: '#17233E',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginBottom: 10,
  },
  metaText: { flex: 1, fontSize: 12, lineHeight: 19, color: '#64748B' },
  footer: { marginTop: 14, alignItems: 'flex-end' },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    minHeight: 44,
  },
  detailsText: { fontSize: 13, fontWeight: '700' },
  arrow: { fontSize: 20 },
});
