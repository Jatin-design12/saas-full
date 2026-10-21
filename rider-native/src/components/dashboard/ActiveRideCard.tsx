import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useRide } from '../../context/RideContext';
import { Icons } from '../common/Icons';
import { Badge } from '../common/Badge';
import { BorderRadius, Spacing } from '../../constants/theme';

interface ActiveRideCardProps {
  onPressCockpit: () => void;
}

export const ActiveRideCard: React.FC<ActiveRideCardProps> = ({ onPressCockpit }) => {
  const { colors } = useTheme();
  const { activeRide, pauseRide, resumeRide } = useRide();

  if (!activeRide) return null;

  const isPaused = activeRide.status === 'paused';
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPressCockpit}
      style={[
        styles.container,
        {
          backgroundColor: '#042A14',
          borderColor: isPaused ? '#F59E0B' : colors.neon,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.vehicleInfo}>
          <View style={[styles.pulseDot, { backgroundColor: isPaused ? '#F59E0B' : colors.neon }]} />
          <Text style={styles.vehicleTitle}>{activeRide.vehicleModel}</Text>
          <Badge
            label={isPaused ? 'PAUSED' : 'LIVE RIDE'}
            variant={isPaused ? 'warning' : 'neon'}
            style={styles.badge}
          />
        </View>

        <View style={styles.costBadge}>
          <Text style={styles.costCurrency}>₹</Text>
          <Text style={styles.costValue}>{activeRide.currentCost.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        {/* Speed */}
        <View style={styles.metricItem}>
          <Icons.Speedometer size={18} color="#FFFFFF" />
          <Text style={styles.metricValue}>{activeRide.speedKmH}</Text>
          <Text style={styles.metricUnit}>KM/H</Text>
        </View>

        <View style={styles.divider} />

        {/* Battery */}
        <View style={styles.metricItem}>
          <Icons.Battery size={18} color={activeRide.batteryPercentage > 20 ? colors.accent : '#EF4444'} />
          <Text style={styles.metricValue}>{activeRide.batteryPercentage}%</Text>
          <Text style={styles.metricUnit}>SOC</Text>
        </View>

        <View style={styles.divider} />

        {/* Duration */}
        <View style={styles.metricItem}>
          <Icons.Clock size={18} color="#FFFFFF" />
          <Text style={styles.metricValue}>{formatTime(activeRide.durationSeconds)}</Text>
          <Text style={styles.metricUnit}>TIME</Text>
        </View>

        <View style={styles.divider} />

        {/* Distance */}
        <View style={styles.metricItem}>
          <Icons.Scooter size={18} color="#FFFFFF" />
          <Text style={styles.metricValue}>{activeRide.distanceKm.toFixed(1)}</Text>
          <Text style={styles.metricUnit}>KM</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation();
            if (isPaused) {
              resumeRide();
            } else {
              pauseRide();
            }
          }}
          style={[
            styles.pauseButton,
            { backgroundColor: isPaused ? colors.neon : 'rgba(255, 255, 255, 0.15)' },
          ]}
        >
          {isPaused ? <Icons.Unlock size={16} color="#0F172A" /> : <Icons.Lock size={16} color="#FFFFFF" />}
          <Text style={[styles.pauseText, { color: isPaused ? '#0F172A' : '#FFFFFF' }]}>
            {isPaused ? 'Resume Ride' : 'Pause Lock'}
          </Text>
        </TouchableOpacity>

        <View style={styles.enterCockpit}>
          <Text style={[styles.enterText, { color: colors.neon }]}>Open Cockpit</Text>
          <Icons.ChevronRight size={16} color={colors.neon} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  vehicleTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },
  badge: {
    paddingVertical: 2,
  },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  costCurrency: {
    color: '#D7FF00',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 2,
  },
  costValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: Spacing.md,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 3,
  },
  metricUnit: {
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  pauseText: {
    fontSize: 13,
    fontWeight: '700',
  },
  enterCockpit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  enterText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
