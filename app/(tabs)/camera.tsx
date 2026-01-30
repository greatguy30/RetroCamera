import React from 'react';
import { useIsFocused } from '@react-navigation/native';

import CameraScreen from '../../src/screens/CameraScreen';

export default function CameraRoute() {
  const isFocused = useIsFocused();
  return <CameraScreen isActive={isFocused} />;
}
