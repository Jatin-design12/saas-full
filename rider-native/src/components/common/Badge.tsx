import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { BorderRadius, Spacing } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neon' | 'neutral';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  style,
  textStyle,
  icon,
}) => {
  const { colors } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: '#DCFCE7', text: '#15803D' };
      case 'warning':
        return { bg: '#FEF3C7', text: '#B45309' };
      case 'error':
        return { bg: '#FEE2E2', text: '#B91C1C' };
      case 'info':
        return { bg: '#DBEAFE', text: '#1D4ED8' };
      case 'neon':
        return { bg: '#F2FF9E', text: '#0F172A' };
      case 'neutral':
      default:
        return { bg: colors.divider, text: colors.textSecondary };
    }
  };

  const c = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.label, { color: c.text }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
