import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { EVModelDetail } from '../../services/vehicleService';
import { Icons } from '../common/Icons';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { BorderRadius, Spacing } from '../../constants/theme';

interface VehicleDetailModalProps {
  visible: boolean;
  model: EVModelDetail | null;
  onClose: () => void;
  onSelectRide: (model: EVModelDetail) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  visible,
  model,
  onClose,
  onSelectRide,
}) => {
  const { colors } = useTheme();
  const [selectedAngleIndex, setSelectedAngleIndex] = useState(0);

  if (!model) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.titleRow}>
                <Text style={[styles.title, { color: colors.text }]}>{model.name}</Text>
                <Badge label={model.category} variant="neon" />
              </View>
              <Text style={[styles.tagline, { color: colors.textSecondary }]}>{model.tagline}</Text>
            </View>

            <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}>
              <Icons.Close size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Image Preview */}
            <View style={[styles.imageCard, { backgroundColor: colors.surfaceSubtle }]}>
              <Image
                source={
                  model.name.includes('City')
                    ? selectedAngleIndex === 0
                      ? require('../../../assets/city.png')
                      : selectedAngleIndex === 1
                      ? require('../../../assets/City-1.png')
                      : require('../../../assets/city-white.png')
                    : model.name.includes('Pro')
                    ? selectedAngleIndex === 0
                      ? require('../../../assets/pro-1.png')
                      : require('../../../assets/evegah_vb_pro.png')
                    : model.name.includes('Mink')
                    ? require('../../../assets/mink.png')
                    : require('../../../assets/Fly.png')
                }
                style={styles.image}
                resizeMode="contain"
              />

              {/* Angle Switcher */}
              <View style={styles.angleRow}>
                {model.images.map((_, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    onPress={() => setSelectedAngleIndex(idx)}
                    style={[
                      styles.angleChip,
                      {
                        backgroundColor: selectedAngleIndex === idx ? colors.primary : colors.card,
                        borderColor: colors.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.angleText,
                        { color: selectedAngleIndex === idx ? '#FFFFFF' : colors.textSecondary },
                      ]}
                    >
                      View {idx + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Technical Specifications Table */}
            <Text style={[styles.sectionHeading, { color: colors.text }]}>Technical Specifications</Text>
            <View style={[styles.specTable, { borderColor: colors.cardBorder }]}>
              <View style={[styles.specTableRow, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.specKey, { color: colors.textMuted }]}>Range Per Charge</Text>
                <Text style={[styles.specVal, { color: colors.text }]}>{model.rangeKm}</Text>
              </View>
              <View style={[styles.specTableRow, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.specKey, { color: colors.textMuted }]}>Top Speed</Text>
                <Text style={[styles.specVal, { color: colors.text }]}>{model.speedKmH}</Text>
              </View>
              <View style={[styles.specTableRow, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.specKey, { color: colors.textMuted }]}>Motor Power</Text>
                <Text style={[styles.specVal, { color: colors.text }]}>{model.motorPower}</Text>
              </View>
              <View style={[styles.specTableRow, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.specKey, { color: colors.textMuted }]}>Battery Capacity</Text>
                <Text style={[styles.specVal, { color: colors.text }]}>{model.batteryCapacity}</Text>
              </View>
              <View style={[styles.specTableRow, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.specKey, { color: colors.textMuted }]}>Charging Time</Text>
                <Text style={[styles.specVal, { color: colors.text }]}>{model.chargingTime}</Text>
              </View>
              <View style={styles.specTableRow}>
                <Text style={[styles.specKey, { color: colors.textMuted }]}>Seating Capacity</Text>
                <Text style={[styles.specVal, { color: colors.text }]}>{model.capacity}</Text>
              </View>
            </View>

            {/* Key Smart Features */}
            <Text style={[styles.sectionHeading, { color: colors.text }]}>Smart IoT Features</Text>
            <View style={styles.featuresList}>
              {model.features.map((feat, i) => (
                <View key={i} style={styles.featureItem}>
                  <View style={[styles.checkCircle, { backgroundColor: '#DCFCE7' }]}>
                    <Icons.Check size={14} color="#15803D" />
                  </View>
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>{feat}</Text>
                </View>
              ))}
            </View>

            {/* Pricing Details */}
            <View style={[styles.pricingBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}>
              <View>
                <Text style={[styles.pricingTitle, { color: colors.text }]}>Fare Structure</Text>
                <Text style={[styles.pricingSubtitle, { color: colors.textSecondary }]}>
                  Includes full battery charge & safety insurance
                </Text>
              </View>
              <View style={styles.pricingValues}>
                <Text style={[styles.rateHighlight, { color: colors.primary }]}>₹{model.ratePerHour}</Text>
                <Text style={[styles.rateSub, { color: colors.textMuted }]}>first 30 mins, then ₹{model.ratePerMinAfter}/min</Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Action */}
          <View style={[styles.footer, { borderTopColor: colors.cardBorder }]}>
            <Button
              title="Unlock & Ride This Vehicle"
              variant="primary"
              size="lg"
              icon={<Icons.Zap size={20} color="#FFFFFF" />}
              onPress={() => {
                onClose();
                onSelectRide(model);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    minHeight: '75%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  imageCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  image: {
    width: '90%',
    height: 160,
  },
  angleRow: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    bottom: 12,
  },
  angleChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  angleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  specTable: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  specTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  specKey: {
    fontSize: 13,
    fontWeight: '500',
  },
  specVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  featuresList: {
    gap: 10,
    marginBottom: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  pricingBox: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.md,
  },
  pricingTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  pricingSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  pricingValues: {
    marginTop: 8,
  },
  rateHighlight: {
    fontSize: 20,
    fontWeight: '800',
  },
  rateSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
});
