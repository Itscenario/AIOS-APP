import React from 'react';
import { StatusBar, StatusBarStyle } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export const ScreenStatusBar: React.FC<{ barStyle?: StatusBarStyle }> = ({
  barStyle = 'light-content',
}) => {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar hidden={false} barStyle={barStyle} /> : null;
};
