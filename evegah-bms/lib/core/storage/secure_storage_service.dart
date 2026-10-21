import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  static const String _keyAuthToken = 'auth_token';
  static const String _keyUserId = 'user_id';
  static const String _keyUserEmail = 'user_email';
  static const String _keyUserName = 'user_name';
  static const String _keyUserRole = 'user_role';
  static const String _keyUserZone = 'user_zone';
  static const String _keyPermissions = 'user_permissions';
  static const String _keyServerIp = 'server_ip';

  // Auth Token
  static Future<void> saveAuthToken(String token) async {
    await _storage.write(key: _keyAuthToken, value: token);
  }

  static Future<String?> getAuthToken() async {
    return await _storage.read(key: _keyAuthToken);
  }

  static Future<void> clearAuthToken() async {
    await _storage.delete(key: _keyAuthToken);
  }

  // User Profile
  static Future<void> saveUserSession({
    required String token,
    required String userId,
    required String email,
    required String name,
    required String role,
    required String zone,
    String? permissionsJson,
  }) async {
    await _storage.write(key: _keyAuthToken, value: token);
    await _storage.write(key: _keyUserId, value: userId);
    await _storage.write(key: _keyUserEmail, value: email);
    await _storage.write(key: _keyUserName, value: name);
    await _storage.write(key: _keyUserRole, value: role);
    await _storage.write(key: _keyUserZone, value: zone);
    if (permissionsJson != null) {
      await _storage.write(key: _keyPermissions, value: permissionsJson);
    }
  }

  static Future<Map<String, String?>> getUserSession() async {
    return {
      'token': await _storage.read(key: _keyAuthToken),
      'userId': await _storage.read(key: _keyUserId),
      'email': await _storage.read(key: _keyUserEmail),
      'name': await _storage.read(key: _keyUserName),
      'role': await _storage.read(key: _keyUserRole),
      'zone': await _storage.read(key: _keyUserZone),
      'permissions': await _storage.read(key: _keyPermissions),
    };
  }

  static Future<void> clearSession() async {
    await _storage.delete(key: _keyAuthToken);
    await _storage.delete(key: _keyUserId);
    await _storage.delete(key: _keyUserEmail);
    await _storage.delete(key: _keyUserName);
    await _storage.delete(key: _keyUserRole);
    await _storage.delete(key: _keyUserZone);
    await _storage.delete(key: _keyPermissions);
  }

  // Server Host IP
  static Future<void> saveServerIp(String ip) async {
    await _storage.write(key: _keyServerIp, value: ip);
  }

  static Future<String?> getServerIp() async {
    return await _storage.read(key: _keyServerIp);
  }
}
