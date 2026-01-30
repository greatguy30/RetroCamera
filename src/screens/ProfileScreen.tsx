import React, { useMemo } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

import AppText from '../components/AppText';
import GlassPanel from '../components/GlassPanel';
import { useAppSettings, useAppTheme } from '../context/AppContext';
import { PRESET_ACCENTS, type ThemeColors, type ThemeMode } from '../theme/tokens';

const TAB_BAR_PADDING = 84;

const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'zh-CN', label: '简体中文' },
  { key: 'zh-TW', label: '繁體中文' },
  { key: 'ja', label: '日本語' },
  { key: 'ko', label: '한국어' },
];

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useAppTheme();
  const { 
    themeMode, setThemeMode, 
    accentColorId, setAccentColorId,
    autoSave, setAutoSave, 
    grainEnabled, setGrainEnabled,
    userAvatar, setUserAvatar,
    language, setLanguage
  } = useAppSettings();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const useNativeGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

  const THEME_LABELS: { key: ThemeMode; label: string }[] = [
    { key: 'system', label: t('profile.themeMode.system') },
    { key: 'light', label: t('profile.themeMode.light') },
    { key: 'dark', label: t('profile.themeMode.dark') },
  ];

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUserAvatar(result.assets[0].uri);
    }
  };

  const version = Constants.nativeAppVersion ?? Constants.expoConfig?.version ?? '1.0.0';
  const sdkVersion = Constants.expoConfig?.sdkVersion ?? '54';

  return (
    <View style={styles.container}>
      {/* Wall Background to match SpaceScreen */}
      <View style={styles.wallBackground}>
        <View style={styles.wallTexture} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + TAB_BAR_PADDING + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText weight="bold" style={styles.headerTitle}>{t('profile.title')}</AppText>
          <AppText tone="secondary" style={styles.headerSubtitle}>{t('profile.settings')}</AppText>
        </View>

        <GlassPanel radius={32} intensity={40} style={styles.profileCard}>
          <Pressable onPress={handlePickAvatar} style={styles.avatarRow}>
            <LinearGradient
              colors={[colors.accent, colors.accentSoft]}
              style={styles.avatar}
            >
              {userAvatar ? (
                <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={26} color={isDark ? colors.background : colors.textPrimary} />
              )}
            </LinearGradient>
            <View style={styles.profileInfo}>
              <AppText weight="bold" style={styles.profileName}>Liquid Studio</AppText>
              <AppText tone="secondary" style={styles.profileSubtitle}>
                {t('profile.avatar')}
              </AppText>
            </View>
          </Pressable>
        </GlassPanel>

        <GlassPanel radius={32} intensity={40} style={styles.section}>
          <AppText weight="bold" style={styles.sectionTitle}>{t('profile.theme')}</AppText>
          {useNativeGlass ? (
            <GlassView
              glassEffectStyle="regular"
              tintColor={colors.glassSurface}
              isInteractive
              style={styles.segmentedControlShell}
            >
              <View style={styles.segmentedControl}>
                {THEME_LABELS.map((item) => {
                  const isActive = item.key === themeMode;
                  return (
                    <Pressable
                      key={item.key}
                      onPress={() => setThemeMode(item.key)}
                      style={[styles.segment, isActive && styles.segmentActive]}
                    >
                      <AppText
                        tone={isActive ? 'primary' : 'secondary'}
                        weight={isActive ? 'bold' : 'medium'}
                        style={styles.segmentLabel}
                      >
                        {item.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
              <View
                pointerEvents="none"
                style={[styles.segmentedStroke, { borderColor: colors.glassStroke }]}
              />
            </GlassView>
          ) : (
            <GlassPanel radius={18} intensity={40} interactive style={styles.segmentedControlShell}>
              <View style={styles.segmentedControl}>
                {THEME_LABELS.map((item) => {
                  const isActive = item.key === themeMode;
                  return (
                    <Pressable
                      key={item.key}
                      onPress={() => setThemeMode(item.key)}
                      style={[styles.segment, isActive && styles.segmentActive]}
                    >
                      <AppText 
                        tone={isActive ? 'primary' : 'secondary'} 
                        weight={isActive ? 'bold' : 'medium'}
                        style={styles.segmentLabel}
                      >
                        {item.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </GlassPanel>
          )}
        </GlassPanel>

        <GlassPanel radius={32} intensity={40} style={styles.section}>
          <AppText weight="bold" style={styles.sectionTitle}>{t('profile.accentColor')}</AppText>
          <View style={styles.colorGrid}>
            {PRESET_ACCENTS.map((item) => {
              const isActive = item.id === accentColorId;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setAccentColorId(item.id)}
                  style={[
                    styles.colorItem,
                    isActive && styles.colorItemActive
                  ]}
                >
                  <View style={[styles.colorRing, isActive && { borderColor: item.color }]}>
                    <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
                  </View>
                  <AppText 
                    tone={isActive ? 'primary' : 'secondary'} 
                    weight={isActive ? 'bold' : 'medium'}
                    style={styles.colorLabel}
                  >
                    {t(item.labelKey)}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </GlassPanel>

        <GlassPanel radius={32} intensity={40} style={styles.section}>
          <AppText weight="bold" style={styles.sectionTitle}>{t('profile.language')}</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langScroll}>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.key}
                onPress={() => setLanguage(lang.key)}
                style={[
                  styles.langItem,
                  language === lang.key && { backgroundColor: colors.accentSoft, borderColor: colors.accent }
                ]}
              >
                <AppText
                  tone={language === lang.key ? 'accent' : 'secondary'}
                  weight={language === lang.key ? 'bold' : 'medium'}
                >
                  {lang.label}
                </AppText>
              </Pressable>
            ))}
          </ScrollView>
        </GlassPanel>

        <GlassPanel radius={32} intensity={40} style={styles.section}>
          <AppText weight="bold" style={styles.sectionTitle}>{t('profile.settings')}</AppText>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <AppText weight="medium" style={styles.settingTitle}>{t('profile.autoSave')}</AppText>
              <AppText tone="secondary" style={styles.settingSubtitle}>
                {t('profile.autoSaveDesc')}
              </AppText>
            </View>
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: colors.surface, true: colors.accentSoft }}
              thumbColor={autoSave ? colors.accent : colors.textSecondary}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <AppText weight="medium" style={styles.settingTitle}>{t('profile.filmGrain')}</AppText>
              <AppText tone="secondary" style={styles.settingSubtitle}>
                {t('profile.filmGrainDesc')}
              </AppText>
            </View>
            <Switch
              value={grainEnabled}
              onValueChange={setGrainEnabled}
              trackColor={{ false: colors.surface, true: colors.accentSoft }}
              thumbColor={grainEnabled ? colors.accent : colors.textSecondary}
            />
          </View>
        </GlassPanel>

        <GlassPanel radius={32} intensity={40} style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <AppText weight="medium" style={styles.settingTitle}>{t('profile.about')}</AppText>
              <AppText tone="secondary" style={styles.settingSubtitle}>
                v{version} · SDK {sdkVersion}
              </AppText>
            </View>
            <Ionicons name="information-circle-outline" size={22} color={colors.textSecondary} />
          </View>
        </GlassPanel>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    wallBackground: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.wallBackground,
    },
    wallTexture: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.wallTexture,
    },
    scrollContent: {
      paddingHorizontal: 16,
    },
    header: {
      paddingHorizontal: 4,
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: 24,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: 13,
      marginTop: 2,
    },
    profileCard: {
      padding: 16,
      marginBottom: 12,
    },
    avatarRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.glassStroke,
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    profileInfo: {
      marginLeft: 12,
    },
    profileName: {
      fontSize: 18,
    },
    profileSubtitle: {
      fontSize: 12,
      marginTop: 2,
    },
    section: {
      padding: 16,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 15,
      marginBottom: 12,
    },
    langScroll: {
      paddingVertical: 4,
    },
    langItem: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.divider,
      marginRight: 8,
    },
    segmentedControlShell: {
      borderRadius: 18,
      padding: 4,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.2 : 0.1,
      shadowRadius: 10,
      elevation: 3,
    },
    segmentedControl: {
      flexDirection: 'row',
      gap: 4,
    },
    segment: {
      flex: 1,
      paddingVertical: 7,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentActive: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.95)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.05)',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDark ? 0.25 : 0.12,
      shadowRadius: 8,
      elevation: 2,
    },
    segmentLabel: {
      fontSize: 13,
      letterSpacing: -0.2,
    },
    segmentedStroke: {
      ...StyleSheet.absoluteFillObject,
      borderWidth: 1,
      borderRadius: 18,
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'space-between',
    },
    colorItem: {
      width: '31%',
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderRadius: 16,
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'transparent',
    },
    colorItemActive: {
      backgroundColor: colors.surface,
      borderColor: colors.divider,
    },
    colorRing: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 2,
    },
    colorCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    colorLabel: {
      fontSize: 11,
      marginTop: 0,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingInfo: {
      flex: 1,
      marginRight: 12,
    },
    settingTitle: {
      fontSize: 14,
    },
    settingSubtitle: {
      fontSize: 11,
      marginTop: 2,
    },
    divider: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: 12,
    },
  });

export default ProfileScreen;
