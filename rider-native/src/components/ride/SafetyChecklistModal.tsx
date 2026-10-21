import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../common/Icons';
import { Button } from '../common/Button';
import { BorderRadius, Spacing } from '../../constants/theme';

interface SafetyChecklistModalProps {
  visible: boolean;
  vehicleName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SafetyChecklistModal: React.FC<SafetyChecklistModalProps> = ({
  visible,
  vehicleName,
  onConfirm,
  onCancel,
}) => {
  const { colors } = useTheme();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
  });

  const checklist = [
    { title: 'Wear Your Helmet', desc: 'Ensure helmet strap is properly clicked and fitted.' },
    { title: 'Check Hand Brakes', desc: 'Squeeze both front and rear brake levers before moving.' },
    { title: 'Retract Kickstand', desc: 'Kickstand sensor must be up for electric motor throttle.' },
    { title: 'Follow Traffic Rules', desc: 'Ride in cycle/scooter lanes and obey all signals.' },
  ];

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const allChecked = checklist.every((_, i) => !!checkedItems[i]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <View style={[styles.shieldBadge, { backgroundColor: '#DCFCE7' }]}>
              <Icons.Shield size={24} color="#15803D" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Pre-Ride Safety Check</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Quick safety verification before unlocking {vehicleName}
            </Text>
          </View>

          <View style={styles.itemsList}>
            {checklist.map((item, idx) => {
              const isChecked = !!checkedItems[idx];
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  onPress={() => toggleCheck(idx)}
                  style={[
                    styles.checkRow,
                    {
                      backgroundColor: isChecked ? colors.surfaceSubtle : colors.card,
                      borderColor: isChecked ? colors.primary : colors.cardBorder,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: isChecked ? colors.primary : 'transparent',
                        borderColor: isChecked ? colors.primary : colors.divider,
                      },
                    ]}
                  >
                    {isChecked && <Icons.Check size={14} color="#FFFFFF" />}
                  </View>

                  <View style={styles.itemText}>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footer}>
            <Button
              title="I'm Ready - Unlock Vehicle"
              variant="primary"
              size="lg"
              disabled={!allChecked}
              onPress={onConfirm}
              icon={<Icons.Unlock size={18} color="#FFFFFF" />}
            />

            <TouchableOpacity activeOpacity={0.7} onPress={onCancel} style={styles.cancelBtn}>
              <Text style={[styles.cancelText, { color: colors.textMuted }]}>Cancel Ride</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  shieldBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 4,
  },
  itemsList: {
    gap: 10,
    marginBottom: Spacing.xl,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemDesc: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 2,
  },
  footer: {
    gap: 10,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
