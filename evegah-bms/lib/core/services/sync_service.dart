import 'dart:async';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../network/api_client.dart';
import '../storage/local_storage_service.dart';

class SyncService {
  static final SyncService _instance = SyncService._internal();
  factory SyncService() => _instance;
  SyncService._internal();

  bool _isSyncing = false;
  Timer? _periodicSyncTimer;

  bool get isSyncing => _isSyncing;

  /// Start periodic sync attempt every 30 seconds
  void startPeriodicSync() {
    _periodicSyncTimer?.cancel();
    _periodicSyncTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      syncQueues();
    });
    // Trigger immediate sync on start
    syncQueues();
  }

  void stopPeriodicSync() {
    _periodicSyncTimer?.cancel();
    _periodicSyncTimer = null;
  }

  /// Sync all queued operations (swaps and attendance)
  Future<Map<String, int>> syncQueues() async {
    if (_isSyncing) return {'swaps': 0, 'attendance': 0};
    _isSyncing = true;

    int syncedSwaps = 0;
    int syncedAttendance = 0;

    try {
      final client = ApiClient();
      client.updateBaseUrl();

      // 1. Sync Queued Battery Swaps
      final queuedSwaps = await LocalStorageService.getQueuedBatterySwaps();
      for (final swap in queuedSwaps) {
        final txId = swap['client_tx_id']?.toString() ?? '';
        final retryCount = (swap['retry_count'] as int?) ?? 0;

        if (retryCount >= 5) {
          debugPrint('[SyncService] Swap $txId exceeded retry limit (5). Skipping.');
          continue;
        }

        try {
          final res = await client.dio.post(
            '/batteries/swap',
            data: swap,
          );

          if (res.statusCode == 200 || res.statusCode == 201) {
            await LocalStorageService.removeQueuedBatterySwap(txId);
            syncedSwaps++;
            debugPrint('[SyncService] Successfully synced battery swap: $txId');
          } else {
            await LocalStorageService.updateSwapRetryCount(
              txId,
              retryCount + 1,
              'HTTP ${res.statusCode}',
            );
          }
        } on DioException catch (dioErr) {
          debugPrint('[SyncService] Network error syncing swap $txId: ${dioErr.message}');
          await LocalStorageService.updateSwapRetryCount(
            txId,
            retryCount + 1,
            dioErr.message,
          );
        } catch (e) {
          debugPrint('[SyncService] Error syncing swap $txId: $e');
        }
      }

      // 2. Sync Queued Attendance Events
      final queuedAttendance = await LocalStorageService.getQueuedAttendanceEvents();
      for (final att in queuedAttendance) {
        final txId = att['client_tx_id']?.toString() ?? '';
        final eventType = att['event_type'] ?? 'clock-in';
        final endpoint = eventType == 'clock-out' ? '/attendance/clock-out' : '/attendance/clock-in';

        try {
          final res = await client.dio.post(
            endpoint,
            data: att,
          );

          if (res.statusCode == 200 || res.statusCode == 201) {
            await LocalStorageService.removeQueuedAttendanceEvent(txId);
            syncedAttendance++;
            debugPrint('[SyncService] Successfully synced attendance event: $txId');
          }
        } catch (e) {
          debugPrint('[SyncService] Error syncing attendance event $txId: $e');
        }
      }
    } finally {
      _isSyncing = false;
    }

    return {'swaps': syncedSwaps, 'attendance': syncedAttendance};
  }
}
