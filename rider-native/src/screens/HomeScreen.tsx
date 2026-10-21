import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useRide } from '../context/RideContext';
import { Icons } from '../components/common/Icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HomeScreenProps {
  onNavigate: (route: string, params?: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { wallet } = useWallet();
  const { activeRide } = useRide();

  const [copiedCode, setCopiedCode] = useState(false);
  const userName = user?.name ? user.name.split(' ')[0] : 'Om';

  const handleCopyCode = () => {
    setCopiedCode(true);
    Alert.alert('Code Copied!', 'Coupon BAPPA30 copied to clipboard. Enjoy 30% OFF on your rides!');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Dashboard Body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- 1. TOP HEADER (Hi Om 👋 + Notification Bell) --- */}
        <View style={styles.topHeaderRow}>
          <View>
            <View style={styles.greetingRow}>
              <Text style={styles.greetingTitle}>Hi {userName}</Text>
              <Text style={styles.greetingEmoji}> 👋</Text>
            </View>
            <Text style={styles.greetingSubtitle}>Ready to ride in Vadodara?</Text>
          </View>

          {/* Notification Bell with '3' count badge */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onNavigate('notifications')}
            style={styles.bellButton}
          >
            <Icons.Bell size={20} color="#0F172A" />
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* --- 2. LOCATION & EV NEARBY PILLS --- */}
        <View style={styles.pillsRow}>
          {/* Location Chip */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onNavigate('live_zones')}
            style={styles.locationPill}
          >
            <Icons.MapPin size={16} color="#4313B8" />
            <Text style={styles.locationText} numberOfLines={1}>
              Gotri Zone, Vadodara
            </Text>
            <Icons.ChevronDown size={14} color="#64748B" />
          </TouchableOpacity>

          {/* EVs Nearby Chip */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onNavigate('live_zones')}
            style={styles.nearbyPill}
          >
            <Icons.Scooter size={16} color="#4313B8" />
            <Text style={styles.nearbyText}>12 EVs nearby</Text>
            <View style={styles.greenLiveDot} />
          </TouchableOpacity>
        </View>

        {/* --- 3. EXPLORE VADODARA ON EV BANNER --- */}
        <View style={styles.heroBannerContainer}>
          <Image
            source={require('../../assets/explore_vadodara_banner.png')}
            style={styles.heroBannerImage}
            resizeMode="cover"
          />
          {/* Action Overlay */}
          <View style={styles.heroBannerOverlay}>
            <View style={styles.bannerTextCol}>
              <Text style={styles.bannerHeadline}>
                Explore{'\n'}
                <Text style={{ color: '#4313B8' }}>Vadodara</Text> on EV
              </Text>
              <Text style={styles.bannerSubHeadline}>
                Affordable • Eco-friendly • Hassle-free
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onNavigate('fleet_catalog')}
                style={styles.bookEvButton}
              >
                <Text style={styles.bookEvBtnText}>Book your EV</Text>
                <Icons.ArrowRight size={14} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={styles.doorstepSubtext}>
                🚚 Doorstep delivery available
              </Text>
            </View>
          </View>
        </View>

        {/* --- 4. 30% OFF PROMO CARD --- */}
        <View style={styles.couponCard}>
          <View style={styles.couponLeft}>
            <View style={styles.couponIconBox}>
              <Icons.Percent size={20} color="#16A34A" />
            </View>
            <View style={styles.couponDetails}>
              <Text style={styles.couponHeading}>30% OFF on all rides</Text>
              <Text style={styles.couponSub}>
                Use code <Text style={{ fontWeight: '800', color: '#0F172A' }}>BAPPA30</Text> • Valid till 5 Oct 2026
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCopyCode}
            style={styles.copyCodeButton}
          >
            <Text style={styles.copyCodeText}>
              {copiedCode ? '✓ Copied' : 'Copy Code'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- 5. HOW EVEGAH WORKS? (3 SIMPLE STEPS) --- */}
        <View style={styles.howWorksCard}>
          <View style={styles.howWorksHeader}>
            <View>
              <Text style={styles.howWorksTitle}>How Evegah works?</Text>
              <Text style={styles.howWorksSubtitle}>Get on the road in 3 simple steps</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onNavigate('terms')}
              style={styles.learnMoreBtn}
            >
              <Text style={styles.learnMoreText}>Learn More</Text>
              <Icons.ArrowRight size={12} color="#4313B8" />
            </TouchableOpacity>
          </View>

          {/* 3 Steps Row with dashed dividers */}
          <View style={styles.stepsRow}>
            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepIconCircle, { backgroundColor: '#EDE9FE' }]}>
                <Icons.CreditCard size={18} color="#5B21B6" />
              </View>
              <Text style={styles.stepTitleText}>1. Choose a plan</Text>
              <Text style={styles.stepSubText}>Daily or Monthly</Text>
            </View>

            <View style={styles.dashedDivider} />

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepIconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Icons.Shield size={18} color="#16A34A" />
              </View>
              <Text style={styles.stepTitleText}>2. Verify KYC</Text>
              <Text style={styles.stepSubText}>Takes 2 minutes</Text>
            </View>

            <View style={styles.dashedDivider} />

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepIconCircle, { backgroundColor: '#EDE9FE' }]}>
                <Icons.Scooter size={18} color="#5B21B6" />
              </View>
              <Text style={styles.stepTitleText}>3. Ride or Deliver</Text>
              <Text style={styles.stepSubText}>Ride or at location</Text>
            </View>
          </View>
        </View>

        {/* --- 6. WALLET BALANCE CARD --- */}
        <View style={styles.walletCard}>
          <View style={styles.walletLeft}>
            <View style={styles.walletIconCircle}>
              <Icons.Wallet size={20} color="#4313B8" />
            </View>
            <View style={styles.walletTextCol}>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletAmount}>₹{wallet.totalBalance.toFixed(2)}</Text>
              <Text style={styles.walletHint}>Add money to start riding</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onNavigate('wallet')}
            style={styles.addMoneyPillBtn}
          >
            <Text style={styles.addMoneyBtnText}>Add Money</Text>
            <Icons.ArrowRight size={13} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* --- 7. CHOOSE YOUR PLAN (DAILY & MONTHLY) --- */}
        <View style={styles.plansSectionHeader}>
          <Text style={styles.plansSectionTitle}>Choose Your Plan</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate('fleet_catalog')}
            style={styles.viewAllRow}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Icons.ArrowRight size={13} color="#4313B8" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.plansScroll}
        >
          {/* Plan 1: Daily Plan */}
          <View style={styles.planCard}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>Most Popular</Text>
            </View>

            <Text style={styles.planName}>Daily Plan</Text>
            <Text style={styles.planPrice}>
              ₹199 <Text style={styles.planPerUnit}>/ day</Text>
            </Text>

            <View style={styles.planChecklist}>
              <View style={styles.checkItem}>
                <Icons.Check size={14} color="#16A34A" />
                <Text style={styles.checkLabel}>Unlimited km</Text>
              </View>
              <View style={styles.checkItem}>
                <Icons.Check size={14} color="#16A34A" />
                <Text style={styles.checkLabel}>Swap anytime</Text>
              </View>
              <View style={styles.checkItem}>
                <Icons.Check size={14} color="#16A34A" />
                <Text style={styles.checkLabel}>Doorstep delivery</Text>
              </View>
            </View>

            {/* Scooter Graphic */}
            <View style={styles.scooterImageBox}>
              <Image
                source={require('../../assets/scooter_daily_purple.png')}
                style={styles.scooterImg}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onNavigate('fleet_catalog', { plan: 'daily' })}
              style={styles.bookPlanButton}
            >
              <Text style={styles.bookPlanBtnText}>Book Daily</Text>
              <Icons.ArrowRight size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Plan 2: Monthly Plan */}
          <View style={styles.planCard}>
            <Text style={styles.planName}>Monthly Plan</Text>
            <Text style={styles.planPrice}>
              ₹2,499 <Text style={styles.planPerUnit}>/ month</Text>
            </Text>

            <View style={styles.planChecklist}>
              <View style={styles.checkItem}>
                <Icons.Check size={14} color="#16A34A" />
                <Text style={styles.checkLabel}>Unlimited km</Text>
              </View>
              <View style={styles.checkItem}>
                <Icons.Check size={14} color="#16A34A" />
                <Text style={styles.checkLabel}>Priority support</Text>
              </View>
              <View style={styles.checkItem}>
                <Icons.Check size={14} color="#16A34A" />
                <Text style={styles.checkLabel}>Best value</Text>
              </View>
            </View>

            {/* Scooter Graphic */}
            <View style={styles.scooterImageBox}>
              <Image
                source={require('../../assets/scooter_monthly_black.png')}
                style={styles.scooterImg}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onNavigate('fleet_catalog', { plan: 'monthly' })}
              style={[styles.bookPlanButton, { backgroundColor: '#F3E8FF' }]}
            >
              <Text style={[styles.bookPlanBtnText, { color: '#4313B8' }]}>
                Book Monthly
              </Text>
              <Icons.ArrowRight size={13} color="#4313B8" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* --- 8. QUICK ACTIONS PILLS (Doorstep, Offers, Support) --- */}
        <View style={styles.actionPillsRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate('fleet_catalog')}
            style={styles.pillCard}
          >
            <Icons.Scooter size={18} color="#4313B8" />
            <Text style={styles.pillCardText}>Doorstep Delivery</Text>
            <Icons.ChevronRight size={14} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate('offers')}
            style={styles.pillCard}
          >
            <Icons.Percent size={18} color="#4313B8" />
            <Text style={styles.pillCardText}>Offers</Text>
            <Icons.ChevronRight size={14} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate('support')}
            style={styles.pillCard}
          >
            <Icons.Help size={18} color="#4313B8" />
            <Text style={styles.pillCardText}>Help & Support</Text>
            <Icons.ChevronRight size={14} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* --- 9. WHY RIDE WITH EVEGAH? --- */}
        <View style={styles.whySectionContainer}>
          <Text style={styles.whySectionTitle}>Why Ride with Evegah?</Text>
          <View style={styles.whyColumnsRow}>
            {/* Column 1 */}
            <View style={styles.whyCol}>
              <View style={[styles.whyIconBox, { backgroundColor: '#DCFCE7' }]}>
                <Icons.Shield size={18} color="#16A34A" />
              </View>
              <Text style={styles.whyTitle}>Safe & Secure</Text>
              <Text style={styles.whySub}>GPS tracking</Text>
            </View>

            {/* Column 2 */}
            <View style={styles.whyCol}>
              <View style={[styles.whyIconBox, { backgroundColor: '#DCFCE7' }]}>
                <Icons.Battery size={18} color="#16A34A" />
              </View>
              <Text style={styles.whyTitle}>Long Range</Text>
              <Text style={styles.whySub}>Up to 100 km</Text>
            </View>

            {/* Column 3 */}
            <View style={styles.whyCol}>
              <View style={[styles.whyIconBox, { backgroundColor: '#DBEAFE' }]}>
                <Icons.Help size={18} color="#2563EB" />
              </View>
              <Text style={styles.whyTitle}>24/7 Support</Text>
              <Text style={styles.whySub}>We're always here</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFE',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 24,
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  greetingEmoji: {
    fontSize: 20,
  },
  greetingSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#4313B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginHorizontal: 6,
    flex: 1,
  },
  nearbyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  nearbyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 6,
    marginRight: 6,
  },
  greenLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16A34A',
  },
  heroBannerContainer: {
    width: '100%',
    height: 155,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#DDD6FE',
    marginBottom: 14,
    shadowColor: '#4313B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  heroBannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 14,
    justifyContent: 'center',
  },
  bannerTextCol: {
    width: '60%',
  },
  bannerHeadline: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 21,
    letterSpacing: -0.3,
  },
  bannerSubHeadline: {
    fontSize: 9.5,
    color: '#475569',
    marginTop: 4,
    marginBottom: 10,
    fontWeight: '500',
  },
  bookEvButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4313B8',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  bookEvBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 6,
  },
  doorstepSubtext: {
    fontSize: 8.5,
    color: '#475569',
    fontWeight: '600',
  },
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 12,
    marginBottom: 14,
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  couponIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  couponDetails: {
    flex: 1,
  },
  couponHeading: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#15803D',
  },
  couponSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  copyCodeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  copyCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  howWorksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  howWorksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  howWorksTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  howWorksSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  learnMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  learnMoreText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#4313B8',
    marginRight: 4,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepTitleText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  stepSubText: {
    fontSize: 8.5,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  dashedDivider: {
    width: 20,
    height: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F3FF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  walletTextCol: {},
  walletLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  walletAmount: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 1,
  },
  walletHint: {
    fontSize: 9,
    color: '#94A3B8',
  },
  addMoneyPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4313B8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  addMoneyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 4,
  },
  plansSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  plansSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4313B8',
    marginRight: 4,
  },
  plansScroll: {
    paddingVertical: 4,
    marginBottom: 14,
  },
  planCard: {
    width: 175,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginRight: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4313B8',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
  planName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  planPrice: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
    marginBottom: 8,
  },
  planPerUnit: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
  },
  planChecklist: {
    marginBottom: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  checkLabel: {
    fontSize: 9.5,
    color: '#475569',
    marginLeft: 4,
  },
  scooterImageBox: {
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  scooterImg: {
    width: '100%',
    height: '100%',
  },
  bookPlanButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4313B8',
    borderRadius: 14,
    height: 32,
    marginTop: 4,
  },
  bookPlanBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 4,
  },
  actionPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    flex: 1,
    marginHorizontal: 3,
    justifyContent: 'space-between',
  },
  pillCardText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  whySectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
    marginBottom: 16,
  },
  whySectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  whyColumnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  whyCol: {
    alignItems: 'center',
    flex: 1,
  },
  whyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  whyTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  whySub: {
    fontSize: 8.5,
    color: '#64748B',
    marginTop: 1,
    textAlign: 'center',
  },
});
