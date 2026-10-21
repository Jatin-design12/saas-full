import { ApiClient } from './api';
import { StorageService } from './storageService';
import { AppConfig } from '../constants/config';

export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  avatarUrl?: string;
  dlNumber?: string;
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  city?: string;
  emergencyContact?: string;
  totalRides: number;
  co2SavedKg: number;
  cleanEnergyKwh: number;
  greenPoints: number;
  joinedAt: string;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_evegah_rider_01',
  name: 'Himanshu Patel',
  mobile: '1800 889 8791',
  email: 'rider@evegah.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
  dlNumber: 'GJ06 20210049281',
  kycStatus: 'verified',
  city: 'Vadodara, Gujarat',
  emergencyContact: '+91 98250 11223',
  totalRides: 14,
  co2SavedKg: 28.4,
  cleanEnergyKwh: 42.6,
  greenPoints: 340,
  joinedAt: '2026-01-15',
};

export const AuthService = {
  async sendOtp(mobile: string): Promise<{ success: boolean; message: string; otpHint?: string }> {
    const cleanMobile = mobile.replace(/\D/g, '');
    try {
      const res = await ApiClient.post('/auth/send-otp', { mobile: cleanMobile });
      if (res.ok && res.data) {
        return { success: true, message: 'OTP sent to mobile', otpHint: '1234' };
      }
    } catch (e) {
      // Fallback
    }

    // Graceful offline mock: Default OTP is 1234
    return {
      success: true,
      message: 'OTP sent successfully (Demo Code: 1234)',
      otpHint: '1234',
    };
  },

  async verifyOtp(mobile: string, otp: string): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
    const cleanMobile = mobile.replace(/\D/g, '');
    if (otp !== '1234' && otp.length !== 4) {
      return { success: false, error: 'Invalid verification code. Please enter 1234.' };
    }

    const token = `evegah_jwt_${cleanMobile}_${Date.now()}`;
    await StorageService.setItem(AppConfig.storageKeys.authToken, token);

    // Retrieve or create profile
    let profile = await StorageService.getItem<UserProfile>(AppConfig.storageKeys.userProfile);
    if (!profile) {
      profile = {
        ...DEFAULT_USER,
        mobile: cleanMobile,
        name: cleanMobile === '1800 889 8791' ? DEFAULT_USER.name : `Rider ${cleanMobile.slice(-4)}`,
      };
      await StorageService.setItem(AppConfig.storageKeys.userProfile, profile);
    }

    await StorageService.setItem(AppConfig.storageKeys.userSession, {
      isLoggedIn: true,
      mobile: cleanMobile,
      loginAt: new Date().toISOString(),
    });

    return { success: true, user: profile, token };
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    const session = await StorageService.getItem(AppConfig.storageKeys.userSession);
    if (!session) return null;

    let profile = await StorageService.getItem<UserProfile>(AppConfig.storageKeys.userProfile);
    if (!profile) {
      profile = DEFAULT_USER;
      await StorageService.setItem(AppConfig.storageKeys.userProfile, profile);
    }
    return profile;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    let current = (await this.getCurrentUser()) || DEFAULT_USER;
    const updated: UserProfile = { ...current, ...updates };
    await StorageService.setItem(AppConfig.storageKeys.userProfile, updated);
    return updated;
  },

  async logout(): Promise<void> {
    await StorageService.removeItem(AppConfig.storageKeys.authToken);
    await StorageService.removeItem(AppConfig.storageKeys.userSession);
  },
};
