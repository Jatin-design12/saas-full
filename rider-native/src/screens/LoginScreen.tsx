import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Icons } from '../components/common/Icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = Math.min(Math.max(SCREEN_HEIGHT * 0.42, 260), 380);

interface LoginScreenProps {
  onLoginSuccess?: () => void;
  onOtpRequested?: (mobile: string) => void;
  onBack?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onOtpRequested,
  onBack,
}) => {
  const { sendOtp, verifyOtp } = useAuth();

  // 1 = Phone Input (Send OTP), 2 = 6-Digit OTP Verification
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);

  const otpInputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStep, countdown]);

  const handleSendOtp = async (overrideNumber?: string) => {
    const rawNumber = overrideNumber ?? mobile;
    const clean = rawNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setError('Please enter your 10-digit mobile number');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await sendOtp(clean);
      if (res.success) {
        setCountdown(30);
        setCurrentStep(2);
        if (onOtpRequested) {
          onOtpRequested(clean);
        }
      } else {
        setError(res.message || 'Failed to send OTP');
      }
    } catch {
      setError('Unable to send OTP. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (inputCode?: string) => {
    const code = inputCode || otpDigits.join('');
    if (code.length < 4) {
      setError('Please enter the verification code');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await verifyOtp(mobile.replace(/\D/g, ''), code);
      if (res.success) {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError(res.error || 'Invalid verification code');
      }
    } catch {
      setError('Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const clean = text.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (clean.length > 1) {
      // Pasted full OTP
      const pasted = clean.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      if (newDigits.join('').length >= 4) {
        handleVerifyOtp(newDigits.join(''));
      }
      return;
    }

    newDigits[index] = clean;
    setOtpDigits(newDigits);

    if (clean && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }

    if (newDigits.join('').length === 6) {
      handleVerifyOtp(newDigits.join(''));
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleDemoLogin = () => {
    setMobile('9999999999');
    handleSendOtp('9999999999');
  };

  return (
    <View style={styles.container}>
      {/* Background Header Graphic (login_header.png) */}
      <View style={styles.headerGraphicContainer}>
        <Image
          source={require('../../assets/login_header.png')}
          style={styles.headerGraphic}
          resizeMode="cover"
        />
      </View>

      {/* Top Left Floating Circular Back Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (currentStep === 2) {
            setCurrentStep(1);
          } else if (onBack) {
            onBack();
          }
        }}
        style={styles.backButton}
      >
        <Icons.ChevronLeft size={20} color="#1E293B" />
      </TouchableOpacity>

      {/* Bottom Sheet Form */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.whiteCard}>
            {error && (
              <View style={styles.errorBanner}>
                <Icons.AlertTriangle size={15} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {currentStep === 1 ? (
              /* --- STEP 1: PHONE INPUT --- */
              <View style={styles.stepBox}>
                {/* Circular lavender badge with phone icon */}
                <View style={styles.lavenderCircleBadge}>
                  <Icons.Smartphone size={28} color="#5B21B6" />
                </View>

                <Text style={styles.stepTitle}>Verify Your Mobile Number</Text>
                <Text style={styles.stepSubtitle}>
                  Enter your mobile number to get started with clean rides
                </Text>

                {/* Phone Input Box */}
                <View style={styles.phoneInputContainer}>
                  <View style={styles.flagGroup}>
                    <Text style={styles.flagEmoji}>🇮🇳</Text>
                    <Text style={styles.countryCode}>+91</Text>
                    <Icons.ChevronDown size={16} color="#64748B" />
                  </View>

                  <View style={styles.verticalDivider} />

                  <TextInput
                    style={styles.phoneTextInput}
                    placeholder="Enter Mobile Number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={mobile}
                    onChangeText={(val) => {
                      setMobile(val);
                      if (error) setError(null);
                    }}
                  />
                </View>

                {/* Send OTP Primary Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleSendOtp()}
                  disabled={loading}
                  style={styles.primaryButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <View style={styles.btnRow}>
                      <Text style={styles.primaryBtnText}>Send OTP</Text>
                      <Icons.ArrowRight size={18} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>

                {/* Reviewer Demo Account Pill */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleDemoLogin}
                  style={styles.demoPill}
                >
                  <Text style={styles.demoPillText}>
                    Reviewer Demo: 9999999999 ⚡
                  </Text>
                </TouchableOpacity>

                {/* OR Divider */}
                <View style={styles.orDividerRow}>
                  <View style={styles.horizontalLine} />
                  <Text style={styles.orText}>or</Text>
                  <View style={styles.horizontalLine} />
                </View>

                {/* Continue with WhatsApp Outlined Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (!mobile.trim()) {
                      setError('Please enter your mobile number first');
                      return;
                    }
                    handleSendOtp();
                  }}
                  style={styles.whatsappButton}
                >
                  <View style={styles.whatsappIconCircle}>
                    <Icons.MessageSquare size={13} color="#FFFFFF" />
                  </View>
                  <Text style={styles.whatsappBtnText}>Continue with WhatsApp</Text>
                </TouchableOpacity>

                {/* Terms and Privacy Policy Note */}
                <Text style={styles.termsNote}>
                  By continuing, you agree to our Terms of Service & Privacy Policy
                </Text>
              </View>
            ) : (
              /* --- STEP 2: OTP VERIFICATION --- */
              <View style={styles.stepBox}>
                {/* Circular lavender badge with SMS icon */}
                <View style={styles.lavenderCircleBadge}>
                  <Icons.Mail size={28} color="#5B21B6" />
                </View>

                <Text style={styles.stepTitle}>Enter OTP</Text>
                <Text style={styles.stepSubtitle}>
                  We have sent a 6-digit verification code to
                </Text>

                {/* Phone Pill Card with Change button */}
                <View style={styles.phonePillCard}>
                  <Icons.Smartphone size={14} color="#64748B" />
                  <Text style={styles.phonePillNumber}>+91 {mobile}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentStep(1);
                      setOtpDigits(['', '', '', '', '', '']);
                    }}
                  >
                    <Text style={styles.changeLinkText}>Change</Text>
                  </TouchableOpacity>
                </View>

                {/* Reviewer Demo Notice */}
                {(mobile.includes('9999999999') || mobile.includes('8980966677') || mobile.includes('1234567890') || mobile.includes('1800 889 8791')) && (
                  <View style={styles.demoOtpBadge}>
                    <Text style={styles.demoOtpText}>
                      Reviewer Demo OTP: 123456
                    </Text>
                  </View>
                )}

                {/* 6 Individual OTP Digit Input Boxes */}
                <View style={styles.otpBoxesRow}>
                  {otpDigits.map((digit, idx) => (
                    <TextInput
                      key={idx}
                      ref={(ref) => (otpInputs.current[idx] = ref)}
                      style={[
                        styles.otpBox,
                        digit ? styles.otpBoxFilled : undefined,
                      ]}
                      keyboardType="number-pad"
                      maxLength={idx === 0 ? 6 : 1}
                      value={digit}
                      onChangeText={(val) => handleOtpChange(val, idx)}
                      onKeyPress={(e) => handleOtpKeyPress(e, idx)}
                      textAlign="center"
                    />
                  ))}
                </View>

                {/* Resend Timer Row */}
                <View style={styles.resendRow}>
                  <Text style={styles.resendPrompt}>Didn't receive the code? </Text>
                  {countdown > 0 ? (
                    <Text style={styles.countdownText}>Resend in {countdown}s</Text>
                  ) : (
                    <TouchableOpacity onPress={() => handleSendOtp()}>
                      <Text style={styles.resendActiveText}>Resend OTP</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Verify OTP Primary Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleVerifyOtp()}
                  disabled={loading}
                  style={styles.primaryButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <View style={styles.btnRow}>
                      <Text style={styles.primaryBtnText}>Verify OTP</Text>
                      <Icons.ArrowRight size={18} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>

                {/* OR Divider */}
                <View style={styles.orDividerRow}>
                  <View style={styles.horizontalLine} />
                  <Text style={styles.orText}>or</Text>
                  <View style={styles.horizontalLine} />
                </View>

                {/* Use a Different Number Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setCurrentStep(1);
                    setOtpDigits(['', '', '', '', '', '']);
                  }}
                  style={styles.diffNumberButton}
                >
                  <Icons.Smartphone size={18} color="#281A5E" />
                  <Text style={styles.diffNumberText}>Use a different number</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131127',
  },
  headerGraphicContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT + 36,
  },
  headerGraphic: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  sheetContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: HEADER_HEIGHT,
  },
  whiteCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    minHeight: SCREEN_HEIGHT - HEADER_HEIGHT,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
  stepBox: {
    alignItems: 'center',
    width: '100%',
  },
  lavenderCircleBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#200F54',
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 6,
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  phoneInputContainer: {
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  flagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 4,
  },
  verticalDivider: {
    height: 24,
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  phoneTextInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    padding: 0,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#281A5E',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#281A5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  demoPill: {
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  demoPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B21A8',
  },
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  horizontalLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#94A3B8',
  },
  whatsappButton: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  whatsappIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  whatsappBtnText: {
    color: '#0F172A',
    fontSize: 14.5,
    fontWeight: '600',
  },
  termsNote: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
  phonePillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  phonePillNumber: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 8,
    marginRight: 12,
  },
  changeLinkText: {
    color: '#6366F1',
    fontWeight: '700',
    fontSize: 13,
  },
  demoOtpBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
    marginBottom: 16,
  },
  demoOtpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B21A8',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    color: '#281A5E',
  },
  otpBoxFilled: {
    borderColor: '#281A5E',
    borderWidth: 2,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  resendPrompt: {
    fontSize: 13,
    color: '#64748B',
  },
  countdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  resendActiveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4313B8',
  },
  diffNumberButton: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffNumberText: {
    color: '#281A5E',
    fontSize: 14.5,
    fontWeight: '700',
    marginLeft: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12.5,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
});
