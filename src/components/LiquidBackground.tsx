import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppTheme } from '../context/AppContext';

const LiquidBackground = () => {
  const { colors } = useAppTheme();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFillObject} />
      <View style={[styles.orb, styles.orbLarge, { backgroundColor: colors.orbPrimary }]} />
      <View style={[styles.orb, styles.orbMedium, { backgroundColor: colors.orbSecondary }]} />
      <View style={[styles.orb, styles.orbSmall, { backgroundColor: colors.orbTertiary }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.9,
  },
  orbLarge: {
    width: 260,
    height: 260,
    top: -90,
    left: -60,
  },
  orbMedium: {
    width: 200,
    height: 200,
    top: 120,
    right: -40,
  },
  orbSmall: {
    width: 140,
    height: 140,
    bottom: 120,
    left: 30,
  },
});

export default LiquidBackground;
