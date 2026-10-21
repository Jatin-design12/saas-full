export interface CellData {
  cellNumber: number;
  voltage: number;
  status: 'balanced' | 'balancing' | 'deviation';
}

export interface BMSData {
  batteryId: string;
  vehicleId: string;
  soc: number; // State of Charge %
  voltage: number; // Volts
  current: number; // Amperes
  powerWatts: number;
  temperatureCelsius: number;
  healthPercentage: number;
  chargeCycles: number;
  estimatedRangeKm: {
    eco: number;
    city: number;
    sport: number;
  };
  safetyStatus: {
    overVoltage: boolean;
    underVoltage: boolean;
    overTemperature: boolean;
    shortCircuit: boolean;
    allSystemsNormal: boolean;
  };
  cells: CellData[];
}

export const BMSService = {
  getLiveBMSData(vehicleId = 'EVEGAH_E1'): BMSData {
    // Generate realistic 14-cell battery pack data (Lithium-ion 14S)
    const baseVoltage = 3.90;
    const cells: CellData[] = Array.from({ length: 14 }, (_, i) => {
      const delta = (Math.sin(i) * 0.015);
      const voltage = Number((baseVoltage + delta).toFixed(3));
      return {
        cellNumber: i + 1,
        voltage,
        status: Math.abs(delta) > 0.02 ? 'balancing' : 'balanced',
      };
    });

    return {
      batteryId: 'BAT-EVG-84912',
      vehicleId,
      soc: 88,
      voltage: 54.6,
      current: 8.2,
      powerWatts: 447.7,
      temperatureCelsius: 29.4,
      healthPercentage: 98,
      chargeCycles: 142,
      estimatedRangeKm: {
        eco: 92,
        city: 78,
        sport: 62,
      },
      safetyStatus: {
        overVoltage: false,
        underVoltage: false,
        overTemperature: false,
        shortCircuit: false,
        allSystemsNormal: true,
      },
      cells,
    };
  },
};
