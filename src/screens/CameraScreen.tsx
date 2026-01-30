import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Vibration,
  View,
  type ImageStyle,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import ViewShot, { releaseCapture, type CaptureOptions } from 'react-native-view-shot';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import AppText from '../components/AppText';
import GlassPanel from '../components/GlassPanel';
import GlassButton from '../components/GlassButton';
import FilmOverlay from '../components/FilmOverlay';
import { useAppSettings, useAppTheme, type CameraStyle } from '../context/AppContext';
import type { ThemeColors } from '../theme/tokens';

const VIEW_SHOT_OPTIONS: CaptureOptions = {
  format: 'jpg',
  quality: 0.95,
  result: 'tmpfile',
};

const ZOOM_LEVELS = [
  { label: '0.5x', value: 0 },
  { label: '0.75x', value: 0.1 },
  { label: '1x', value: 0.2 },
  { label: '2x', value: 0.5 },
  { label: '3x', value: 0.8 },
];

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type CameraScreenProps = {
  isActive: boolean;
};

const TAB_BAR_PADDING = 84;

const formatDateTime = (date: Date | null) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
};

const CameraScreen = ({ isActive }: CameraScreenProps) => {
  const { t } = useTranslation();
  const { colors, isDark } = useAppTheme();
  const { autoSave, grainEnabled, cameraStyle, setCameraStyle } = useAppSettings();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const CAMERA_STYLES: { id: CameraStyle; label: string }[] = [
    { id: 'polaroid', label: t('camera.modes.polaroid') },
    { id: 'leica', label: t('camera.modes.leica') },
    { id: 'hasselblad', label: t('camera.modes.hasselblad') },
    { id: 'movie', label: t('camera.modes.movie') },
    { id: 'fuji', label: t('camera.modes.fuji') },
    { id: 'normal', label: t('camera.modes.normal') },
  ];


  const cameraRef = useRef<React.ElementRef<typeof CameraView> | null>(null);
  const polaroidRef = useRef<ViewShot | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [cameraFacing, setCameraFacing] = useState<CameraType>('back');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [capturedAt, setCapturedAt] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [zoomIndex, setZoomIndex] = useState<number>(0);

  // Get style-specific colors
  const cardBg = '#FFFFFF';
  const textColor = '#000000';
  const zoomValue = ZOOM_LEVELS[zoomIndex]?.value ?? 0;
  const zoomLabel = ZOOM_LEVELS[zoomIndex]?.label ?? '1x';

  useEffect(() => {
    if (!isActive) {
      setPhotoUri(null);
      setCapturedAt(null);
    }
  }, [isActive]);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;
    try {
      Vibration.vibrate(10);
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      setPhotoUri(photo.uri);
      setCapturedAt(new Date());
      setSaveStatus('idle');
      setSaveError(null);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  const handleFlipCamera = useCallback(() => {
    setCameraFacing((current) => (current === 'back' ? 'front' : 'back'));
  }, []);

  const handleZoomToggle = useCallback(() => {
    setZoomIndex((current) => (current + 1) % ZOOM_LEVELS.length);
  }, []);

  const handleRetake = useCallback(() => {
    setPhotoUri(null);
    setCapturedAt(null);
    setSaveStatus('idle');
    setSaveError(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!photoUri || saveStatus === 'saving') return;
    Vibration.vibrate(10);
    setSaveStatus('saving');
    setSaveError(null);

    let permission = mediaPermission;
    if (!permission?.granted) {
      permission = await requestMediaPermission();
    }
    if (!permission?.granted) {
      setSaveStatus('error');
      setSaveError(t('camera.error'));
      return;
    }

    let shotUri: string | undefined;
    try {
      shotUri = await polaroidRef.current?.capture?.();
      if (!shotUri) {
        throw new Error('capture_failed');
      }

      const asset = await MediaLibrary.createAssetAsync(shotUri);
      try {
        await MediaLibrary.createAlbumAsync('RetroCam', asset, false);
      } catch (albumError) {
        const album = await MediaLibrary.getAlbumAsync('RetroCam');
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      }
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
      setSaveError(t('camera.error'));
    } finally {
      if (shotUri) {
        releaseCapture(shotUri);
      }
    }
  }, [mediaPermission, photoUri, requestMediaPermission, saveStatus, t]);

  useEffect(() => {
    if (photoUri && autoSave && saveStatus === 'idle') {
      const timer = setTimeout(() => {
        handleSave();
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [autoSave, handleSave, photoUri, saveStatus]);

  if (!isActive) {
    return null;
  }

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
        <AppText style={styles.loadingText}>{t('camera.checkingPermissions')}</AppText>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <GlassPanel style={styles.permissionCard}>
          <AppText style={styles.permissionTitle}>{t('camera.authorize')}</AppText>
          <AppText tone="secondary" style={styles.permissionBody}>
            {t('camera.authorizeBody')}
          </AppText>
          <GlassButton
            label={t('camera.authorize')}
            onPress={requestPermission}
            icon="camera"
            style={styles.permissionButton}
          />
        </GlassPanel>
      </View>
    );
  }

  if (photoUri) {
    const cardWidth = Math.min(width - 72, 360);
    const isSaving = saveStatus === 'saving';
    const isSaved = saveStatus === 'saved';
    const saveLabel = isSaving ? t('camera.saving') : isSaved ? t('camera.saved') : t('camera.saveToAlbum');
    const saveMessage =
      saveStatus === 'error' ? saveError : isSaved ? t('camera.saved') : null;

    return (
      <View style={styles.previewContainer}>
        <ViewShot ref={polaroidRef} options={VIEW_SHOT_OPTIONS} style={styles.captureWrap}>
          <View style={[styles.polaroidCard, { width: cardWidth, backgroundColor: cardBg }]}> 
            <View style={styles.polaroidImageWrap}>
              <Image source={{ uri: photoUri }} style={styles.polaroidImage as ImageStyle} />
              <FilmOverlay cameraStyle={cameraStyle} grainEnabled={grainEnabled} />
            </View>
            <View style={styles.cardFooter}>
              <AppText style={[styles.polaroidCaption, { color: textColor + '80' }]}>
                {formatDateTime(capturedAt)}
              </AppText>
              <AppText style={[styles.brandText, { color: textColor + '40' }]}>
                RETRO CAM
              </AppText>
            </View>
          </View>
        </ViewShot>

        <View style={styles.previewActions}>
          <GlassButton
            label={saveLabel}
            onPress={handleSave}
            disabled={isSaving || isSaved}
            icon="download"
            style={styles.actionButton}
          />
          <GlassButton label={t('camera.retake')} onPress={handleRetake} icon="refresh" style={styles.actionButton} />
          {saveMessage ? (
            <AppText tone={saveStatus === 'error' ? 'accent' : 'secondary'} style={styles.saveMessage}>
              {saveMessage}
            </AppText>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Wall Background to match SpaceScreen */}
      <View style={styles.wallBackground}>
        <View style={styles.wallTexture} />
      </View>

      <View style={[styles.content, { paddingTop: insets.top + 12 }]}>
        <View style={styles.cameraFrame}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing={cameraFacing}
            mirror={cameraFacing === 'front'}
            zoom={zoomValue}
          />
          <FilmOverlay cameraStyle={cameraStyle} grainEnabled={grainEnabled} />
          
          {/* Viewfinder Corners */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        <View style={styles.controlsContainer}>
          <GlassPanel radius={32} intensity={40} style={styles.controlDeck}>
            <View style={styles.styleSelector}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.styleScroll}
              >
                {CAMERA_STYLES.map((style) => (
                  <Pressable
                    key={style.id}
                    onPress={() => setCameraStyle(style.id)}
                    style={[
                      styles.styleItem,
                      cameraStyle === style.id && styles.styleItemActive
                    ]}
                  >
                    <AppText 
                      tone={cameraStyle === style.id ? 'primary' : 'secondary'}
                      weight={cameraStyle === style.id ? 'bold' : 'medium'}
                      style={[
                        styles.styleText,
                        cameraStyle === style.id && styles.styleTextActive
                      ]}
                    >
                      {style.label}
                    </AppText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.bottomRow}>
              <Pressable
                onPress={handleFlipCamera}
                style={({ pressed }) => [styles.miniButton, pressed && styles.miniControlPressed]}
              >
                <Ionicons name="camera-reverse-outline" size={24} color={colors.textPrimary} />
              </Pressable>

              <Pressable
                onPress={handleCapture}
                style={({ pressed }) => [styles.shutterWrap, pressed && styles.shutterPressed]}
              >
                <View style={styles.shutterOuter}>
                  <View style={styles.shutterInner}>
                    <View style={styles.shutterCore} />
                  </View>
                </View>
              </Pressable>

              <Pressable
                onPress={handleZoomToggle}
                style={({ pressed }) => [styles.miniButton, pressed && styles.miniControlPressed]}
              >
                <AppText weight="bold" style={styles.zoomText}>{zoomLabel}</AppText>
              </Pressable>
            </View>
          </GlassPanel>
        </View>
      </View>
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
    content: {
      flex: 1,
      paddingHorizontal: 12,
      paddingBottom: TAB_BAR_PADDING + 12,
    },
    cameraFrame: {
      width: '100%',
      aspectRatio: 3 / 4,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: '#000',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 10,
    },
    corner: {
      position: 'absolute',
      width: 14,
      height: 14,
      borderColor: 'rgba(255,255,255,0.6)',
      borderWidth: 1.5,
    },
    topLeft: { top: 12, left: 12, borderRightWidth: 0, borderBottomWidth: 0 },
    topRight: { top: 12, right: 12, borderLeftWidth: 0, borderBottomWidth: 0 },
    bottomLeft: { bottom: 12, left: 12, borderRightWidth: 0, borderTopWidth: 0 },
    bottomRight: { bottom: 12, right: 12, borderLeftWidth: 0, borderTopWidth: 0 },
    controlsContainer: {
      marginTop: 12,
    },
    controlDeck: {
      padding: 16,
      paddingBottom: 18,
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    miniButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.divider,
    },
    zoomText: {
      fontSize: 13,
      color: colors.textPrimary,
    },
    shutterWrap: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    shutterPressed: {
      transform: [{ scale: 0.92 }],
    },
    shutterOuter: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      padding: 5,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    shutterInner: {
      flex: 1,
      borderRadius: 33,
      backgroundColor: isDark ? 'rgba(255,255,255,0.9)' : '#FFF',
      padding: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    shutterCore: {
      flex: 1,
      borderRadius: 29,
      backgroundColor: colors.accent,
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    styleSelector: {
      marginBottom: 12,
    },
    styleScroll: {
      gap: 8,
      paddingHorizontal: 2,
    },
    styleItem: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    styleItemActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    styleText: {
      fontSize: 13,
    },
    styleTextActive: {
      color: isDark ? '#000' : '#FFF',
    },
    miniControlPressed: {
      transform: [{ scale: 0.95 }],
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    loadingText: {
      fontSize: 16,
      marginTop: 12,
    },
    permissionCard: {
      padding: 24,
      alignItems: 'center',
    },
    permissionTitle: {
      fontSize: 20,
      marginBottom: 8,
    },
    permissionBody: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 20,
    },
    permissionButton: {
      marginTop: 12,
    },
    previewContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    captureWrap: {
      alignItems: 'center',
    },
    polaroidCard: {
      backgroundColor: colors.frame,
      padding: 14,
      paddingBottom: 44,
      borderWidth: 1,
      borderColor: colors.frameBorder,
      shadowColor: colors.frameShadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.22,
      shadowRadius: 18,
      elevation: 8,
    },
    polaroidImageWrap: {
      width: '100%',
      aspectRatio: 3 / 4,
      overflow: 'hidden',
      backgroundColor: colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: colors.frameBorder,
    },
    polaroidImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    polaroidCaption: {
      fontSize: 14,
    },
    cardFooter: {
      marginTop: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    brandText: {
      fontSize: 12,
      letterSpacing: 2,
    },
    previewActions: {
      alignItems: 'center',
      marginTop: 24,
      gap: 12,
    },
    actionButton: {
      width: 200,
    },
    saveMessage: {
      marginTop: 8,
      fontSize: 13,
    },
  });

export default CameraScreen;
