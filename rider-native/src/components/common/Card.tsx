import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { BorderRadius, Spacing } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'subtle';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
  padding = Spacing.lg,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: variant === 'subtle' ? colors.surfaceSubtle : colors.card,
          borderColor: colors.cardBorder,
          borderWidth: variant === 'outlined' ? 1.5 : 1,
          padding,
          shadowColor: isDark ? '#000' : colors.cardShadow,
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: variant === 'elevated' ? 3 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
  },
});
