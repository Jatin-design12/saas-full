import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Icons } from '../components/common/Icons';
import { Button } from '../components/common/Button';
import { BorderRadius, Spacing } from '../constants/theme';

interface SupportScreenProps {
  onBack?: () => void;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [issueText, setIssueText] = useState('');

  const faqs = [
    {
      q: 'How do I start and unlock an Evegah EV?',
      a: 'Locate any Evegah vehicle at an authorized hub, tap "Scan to Ride", align the QR code on the handlebar, and complete the quick 3-second Bluetooth IoT unlock. The wheel immobilizer will automatically release.',
    },
    {
      q: 'Where can I park and end my ride?',
      a: 'Vehicles must be parked inside designated green geofenced Evegah hubs (e.g. Gotri Central Zone, Sayaji Baug). Put the kickstand down, ensure the helmet is in place, snap a quick parking photo in the app, and tap "End Ride".',
    },
    {
      q: 'What happens if battery gets low during my trip?',
      a: 'The app alerts you when battery reaches 20%. You will be guided to the nearest swap station or hub to switch vehicles at zero extra charge.',
    },
    {
      q: 'How does the refundable security deposit work?',
      a: 'The ₹250 security deposit is kept in your Evegah wallet. You can withdraw it back to your original UPI bank account anytime with a single tap in the Wallet tab.',
    },
    {
      q: 'What should I do in case of a breakdown or puncture?',
      a: 'Tap the 24/7 Roadside Assistance button below or call our emergency hotline. Our field dispatch team will arrive in 15 minutes with a replacement vehicle.',
    },
  ];

  const handleCallSupport = () => {
    Linking.openURL('tel:+918000551122');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/918000551122?text=Hello%20Evegah%20Support,%20I%20need%20assistance');
  };

  const handleSubmitIssue = () => {
    if (!issueText.trim()) return;
    Alert.alert('Ticket Created', 'Your support ticket #EVG-8912 has been logged. Our dispatch team is reviewing it.');
    setIssueText('');
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>24/7 Roadside Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Emergency Dispatch Card */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyTop}>
            <View style={styles.emergencyBadge}>
              <Icons.Shield size={16} color="#B91C1C" />
              <Text style={styles.emergencyBadgeText}>RAPID DISPATCH</Text>
            </View>
            <Text style={styles.responseTime}>~15 Mins Avg Response</Text>
          </View>

          <Text style={styles.emergencyTitle}>Immediate Assistance & Helpline</Text>
          <Text style={styles.emergencySub}>
            Facing a battery drain, puncture, or vehicle malfunction? Our roadside response team is on standby 24/7.
          </Text>

          <View style={styles.hotlineActions}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleCallSupport} style={styles.callBtn}>
              <Icons.Phone size={18} color="#0F172A" />
              <Text style={styles.callBtnText}>Call Hotline</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={handleWhatsApp} style={styles.chatBtn}>
              <Icons.Help size={18} color="#FFFFFF" />
              <Text style={styles.chatBtnText}>WhatsApp Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Accordion */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>
        <View style={styles.faqsList}>
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                onPress={() => setExpandedFaq(isExpanded ? null : idx)}
                style={[
                  styles.faqItem,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.q}</Text>
                  <Icons.ChevronRight
                    size={16}
                    color={colors.textSecondary}
                  />
                </View>

                {isExpanded && (
                  <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                    {faq.a}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Report an Issue Form */}
        <View style={[styles.reportCard, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}>
          <Text style={[styles.reportTitle, { color: colors.text }]}>Report a Specific Issue</Text>
          <Text style={[styles.reportSub, { color: colors.textSecondary }]}>
            Have feedback or an issue with a recent EV or zone station?
          </Text>

          <TextInput
            placeholder="Describe the issue (e.g. helmet missing, tire low pressure)..."
            placeholderTextColor={colors.textMuted}
            value={issueText}
            onChangeText={setIssueText}
            multiline
            numberOfLines={3}
            style={[styles.reportInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.surface }]}
          />

          <Button
            title="Submit Support Ticket"
            variant="primary"
            disabled={!issueText.trim()}
            onPress={handleSubmitIssue}
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
  emergencyCard: {
    backgroundColor: '#042A14',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1.5,
    borderColor: '#095D2D',
    marginBottom: Spacing.xl,
  },
  emergencyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  emergencyBadgeText: {
    color: '#B91C1C',
    fontSize: 10,
    fontWeight: '800',
  },
  responseTime: {
    color: '#D7FF00',
    fontSize: 11,
    fontWeight: '700',
  },
  emergencyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  emergencySub: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  hotlineActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.lg,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D7FF00',
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  callBtnText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
  },
  chatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  chatBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },
  faqsList: {
    gap: 10,
    marginBottom: Spacing.xl,
  },
  faqItem: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  reportCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    gap: 10,
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  reportSub: {
    fontSize: 12,
  },
  reportInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: 'top',
  },
});
