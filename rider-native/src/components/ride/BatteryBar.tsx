import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../common/Icons';
import { BorderRadius, Spacing } from '../../constants/theme';

interface BatteryBarProps {
  percentage: number;
  estimatedKm?: number;
}

export const BatteryBar: React.FC<BatteryBarProps> = ({
  percentage,
  estimatedKm = 65,
}) => {
  const { colors } = useTheme();

  const getColor = () => {
    if (percentage > 50) return colors.accent;
    if (percentage > 20) return colors.warning;
    return colors.error;
  };

  const barColor = getColor();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <Icons.Battery size={18} color={barColor} />
          <Text style={styles.label}>BATTERY SOC</Text>
        </View>

        <View style={styles.right}>
          <Text style={[styles.percentage, { color: barColor }]}>{percentage}%</Text>
          <Text style={styles.rangeText}>({estimatedKm} km left)</Text>
        </View>
      </View>

      {/* Progress Track */}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.min(Math.max(percentage, 5), 100)}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  percentage: {
    fontSize: 16,
    fontWeight: '800',
  },
  rangeText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  track: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
});
