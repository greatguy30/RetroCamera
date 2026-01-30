import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppTheme, type CameraStyle } from '../context/AppContext';

type FilmOverlayProps = {
  intensity?: number;
  grainEnabled?: boolean;
  cameraStyle?: CameraStyle;
};

type VignetteProps = {
  intensity?: number;
};

type GrainProps = {
  density?: number;
  intensity?: number;
};

const ViewfinderOverlay = ({ cameraStyle }: { cameraStyle: CameraStyle }) => {
  switch (cameraStyle) {
    case 'leica':
      return (
        <View style={StyleSheet.absoluteFillObject}>
          {/* Leica Bright Line Frame */}
          <View style={[styles.leicaFrame, styles.leicaTopLeft]} />
          <View style={[styles.leicaFrame, styles.leicaTopRight]} />
          <View style={[styles.leicaFrame, styles.leicaBottomLeft]} />
          <View style={[styles.leicaFrame, styles.leicaBottomRight]} />
          <View style={styles.leicaCenter} />
        </View>
      );
    case 'hasselblad':
      return (
        <View style={StyleSheet.absoluteFillObject}>
          {/* Hasselblad Square Mask */}
          <View style={styles.hasselbladMaskLeft} />
          <View style={styles.hasselbladMaskRight} />
          <View style={styles.hasselbladGrid}>
            <View style={styles.hasselbladLineH} />
            <View style={styles.hasselbladLineV} />
          </View>
        </View>
      );
    case 'movie':
      return (
        <View style={StyleSheet.absoluteFillObject}>
          {/* Cinematic Bars */}
          <View style={styles.movieBarTop} />
          <View style={styles.movieBarBottom} />
          <View style={styles.movieFrame}>
            <View style={styles.movieCorner} />
          </View>
        </View>
      );
    case 'fuji':
      return (
        <View style={StyleSheet.absoluteFillObject}>
          {/* Fuji Viewfinder Info */}
          <View style={styles.fujiInfoTop}>
            <View style={styles.fujiDot} />
          </View>
          <View style={styles.fujiInfoBottom}>
            <View style={styles.fujiBar} />
          </View>
        </View>
      );
    default:
      return null;
  }
};

const VignetteOverlay = ({ intensity = 0.3 }: VignetteProps) => {
  const shade = `rgba(0,0,0,${intensity})`;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <LinearGradient colors={[shade, 'transparent']} style={styles.vignetteTop} />
      <LinearGradient colors={['transparent', shade]} style={styles.vignetteBottom} />
      <LinearGradient colors={[shade, 'transparent']} style={styles.vignetteLeft} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
      <LinearGradient colors={['transparent', shade]} style={styles.vignetteRight} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
    </View>
  );
};

const GrainOverlay = ({ density = 90, intensity = 0.18 }: GrainProps) => {
  const dots = useMemo(
    () =>
      Array.from({ length: density }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.35 + 0.05,
        isLight: Math.random() > 0.5,
      })),
    [density]
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {dots.map((dot, index) => (
        <View
          key={`grain-${index}`}
          style={[
            styles.grainDot,
            {
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity * intensity,
              backgroundColor: dot.isLight ? '#F8F2E9' : '#2B2622',
            },
          ]}
        />
      ))}
    </View>
  );
};

const FilmOverlay = ({
  intensity = 0.3,
  grainEnabled = true,
  cameraStyle = 'polaroid',
}: FilmOverlayProps) => {
  const { isDark } = useAppTheme();

  const styleConfig = useMemo(() => {
    switch (cameraStyle) {
      case 'leica':
        return {
          wash: 'rgba(0, 0, 0, 0.05)',
          gradientTop: 'rgba(255, 255, 255, 0.05)',
          gradientBottom: 'rgba(0, 0, 0, 0.4)',
          grainIntensity: 0.1,
          vignette: 0.4,
        };
      case 'hasselblad':
        return {
          wash: 'rgba(180, 190, 210, 0.05)',
          gradientTop: 'rgba(255, 255, 255, 0.1)',
          gradientBottom: 'rgba(20, 20, 30, 0.15)',
          grainIntensity: 0.05,
          vignette: 0.2,
        };
      case 'movie':
        return {
          wash: 'rgba(0, 128, 128, 0.08)',
          gradientTop: 'rgba(255, 165, 0, 0.1)',
          gradientBottom: 'rgba(0, 20, 40, 0.3)',
          grainIntensity: 0.15,
          vignette: 0.35,
        };
      case 'fuji':
        return {
          wash: 'rgba(0, 128, 64, 0.06)',
          gradientTop: 'rgba(255, 240, 200, 0.15)',
          gradientBottom: 'rgba(0, 40, 20, 0.25)',
          grainIntensity: 0.12,
          vignette: 0.3,
        };
      case 'normal':
        return {
          wash: 'transparent',
          gradientTop: 'transparent',
          gradientBottom: 'transparent',
          grainIntensity: 0,
          vignette: 0.1,
        };
      case 'polaroid':
      default:
        return {
          wash: 'rgba(210, 170, 118, 0.2)',
          gradientTop: isDark ? 'rgba(255, 224, 180, 0.2)' : 'rgba(255, 231, 189, 0.28)',
          gradientBottom: isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(38, 30, 24, 0.28)',
          grainIntensity: 0.2,
          vignette: intensity,
        };
    }
  }, [cameraStyle, isDark, intensity]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <View style={[styles.wash, { backgroundColor: styleConfig.wash }]} />
      <LinearGradient
        colors={[styleConfig.gradientTop, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 0.9 }}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={['transparent', styleConfig.gradientBottom]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {grainEnabled && styleConfig.grainIntensity > 0 ? (
        <GrainOverlay intensity={styleConfig.grainIntensity} />
      ) : null}
      <VignetteOverlay intensity={styleConfig.vignette} />
      <ViewfinderOverlay cameraStyle={cameraStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  wash: {
    ...StyleSheet.absoluteFillObject,
  },
  grainDot: {
    position: 'absolute',
    borderRadius: 999,
  },
  vignetteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
  },
  vignetteBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
  },
  vignetteLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 56,
  },
  vignetteRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 56,
  },
  // Leica Styles
  leicaFrame: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
  },
  leicaTopLeft: { top: '15%', left: '10%', borderRightWidth: 0, borderBottomWidth: 0 },
  leicaTopRight: { top: '15%', right: '10%', borderLeftWidth: 0, borderBottomWidth: 0 },
  leicaBottomLeft: { bottom: '15%', left: '10%', borderRightWidth: 0, borderTopWidth: 0 },
  leicaBottomRight: { bottom: '15%', right: '10%', borderLeftWidth: 0, borderTopWidth: 0 },
  leicaCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    marginLeft: -10,
    marginTop: -10,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderRadius: 2,
  },
  // Hasselblad Styles
  hasselbladMaskLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '12.5%',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  hasselbladMaskRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '12.5%',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  hasselbladGrid: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hasselbladLineH: {
    width: '75%',
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  hasselbladLineV: {
    width: 0.5,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  // Movie Styles
  movieBarTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '15%',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  movieBarBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '15%',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  movieFrame: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    margin: '15%',
  },
  movieCorner: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,0,0,0.5)',
  },
  // Fuji Styles
  fujiInfoTop: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  fujiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowRadius: 4,
    shadowOpacity: 0.8,
  },
  fujiInfoBottom: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fujiBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 2,
  },
});

export default FilmOverlay;
