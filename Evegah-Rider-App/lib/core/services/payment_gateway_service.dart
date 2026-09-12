import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../constants/app_constants.dart';

class PaymentGatewayService {
  static final PaymentGatewayService _instance = PaymentGatewayService._internal();
  factory PaymentGatewayService() => _instance;
  PaymentGatewayService._internal();

  Map<String, dynamic>? _cachedConfig;
  DateTime? _lastFetchTime;

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

  /// Fetches active payment gateway configuration from backend
  Future<Map<String, dynamic>> getPaymentConfig({bool forceRefresh = false}) async {
    if (!forceRefresh && _cachedConfig != null && _lastFetchTime != null) {
      if (DateTime.now().difference(_lastFetchTime!).inMinutes < 2) {
        return _cachedConfig!;
      }
    }

    final endpoints = _getEndpoints('/payments/gateways/config');
    for (final url in endpoints) {
      try {
        final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 4));
        if (res.statusCode == 200) {
          final body = jsonDecode(res.body);
          if (body['status'] == 'success' && body['data'] != null) {
            _cachedConfig = body['data'];
            _lastFetchTime = DateTime.now();
            return _cachedConfig!;
          }
        }
      } catch (e) {
        debugPrint('Failed to get payment config from $url: $e');
      }
    }

    // Default fallback if backend unreachable
    return _cachedConfig ?? {
      'primary_gateway': 'payu',
      'active_gateways': [
        {
          'id': 'payu',
          'name': 'PayU India',
          'provider': 'payu',
          'is_primary': true,
          'key_id': 'WTi3jH',
          'environment': 'test'
        }
      ],
      'payment_methods': {
        'upi': true,
        'card': true,
        'netbanking': true,
        'wallets': true,
        'cash': false
      }
    };
  }

  /// Returns the current primary gateway ID ('payu', 'icici', etc.)
  Future<String> getPrimaryGatewayId() async {
    final cfg = await getPaymentConfig();
    return cfg['primary_gateway']?.toString() ?? 'payu';
  }

  /// Returns active gateways list
  Future<List<Map<String, dynamic>>> getActiveGateways() async {
    final cfg = await getPaymentConfig();
    final list = cfg['active_gateways'];
    if (list is List) {
      return list.map((e) => Map<String, dynamic>.from(e)).toList();
    }
    return [];
  }
}
