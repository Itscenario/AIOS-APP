import { VideoShareIcon } from '../components/VideoShareIcon';
import React from 'react';
import { Image, Alert, Linking, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DrawerParamList } from '../navigation/types';
import { ArrowBackIcon } from '../components/Icons';
import { ScreenStatusBar } from '../components/ScreenStatusBar';

const VIDEO_URL = 'https://www.youtube.com/watch?v=zI8jBe6s2rQ';

export const AIOSThemeSongScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const insets = useSafeAreaInsets();
  const shareVideo = async () => {
    try {
      await Share.share({
        title: 'AIOS Theme Song',
        message: Platform.OS === 'ios'
          ? 'All India Ophthalmological Society — AIOS Theme Song'
          : `All India Ophthalmological Society — AIOS Theme Song\n${VIDEO_URL}`,
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
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.openDrawer()} accessibilityRole="button" accessibilityLabel="Open navigation menu"><ArrowBackIcon size={20} color="#FFFFFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>AIOS Theme Song</Text>
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Text style={styles.title}>From Darkness to Light</Text>
        <Text style={styles.subtitle}>All India Ophthalmological Society</Text>
        <TouchableOpacity
          style={styles.player}
          onPress={openYouTube}
          activeOpacity={0.9}
          accessibilityRole="link"
          accessibilityLabel="Play AIOS Theme Song on YouTube"
        >
          <Image source={require('../assets/images/aios-theme-song.jpg')} style={styles.thumbnail} resizeMode="cover" />
          <View style={styles.playOverlay}>
            <View style={styles.playButton}><Text style={styles.playSymbol}>▶</Text></View>
          </View>
          <TouchableOpacity
            style={styles.videoShare}
            onPress={event => {
              event.stopPropagation();
              shareVideo();
            }}
            accessibilityRole="button"
            accessibilityLabel="Share video"
          >
            <VideoShareIcon size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.watchBadge}><Text style={styles.watchBadgeText}>Watch on YouTube ↗</Text></View>
        </TouchableOpacity>
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
});
