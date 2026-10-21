import 'package:hive_flutter/hive_flutter.dart';
import 'dart:convert';
import 'package:flutter/foundation.dart';

class LocalStorageService {
  static const String _swapsBoxName = 'offline_swaps_queue';
  static const String _attendanceBoxName = 'offline_attendance_queue';
  static const String _diagnosticsBoxName = 'offline_diagnostics_queue';
  static const String _cacheBoxName = 'offline_app_cache';

  static bool _isInitialized = false;
  static bool get isInitialized => _isInitialized;

  /// Initialize Hive and open durable queues
  static Future<void> init() async {
    if (_isInitialized) return;
    try {
      await Hive.initFlutter();
      await Future.wait([
        Hive.openBox<String>(_swapsBoxName),
        Hive.openBox<String>(_attendanceBoxName),
        Hive.openBox<String>(_diagnosticsBoxName),
        Hive.openBox<String>(_cacheBoxName),
      ]);
      _isInitialized = true;
      debugPrint('[LocalStorageService] Hive initialized and durable queues opened.');
    } catch (e) {
      debugPrint('[LocalStorageService] Initialization error: $e');
      _isInitialized = false;
      rethrow;
    }
  }

  // -------------------------------------------------------------
  // 1. OFFLINE BATTERY SWAP QUEUE
  // -------------------------------------------------------------
  static Future<void> queueBatterySwap(Map<String, dynamic> swapData) async {
    await _ensureInit();
    final box = Hive.box<String>(_swapsBoxName);
    final id = swapData['client_tx_id'] ?? 'SWAP_${DateTime.now().millisecondsSinceEpoch}';
    final payload = Map<String, dynamic>.from(swapData);
    payload['client_tx_id'] = id;
    payload['queued_at'] = DateTime.now().toIso8601String();
    payload['retry_count'] = payload['retry_count'] ?? 0;
    payload['sync_status'] = 'pending';
    await box.put(id, jsonEncode(payload));
  }

  static Future<List<Map<String, dynamic>>> getQueuedBatterySwaps() async {
    await _ensureInit();
    final box = Hive.box<String>(_swapsBoxName);
    return box.values.map((item) {
      try {
        return jsonDecode(item) as Map<String, dynamic>;
      } catch (_) {
        return <String, dynamic>{};
      }
    }).where((item) => item.isNotEmpty).toList();
  }

  static Future<void> removeQueuedBatterySwap(String clientTxId) async {
    await _ensureInit();
    final box = Hive.box<String>(_swapsBoxName);
    await box.delete(clientTxId);
  }

  static Future<void> updateSwapRetryCount(String clientTxId, int retryCount, String? lastError) async {
    await _ensureInit();
    final box = Hive.box<String>(_swapsBoxName);
    final raw = box.get(clientTxId);
    if (raw != null) {
      final data = jsonDecode(raw) as Map<String, dynamic>;
      data['retry_count'] = retryCount;
      if (lastError != null) data['last_error'] = lastError;
      data['last_attempt_at'] = DateTime.now().toIso8601String();
      await box.put(clientTxId, jsonEncode(data));
    }
  }

  // -------------------------------------------------------------
  // 2. OFFLINE ATTENDANCE QUEUE
  // -------------------------------------------------------------
  static Future<void> queueAttendanceEvent(Map<String, dynamic> eventData) async {
    await _ensureInit();
    final box = Hive.box<String>(_attendanceBoxName);
    final id = eventData['client_tx_id'] ?? 'ATT_${DateTime.now().millisecondsSinceEpoch}';
    final payload = Map<String, dynamic>.from(eventData);
    payload['client_tx_id'] = id;
    payload['queued_at'] = DateTime.now().toIso8601String();
    payload['retry_count'] = payload['retry_count'] ?? 0;
    payload['sync_status'] = 'pending';
    await box.put(id, jsonEncode(payload));
  }

  static Future<List<Map<String, dynamic>>> getQueuedAttendanceEvents() async {
    await _ensureInit();
    final box = Hive.box<String>(_attendanceBoxName);
    return box.values.map((item) {
      try {
        return jsonDecode(item) as Map<String, dynamic>;
      } catch (_) {
        return <String, dynamic>{};
      }
    }).where((item) => item.isNotEmpty).toList();
  }

  static Future<void> removeQueuedAttendanceEvent(String clientTxId) async {
    await _ensureInit();
    final box = Hive.box<String>(_attendanceBoxName);
    await box.delete(clientTxId);
  }

  // -------------------------------------------------------------
  // 3. GENERIC CACHE
  // -------------------------------------------------------------
  static Future<void> putCache(String key, dynamic value) async {
    await _ensureInit();
    final box = Hive.box<String>(_cacheBoxName);
    await box.put(key, jsonEncode(value));
  }

  static Future<dynamic> getCache(String key) async {
    await _ensureInit();
    final box = Hive.box<String>(_cacheBoxName);
    final raw = box.get(key);
    if (raw == null) return null;
    try {
      return jsonDecode(raw);
    } catch (_) {
      return null;
    }
  }

  static Future<void> deleteCache(String key) async {
    await _ensureInit();
    final box = Hive.box<String>(_cacheBoxName);
    await box.delete(key);
  }

  static Future<void> clearAllQueues() async {
    await _ensureInit();
    await Future.wait([
      Hive.box<String>(_swapsBoxName).clear(),
      Hive.box<String>(_attendanceBoxName).clear(),
      Hive.box<String>(_diagnosticsBoxName).clear(),
    ]);
  }

  static Future<void> _ensureInit() async {
    if (!_isInitialized) {
      await init();
    }
  }
}
