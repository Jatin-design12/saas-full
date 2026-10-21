import { ApiClient } from './api';
import { StorageService } from './storageService';
import { AppConfig } from '../constants/config';

export interface WalletTransaction {
  id: string;
  transactionId: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'success' | 'pending' | 'failed';
  paymentMethod: 'UPI' | 'Razorpay' | 'PayU' | 'Wallet' | 'NetBanking';
  createdAt: string;
  referenceId?: string;
}

export interface WalletState {
  mainBalance: number;
  bonusBalance: number;
  securityDeposit: number;
  totalBalance: number;
}

const DEFAULT_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_01',
    transactionId: 'EVG-TXN-904832',
    title: 'Wallet Top-Up (Add Money)',
    subtitle: 'ICICI UPI • Fast Auto-Credit',
    amount: 500.0,
    type: 'credit',
    status: 'success',
    paymentMethod: 'UPI',
    createdAt: 'Today, 02:45 PM',
    referenceId: 'UPI-928103981023',
  },
  {
    id: 'tx_02',
    transactionId: 'EVG-TXN-884920',
    title: 'Refundable Security Deposit',
    subtitle: 'Mandatory EV Fleet Deposit',
    amount: 250.0,
    type: 'credit',
    status: 'success',
    paymentMethod: 'Razorpay',
    createdAt: '24 Sep 2026, 11:30 AM',
    referenceId: 'RZP-810294102',
  },
  {
    id: 'tx_03',
    transactionId: 'EVG-TXN-773819',
    title: 'Ride Reservation Fare',
    subtitle: 'Gotri Central Zone • Evegah City',
    amount: 45.0,
    type: 'debit',
    status: 'success',
    paymentMethod: 'Wallet',
    createdAt: '22 Sep 2026, 05:15 PM',
    referenceId: 'EVG-RIDE-9021',
  },
  {
    id: 'tx_04',
    transactionId: 'EVG-TXN-662910',
    title: 'Ride Reservation Fare',
    subtitle: 'Sayaji Baug Hub • Evegah Pro',
    amount: 32.0,
    type: 'debit',
    status: 'success',
    paymentMethod: 'Wallet',
    createdAt: '20 Sep 2026, 10:00 AM',
    referenceId: 'EVG-RIDE-8942',
  },
];

export const WalletService = {
  async getWalletState(): Promise<WalletState> {
    const saved = await StorageService.getItem<WalletState>('@evegah_wallet_state');
    if (saved) return saved;

    const defaultState: WalletState = {
      mainBalance: 423.0,
      bonusBalance: 50.0,
      securityDeposit: 250.0,
      totalBalance: 473.0,
    };
    await StorageService.setItem('@evegah_wallet_state', defaultState);
    return defaultState;
  },

  async addMoney(amount: number, method: 'UPI' | 'Razorpay' | 'PayU' = 'UPI'): Promise<{ success: boolean; newBalance: number; transaction: WalletTransaction }> {
    const currentState = await this.getWalletState();
    const updatedState: WalletState = {
      ...currentState,
      mainBalance: currentState.mainBalance + amount,
      totalBalance: currentState.totalBalance + amount,
    };
    await StorageService.setItem('@evegah_wallet_state', updatedState);

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      transactionId: `EVG-TXN-${Date.now().toString().slice(-6)}`,
      title: 'Wallet Top-Up (Add Money)',
      subtitle: `${method} Instant Payment`,
      amount,
      type: 'credit',
      status: 'success',
      paymentMethod: method,
      createdAt: 'Just now',
      referenceId: `${method}-${Date.now().toString().slice(-8)}`,
    };

    const history = await this.getTransactions();
    history.unshift(tx);
    await StorageService.setItem(AppConfig.storageKeys.walletHistory, history);

    // Call backend API if alive
    try {
      await ApiClient.post('/wallet/add-money', {
        amount,
        payment_method: method,
        transaction_id: tx.transactionId,
      });
    } catch {
      // Graceful local fallback
    }

    return { success: true, newBalance: updatedState.mainBalance, transaction: tx };
  },

  async deductRideFare(amount: number, rideId: string): Promise<boolean> {
    const currentState = await this.getWalletState();
    const updatedState: WalletState = {
      ...currentState,
      mainBalance: Math.max(0, currentState.mainBalance - amount),
      totalBalance: Math.max(0, currentState.totalBalance - amount),
    };
    await StorageService.setItem('@evegah_wallet_state', updatedState);

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      transactionId: `EVG-TXN-${Date.now().toString().slice(-6)}`,
      title: 'Ride Reservation Fare',
      subtitle: 'Ride Completed',
      amount,
      type: 'debit',
      status: 'success',
      paymentMethod: 'Wallet',
      createdAt: 'Just now',
      referenceId: rideId,
    };

    const history = await this.getTransactions();
    history.unshift(tx);
    await StorageService.setItem(AppConfig.storageKeys.walletHistory, history);
    return true;
  },

  async withdrawMoney(amount: number, upiId: string): Promise<{ success: boolean; message: string }> {
    const currentState = await this.getWalletState();
    if (amount > currentState.mainBalance) {
      return { success: false, message: 'Insufficient main wallet balance' };
    }

    const updatedState: WalletState = {
      ...currentState,
      mainBalance: currentState.mainBalance - amount,
      totalBalance: currentState.totalBalance - amount,
    };
    await StorageService.setItem('@evegah_wallet_state', updatedState);

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      transactionId: `EVG-WDL-${Date.now().toString().slice(-6)}`,
      title: 'Payout Withdrawal',
      subtitle: `Transferred to ${upiId}`,
      amount,
      type: 'debit',
      status: 'success',
      paymentMethod: 'UPI',
      createdAt: 'Just now',
      referenceId: `WDL-${Date.now()}`,
    };

    const history = await this.getTransactions();
    history.unshift(tx);
    await StorageService.setItem(AppConfig.storageKeys.walletHistory, history);
    return { success: true, message: `₹${amount} withdrawal initiated to ${upiId}` };
  },

  async getTransactions(): Promise<WalletTransaction[]> {
    const local = await StorageService.getItem<WalletTransaction[]>(AppConfig.storageKeys.walletHistory);
    if (local && Array.isArray(local) && local.length > 0) {
      return local;
    }
    await StorageService.setItem(AppConfig.storageKeys.walletHistory, DEFAULT_TRANSACTIONS);
    return DEFAULT_TRANSACTIONS;
  },

  generateICICIUpiQrString(amount: number, txnRef: string): string {
    const { vpa, payeeName } = AppConfig.icici;
    return `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tr=${txnRef}&tn=Evegah_Wallet_Recharge`;
  },
};
