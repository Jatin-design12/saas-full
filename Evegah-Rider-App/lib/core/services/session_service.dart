import 'package:shared_preferences/shared_preferences.dart';

class SessionService {
  static final SessionService _instance = SessionService._internal();
  factory SessionService() => _instance;
  SessionService._internal();

  static Map<String, String> _cachedProfile = {
    "name": "",
    "gender": "Male",
    "age": "",
    "address": "",
    "email": "",
  };
  static String? _cachedMobile;

  // INITIALIZE CACHE INSTANTLY (0ms)
  Future<void> init() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      _cachedMobile = prefs.getString("user_mobile");
      _cachedProfile = {
        "name": prefs.getString("user_name") ?? "",
        "gender": prefs.getString("user_gender") ?? "Male",
        "age": prefs.getString("user_age") ?? "",
        "address": prefs.getString("user_address") ?? "",
        "email": prefs.getString("user_email") ?? "",
      };
    } catch (_) {}
  }

  // SAVE TOKEN
  Future<void> saveToken(String token, {bool rememberMe = true}) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    await prefs.setString("access_token", token);
    await prefs.setInt("login_time", DateTime.now().millisecondsSinceEpoch);
    await prefs.setBool("remember_me", rememberMe);
  }

  // GET TOKEN
  Future<String?> getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString("access_token");
  }

  // CHECK SESSION
  Future<bool> isLoggedIn() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    String? token = prefs.getString("access_token");
    int? loginTime = prefs.getInt("login_time");
    bool rememberMe = prefs.getBool("remember_me") ?? true;

    if (token == null || loginTime == null) {
      return false;
    }

    DateTime loginDate = DateTime.fromMillisecondsSinceEpoch(loginTime);
    Duration difference = DateTime.now().difference(loginDate);

    // 15 DAYS REMEMBER ME SESSION
    int sessionDays = rememberMe ? 15 : 1;
    return difference.inDays < sessionDays;
  }

  // LOGOUT
  Future<void> logout() async {
    _cachedProfile = {
      "name": "",
      "gender": "Male",
      "age": "",
      "address": "",
      "email": "",
    };
    _cachedMobile = null;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

  // SET FIRST RIDE BOOKED
  Future<void> setFirstRideBooked(bool booked) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setBool("has_booked_first_ride", booked);
  }

  // GET FIRST RIDE BOOKED
  Future<bool> hasBookedFirstRide() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getBool("has_booked_first_ride") ?? false;
  }

  // SAVE USER MOBILE
  Future<void> saveUserMobile(String mobile) async {
    _cachedMobile = mobile;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString("user_mobile", mobile);
  }

  // GET USER MOBILE (Instant from cache)
  String? get userMobileSync => _cachedMobile;

  Future<String?> getUserMobile() async {
    if (_cachedMobile != null && _cachedMobile!.isNotEmpty) {
      return _cachedMobile;
    }
    SharedPreferences prefs = await SharedPreferences.getInstance();
    _cachedMobile = prefs.getString("user_mobile");
    return _cachedMobile;
  }

  // SAVE USER PROFILE
  Future<void> saveUserProfile({
    required String name,
    required String gender,
    required String age,
    required String address,
    String email = "",
  }) async {
    _cachedProfile = {
      "name": name,
      "gender": gender,
      "age": age,
      "address": address,
      "email": email,
    };

    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString("user_name", name);
    await prefs.setString("user_gender", gender);
    await prefs.setString("user_age", age);
    await prefs.setString("user_address", address);
    await prefs.setString("user_email", email);
  }

  // GET USER PROFILE (Instant from cache)
  Map<String, String> get userProfileSync => _cachedProfile;

  Future<Map<String, String>> getUserProfile() async {
    if (_cachedProfile["name"] != null && _cachedProfile["name"]!.isNotEmpty) {
      return _cachedProfile;
    }
    SharedPreferences prefs = await SharedPreferences.getInstance();
    _cachedProfile = {
      "name": prefs.getString("user_name") ?? "",
      "gender": prefs.getString("user_gender") ?? "Male",
      "age": prefs.getString("user_age") ?? "",
      "address": prefs.getString("user_address") ?? "",
      "email": prefs.getString("user_email") ?? "",
    };
    return _cachedProfile;
  }

  // CHECK HAS COMPLETED PROFILE (Name filled)
  Future<bool> hasCompletedProfile() async {
    if (_cachedProfile["name"] != null && _cachedProfile["name"]!.trim().isNotEmpty) {
      return true;
    }
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? name = prefs.getString("user_name");
    return name != null && name.trim().isNotEmpty;
  }

  // BIOMETRIC LOGIN PREFERENCE
  Future<void> setBiometricEnabled(bool enabled) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setBool("biometric_enabled", enabled);
  }

  Future<bool> isBiometricEnabled() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getBool("biometric_enabled") ?? false;
  }
}
