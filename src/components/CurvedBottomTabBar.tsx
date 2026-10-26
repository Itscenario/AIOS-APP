import React, { useEffect, useRef, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { AccessibilityInfo, Animated, Easing, Keyboard, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AwardMedalIcon, CalendarIcon, DashboardIcon, JobsTabIcon, ProfileTabIcon } from './Icons';
const TABS = {
  Dashboard: { label: 'Dashboard', Icon: DashboardIcon },
  Jobs: { label: 'Jobs', Icon: JobsTabIcon },
  Certificates: { label: 'Annual', Icon: CalendarIcon },
  MidTerm: { label: 'Mid-Term', Icon: AwardMedalIcon },
  Profile: { label: 'Profile', Icon: ProfileTabIcon },
};

type TabInfo = (typeof TABS)[keyof typeof TABS];
const PillTab: React.FC<{
  tab: TabInfo;
  selected: boolean;
  reduceMotion: boolean;
  pillWidth: number;
  onPress: () => void;
  onLongPress: () => void;
}> = ({ tab, selected, reduceMotion, pillWidth, onPress, onLongPress }) => {
  const progress = useRef(new Animated.Value(selected ? 1 : 0)).current;
  useEffect(() => {
    if (!selected || reduceMotion) {
      progress.setValue(selected ? 1 : 0);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: selected ? 1 : 0,
      duration: reduceMotion ? 0 : 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [selected, reduceMotion, progress]);
  return (
    <View style={styles.tabSlot}>
      <Pressable
        style={styles.tab}
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole="tab"
        accessibilityLabel={tab.label}
        accessibilityState={{ selected }}
      >
        <View style={styles.pill}>
          <Animated.View style={[styles.iconWrapper, {
            opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
          }]}>
            <tab.Icon size={23} color="#91A3BB" />
          </Animated.View>
          <Animated.View style={[styles.selectedContent, {
            width: pillWidth,
            marginLeft: -pillWidth / 2,
            opacity: progress,
            transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
          }]}>
            <View style={styles.selectedIcon}>
              <tab.Icon size={23} color="#FFFFFF" />
            </View>
            <Text
              style={[styles.label, tab.label === 'Dashboard' && styles.dashboardLabel]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {tab.label}
            </Text>
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
};

export const CurvedBottomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [rowWidth, setRowWidth] = useState(0);
  const position = useRef(new Animated.Value(state.index)).current;
  const expansion = useRef(new Animated.Value(1)).current;
  const pillWidth = Math.min(96, Math.max(80, rowWidth / state.routes.length + 28));
  const targetScale = pillWidth / 48;
  useEffect(() => {
    if (reduceMotion) {
      position.setValue(state.index);
      expansion.setValue(targetScale);
      return;
    }
    const animation = Animated.parallel([
      Animated.timing(position, {
        toValue: state.index,
        duration: 450,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(expansion, { toValue: targetScale * 1.06, duration: 170, useNativeDriver: false }),
        Animated.timing(expansion, { toValue: targetScale, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      ]),
    ]);
    animation.start();
    return () => animation.stop();
  }, [state.index, reduceMotion, position, expansion, targetScale]);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then(value => { if (mounted) setReduceMotion(value); }).catch(() => {});
    const motion = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardVisible(false));
    return () => { mounted = false; motion.remove(); show.remove(); hide.remove(); };
  }, []);
  if (keyboardVisible) return null;
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10), paddingLeft: insets.left + 26, paddingRight: insets.right + 26 }]}>
      <View style={styles.row} onLayout={({ nativeEvent }) => setRowWidth(nativeEvent.layout.width)}>
        {rowWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[styles.activePill, {
              width: Animated.multiply(expansion, 48),
              left: Animated.subtract(
                Animated.add(Animated.multiply(position, rowWidth / state.routes.length), rowWidth / state.routes.length / 2),
                Animated.multiply(expansion, 24),
              ),
            }]}
          >
            <LinearGradient
              colors={['#9584DA', '#6F5BB3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pillGradient}
            />
          </Animated.View>
        )}
        {state.routes.map((route, index) => (
          <PillTab
            key={route.key}
            tab={TABS[route.name as keyof typeof TABS]}
            selected={state.index === index}
            reduceMotion={reduceMotion}
            pillWidth={pillWidth}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (state.index !== index && !event.defaultPrevented) navigation.navigate(route.name, route.params);
            }}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B1728',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderTopColor: '#24344A',
    paddingTop: 12,
    shadowColor: '#243247',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  tabSlot: {
    flex: 1,
    minWidth: 0,
    height: 56,
  },
  activePill: {
    position: 'absolute',
    top: 6,
    width: 48,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7669B7',
    borderWidth: 1,
    borderColor: '#B3A4EC',
    shadowColor: '#6954AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
  },
  pillGradient: {
    flex: 1,
    borderRadius: 21,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    height: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContent: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 8,
  },
  selectedIcon: {
    width: 24,
    height: 28,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 28,
    height: 28,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 18,
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 1,
    includeFontPadding: false,
  },
  dashboardLabel: {
    fontSize: 10,
    paddingHorizontal: 0,
  },
});
