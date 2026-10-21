import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Icons } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { BorderRadius, Spacing } from '../constants/theme';

interface OffersScreenProps {
  onBack?: () => void;
}

export const OffersScreen: React.FC<OffersScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const referralCode = 'EV-HIMANSHU-100';

  const coupons = [
    {
      code: 'EVEGAH50',
      title: 'Flat 50% Off First 5 Rides',
      desc: 'Valid on Evegah City and Evegah Pro models. Max discount ₹50 per trip.',
      discount: '50% OFF',
      validTill: '31 Oct 2026',
    },
    {
      code: 'GREENRIDER',
      title: '₹100 Free Wallet Credit',
      desc: 'Top up ₹500 or more in wallet to unlock instant ₹100 green cash bonus.',
      discount: '₹100 BONUS',
      validTill: '15 Nov 2026',
    },
    {
      code: 'FIRSTFREE',
      title: '15-Minute Free Test Ride',
      desc: 'Experience the silent electric throttle with zero fee for your first 15 mins.',
      discount: 'FREE RIDE',
      validTill: 'No expiry',
    },
  ];

  const handleCopy = (code: string) => {
    setCopiedCode(code);
    Alert.alert('Code Applied', `Promo voucher "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleShareReferral = async () => {
    try {
      await Share.share({
        message: `Join me on Evegah EV! Use my invite code "${referralCode}" to get ₹100 free ride credits. Download the Evegah Rider app: https://evegah.com/download`,
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Offers & Referrals</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Refer & Earn Banner Card */}
        <View style={styles.referCard}>
          <View style={styles.referBadge}>
            <Icons.Gift size={16} color="#0F172A" />
            <Text style={styles.referBadgeText}>REFER & EARN ₹100</Text>
          </View>

          <Text style={styles.referTitle}>Share Electric Rides With Friends</Text>
          <Text style={styles.referSub}>
            Both you and your friend get ₹100 wallet credits when they complete their first EV trip.
          </Text>

          {/* Referral Code Box */}
          <View style={styles.codeBox}>
            <Text style={styles.referralCodeText}>{referralCode}</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={handleShareReferral} style={styles.shareBtn}>
              <Icons.Zap size={14} color="#0F172A" />
              <Text style={styles.shareBtnText}>Share Link</Text>
            </TouchableOpacity>
          </View>

          {/* 3 Step Milestone */}
          <View style={styles.stepsRow}>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Invite friend with code</Text>
            </View>
            <View style={styles.stepDivider} />
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>They take their 1st ride</Text>
            </View>
            <View style={styles.stepDivider} />
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>You both get ₹100</Text>
            </View>
          </View>
        </View>

        {/* Active Promo Vouchers */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Coupons & Vouchers</Text>
        <View style={styles.couponsList}>
          {coupons.map((c) => (
            <View
              key={c.code}
              style={[styles.couponCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={styles.couponTop}>
                <View style={styles.couponLeft}>
                  <Badge label={c.discount} variant="neon" />
                  <Text style={[styles.couponTitle, { color: colors.text }]}>{c.title}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleCopy(c.code)}
                  style={[
                    styles.copyBtn,
                    {
                      backgroundColor: copiedCode === c.code ? colors.primary : colors.surfaceSubtle,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.copyBtnText,
                      { color: copiedCode === c.code ? '#FFFFFF' : colors.primary },
                    ]}
                  >
                    {copiedCode === c.code ? 'APPLIED ✓' : 'APPLY CODE'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.couponDesc, { color: colors.textSecondary }]}>{c.desc}</Text>

              <View style={[styles.couponDivider, { backgroundColor: colors.divider }]} />

              <View style={styles.couponBottom}>
                <Text style={[styles.codePill, { color: colors.primary }]}>{c.code}</Text>
                <Text style={[styles.validTill, { color: colors.textMuted }]}>Valid till {c.validTill}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 90,
  },
  referCard: {
    backgroundColor: '#042A14',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1.5,
    borderColor: '#095D2D',
    marginBottom: Spacing.xl,
  },
  referBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D7FF00',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  referBadgeText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '800',
  },
  referTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  referSub: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  codeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  referralCodeText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D7FF00',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  shareBtnText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  stepText: {
    color: '#94A3B8',
    fontSize: 9.5,
    textAlign: 'center',
    fontWeight: '500',
  },
  stepDivider: {
    width: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },
  couponsList: {
    gap: 12,
  },
  couponCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  couponTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  couponLeft: {
    flex: 1,
    gap: 6,
  },
  couponTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  copyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  couponDesc: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },
  couponDivider: {
    height: 1,
    marginVertical: 10,
  },
  couponBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codePill: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  validTill: {
    fontSize: 11,
    fontWeight: '500',
  },
});
