import React from 'react';
import { useIsFocused } from '@react-navigation/native';

import SpaceScreen from '../../src/screens/SpaceScreen';

export default function SpaceRoute() {
  const isFocused = useIsFocused();
  return <SpaceScreen isActive={isFocused} />;
}
