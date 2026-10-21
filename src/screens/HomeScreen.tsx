import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DrawerParamList } from '../navigation/types';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { ArrowBackIcon } from '../components/Icons';
import { images } from '../constants/images';
import { HomeUpdates } from '../components/HomeUpdates';
import { ABOUT_AIOS_INTRO } from '../constants/aboutAIOS';

const BANNERS = Array.from({ length: 7 }, (_, index) => ({
  id: `banner${index + 1}`,
  source: images[`banner${index + 1}`],
}));

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const focused = useIsFocused();
  const slider = useRef<FlatList<(typeof BANNERS)[number]>>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(0);
  const dragging = useRef(false);
  const openDashboard = () => navigation.navigate('Portal', { screen: 'Dashboard' });
  const goToSlide = (index: number) => {
    slider.current?.scrollToOffset({ offset: index * width, animated: true });
    setActive(index);
  };
  useEffect(() => {
    if (!focused || !width) return;
    const timer = setInterval(() => {
      if (dragging.current) return;
      setActive(current => {
        const next = (current + 1) % BANNERS.length;
        slider.current?.scrollToOffset({ offset: next * width, animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [focused, width]);
  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.openDrawer()}
          accessibilityRole="button"
          accessibilityLabel="Open navigation menu"
        >
          <ArrowBackIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.brandGroup}><Text style={styles.brand}>All India</Text><Text style={styles.brand}>Ophthalmological Society</Text><Text style={styles.tagline}>FROM DARKNESS TO LIGHT</Text></View>
      </View>
      <View style={styles.toolbar}>
        <Text style={styles.homeLabel}>Home</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/919697692000')} accessibilityRole="link"><Text style={styles.contact}>WhatsApp · 9697692000</Text></TouchableOpacity>
        <TouchableOpacity onPress={openDashboard} accessibilityRole="button"><Text style={styles.dashboard}>My Dashboard ↗</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.carousel} onLayout={({ nativeEvent }) => {
          const nextWidth = Math.max(0, nativeEvent.layout.width - 2);
          setWidth(nextWidth);
          slider.current?.scrollToOffset({ offset: active * nextWidth, animated: false });
        }}>
          {width > 0 && <FlatList
            ref={slider}
            style={{ height: width * 337 / 846 }}
            data={BANNERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            extraData={width}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            onScrollBeginDrag={() => { dragging.current = true; }}
            onScrollEndDrag={() => { dragging.current = false; }}
            onMomentumScrollEnd={({ nativeEvent }) => setActive(Math.round(nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => <View style={{ width, height: width * 337 / 846 }}><Image source={item.source} style={[styles.banner, { width, height: width * 337 / 846 }]} resizeMode="contain" accessibilityLabel={item.id} /></View>}
          />}
        </View>
        <View style={styles.pagination}>
          {BANNERS.map((banner, index) => <TouchableOpacity key={banner.id} style={styles.dotButton} onPress={() => goToSlide(index)} accessibilityRole="button" accessibilityLabel={`Show banner ${index + 1}`} accessibilityState={{ selected: active === index }}><View style={[styles.dot, active === index && styles.dotActive]} /></TouchableOpacity>)}
        </View>
        <View style={[styles.card, styles.youtubeCard]}>
          <Text style={styles.cardTitle}><Text style={styles.blue}>ONE AIOS</Text> — the all-in-one AIOS YouTube Channel</Text>
          <Text style={styles.body}>Live sessions and archived content, all in one place.</Text>
          <TouchableOpacity style={styles.subscribe} onPress={() => Linking.openURL('https://www.youtube.com/results?search_query=ONE+AIOS')} accessibilityRole="link"><Text style={styles.buttonText}>▶  Subscribe on YouTube</Text></TouchableOpacity>
        </View>

        
        {/* AIOS Suggestion / Grievance section temporarily hidden.
        <View style={[styles.card, styles.grievanceCard]}>
          <Text style={styles.orangeTitle}>AIOS Suggestion / Grievance Corner</Text>
          <View style={styles.divider} />
          <Text style={styles.body}>For adverse events</Text>
          <Text style={styles.body}>For issues with insurance &amp; TPA</Text>
          <Text style={styles.body}>Trade grievances · Any others</Text>
        </View>
        */}
        {/* AIOS Suraksha section temporarily hidden.
        <View style={[styles.card, styles.surakshaCard]}>
          <Text style={styles.orangeTitle}>AIOS SURAKSHA</Text>
          <View style={styles.divider} />
          <Text style={styles.body}>Introducing customised professional indemnity for ophthalmologists.</Text>
        </View>
        */}


        <View style={styles.card}>
          <Text style={styles.aboutTitle}>About AIOS</Text>
          <View style={styles.aboutAccent} />
          <Text style={styles.aboutBody}>{ABOUT_AIOS_INTRO}</Text>
          <Text style={styles.aboutBody}>The objectives of the society are cultivation and promotion of the study and practice of ophthalmic sciences, research and man-power development...</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AboutAIOS')} accessibilityRole="button" style={styles.readMore}><Text style={styles.readMoreText}>Read More</Text></TouchableOpacity>
        </View>
        <HomeUpdates
          onJobs={() => navigation.navigate('Portal', { screen: 'Jobs' })}
          onProfile={() => navigation.getParent()?.navigate('MyProfile')}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutBody: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 28,
    marginTop: 8,
    marginBottom: 10,
  },
  readMore: {
    alignSelf: 'flex-start',
    borderRadius: 24,
    backgroundColor: '#FFCA97',
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 4,
  },
  readMoreText: {
    color: '#101047',
    fontSize: 15,
    fontWeight: '500',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#343F79',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 16,
    gap: 8,
  },
  logo: {
    width: 50,
    height: 56,
  },
  brandGroup: {
    flex: 1,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  tagline: {
    color: '#FBBF24',
    fontSize: 8,
    letterSpacing: 1.3,
    marginTop: 5,
  },
  toolbar: {
    backgroundColor: '#101047',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
  },
  homeLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  contact: {
    color: '#FCD18F',
    fontSize: 11,
  },
  dashboard: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    gap: 16,
  },
  carousel: {
    width: '100%',
    aspectRatio: 846 / 337,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  banner: {
    aspectRatio: 846 / 337,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -10,
  },
  dotButton: {
    width: 32,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FB923C',
  },
  dotActive: {
    backgroundColor: '#FB923C',
  },
  card: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  youtubeCard: {
    backgroundColor: '#F6D8A5',
    borderColor: '#EFCB91',
  },
  grievanceCard: {
    backgroundColor: '#DCEBFF',
    borderColor: '#C4DDFE',
  },
  surakshaCard: {
    backgroundColor: '#FFF4F0',
    borderColor: '#FFE3D8',
  },
  cardTitle: {
    color: '#1E293B',
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
  },
  blue: {
    color: '#0067B9',
    fontWeight: '800',
  },
  orangeTitle: {
    color: '#D97706',
    fontSize: 19,
    lineHeight: 27,
    fontWeight: '700',
  },
  body: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 23,
  },
  subscribe: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    backgroundColor: '#E62117',
    padding: 13,
    marginTop: 4,
  },
  report: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    backgroundColor: '#D98B06',
    paddingVertical: 13,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  aboutTitle: {
    color: '#0F294A',
    fontSize: 22,
    fontWeight: '700',
  },
  aboutAccent: {
    width: 44,
    height: 3,
    backgroundColor: '#F59E0B',
  },
  aboutTagline: {
    color: '#64748B',
    fontStyle: 'italic',
    fontSize: 14,
  },
  learnMore: {
    minHeight: 44,
    justifyContent: 'center',
  },
  link: {
    color: '#0067B9',
    fontSize: 14,
    fontWeight: '600',
  },
});
