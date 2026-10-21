import { ApiClient } from './api';

export interface Vehicle {
  id: string;
  vehicleId: string;
  modelName: string;
  category: 'E-Vehicle' | 'E-Scooter' | 'E-Bike' | 'Utility EV';
  batteryPercentage: number;
  maxRangeKm: number;
  topSpeedKmH: number;
  seats: number;
  todayRatePerHour: number;
  rateAfterPerMin: number;
  distanceMinutes: string;
  latitude: number;
  longitude: number;
  status: 'available' | 'reserved' | 'in_ride' | 'charging';
  image: string;
  tagline: string;
}

export interface Zone {
  id: string;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  bikeCount: number;
  radiusMeters: number;
  vehicles: Vehicle[];
}

export interface EVModelDetail {
  id: string;
  name: string;
  tagline: string;
  category: string;
  rangeKm: string;
  speedKmH: string;
  capacity: string;
  motorPower: string;
  batteryCapacity: string;
  chargingTime: string;
  ratePerHour: number;
  ratePerMinAfter: number;
  primaryColor: string;
  cardBg: string;
  btnColor: string;
  images: string[];
  features: string[];
}

const MOCK_ZONES: Zone[] = [
  {
    id: 'zone_gotri_vadodara',
    name: 'Gotri Central Zone',
    city: 'Vadodara',
    address: 'Gotri Main Road, Near Yash Complex, Vadodara, Gujarat 390021',
    latitude: 22.3168,
    longitude: 73.1492,
    bikeCount: 6,
    radiusMeters: 450,
    vehicles: [
      {
        id: 'EV-VAD-01',
        vehicleId: 'EVEGAH_E1',
        modelName: 'Evegah City',
        category: 'E-Vehicle',
        batteryPercentage: 92,
        maxRangeKm: 90,
        topSpeedKmH: 45,
        seats: 2,
        todayRatePerHour: 18.0,
        rateAfterPerMin: 3.0,
        distanceMinutes: '2 mins walk',
        latitude: 22.3175,
        longitude: 73.1498,
        status: 'available',
        image: 'assets/city.png',
        tagline: 'Smart. Silent. Sustainable.',
      },
      {
        id: 'EV-VAD-02',
        vehicleId: 'EVEGAH_E2',
        modelName: 'Evegah Pro',
        category: 'E-Scooter',
        batteryPercentage: 84,
        maxRangeKm: 110,
        topSpeedKmH: 40,
        seats: 1,
        todayRatePerHour: 20.0,
        rateAfterPerMin: 3.5,
        distanceMinutes: '3 mins walk',
        latitude: 22.316,
        longitude: 73.1485,
        status: 'available',
        image: 'assets/pro-1.png',
        tagline: 'Compact. Powerful.',
      },
      {
        id: 'EV-VAD-03',
        vehicleId: 'EVEGAH_E3',
        modelName: 'EverRide Lite',
        category: 'E-Bike',
        batteryPercentage: 78,
        maxRangeKm: 120,
        topSpeedKmH: 25,
        seats: 1,
        todayRatePerHour: 22.0,
        rateAfterPerMin: 4.0,
        distanceMinutes: '4 mins walk',
        latitude: 22.3182,
        longitude: 73.1505,
        status: 'available',
        image: 'assets/Fly.png',
        tagline: 'Light. Smart. Everyday.',
      },
      {
        id: 'EV-VAD-04',
        vehicleId: 'EVEGAH_MINK',
        modelName: 'Evegah Mink',
        category: 'Utility EV',
        batteryPercentage: 95,
        maxRangeKm: 60,
        topSpeedKmH: 30,
        seats: 1,
        todayRatePerHour: 29.0,
        rateAfterPerMin: 5.0,
        distanceMinutes: '5 mins walk',
        latitude: 22.3155,
        longitude: 73.151,
        status: 'available',
        image: 'assets/mink.png',
        tagline: 'Agile. Robust. Heavy-Duty.',
      },
    ],
  },
  {
    id: 'zone_cp_delhi',
    name: 'Connaught Place Zone',
    city: 'New Delhi',
    address: 'Inner Circle, Block B, Connaught Place, New Delhi 110001',
    latitude: 28.6304,
    longitude: 77.2177,
    bikeCount: 8,
    radiusMeters: 600,
    vehicles: [
      {
        id: 'EV-DEL-01',
        vehicleId: 'EVEGAH_E1',
        modelName: 'Evegah City',
        category: 'E-Vehicle',
        batteryPercentage: 96,
        maxRangeKm: 90,
        topSpeedKmH: 45,
        seats: 2,
        todayRatePerHour: 18.0,
        rateAfterPerMin: 3.0,
        distanceMinutes: '1 min walk',
        latitude: 28.6312,
        longitude: 77.2185,
        status: 'available',
        image: 'assets/city.png',
        tagline: 'Smart. Silent. Sustainable.',
      },
      {
        id: 'EV-DEL-02',
        vehicleId: 'EVEGAH_E2',
        modelName: 'Evegah Pro',
        category: 'E-Scooter',
        batteryPercentage: 81,
        maxRangeKm: 110,
        topSpeedKmH: 40,
        seats: 1,
        todayRatePerHour: 20.0,
        rateAfterPerMin: 3.5,
        distanceMinutes: '3 mins walk',
        latitude: 28.6295,
        longitude: 77.2165,
        status: 'available',
        image: 'assets/pro-1.png',
        tagline: 'Compact. Powerful.',
      },
    ],
  },
  {
    id: 'zone_sayaji_vadodara',
    name: 'Sayaji Baug Hub',
    city: 'Vadodara',
    address: 'Near Planetarium Gate, Sayaji Baug, Vadodara, Gujarat 390005',
    latitude: 22.3129,
    longitude: 73.1895,
    bikeCount: 5,
    radiusMeters: 400,
    vehicles: [
      {
        id: 'EV-SAY-01',
        vehicleId: 'EVEGAH_E3',
        modelName: 'EverRide Lite',
        category: 'E-Bike',
        batteryPercentage: 89,
        maxRangeKm: 120,
        topSpeedKmH: 25,
        seats: 1,
        todayRatePerHour: 22.0,
        rateAfterPerMin: 4.0,
        distanceMinutes: '2 mins walk',
        latitude: 22.3135,
        longitude: 73.1902,
        status: 'available',
        image: 'assets/Fly.png',
        tagline: 'Light. Smart. Everyday.',
      },
    ],
  },
];

export const FLEET_MODELS: EVModelDetail[] = [
  {
    id: 'model_city',
    name: 'Evegah City',
    tagline: 'Smart. Silent. Sustainable.',
    category: 'E-Vehicle',
    rangeKm: '80–100 km',
    speedKmH: '45 km/h',
    capacity: '2 Seats',
    motorPower: '1200W BLDC Hub Motor',
    batteryCapacity: '60V 30Ah Lithium-ion',
    chargingTime: '2.5 hrs fast charge',
    ratePerHour: 18.0,
    ratePerMinAfter: 3.0,
    primaryColor: '#6B21A8',
    cardBg: '#FFFFFF',
    btnColor: '#4F14E0',
    images: ['assets/city.png', 'assets/City-1.png', 'assets/city-white.png'],
    features: [
      'Dual regenerative disc braking system',
      'Anti-theft smart IoT wheel lock',
      'Dual passenger suspension support',
      'Under-seat helmet and bag storage',
    ],
  },
  {
    id: 'model_pro',
    name: 'Evegah Pro',
    tagline: 'Compact. Powerful.',
    category: 'E-Scooter',
    rangeKm: '75–90 km',
    speedKmH: '40 km/h',
    capacity: '1 Seat',
    motorPower: '800W High Torque',
    batteryCapacity: '48V 24Ah LiFePO4',
    chargingTime: '2 hrs fast charge',
    ratePerHour: 20.0,
    ratePerMinAfter: 3.5,
    primaryColor: '#15803D',
    cardBg: '#EAF8EE',
    btnColor: '#22864E',
    images: ['assets/pro-1.png', 'assets/evegah_vb_pro.png'],
    features: [
      'Ultralight aerospace aluminum chassis',
      'One-touch kickstand sensor',
      'Integrated LED halo headlight & tail strobe',
      'Phone charging USB port',
    ],
  },
  {
    id: 'model_fly',
    name: 'EverRide Lite',
    tagline: 'Light. Smart. Everyday.',
    category: 'E-Bike',
    rangeKm: '40–55 km',
    speedKmH: '25 km/h',
    capacity: '1 Seat',
    motorPower: '350W Geared Brushless',
    batteryCapacity: '36V 15Ah Detachable',
    chargingTime: '1.5 hrs fast charge',
    ratePerHour: 22.0,
    ratePerMinAfter: 4.0,
    primaryColor: '#1E40AF',
    cardBg: '#EFF5FD',
    btnColor: '#55739E',
    images: ['assets/Fly.png', 'assets/fly-1.png'],
    features: [
      'Pedal-assist mode for zero effort climbs',
      'Puncture-proof run-flat tires',
      'Lightweight frame easy to maneuver',
      'Smart digital handlebar dashboard',
    ],
  },
  {
    id: 'model_mink',
    name: 'Evegah Mink',
    tagline: 'Agile. Robust. Heavy-Duty.',
    category: 'Utility EV',
    rangeKm: '60–75 km',
    speedKmH: '30 km/h',
    capacity: '1 Seat + Cargo',
    motorPower: '1000W Heavy Duty Motor',
    batteryCapacity: '48V 28Ah High Discharge',
    chargingTime: '3 hrs fast charge',
    ratePerHour: 29.0,
    ratePerMinAfter: 5.0,
    primaryColor: '#D97706',
    cardBg: '#FFFBEB',
    btnColor: '#D97706',
    images: ['assets/mink.png', 'assets/MINK-1.png'],
    features: [
      'Reinforced front & rear carrier rack',
      'Heavy payload capacity up to 150 kg',
      'Triple suspension shock absorbers',
      'Waterproof IP67 battery enclosure',
    ],
  },
];

export const VehicleService = {
  async getLiveZones(): Promise<Zone[]> {
    try {
      const res = await ApiClient.get('/zones');
      if (res.ok && res.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (e) {
      // Use fallback
    }
    return MOCK_ZONES;
  },

  async getVehicleDetails(vehicleId: string): Promise<Vehicle | null> {
    const cleanId = vehicleId.trim().toUpperCase();
    for (const zone of MOCK_ZONES) {
      const match = zone.vehicles.find((v) => v.vehicleId.toUpperCase() === cleanId || v.id.toUpperCase() === cleanId);
      if (match) return match;
    }
    // Fallback default vehicle
    return {
      id: cleanId,
      vehicleId: cleanId,
      modelName: cleanId.includes('E1') ? 'Evegah City' : cleanId.includes('E3') ? 'EverRide Lite' : 'Evegah Pro',
      category: 'E-Scooter',
      batteryPercentage: 88,
      maxRangeKm: 95,
      topSpeedKmH: 42,
      seats: 1,
      todayRatePerHour: 18.0,
      rateAfterPerMin: 3.0,
      distanceMinutes: '2 mins walk',
      latitude: 22.3168,
      longitude: 73.1492,
      status: 'available',
      image: 'assets/city.png',
      tagline: 'Ready to ride',
    };
  },

  getFleetModels(): EVModelDetail[] {
    return FLEET_MODELS;
  },
};
