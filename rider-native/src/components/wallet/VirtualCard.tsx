import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../common/Icons';
import { BorderRadius, Spacing } from '../../constants/theme';

interface VirtualCardProps {
  balance: number;
  bonusBalance: number;
  userName?: string;
  onTopUpPress: () => void;
}

export const VirtualCard: React.FC<VirtualCardProps> = ({
  balance,
  bonusBalance,
  userName = 'EV Rider',
  onTopUpPress,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.cardContainer}>
      {/* Background Decor */}
      <View style={styles.cardHeader}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Icons.Zap size={16} color="#D7FF00" />
            <Text style={styles.brandName}>EVegah</Text>
          </View>
          <Text style={styles.cardType}>PASS • SMART MOBILITY</Text>
        </View>

        {/* Chip */}
        <View style={styles.chipRow}>
          <View style={styles.simChip}>
            <View style={styles.simInner} />
          </View>
          <Icons.Bluetooth size={20} color="rgba(255, 255, 255, 0.7)" />
        </View>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>TOTAL RIDER BALANCE</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.currencySymbol}>₹</Text>
          <Text style={styles.balanceAmount}>{balance.toFixed(2)}</Text>
        </View>
        {bonusBalance > 0 && (
          <View style={styles.bonusRow}>
            <Text style={styles.bonusText}>Includes ₹{bonusBalance.toFixed(0)} Cashback Bonus</Text>
          </View>
        )}
      </View>

      {/* Card Footer */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.holderLabel}>RIDER NAME</Text>
          <Text style={styles.holderName}>{userName.toUpperCase()}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onTopUpPress}
          style={[styles.topUpBtn, { backgroundColor: colors.neon }]}
        >
          <Icons.Zap size={14} color="#0F172A" />
          <Text style={styles.topUpText}>+ Add Money</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#042A14',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    minHeight: 195,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#095D2D',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  cardType: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  simChip: {
    width: 32,
    height: 24,
    backgroundColor: '#D97706',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simInner: {
    width: 24,
    height: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 2,
  },
  balanceSection: {
    marginVertical: 12,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  currencySymbol: {
    color: '#D7FF00',
    fontSize: 22,
    fontWeight: '700',
    marginRight: 4,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  bonusRow: {
    marginTop: 4,
  },
  bonusText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  holderLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  holderName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  topUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  topUpText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800',
  },
});
