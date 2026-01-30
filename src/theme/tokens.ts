export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeColors = {
  background: string;
  backgroundGradient: [string, string, ...string[]];
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentSoft: string;
  glassSurface: string;
  glassStroke: string;
  glassHighlight: string;
  shadow: string;
  tabActive: string;
  tabInactive: string;
  orbPrimary: string;
  orbSecondary: string;
  orbTertiary: string;
  frame: string;
  frameBorder: string;
  frameShadow: string;
  wallBackground: string;
  wallTexture: string;
  photoFrame: string;
  photoFrameBorder: string;
  clip: string;
  clipBorder: string;
  surface: string;
  surfaceSecondary: string;
  divider: string;
};

export const PRESET_ACCENTS = [
  { id: 'blue', color: '#2BCBFF', labelKey: 'profile.accents.blue' },
  { id: 'pink', color: '#FF6B9D', labelKey: 'profile.accents.pink' },
  { id: 'orange', color: '#FF9F43', labelKey: 'profile.accents.orange' },
  { id: 'green', color: '#2ECC71', labelKey: 'profile.accents.green' },
  { id: 'purple', color: '#A55EEF', labelKey: 'profile.accents.purple' },
  { id: 'yellow', color: '#F1C40F', labelKey: 'profile.accents.yellow' },
];

export const lightColors: ThemeColors = {
  background: '#F8F6F0',
  backgroundGradient: ['#FAF9F5', '#F8F6F0', '#F2EFE6'],
  textPrimary: '#1A1816',
  textSecondary: '#66615B',
  accent: '#2BCBFF',
  accentSoft: 'rgba(43, 203, 255, 0.15)',
  glassSurface: 'rgba(255, 255, 255, 0.8)',
  glassStroke: 'rgba(255, 255, 255, 0.95)',
  glassHighlight: 'rgba(255, 255, 255, 1.0)',
  shadow: 'rgba(40, 30, 20, 0.08)',
  tabActive: '#1A1816',
  tabInactive: 'rgba(26, 24, 22, 0.5)',
  orbPrimary: 'rgba(255, 200, 150, 0.3)',
  orbSecondary: 'rgba(150, 200, 255, 0.2)',
  orbTertiary: 'rgba(200, 150, 255, 0.15)',
  frame: '#FDFBFA',
  frameBorder: '#E5E0D5',
  frameShadow: 'rgba(40, 30, 20, 0.1)',
  wallBackground: '#F4F1E8',
  wallTexture: 'rgba(0, 0, 0, 0.02)',
  photoFrame: '#FFFFFF',
  photoFrameBorder: '#E8E4D8',
  clip: '#5C5854',
  clipBorder: '#45413D',
  surface: 'rgba(255, 255, 255, 0.85)',
  surfaceSecondary: 'rgba(255, 255, 255, 0.95)',
  divider: 'rgba(0, 0, 0, 0.04)',
};

export const darkColors: ThemeColors = {
  background: '#0A111C',
  backgroundGradient: ['#0A111C', '#0B1A2B', '#111F35'],
  textPrimary: '#F5F7FF',
  textSecondary: 'rgba(245, 247, 255, 0.68)',
  accent: '#71D9FF',
  accentSoft: 'rgba(113, 217, 255, 0.2)',
  glassSurface: 'rgba(14, 20, 32, 0.55)',
  glassStroke: 'rgba(255, 255, 255, 0.18)',
  glassHighlight: 'rgba(255, 255, 255, 0.22)',
  shadow: 'rgba(0, 0, 0, 0.45)',
  tabActive: '#FFFFFF',
  tabInactive: 'rgba(255, 255, 255, 0.6)',
  orbPrimary: 'rgba(88, 132, 255, 0.35)',
  orbSecondary: 'rgba(255, 148, 112, 0.22)',
  orbTertiary: 'rgba(126, 233, 255, 0.2)',
  frame: '#FFFFFF',
  frameBorder: '#DED4C6',
  frameShadow: 'rgba(0, 0, 0, 0.4)',
  wallBackground: '#1A1A1A',
  wallTexture: 'rgba(255, 255, 255, 0.05)',
  photoFrame: '#FFFFFF',
  photoFrameBorder: '#333333',
  clip: '#2A2A2A',
  clipBorder: '#111111',
  surface: 'rgba(255, 255, 255, 0.08)',
  surfaceSecondary: 'rgba(255, 255, 255, 0.12)',
  divider: 'rgba(255, 255, 255, 0.08)',
};
