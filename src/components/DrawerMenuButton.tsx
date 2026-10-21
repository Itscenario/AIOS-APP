import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';

export const DrawerMenuButton: React.FC<{ color?: string }> = ({
  color = '#F97316',
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Open navigation menu"
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <View style={[styles.line, { backgroundColor: color }]} />
      <View style={[styles.line, { backgroundColor: color }]} />
      <View style={[styles.line, { backgroundColor: color }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginRight: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    elevation: 2,
  },
  line: {
    width: 21,
    height: 2,
    borderRadius: 2,
  },
});
