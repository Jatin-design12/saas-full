import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Icons } from '../common/Icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 340);

interface SidebarDrawerProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: string, params?: any) => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  visible,
  onClose,
  onNavigate,
}) => {
  const { user } = useAuth();

  const handleNav = (route: string, params?: any) => {
    onClose();
    onNavigate(route, params);
  };

  const getInitials = (name?: string) => {
    if (!name || !name.trim()) return 'HC';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  const initials = getInitials(user?.name);
  const userName = user?.name || user?.mobile || 'Rider';

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {/* Backdrop Touchable */}
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Drawer Panel */}
        <View style={styles.drawerPanel}>
          {/* Brand & Rider Profile Header (#24105E, bottomRight radius 42) */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleNav('profile')}
              style={styles.profileRow}
            >
              {/* Initials Circle with #8CE600 border */}
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.userNameText} numberOfLines={1}>
                  {userName}
                </Text>
                <View style={styles.profileSubtitleRow}>
                  <Icons.Zap size={14} color="#8CE600" />
                  <Text style={styles.viewProfileText}>
                    View and edit your profile
                  </Text>
                </View>
              </View>

              <Icons.ChevronRight size={22} color="rgba(255, 255, 255, 0.7)" />
            </TouchableOpacity>
          </View>

          {/* Menu Sections List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollList}
          >
            {/* SECTION 1: EV BOOKING & FLOWS */}
            <Text style={styles.sectionHeader}>EV BOOKING & FLOWS</Text>

            <DrawerTile
              icon={<Icons.Home size={20} color="#4313B8" />}
              title="Dashboard Home"
              subtitle="Main rider dashboard"
              onPress={() => handleNav('home')}
            />

            <DrawerTile
              icon={<Icons.Scooter size={20} color="#4313B8" />}
              title="Rent Your EV"
              subtitle="Search & overview page"
              onPress={() => handleNav('fleet_catalog')}
            />

            <DrawerTile
              icon={<Icons.MapPin size={20} color="#4313B8" />}
              title="Select Zone & Location"
              subtitle="Find zones near you"
              onPress={() => handleNav('live_zones')}
            />

            <DrawerTile
              icon={<Icons.Calendar size={20} color="#4313B8" />}
              title="Select Package & Dates"
              subtitle="Package & hourly date picker"
              onPress={() => handleNav('fleet_catalog')}
            />

            <DrawerTile
              icon={<Icons.Zap size={20} color="#4313B8" />}
              title="Choose Your EV"
              subtitle="Vehicle selection list"
              onPress={() => handleNav('fleet_catalog')}
            />

            <View style={styles.divider} />

            {/* SECTION 2: SERVICES & ACCOUNT */}
            <Text style={styles.sectionHeader}>SERVICES & ACCOUNT</Text>

            <DrawerTile
              icon={<Icons.CreditCard size={20} color="#4313B8" />}
              title="Payments & Offers"
              subtitle="Checkout & promo discounts"
              onPress={() => handleNav('offers')}
            />

            <DrawerTile
              icon={<Icons.Clock size={20} color="#4313B8" />}
              title="My Rides & History"
              subtitle="Active and past bookings"
              onPress={() => handleNav('my_rides')}
            />

            <DrawerTile
              icon={<Icons.Wallet size={20} color="#4313B8" />}
              title="Wallet & Transactions"
              subtitle="Balance and payment methods"
              onPress={() => handleNav('wallet')}
            />

            <DrawerTile
              icon={<Icons.Battery size={20} color="#4313B8" />}
              title="BMS Live Status"
              subtitle="Battery SOH & voltage metrics"
              onPress={() => handleNav('smart_bms')}
            />

            <DrawerTile
              icon={<Icons.User size={20} color="#4313B8" />}
              title="My Profile"
              subtitle="Personal information & stats"
              onPress={() => handleNav('profile')}
            />

            <DrawerTile
              icon={<Icons.Shield size={20} color="#4313B8" />}
              title="KYC Verification"
              subtitle="Identity & Aadhaar Verification"
              onPress={() => handleNav('kyc')}
            />

            <DrawerTile
              icon={<Icons.QrCode size={20} color="#4313B8" />}
              title="Scan to Ride (QR)"
              subtitle="QR scanner vehicle unlock"
              onPress={() => handleNav('scan_qr')}
            />

            <DrawerTile
              icon={<Icons.LogIn size={20} color="#4313B8" />}
              title="Auth / Login"
              subtitle="Phone & OTP verification"
              onPress={() => handleNav('login')}
            />

            <View style={{ height: 28 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

interface DrawerTileProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const DrawerTile: React.FC<DrawerTileProps> = ({
  icon,
  title,
  subtitle,
  onPress,
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={styles.drawerTile}
  >
    <View style={styles.tileIconContainer}>{icon}</View>
    <View style={styles.tileContent}>
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileSubtitle}>{subtitle}</Text>
    </View>
    <Icons.ChevronRight size={18} color="#94A3B8" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flexDirection: 'row',
  },
  backdropTouch: {
    flex: 1,
  },
  drawerPanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#FAFBFE',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#24105E',
    borderBottomRightRadius: 42,
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4313B8',
    borderWidth: 2,
    borderColor: '#8CE600',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
  },
  userNameText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  profileSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewProfileText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 9.5,
    marginLeft: 3,
  },
  scrollList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
    marginVertical: 12,
  },
  drawerTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  tileIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tileContent: {
    flex: 1,
  },
  tileTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  tileSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
});
