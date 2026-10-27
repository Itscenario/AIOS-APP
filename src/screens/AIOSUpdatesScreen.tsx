import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowBackIcon, BellIcon } from '../components/Icons';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { AIOS_UPDATES } from '../constants/aiosUpdates';
import type { RootStackParamList } from '../navigation/types';

const PALETTE = [
  { color: '#5E50B5', tint: '#F0EDFF' }, { color: '#B8732D', tint: '#FFF4E7' },
  { color: '#277F83', tint: '#E9F8F5' }, { color: '#3A71AF', tint: '#EAF3FF' },
];
export const AIOSUpdatesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back} accessibilityRole="button" accessibilityLabel="Go back"><ArrowBackIcon size={21} color="#FFFFFF" /></TouchableOpacity>
        <View><Text style={styles.headerTitle}>AIOS Updates</Text><Text style={styles.headerSubtitle}>Stay connected with your society</Text></View>
      </View>
      <FlatList data={AIOS_UPDATES} keyExtractor={item => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        ListHeaderComponent={<>
          <LinearGradient colors={['#19345F', '#3C6D99']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <View style={styles.heroRing} /><View style={styles.heroIcon}><BellIcon size={28} color="#FFFFFF" /></View>
            <Text style={styles.eyebrow}>THE AIOS BULLETIN</Text><Text style={styles.heroTitle}>Keep up with{'\n'}what matters.</Text><Text style={styles.heroCopy}>Announcements, opportunities and society updates in one place.</Text>
          </LinearGradient>
          <View style={styles.section}><Text style={styles.sectionTitle}>Explore updates</Text><Text style={styles.count}>{AIOS_UPDATES.length} updates</Text></View>
        </>}
        renderItem={({ item, index }) => {
          const palette = PALETTE[index % PALETTE.length];
          return (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AIOSUpdateDetail', { updateId: item.id })} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={item.title}>
              <View style={styles.cardTop}><View style={[styles.tag, { backgroundColor: palette.tint }]}><Text style={[styles.tagText, { color: palette.color }]}>{item.category}</Text></View></View>
              <Text style={styles.title}>{item.title}</Text><Text style={styles.description}>{item.description}</Text>
              <View style={styles.cardFooter}><Text style={[styles.action, { color: '#2563EB' }]}>{item.action}</Text><View style={[styles.arrowCircle, { backgroundColor: '#EFF6FF' }]}><Text style={[styles.arrow, { color: '#2563EB' }]}>→</Text></View></View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F7FC' },
  header: { backgroundColor: '#0B1728', flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#20314B', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' }, headerSubtitle: { color: '#AFBED6', fontSize: 11, marginTop: 4 },
  content: { padding: 16, width: '100%', maxWidth: 640, alignSelf: 'center' },
  hero: { padding: 24, borderRadius: 26, overflow: 'hidden' }, heroRing: { position: 'absolute', width: 190, height: 190, borderRadius: 95, borderWidth: 30, borderColor: 'rgba(255,255,255,0.06)', right: -60, top: -60 },
  heroIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  eyebrow: { color: '#B8DBF5', fontSize: 9, fontWeight: '800', letterSpacing: 1.8 }, heroTitle: { color: '#FFFFFF', fontSize: 29, lineHeight: 37, fontWeight: '700', marginTop: 10 }, heroCopy: { color: '#D6E7F6', fontSize: 12, lineHeight: 20, marginTop: 12 },
  section: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 16 }, sectionTitle: { color: '#17233E', fontSize: 20, fontWeight: '700' }, count: { color: '#64748B', fontSize: 11 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: '#E4EAF4', shadowColor: '#243D68', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9 }, tagText: { fontSize: 10, fontWeight: '700' }, number: { color: '#CBD5E1', fontSize: 17, fontWeight: '700' },
  title: { color: '#17233E', fontSize: 18, lineHeight: 25, fontWeight: '700', marginTop: 16 }, description: { color: '#64748B', fontSize: 12, lineHeight: 20, marginTop: 8 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F0F3F8', paddingTop: 12, marginTop: 16 }, action: { fontSize: 12, fontWeight: '700' }, arrowCircle: { width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, arrow: { fontSize: 20 },
});
