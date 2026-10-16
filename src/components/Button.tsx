import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { rounded, spacing } from '../theme/spacing';
import { Typography } from './Typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeOpacity?: number;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  activeOpacity = 0.8,
}) => {
  const isDisabled = disabled || loading;

  const containerStyles: StyleProp<ViewStyle> = [
    styles.base,
    styles[size],
    styles[variant],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const getTextColor = (): string => {
    if (isDisabled) {
      return colors.textMuted;
    }
    switch (variant) {
      case 'secondary':
        return colors.primaryNavy;
      case 'outline':
      case 'link':
        return colors.secondaryRoyal;
      case 'ghost':
        return colors.textPrimary;
      case 'danger':
      case 'primary':
      default:
        return colors.onPrimary;
    }
  };

  const getIndicatorColor = (): string => {
    return getTextColor();
  };

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={activeOpacity}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIndicatorColor()} />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          {title ? (
            <Typography
              variant={size === 'sm' ? 'labelSm' : size === 'lg' ? 'labelLg' : 'labelLg'}
              weight="semibold"
              color={getTextColor()}
              style={[styles.text, textStyle]}
            >
              {title}
            </Typography>
          ) : (
            children
          )}
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: rounded.default, // 8px (0.5rem) per DESIGN.md
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    textAlign: 'center',
  },
  leftIconContainer: {
    marginRight: spacing.spaceSm,
  },
  rightIconContainer: {
    marginLeft: spacing.spaceSm,
  },

  // Sizes
  sm: {
    paddingVertical: spacing.spaceXs + 2,
    paddingHorizontal: spacing.spaceMd,
    minHeight: 36,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: spacing.spaceMd,
    minHeight: 48, // Minimum 48px per DESIGN.md
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: spacing.spaceLg,
    minHeight: 56,
  },

  // Variants per DESIGN.md Clinical Prestige
  primary: {
    backgroundColor: colors.primaryNavy, // #0F294A
  },
  secondary: {
    backgroundColor: colors.surfaceContainerLowest, // #FFFFFF
    borderWidth: 1,
    borderColor: colors.borderField, // #CBD5E1
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.secondaryRoyal, // #1E40AF
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 0,
  },
  danger: {
    backgroundColor: colors.error, // #DC2626
  },

  // Disabled State
  disabled: {
    opacity: 0.6,
    backgroundColor: colors.surfaceContainer,
    borderColor: colors.borderNeutral,
  },
});

export default Button;
