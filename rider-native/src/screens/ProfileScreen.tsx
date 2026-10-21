import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Icons } from '../components/common/Icons';

interface ProfileScreenProps {
  onNavigate: (route: string, params?: any) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const { user, updateProfile, logout } = useAuth();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || 'Demo Reviewer');
  const [emailInput, setEmailInput] = useState(user?.email || 'reviewer@evegah.com');

  const userName = user?.name || 'Demo Reviewer';
  const userMobile = user?.mobile || '9999999999';
  const kycStatus = user?.kycStatus || 'unverified';
  const isKycVerified = kycStatus === 'verified';

  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return nameStr.slice(0, 2).toUpperCase() || 'DR';
  };

  const handleSaveProfile = async () => {
    await updateProfile({ name: nameInput, email: emailInput });
    setEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of Evegah?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          onNavigate('login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- 1. TOP HEADER (My Profile + Edit Button) --- */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.headerTitle}>My Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your Evegah account</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setEditModalVisible(true)}
            style={styles.headerEditBtn}
          >
            <Icons.Phone size={16} color="#4313B8" />
          </TouchableOpacity>
        </View>

        {/* --- 2. HERO PROFILE CARD (Gradient with DR initials & Badge) --- */}
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            {/* Avatar with edit pencil badge */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitialsText}>{getInitials(userName)}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setEditModalVisible(true)}
                style={styles.avatarEditPencilBadge}
              >
                <Icons.Phone size={10} color="#4313B8" />
              </TouchableOpacity>
            </View>

            {/* Profile Info */}
            <View style={styles.heroInfoCol}>
              <View style={styles.nameRow}>
                <Text style={styles.heroUserName}>{userName}</Text>
                <Icons.ChevronRight size={18} color="#FFFFFF" />
              </View>

              {/* Status Badge */}
              <View
                style={[
                  styles.kycStatusBadge,
                  isKycVerified ? styles.kycBadgeVerified : styles.kycBadgeUnverified,
                ]}
              >
                <Icons.Shield
                  size={12}
                  color={isKycVerified ? '#16A34A' : '#F59E0B'}
                />
                <Text
                  style={[
                    styles.kycBadgeText,
                    { color: isKycVerified ? '#16A34A' : '#F59E0B' },
                  ]}
                >
                  {isKycVerified ? 'Verified Rider' : 'Unverified Rider'}
                </Text>
              </View>

              {/* Phone */}
              <View style={styles.phoneRow}>
                <Icons.Phone size={12} color="#FFFFFF" />
                <Text style={styles.phoneText}>+91 {userMobile}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* --- 3. STATS ROW (3 White Cards: RIDES, KG CO2, POINTS) --- */}
        <View style={styles.statsRow}>
          {/* Stat 1: Rides */}
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#F5F3FF' }]}>
              <Icons.Scooter size={18} color="#4313B8" />
            </View>
            <Text style={styles.statValue}>{user?.totalRides || 0}</Text>
            <Text style={styles.statLabel}>RIDES</Text>
          </View>

          {/* Stat 2: KG CO2 */}
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#F0FDF4' }]}>
              <Icons.Leaf size={18} color="#16A34A" />
            </View>
            <Text style={styles.statValue}>{(user?.co2SavedKg || 0.0).toFixed(1)}</Text>
            <Text style={styles.statLabel}>KG CO₂</Text>
          </View>

          {/* Stat 3: Points */}
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Icons.Star size={18} color="#D97706" fill="#D97706" />
            </View>
            <Text style={styles.statValue}>{user?.greenPoints || 120}</Text>
            <Text style={styles.statLabel}>POINTS</Text>
          </View>
        </View>

        {/* --- 4. EVECLUB (Your membership) --- */}
        <View style={styles.eveClubCard}>
          <View style={styles.eveClubHeader}>
            <View>
              <Text style={styles.eveClubTitle}>EveClub</Text>
              <Text style={styles.eveClubSubtitle}>Your membership</Text>
            </View>
            <Icons.ChevronRight size={18} color="#4313B8" />
          </View>

          {/* Inner Tier Card */}
          <View style={styles.eveClubTierBox}>
            <View style={styles.tierTopRow}>
              <View style={styles.tierLeft}>
                <View style={styles.tierIconBadge}>
                  <Icons.Shield size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.tierName}>Bronze Member</Text>
              </View>
              <View style={styles.pointsCol}>
                <Text style={styles.evePointsValue}>⚡ 120</Text>
                <Text style={styles.evePointsLabel}>Eve Points</Text>
              </View>
            </View>

            {/* Progress to Silver */}
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Progress to Silver</Text>
              <Text style={styles.progressSub}>380 pts left</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '24%' }]} />
            </View>
          </View>
        </View>

        {/* --- 5. QUICK ACTIONS SECTION --- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Quick Actions</Text>
        </View>

        <View style={styles.grid2x2}>
          {/* Edit Profile */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setEditModalVisible(true)}
            style={styles.gridCard}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#EDE9FE' }]}>
              <Icons.User size={20} color="#5B21B6" />
            </View>
            <Text style={styles.gridTitle}>Edit Profile</Text>
          </TouchableOpacity>

          {/* KYC Documents */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate('kyc')}
            style={styles.gridCard}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Icons.Shield size={20} color="#16A34A" />
            </View>
            <Text style={styles.gridTitle}>KYC Documents</Text>
          </TouchableOpacity>

          {/* Refer & Earn */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate('offers')}
            style={styles.gridCard}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Icons.Gift size={20} color="#2563EB" />
            </View>
            <Text style={styles.gridTitle}>Refer & Earn</Text>
          </TouchableOpacity>

          {/* Offers */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate('offers')}
            style={styles.gridCard}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#F3E8FF' }]}>
              <Icons.Percent size={20} color="#7C3AED" />
            </View>
            <Text style={styles.gridTitle}>Offers</Text>
          </TouchableOpacity>
        </View>

        {/* --- 6. SUPPORT & INFO SECTION --- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Support & Info</Text>
        </View>

        <View style={styles.grid2x2}>
          {/* Safety & Help */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate('support')}
            style={styles.gridCard}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Icons.Shield size={20} color="#16A34A" />
            </View>
            <Text style={styles.gridTitle}>Safety & Help</Text>
          </TouchableOpacity>

          {/* Preferences / Terms */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate('rider_profile_select')}
            style={styles.gridCard}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Icons.Settings size={20} color="#D97706" />
            </View>
            <Text style={styles.gridTitle}>Preferences</Text>
          </TouchableOpacity>

          {/* About Evegah */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate('terms')}
            style={styles.gridCard}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Icons.Help size={20} color="#2563EB" />
            </View>
            <Text style={styles.gridTitle}>About Evegah</Text>
          </TouchableOpacity>

          {/* Log Out */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLogout}
            style={styles.gridCard}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Icons.LogIn size={20} color="#DC2626" />
            </View>
            <Text style={[styles.gridTitle, { color: '#DC2626' }]}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Your Name"
            />

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              value={emailInput}
              onChangeText={setEmailInput}
              placeholder="name@evegah.com"
              keyboardType="email-address"
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSaveProfile}
              style={styles.saveBtn}
            >
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  headerEditBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  heroCard: {
    width: '100%',
    backgroundColor: '#5B21B6',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#5B21B6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitialsText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  avatarEditPencilBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  heroInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroUserName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  kycStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 1,
  },
  kycBadgeUnverified: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  kycBadgeVerified: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  kycBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  eveClubCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  eveClubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eveClubTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  eveClubSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  eveClubTierBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  tierTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#5B21B6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  tierName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  pointsCol: {
    alignItems: 'flex-end',
  },
  evePointsValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#5B21B6',
  },
  evePointsLabel: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '500',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  progressSub: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5B21B6',
    borderRadius: 3,
  },
  sectionHeaderRow: {
    marginBottom: 12,
    marginTop: 4,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  gridIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    marginTop: 8,
  },
  textInput: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  saveBtn: {
    height: 50,
    backgroundColor: '#5B21B6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  cancelBtnText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
});
