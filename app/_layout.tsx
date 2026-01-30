import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';

import { AppProvider, useAppTheme } from '../src/context/AppContext';
import LiquidBackground from '../src/components/LiquidBackground';
import GlassPanel from '../src/components/GlassPanel';
import AppText from '../src/components/AppText';

const RootLayoutContent = () => {
  const { colors, isDark } = useAppTheme();
  const [fontsLoaded] = useFonts({ PermanentMarker_400Regular });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} translucent backgroundColor="transparent" />
      <LiquidBackground />
      {fontsLoaded ? (
        <Slot />
      ) : (
        <View style={styles.loadingWrap}>
          <GlassPanel style={styles.loadingCard}>
            <ActivityIndicator size="large" color={colors.accent} />
            <AppText style={styles.loadingText}>加载玻璃界面...</AppText>
          </GlassPanel>
        </View>
      )}
    </View>
  );
};

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutContent />
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
