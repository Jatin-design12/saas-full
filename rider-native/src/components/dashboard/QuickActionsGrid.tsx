import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../common/Icons';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: (color: string) => React.ReactNode;
  isSpecial?: boolean;
}

interface QuickActionsGridProps {
  onActionPress: (actionId: string) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onActionPress }) => {
  const { colors } = useTheme();

  const actions: QuickActionItem[] = [
    {
      id: 'scan_qr',
      title: 'Scan to Ride',
      subtitle: 'Instant Unlock',
      isSpecial: true,
      icon: (c) => <Icons.QrCode size={22} color={c} />,
    },
    {
      id: 'rent_ev',
      title: 'Rent EV Fleet',
      subtitle: 'Hourly & Daily',
      icon: (c) => <Icons.Scooter size={22} color={c} />,
    },
    {
      id: 'live_zones',
      title: 'Live Zones',
      subtitle: 'Nearby Stations',
      icon: (c) => <Icons.MapPin size={22} color={c} />,
    },
    {
      id: 'smart_bms',
      title: 'Smart BMS',
      subtitle: 'Battery Health',
      icon: (c) => <Icons.Cpu size={22} color={c} />,
    },
    {
      id: 'wallet',
      title: 'My Wallet',
      subtitle: 'Top-Up & Offers',
      icon: (c) => <Icons.Wallet size={22} color={c} />,
    },
    {
      id: 'support',
      title: 'Roadside Help',
      subtitle: '24/7 Support',
      icon: (c) => <Icons.Shield size={22} color={c} />,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((act) => (
          <TouchableOpacity
            key={act.id}
            activeOpacity={0.8}
            onPress={() => onActionPress(act.id)}
            style={[
              styles.tile,
              {
                backgroundColor: act.isSpecial ? '#042A14' : colors.card,
                borderColor: act.isSpecial ? colors.neon : colors.cardBorder,
              },
            ]}
          >
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: act.isSpecial ? colors.neon : colors.surfaceSubtle,
                },
              ]}
            >
              {act.icon(act.isSpecial ? '#0F172A' : colors.primary)}
            </View>

            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.tileTitle,
                  { color: act.isSpecial ? '#FFFFFF' : colors.text },
                ]}
                numberOfLines={1}
              >
                {act.title}
              </Text>
              <Text
                style={[
                  styles.tileSubtitle,
                  { color: act.isSpecial ? 'rgba(255, 255, 255, 0.7)' : colors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {act.subtitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: Spacing.md,
    letterSpacing: -0.2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  tile: {
    width: '47.5%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 68,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  tileTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  tileSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});
