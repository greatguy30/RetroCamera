import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import i18n from '../i18n';

import { darkColors, lightColors, PRESET_ACCENTS, type ThemeColors, type ThemeMode } from '../theme/tokens';

export type CameraStyle = 'polaroid' | 'leica' | 'hasselblad' | 'movie' | 'fuji' | 'normal';

type ThemeContextValue = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  accentColorId: string;
  setAccentColorId: (id: string) => void;
  isDark: boolean;
  colors: ThemeColors;
};

type SettingsContextValue = {
  autoSave: boolean;
  setAutoSave: (value: boolean) => void;
  grainEnabled: boolean;
  setGrainEnabled: (value: boolean) => void;
  cameraStyle: CameraStyle;
  setCameraStyle: (style: CameraStyle) => void;
  userAvatar: string | null;
  setUserAvatar: (uri: string | null) => void;
  language: string;
  setLanguage: (lang: string) => void;
};

type AppContextValue = ThemeContextValue & SettingsContextValue;

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [accentColorId, setAccentColorId] = useState<string>('blue');
  const [autoSave, setAutoSave] = useState<boolean>(false);
  const [grainEnabled, setGrainEnabled] = useState<boolean>(true);
  const [cameraStyle, setCameraStyle] = useState<CameraStyle>('polaroid');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [language, setLanguageState] = useState<string>(i18n.language);

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
  };

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  
  const colors = useMemo(() => {
    const baseColors = isDark ? { ...darkColors } : { ...lightColors };
    const accent = PRESET_ACCENTS.find(a => a.id === accentColorId)?.color || PRESET_ACCENTS[0].color;
    
    return {
      ...baseColors,
      accent,
      accentSoft: `${accent}26`, // ~15% opacity
    };
  }, [isDark, accentColorId]);

  const themeValue = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      accentColorId,
      setAccentColorId,
      isDark,
      colors,
    }),
    [themeMode, accentColorId, isDark, colors]
  );

  const settingsValue = useMemo(
    () => ({
      autoSave,
      setAutoSave,
      grainEnabled,
      setGrainEnabled,
      cameraStyle,
      setCameraStyle,
      userAvatar,
      setUserAvatar,
      language,
      setLanguage,
    }),
    [autoSave, grainEnabled, cameraStyle, userAvatar, language]
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <SettingsContext.Provider value={settingsValue}>{children}</SettingsContext.Provider>
    </ThemeContext.Provider>
  );
};

const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within AppProvider');
  }
  return context;
};

const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within AppProvider');
  }
  return context;
};

const useAppContext = (): AppContextValue => {
  const theme = useThemeContext();
  const settings = useSettingsContext();
  return { ...theme, ...settings };
};

export const useAppTheme = () => {
  const { colors, isDark } = useThemeContext();
  return { colors, isDark };
};

export const useAppSettings = () => {
  const {
    themeMode,
    setThemeMode,
    accentColorId,
    setAccentColorId,
  } = useThemeContext();
  const {
    autoSave,
    setAutoSave,
    grainEnabled,
    setGrainEnabled,
    cameraStyle,
    setCameraStyle,
    userAvatar,
    setUserAvatar,
    language,
    setLanguage,
  } = useSettingsContext();
  return {
    themeMode,
    setThemeMode,
    accentColorId,
    setAccentColorId,
    autoSave,
    setAutoSave,
    grainEnabled,
    setGrainEnabled,
    cameraStyle,
    setCameraStyle,
    userAvatar,
    setUserAvatar,
    language,
    setLanguage,
  };
};

export default useAppContext;
