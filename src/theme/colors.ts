/**
 * Clinical Prestige Design System - Colors
 * Tailored for AIOS (All India Ophthalmological Society / Medical Association)
 */
export const colors = {
  // Primary (Institutional Navy)
  primary: '#0F294A',
  primaryNavy: '#0F294A',
  primaryNavyLight: '#1A365D',
  primaryNavyDark: '#00142F',
  primaryNavyActive: '#0A1C33',
  onPrimary: '#FFFFFF',
  primaryContainer: '#0F294A',
  onPrimaryContainer: '#7A91B7',
  inversePrimary: '#B0C8F1',
  secondary: '#1E40AF',
  secondaryRoyal: '#1E40AF',
  secondaryBright: '#2563EB',
  secondaryLight: '#3755C3',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#708CFD',
  onSecondaryContainer: '#00217A',
  tertiary: '#D97706',
  tertiarySaffron: '#D97706',
  tertiarySaffronDark: '#B45309',
  tertiarySaffronLight: '#FDE68A',
  tertiarySaffronBg: '#FFFBEB',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#422000',
  onTertiaryContainer: '#D97705',

  // Surface & Background (Clinical Slate Ground & Crisp Containers)
  background: '#F8FAFC',
  onBackground: '#0B1C30',
  surface: '#F8F9FF',
  surfaceBase: '#F8FAFC',
  surfaceDim: '#CBDBF5',
  surfaceBright: '#F8F9FF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#EFF4FF',
  surfaceContainer: '#E5EEFF',
  surfaceContainerHigh: '#DCE9FF',
  surfaceContainerHighest: '#D3E4FE',
  card: '#FFFFFF',
  cardSurface: '#FFFFFF',

  // Text & Content
  textPrimary: '#0F172A',
  textSecondary: '#4B5563',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',
  onSurface: '#0B1C30',
  onSurfaceVariant: '#44474E',
  inverseSurface: '#213145',
  inverseOnSurface: '#EAF1FF',

  // Borders & Outlines
  border: '#E2E8F0',
  borderNeutral: '#E2E8F0',
  borderField: '#CBD5E1',
  borderFieldHover: '#94A3B8',
  borderDark: '#CBD5E1',
  outline: '#74777F',
  outlineVariant: '#C4C6CF',
  surfaceTint: '#485F83',

  // Status & Clinical Feedback
  success: '#059669',
  successText: '#047857',
  successBg: '#ECFDF5',
  successBorder: '#A7F3D0',
  onSuccess: '#FFFFFF',

  error: '#DC2626',
  errorDark: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#93000A',

  warning: '#D97706',
  warningDark: '#B45309',
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',
  onWarning: '#FFFFFF',

  info: '#1E40AF',
  infoBg: '#EFF4FF',
  infoBorder: '#BFDBFE',

  // Fixed Tones
  primaryFixed: '#D5E3FF',
  primaryFixedDim: '#B0C8F1',
  onPrimaryFixed: '#001B3B',
  onPrimaryFixedVariant: '#30476A',
  secondaryFixed: '#DDE1FF',
  secondaryFixedDim: '#B8C4FF',
  onSecondaryFixed: '#001453',
  onSecondaryFixedVariant: '#173BAB',
  tertiaryFixed: '#FFDCC3',
  tertiaryFixedDim: '#FFB77D',
  onTertiaryFixed: '#2F1500',
  onTertiaryFixedVariant: '#6E3900',

  // Neutrals & Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof colors;
