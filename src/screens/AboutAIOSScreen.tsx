import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowBackIcon } from '../components/Icons';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { images } from '../constants/images';
import { ABOUT_AIOS_ACTIVITIES, ABOUT_AIOS_INTRO, ABOUT_AIOS_OBJECTIVES } from '../constants/aboutAIOS';
import type { DrawerParamList } from '../navigation/types';

export const AboutAIOSScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.openDrawer()} accessibilityRole="button" accessibilityLabel="Open navigation menu"><ArrowBackIcon size={20} color="#FFFFFF" /></TouchableOpacity>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.brandGroup}><Text style={styles.brand}>All India Ophthalmological Society</Text><Text style={styles.tagline}>FROM DARKNESS TO LIGHT</Text></View>
      </View>
      <View style={styles.breadcrumb}><Text style={styles.pageTitle}>About Us</Text></View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>All India Ophthalmological Society</Text>
        <Text style={styles.body}>{ABOUT_AIOS_INTRO}</Text>
        <Text style={styles.sectionTitle}>Objectives of AIOS</Text>
        <Text style={styles.body}>{ABOUT_AIOS_OBJECTIVES}</Text>
        <Text style={styles.sectionTitle}>Activities of AIOS</Text>
        <Text style={styles.body}>{ABOUT_AIOS_ACTIVITIES}</Text>
        <Text style={styles.body}>The society also gives incentives to the members in the form of awards, orations, prizes and fellowships in recognition of their services in the various specialities.</Text>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#343F79',
    paddingHorizontal: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  back: {
    width: 40,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 44,
    height: 50,
  },
  brandGroup: {
    flex: 1,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  tagline: {
    color: '#FBBF24',
    fontSize: 8,
    letterSpacing: 1,
    marginTop: 5,
  },
  breadcrumb: {
    backgroundColor: '#FFCA97',
    paddingHorizontal: 20,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  content: {
    padding: 20,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    gap: 16,
  },
  title: {
    color: '#100777',
    fontSize: 27,
    lineHeight: 36,
    fontWeight: '800',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 30,
    color: '#333333',
    fontWeight: '700',
    marginTop: 10,
  },
  body: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 28,
  },
});
