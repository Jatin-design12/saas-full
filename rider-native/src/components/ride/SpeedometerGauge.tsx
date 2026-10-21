import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { BorderRadius, Spacing } from '../../constants/theme';

interface SpeedometerGaugeProps {
  speed: number;
  maxSpeed?: number;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  speed,
  maxSpeed = 45,
}) => {
  const { colors } = useTheme();

  // Percentage of max speed (clamped 0 to 1)
  const ratio = Math.min(Math.max(speed / maxSpeed, 0), 1);
  const isOverSpeed = speed >= 40;

  return (
    <View style={styles.container}>
      {/* Outer Dial Gauge */}
      <View style={styles.gaugeWrapper}>
        <Svg width="220" height="140" viewBox="0 0 220 140">
          {/* Background Arc */}
          <Path
            d="M 25 125 A 85 85 0 0 1 195 125"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Speed Arc (dynamically drawn based on ratio) */}
          <Path
            d="M 25 125 A 85 85 0 0 1 195 125"
            fill="none"
            stroke={isOverSpeed ? '#EF4444' : colors.neon}
            strokeWidth="14"
            strokeDasharray="267"
            strokeDashoffset={267 * (1 - ratio)}
            strokeLinecap="round"
          />
        </Svg>

        {/* Center Digital Speed Readout */}
        <View style={styles.readout}>
          <Text
            style={[
              styles.digitalSpeed,
              { color: isOverSpeed ? '#EF4444' : '#FFFFFF' },
            ]}
          >
            {speed}
          </Text>
          <Text style={styles.unitText}>KM / H</Text>

          <View
            style={[
              styles.limitBadge,
              { backgroundColor: isOverSpeed ? '#EF4444' : 'rgba(255, 255, 255, 0.15)' },
            ]}
          >
            <Text style={styles.limitText}>LIMIT: {maxSpeed}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.sm,
  },
  gaugeWrapper: {
    width: 220,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  readout: {
    position: 'absolute',
    top: 40,
    alignItems: 'center',
  },
  digitalSpeed: {
    fontSize: 54,
    fontWeight: '900',
    lineHeight: 58,
    letterSpacing: -1,
  },
  unitText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: -2,
  },
  limitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginTop: 4,
  },
  limitText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
