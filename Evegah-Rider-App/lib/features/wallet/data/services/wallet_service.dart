import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/session_service.dart';
import '../../../profile/data/services/profile_service.dart';

class WalletService {
  static final WalletService _instance = WalletService._internal();
  factory WalletService() => _instance;
  WalletService._internal();

  double _mainBalance = 0.00;
  double _bonusBalance = 0.00;

  double get mainBalance => _mainBalance;
  double get bonusBalance => _bonusBalance;
  double get totalBalance => _mainBalance + _bonusBalance;

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

  Future<String> _getEffectiveMobile() async {
    final cached = SessionService().userMobileSync;
    if (cached != null && cached.trim().isNotEmpty) {
      return cached.trim();
    }
    final profMobile = ProfileService().phoneNumber;
    if (profMobile.trim().isNotEmpty) {
      return profMobile.trim();
    }
    final sessionMobile = await SessionService().getUserMobile();
    return sessionMobile?.trim() ?? '';
  }

  // --- 1. FETCH LIVE WALLET BALANCE FROM BACKEND ---
  Future<Map<String, double>> fetchWalletBalance() async {
    final mobile = await _getEffectiveMobile();
    final cleanMobile = mobile.replaceAll(RegExp(r'\D'), '');
    final last10 = cleanMobile.length >= 10 ? cleanMobile.slice(-10) : cleanMobile;

    final endpoints = _getEndpoints('/wallet/balance?mobile=${Uri.encodeComponent(last10.isNotEmpty ? last10 : mobile)}');

    for (final url in endpoints) {
      try {
        final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 4));
        if (res.statusCode == 200) {
          final data = json.decode(res.body);
          if (data['status'] == 'success' && data['data'] != null) {
            final fetchedMain = double.tryParse("${data['data']['main_balance']}") ?? 0.0;
            final fetchedBonus = double.tryParse("${data['data']['bonus_balance']}") ?? 0.0;
            if (fetchedMain > 0 || _mainBalance == 0) {
              _mainBalance = fetchedMain;
            }
            _bonusBalance = fetchedBonus;
            return {
              "main": _mainBalance,
              "bonus": _bonusBalance,
              "total": _mainBalance + _bonusBalance,
            };
          }
        }
      } catch (e) {
        debugPrint("Wallet balance info: $e");
      }
    }
    return {
      "main": _mainBalance,
      "bonus": _bonusBalance,
      "total": _mainBalance + _bonusBalance,
    };
  }

  final List<Map<String, dynamic>> _localTransactions = [];

  // --- 2. ADD MONEY (RAZORPAY TOP-UP) ---
  Future<bool> addMoney(double amount, {String paymentMethod = "Razorpay", String? paymentId}) async {
    final mobile = await _getEffectiveMobile();
    final cleanMobile = mobile.replaceAll(RegExp(r'\D'), '');
    final last10 = cleanMobile.length >= 10 ? cleanMobile.slice(-10) : cleanMobile;

    final txRecord = {
      "id": paymentId ?? 'PAY_${DateTime.now().millisecondsSinceEpoch}',
      "title": "Wallet Top-Up",
      "subtitle": "Razorpay Payment ($paymentMethod)",
      "amount": amount,
      "type": "Credit",
      "status": "Success",
      "payment_method": paymentMethod,
      "transaction_id": paymentId ?? 'PAY_${DateTime.now().millisecondsSinceEpoch}',
      "created_at": DateTime.now().toIso8601String(),
    };
    _localTransactions.removeWhere((t) => t['transaction_id'] == txRecord['transaction_id']);
    _localTransactions.insert(0, txRecord);

    final endpoints = _getEndpoints('/wallet/add-money');

    for (final url in endpoints) {
      try {
        final res = await http.post(
          Uri.parse(url),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'mobile': last10.isNotEmpty ? last10 : mobile,
            'amount': amount,
            'payment_method': paymentMethod,
            'razorpay_payment_id': paymentId ?? 'PAY_${DateTime.now().millisecondsSinceEpoch}',
          }),
        ).timeout(const Duration(seconds: 5));

        if (res.statusCode == 200) {
          final data = json.decode(res.body);
          if (data['status'] == 'success') {
            if (data['data'] != null && data['data']['main_balance'] != null) {
              _mainBalance = double.tryParse("${data['data']['main_balance']}") ?? (_mainBalance + amount);
            } else {
              _mainBalance += amount;
            }
            return true;
          }
        }
      } catch (e) {
        debugPrint("Add money info: $e");
      }
    }

    _mainBalance += amount;
    return true;
  }

  // --- 3. WITHDRAW MONEY (RAZORPAY PAYOUT) ---
  Future<bool> withdrawMoney(double amount, {String payoutMethod = "UPI/Bank"}) async {
    final mobile = await _getEffectiveMobile();
    final cleanMobile = mobile.replaceAll(RegExp(r'\D'), '');
    final last10 = cleanMobile.length >= 10 ? cleanMobile.slice(-10) : cleanMobile;

    final endpoints = _getEndpoints('/wallet/withdraw');

    for (final url in endpoints) {
      try {
        final res = await http.post(
          Uri.parse(url),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'mobile': last10.isNotEmpty ? last10 : mobile,
            'amount': amount,
            'payout_method': payoutMethod,
          }),
        ).timeout(const Duration(seconds: 5));

        if (res.statusCode == 200) {
          final data = json.decode(res.body);
          if (data['status'] == 'success') {
            _mainBalance -= amount;
            return true;
          }
        }
      } catch (e) {
        debugPrint("Withdraw info: $e");
      }
    }

    _mainBalance -= amount;
    return true;
  }

  // --- 4. FETCH TRANSACTION HISTORY ---
  Future<List<Map<String, dynamic>>> fetchRecentTransactions() async {
    final mobile = await _getEffectiveMobile();
    final cleanMobile = mobile.replaceAll(RegExp(r'\D'), '');
    final last10 = cleanMobile.length >= 10 ? cleanMobile.slice(-10) : cleanMobile;

    final endpoints = _getEndpoints('/wallet/transactions?mobile=${Uri.encodeComponent(last10.isNotEmpty ? last10 : mobile)}');

    List<Map<String, dynamic>> remoteList = [];
    for (final url in endpoints) {
      try {
        final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 5));
        if (res.statusCode == 200) {
          final data = json.decode(res.body);
          if (data['status'] == 'success' && data['data'] != null) {
            final List list = data['data'];
            remoteList = List<Map<String, dynamic>>.from(list);
            break;
          }
        }
      } catch (e) {
        debugPrint("Transactions fetch info: $e");
      }
    }

    // Merge local and remote avoiding duplicate IDs
    final Map<String, Map<String, dynamic>> merged = {};
    for (final tx in _localTransactions) {
      final key = "${tx['transaction_id'] || tx['id']}";
      merged[key] = tx;
    }
    for (final tx in remoteList) {
      final key = "${tx['transaction_id'] || tx['id'] || tx['_id']}";
      if (!merged.containsKey(key)) {
        merged[key] = tx;
      }
    }

    return merged.values.toList();
  }
}

extension StringSliceExtension on String {
  String slice(int start, [int? end]) {
    final len = length;
    int s = start < 0 ? len + start : start;
    if (s < 0) s = 0;
    if (s > len) s = len;

    int e = end == null ? len : (end < 0 ? len + end : end);
    if (e < 0) e = 0;
    if (e > len) e = len;
    if (s > e) return '';
    return substring(s, e);
  }
}