import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BMSService, BMSData } from '../services/bmsService';
import { Icons } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import { BorderRadius, Spacing } from '../constants/theme';

interface BmsScreenProps {
  onBack?: () => void;
}

export const BmsScreen: React.FC<BmsScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const [bmsData, setBmsData] = useState<BMSData>(BMSService.getLiveBMSData('EVEGAH_E1'));
  const [selectedMode, setSelectedMode] = useState<'eco' | 'city' | 'sport'>('city');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.cardBorder }]}>
        {onBack && (
          <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
            <Icons.ChevronLeft size={22} color={colors.text} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]}>Smart BMS Telemetry</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setBmsData(BMSService.getLiveBMSData('EVEGAH_E1'))}
          style={styles.refreshBtn}
        >
          <Icons.Zap size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Battery Pack Card */}
        <View style={styles.packCard}>
          <View style={styles.packHeader}>
            <View>
              <Text style={styles.packIdText}>BATTERY ID: {bmsData.batteryId}</Text>
              <Text style={styles.vehicleIdText}>Paired with {bmsData.vehicleId}</Text>
            </View>
            <Badge label="14S Li-ion" variant="neon" />
          </View>

          <View style={styles.socCenter}>
            <Text style={styles.socPercent}>{bmsData.soc}%</Text>
            <Text style={styles.socLabel}>STATE OF CHARGE</Text>
          </View>

          {/* Core Metrics Quad */}
          <View style={styles.quadGrid}>
            <View style={styles.quadItem}>
              <Text style={styles.quadVal}>{bmsData.voltage}V</Text>
              <Text style={styles.quadKey}>PACK VOLTAGE</Text>
            </View>
            <View style={styles.quadItem}>
              <Text style={styles.quadVal}>{bmsData.current}A</Text>
              <Text style={styles.quadKey}>CURRENT DRAW</Text>
            </View>
            <View style={styles.quadItem}>
              <Text style={styles.quadVal}>{bmsData.temperatureCelsius}°C</Text>
              <Text style={styles.quadKey}>TEMPERATURE</Text>
            </View>
            <View style={styles.quadItem}>
              <Text style={[styles.quadVal, { color: '#D7FF00' }]}>{bmsData.healthPercentage}%</Text>
              <Text style={styles.quadKey}>HEALTH INDEX</Text>
            </View>
          </View>
        </View>

        {/* Driving Mode Range Estimator */}
        <Text style={[styles.sectionHeading, { color: colors.text }]}>Driving Mode Range Estimator</Text>
        <View style={styles.modesRow}>
          {(['eco', 'city', 'sport'] as const).map((m) => {
            const isSelected = selectedMode === m;
            const range = bmsData.estimatedRangeKm[m];
            return (
              <TouchableOpacity
                key={m}
                activeOpacity={0.8}
                onPress={() => setSelectedMode(m)}
                style={[
                  styles.modeCard,
                  {
                    backgroundColor: isSelected ? '#042A14' : colors.card,
                    borderColor: isSelected ? colors.neon : colors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modeName,
                    { color: isSelected ? colors.neon : colors.textSecondary },
                  ]}
                >
                  {m.toUpperCase()}
                </Text>
                <Text
                  style={[
                    styles.modeRange,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {range} km
                </Text>
                <Text style={styles.modeSub}>
                  {m === 'eco' ? 'Max 25 km/h' : m === 'city' ? 'Balanced 35' : 'Peak 45 km/h'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 14-Cell Balancing Voltages */}
        <Text style={[styles.sectionHeading, { color: colors.text, marginTop: Spacing.lg }]}>
          14-Cell Pack Balancing Diagnostics
        </Text>
        <View style={[styles.cellsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.cellsGrid}>
            {bmsData.cells.map((cell) => (
              <View key={cell.cellNumber} style={styles.cellItem}>
                <View style={styles.cellBarTrack}>
                  <View
                    style={[
                      styles.cellBarFill,
                      {
                        height: `${((cell.voltage - 3.0) / (4.2 - 3.0)) * 100}%`,
                        backgroundColor: cell.status === 'balanced' ? colors.primary : colors.warning,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.cellVolt, { color: colors.text }]}>{cell.voltage.toFixed(2)}v</Text>
                <Text style={[styles.cellNum, { color: colors.textMuted }]}>C{cell.cellNumber}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Safety & Thermal Status Check */}
        <Text style={[styles.sectionHeading, { color: colors.text, marginTop: Spacing.lg }]}>
          Hardware Safety Interlocks
        </Text>
        <View style={[styles.safetyCard, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}>
          <View style={styles.safetyRow}>
            <Text style={[styles.safetyKey, { color: colors.textSecondary }]}>Over-Voltage Protection</Text>
            <Badge label="ACTIVE • NORMAL" variant="success" />
          </View>
          <View style={styles.safetyRow}>
            <Text style={[styles.safetyKey, { color: colors.textSecondary }]}>Under-Voltage Protection</Text>
            <Badge label="ACTIVE • NORMAL" variant="success" />
          </View>
          <View style={styles.safetyRow}>
            <Text style={[styles.safetyKey, { color: colors.textSecondary }]}>Thermal Management</Text>
            <Badge label="OPTIMAL (29.4°C)" variant="success" />
          </View>
          <View style={styles.safetyRow}>
            <Text style={[styles.safetyKey, { color: colors.textSecondary }]}>Short-Circuit Sensor</Text>
            <Badge label="SECURE" variant="success" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 54,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  refreshBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 90,
  },
  packCard: {
    backgroundColor: '#042A14',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1.5,
    borderColor: '#095D2D',
  },
  packHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  packIdText: {
    color: '#D7FF00',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  vehicleIdText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  socCenter: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  socPercent: {
    color: '#FFFFFF',
    fontSize: 56,
    fontWeight: '900',
    lineHeight: 60,
  },
  socLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  quadGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  quadItem: {
    alignItems: 'center',
    flex: 1,
  },
  quadVal: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  quadKey: {
    color: '#94A3B8',
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  modesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  modeName: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modeRange: {
    fontSize: 17,
    fontWeight: '800',
    marginVertical: 4,
  },
  modeSub: {
    fontSize: 9.5,
    color: '#94A3B8',
  },
  cellsCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
  },
  cellsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  cellItem: {
    alignItems: 'center',
    flex: 1,
  },
  cellBarTrack: {
    width: 12,
    height: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  cellBarFill: {
    width: '100%',
    borderRadius: 6,
  },
  cellVolt: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
  },
  cellNum: {
    fontSize: 8,
    fontWeight: '600',
  },
  safetyCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    gap: 10,
  },
  safetyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safetyKey: {
    fontSize: 13,
    fontWeight: '600',
  },
});
