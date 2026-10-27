import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowBackIcon, DocumentIcon } from '../components/Icons';
import { ScreenStatusBar } from '../components/ScreenStatusBar';
import { NEWS_ARTICLES } from '../constants/newsViews';
import type { RootStackParamList } from '../navigation/types';

export const NewsViewDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'NewsViewDetail'>>();
  const insets = useSafeAreaInsets();
  const update = NEWS_ARTICLES.find(item => item.id === route.params.articleId);
  const url = update?.url;
  const validUrl = !!url && /^https?:\/\//i.test(url);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const nativeAvailable = !!UIManager.getViewManagerConfig('RNCWebView');
  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back"><ArrowBackIcon size={21} color="#FFFFFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>News & Views</Text>
      </View>
      {validUrl && nativeAvailable && !failed ? (
        <WebView key={retry} source={{ uri: url! }} style={styles.web} startInLoadingState renderLoading={() => <View style={styles.loading}><ActivityIndicator color="#3561A9" /></View>} onError={() => setFailed(true)} onHttpError={({ nativeEvent }) => { if (nativeEvent.statusCode >= 400) setFailed(true); }} originWhitelist={['http://*', 'https://*']} onShouldStartLoadWithRequest={request => /^https?:\/\//i.test(request.url) || request.url === 'about:blank'} />
      ) : (
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.icon}><DocumentIcon size={28} color="#3561A9" /></View>
            <Text style={styles.category}>{update?.category || 'NEWS & VIEWS'}</Text>
            <Text style={styles.title}>{update?.title || 'Article unavailable'}</Text>
            <Text style={styles.copy}>{update?.description}</Text>
            <Text style={styles.copy}>{failed ? 'Unable to load these details. Please try again.' : !validUrl ? 'Details will be available here once the article link is provided.' : 'The in-app viewer is unavailable in this build. Rebuild the app to enable it.'}</Text>
            {failed && <TouchableOpacity style={styles.retry} onPress={() => { setFailed(false); setRetry(current => current + 1); }} accessibilityRole="button"><Text style={styles.retryText}>Try again</Text></TouchableOpacity>}
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F7FC' }, web: { flex: 1 },
  header: { backgroundColor: '#0B1728', flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#20314B', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  content: { padding: 20, width: '100%', maxWidth: 640, alignSelf: 'center' },
  card: { padding: 24, backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 1, borderColor: '#E2EAF4' },
  icon: { width: 62, height: 62, borderRadius: 20, backgroundColor: '#EAF2FC', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  category: { color: '#6283AA', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  title: { color: '#17233E', fontSize: 24, lineHeight: 32, fontWeight: '700', marginTop: 10 },
  copy: { color: '#64748B', fontSize: 13, lineHeight: 22, marginTop: 16 },
  loading: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  retry: { backgroundColor: '#3561A9', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 20 }, retryText: { color: '#FFFFFF', fontWeight: '700' },
});
