import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import GlassPanel from './GlassPanel';
import AppText from './AppText';
import { useAppTheme } from '../context/AppContext';

type GlassButtonProps = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const GlassButton = ({ label, onPress, icon, disabled, style }: GlassButtonProps) => {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.pressable, pressed && !disabled && styles.pressed]}
    >
      <GlassPanel
        radius={18}
        intensity={40}
        interactive
        style={[styles.button, disabled && styles.disabled, style]}
      >
        <View style={styles.content}>
          {icon ? <Ionicons name={icon} size={16} color={colors.textPrimary} style={styles.icon} /> : null}
          <AppText style={styles.label}>{label}</AppText>
        </View>
      </GlassPanel>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'center',
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
});

export default GlassButton;
