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

  String userName = "";
  String phoneNumber = "";
  String email = "";
  String gender = "Male";

  // Changed from age to date of birth
  String dateOfBirth = "";

  String address = "";
  String aadhaarNumber = "";

  String kycStatus = "Verified";

  bool isBiometricEnabled = false;

  String? profileImagePath;
  String? dlImagePath;

  // =========================================================
  // FAST INITIALIZATION (0ms load on app startup)
  // =========================================================

  Future<void> initFromSession() async {
    final session = SessionService();
    await session.init();

    final profile = session.userProfileSync;
    final mobile = session.userMobileSync;

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
      dateOfBirth = profile['age']!;
    }
    if (profile['address'] != null && profile['address']!.isNotEmpty) {
      address = profile['address']!;
    }
    if (profile['aadhaar'] != null && profile['aadhaar']!.isNotEmpty) {
      aadhaarNumber = profile['aadhaar']!;
    }
    profileImagePath = await session.getUserProfileImage();
  }

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
  // LOAD USER DATA (Instant Memory + Background Remote Sync)
  // =========================================================

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
      dateOfBirth = profile['age']!;
    }

    if (profile['address'] != null && profile['address']!.isNotEmpty) {
      address = profile['address']!;
    }

    // Dynamic backend sync for already registered user in background
    if (phoneNumber.isNotEmpty) {
      final cleanMobile = phoneNumber.replaceAll(RegExp(r'\D'), '');
      final last10 = cleanMobile.length >= 10 ? cleanMobile.substring(cleanMobile.length - 10) : cleanMobile;
      final checkUrls = [
        '${AppConstants.apiBaseUrl}/renters?search=${Uri.encodeComponent(last10)}',
        'http://localhost:5000/api/renters?search=${Uri.encodeComponent(last10)}',
        'http://192.168.1.4:5000/api/renters?search=${Uri.encodeComponent(last10)}',
      ];

      for (final url in checkUrls) {
        try {
          final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 2));
          if (res.statusCode == 200) {
            final data = json.decode(res.body);
            if (data['status'] == 'success' && data['data'] != null) {
              final List renters = data['data'];
              if (renters.isNotEmpty) {
                final r = renters.first;
                final backendName = r['rider_name'] ?? r['name'] ?? r['full_name'];
                final backendEmail = r['email'];
                final backendDob = r['date_of_birth'] ?? r['dateOfBirth'] ?? r['dob'];
                final backendAddress = r['address'];
                final backendGender = r['gender'];

                if (backendName != null && backendName.toString().trim().isNotEmpty) {
                  userName = backendName.toString().trim();
                }
                if (backendEmail != null && backendEmail.toString().trim().isNotEmpty) {
                  email = backendEmail.toString().trim();
                }
                if (backendDob != null && backendDob.toString().trim().isNotEmpty) {
                  dateOfBirth = backendDob.toString().trim();
                }
                if (backendAddress != null && backendAddress.toString().trim().isNotEmpty) {
                  address = backendAddress.toString().trim();
                }
                if (backendGender != null && backendGender.toString().trim().isNotEmpty) {
                  gender = backendGender.toString().trim();
                }

                await session.saveUserProfile(
                  name: userName,
                  gender: gender,
                  age: dateOfBirth,
                  address: address,
                  email: email,
                );
                break;
              }
            }
          }
        } catch (_) {}
      }
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