import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Icons } from '../components/common/Icons';
import { BorderRadius, Spacing } from '../constants/theme';

interface OtpScreenProps {
  mobile: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const OtpScreen: React.FC<OtpScreenProps> = ({
  mobile,
  onSuccess,
  onBack,
}) => {
  const { colors } = useTheme();
  const { verifyOtp, sendOtp } = useAuth();
  const [otp, setOtp] = useState(['1', '2', '3', '4']); // Pre-filled for demo convenience
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    const fullCode = otp.join('');
    if (fullCode.length !== 4) {
      setError('Please enter complete 4-digit OTP');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await verifyOtp(mobile, fullCode);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Verification failed. Try 1234.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setTimer(30);
    await sendOtp(mobile);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        {/* Top Back Button */}
        <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={[styles.backBtn, { backgroundColor: colors.surfaceSubtle }]}>
          <Icons.ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Verify Mobile</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            We've sent a 4-digit verification code to
          </Text>
          <Text style={[styles.mobileHighlight, { color: colors.primary }]}>+91 {mobile}</Text>
        </View>

        {/* 4 Digit Boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.otpBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: digit ? colors.primary : colors.cardBorder,
                },
              ]}
            >
              <Text style={[styles.otpDigit, { color: colors.text }]}>{digit}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.hintCard, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}>
          <Icons.Zap size={16} color={colors.primary} />
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            Demo Mode: Pre-filled code is <Text style={{ fontWeight: '800', color: colors.primary }}>1234</Text>
          </Text>
        </View>

        {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}

        {/* Resend Timer */}
        <View style={styles.resendRow}>
          <Text style={[styles.resendLabel, { color: colors.textSecondary }]}>
            Didn't receive the code?
          </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={handleResend} disabled={timer > 0}>
            <Text style={[styles.resendAction, { color: timer > 0 ? colors.textMuted : colors.primary }]}>
              {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Verify CTA */}
        <Button
          title="Verify & Enter Cockpit"
          variant="primary"
          size="lg"
          loading={loading}
          onPress={handleVerify}
          icon={<Icons.Check size={20} color="#FFFFFF" />}
          style={styles.verifyBtn}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 54,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 6,
  },
  mobileHighlight: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  otpBox: {
    width: 65,
    height: 65,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  otpDigit: {
    fontSize: 26,
    fontWeight: '800',
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
    marginBottom: Spacing.lg,
  },
  hintText: {
    fontSize: 13,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.xl,
  },
  resendLabel: {
    fontSize: 13,
  },
  resendAction: {
    fontSize: 13,
    fontWeight: '700',
  },
  verifyBtn: {
    marginTop: 'auto',
    marginBottom: Spacing.xl,
  },
});
