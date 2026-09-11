class AppConstants {
  // Network Configurations
  static const String apiBaseUrl = 'https://evegah.cloud/api'; // Production API URL
  static const String websocketUrl = 'wss://api.evegah.com/ws';

  // Vehicle & Map API Endpoints
  static String get getLiveZones => '$apiBaseUrl/v1/getzoneDetailWithBikeCountList';
  static String get decryptQr => '$apiBaseUrl/qrDecrypted';
  static String get getVehicleModel => '$apiBaseUrl/v1/getVehicleModel';

  // ICICI Bank Live UPI Merchant Configurations (from Bank Documentation)
  static const String iciciMid = '9496988';
  static const String iciciVpa = 'EVEGAHRIDE@icici';
  static const String iciciPayeeName = 'Evegah';
  static const String iciciApiKey = 'azLgqWskbTHg6gdGTSif2DNIA7b15MlJ';
  static const String iciciBaseUrl = 'https://apibankingone.icici.bank.in/api/MerchantAPI/UPI/v0';
  static const String iciciQrEndpoint = '/QR3/9496988';
  static const String iciciTxnStatusEndpoint = '/TransactionStatus3/9496988';
  static const String iciciCallbackStatusEndpoint = '/CallbackStatus2/9496988';
  static const String iciciRefundEndpoint = '/Refund/9496988';

  // Secure Storage & Shared Preference Keys
  static const String keyAccessToken = 'access_token';
  static const String keyRefreshToken = 'refresh_token';
  static const String keyIsLoggedIn = 'is_logged_in';
  static const String keyUserProfile = 'user_profile';

  // Application Identity
  static const String appName = 'EVegah';

  // Assets Paths
  static const String logoImg = 'assets/logo/evegah_brand.png';
  static const String loginBgImg = 'assets/login_page_b.jpeg';
}
