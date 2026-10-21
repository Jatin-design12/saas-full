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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RiderProfileSelectScreenProps {
  onContinue: (profileType: string) => void;
  onBack?: () => void;
}

export const RiderProfileSelectScreen: React.FC<RiderProfileSelectScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<'student' | 'delivery' | 'general'>('student');

  const profiles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Not just studies — I ride to chill, explore, and enjoy.',
      icon: (
        <View style={styles.profileIconCircle}>
          <Icons.User size={24} color="#5B21B6" />
        </View>
      ),
    },
    {
      id: 'delivery',
      title: 'Delivery Partner',
      description: 'I ride for deliveries — Ride, work, earn, repeat.',
      icon: (
        <View style={styles.profileIconCircle}>
          <Icons.Scooter size={24} color="#5B21B6" />
        </View>
      ),
    },
    {
      id: 'general',
      title: 'General User',
      description: 'None of the above — Still exploring the electric way.',
      icon: (
        <View style={styles.profileIconCircle}>
          <Icons.Settings size={24} color="#5B21B6" />
        </View>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with 3D Rider & Purple Gradient */}
        <View style={styles.headerGraphicWrapper}>
          <Image
            source={require('../../assets/rider_purple_header.png')}
            style={styles.headerImage}
            resizeMode="cover"
          />
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

        {/* Form Body */}
        <View style={styles.bodyContent}>
          <Text style={styles.sectionHeading}>I want to ride as a...</Text>

          {profiles.map((p) => {
            const isSelected = selectedProfile === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.85}
                onPress={() => setSelectedProfile(p.id as any)}
                style={[
                  styles.profileCard,
                  isSelected && styles.profileCardSelected,
                ]}
              >
                <View style={styles.cardLeft}>
                  {p.icon}
                  <View style={styles.cardTextContent}>
                    <Text style={[styles.profileTitle, isSelected && styles.profileTitleSelected]}>
                      {p.title}
                    </Text>
                    <Text style={styles.profileDescription}>{p.description}</Text>
                  </View>
                </View>

                {/* Radio check */}
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <Icons.Check size={14} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onContinue(selectedProfile)}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.securityRow}>
          <Icons.Shield size={14} color="#E11D48" />
          <Text style={styles.securityText}>
            Your data is safe & secure with{' '}
            <Text style={{ fontWeight: '800', color: '#6B21A8' }}>U-WE</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFE',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  headerGraphicWrapper: {
    width: '100%',
    height: 250,
    backgroundColor: '#6B21A8',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
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
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  profileCardSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#FFFFFF',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  profileIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTextContent: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  profileTitleSelected: {
    color: '#5B21B6',
  },
  profileDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  continueButton: {
    height: 52,
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  securityText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 6,
  },
});
