import React from 'react';
import { Alert, FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DrawerParamList } from '../navigation/types';
import type { ImageSourcePropType } from 'react-native';
import { ArrowBackIcon } from './Icons';
import { ScreenStatusBar } from './ScreenStatusBar';

interface DirectoryMember {
  id: string;
  name: string;
  role: string;
  address: string;
  email: string;
  photo: ImageSourcePropType;
}
export const MemberDirectory: React.FC<{
  title: string;
  introduction: string;
  data: DirectoryMember[];
}> = ({ title, introduction, data }) => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const insets = useSafeAreaInsets();
  const emailMember = async (email: string) => {
    try { await Linking.openURL(`mailto:${email}`); }
    catch { Alert.alert('Email unavailable', 'Please set up an email app to contact this member.'); }
  };
  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.openDrawer()} accessibilityRole="button" accessibilityLabel="Open navigation menu"><ArrowBackIcon size={20} color="#FFFFFF" /></TouchableOpacity>
        <View style={styles.headerDetails}><Text style={styles.headerTitle}>{title}</Text></View>
      </View>
      <FlatList
        style={styles.memberList}
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: Math.max(insets.bottom, 16) }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <View style={styles.intro}>
            <Text style={styles.introTitle}>{introduction}</Text>
            <Text style={styles.introText}>All India Ophthalmological Society</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No members available.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardAccent} />
            <View style={styles.identity}>
              <Image source={item.photo} style={styles.photo} resizeMode="cover" accessibilityLabel={item.name} />
              <View style={styles.details}><Text style={styles.role}>{item.role}</Text><Text style={styles.name}>{item.name}</Text></View>
            </View>
            <View style={styles.divider} />
            <View style={styles.contactSection}>
              <Text style={styles.addressLabel}>OFFICE ADDRESS</Text>
              <Text style={styles.address} selectable>{item.address}</Text>
            </View>
            <TouchableOpacity style={styles.emailButton} onPress={() => emailMember(item.email)} accessibilityRole="button" accessibilityLabel={`Email ${item.name}`}><Text style={styles.email}>{item.email}</Text><Text style={styles.arrow}>↗</Text></TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  memberList: {
    flex: 1,
  },
  intro: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  introTitle: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
    color: '#0F294A',
  },
  introText: {
    fontSize: 13,
    lineHeight: 21,
    color: '#64748B',
    marginTop: 5,
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 5,
    backgroundColor: '#F5A044',
  },
  contactSection: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
  },
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    backgroundColor: '#0B1728',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1C2C42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDetails: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 29,
    fontWeight: '700',
  },
  list: {
    paddingTop: 18,
    paddingHorizontal: 16,
    gap: 14,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    overflow: 'hidden',
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  photo: {
    width: 90,
    height: 102,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  details: {
    flex: 1,
    gap: 7,
  },
  role: {
    color: '#B86A12',
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '600',
  },
  name: {
    color: '#0F294A',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF1F6',
    marginVertical: 16,
  },
  addressLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  address: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 21,
  },
  emailButton: {
    marginTop: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  email: {
    color: '#1265A8',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    flex: 1,
  },
  arrow: {
    color: '#1265A8',
    fontSize: 18,
  },
  empty: {
    paddingVertical: 36,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
  },
});
