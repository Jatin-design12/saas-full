import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/session_service.dart';

class ProfileService {
  // --- SINGLETON SETUP ---
  static final ProfileService _instance = ProfileService._internal();
  factory ProfileService() {
    return _instance;
  }
  ProfileService._internal();

  // --- USER DATA ---
  String userName = "Evegah Rider";
  String phoneNumber = "+91 98765 43210";
  String email = "rider@evegah.com";
  String gender = "Male";
  String age = "24";
  String address = "Vadodara, Gujarat";
  String kycStatus = "Verified";
  bool isBiometricEnabled = false;

  String? profileImagePath;
  String? dlImagePath;

  String get userGender => gender;
  set userGender(String val) => gender = val;

  String get userAddress => address;
  set userAddress(String val) => address = val;

  // Load from SessionService SharedPreferences
  Future<void> fetchUserData() async {
    final session = SessionService();
    final profile = await session.getUserProfile();
    final mobile = await session.getUserMobile();
    isBiometricEnabled = await session.isBiometricEnabled();

    if (profile['name'] != null && profile['name']!.isNotEmpty) {
      userName = profile['name']!;
    }
    if (mobile != null && mobile.isNotEmpty) {
      phoneNumber = mobile;
    }
    if (profile['email'] != null && profile['email']!.isNotEmpty) {
      email = profile['email']!;
    }
    if (profile['gender'] != null && profile['gender']!.isNotEmpty) {
      gender = profile['gender']!;
    }
    if (profile['age'] != null && profile['age']!.isNotEmpty) {
      age = profile['age']!;
    }
    if (profile['address'] != null && profile['address']!.isNotEmpty) {
      address = profile['address']!;
    }
  }

  Future<bool> updateFullProfile({
    required String name,
    required String userEmail,
    required String userAge,
    required String userAddress,
    required bool enableBiometric,
  }) async {
    userName = name;
    email = userEmail;
    age = userAge;
    address = userAddress;
    isBiometricEnabled = enableBiometric;

    final session = SessionService();
    await session.saveUserProfile(
      name: name,
      gender: gender,
      age: userAge,
      address: userAddress,
      email: userEmail,
    );
    await session.setBiometricEnabled(enableBiometric);

    try {
      await http.post(
        Uri.parse('${AppConstants.apiBaseUrl}/renters'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'mobile': phoneNumber,
          'email': userEmail,
          'address': userAddress,
          'age': userAge,
          'gender': gender,
        }),
      ).timeout(const Duration(seconds: 4));
    } catch (e) {
      debugPrint("Backend profile sync error: $e");
    }

    return true;
  }

  Future<bool> updateUserName(String newName) async {
    userName = newName;
    await SessionService().saveUserProfile(
      name: newName,
      gender: gender,
      age: age,
      address: address,
      email: email,
    );
    return true;
  }

  Future<void> submitKycDocuments() async {
    kycStatus = "Under Review";
  }
}