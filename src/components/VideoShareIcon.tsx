import React from 'react';
import { View } from 'react-native';

export const VideoShareIcon: React.FC<{ size?: number; color?: string }> = ({ size = 30, color = '#FFFFFF' }) => (
  <View style={{ width: size, height: size }}>
    <View style={{
      position: 'absolute',
      left: size * 0.1,
      top: size * 0.34,
      width: size * 0.56,
      height: size * 0.56,
      borderTopWidth: size * 0.08,
      borderLeftWidth: size * 0.08,
      borderColor: color,
      borderTopLeftRadius: size * 0.5,
      transform: [{ skewY: '-14deg' }],
    }} />
    <View style={{
      position: 'absolute',
      left: size * 0.28,
      top: size * 0.64,
      width: size * 0.39,
      height: size * 0.22,
      borderTopWidth: size * 0.08,
      borderLeftWidth: size * 0.08,
      borderColor: color,
      borderTopLeftRadius: size * 0.3,
      transform: [{ skewY: '-25deg' }],
    }} />
    <View style={{
      position: 'absolute',
      right: size * 0.07,
      top: size * 0.22,
      width: size * 0.46,
      height: size * 0.46,
      borderTopWidth: size * 0.08,
      borderRightWidth: size * 0.08,
      borderColor: color,
      transform: [{ rotate: '45deg' }],
    }} />
  </View>
);
