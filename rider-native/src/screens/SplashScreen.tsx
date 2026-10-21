import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Icons } from '../components/common/Icons';
import { BorderRadius, Spacing } from '../constants/theme';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: (isLoggedIn: boolean) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        onFinish(isLoggedIn);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isLoggedIn]);

  return (
    <View style={styles.container}>
      {/* Background Glow */}
      <View style={styles.glowCircle} />

      {/* Brand Icon & Logo */}
      <View style={styles.brandBox}>
        <View style={styles.iconRing}>
          <Icons.Zap size={48} color="#D7FF00" />
        </View>

        <Text style={styles.appName}>EVegah</Text>
        <Text style={styles.appTagline}>SMART GREEN MOBILITY</Text>
      </View>

      {/* Bottom Features Showcase */}
      <View style={styles.footer}>
        <View style={styles.featureItem}>
          <Icons.Leaf size={16} color="#10B981" />
          <Text style={styles.featureText}>100% Zero Emission</Text>
        </View>
        <View style={styles.featureItem}>
          <Icons.QrCode size={16} color="#D7FF00" />
          <Text style={styles.featureText}>Instant QR Unlock</Text>
        </View>
        <View style={styles.featureItem}>
          <Icons.Cpu size={16} color="#60A5FA" />
          <Text style={styles.featureText}>Smart BMS IoT</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#042A14',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  glowCircle: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    backgroundColor: 'rgba(9, 93, 45, 0.4)',
  },
  brandBox: {
    alignItems: 'center',
  },
  iconRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 2,
    borderColor: '#D7FF00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#D7FF00',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1,
  },
  appTagline: {
    color: '#D7FF00',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    flexDirection: 'row',
    gap: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.full,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});
