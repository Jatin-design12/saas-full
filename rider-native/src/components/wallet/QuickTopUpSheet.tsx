import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useWallet } from '../../context/WalletContext';
import { Icons } from '../common/Icons';
import { Button } from '../common/Button';
import { BorderRadius, Spacing } from '../../constants/theme';

interface QuickTopUpSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const PRESET_AMOUNTS = [100, 250, 500, 1000];

export const QuickTopUpSheet: React.FC<QuickTopUpSheetProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { colors } = useTheme();
  const { addMoney } = useWallet();
  const [selectedAmount, setSelectedAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [method, setMethod] = useState<'UPI' | 'Razorpay' | 'PayU'>('UPI');
  const [loading, setLoading] = useState(false);

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handlePay = async () => {
    if (effectiveAmount < 10) return;
    setLoading(true);
    try {
      const res = await addMoney(effectiveAmount, method);
      if (res.success) {
        onSuccess(effectiveAmount);
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Top Up Evegah Wallet</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Instant auto-recharge for seamless riding
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}
            >
              <Icons.Close size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Amount Chips */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Select Amount</Text>
          <View style={styles.chipsRow}>
            {PRESET_AMOUNTS.map((amt) => {
              const isSelected = !customAmount && selectedAmount === amt;
              return (
                <TouchableOpacity
                  key={amt}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                      borderColor: isSelected ? colors.primary : colors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: isSelected ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    +₹{amt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Input */}
          <View style={[styles.inputBox, { borderColor: colors.cardBorder, backgroundColor: colors.surfaceSubtle }]}>
            <Text style={[styles.inputCurrency, { color: colors.text }]}>₹</Text>
            <TextInput
              placeholder="Or enter custom amount"
              placeholderTextColor={colors.textMuted}
              value={customAmount}
              onChangeText={setCustomAmount}
              keyboardType="numeric"
              style={[styles.input, { color: colors.text }]}
            />
          </View>

          {/* Payment Method Selector */}
          <Text style={[styles.sectionLabel, { color: colors.text, marginTop: Spacing.md }]}>Payment Gateway</Text>
          <View style={styles.methodsRow}>
            {/* ICICI UPI */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setMethod('UPI')}
              style={[
                styles.methodCard,
                {
                  backgroundColor: method === 'UPI' ? '#042A14' : colors.surfaceSubtle,
                  borderColor: method === 'UPI' ? colors.neon : colors.cardBorder,
                },
              ]}
            >
              <Icons.Zap size={20} color={method === 'UPI' ? colors.neon : colors.primary} />
              <Text style={[styles.methodTitle, { color: method === 'UPI' ? '#FFFFFF' : colors.text }]}>
                ICICI UPI
              </Text>
              <Text style={[styles.methodSub, { color: method === 'UPI' ? '#A7F3D0' : colors.textSecondary }]}>
                Zero fee • Fast
              </Text>
            </TouchableOpacity>

            {/* Razorpay */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setMethod('Razorpay')}
              style={[
                styles.methodCard,
                {
                  backgroundColor: method === 'Razorpay' ? '#042A14' : colors.surfaceSubtle,
                  borderColor: method === 'Razorpay' ? colors.neon : colors.cardBorder,
                },
              ]}
            >
              <Icons.CreditCard size={20} color={method === 'Razorpay' ? colors.neon : colors.primary} />
              <Text style={[styles.methodTitle, { color: method === 'Razorpay' ? '#FFFFFF' : colors.text }]}>
                Cards / NetBanking
              </Text>
              <Text style={[styles.methodSub, { color: method === 'Razorpay' ? '#A7F3D0' : colors.textSecondary }]}>
                Razorpay
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Button */}
          <View style={styles.actionSection}>
            <Button
              title={`Proceed to Pay ₹${effectiveAmount.toFixed(2)}`}
              onPress={handlePay}
              loading={loading}
              disabled={effectiveAmount <= 0}
              variant="primary"
              size="lg"
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
    padding: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
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
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  chip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    marginBottom: Spacing.md,
  },
  inputCurrency: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  methodsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  methodCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  methodSub: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  actionSection: {
    marginTop: Spacing.sm,
  },
});
