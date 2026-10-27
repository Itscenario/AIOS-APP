import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { images } from '../constants/images';

const OFFICERS = [
  { id: 'president', role: 'President', name: 'Dr. J. S. Titiyal', action: 'President Address', color: '#4F64A5', tint: '#ECF0FC' },
  { id: 'secretary', role: 'Honorary General Secretary', name: 'Dr. Santosh G. Honavar', action: 'Secretary Address', color: '#318A82', tint: '#E7F5F1' },
  { id: 'treasurer', role: 'Honorary Treasurer', name: 'Dr. Manoj Chandra Mathur', action: 'Treasurer Address', color: '#99734F', tint: '#FAF0E5' },
];
export const DashboardOfficeBearers: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Office Bearers</Text>
      {OFFICERS.map(officer => <View key={officer.id} style={[styles.card, officer.id === 'treasurer' && styles.lastCard]}>
        <View style={[styles.accent, { backgroundColor: officer.color }]} />
        <View style={styles.row}>
          <View style={[styles.portraitFrame, { backgroundColor: officer.tint }]}><Image source={images[officer.id]} style={styles.portrait} resizeMode="cover" accessibilityLabel={officer.name} /></View>
          <View style={styles.copy}>
            <Text style={[styles.role, { color: officer.color }]}>{officer.role}</Text>
            <Text style={styles.name}>{officer.name}</Text>
            <View style={[styles.button, { backgroundColor: officer.tint }]}>
              <Text style={[styles.buttonText, { color: officer.color }]}>{officer.action}</Text>{/* <Text style={[styles.arrow, { color: officer.color }]}>↗</Text> */}
            </View>
          </View>
        </View>
      </View>)}

    </View>
  );
};
const styles = StyleSheet.create({
  section: { marginHorizontal: 16, marginTop: 28, marginBottom: 0 },
  eyebrow: { fontSize: 8, fontWeight: '800', letterSpacing: 1.5, color: '#8C9BB3', marginBottom: 6 },
  heading: { fontSize: 22, fontWeight: '700', color: '#20324F', marginBottom: 16 },
  subtitle: { fontSize: 12, color: '#8A98AD', lineHeight: 20, marginTop: 6, marginBottom: 18 },
  card: { borderWidth: 1, borderColor: '#E4EAF2', backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18, marginBottom: 14, shadowColor: '#243D68', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  lastCard: { marginBottom: 0 },
  accent: { position: 'absolute', top: 28, left: 0, width: 3, height: 36, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  portraitFrame: { padding: 4, borderRadius: 19 },
  portrait: { width: 78, height: 100, borderRadius: 15 },
  copy: { flex: 1 }, role: { fontSize: 11, fontWeight: '600', lineHeight: 17 },
  name: { fontSize: 16, fontWeight: '700', lineHeight: 23, color: '#253651', marginTop: 6 },
  button: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, marginTop: 14, minHeight: 44 },
  buttonText: { flexShrink: 1, fontSize: 10, fontWeight: '700' }, arrow: { fontSize: 17 },
  overlay: { flex: 1, backgroundColor: 'rgba(7,19,38,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { width: '100%', maxWidth: 420, backgroundColor: '#FFFFFF', padding: 24, borderRadius: 24 },
  address: { color: '#64748B', fontSize: 14, lineHeight: 23 }, email: { color: '#4F64A5', fontSize: 13, marginTop: 14 },
  close: { padding: 14, borderRadius: 12, backgroundColor: '#ECF0FC', alignItems: 'center', marginTop: 24 }, closeText: { color: '#4F64A5', fontWeight: '700' },
});
