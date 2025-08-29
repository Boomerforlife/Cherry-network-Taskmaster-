import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../../theme';

const ProgressChart = ({ completed, total, size = 120, strokeWidth = 8, showPercentage = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getProgressColor = () => {
    if (progress >= 80) return theme.colors.success;
    if (progress >= 60) return theme.colors.info;
    if (progress >= 40) return theme.colors.warning;
    return theme.colors.error;
  };

  const getProgressText = () => {
    if (progress >= 80) return 'Excellent!';
    if (progress >= 60) return 'Good Progress';
    if (progress >= 40) return 'Keep Going';
    return 'Getting Started';
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.lightGray}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {/* Center Content */}
      <View style={[styles.centerContent, { width: size, height: size }]}>
        {showPercentage ? (
          <>
            <Text style={[styles.percentage, { color: getProgressColor() }]}>
              {Math.round(progress)}%
            </Text>
            <Text style={styles.label}>Complete</Text>
          </>
        ) : (
          <>
            <Text style={[styles.number, { color: getProgressColor() }]}>
              {completed}
            </Text>
            <Text style={styles.label}>of {total}</Text>
          </>
        )}
      </View>
      
      {/* Progress Text */}
      <Text style={[styles.progressText, { color: getProgressColor() }]}>
        {getProgressText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  number: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ProgressChart; 