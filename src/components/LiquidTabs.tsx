import React, { useState, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import GlassPanel from './GlassPanel';
import AppText from './AppText';
import { useAppTheme } from '../context/AppContext';
import CameraScreen from '../screens/CameraScreen';
import SpaceScreen from '../screens/SpaceScreen';
import ProfileScreen from '../screens/ProfileScreen';

type TabKey = 'camera' | 'space' | 'profile';

type TabItem = {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const LiquidTabs = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('camera');
  const insets = useSafeAreaInsets();

  const tabs: TabItem[] = useMemo(() => [
    { key: 'camera', label: t('tabs.camera'), icon: 'camera' },
    { key: 'space', label: t('tabs.space'), icon: 'albums' },
    { key: 'profile', label: t('tabs.profile'), icon: 'person' },
  ], [t]);

  const renderScreen = () => {
    switch (activeTab) {
      case 'space':
        return <SpaceScreen isActive />;
      case 'profile':
        return <ProfileScreen />;
      case 'camera':
      default:
        return <CameraScreen isActive />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      <TabBar activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />
    </View>
  );
};

type TabBarProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  tabs: TabItem[];
};

const TabBar = ({ activeTab, onChange, tabs }: TabBarProps) => {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarWrap, { bottom: Math.max(insets.bottom, 12) }]}>
      <GlassPanel radius={28} intensity={45} style={styles.tabBar}>
        <View style={styles.tabRow}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            const iconColor = isActive ? colors.tabActive : colors.tabInactive;
            const labelTone = isActive ? 'primary' : 'secondary';

            return (
              <Pressable
                key={tab.key}
                onPress={() => onChange(tab.key)}
                style={({ pressed }) => [
                  styles.tabButton,
                  isActive && styles.tabButtonActive,
                  pressed && styles.tabButtonPressed,
                ]}
              >
                <Ionicons name={tab.icon} size={20} color={iconColor} />
                <AppText tone={labelTone} style={styles.tabLabel}>
                  {tab.label}
                </AppText>
                {isActive ? <View style={[styles.tabIndicator, { backgroundColor: colors.accent }]} /> : null}
              </Pressable>
            );
          })}
        </View>
      </GlassPanel>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 96,
  },
  tabBarWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
  },
  tabBar: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 18,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  tabIndicator: {
    marginTop: 6,
    width: 18,
    height: 3,
    borderRadius: 999,
  },
});

export default LiquidTabs;
