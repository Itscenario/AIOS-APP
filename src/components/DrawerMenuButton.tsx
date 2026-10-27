import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';

export const DrawerMenuButton: React.FC<{ color?: string }> = ({
  color = '#FFFFFF',
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.65}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel="Open navigation menu"
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <View style={styles.glyph}>
        <View style={[styles.line, { backgroundColor: color }]} />
        <View style={[styles.line, styles.middleLine, { backgroundColor: color }]} />
        <View style={[styles.line, styles.bottomLine, { backgroundColor: color }]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(148, 180, 245, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(186, 211, 255, 0.24)',
  },
  glyph: {
    width: 21,
    gap: 5,
    alignItems: 'flex-start',
  },
  line: {
    width: 21,
    height: 2.5,
    borderRadius: 2,
  },
  middleLine: {
    width: 15,
  },
  bottomLine: {
    width: 18,
  },
});
