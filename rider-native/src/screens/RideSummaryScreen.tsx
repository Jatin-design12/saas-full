import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useRide } from '../context/RideContext';
import { RideHistoryItem } from '../services/rideService';
import { Icons } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { BorderRadius, Spacing } from '../constants/theme';

interface RideSummaryScreenProps {
  receipt: RideHistoryItem;
  onDone: () => void;
}

const FEEDBACK_TAGS = [
  'Smooth Acceleration',
  'Responsive Brakes',
  'Clean Vehicle',
  'Great Battery Life',
  'Easy to Park',
  'Suspension Comfort',
];

export const RideSummaryScreen: React.FC<RideSummaryScreenProps> = ({
  receipt,
  onDone,
}) => {
  const { colors } = useTheme();
  const { submitFeedback } = useRide();

  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Smooth Acceleration', 'Clean Vehicle']);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    await submitFeedback(receipt.bookingId, rating, `${selectedTags.join(', ')} - ${comment}`);
    setSubmitted(true);
    setTimeout(() => {
      onDone();
    }, 1200);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Header Badge */}
        <View style={styles.header}>
          <View style={[styles.checkCircle, { backgroundColor: '#DCFCE7' }]}>
            <Icons.Check size={36} color="#15803D" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Ride Completed!</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Vehicle parked & safely locked at {receipt.endZone}
          </Text>
        </View>

        {/* Fare Receipt Card */}
        <View style={[styles.receiptCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <View style={styles.bookingRow}>
            <Text style={[styles.bookingId, { color: colors.textMuted }]}>
              BOOKING: {receipt.bookingId}
            </Text>
            <Badge label="PAID VIA WALLET" variant="success" />
          </View>

          <View style={styles.fareAmountRow}>
            <Text style={[styles.currency, { color: colors.primary }]}>₹</Text>
            <Text style={[styles.totalAmount, { color: colors.text }]}>
              {receipt.totalCost.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* Trip Metrics Breakdown */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCol}>
              <Icons.Clock size={16} color={colors.primary} />
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>DURATION</Text>
              <Text style={[styles.metricVal, { color: colors.text }]}>{receipt.durationMinutes} mins</Text>
            </View>

            <View style={styles.metricCol}>
              <Icons.Scooter size={16} color={colors.primary} />
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>DISTANCE</Text>
              <Text style={[styles.metricVal, { color: colors.text }]}>{receipt.distanceKm} km</Text>
            </View>

            <View style={styles.metricCol}>
              <Icons.Leaf size={16} color="#10B981" />
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>CO₂ SAVED</Text>
              <Text style={[styles.metricVal, { color: '#10B981' }]}>{receipt.co2SavedKg} kg</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.vehicleRow}>
            <Text style={[styles.vehicleModelLabel, { color: colors.textSecondary }]}>Vehicle</Text>
            <Text style={[styles.vehicleModelName, { color: colors.text }]}>
              {receipt.vehicleModel} ({receipt.vehicleId})
            </Text>
          </View>
        </View>

        {/* Rating & Feedback Section */}
        <View style={[styles.feedbackCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <Text style={[styles.feedbackTitle, { color: colors.text }]}>How was your ride experience?</Text>

          {/* Star Rating */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                activeOpacity={0.7}
                onPress={() => setRating(star)}
                style={styles.starBtn}
              >
                <Icons.Star
                  size={36}
                  color={star <= rating ? '#F59E0B' : colors.divider}
                  fill={star <= rating ? '#F59E0B' : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Tag Chips */}
          <Text style={[styles.tagsHeading, { color: colors.textSecondary }]}>What did you like?</Text>
          <View style={styles.tagsContainer}>
            {FEEDBACK_TAGS.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  activeOpacity={0.8}
                  onPress={() => toggleTag(tag)}
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: selected ? colors.surfaceSubtle : colors.card,
                      borderColor: selected ? colors.primary : colors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: selected ? colors.primary : colors.textSecondary },
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Comment Input */}
          <TextInput
            placeholder="Add an optional comment..."
            placeholderTextColor={colors.textMuted}
            value={comment}
            onChangeText={setComment}
            style={[styles.commentInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.surfaceSubtle }]}
          />

          <Button
            title={submitted ? 'Feedback Submitted ✓' : 'Submit & Return Home'}
            variant="primary"
            size="lg"
            onPress={handleSubmit}
            style={{ marginTop: Spacing.md }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 54,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
  },
  receiptCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingId: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  fareAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: Spacing.md,
  },
  currency: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 4,
  },
  totalAmount: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCol: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleModelLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  vehicleModelName: {
    fontSize: 14,
    fontWeight: '700',
  },
  feedbackCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: Spacing.md,
  },
  starBtn: {
    padding: 4,
  },
  tagsHeading: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.md,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 13,
    height: 48,
  },
});
