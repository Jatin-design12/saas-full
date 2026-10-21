import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { EVModelDetail } from '../../services/vehicleService';
import { Badge } from '../common/Badge';
import { Icons } from '../common/Icons';
import { BorderRadius, Spacing } from '../../constants/theme';

interface FleetCardProps {
  model: EVModelDetail;
  onPressDetails: () => void;
  onPressBook: () => void;
}

export const FleetCard: React.FC<FleetCardProps> = ({
  model,
  onPressDetails,
  onPressBook,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      {/* Header Info */}
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: colors.text }]}>{model.name}</Text>
            <Badge label={model.category} variant="neon" />
          </View>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>{model.tagline}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.priceAmount, { color: colors.primary }]}>₹{model.ratePerHour}</Text>
          <Text style={[styles.priceUnit, { color: colors.textMuted }]}>/30 mins</Text>
        </View>
      </View>

      {/* Vehicle Image */}
      <TouchableOpacity activeOpacity={0.9} onPress={onPressDetails} style={styles.imageContainer}>
        <Image
          source={
            model.name.includes('City')
              ? require('../../../assets/city.png')
              : model.name.includes('Pro')
              ? require('../../../assets/pro-1.png')
              : model.name.includes('Mink')
              ? require('../../../assets/mink.png')
              : require('../../../assets/Fly.png')
          }
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Spec Pills */}
      <View style={[styles.specsRow, { backgroundColor: colors.surfaceSubtle }]}>
        <View style={styles.specItem}>
          <Icons.Battery size={14} color={colors.primary} />
          <Text style={[styles.specText, { color: colors.text }]}>{model.rangeKm}</Text>
        </View>

        <View style={[styles.specDivider, { backgroundColor: colors.divider }]} />

        <View style={styles.specItem}>
          <Icons.Speedometer size={14} color={colors.primary} />
          <Text style={[styles.specText, { color: colors.text }]}>{model.speedKmH}</Text>
        </View>

        <View style={[styles.specDivider, { backgroundColor: colors.divider }]} />

        <View style={styles.specItem}>
          <Icons.User size={14} color={colors.primary} />
          <Text style={[styles.specText, { color: colors.text }]}>{model.capacity}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressDetails}
          style={[styles.detailsBtn, { borderColor: colors.cardBorder }]}
        >
          <Text style={[styles.detailsBtnText, { color: colors.text }]}>Tech Specs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressBook}
          style={[styles.bookBtn, { backgroundColor: colors.primary }]}
        >
          <Icons.Zap size={16} color="#FFFFFF" />
          <Text style={styles.bookBtnText}>Ride Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    marginHorizontal: Spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: '800',
  },
  priceUnit: {
    fontSize: 10,
    fontWeight: '600',
  },
  imageContainer: {
    height: 140,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.sm,
  },
  image: {
    width: '85%',
    height: '100%',
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specText: {
    fontSize: 12,
    fontWeight: '700',
  },
  specDivider: {
    width: 1,
    height: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  detailsBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bookBtn: {
    flex: 1.4,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
