import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TabBarIcon = ({ route, focused, color, size }) => {
  let iconName;

  switch (route.name) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Tasks':
      iconName = focused ? 'format-list-checks' : 'format-list-checks';
      break;
    case 'Calendar':
      iconName = focused ? 'calendar' : 'calendar-outline';
      break;
    case 'Analytics':
      iconName = focused ? 'chart-line' : 'chart-line';
      break;
    default:
      iconName = 'circle';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

export default TabBarIcon; 