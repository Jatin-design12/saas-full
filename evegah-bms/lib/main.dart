import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:evegah_maintenance/core/services/storage_service.dart';
import 'package:evegah_maintenance/core/storage/local_storage_service.dart';
import 'package:evegah_maintenance/core/services/sync_service.dart';

import 'app/app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Load saved backend server IP before running app
  await StorageService.loadServerIp();

  // Initialize Hive durable offline storage
  try {
    await LocalStorageService.init();
    // Start background sync engine
    SyncService().startPeriodicSync();
  } catch (e) {
    debugPrint('[main] LocalStorageService init warning: $e');
  }

  runApp(const ProviderScope(child: App()));
}
