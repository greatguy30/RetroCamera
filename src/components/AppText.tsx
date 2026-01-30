import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { useAppTheme } from '../context/AppContext';
import { APP_FONT } from '../theme/fonts';

type AppTextProps = TextProps & {
  tone?: 'primary' | 'secondary' | 'accent';
  weight?: 'normal' | 'medium' | 'bold' | 'semibold';
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
  variant?: string; // Added to prevent errors if passed from elsewhere
};

const AppText = ({ style, tone = 'primary', weight, size, variant, ...props }: AppTextProps) => {
  const { colors } = useAppTheme();
  const color = tone === 'secondary' ? colors.textSecondary : tone === 'accent' ? colors.accent : colors.textPrimary;
  
  const getFontSize = () => {
    switch (size) {
      case 'tiny': return 10;
      case 'small': return 12;
      case 'large': return 20;
      case 'xlarge': return 24;
      default: return 16;
    }
  };

  const flattenedStyle = StyleSheet.flatten(style) || {};
  const fontSize = typeof flattenedStyle.fontSize === 'number' ? flattenedStyle.fontSize : getFontSize();
  const lineHeight = typeof flattenedStyle.lineHeight === 'number' ? flattenedStyle.lineHeight : Math.ceil(fontSize * 1.3);

  const fontWeight = weight === 'bold' ? '700' : weight === 'semibold' ? '600' : weight === 'medium' ? '500' : '400';

  return <Text {...props} style={[styles.text, { color, fontSize, lineHeight, fontWeight }, style]} />;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: APP_FONT,
    letterSpacing: 0.3,
  },
});

export default AppText;
