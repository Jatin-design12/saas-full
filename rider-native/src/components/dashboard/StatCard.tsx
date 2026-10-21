import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../common/Icons';
import { BorderRadius, Spacing } from '../../constants/theme';

interface StatCardProps {
  co2SavedKg: number;
  cleanEnergyKwh: number;
  totalRides: number;
  greenPoints: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  co2SavedKg,
  cleanEnergyKwh,
  totalRides,
  greenPoints,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}>
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <View style={[styles.iconBadge, { backgroundColor: '#DCFCE7' }]}>
            <Icons.Leaf size={16} color="#15803D" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Your Green Impact</Text>
        </View>
        <View style={[styles.pointsBadge, { backgroundColor: colors.neon }]}>
          <Text style={styles.pointsText}>{greenPoints} pts</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {/* CO2 Saved */}
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{co2SavedKg.toFixed(1)}</Text>
          <Text style={[styles.statUnit, { color: colors.textSecondary }]}>kg CO₂ Saved</Text>
        </View>

        <View style={[styles.vertDivider, { backgroundColor: colors.divider }]} />

        {/* Clean Energy */}
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{cleanEnergyKwh.toFixed(1)}</Text>
          <Text style={[styles.statUnit, { color: colors.textSecondary }]}>kWh Green Energy</Text>
        </View>

        <View style={[styles.vertDivider, { backgroundColor: colors.divider }]} />

        {/* Total Rides */}
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{totalRides}</Text>
          <Text style={[styles.statUnit, { color: colors.textSecondary }]}>Total Trips</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  pointsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  pointsText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statUnit: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  vertDivider: {
    width: 1,
    height: 32,
  },
});
