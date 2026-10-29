import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { colors } from '../theme/colors';

/** Shared screen header; screens provide their content and safe-area spacing. */
export const AppHeader: React.FC<ViewProps> = ({ style, ...props }) => (
  <View {...props} style={[style, styles.header]} />
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.headerBackground,
  },
});
