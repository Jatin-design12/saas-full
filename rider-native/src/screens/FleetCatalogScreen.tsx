import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { VehicleService, EVModelDetail } from '../services/vehicleService';
import { FleetCard } from '../components/dashboard/FleetCard';
import { VehicleDetailModal } from '../components/dashboard/VehicleDetailModal';
import { Icons } from '../components/common/Icons';
import { BorderRadius, Spacing } from '../constants/theme';

interface FleetCatalogScreenProps {
  onBack?: () => void;
  onBookModel: (model: EVModelDetail) => void;
}

export const FleetCatalogScreen: React.FC<FleetCatalogScreenProps> = ({
  onBack,
  onBookModel,
}) => {
  const { colors } = useTheme();
  const fleet = VehicleService.getFleetModels();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedModel, setSelectedModel] = useState<EVModelDetail | null>(null);

  const categories = ['All', 'E-Vehicle', 'E-Scooter', 'E-Bike', 'Utility EV'];
  const filtered = selectedCategory === 'All' ? fleet : fleet.filter((f) => f.category === selectedCategory);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.cardBorder }]}>
        {onBack && (
          <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
            <Icons.ChevronLeft size={22} color={colors.text} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]}>Evegah EV Fleet</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {categories.map((c) => {
            const isSelected = selectedCategory === c;
            return (
              <TouchableOpacity
                key={c}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(c)}
                style={[
                  styles.tabChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.tabText, { color: isSelected ? '#FFFFFF' : colors.textSecondary }]}>
                  {c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Fleet Cards List */}
      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        {filtered.map((model) => (
          <FleetCard
            key={model.id}
            model={model}
            onPressDetails={() => setSelectedModel(model)}
            onPressBook={() => onBookModel(model)}
          />
        ))}
      </ScrollView>

      {/* Specs Modal */}
      <VehicleDetailModal
        visible={!!selectedModel}
        model={selectedModel}
        onClose={() => setSelectedModel(null)}
        onSelectRide={(m) => {
          setSelectedModel(null);
          onBookModel(m);
        }}
      />
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
  tabsRow: {
    paddingVertical: Spacing.md,
  },
  tabsScroll: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollList: {
    paddingBottom: 90,
  },
});
