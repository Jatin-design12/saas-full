import React, { createContext, useContext, useState, useEffect } from 'react';
import { WalletService, WalletState, WalletTransaction } from '../services/walletService';

interface WalletContextType {
  wallet: WalletState;
  transactions: WalletTransaction[];
  isLoading: boolean;
  addMoney: (amount: number, method?: 'UPI' | 'Razorpay' | 'PayU') => Promise<{ success: boolean; newBalance: number }>;
  withdrawMoney: (amount: number, upiId: string) => Promise<{ success: boolean; message: string }>;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: { mainBalance: 0, bonusBalance: 0, securityDeposit: 0, totalBalance: 0 },
  transactions: [],
  isLoading: true,
  addMoney: async () => ({ success: false, newBalance: 0 }),
  withdrawMoney: async () => ({ success: false, message: '' }),
  refreshWallet: async () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    mainBalance: 423.0,
    bonusBalance: 50.0,
    securityDeposit: 250.0,
    totalBalance: 473.0,
  });
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshWallet = async () => {
    try {
      const [wState, txList] = await Promise.all([
        WalletService.getWalletState(),
        WalletService.getTransactions(),
      ]);
      setWallet(wState);
      setTransactions(txList);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWallet();
  }, []);

  const addMoney = async (amount: number, method: 'UPI' | 'Razorpay' | 'PayU' = 'UPI') => {
    const res = await WalletService.addMoney(amount, method);
    if (res.success) {
      await refreshWallet();
    }
    return res;
  };

  const withdrawMoney = async (amount: number, upiId: string) => {
    const res = await WalletService.withdrawMoney(amount, upiId);
    if (res.success) {
      await refreshWallet();
    }
    return res;
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        isLoading,
        addMoney,
        withdrawMoney,
        refreshWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
