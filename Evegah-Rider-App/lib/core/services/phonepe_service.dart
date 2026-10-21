import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../constants/app_constants.dart';
import 'session_service.dart';
import '../../features/profile/data/services/profile_service.dart';

class PhonePePaymentResult {
  final bool success;
  final String txId;
  final String? phonepeTxId;
  final String message;

  PhonePePaymentResult({
    required this.success,
    required this.txId,
    this.phonepeTxId,
    required this.message,
  });
}

class PhonePeService {
  static final PhonePeService _instance = PhonePeService._internal();
  factory PhonePeService() => _instance;
  PhonePeService._internal();

  List<String> _getEndpoints(String path) {
    final List<String> list = ['${AppConstants.apiBaseUrl}$path'];
    if (kDebugMode) {
      if (kIsWeb) {
        list.add('http://localhost:5000/api$path');
      } else {
        list.add('http://192.168.1.4:5000/api$path');
        list.add('http://10.0.2.2:5000/api$path');
        list.add('http://localhost:5000/api$path');
      }
    }
    return list;
  }

  /// Initiates a PhonePe payment transaction with the backend
  Future<Map<String, dynamic>?> initiatePayment({
    required double amount,
    required String purpose, // 'wallet' or 'ride'
    String? reservationId,
    String? returnUrl,
  }) async {
    final profile = ProfileService();
    final cleanPhone = profile.phoneNumber.replaceAll(RegExp(r'\D'), '');
    final userMobile = cleanPhone.isNotEmpty
        ? cleanPhone
        : (SessionService().userMobileSync?.replaceAll(RegExp(r'\D'), '') ?? '1800 889 8791');
    final userProfile = await SessionService().getUserProfile();
    final riderName = (userProfile['name'] != null && userProfile['name']!.isNotEmpty)
        ? userProfile['name']!
        : (profile.userName.isNotEmpty ? profile.userName : 'Evegah Rider');
    String resolvedEmail = profile.email.trim();
    if (resolvedEmail.isEmpty && userProfile['email'] != null) {
      resolvedEmail = userProfile['email']!.trim();
    }
    final userEmail = resolvedEmail.isNotEmpty ? resolvedEmail : 'rider_$userMobile@evegah.com';

    final endpoints = _getEndpoints('/payments/phonepe/initiate');

    for (final url in endpoints) {
      try {
        final res = await http.post(
          Uri.parse(url),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'amount': amount,
            'rider_name': riderName,
            'mobile': userMobile,
            'email': userEmail,
            'purpose': purpose,
            'reservation_id': reservationId,
            'return_url': returnUrl ?? 'https://evegah.cloud/payment/success',
          }),
        ).timeout(const Duration(seconds: 5));

        if (res.statusCode == 200) {
          final data = jsonDecode(res.body);
          if (data['status'] == 'success' && data['data'] != null) {
            final Map<String, dynamic> result = Map<String, dynamic>.from(data['data']);
            if (result['checkout_url'] != null) {
              final reqUri = Uri.parse(url);
              final cUri = Uri.parse(result['checkout_url'].toString());
              if (cUri.host == 'localhost' || cUri.host.startsWith('192.168.') || cUri.host == '10.0.2.2') {
                result['checkout_url'] = cUri.replace(
                  scheme: reqUri.scheme,
                  host: reqUri.host,
                  port: reqUri.hasPort ? reqUri.port : null,
                ).toString();
              }
            }
            return result;
          }
        }
      } catch (e) {
        debugPrint('PhonePe initiate attempt failed at $url: $e');
      }
    }
    return null;
  }

  /// Fetches a dynamic PhonePe QR code for on-screen scanning or manual UPI intent
  Future<Map<String, dynamic>?> getDynamicQr({
    required double amount,
    required String purpose,
    String? reservationId,
  }) async {
    final profile = ProfileService();
    final cleanPhone = profile.phoneNumber.replaceAll(RegExp(r'\D'), '');
    final userMobile = cleanPhone.isNotEmpty
        ? cleanPhone
        : (SessionService().userMobileSync?.replaceAll(RegExp(r'\D'), '') ?? '1800 889 8791');
    final riderName = profile.userName.isNotEmpty ? profile.userName : 'Evegah Rider';

    final endpoints = _getEndpoints('/payments/phonepe/qr');
    for (final url in endpoints) {
      try {
        final res = await http.post(
          Uri.parse(url),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'amount': amount,
            'rider_name': riderName,
            'mobile': userMobile,
            'purpose': purpose,
            'reservation_id': reservationId,
          }),
        ).timeout(const Duration(seconds: 4));

        if (res.statusCode == 200) {
          final data = jsonDecode(res.body);
          if (data['status'] == 'success' && data['data'] != null) {
            return Map<String, dynamic>.from(data['data']);
          }
        }
      } catch (_) {}
    }
    return null;
  }

  /// Launch PhonePe checkout in external browser or UPI app
  Future<bool> launchPhonePeCheckout(String checkoutUrl) async {
    try {
      final uri = Uri.parse(checkoutUrl);
      if (await canLaunchUrl(uri)) {
        return await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      debugPrint('Error launching PhonePe checkout: $e');
    }
    return false;
  }

  /// Checks the transaction status from backend
  Future<String> checkPaymentStatus(String txId) async {
    final endpoints = _getEndpoints('/payments/phonepe/status/$txId');
    for (final url in endpoints) {
      try {
        final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 4));
        if (res.statusCode == 200) {
          final data = jsonDecode(res.body);
          if (data['status'] == 'success' && data['data'] != null) {
            final st = data['data']['status'] ?? data['data']['payment_status'] ?? 'PENDING';
            return st.toString().toUpperCase();
          }
        }
      } catch (_) {}
    }
    return 'PENDING';
  }
}
