import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../common/Icons';
import { BorderRadius, Spacing } from '../../constants/theme';

interface RideControlsProps {
  isPaused: boolean;
  headlightsOn: boolean;
  onTogglePause: () => void;
  onToggleHeadlights: () => void;
  onHonk: () => void;
  onSos: () => void;
  onEndRide: () => void;
}

export const RideControls: React.FC<RideControlsProps> = ({
  isPaused,
  headlightsOn,
  onTogglePause,
  onToggleHeadlights,
  onHonk,
  onSos,
  onEndRide,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* 4 Tile Quick Controls */}
      <View style={styles.controlGrid}>
        {/* Pause / Resume */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onTogglePause}
          style={[
            styles.controlBtn,
            { backgroundColor: isPaused ? colors.neon : 'rgba(255, 255, 255, 0.1)' },
          ]}
        >
          {isPaused ? (
            <Icons.Unlock size={22} color="#0F172A" />
          ) : (
            <Icons.Lock size={22} color="#FFFFFF" />
          )}
          <Text
            style={[
              styles.controlLabel,
              { color: isPaused ? '#0F172A' : '#FFFFFF' },
            ]}
          >
            {isPaused ? 'Resume' : 'Pause Lock'}
          </Text>
        </TouchableOpacity>

        {/* Headlights */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onToggleHeadlights}
          style={[
            styles.controlBtn,
            { backgroundColor: headlightsOn ? colors.neon : 'rgba(255, 255, 255, 0.1)' },
          ]}
        >
          <Icons.Flashlight size={22} color={headlightsOn ? '#0F172A' : '#FFFFFF'} />
          <Text
            style={[
              styles.controlLabel,
              { color: headlightsOn ? '#0F172A' : '#FFFFFF' },
            ]}
          >
            {headlightsOn ? 'Lights ON' : 'Lights OFF'}
          </Text>
        </TouchableOpacity>

        {/* Honk / Locate */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onHonk}
          style={[styles.controlBtn, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
        >
          <Icons.Horn size={22} color="#FFFFFF" />
          <Text style={[styles.controlLabel, { color: '#FFFFFF' }]}>Honk / Find</Text>
        </TouchableOpacity>

        {/* SOS */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSos}
          style={[styles.controlBtn, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}
        >
          <Icons.AlertTriangle size={22} color="#EF4444" />
          <Text style={[styles.controlLabel, { color: '#EF4444' }]}>Emergency</Text>
        </TouchableOpacity>
      </View>

      {/* End Ride Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onEndRide}
        style={[styles.endRideBtn, { backgroundColor: '#EF4444' }]}
      >
        <Icons.Close size={20} color="#FFFFFF" />
        <Text style={styles.endRideText}>End Ride & Park Vehicle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  controlGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  controlBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  controlLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  endRideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    gap: 8,
    shadowColor: '#EF4444',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  endRideText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
