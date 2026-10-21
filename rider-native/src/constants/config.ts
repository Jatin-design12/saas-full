export const AppConfig = {
  appName: 'EVegah',
  tagline: 'Smart Green Urban Mobility',
  version: '2.0.0',

  // Network Endpoints (matches backend and Flutter app)
  apiBaseUrl: 'https://evegah.cloud/api',
  fallbackBaseUrls: [
    'http://localhost:5000/api',
    'http://10.0.2.2:5000/api',
    'http://192.168.1.4:5000/api',
  ],

  // ICICI UPI Merchant Config (from official bank docs)
  icici: {
    mid: '613268',
    vpa: 'EVEGAHUAT@icici',
    payeeName: 'Evegah EV Mobility',
    apiKey: 'wnHtmdq9q1Zibc05sNX1wzMW1W62K7Lp',
    baseUrl: 'https://apibankingone.icici.bank.in/api/MerchantAPI/UPI/v0',
  },

  // Storage Keys
  storageKeys: {
    userSession: '@evegah_session',
    userProfile: '@evegah_profile',
    authToken: '@evegah_token',
    activeRide: '@evegah_active_ride',
    appTheme: '@evegah_theme_mode',
    appSettings: '@evegah_settings',
    walletHistory: '@evegah_wallet_txns',
    ridesHistory: '@evegah_rides_history',
  },

  // Default Ride Pricing
  rates: {
    baseFare: 15.0, // Base fee for first 30 mins
    perMinuteAfter: 1.5, // Per min beyond base
    pausePerMinute: 0.5, // Rate when ride is paused / locked
    securityDeposit: 250.0,
    speedLimitKmH: 45,
  },
};
