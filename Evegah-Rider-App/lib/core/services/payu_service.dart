import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../constants/app_constants.dart';
import 'session_service.dart';
import '../../features/profile/data/services/profile_service.dart';

class PayUPaymentResult {
  final bool success;
  final String txId;
  final String? payuId;
  final String message;

  PayUPaymentResult({
    required this.success,
    required this.txId,
    this.payuId,
    required this.message,
  });
}

class PayUService {
  static final PayUService _instance = PayUService._internal();
  factory PayUService() => _instance;
  PayUService._internal();

  List<String> _getEndpoints(String path) {
    final List<String> list = [];
    if (kIsWeb) {
      list.add('http://localhost:5000/api$path');
      list.add('http://127.0.0.1:5000/api$path');
      list.add('${AppConstants.apiBaseUrl}$path');
    } else {
      list.add('${AppConstants.apiBaseUrl}$path');
      list.add('http://192.168.1.4:5000/api$path');
      list.add('http://10.0.2.2:5000/api$path');
      list.add('http://localhost:5000/api$path');
    }
    return list;
  }

  /// Initiates a PayU payment by generating the official hash & parameters from the backend
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
        : (SessionService().userMobileSync?.replaceAll(RegExp(r'\D'), '') ?? '9876543210');
    final userProfile = await SessionService().getUserProfile();
    final riderName = (userProfile['name'] != null && userProfile['name']!.isNotEmpty)
        ? userProfile['name']!
        : (profile.userName.isNotEmpty ? profile.userName : 'Evegah Rider');
    final userEmail = profile.email.isNotEmpty ? profile.email : 'rider@evegah.com';

    final endpoints = _getEndpoints('/payments/payu/initiate');

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
        ).timeout(const Duration(seconds: 4));

        if (res.statusCode == 200) {
          final data = jsonDecode(res.body);
          if (data['status'] == 'success' && data['data'] != null) {
            final Map<String, dynamic> result = Map<String, dynamic>.from(data['data']);
            // If checkout_url is provided, ensure it uses the host/port of the endpoint that worked
            if (result['checkout_url'] != null) {
              final reqUri = Uri.parse(url);
              final cUri = Uri.parse(result['checkout_url'].toString());
              result['checkout_url'] = cUri.replace(
                scheme: reqUri.scheme,
                host: reqUri.host,
                port: reqUri.hasPort ? reqUri.port : null,
              ).toString();
            }
            return result;
          }
        }
      } catch (_) {}
    }
    return null;
  }

  /// Launch PayU hosted checkout URL in external browser / custom tab
  Future<bool> launchPayUCheckout(String actionUrl, Map<String, dynamic> payuParams) async {
    try {
      // 1. First priority: Launch backend checkout POST relay
      // PayU test.payu.in blocks direct GET requests with 403 Forbidden.
      // The backend checkout_url serves an auto-submitting POST form that connects directly.
      if (payuParams['checkout_url'] != null && payuParams['checkout_url'].toString().isNotEmpty) {
        final checkoutUri = Uri.parse(payuParams['checkout_url'].toString());
        if (await canLaunchUrl(checkoutUri)) {
          return await launchUrl(checkoutUri, mode: LaunchMode.externalApplication);
        }
      }

      // 2. Fallback: Launch actionUrl directly
      final uri = Uri.parse(actionUrl).replace(queryParameters: {
        'key': payuParams['key']?.toString() ?? '',
        'txnid': payuParams['txnid']?.toString() ?? '',
        'amount': payuParams['amount']?.toString() ?? '',
        'productinfo': payuParams['productinfo']?.toString() ?? '',
        'firstname': payuParams['firstname']?.toString() ?? '',
        'email': payuParams['email']?.toString() ?? '',
        'phone': payuParams['phone']?.toString() ?? '',
        'surl': payuParams['surl']?.toString() ?? '',
        'furl': payuParams['furl']?.toString() ?? '',
        'hash': payuParams['hash']?.toString() ?? '',
      });

      if (await canLaunchUrl(uri)) {
        return await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      debugPrint('Error launching PayU checkout: $e');
    }
    return false;
  }

  /// Checks the real transaction status from backend
  Future<String> checkPaymentStatus(String txnid) async {
    final endpoints = _getEndpoints('/payments/payu/status/$txnid');
    for (final url in endpoints) {
      try {
        final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 4));
        if (res.statusCode == 200) {
          final data = jsonDecode(res.body);
          if (data['status'] == 'success' && data['data'] != null) {
            return (data['data']['status'] ?? 'Pending').toString();
          }
        }
      } catch (_) {}
    }
    return 'Pending';
  }
}
