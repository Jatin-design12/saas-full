import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { VehicleService, Vehicle, Zone } from '../services/vehicleService';
import { Icons } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { BorderRadius, Spacing } from '../constants/theme';

interface MapDiscoveryScreenProps {
  onBack: () => void;
  onSelectVehicleToRide: (vehicle: Vehicle) => void;
}

export const MapDiscoveryScreen: React.FC<MapDiscoveryScreenProps> = ({
  onBack,
  onSelectVehicleToRide,
}) => {
  const { colors } = useTheme();
  const zones = [
    {
      id: 'z1',
      name: 'Gotri Central Zone',
      city: 'Vadodara',
      address: 'Gotri Main Road, Near Yash Complex',
      bikeCount: 4,
      distance: '150m away (2 min walk)',
    },
    {
      id: 'z2',
      name: 'Sayaji Baug Hub',
      city: 'Vadodara',
      address: 'Planetarium Gate, Sayaji Garden',
      bikeCount: 5,
      distance: '1.2 km away',
    },
    {
      id: 'z3',
      name: 'Connaught Place Zone',
      city: 'New Delhi',
      address: 'Inner Circle Block B, CP',
      bikeCount: 8,
      distance: 'Central Transit Hub',
    },
  ];

  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>({
    id: 'EV-VAD-01',
    vehicleId: 'EVEGAH_E1',
    modelName: 'Evegah City',
    category: 'E-Vehicle',
    batteryPercentage: 92,
    maxRangeKm: 90,
    topSpeedKmH: 45,
    seats: 2,
    todayRatePerHour: 18.0,
    rateAfterPerMin: 3.0,
    distanceMinutes: '2 mins walk',
    latitude: 22.3175,
    longitude: 73.1498,
    status: 'available',
    image: 'assets/city.png',
    tagline: 'Smart. Silent. Sustainable.',
  });

  const availableVehicles: Vehicle[] = [
    {
      id: 'EV-VAD-01',
      vehicleId: 'EVEGAH_E1',
      modelName: 'Evegah City',
      category: 'E-Vehicle',
      batteryPercentage: 92,
      maxRangeKm: 90,
      topSpeedKmH: 45,
      seats: 2,
      todayRatePerHour: 18.0,
      rateAfterPerMin: 3.0,
      distanceMinutes: '2 mins walk',
      latitude: 22.3175,
      longitude: 73.1498,
      status: 'available',
      image: 'assets/city.png',
      tagline: 'Smart. Silent. Sustainable.',
    },
    {
      id: 'EV-VAD-02',
      vehicleId: 'EVEGAH_E2',
      modelName: 'Evegah Pro',
      category: 'E-Scooter',
      batteryPercentage: 84,
      maxRangeKm: 110,
      topSpeedKmH: 40,
      seats: 1,
      todayRatePerHour: 20.0,
      rateAfterPerMin: 3.5,
      distanceMinutes: '3 mins walk',
      latitude: 22.316,
      longitude: 73.1485,
      status: 'available',
      image: 'assets/pro-1.png',
      tagline: 'Compact. Powerful.',
    },
    {
      id: 'EV-VAD-03',
      vehicleId: 'EVEGAH_E3',
      modelName: 'EverRide Lite',
      category: 'E-Bike',
      batteryPercentage: 78,
      maxRangeKm: 120,
      topSpeedKmH: 25,
      seats: 1,
      todayRatePerHour: 22.0,
      rateAfterPerMin: 4.0,
      distanceMinutes: '4 mins walk',
      latitude: 22.3182,
      longitude: 73.1505,
      status: 'available',
      image: 'assets/Fly.png',
      tagline: 'Light. Smart. Everyday.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Floating Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Icons.ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <Icons.Search size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search stations, hubs or landmarks"
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>
      </View>

      {/* Stylized Interactive Map Simulation Canvas */}
      <View style={styles.mapCanvas}>
        {/* Background Grid & Geo-fence */}
        <View style={styles.geoFenceZone}>
          <View style={[styles.zoneBadge, { backgroundColor: colors.primary }]}>
            <Icons.Zap size={14} color="#D7FF00" />
            <Text style={styles.zoneBadgeText}>{selectedZone.name}</Text>
          </View>

          {/* Simulated Hub Parking Bays with Vehicles */}
          <View style={styles.markersContainer}>
            {availableVehicles.map((v) => {
              const isSelected = selectedVehicle.id === v.id;
              return (
                <TouchableOpacity
                  key={v.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedVehicle(v)}
                  style={[
                    styles.vehicleMarker,
                    {
                      backgroundColor: isSelected ? '#042A14' : colors.surface,
                      borderColor: isSelected ? colors.neon : colors.primary,
                    },
                  ]}
                >
                  <Icons.Scooter size={18} color={isSelected ? colors.neon : colors.primary} />
                  <View style={styles.markerSoc}>
                    <Text style={[styles.markerSocText, { color: isSelected ? '#FFFFFF' : colors.text }]}>
                      {v.batteryPercentage}%
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* User Location Radar Dot */}
        <View style={styles.userLocationMarker}>
          <View style={styles.userRadarWave} />
          <View style={styles.userLocationDot} />
        </View>
      </View>

      {/* Zone Switcher Horizontal Pills */}
      <View style={styles.zonePillsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.zonePillsScroll}>
          {zones.map((z) => {
            const isSelected = selectedZone.id === z.id;
            return (
              <TouchableOpacity
                key={z.id}
                activeOpacity={0.8}
                onPress={() => setSelectedZone(z)}
                style={[
                  styles.zonePill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                ]}
              >
                <Icons.MapPin size={14} color={isSelected ? '#FFFFFF' : colors.primary} />
                <Text style={[styles.zonePillText, { color: isSelected ? '#FFFFFF' : colors.text }]}>
                  {z.name} ({z.bikeCount} EVs)
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Bottom Selected Vehicle Preview Card */}
      <View style={[styles.bottomCard, { backgroundColor: colors.surface, borderTopColor: colors.cardBorder }]}>
        <View style={styles.vehicleHeader}>
          <View>
            <View style={styles.titleRow}>
              <Text style={[styles.vehicleName, { color: colors.text }]}>{selectedVehicle.modelName}</Text>
              <Badge label={`${selectedVehicle.batteryPercentage}% SOC`} variant="success" />
            </View>
            <Text style={[styles.distanceText, { color: colors.textSecondary }]}>
              {selectedVehicle.distanceMinutes} • Inside {selectedZone.name}
            </Text>
          </View>

          <View style={styles.rateBadge}>
            <Text style={[styles.rateAmount, { color: colors.primary }]}>₹{selectedVehicle.todayRatePerHour}</Text>
            <Text style={[styles.rateSub, { color: colors.textMuted }]}>/30 mins</Text>
          </View>
        </View>

        <View style={styles.previewActions}>
          <Button
            title={`Unlock ${selectedVehicle.modelName}`}
            variant="primary"
            size="lg"
            icon={<Icons.QrCode size={20} color="#FFFFFF" />}
            onPress={() => onSelectVehicleToRide(selectedVehicle)}
            style={styles.unlockBtn}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  geoFenceZone: {
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(9, 93, 45, 0.12)',
    borderWidth: 2,
    borderColor: '#095D2D',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  zoneBadge: {
    position: 'absolute',
    top: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  zoneBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  markersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  markerSoc: {
    marginLeft: 2,
  },
  markerSocText: {
    fontSize: 11,
    fontWeight: '800',
  },
  userLocationMarker: {
    position: 'absolute',
    bottom: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userRadarWave: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    position: 'absolute',
  },
  userLocationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  zonePillsWrapper: {
    position: 'absolute',
    bottom: 175,
    left: 0,
    right: 0,
  },
  zonePillsScroll: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  zonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 6,
  },
  zonePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bottomCard: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '800',
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  rateBadge: {
    alignItems: 'flex-end',
  },
  rateAmount: {
    fontSize: 18,
    fontWeight: '800',
  },
  rateSub: {
    fontSize: 10,
    fontWeight: '600',
  },
  previewActions: {
    marginTop: 4,
  },
  unlockBtn: {
    width: '100%',
  },
});
