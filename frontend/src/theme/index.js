import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // Primary colors
    primary: '#6200EE',
    primaryDark: '#3700B3',
    primaryLight: '#BB86FC',
    
    // Secondary colors
    secondary: '#03DAC6',
    secondaryDark: '#018786',
    
    // Task priority colors
    priorityLow: '#4CAF50',
    priorityMedium: '#FF9800',
    priorityHigh: '#F44336',
    priorityUrgent: '#9C27B0',
    
    // Status colors
    statusPending: '#FF9800',
    statusInProgress: '#2196F3',
    statusCompleted: '#4CAF50',
    statusCancelled: '#9E9E9E',
    statusOverdue: '#F44336',
    
    // Category colors
    categoryWork: '#3F51B5',
    categoryPersonal: '#E91E63',
    categoryStudy: '#009688',
    categoryHealth: '#4CAF50',
    categoryFinance: '#FF9800',
    categoryOther: '#9E9E9E',
    
    // UI colors
    background: '#F5F5F5',
    surface: '#FFFFFF',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#757575',
    lightGray: '#E0E0E0',
    darkGray: '#424242',
    
    // Text colors
    textPrimary: '#212121',
    textSecondary: '#757575',
    textDisabled: '#BDBDBD',
    
    // Success/Error colors
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    
    // Gradient colors
    gradientStart: '#6200EE',
    gradientEnd: '#03DAC6',
  },
  
  // Typography
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
  
  // Shadows
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6.27,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10.32,
      elevation: 8,
    },
  },
  
  // Task card styles
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    ...DefaultTheme.shadows.small,
  },
  
  // Button styles
  button: {
    primary: {
      backgroundColor: '#6200EE',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    secondary: {
      backgroundColor: '#03DAC6',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#6200EE',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
  },
  
  // Input styles
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  
  // Header styles
  header: {
    backgroundColor: '#6200EE',
    elevation: 4,
    shadowOpacity: 0.1,
  },
  
  // Tab bar styles
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
  },
  
  // Drawer styles
  drawer: {
    backgroundColor: '#FFFFFF',
    width: 280,
  },
};

export default theme; 