import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { ArrowBackIcon } from './Icons';

export const HeaderBackButton: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => {
        if (navigation.canGoBack()) navigation.goBack();
        else navigation.navigate('Dashboard');
      }}
    >
      <ArrowBackIcon size={20} color="#0F294A" />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
});
