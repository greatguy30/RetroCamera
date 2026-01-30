import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
  Dimensions,
  type ListRenderItem,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

import AppText from '../components/AppText';
import GlassPanel from '../components/GlassPanel';
import GlassButton from '../components/GlassButton';
import { useAppTheme } from '../context/AppContext';
import { APP_FONT } from '../theme/fonts';
import type { ThemeColors } from '../theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_ASSETS = 100;
const TAB_BAR_PADDING = 100;

type SpaceScreenProps = {
  isActive: boolean;
};

const SpaceScreen = ({ isActive }: SpaceScreenProps) => {
  const { t } = useTranslation();
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const listBottomPadding = insets.bottom + TAB_BAR_PADDING;

  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [albumCount, setAlbumCount] = useState<number>(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MediaLibrary.Asset | null>(null);

  const loadAssets = useCallback(async () => {
    if (!permission?.granted) return;
    setIsLoading(true);
    setLoadError(null);

    try {
      const isAvailable = await MediaLibrary.isAvailableAsync();
      if (!isAvailable) {
        setLoadError(t('space.notSupported'));
        return;
      }

      // Fetch all photos from the device
      const result = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        sortBy: [[MediaLibrary.SortBy.creationTime, false]], // Newest first
        first: MAX_ASSETS,
      });
      setAssets(result.assets);
      setAlbumCount(result.totalCount);
    } catch (error) {
      console.warn('Failed to load media assets:', error);
      setLoadError(t('space.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [permission, t]);

  useEffect(() => {
    if (isActive && permission?.granted) {
      loadAssets();
      // Add a delayed refresh to catch newly saved photos that might not be indexed yet
      const timer = setTimeout(() => {
        loadAssets();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, loadAssets, permission]);

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
        <AppText style={styles.loadingText}>{t('space.preparing')}</AppText>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <GlassPanel style={styles.permissionCard}>
          <AppText style={styles.permissionTitle}>{t('space.permissionTitle')}</AppText>
          <AppText tone="secondary" style={styles.permissionBody}>
            {t('space.permissionBody')}
          </AppText>
          <GlassButton label={t('space.grantPermission')} onPress={requestPermission} icon="images" />
        </GlassPanel>
      </View>
    );
  }

  const renderItem: ListRenderItem<MediaLibrary.Asset> = ({ item, index }) => {
    // Use index to generate a stable "random" rotation without hooks
    const rotationDeg = (index % 3 === 0 ? 2 : index % 2 === 0 ? -2 : 1) * (index % 5 === 0 ? 1.5 : 1);
    const rotation = `${rotationDeg}deg`;
    
    return (
      <Pressable 
        onPress={() => setSelectedAsset(item)}
        style={[styles.assetCardWrap, { transform: [{ rotate: rotation }] }]}
      >
        <View style={styles.clip} />
        <View style={styles.photoFrame}>
          <Image 
            source={{ uri: item.uri }} 
            style={styles.assetImage}
            contentFit="cover"
            transition={300}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Realistic Wall Background */}
      <View style={styles.wallBackground}>
        <View style={styles.wallTexture} />
        <View style={styles.wallShadow} />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerContent}>
          <View>
            <AppText weight="bold" style={styles.headerTitle}>{t('space.title')}</AppText>
            <AppText tone="secondary" style={styles.headerSubtitle}>
              {t('space.count', { count: albumCount })}
            </AppText>
          </View>
          <Pressable onPress={loadAssets} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color={colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.assetRow}
        contentContainerStyle={[styles.assetList, { paddingBottom: listBottomPadding }]}
        refreshing={isLoading}
        onRefresh={loadAssets}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Ionicons name="images-outline" size={48} color={colors.textSecondary} style={{ opacity: 0.3 }} />
              <AppText tone="secondary" style={styles.emptyText}>
                {loadError ?? t('space.empty')}
              </AppText>
            </View>
          ) : null
        }
      />

      {/* Preview Modal */}
      <Modal
        visible={!!selectedAsset}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedAsset(null)}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setSelectedAsset(null)} />
          
          {selectedAsset && (
            <View style={styles.modalContent}>
              <Image 
                source={{ uri: selectedAsset.uri }} 
                style={styles.fullImage}
                contentFit="contain"
              />
              <Pressable 
                style={styles.closeButton} 
                onPress={() => setSelectedAsset(null)}
              >
                <Ionicons name="close-circle" size={44} color={isDark ? colors.textPrimary : '#FFFFFF'} />
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    wallBackground: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.wallBackground,
    },
    wallTexture: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.wallTexture,
    },
    wallShadow: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'transparent',
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
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
    header: {
      paddingHorizontal: 24,
      zIndex: 10,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },
    headerTitle: {
      fontSize: 28,
      letterSpacing: -0.5,
      fontFamily: APP_FONT,
    },
    headerSubtitle: {
      fontSize: 14,
      marginTop: 2,
      opacity: 0.7,
    },
    refreshButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      backgroundColor: colors.surface,
    },
    assetList: {
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    assetRow: {
      justifyContent: 'space-around',
      marginBottom: 32,
    },
    assetCardWrap: {
      width: (SCREEN_WIDTH - 64) / 2,
      alignItems: 'center',
    },
    clip: {
      width: 32,
      height: 16,
      backgroundColor: colors.clip,
      borderRadius: 2,
      zIndex: 10,
      marginBottom: -8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      borderWidth: 1,
      borderColor: colors.clipBorder,
    },
    photoFrame: {
      backgroundColor: colors.photoFrame,
      padding: 10,
      paddingBottom: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 8,
      borderWidth: 0.5,
      borderColor: colors.photoFrameBorder,
    },
    assetImage: {
      width: (SCREEN_WIDTH - 104) / 2,
      height: ((SCREEN_WIDTH - 104) / 2) * 1.2,
      backgroundColor: colors.surface,
    },
    emptyState: {
      marginTop: 100,
      alignItems: 'center',
      gap: 16,
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullImage: {
      width: SCREEN_WIDTH * 0.9,
      height: SCREEN_HEIGHT * 0.7,
    },
    closeButton: {
      position: 'absolute',
      top: 60,
      right: 30,
    },
  });

export default SpaceScreen;


