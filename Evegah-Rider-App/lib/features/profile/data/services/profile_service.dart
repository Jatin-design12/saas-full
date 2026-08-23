import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/session_service.dart';

class ProfileService {
  // =========================================================
  // SINGLETON
  // =========================================================

  static final ProfileService _instance = ProfileService._internal();

  factory ProfileService() {
    return _instance;
  }

  ProfileService._internal();

  // =========================================================
  // USER DATA
  // =========================================================

  String userName = "Evegah Rider";
  String phoneNumber = "+91 98765 43210";
  String email = "rider@evegah.com";
  String gender = "Male";

  // Changed from age to date of birth
  String dateOfBirth = "";

  String address = "Vadodara, Gujarat";

  String kycStatus = "Verified";

  bool isBiometricEnabled = false;

  String? profileImagePath;
  String? dlImagePath;

  // =========================================================
  // GETTERS / SETTERS
  // =========================================================

  String get userGender => gender;

  set userGender(String val) {
    gender = val;
  }

  String get userAddress => address;

  set userAddress(String val) {
    address = val;
  }

  String get userDateOfBirth => dateOfBirth;

  set userDateOfBirth(String val) {
    dateOfBirth = val;
  }

  // =========================================================
  // LOAD USER DATA
  // =========================================================

  Future<void> fetchUserData() async {
    final session = SessionService();

    final profile = await session.getUserProfile();
    final mobile = await session.getUserMobile();

    isBiometricEnabled =
        await session.isBiometricEnabled();

    if (profile['name'] != null &&
        profile['name']!.isNotEmpty) {
      userName = profile['name']!;
    }

    if (mobile != null &&
        mobile.isNotEmpty) {
      phoneNumber = mobile;
    }

    if (profile['email'] != null &&
        profile['email']!.isNotEmpty) {
      email = profile['email']!;
    }

    if (profile['gender'] != null &&
        profile['gender']!.isNotEmpty) {
      gender = profile['gender']!;
    }

    // New DOB field
    if (profile['dateOfBirth'] != null &&
        profile['dateOfBirth']!.isNotEmpty) {
      dateOfBirth = profile['dateOfBirth']!;
    }

    // Backward compatibility:
    // If old saved data contains "age",
    // don't use it as DOB.
    if (profile['address'] != null &&
        profile['address']!.isNotEmpty) {
      address = profile['address']!;
    }
  }

  // =========================================================
  // UPDATE COMPLETE PROFILE
  // =========================================================

  Future<bool> updateFullProfile({
    required String name,
    required String userEmail,
    required String userDateOfBirth,
    required String userAddress,
    required bool enableBiometric,
  }) async {
    userName = name;
    email = userEmail;
    dateOfBirth = userDateOfBirth;
    address = userAddress;
    isBiometricEnabled = enableBiometric;

    final session = SessionService();

    await session.saveUserProfile(
      name: name,
      gender: gender,
      age: userDateOfBirth,
      address: userAddress,
      email: userEmail,
    );

    await session.setBiometricEnabled(
      enableBiometric,
    );

    try {
      await http
          .post(
            Uri.parse(
              '${AppConstants.apiBaseUrl}/renters',
            ),
            headers: {
              'Content-Type': 'application/json',
            },
            body: jsonEncode({
              'name': name,
              'mobile': phoneNumber,
              'email': userEmail,
              'address': userAddress,

              // Send DOB to backend
              'dateOfBirth': userDateOfBirth,

              'gender': gender,
            }),
          )
          .timeout(
            const Duration(seconds: 4),
          );
    } catch (e) {
      debugPrint(
        "Backend profile sync error: $e",
      );
    }

    return true;
  }

  // =========================================================
  // UPDATE USER NAME
  // =========================================================

  Future<bool> updateUserName(
    String newName,
  ) async {
    userName = newName;

    await SessionService().saveUserProfile(
      name: newName,
      gender: gender,
      age: dateOfBirth,
      address: address,
      email: email,
    );

    return true;
  }

  // =========================================================
  // KYC
  // =========================================================

  Future<void> submitKycDocuments() async {
    kycStatus = "Under Review";
  }
}