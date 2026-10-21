import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Share,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { RideService, RideHistoryItem } from '../services/rideService';
import { Icons } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { BorderRadius, Spacing } from '../constants/theme';

interface RideHistoryScreenProps {
  onBack?: () => void;
}

export const RideHistoryScreen: React.FC<RideHistoryScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const [rides, setRides] = useState<RideHistoryItem[]>([]);
  const [selectedRide, setSelectedRide] = useState<RideHistoryItem | null>(null);
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Cancelled'>('All');

  useEffect(() => {
    RideService.getRideHistory().then(setRides);
  }, []);

  const filteredRides = rides.filter((r) => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return r.status === 'completed';
    if (filter === 'Cancelled') return r.status === 'cancelled';
    return true;
  });

  const handleShareReceipt = async (ride: RideHistoryItem) => {
    try {
      await Share.share({
        message: `EVegah Ride Receipt\nBooking ID: ${ride.bookingId}\nVehicle: ${ride.vehicleModel}\nDistance: ${ride.distanceKm} km\nTotal Fare: ₹${ride.totalCost}\nCO2 Saved: ${ride.co2SavedKg} kg`,
      });
    } catch {}
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.cardBorder }]}>
        {onBack && (
          <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
            <Icons.ChevronLeft size={22} color={colors.text} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Rides</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['All', 'Completed', 'Cancelled'] as const).map((tab) => {
          const isSelected = filter === tab;
          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.8}
              onPress={() => setFilter(tab)}
              style={[
                styles.tabBtn,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Rides List */}
      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        {filteredRides.length === 0 ? (
          <View style={styles.emptyState}>
            <Icons.Scooter size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No rides found in this category
            </Text>
          </View>
        ) : (
          filteredRides.map((ride) => (
            <TouchableOpacity
              key={ride.id}
              activeOpacity={0.85}
              onPress={() => setSelectedRide(ride)}
              style={[
                styles.rideCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <View style={styles.cardTop}>
                <View style={styles.vehicleInfo}>
                  <Text style={[styles.vehicleModel, { color: colors.text }]}>
                    {ride.vehicleModel}
                  </Text>
                  <Text style={[styles.dateText, { color: colors.textMuted }]}>
                    {ride.date} • {ride.bookingId}
                  </Text>
                </View>

                <View style={styles.fareBox}>
                  <Text style={[styles.fareText, { color: colors.primary }]}>
                    ₹{ride.totalCost.toFixed(2)}
                  </Text>
                  <Badge label="COMPLETED" variant="success" style={{ marginTop: 2 }} />
                </View>
              </View>

              <View style={[styles.cardDivider, { backgroundColor: colors.divider }]} />

              <View style={styles.cardBottom}>
                <View style={styles.metric}>
                  <Icons.Clock size={14} color={colors.textMuted} />
                  <Text style={[styles.metricText, { color: colors.textSecondary }]}>
                    {ride.durationMinutes} mins
                  </Text>
                </View>

                <View style={styles.metric}>
                  <Icons.Scooter size={14} color={colors.textMuted} />
                  <Text style={[styles.metricText, { color: colors.textSecondary }]}>
                    {ride.distanceKm} km
                  </Text>
                </View>

                <View style={styles.metric}>
                  <Icons.Leaf size={14} color="#10B981" />
                  <Text style={[styles.metricText, { color: '#10B981' }]}>
                    {ride.co2SavedKg} kg CO₂
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Ride Detail Modal */}
      <Modal visible={!!selectedRide} animationType="slide" transparent onRequestClose={() => setSelectedRide(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            {selectedRide && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Trip Receipt</Text>
                    <Text style={[styles.modalBooking, { color: colors.textMuted }]}>
                      {selectedRide.bookingId}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setSelectedRide(null)}
                    style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}
                  >
                    <Icons.Close size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>

                {/* Amount Paid */}
                <View style={styles.receiptTotalRow}>
                  <Text style={[styles.receiptAmount, { color: colors.primary }]}>
                    ₹{selectedRide.totalCost.toFixed(2)}
                  </Text>
                  <Text style={[styles.receiptMethod, { color: colors.textSecondary }]}>
                    Paid via Evegah Wallet
                  </Text>
                </View>

                {/* Detailed Breakdown */}
                <View style={[styles.receiptBox, { borderColor: colors.cardBorder }]}>
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptKey, { color: colors.textSecondary }]}>Vehicle</Text>
                    <Text style={[styles.receiptVal, { color: colors.text }]}>{selectedRide.vehicleModel} ({selectedRide.vehicleId})</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptKey, { color: colors.textSecondary }]}>Pickup Hub</Text>
                    <Text style={[styles.receiptVal, { color: colors.text }]}>{selectedRide.startZone}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptKey, { color: colors.textSecondary }]}>Drop-off Hub</Text>
                    <Text style={[styles.receiptVal, { color: colors.text }]}>{selectedRide.endZone}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptKey, { color: colors.textSecondary }]}>Distance</Text>
                    <Text style={[styles.receiptVal, { color: colors.text }]}>{selectedRide.distanceKm} km</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptKey, { color: colors.textSecondary }]}>Duration</Text>
                    <Text style={[styles.receiptVal, { color: colors.text }]}>{selectedRide.durationMinutes} mins</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptKey, { color: colors.textSecondary }]}>Clean Impact</Text>
                    <Text style={[styles.receiptVal, { color: '#10B981' }]}>{selectedRide.co2SavedKg} kg CO₂ offset</Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.receiptActions}>
                  <Button
                    title="Share Receipt"
                    variant="outline"
                    onPress={() => handleShareReceipt(selectedRide)}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Done"
                    variant="primary"
                    onPress={() => setSelectedRide(null)}
                    style={{ flex: 1 }}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 90,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rideCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: 16,
    fontWeight: '800',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3,
  },
  fareBox: {
    alignItems: 'flex-end',
  },
  fareText: {
    fontSize: 18,
    fontWeight: '800',
  },
  cardDivider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalBooking: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptTotalRow: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  receiptAmount: {
    fontSize: 36,
    fontWeight: '900',
  },
  receiptMethod: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  receiptBox: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: 10,
    marginBottom: Spacing.lg,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptKey: {
    fontSize: 13,
    fontWeight: '500',
  },
  receiptVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  receiptActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
