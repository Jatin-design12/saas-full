import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useRide } from '../context/RideContext';
import { VehicleService, Vehicle } from '../services/vehicleService';
import { Icons } from '../components/common/Icons';
import { Button } from '../components/common/Button';
import { BorderRadius, Spacing } from '../constants/theme';

interface ScanQrScreenProps {
  onBack: () => void;
  onRideStarted: () => void;
}

export const ScanQrScreen: React.FC<ScanQrScreenProps> = ({
  onBack,
  onRideStarted,
}) => {
  const { colors } = useTheme();
  const { startRide } = useRide();

  const [flashlightOn, setFlashlightOn] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [unlockStep, setUnlockStep] = useState<number>(0);
  // 0 = scanning, 1 = connecting bluetooth, 2 = checking diagnostics, 3 = unlocked!

  const laserAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 240,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [laserAnim]);

  const handleUnlockSequence = async (vehicleCode: string) => {
    setIsScanning(false);
    setUnlockStep(1); // Connecting BLE

    setTimeout(() => {
      setUnlockStep(2); // Diagnostics
    }, 1200);

    setTimeout(async () => {
      setUnlockStep(3); // Unlocked!
      const vehicle = await VehicleService.getVehicleDetails(vehicleCode || 'EVEGAH_E1');
      if (vehicle) {
        await startRide(vehicle);
        setTimeout(() => {
          onRideStarted();
        }, 800);
      }
    }, 2400);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.iconCircle}>
          <Icons.ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Scan to Ride</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setFlashlightOn(!flashlightOn)}
          style={[
            styles.iconCircle,
            { backgroundColor: flashlightOn ? colors.neon : 'rgba(255, 255, 255, 0.2)' },
          ]}
        >
          <Icons.Flashlight size={20} color={flashlightOn ? '#0F172A' : '#FFFFFF'} />
        </TouchableOpacity>
      </View>

      {/* Center QR Scanner Target */}
      <View style={styles.scannerWrapper}>
        {unlockStep === 0 ? (
          <View style={styles.viewfinder}>
            {/* 4 Corner Markers */}
            <View style={[styles.corner, styles.cornerTL, { borderColor: colors.neon }]} />
            <View style={[styles.corner, styles.cornerTR, { borderColor: colors.neon }]} />
            <View style={[styles.corner, styles.cornerBL, { borderColor: colors.neon }]} />
            <View style={[styles.corner, styles.cornerBR, { borderColor: colors.neon }]} />

            {/* Animated Laser Line */}
            <Animated.View
              style={[
                styles.laserLine,
                {
                  backgroundColor: colors.neon,
                  transform: [{ translateY: laserAnim }],
                },
              ]}
            />

            <View style={styles.qrCenterHint}>
              <Icons.QrCode size={48} color="rgba(255, 255, 255, 0.4)" />
              <Text style={styles.viewfinderText}>Align QR code on vehicle handlebar</Text>
            </View>
          </View>
        ) : (
          <View style={styles.unlockCard}>
            <View style={[styles.pulseRing, { borderColor: colors.neon }]}>
              {unlockStep < 3 ? (
                <Icons.Bluetooth size={36} color={colors.neon} />
              ) : (
                <Icons.Unlock size={36} color="#10B981" />
              )}
            </View>

            <Text style={styles.unlockStatusTitle}>
              {unlockStep === 1 && 'Connecting to EV BLE Beacon...'}
              {unlockStep === 2 && 'Validating Battery & Geo-fence...'}
              {unlockStep === 3 && 'Smart Lock Released! Ready to Ride!'}
            </Text>

            <Text style={styles.unlockStatusSub}>
              {unlockStep === 1 && 'Establishing 256-bit encrypted handshake'}
              {unlockStep === 2 && 'Checking 14-cell BMS voltage & brakes'}
              {unlockStep === 3 && 'Wheel immobilizer unlocked. Put on your helmet.'}
            </Text>

            {unlockStep < 3 && (
              <ActivityIndicator color={colors.neon} size="large" style={{ marginTop: 16 }} />
            )}
          </View>
        )}
      </View>

      {/* Fast Demo Trigger Chips */}
      {unlockStep === 0 && (
        <View style={styles.demoTriggers}>
          <Text style={styles.demoLabel}>Or tap simulated vehicle QR code:</Text>
          <View style={styles.chipsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleUnlockSequence('EVEGAH_E1')}
              style={[styles.simChip, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
            >
              <Text style={styles.simChipText}>Evegah City (E1)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleUnlockSequence('EVEGAH_E2')}
              style={[styles.simChip, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
            >
              <Text style={styles.simChipText}>Evegah Pro (E2)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleUnlockSequence('EVEGAH_E3')}
              style={[styles.simChip, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
            >
              <Text style={styles.simChipText}>EverRide Lite (E3)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Manual Entry Sheet */}
      {unlockStep === 0 && (
        <View style={styles.manualEntryBox}>
          <Text style={styles.manualTitle}>Can't scan the QR code?</Text>
          <View style={styles.manualInputRow}>
            <TextInput
              placeholder="Enter Vehicle ID (e.g. EVEGAH_E1)"
              placeholderTextColor="#94A3B8"
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="characters"
              style={styles.manualInput}
            />
            <Button
              title="Unlock"
              variant="neon"
              size="sm"
              disabled={!manualCode.trim()}
              onPress={() => handleUnlockSequence(manualCode.trim())}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#042A14',
    paddingHorizontal: Spacing.xl,
    paddingTop: 54,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  scannerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xl,
  },
  viewfinder: {
    width: 260,
    height: 260,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderWidth: 4,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 12 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 12 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 12 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 12 },
  laserLine: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 3,
    borderRadius: 2,
    shadowColor: '#D7FF00',
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  qrCenterHint: {
    alignItems: 'center',
  },
  viewfinderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 180,
  },
  unlockCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  pulseRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  unlockStatusTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  unlockStatusSub: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 260,
  },
  demoTriggers: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  demoLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  simChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  simChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  manualEntryBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  manualTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  manualInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  manualInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    height: 44,
  },
});
