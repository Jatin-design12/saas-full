class ApiConstants {
  static String hostIp = 'evegah.cloud'; // default IP address (Hostinger VPS)
  
  static String get baseUrl {
    if (hostIp.startsWith('http://') || hostIp.startsWith('https://')) {
      return hostIp.endsWith('/') ? '${hostIp}api' : '$hostIp/api';
    }
    // If it's a domain name (like evegah.cloud)
    if (hostIp.contains('evegah.cloud') || !RegExp(r'^[0-9\.]+$').hasMatch(hostIp)) {
      return 'https://$hostIp/api';
    }
    // Default to IP + port 5002 for production/fallback
    return 'http://$hostIp:5002/api';
  }
  
  static const String batteriesEndpoint = '/batteries';
}
