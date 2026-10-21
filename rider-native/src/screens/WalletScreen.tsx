import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useWallet } from '../context/WalletContext';
import { Icons } from '../components/common/Icons';

interface WalletScreenProps {
  onBack?: () => void;
  onNavigate?: (route: string, params?: any) => void;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({
  onBack,
  onNavigate,
}) => {
  const { wallet, transactions, addMoney, withdrawMoney } = useWallet();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [amountInput, setAmountInput] = useState('500');
  const [upiInput, setUpiInput] = useState('rider@upi');
  const [loading, setLoading] = useState(false);

  const totalBal = wallet.totalBalance;
  const mainBal = wallet.mainBalance;
  const bonusBal = wallet.bonusBalance;

  const handleAddMoneySubmit = async () => {
    const amt = parseFloat(amountInput);
    if (!amt || amt <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const res = await addMoney(amt, 'UPI');
      if (res.success) {
        setAddModalVisible(false);
        Alert.alert('Success', `₹${amt.toFixed(0)} added to wallet successfully! ⚡`);
      } else {
        Alert.alert('Error', 'Failed to add money. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawSubmit = async () => {
    const amt = parseFloat(amountInput);
    if (!amt || amt <= 0 || amt > mainBal) {
      Alert.alert('Error', 'Insufficient main balance for withdrawal');
      return;
    }
    if (!upiInput.includes('@')) {
      Alert.alert('Error', 'Please enter a valid UPI ID (e.g. user@icici)');
      return;
    }

    setLoading(true);
    try {
      const res = await withdrawMoney(amt, upiInput);
      if (res.success) {
        setWithdrawModalVisible(false);
        Alert.alert(
          'Withdrawal Initiated',
          `₹${amt.toFixed(0)} withdrawn to bank via Instant Payout ⚡`
        );
      } else {
        Alert.alert('Error', res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onBack?.()}
          style={styles.backButton}
        >
          <Icons.ChevronLeft size={20} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.appBarTitle}>Wallet</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onNavigate?.('my_rides')}
          style={styles.txPillButton}
        >
          <Icons.Clock size={14} color="#4313B8" />
          <Text style={styles.txPillText}>Transactions</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. HERO WALLET CARD with wallet_bg.png */}
        <View style={styles.heroCardContainer}>
          <ImageBackground
            source={require('../../assets/wallet_bg.png')}
            style={styles.heroCardBg}
            imageStyle={styles.heroCardImageStyle}
            resizeMode="cover"
          >
            {/* Header info */}
            <View style={styles.walletHeaderRow}>
              <Icons.Wallet size={16} color="#4313B8" />
              <Text style={styles.walletHeaderText}>Your Wallet Balance</Text>
            </View>

            <View style={styles.balanceRow}>
              <Text style={styles.currencySymbol}>₹ </Text>
              <Text style={styles.balanceAmount}>{totalBal.toFixed(0)}</Text>
            </View>
            <Text style={styles.balanceSubtitle}>Total Balance</Text>

            {/* Add Money Pill Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setAmountInput('500');
                setAddModalVisible(true);
              }}
              style={styles.addMoneyButton}
            >
              <Icons.Plus size={14} color="#FFFFFF" />
              <Text style={styles.addMoneyBtnText}>Add Money</Text>
            </TouchableOpacity>

            {/* Sub-Bar Summary Row (3 Items inside White Container) */}
            <View style={styles.subBarSummaryContainer}>
              {/* Item 1: Main Balance */}
              <View style={styles.subBarItem}>
                <View style={[styles.subBarIconCircle, { backgroundColor: '#DCFCE7' }]}>
                  <Icons.Wallet size={14} color="#10B981" />
                </View>
                <View style={styles.subBarTextCol}>
                  <Text style={styles.subBarAmount}>₹{mainBal.toFixed(0)}</Text>
                  <Text style={styles.subBarLabel}>Main Balance</Text>
                </View>
              </View>

              <View style={styles.subBarDivider} />

              {/* Item 2: Bonus Balance */}
              <View style={styles.subBarItem}>
                <View style={[styles.subBarIconCircle, { backgroundColor: '#F3E8FF' }]}>
                  <Icons.Gift size={14} color="#8B5CF6" />
                </View>
                <View style={styles.subBarTextCol}>
                  <Text style={styles.subBarAmount}>₹{bonusBal.toFixed(0)}</Text>
                  <Text style={styles.subBarLabel}>Bonus Balance</Text>
                </View>
              </View>

              <View style={styles.subBarDivider} />

              {/* Item 3: Total Balance */}
              <View style={styles.subBarItem}>
                <View style={[styles.subBarIconCircle, { backgroundColor: '#DBEAFE' }]}>
                  <Icons.CreditCard size={14} color="#3B82F6" />
                </View>
                <View style={styles.subBarTextCol}>
                  <Text style={styles.subBarAmount}>₹{totalBal.toFixed(0)}</Text>
                  <Text style={styles.subBarLabel}>Total Balance</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* 2. QUICK ACTIONS (Single Box Card) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Quick Actions</Text>
          <View style={styles.quickActionsCard}>
            {/* Add Money */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setAmountInput('500');
                setAddModalVisible(true);
              }}
              style={styles.quickActionItem}
            >
              <View style={[styles.quickActionIconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Icons.ArrowUp size={20} color="#16A34A" />
              </View>
              <Text style={styles.quickActionText}>Add Money</Text>
            </TouchableOpacity>

            {/* Withdraw */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setAmountInput('200');
                setWithdrawModalVisible(true);
              }}
              style={styles.quickActionItem}
            >
              <View style={[styles.quickActionIconCircle, { backgroundColor: '#F3E8FF' }]}>
                <Icons.ArrowDown size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.quickActionText}>Withdraw</Text>
            </TouchableOpacity>

            {/* Apply Promo */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onNavigate?.('offers')}
              style={styles.quickActionItem}
            >
              <View style={[styles.quickActionIconCircle, { backgroundColor: '#DBEAFE' }]}>
                <Icons.Percent size={20} color="#2563EB" />
              </View>
              <Text style={styles.quickActionText}>Apply Promo</Text>
            </TouchableOpacity>

            {/* History */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onNavigate?.('my_rides')}
              style={styles.quickActionItem}
            >
              <View style={[styles.quickActionIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Icons.Clock size={20} color="#D97706" />
              </View>
              <Text style={styles.quickActionText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. GREEN PROMO OFFER BANNER */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onNavigate?.('offers')}
            style={styles.offerBannerWrapper}
          >
            <Image
              source={require('../../assets/wallet_banner.png')}
              style={styles.offerBannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* 4. BALANCE BREAKDOWN CARD & TRANSACTIONS */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Balance Breakdown</Text>
          <View style={styles.breakdownCard}>
            {/* Header row */}
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownRowTitle}>Available to Ride</Text>
              <Text style={styles.breakdownRowValue}>₹{totalBal.toFixed(2)}</Text>
            </View>

            <View style={styles.breakdownDivider} />

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownRowSub}>Non-refundable Promos</Text>
              <Text style={styles.breakdownRowSub}>₹{bonusBal.toFixed(2)}</Text>
            </View>

            <View style={styles.breakdownDivider} />

            {/* Transaction Items */}
            <Text style={styles.recentTxLabel}>Recent Transactions</Text>
            {transactions.slice(0, 4).map((tx) => {
              const isCredit = tx.type === 'credit';
              return (
                <View key={tx.id} style={styles.txItemRow}>
                  <View
                    style={[
                      styles.txIconBox,
                      { backgroundColor: isCredit ? '#DCFCE7' : '#F1F5F9' },
                    ]}
                  >
                    {isCredit ? (
                      <Icons.ArrowDownLeft size={16} color="#16A34A" />
                    ) : (
                      <Icons.ArrowUpRight size={16} color="#64748B" />
                    )}
                  </View>
                  <View style={styles.txDetailsCol}>
                    <Text style={styles.txTitleText}>{tx.title}</Text>
                    <Text style={styles.txDateText}>{tx.createdAt}</Text>
                  </View>
                  <Text
                    style={[
                      styles.txAmountText,
                      { color: isCredit ? '#16A34A' : '#0F172A' },
                    ]}
                  >
                    {isCredit ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 5. SECURITY BANNER */}
        <View style={styles.securityBanner}>
          <Icons.Shield size={16} color="#15803D" />
          <Text style={styles.securityText}>
            Your payments are 100% secure. Powered by ICICI Bank & PayU India.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* --- ADD MONEY MODAL --- */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Money to Wallet</Text>
            <Text style={styles.modalSubtitle}>
              Instant top-up via PayU (Cards, UPI, NetBanking, Wallets).
            </Text>

            <View style={styles.amountInputBox}>
              <Text style={styles.amountInputPrefix}>₹ </Text>
              <TextInput
                style={styles.amountTextInput}
                keyboardType="numeric"
                value={amountInput}
                onChangeText={setAmountInput}
              />
            </View>

            {/* Quick chips [100, 250, 500, 1000, 2000] */}
            <View style={styles.chipRow}>
              {[100, 250, 500, 1000, 2000].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  onPress={() => setAmountInput(amt.toString())}
                  style={[
                    styles.chipBtn,
                    amountInput === amt.toString() && styles.chipBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      amountInput === amt.toString() && styles.chipTextActive,
                    ]}
                  >
                    ₹{amt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleAddMoneySubmit}
              disabled={loading}
              style={styles.confirmModalBtn}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.confirmModalBtnText}>Proceed to Pay ₹{amountInput}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAddModalVisible(false)}
              style={styles.cancelModalBtn}
            >
              <Text style={styles.cancelModalBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- WITHDRAW MODAL --- */}
      <Modal
        visible={withdrawModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setWithdrawModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Withdraw Money</Text>
            <Text style={styles.modalSubtitle}>
              Instant payout to your bank via Razorpay / ICICI Instant UPI Payout.
            </Text>

            <Text style={styles.inputFieldLabel}>Withdrawal Amount</Text>
            <View style={styles.amountInputBox}>
              <Text style={styles.amountInputPrefix}>₹ </Text>
              <TextInput
                style={styles.amountTextInput}
                keyboardType="numeric"
                value={amountInput}
                onChangeText={setAmountInput}
              />
            </View>

            <Text style={styles.inputFieldLabel}>UPI ID (VPA)</Text>
            <View style={styles.textInputBox}>
              <TextInput
                style={styles.singleLineInput}
                placeholder="rider@icici"
                placeholderTextColor="#94A3B8"
                value={upiInput}
                onChangeText={setUpiInput}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleWithdrawSubmit}
              disabled={loading}
              style={[styles.confirmModalBtn, { backgroundColor: '#5B21B6' }]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.confirmModalBtnText}>Confirm Instant Withdrawal</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setWithdrawModalVisible(false)}
              style={styles.cancelModalBtn}
            >
              <Text style={styles.cancelModalBtnText}>Cancel</Text>
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
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 16,
    paddingBottom: 12,
    backgroundColor: '#FAFBFE',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  txPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  txPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4313B8',
    marginLeft: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroCardContainer: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F5F3FF',
    shadowColor: '#4313B8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  heroCardBg: {
    width: '100%',
    padding: 18,
  },
  heroCardImageStyle: {
    borderRadius: 24,
  },
  walletHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletHeaderText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#200F54',
    marginLeft: 6,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  currencySymbol: {
    fontSize: 26,
    fontWeight: '700',
    color: '#200F54',
    marginTop: 4,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#200F54',
  },
  balanceSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  addMoneyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4313B8',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 16,
  },
  addMoneyBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
    marginLeft: 6,
  },
  subBarSummaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  subBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subBarIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  subBarTextCol: {
    justifyContent: 'center',
  },
  subBarAmount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  subBarLabel: {
    fontSize: 8.5,
    color: '#64748B',
    fontWeight: '500',
  },
  subBarDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  quickActionsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 14,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
  offerBannerWrapper: {
    width: '100%',
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
  },
  offerBannerImage: {
    width: '100%',
    height: '100%',
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  breakdownRowTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  breakdownRowValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
  },
  breakdownRowSub: {
    fontSize: 12,
    color: '#64748B',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  recentTxLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  txItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  txIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  txDetailsCol: {
    flex: 1,
  },
  txTitleText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  txDateText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  txAmountText: {
    fontSize: 13,
    fontWeight: '800',
  },
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 12,
    marginTop: 20,
  },
  securityText: {
    flex: 1,
    fontSize: 11,
    color: '#15803D',
    fontWeight: '500',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 16,
  },
  inputFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    marginTop: 10,
  },
  amountInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 54,
  },
  amountInputPrefix: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4313B8',
  },
  amountTextInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '900',
    color: '#4313B8',
  },
  textInputBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
  },
  singleLineInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  chipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  chipBtnActive: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: '#4313B8',
  },
  confirmModalBtn: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#4313B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  confirmModalBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  cancelModalBtn: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  cancelModalBtnText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
});
