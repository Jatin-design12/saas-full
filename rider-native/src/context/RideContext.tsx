import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ActiveRide, RideHistoryItem, RideService } from '../services/rideService';
import { Vehicle } from '../services/vehicleService';

interface RideContextType {
  activeRide: ActiveRide | null;
  isLoading: boolean;
  startRide: (vehicle: Vehicle, zone?: string) => Promise<ActiveRide>;
  pauseRide: () => Promise<void>;
  resumeRide: () => Promise<void>;
  toggleHeadlights: () => Promise<void>;
  endRide: (endZone?: string) => Promise<RideHistoryItem>;
  submitFeedback: (bookingId: string, rating: number, feedback: string) => Promise<void>;
  refreshActiveRide: () => Promise<void>;
}

const RideContext = createContext<RideContextType>({
  activeRide: null,
  isLoading: true,
  startRide: async () => ({} as ActiveRide),
  pauseRide: async () => {},
  resumeRide: async () => {},
  toggleHeadlights: async () => {},
  endRide: async () => ({} as RideHistoryItem),
  submitFeedback: async () => {},
  refreshActiveRide: async () => {},
});

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<any>(null);

  const refreshActiveRide = async () => {
    try {
      const current = await RideService.getActiveRide();
      setActiveRide(current);
    } catch {
      setActiveRide(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshActiveRide();
  }, []);

  // Telemetry loop for live ride
  useEffect(() => {
    if (activeRide && activeRide.status !== 'completed') {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setActiveRide((prev) => {
          if (!prev || prev.status === 'completed') return null;

          const isPaused = prev.status === 'paused';
          const newDuration = prev.durationSeconds + 1;

          // Simulated speed physics: if moving, 20-38 km/h; if paused, 0
          let newSpeed = isPaused ? 0 : Math.round(22 + Math.sin(newDuration / 5) * 8);
          if (newSpeed < 0) newSpeed = 0;

          // Distance delta in km (speed in km/h / 3600)
          const distanceDelta = (newSpeed / 3600);
          const newDistance = Number((prev.distanceKm + distanceDelta).toFixed(3));

          // Battery drain every 30 seconds
          let newBattery = prev.batteryPercentage;
          if (newDuration % 30 === 0 && newBattery > 5) {
            newBattery = Math.max(5, newBattery - 1);
          }

          // Dynamic fare calculation
          const minutes = newDuration / 60;
          let calculatedCost = prev.ratePerHour;
          if (minutes > 30) {
            calculatedCost += (minutes - 30) * (prev.ratePerMinAfter / 60);
          }
          const newCost = Number(calculatedCost.toFixed(2));

          const updated: ActiveRide = {
            ...prev,
            durationSeconds: newDuration,
            speedKmH: newSpeed,
            distanceKm: newDistance,
            batteryPercentage: newBattery,
            currentCost: newCost,
          };

          // Periodically sync to storage
          if (newDuration % 5 === 0) {
            RideService.updateActiveRide(updated);
          }

          return updated;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeRide?.status]);

  const startRide = async (vehicle: Vehicle, zone = 'Gotri Central Zone') => {
    const ride = await RideService.startRide(vehicle, zone);
    setActiveRide(ride);
    return ride;
  };

  const pauseRide = async () => {
    const updated = await RideService.pauseRide();
    if (updated) setActiveRide(updated);
  };

  const resumeRide = async () => {
    const updated = await RideService.resumeRide();
    if (updated) setActiveRide(updated);
  };

  const toggleHeadlights = async () => {
    await RideService.toggleHeadlights();
    setActiveRide((prev) => (prev ? { ...prev, headlightsOn: !prev.headlightsOn } : null));
  };

  const endRide = async (endZone = 'Gotri Central Zone') => {
    if (!activeRide) throw new Error('No active ride to end');
    const receipt = await RideService.endRide(activeRide, endZone);
    setActiveRide(null);
    return receipt;
  };

  const submitFeedback = async (bookingId: string, rating: number, feedback: string) => {
    await RideService.submitFeedback(bookingId, rating, feedback);
  };

  return (
    <RideContext.Provider
      value={{
        activeRide,
        isLoading,
        startRide,
        pauseRide,
        resumeRide,
        toggleHeadlights,
        endRide,
        submitFeedback,
        refreshActiveRide,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => useContext(RideContext);
