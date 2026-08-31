import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:evegah_rider_app/core/constants/app_constants.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  List<Map<String, dynamic>> notifications = [
    {
      "id": "notif-wallet-01",
      "type": "payment",
      "title": "💳 Wallet Top-Up Successful",
      "message": "₹500.00 successfully added to your EVegah Wallet.",
      "time": "Just now",
      "isRead": false,
    },
    {
      "id": "notif-booking-02",
      "type": "ride",
      "title": "🛵 EV Ride Booking Alert",
      "message": "Your EV Scooter reservation in Gotri Zone is confirmed & ready for pickup.",
      "time": "15 mins ago",
      "isRead": false,
    },
    {
      "id": "notif-bms-03",
      "type": "system",
      "title": "⚡ BMS Alert: Low Battery (18% SOC)",
      "message": "Vehicle battery is low (18% SOC). Swap at the nearest EVegah Swap Station.",
      "time": "1 hour ago",
      "isRead": false,
    },
    {
      "id": "notif-offer-04",
      "type": "promo",
      "title": "🎁 Special Offer Alert: 25% OFF",
      "message": "Use code EVEGAH25 to get 25% off on your next weekly package booking!",
      "time": "Yesterday",
      "isRead": false,
    },
    {
      "id": "notif-announce-05",
      "type": "system",
      "title": "📢 System Announcement",
      "message": "EVegah 24x7 Stations are active across Gotri, Alkapuri & Subhanpura zones.",
      "time": "2 days ago",
      "isRead": true,
    },
  ];

  Future<List<Map<String, dynamic>>> fetchNotifications() async {
    final urls = [
      '${AppConstants.apiBaseUrl}/notifications',
      'http://192.168.1.4:5000/api/notifications',
      'http://localhost:5000/api/notifications',
    ];

    for (final url in urls) {
      try {
        final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 3));
        if (res.statusCode == 200) {
          final body = json.decode(res.body);
          if (body['status'] == 'success' && body['data'] is List) {
            final List rawList = body['data'];
            notifications = rawList.map((item) => {
              "id": item['id'] ?? 'n_${DateTime.now().millisecondsSinceEpoch}',
              "type": item['type'] ?? 'system',
              "title": item['title'] ?? 'Notification',
              "message": item['message'] ?? '',
              "time": item['created_at'] != null ? _formatTime(item['created_at'].toString()) : 'Recently',
              "isRead": item['read'] ?? false,
            }).toList();
            break;
          }
        }
      } catch (e) {
        debugPrint("Failed to fetch live notifications from $url: $e");
      }
    }
    return notifications;
  }

  String _formatTime(String isoString) {
    try {
      final dt = DateTime.parse(isoString);
      final diff = DateTime.now().difference(dt);
      if (diff.inMinutes < 60) return "${diff.inMinutes} mins ago";
      if (diff.inHours < 24) return "${diff.inHours} hours ago";
      return "${diff.inDays} days ago";
    } catch (_) {
      return "Recently";
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await http.post(Uri.parse('${AppConstants.apiBaseUrl}/notifications/mark-read')).timeout(const Duration(seconds: 2));
    } catch (_) {}

    for (var notification in notifications) {
      notification['isRead'] = true;
    }
  }

  int get unreadCount {
    return notifications.where((n) => n['isRead'] == false).length;
  }
}