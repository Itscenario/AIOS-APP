import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { FontWeightKey, typography } from '../theme/typography';

export type TypographyVariant =
  | 'headlineXl'
  | 'headlineXlMobile'
  | 'headlineLg'
  | 'headlineLgMobile'
  | 'headlineMd'
  | 'headlineSm'
  | 'bodyLg'
  | 'bodyMd'
  | 'bodySm'
  | 'labelLg'
  | 'labelMd'
  | 'labelSm'
  | 'codeOtp'
  // Common aliases
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  weight?: FontWeightKey;
  align?: TextStyle['textAlign'];
  children?: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'bodyMd',
  color = colors.textPrimary,
  weight,
  align = 'left',
  style,
  children,
  ...rest
}) => {
  const variantStyle = styles[variant] || styles.bodyMd;
  const customStyle: TextStyle = {
    color,
    textAlign: align,
    ...(weight ? { fontWeight: typography.fontWeights[weight] } : {}),
  };

  return (
    <Text style={[variantStyle, customStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  // DESIGN.md Clinical Prestige Typography Tokens
  headlineXl: {
    fontSize: typography.fontSizes.headlineXl,
    lineHeight: typography.lineHeights.headlineXl,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: -0.7,
    color: colors.textPrimary,
  },
  headlineXlMobile: {
    fontSize: typography.fontSizes.headlineXlMobile,
    lineHeight: typography.lineHeights.headlineXlMobile,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: -0.3,
    color: colors.textPrimary,
  },
  headlineLg: {
    fontSize: typography.fontSizes.headlineLg,
    lineHeight: typography.lineHeights.headlineLg,
    fontWeight: typography.fontWeights.semibold,
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  headlineLgMobile: {
    fontSize: typography.fontSizes.headlineLgMobile,
    lineHeight: typography.lineHeights.headlineLgMobile,
    fontWeight: typography.fontWeights.semibold,
    letterSpacing: -0.2,
    color: colors.textPrimary,
  },
  headlineMd: {
    fontSize: typography.fontSizes.headlineMd,
    lineHeight: typography.lineHeights.headlineMd,
    fontWeight: typography.fontWeights.semibold,
    letterSpacing: -0.2,
    color: colors.textPrimary,
  },
  headlineSm: {
    fontSize: typography.fontSizes.headlineSm,
    lineHeight: typography.lineHeights.headlineSm,
    fontWeight: typography.fontWeights.semibold,
    letterSpacing: 0,
    color: colors.textPrimary,
  },
  bodyLg: {
    fontSize: typography.fontSizes.bodyLg,
    lineHeight: typography.lineHeights.bodyLg,
    fontWeight: typography.fontWeights.regular,
    letterSpacing: 0,
    color: colors.textPrimary,
  },
  bodyMd: {
    fontSize: typography.fontSizes.bodyMd,
    lineHeight: typography.lineHeights.bodyMd,
    fontWeight: typography.fontWeights.regular,
    letterSpacing: 0,
    color: colors.textPrimary,
  },
  bodySm: {
    fontSize: typography.fontSizes.bodySm,
    lineHeight: typography.lineHeights.bodySm,
    fontWeight: typography.fontWeights.regular,
    letterSpacing: 0,
    color: colors.textSecondary,
  },
  labelLg: {
    fontSize: typography.fontSizes.labelLg,
    lineHeight: typography.lineHeights.labelLg,
    fontWeight: typography.fontWeights.semibold,
    letterSpacing: 0.14,
    color: colors.textPrimary,
  },
  labelMd: {
    fontSize: typography.fontSizes.labelMd,
    lineHeight: typography.lineHeights.labelMd,
    fontWeight: typography.fontWeights.medium,
    letterSpacing: 0.13,
    color: colors.textPrimary,
  },
  labelSm: {
    fontSize: typography.fontSizes.labelSm,
    lineHeight: typography.lineHeights.labelSm,
    fontWeight: typography.fontWeights.semibold,
    letterSpacing: 0.44,
    color: colors.textMuted,
  },
  codeOtp: {
    fontSize: typography.fontSizes.codeOtp,
    lineHeight: typography.lineHeights.codeOtp,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 3.6,
    color: colors.primaryNavy,
  },

  // Aliases
  h1: {
    fontSize: typography.fontSizes.headlineXl,
    lineHeight: typography.lineHeights.headlineXl,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: -0.7,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: typography.fontSizes.headlineLg,
    lineHeight: typography.lineHeights.headlineLg,
    fontWeight: typography.fontWeights.semibold,
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  h3: {
    fontSize: typography.fontSizes.headlineMd,
    lineHeight: typography.lineHeights.headlineMd,
    fontWeight: typography.fontWeights.semibold,
    letterSpacing: -0.2,
    color: colors.textPrimary,
  },
  title: {
    fontSize: typography.fontSizes.headlineSm,
    lineHeight: typography.lineHeights.headlineSm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSizes.bodyLg,
    lineHeight: typography.lineHeights.bodyLg,
    fontWeight: typography.fontWeights.medium,
    color: colors.textSecondary,
  },
  body: {
    fontSize: typography.fontSizes.bodyMd,
    lineHeight: typography.lineHeights.bodyMd,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
  },
  caption: {
    fontSize: typography.fontSizes.bodySm,
    lineHeight: typography.lineHeights.bodySm,
    fontWeight: typography.fontWeights.regular,
    color: colors.textMuted,
  },
  label: {
    fontSize: typography.fontSizes.labelMd,
    lineHeight: typography.lineHeights.labelMd,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
  },
});

export default Typography;
