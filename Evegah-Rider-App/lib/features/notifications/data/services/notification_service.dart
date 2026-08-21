class NotificationService {
  // --- SINGLETON SETUP ---
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() {
    return _instance;
  }
  NotificationService._internal();

  // --- NOTIFICATION DATA ---
  // A list of maps simulating data from Push Notifications
  List<Map<String, dynamic>> notifications = [
    {
      "id": "1",
      "type": "ride",
      "title": "Flexi Pickup & Drop Active 🏁",
      "message": "You can pick up and drop off EV vehicles across different zones seamlessly.",
      "time": "Just now",
      "isRead": false,
    },
    {
      "id": "2",
      "type": "payment",
      "title": "Wallet Recharge Successful",
      "message": "₹500 has been successfully added to your EVegah wallet.",
      "time": "10 mins ago",
      "isRead": false,
    },
    {
      "id": "3",
      "type": "ride",
      "title": "Ride Completed Safely 🍃",
      "message": "Your trip to Cyber City was completed safely. You saved 2.5kg of CO₂!",
      "time": "2 hours ago",
      "isRead": false,
    },
    {
      "id": "4",
      "type": "promo",
      "title": "Weekend Green Offer! 🎉",
      "message": "Use code GREEN50 to get 50% off on your next 2 EV rides.",
      "time": "Yesterday",
      "isRead": true,
    },
    {
      "id": "5",
      "type": "system",
      "title": "Smart Lock System Ready 🔒",
      "message": "Bluetooth keyless unlock is active and ready for your ride.",
      "time": "Yesterday",
      "isRead": true,
    },
    {
      "id": "6",
      "type": "system",
      "title": "App Update Available",
      "message": "Update EVegah to v2.0.0 for faster Bluetooth unlocking.",
      "time": "2 days ago",
      "isRead": true,
    },
  ];

  // --- METHODS ---
  
  // Simulates marking all notifications as read
  Future<void> markAllAsRead() async {
    // Fake a quick network delay
    await Future.delayed(const Duration(milliseconds: 500));
    
    // Loop through and update the status
    for (var notification in notifications) {
      notification['isRead'] = true;
    }
  }

  // Count how many unread notifications we have
  int get unreadCount {
    return notifications.where((n) => n['isRead'] == false).length;
  }
}