import { TextStyle } from 'react-native';

/**
 * Clinical Prestige Typography System
 * Primary: Plus Jakarta Sans (Titles, Headings, OTP)
 * Secondary: Inter (Forms, Data, Micro-labels)
 */
export const typography = {
  fontFamilies: {
    heading: 'Plus Jakarta Sans',
    body: 'Inter',
  },

  fontSizes: {
    labelSm: 11,
    bodySm: 12,
    labelMd: 13,
    bodyMd: 14,
    labelLg: 14,
    headlineSm: 16,
    bodyLg: 16,
    headlineMd: 20,
    headlineLgMobile: 22,
    codeOtp: 24,
    headlineLg: 28,
    headlineXlMobile: 28,
    headlineXl: 36,

    // Aliases for quick access
    xs: 11,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 36,
  },

  lineHeights: {
    labelSm: 16,
    bodySm: 18,
    labelMd: 18,
    labelLg: 20,
    bodyMd: 22,
    headlineSm: 24,
    bodyLg: 26,
    headlineMd: 28,
    headlineLgMobile: 30,
    codeOtp: 32,
    headlineLg: 36,
    headlineXlMobile: 36,
    headlineXl: 44,

    // Aliases
    xs: 16,
    sm: 18,
    md: 22,
    lg: 26,
    xl: 28,
    xxl: 32,
    xxxl: 36,
    display: 44,
  },

  fontWeights: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },

  letterSpacings: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    otp: 4,
  },
} as const;

export type FontSizeKey = keyof typeof typography.fontSizes;
export type FontWeightKey = keyof typeof typography.fontWeights;
