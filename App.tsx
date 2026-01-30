import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';

import { useTranslation } from 'react-i18next';

import './src/i18n';
import { AppProvider, useAppTheme } from './src/context/AppContext';
import LiquidBackground from './src/components/LiquidBackground';
import LiquidTabs from './src/components/LiquidTabs';
import AppText from './src/components/AppText';
import GlassPanel from './src/components/GlassPanel';

const AppShell = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useAppTheme();
  const [fontsLoaded] = useFonts({
    PermanentMarker_400Regular,
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} translucent backgroundColor="transparent" />
      <LiquidBackground />
      {fontsLoaded ? (
        <LiquidTabs />
      ) : (
        <View style={styles.loadingWrap}>
          <GlassPanel style={styles.loadingCard}>
            <ActivityIndicator size="large" color={colors.accent} />
            <AppText style={styles.loadingText}>{t('common.loading')}</AppText>
          </GlassPanel>
        </View>
      )}
    </View>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingCard: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});
