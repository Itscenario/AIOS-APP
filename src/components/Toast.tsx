import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'info' | 'success' | 'error';
export interface ToastNotification {
  message: string;
  id: number;
  type?: ToastType;
}
export interface ToastProps {
  notification: ToastNotification | null;
  duration?: number;
}
const tones = {
  info: { color: '#2563EB', background: '#EFF6FF', symbol: 'i' },
  success: { color: '#047857', background: '#ECFDF5', symbol: '✓' },
  error: { color: '#C2410C', background: '#FFF7ED', symbol: '!' },
};

export const Toast: React.FC<ToastProps> = ({
  notification,
  duration = 3500,
}) => {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!notification) {
      setVisible(false);
      return;
    }
    progress.stopAnimation();
    progress.setValue(0);
    setVisible(true);
    Animated.timing(progress, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
    const timer = setTimeout(() => {
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setVisible(false);
      });
    }, duration);
    return () => {
      clearTimeout(timer);
      progress.stopAnimation();
    };
  }, [notification, duration, progress]);
  if (!notification || !visible) return null;
  const tone = tones[notification.type || 'info'];
  return (
    <Animated.View
      style={[
        styles.toast,
        {
          top: insets.top + 12,
          borderLeftColor: tone.color,
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-(insets.top + 220), 0],
              }),
            },
          ],
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <View style={[styles.icon, { backgroundColor: tone.background }]}>
        <Text style={[styles.symbol, { color: tone.color }]}>
          {tone.symbol}
        </Text>
      </View>
      <Text style={styles.message}>{notification.message}</Text>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1000,
    elevation: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 14,
    paddingRight: 16,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 19,
    fontWeight: '700',
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: '#1E293B',
    fontWeight: '500',
  },
});
