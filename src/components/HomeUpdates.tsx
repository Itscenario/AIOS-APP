import React, { useEffect, useRef } from 'react';
import { Animated, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { images } from '../constants/images';

const UPDATES = [
  { id: 'election', title: 'VP Election 2027', description: 'Notification', action: 'Know More »' },
  { id: 'reform', title: 'AIOS Reform', description: 'For more details', action: 'Read More »' },
  { id: 'prayogshala', title: 'Apply for AIOS Prayogshala Connect', action: 'Click here to Apply »' },
  { id: 'jobs', title: 'Jobs in Ophthalmology', action: 'More Details »' },
  { id: 'pcpndt', title: 'Update on PCPNDT & TPA', action: 'Read More »' },
  { id: 'profile', title: 'How to update your profile?', description: 'Stay Updated', action: 'More Details Click here »' },
];
// Names and roles reproduce the supplied design reference.
const OFFICE_BEARERS = [
  { id: 'president', role: 'President', name: 'Dr. J. S. Titiyal', action: 'President Address' },
  { id: 'secretary', role: 'Honorary General Secretary', name: 'Dr. Santosh G. Honavar', action: 'Secretary Address' },
  { id: 'treasurer', role: 'Honorary Treasurer', name: 'Dr. Manoj Chandra Mathur', action: 'Treasurer Address' },
];

export const HomeUpdates: React.FC<{ onJobs: () => void; onProfile: () => void }> = ({ onJobs, onProfile }) => {
  const newOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const blink = Animated.loop(Animated.sequence([
      Animated.timing(newOpacity, { toValue: 0.15, duration: 650, useNativeDriver: true }),
      Animated.timing(newOpacity, { toValue: 1, duration: 650, useNativeDriver: true }),
    ]));
    blink.start();
    return () => blink.stop();
  }, [newOpacity]);
  return (
    <>
      <View style={styles.panel}>
        <Text style={styles.heading}>AIOS Updates</Text>
        <FlatList
          data={UPDATES}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.update}>
              <Text style={styles.updateTitle}>{item.title}</Text>
              {item.id === 'election' ? (
                <View style={styles.notificationRow}>
                  <Text style={styles.description}>Notification <Text style={styles.link}>Know More »</Text></Text>
                  <Animated.View style={[styles.newBadge, { opacity: newOpacity }]} accessibilityLabel="New update">
                    <Text style={styles.newText}>New</Text>
                  </Animated.View>
                </View>
              ) : item.id === 'reform' ? (
                <Text style={styles.description}>For More Details <Text style={styles.link}>Read More »</Text></Text>
              ) : item.description && <Text style={styles.description}>{item.description}</Text>}
              {item.id === 'prayogshala' && (
                <Text style={[styles.description, styles.link]}>Click here to Apply »</Text>
              )}
              {item.id === 'pcpndt' && (
                <Text style={[styles.description, styles.link]}>Read More »</Text>
              )}
              {(item.id === 'jobs' || item.id === 'profile') && (
                <TouchableOpacity accessibilityRole="button" style={styles.linkButton} onPress={item.id === 'jobs' ? onJobs : onProfile}>
                  <Text style={styles.link}>{item.action}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>News &amp; Views</Text>
        <View style={styles.newsCard}>
          <Text style={styles.newsTag}>NEWS &amp; VIEWS</Text>
          <Text style={styles.newsTitle}>A diabetic donor’s cornea is as good as any other a year after transplant</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Office Bearers</Text>
        <FlatList
          data={OFFICE_BEARERS}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.officers}
          renderItem={({ item }) => (
            <View style={styles.officerCard}>
              <Image source={images[item.id]} style={styles.portrait} resizeMode="cover" accessibilityLabel={item.name} />
              <View style={styles.officerDetails}>
                <Text style={styles.role}>{item.role}</Text>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5,
  },
  newBadge: {
    backgroundColor: '#55BFDD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED0A4',
    padding: 18,
    borderRadius: 12,
  },
  heading: {
    color: '#333333',
    fontSize: 23,
    lineHeight: 31,
    fontWeight: '700',
    marginBottom: 12,
  },
  update: {
    paddingVertical: 12,
  },
  updateTitle: {
    color: '#3F3F46',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  description: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 5,
  },
  linkButton: {
    minHeight: 44,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  link: {
    color: '#0874CD',
    fontSize: 14,
    lineHeight: 22,
  },
  separator: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  section: {
    marginTop: 8,
  },
  newsCard: {
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED0A4',
    borderRadius: 12,
    gap: 10,
  },
  newsTag: {
    color: '#B86A12',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  newsTitle: {
    color: '#0067B9',
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '600',
  },
  officers: {
    gap: 14,
  },
  officerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    backgroundColor: '#F3F3F3',
    padding: 16,
    borderRadius: 10,
  },
  portrait: {
    width: 78,
    height: 96,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  officerDetails: {
    flex: 1,
    gap: 6,
  },
  role: {
    color: '#0067B9',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
  },
  name: {
    color: '#D97706',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  addressButton: {
    backgroundColor: '#343F79',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 11,
    alignSelf: 'flex-start',
    marginTop: 5,
    minHeight: 44,
    justifyContent: 'center',
  },
  addressText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 18,
  },
});
