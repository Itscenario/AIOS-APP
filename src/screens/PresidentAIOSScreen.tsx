import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import { VideoShareIcon } from '../components/VideoShareIcon';
import { PRESIDENT_ADDRESS_CONTINUATION } from '../constants/presidentAddress';
import React from 'react';
import { Image, Alert, Linking, Platform, Share, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DrawerParamList } from '../navigation/types';
import { ArrowBackIcon } from '../components/Icons';
import { ScreenStatusBar } from '../components/ScreenStatusBar';

const VIDEO_URL = 'https://www.youtube.com/watch?v=_BLeUq8Ds1o';

export const PresidentAIOSScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const insets = useSafeAreaInsets();
  const shareVideo = async () => {
    try {
      await Share.share({
        title: 'President AIOS',
        message: Platform.OS === 'ios' ? 'President AIOS — Know your President' : `President AIOS — Know your President\n${VIDEO_URL}`,
        ...(Platform.OS === 'ios' ? { url: VIDEO_URL } : {}),
      });
    } catch {
      Alert.alert('Unable to share', 'Please try again.');
    }
  };
  const openYouTube = async () => {
    try { await Linking.openURL(VIDEO_URL); }
    catch { Alert.alert('Unable to open YouTube', 'Please try again.'); }
  };
  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <AppHeader style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.openDrawer()} accessibilityRole="button" accessibilityLabel="Open navigation menu"><ArrowBackIcon size={20} color="#FFFFFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>President AIOS</Text>
      </AppHeader>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Text style={styles.title}>Know your President</Text>
        <Text style={styles.subtitle}>All India Ophthalmological Society</Text>
        <TouchableOpacity
          style={styles.player}
          onPress={openYouTube}
          activeOpacity={0.9}
          accessibilityRole="link"
          accessibilityLabel="Play President AIOS on YouTube"
        >
          <Image source={require('../assets/images/president-video.jpg')} style={styles.thumbnail} resizeMode="cover" />
          <View style={styles.playOverlay}>
            <View style={styles.playButton}><Text style={styles.playSymbol}>▶</Text></View>
          </View>
          <Button
            customLayout
            style={styles.videoShare}
            onPress={event => {
              event.stopPropagation();
              shareVideo();
            }}
            accessibilityRole="button"
            accessibilityLabel="Share video"
          >
            <VideoShareIcon size={30} color="#FFFFFF" />
          </Button>
          <View style={styles.watchBadge}><Text style={styles.watchBadgeText}>Watch on YouTube ↗</Text></View>
        </TouchableOpacity>
        <View style={styles.addressCard}>
          <Text style={styles.addressHeading}>President Address</Text>
          <Text style={styles.addressParagraph}>
            Honorable Chief Guest <Text style={styles.addressBold}>Shri Bhajan lal Sharma ji</Text>, Chief Minister of Rajasthan.
          </Text>
          <Text style={styles.addressParagraph}>
            Honorable Guest of Honors <Text style={styles.addressBold}>Prof. Tetsuro Oshika</Text>, President of the Asia-Pacific Academy of Ophthalmology (APAO){'\n'}And
          </Text>
          <Text style={styles.addressParagraph}>
            <Text style={styles.addressBold}>Prof Peter McCluskey</Text>, President, Royal Australian and New Zealand College of Ophthalmologists{'\n'}Dignitaries on the Dias-------------------
          </Text>
          <Text style={styles.addressParagraph}>Office Bearers of AIOS, Members of AIOS Committees</Text>
          <Text style={styles.addressParagraph}>Respected Past Presidents, Respected Seniors, Colleagues and My</Text>
          <Text style={[styles.addressParagraph, styles.addressBold]}>Dear friends</Text>
          <Text style={styles.addressParagraph}>
            It is both an honour and a privilege to stand before you today at the function of AIOC 2026. We gather here not only as professionals in ophthalmology, but as custodians of vision, of health, and of hope for millions across our nation. Each day, through our work we touch lives in ways that go far beyond medicine. When a patient regains sight, we are not just restoring vision. We are restoring dignity, independence, and possibilities.
          </Text>
          <Text style={styles.addressParagraph}>
            “India is progressing at an extraordinary pace—not only in economic strength but also in the aspirations, confidence, and limitless possibilities of its people. As we look ahead to 2047, the centenary of our independence, the vision of <Text style={styles.addressItalic}>Viksit Bharat</Text> inspires each one of us to strive for a stronger, more inclusive nation.
          </Text>
          {PRESIDENT_ADDRESS_CONTINUATION.map((paragraph, index) => (
            <Text
              key={`address-${index}`}
              style={[
                styles.addressParagraph,
                paragraph.length < 120 && styles.addressBold,
              ]}
            >
              {paragraph}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  videoShare: {
    position: 'absolute',
    left: 8,
    bottom: 6,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  addressCard: {
    marginTop: 22,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#DCEBFA',
    borderWidth: 1,
    borderColor: '#C7DFFD',
    gap: 22,
  },
  addressHeading: {
    color: '#0F294A',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  },
  addressBold: {
    fontWeight: '700',
  },
  addressItalic: {
    fontStyle: 'italic',
  },
  addressParagraph: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 26,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 48,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F1F5F9',
  },
  shareText: {
    color: '#0F294A',
    fontSize: 14,
    fontWeight: '600',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    flex: 1,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  title: {
    color: '#0F294A',
    fontSize: 25,
    lineHeight: 34,
    fontWeight: '700',
    marginTop: 10,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 21,
    marginTop: 6,
    marginBottom: 22,
  },
  player: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
    borderRadius: 14,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#FF0033',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playSymbol: {
    color: '#FFFFFF',
    fontSize: 24,
    marginLeft: 3,
  },
  watchBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 5,
    padding: 7,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  watchBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  details: {
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginTop: 16,
  },
  videoTitle: {
    color: '#0F294A',
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '700',
  },
  channel: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 8,
  },
  youtubeButton: {
    backgroundColor: '#E62117',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  youtubeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
