import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NativeTabs, Icon, Label, VectorIcon } from 'expo-router/unstable-native-tabs';

import { useAppTheme } from '../../src/context/AppContext';
import { APP_FONT } from '../../src/theme/fonts';

const TabsLayout = () => {
  const { colors, isDark } = useAppTheme();

  return (
    <NativeTabs
      minimizeBehavior="automatic"
      blurEffect={isDark ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight'}
      iconColor={{ default: colors.tabInactive, selected: colors.tabActive }}
      labelStyle={{
        default: { ...baseLabelStyle, color: colors.tabInactive },
        selected: { ...baseLabelStyle, color: colors.tabActive },
      }}
    >
      <NativeTabs.Trigger name="camera">
        <Icon
          src={{
            default: <VectorIcon family={Ionicons} name="camera-outline" />,
            selected: <VectorIcon family={Ionicons} name="camera" />,
          }}
        />
        <Label>拍照</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="space">
        <Icon
          src={{
            default: <VectorIcon family={Ionicons} name="albums-outline" />,
            selected: <VectorIcon family={Ionicons} name="albums" />,
          }}
        />
        <Label>空间</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon
          src={{
            default: <VectorIcon family={Ionicons} name="person-outline" />,
            selected: <VectorIcon family={Ionicons} name="person" />,
          }}
        />
        <Label>我的</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

const baseLabelStyle = {
  fontFamily: APP_FONT,
  fontSize: 11,
};

export default TabsLayout;
