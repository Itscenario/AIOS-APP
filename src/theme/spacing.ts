/**
 * Clinical Prestige Spacing, Radius & Elevation Tokens
 */
export const rounded = {
  sm: 4, // 0.25rem
  default: 8, // 0.5rem - Base inputs & buttons
  md: 12, // 0.75rem
  lg: 16, // 1rem - Containers & Auth cards
  xl: 24, // 1.5rem
  full: 9999, // Status pills & badges
} as const;

export const spacing = {
  spaceXs: 4, // 0.25rem - Tight coupling
  spaceSm: 8, // 0.5rem - Internal element spacing
  spaceMd: 16, // 1rem - Component margins
  spaceLg: 24, // 1.5rem - Form block vertical rhythm
  spaceXl: 40, // 2.5rem - Section dividers
  gutter: 24,
  gutterMobile: 16,
  margin: 40,
  marginMobile: 20,
} as const;

export const shadows = {
  level0: {},
  level1: {
    shadowColor: '#0F294A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  level2: {
    shadowColor: '#0F294A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;
