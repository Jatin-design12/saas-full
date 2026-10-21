import { ApiClient } from './api';
import { StorageService } from './storageService';
import { AppConfig } from '../constants/config';
import { Vehicle } from './vehicleService';

export interface ActiveRide {
  bookingId: string;
  vehicleId: string;
  vehicleModel: string;
  category: string;
  startZone: string;
  startTime: string; // ISO string
  status: 'active' | 'paused' | 'completed';
  batteryPercentage: number;
  speedKmH: number;
  durationSeconds: number;
  distanceKm: number;
  currentCost: number;
  headlightsOn: boolean;
  isLocked: boolean;
  ratePerHour: number;
  ratePerMinAfter: number;
  image: string;
}

export interface RideHistoryItem {
  id: string;
  bookingId: string;
  vehicleId: string;
  vehicleModel: string;
  date: string;
  durationMinutes: number;
  distanceKm: number;
  totalCost: number;
  status: 'completed' | 'cancelled';
  co2SavedKg: number;
  rating?: number;
  feedback?: string;
  startZone: string;
  endZone: string;
}

const DEFAULT_RIDE_HISTORY: RideHistoryItem[] = [
  {
    id: 'rh_01',
    bookingId: 'EVG-RIDE-9021',
    vehicleId: 'EVEGAH_E1',
    vehicleModel: 'Evegah City',
    date: 'Today, 04:30 PM',
    durationMinutes: 24,
    distanceKm: 5.6,
    totalCost: 45.0,
    status: 'completed',
    co2SavedKg: 1.4,
    rating: 5,
    feedback: 'Super smooth acceleration and great battery life.',
    startZone: 'Gotri Central Zone',
    endZone: 'Gotri Central Zone',
  },
  {
    id: 'rh_02',
    bookingId: 'EVG-RIDE-8942',
    vehicleId: 'EVEGAH_E2',
    vehicleModel: 'Evegah Pro',
    date: 'Yesterday, 11:15 AM',
    durationMinutes: 16,
    distanceKm: 3.2,
    totalCost: 32.0,
    status: 'completed',
    co2SavedKg: 0.8,
    rating: 4,
    feedback: 'Easy to park, responsive disc brakes.',
    startZone: 'Sayaji Baug Hub',
    endZone: 'Sayaji Baug Hub',
  },
  {
    id: 'rh_03',
    bookingId: 'EVG-RIDE-8711',
    vehicleId: 'EVEGAH_E3',
    vehicleModel: 'EverRide Lite',
    date: '28 Sep 2026, 06:40 PM',
    durationMinutes: 42,
    distanceKm: 9.1,
    totalCost: 78.0,
    status: 'completed',
    co2SavedKg: 2.3,
    rating: 5,
    feedback: 'Loved the pedal assist on the flyover.',
    startZone: 'Gotri Central Zone',
    endZone: 'Gotri Central Zone',
  },
];

export const RideService = {
  async getActiveRide(): Promise<ActiveRide | null> {
    return StorageService.getItem<ActiveRide>(AppConfig.storageKeys.activeRide);
  },

  async startRide(vehicle: Vehicle, zoneName = 'Gotri Central Zone'): Promise<ActiveRide> {
    const newRide: ActiveRide = {
      bookingId: `EVG-${Date.now().toString().slice(-6)}`,
      vehicleId: vehicle.vehicleId,
      vehicleModel: vehicle.modelName,
      category: vehicle.category,
      startZone: zoneName,
      startTime: new Date().toISOString(),
      status: 'active',
      batteryPercentage: vehicle.batteryPercentage,
      speedKmH: 0,
      durationSeconds: 0,
      distanceKm: 0.0,
      currentCost: vehicle.todayRatePerHour || 18.0,
      headlightsOn: true,
      isLocked: false,
      ratePerHour: vehicle.todayRatePerHour || 18.0,
      ratePerMinAfter: vehicle.rateAfterPerMin || 3.0,
      image: vehicle.image || 'assets/city.png',
    };

    await StorageService.setItem(AppConfig.storageKeys.activeRide, newRide);

    // Call backend API (if available)
    try {
      await ApiClient.post('/rides/start', {
        vehicle_id: vehicle.vehicleId,
        zone: zoneName,
      });
    } catch {
      // Offline fallback
    }

    return newRide;
  },

  async updateActiveRide(updates: Partial<ActiveRide>): Promise<ActiveRide | null> {
    const current = await this.getActiveRide();
    if (!current) return null;
    const updated: ActiveRide = { ...current, ...updates };
    await StorageService.setItem(AppConfig.storageKeys.activeRide, updated);
    return updated;
  },

  async pauseRide(): Promise<ActiveRide | null> {
    return this.updateActiveRide({ status: 'paused', isLocked: true, speedKmH: 0 });
  },

  async resumeRide(): Promise<ActiveRide | null> {
    return this.updateActiveRide({ status: 'active', isLocked: false });
  },

  async toggleHeadlights(): Promise<boolean> {
    const current = await this.getActiveRide();
    if (!current) return false;
    const newState = !current.headlightsOn;
    await this.updateActiveRide({ headlightsOn: newState });
    return newState;
  },

  async endRide(activeRide: ActiveRide, endZone = 'Gotri Central Zone'): Promise<RideHistoryItem> {
    const minutes = Math.max(1, Math.round(activeRide.durationSeconds / 60));
    const co2Saved = Number((activeRide.distanceKm * 0.25).toFixed(2));

    const historyRecord: RideHistoryItem = {
      id: `rh_${Date.now()}`,
      bookingId: activeRide.bookingId,
      vehicleId: activeRide.vehicleId,
      vehicleModel: activeRide.vehicleModel,
      date: 'Just now',
      durationMinutes: minutes,
      distanceKm: Number(activeRide.distanceKm.toFixed(2)),
      totalCost: Number(activeRide.currentCost.toFixed(2)),
      status: 'completed',
      co2SavedKg: co2Saved,
      startZone: activeRide.startZone,
      endZone,
    };

    // Remove active ride from storage
    await StorageService.removeItem(AppConfig.storageKeys.activeRide);

    // Append to local ride history
    const history = await this.getRideHistory();
    history.unshift(historyRecord);
    await StorageService.setItem(AppConfig.storageKeys.ridesHistory, history);

    // Notify backend
    try {
      await ApiClient.post('/rides/end', {
        booking_id: activeRide.bookingId,
        end_zone: endZone,
        total_fare: activeRide.currentCost,
        distance_km: activeRide.distanceKm,
      });
    } catch {
      // Fallback
    }

    return historyRecord;
  },

  async getRideHistory(): Promise<RideHistoryItem[]> {
    const local = await StorageService.getItem<RideHistoryItem[]>(AppConfig.storageKeys.ridesHistory);
    if (local && Array.isArray(local) && local.length > 0) {
      return local;
    }
    await StorageService.setItem(AppConfig.storageKeys.ridesHistory, DEFAULT_RIDE_HISTORY);
    return DEFAULT_RIDE_HISTORY;
  },

  async submitFeedback(bookingId: string, rating: number, feedback: string): Promise<boolean> {
    const history = await this.getRideHistory();
    const item = history.find((h) => h.bookingId === bookingId);
    if (item) {
      item.rating = rating;
      item.feedback = feedback;
      await StorageService.setItem(AppConfig.storageKeys.ridesHistory, history);
    }
    return true;
  },
};
