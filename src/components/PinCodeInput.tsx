import React, { useRef, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { Typography } from './Typography';

export interface PinCodeInputProps {
  length?: number;
  value?: string;
  onChangePin?: (pin: string) => void;
  secureTextEntry?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  error?: boolean | string;
}

export const PinCodeInput: React.FC<PinCodeInputProps> = ({
  length = 6,
  value = '',
  onChangePin,
  secureTextEntry = false,
  containerStyle,
  error,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const hiddenInputRef = useRef<any>(null);

  const handlePressContainer = () => {
    hiddenInputRef.current?.focus();
  };

  const digits = value.split('');

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePressContainer}
      style={[styles.container, containerStyle]}
    >
      {/* Hidden real input capturing all keyboard input */}
      <TextInput
        ref={hiddenInputRef}
        value={value}
        onChangeText={(text) => {
          const sanitized = text.replace(/[^0-9]/g, '').slice(0, length);
          onChangePin?.(sanitized);
          setFocusedIndex(sanitized.length < length ? sanitized.length : length - 1);
        }}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.hiddenInput}
        autoFocus={false}
        caretHidden
      />

      {/* Visual Cell Boxes */}
      <View style={styles.cellsRow}>
        {Array.from({ length }).map((_, index) => {
          const digit = digits[index] || '';
          const isFocused = index === focusedIndex;

          return (
            <View
              key={index}
              style={[
                styles.cell,
                isFocused && styles.cellFocused,
                Boolean(digit) && styles.cellFilled,
              ]}
            >
              <Typography
                variant="codeOtp"
                color={colors.primaryNavy}
                style={styles.digitText}
              >
                {digit ? (secureTextEntry ? '•' : digit) : ''}
              </Typography>
            </View>
          );
        })}
      </View>

      {typeof error === 'string' && error ? (
        <View style={styles.errorContainer}>
          <Typography variant="labelSm" color={colors.error} align="right" style={styles.errorText}>
            {error}
          </Typography>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  cellsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    width: 42,
    height: 50,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.borderField,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellFocused: {
    borderColor: colors.secondaryRoyal,
    borderWidth: 2,
    backgroundColor: colors.surfaceContainerLowest,
  },
  cellFilled: {
    borderColor: colors.secondaryRoyal,
  },
  digitText: {
    fontSize: typography.fontSizes.codeOtp,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorContainer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingRight: 6,
  },
  errorText: {
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
});

export default PinCodeInput;
