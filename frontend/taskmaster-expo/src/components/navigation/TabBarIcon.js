import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabBarIcon({ route, focused, color, size }) {
  const getIcon = (routeName) => {
    const icons = {
      Home: 'home',
      Tasks: 'format-list-checks',
      Calendar: 'calendar',
      Analytics: 'chart-line',
    };
    return icons[routeName] || 'circle';
  };

  return (
    <MaterialCommunityIcons
      name={getIcon(route.name)}
      size={size}
      color={color}
    />
  );
} 