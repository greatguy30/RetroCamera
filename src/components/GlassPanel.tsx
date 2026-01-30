import React from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';

import { useAppTheme } from '../context/AppContext';

type GlassPanelProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  intensity?: number;
  interactive?: boolean;
};

const OUTER_STYLE_KEYS = new Set([
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'alignSelf',
  'flex',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'zIndex',
  'opacity',
  'transform',
  'shadowColor',
  'shadowOffset',
  'shadowOpacity',
  'shadowRadius',
  'elevation',
]);

const SIZE_STYLE_KEYS = new Set([
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'aspectRatio',
]);

const splitPanelStyles = (style?: ViewStyle) => {
  const containerStyle: ViewStyle = {};
  const panelStyle: ViewStyle = {};
  const fillStyle: ViewStyle = {};
  let fillWidth = false;
  let fillHeight = false;
  let hasAspectRatio = false;

  if (!style) {
    return { containerStyle, panelStyle, fillStyle };
  }

  Object.entries(style).forEach(([key, value]) => {
    if (value === undefined) return;
    if (SIZE_STYLE_KEYS.has(key)) {
      (containerStyle as Record<string, unknown>)[key] = value;
      if (typeof value === 'number') {
        (panelStyle as Record<string, unknown>)[key] = value;
      } else if (typeof value === 'string') {
        if (key.toLowerCase().includes('width')) {
          fillWidth = true;
        }
        if (key.toLowerCase().includes('height')) {
          fillHeight = true;
        }
      }
      if (key === 'minWidth' || key === 'maxWidth') {
        fillWidth = true;
      }
      if (key === 'minHeight' || key === 'maxHeight') {
        fillHeight = true;
      }
      if (key === 'aspectRatio') {
        hasAspectRatio = true;
      }
      return;
    }
    if (OUTER_STYLE_KEYS.has(key)) {
      (containerStyle as Record<string, unknown>)[key] = value;
      return;
    }
    (panelStyle as Record<string, unknown>)[key] = value;
  });

  if (hasAspectRatio && (fillWidth || fillHeight)) {
    fillWidth = true;
    fillHeight = true;
  }
  if (fillWidth) {
    fillStyle.width = '100%';
  }
  if (fillHeight) {
    fillStyle.height = '100%';
  }

  return { containerStyle, panelStyle, fillStyle };
};

const GlassPanel = ({
  children,
  style,
  radius = 22,
  intensity = 35,
  interactive = false,
}: GlassPanelProps) => {
  const { colors, isDark } = useAppTheme();
  const useNativeGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();
  const flattenedStyle = StyleSheet.flatten(style) as ViewStyle | undefined;
  const { containerStyle, panelStyle, fillStyle } = splitPanelStyles(flattenedStyle);
  const resolvedRadius =
    typeof flattenedStyle?.borderRadius === 'number' ? flattenedStyle.borderRadius : radius;

  return (
    <View
      style={[styles.shadow, { borderRadius: resolvedRadius, shadowColor: colors.shadow }, containerStyle]}
    >
      {useNativeGlass ? (
        <GlassView
          glassEffectStyle="regular"
          tintColor={colors.glassSurface}
          isInteractive={interactive}
          style={[styles.panel, fillStyle, { borderRadius: resolvedRadius }, panelStyle]}
        >
          {children}
        </GlassView>
      ) : (
        <View
          style={[
            styles.panel,
            fillStyle,
            { borderRadius: resolvedRadius, backgroundColor: colors.glassSurface },
            panelStyle,
          ]}
        >
          <BlurView intensity={intensity} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
          <LinearGradient
            colors={[colors.glassHighlight, 'transparent']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          {children}
          <View
            pointerEvents="none"
            style={[styles.stroke, { borderRadius: radius, borderColor: colors.glassStroke }]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
  panel: {
    overflow: 'hidden',
  },
  stroke: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
  },
});

export default GlassPanel;
