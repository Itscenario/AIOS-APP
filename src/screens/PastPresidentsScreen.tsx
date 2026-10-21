import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DrawerParamList } from '../navigation/types';
import { PAST_PRESIDENTS } from '../constants/pastPresidents';
import { ArrowBackIcon } from '../components/Icons';
import { ScreenStatusBar } from '../components/ScreenStatusBar';

export const PastPresidentsScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.openDrawer()} accessibilityRole="button" accessibilityLabel="Open navigation menu"><ArrowBackIcon size={20} color="#FFFFFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Past Presidents</Text>
      </View>
      <FlatList
        data={PAST_PRESIDENTS}
        keyExtractor={(item, index) => `${item.year}-${index}`}
        contentContainerStyle={[styles.list, { paddingBottom: Math.max(insets.bottom, 20) }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.intro}>
            <Text style={styles.eyebrow}>OUR LEGACY</Text>
            <Text style={styles.title}>A history of leadership</Text>
            <Text style={styles.subtitle}>Honouring the past Presidents of the All India Ophthalmological Society.</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>Since 1930</Text></View>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.timelineRow}>
            <View style={styles.rail}>
              {index > 0 && <View style={styles.lineAbove} />}
              <View style={styles.dot}><View style={styles.dotCentre} /></View>
              {index < PAST_PRESIDENTS.length - 1 && <View style={styles.lineBelow} />}
            </View>
            <View style={styles.card}>
              <View style={styles.yearBadge}><Text style={styles.year}>{item.year}</Text></View>
              <View style={styles.memberDetails}><Text style={styles.name}>{item.name}</Text><Text style={styles.role}>President, AIOS</Text></View>
            </View>
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  header: {
    backgroundColor: '#0B1728',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 18,
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
    flex: 1,
  },
  list: {
    paddingHorizontal: 18,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  intro: {
    paddingTop: 26,
    paddingBottom: 24,
  },
  eyebrow: {
    color: '#B96B16',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    marginTop: 8,
    color: '#0F294A',
    fontSize: 27,
    lineHeight: 36,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 14,
    lineHeight: 23,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF0DD',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 14,
  },
  badgeText: {
    color: '#99530D',
    fontSize: 12,
    fontWeight: '600',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  rail: {
    width: 24,
    alignItems: 'center',
    marginRight: 10,
  },
  lineAbove: {
    position: 'absolute',
    top: 0,
    height: 40,
    width: 2,
    backgroundColor: '#D9E0ED',
  },
  lineBelow: {
    position: 'absolute',
    top: 40,
    bottom: 0,
    width: 2,
    backgroundColor: '#D9E0ED',
  },
  dot: {
    marginTop: 32,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dotCentre: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF9633',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3E8F1',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    minHeight: 82,
  },
  yearBadge: {
    backgroundColor: '#EEF2FC',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
  },
  year: {
    color: '#343F79',
    fontSize: 14,
    fontWeight: '800',
  },
  memberDetails: {
    flex: 1,
  },
  name: {
    color: '#1E293B',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  role: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
});
