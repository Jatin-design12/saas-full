import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, UserProfile } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  sendOtp: (mobile: string) => Promise<{ success: boolean; message: string; otpHint?: string }>;
  verifyOtp: (mobile: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  sendOtp: async () => ({ success: false, message: '' }),
  verifyOtp: async () => ({ success: false }),
  updateProfile: async () => ({} as UserProfile),
  logout: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const current = await AuthService.getCurrentUser();
      setUser(current);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const sendOtp = async (mobile: string) => {
    return AuthService.sendOtp(mobile);
  };

  const verifyOtp = async (mobile: string, otp: string) => {
    const res = await AuthService.verifyOtp(mobile, otp);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to verify OTP' };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = await AuthService.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        sendOtp,
        verifyOtp,
        updateProfile,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
