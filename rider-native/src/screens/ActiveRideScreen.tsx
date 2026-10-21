import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { useRide } from '../context/RideContext';
import { Icons } from '../components/common/Icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ActiveRideScreenProps {
  onMinimize: () => void;
  onRideEnded: (receipt: any) => void;
}

export const ActiveRideScreen: React.FC<ActiveRideScreenProps> = ({
  onMinimize,
  onRideEnded,
}) => {
  const { activeRide, pauseRide, resumeRide, endRide } = useRide();
  const [isLocked, setIsLocked] = useState(false);

  const vehicleNo = activeRide?.vehicleId || '5090754';
  const batteryPct = activeRide?.batteryPercentage || 12;
  const rangeKm = activeRide ? `${Math.round(batteryPct * 0.8)}–${Math.round(batteryPct * 0.9)} km` : '9–10 km';

  const handleToggleLock = () => {
    setIsLocked((prev) => !prev);
    if (!isLocked) {
      pauseRide();
      Alert.alert('Vehicle Locked', 'Vehicle locked safely. Parking pause meter is active.');
    } else {
      resumeRide();
      Alert.alert('Vehicle Unlocked', 'Vehicle unlocked! You can continue your ride.');
    }
  };

  const handleNavigateStation = () => {
    Alert.alert(
      'Navigating to Battery Swap Station',
      'Gotri Central MAX Swap Station is 450m away. Routing directions generated.'
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. MAP CANVAS (Gotri Lake, Service Rd, GPS location) */}
      <ImageBackground
        source={require('../../assets/live_map_canvas.png')}
        style={styles.mapCanvas}
        resizeMode="cover"
      >
        {/* Top Header Row (Location Chip, Bell, Menu) */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onMinimize}
            style={styles.locationPill}
          >
            <Icons.MapPin size={16} color="#4313B8" />
            <Text style={styles.locationText} numberOfLines={1}>
              Gotri Zone, Vadodara
            </Text>
            <Icons.ChevronDown size={14} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.headerRightGroup}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => Alert.alert('Notifications', 'No new alerts.')}
              style={styles.headerIconBtn}
            >
              <Icons.Bell size={18} color="#0F172A" />
              <View style={styles.bellBadge} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onMinimize}
              style={styles.headerIconBtn}
            >
              <Icons.Menu size={18} color="#0F172A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Floating Low Battery Alert Card */}
        <View style={styles.alertCardContainer}>
          <View style={styles.alertCard}>
            <View style={styles.alertIconCircle}>
              <Icons.Battery size={20} color="#F97316" />
            </View>

            <View style={styles.alertTextContent}>
              <Text style={styles.alertTitle}>Low Battery!</Text>
              <Text style={styles.alertSubtitle}>
                Go to a MAX station to get a fully charged battery.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleNavigateStation}
              style={styles.turnNavButton}
            >
              <Icons.ArrowUpRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* 2. BOTTOM VEHICLE STATUS SHEET (My vehicle 🟢 Live) */}
      <View style={styles.bottomSheet}>
        {/* Drag handle */}
        <View style={styles.dragHandle} />

        {/* Live Status Header */}
        <View style={styles.sheetLiveRow}>
          <Text style={styles.myVehicleTitle}>My vehicle</Text>
          <View style={styles.liveBadgeRow}>
            <View style={styles.liveGreenDot} />
            <Text style={styles.liveBadgeText}>Live</Text>
          </View>
        </View>

        {/* Telemetry Stats Row */}
        <View style={styles.telemetryStatsRow}>
          {/* Scooter Image Thumbnail */}
          <View style={styles.scooterThumbBox}>
            <Image
              source={require('../../assets/scooter_daily_purple.png')}
              style={styles.scooterThumb}
              resizeMode="contain"
            />
          </View>

          {/* Vehicle No */}
          <View style={styles.telemetryCol}>
            <Text style={styles.telemetryVal}>{vehicleNo}</Text>
            <Text style={styles.telemetryLabel}>Vehicle no.</Text>
          </View>

          <View style={styles.verticalDivider} />

          {/* Range */}
          <View style={styles.telemetryCol}>
            <View style={styles.rangeValRow}>
              <Icons.Zap size={13} color="#2563EB" />
              <Text style={styles.telemetryVal}> {rangeKm}</Text>
            </View>
            <Text style={styles.telemetryLabel}>Range</Text>
          </View>

          <View style={styles.verticalDivider} />

          {/* Expiry */}
          <View style={styles.telemetryCol}>
            <Text style={styles.expiryVal}>22 Sep, 04:48 PM</Text>
            <Text style={styles.telemetryLabel}>Expiry</Text>
          </View>
        </View>

        {/* Big Action Button (Lock / Unlock) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleToggleLock}
          style={[styles.lockButton, isLocked && styles.unlockButton]}
        >
          {isLocked ? (
            <Icons.Unlock size={20} color="#FFFFFF" />
          ) : (
            <Icons.Lock size={20} color="#FFFFFF" />
          )}
          <Text style={styles.lockBtnText}>
            {isLocked ? 'Unlock' : 'Lock'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFE',
  },
  mapCanvas: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginHorizontal: 6,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bellBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  alertCardContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 12,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  alertIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  alertTextContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  alertSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  turnNavButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetLiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  myVehicleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 8,
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16A34A',
    marginRight: 4,
  },
  liveBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  telemetryStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 14,
  },
  scooterThumbBox: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scooterThumb: {
    width: '100%',
    height: '100%',
  },
  telemetryCol: {
    alignItems: 'center',
  },
  telemetryVal: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  rangeValRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  telemetryLabel: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  lockButton: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  unlockButton: {
    backgroundColor: '#16A34A',
    shadowColor: '#16A34A',
  },
  lockBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
});
