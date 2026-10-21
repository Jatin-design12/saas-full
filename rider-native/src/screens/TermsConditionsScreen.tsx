import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { Icons } from '../components/common/Icons';

interface TermsConditionsScreenProps {
  onAccept: () => void;
  onBack?: () => void;
}

export const TermsConditionsScreen: React.FC<TermsConditionsScreenProps> = ({
  onAccept,
  onBack,
}) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header with 3D Rider & Purple Gradient */}
      <View style={styles.headerGraphicWrapper}>
        <Image
          source={require('../../assets/rider_purple_header.png')}
          style={styles.headerImage}
          resizeMode="cover"
        />

        <View style={styles.headerTextOverlay}>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
          <Text style={styles.headerSubtitle}>
            Please read the terms before continuing
          </Text>
        </View>

        {onBack && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onBack}
            style={styles.backButton}
          >
            <Icons.ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Terms Sheet */}
      <View style={styles.sheetContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.docTitle}>U-WE: Terms & Conditions</Text>
          <Text style={styles.lastUpdatedText}>Last Updated: 20/06/2026</Text>

          <Text style={styles.paragraph}>
            These Terms and Conditions ("Terms") constitute a legally binding agreement
            between the user ("You" or "User") and{' '}
            <Text style={{ fontWeight: '700', color: '#0F172A' }}>
              White Carbon Motors Pvt. Ltd.
            </Text>
            , operating under the brand name{' '}
            <Text style={{ fontWeight: '700', color: '#0F172A' }}>U-WE</Text> ("Company",
            "We", "Us", or "Our"), governing your use of the{' '}
            <Text style={{ fontWeight: '700', color: '#0F172A' }}>
              U-WE mobile application
            </Text>
            , website, and related services (collectively referred to as the
            "Platform").
          </Text>

          <Text style={styles.highlightText}>
            By accessing or using our services, you agree to comply with and be bound by
            these Terms.
          </Text>

          <Text style={styles.sectionHeading}>1. Booking Policy</Text>
          <Text style={styles.paragraph}>
            1.1 Your booking is subject to vehicle availability, ID verification, and
            advance security deposit or active wallet balance. Reservations are held for a
            maximum grace period of 15 minutes before automated release.
          </Text>

          <Text style={styles.sectionHeading}>2. Safety & Helmet Compliance</Text>
          <Text style={styles.paragraph}>
            2.1 Riders must adhere to local municipal traffic safety regulations and wear a
            certified helmet during all active trips. Single rider scooters must never carry
            unauthorized pillion passengers.
          </Text>

          <Text style={styles.sectionHeading}>3. Damage & Battery Care</Text>
          <Text style={styles.paragraph}>
            3.1 You agree to operate the vehicle responsibly and report any battery or
            mechanical irregularities immediately via the in-app support helpline.
          </Text>

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>

      {/* Sticky Bottom Acceptance Card */}
      <View style={styles.bottomCard}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setAgreed(!agreed)}
          style={styles.checkboxRow}
        >
          <View style={[styles.checkboxBox, agreed && styles.checkboxBoxActive]}>
            {agreed && <Icons.Check size={14} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>
            I have read and agree to the{' '}
            <Text style={{ color: '#7C3AED', fontWeight: '700' }}>
              Terms & Conditions
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!agreed}
          onPress={() => {
            if (agreed) onAccept();
          }}
          style={[
            styles.continueButton,
            agreed ? styles.continueButtonActive : styles.continueButtonDisabled,
          ]}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Icons.ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7C3AED',
  },
  headerGraphicWrapper: {
    width: '100%',
    height: 220,
    backgroundColor: '#7C3AED',
    position: 'relative',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  headerTextOverlay: {
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 48 : 20,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 22,
  },
  scrollContent: {
    paddingBottom: 130,
  },
  docTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  lastUpdatedText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#64748B',
    marginTop: 4,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 14,
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
    lineHeight: 18,
    marginVertical: 12,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 6,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxBoxActive: {
    backgroundColor: '#7C3AED',
  },
  checkboxLabel: {
    fontSize: 12.5,
    color: '#334155',
  },
  continueButton: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#A855F7',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#DDD6FE',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
});
