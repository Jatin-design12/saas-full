import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { WalletTransaction } from '../../services/walletService';
import { Icons } from '../common/Icons';
import { BorderRadius, Spacing } from '../../constants/theme';

interface TransactionItemProps {
  transaction: WalletTransaction;
  onPressReceipt?: (tx: WalletTransaction) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPressReceipt,
}) => {
  const { colors } = useTheme();
  const isCredit = transaction.type === 'credit';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPressReceipt?.(transaction)}
      style={[styles.itemContainer, { borderBottomColor: colors.divider }]}
    >
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: isCredit ? '#DCFCE7' : '#FEE2E2',
          },
        ]}
      >
        {isCredit ? (
          <Icons.Zap size={18} color="#15803D" />
        ) : (
          <Icons.Scooter size={18} color="#B91C1C" />
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {transaction.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
          {transaction.subtitle} • {transaction.createdAt}
        </Text>
      </View>

      <View style={styles.amountBox}>
        <Text
          style={[
            styles.amountText,
            { color: isCredit ? '#15803D' : colors.text },
          ]}
        >
          {isCredit ? '+' : '-'}₹{transaction.amount.toFixed(2)}
        </Text>
        <Text style={[styles.statusText, { color: colors.textMuted }]}>
          {transaction.paymentMethod}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 2,
  },
  amountBox: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
