import 'package:flutter/material.dart';
import '../../data/services/notification_service.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  final NotificationService _notificationService = NotificationService();
  bool _isLoading = false;
  String _selectedFilter = 'All';

  final List<Map<String, dynamic>> _alertsList = [
    {
      'id': '1',
      'title': 'Flexi Pickup & Drop Active',
      'subtitle': 'You can pick up and drop off EV vehicles across different zones seamlessly.',
      'time': 'Just now',
      'badge': 'New',
      'category': 'Ride & Service',
      'type': 'green',
      'icon': Icons.electric_scooter_rounded,
      'isRead': false,
    },
    {
      'id': '2',
      'title': 'Wallet Recharge Successful',
      'subtitle': '₹500 has been successfully added to your EVegah wallet.',
      'time': '10 mins ago',
      'category': 'Transactions',
      'type': 'purple',
      'icon': Icons.account_balance_wallet_rounded,
      'isRead': false,
    },
    {
      'id': '3',
      'title': 'Ride Completed Safely 🍃',
      'subtitle': 'Your trip to Cyber City was completed safely. You saved 2.5kg of CO₂!',
      'time': '2 hours ago',
      'category': 'Ride & Service',
      'type': 'green',
      'icon': Icons.electric_scooter_rounded,
      'isRead': true,
    },
    {
      'id': '4',
      'title': 'Weekend Green Offer! 🎉',
      'subtitle': 'Use code GREEN50 to get 50% off on your next 2 EV rides.',
      'time': 'Yesterday',
      'category': 'Transactions',
      'type': 'orange',
      'icon': Icons.local_offer_rounded,
      'isRead': true,
    },
    {
      'id': '5',
      'title': 'Smart Lock System Ready 🔒',
      'subtitle': 'Bluetooth keyless unlock is active and ready for your ride.',
      'time': 'Yesterday',
      'category': 'System',
      'type': 'blue',
      'icon': Icons.shield_rounded,
      'isRead': true,
    },
    {
      'id': '6',
      'title': 'App Update Available',
      'subtitle': 'Update EVegah to v2.0.0 for faster Bluetooth unlocking.',
      'time': '2 days ago',
      'category': 'System',
      'type': 'blue',
      'icon': Icons.arrow_upward_rounded,
      'isRead': true,
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadLiveNotifications();
  }

  Future<void> _loadLiveNotifications() async {
    setState(() => _isLoading = true);
    final fetched = await _notificationService.fetchNotifications();
    if (mounted && fetched.isNotEmpty) {
      setState(() {
        _alertsList.clear();
        for (var item in fetched) {
          IconData ic = Icons.notifications_rounded;
          String typeColor = 'purple';
          String category = 'System';

          final t = (item['type'] ?? '').toString().toLowerCase();
          final titleLower = (item['title'] ?? '').toString().toLowerCase();

          if (t.contains('payment') || titleLower.contains('wallet')) {
            ic = Icons.account_balance_wallet_rounded;
            typeColor = 'purple';
            category = 'Transactions';
          } else if (t.contains('booking') || t.contains('ride') || titleLower.contains('scooter')) {
            ic = Icons.electric_scooter_rounded;
            typeColor = 'green';
            category = 'Ride & Service';
          } else if (t.contains('alert') || titleLower.contains('bms') || titleLower.contains('battery')) {
            ic = Icons.battery_alert_rounded;
            typeColor = 'orange';
            category = 'System';
          } else if (t.contains('promo') || titleLower.contains('offer')) {
            ic = Icons.local_offer_rounded;
            typeColor = 'orange';
            category = 'Transactions';
          }

          _alertsList.add({
            'id': item['id'],
            'title': item['title'],
            'subtitle': item['message'],
            'time': item['time'],
            'badge': item['isRead'] == false ? 'New' : '',
            'category': category,
            'type': typeColor,
            'icon': ic,
            'isRead': item['isRead'] ?? false,
          });
        }
        _isLoading = false;
      });
    } else {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _markAllRead() async {
    setState(() => _isLoading = true);
    await _notificationService.markAllAsRead();
    for (var alert in _alertsList) {
      alert['isRead'] = true;
    }
    setState(() => _isLoading = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("All alerts marked as read ✔️"),
          backgroundColor: Color(0xFF2A195C),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredAlerts = _selectedFilter == 'All'
        ? _alertsList
        : _alertsList.where((a) => a['category'] == _selectedFilter).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black87),
          onPressed: () => Navigator.maybePop(context),
        ),
        title: const Text(
          "Alerts",
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 22,
            color: Color(0xFF0F172A),
          ),
        ),
        centerTitle: false,
        actions: [
          TextButton.icon(
            onPressed: _isLoading ? null : _markAllRead,
            icon: _isLoading
                ? const SizedBox(
                    width: 14,
                    height: 14,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF6366F1)),
                  )
                : const Icon(Icons.done_all_rounded, size: 18, color: Color(0xFF6366F1)),
            label: const Text(
              "Mark all read",
              style: TextStyle(
                color: Color(0xFF6366F1),
                fontWeight: FontWeight.w700,
                fontSize: 13,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Filter Tabs Row
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              children: [
                _buildFilterPill('All', Icons.notifications_none_rounded),
                const SizedBox(width: 10),
                _buildFilterPill('Transactions', Icons.account_balance_wallet_outlined),
                const SizedBox(width: 10),
                _buildFilterPill('Ride & Service', Icons.electric_scooter_outlined),
                const SizedBox(width: 10),
                _buildFilterPill('System', Icons.settings_outlined),
              ],
            ),
          ),
          const SizedBox(height: 12),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: const Text(
              "Recent Alerts",
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Content List or Empty State
          Expanded(
            child: filteredAlerts.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    padding: const EdgeInsets.only(left: 20, right: 20, bottom: 20),
                    itemCount: filteredAlerts.length + 1,
                    itemBuilder: (context, index) {
                      if (index == filteredAlerts.length) {
                        return _buildThankYouCard();
                      }
                      return _buildAlertCard(filteredAlerts[index]);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterPill(String title, IconData icon) {
    final isSelected = _selectedFilter == title;
    return GestureDetector(
      onTap: () => setState(() => _selectedFilter = title),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFF5F3FF) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? const Color(0xFF6366F1) : const Color(0xFFE2E8F0),
            width: 1.5,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 18,
              color: isSelected ? const Color(0xFF6366F1) : const Color(0xFF64748B),
            ),
            const SizedBox(width: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: isSelected ? const Color(0xFF6366F1) : const Color(0xFF475569),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAlertCard(Map<String, dynamic> item) {
    Color stripColor;
    Color iconBg;
    Color iconColor;

    switch (item['type']) {
      case 'green':
        stripColor = const Color(0xFF10B981);
        iconBg = const Color(0xFFECFDF5);
        iconColor = const Color(0xFF10B981);
        break;
      case 'purple':
        stripColor = const Color(0xFF6366F1);
        iconBg = const Color(0xFFF5F3FF);
        iconColor = const Color(0xFF6366F1);
        break;
      case 'orange':
        stripColor = const Color(0xFFF97316);
        iconBg = const Color(0xFFFFF7ED);
        iconColor = const Color(0xFFF97316);
        break;
      default:
        stripColor = const Color(0xFF3B82F6);
        iconBg = const Color(0xFFEFF6FF);
        iconColor = const Color(0xFF3B82F6);
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 6,
            offset: const Offset(0, 2),
          )
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Colored vertical strip accent on left
              Container(width: 5, color: stripColor),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Icon Circle
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: iconBg,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(item['icon'], color: iconColor, size: 22),
                      ),
                      const SizedBox(width: 12),

                      // Text Info
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Wrap(
                                    crossAxisAlignment: WrapCrossAlignment.center,
                                    spacing: 6,
                                    children: [
                                      Text(
                                        item['title'],
                                        style: const TextStyle(
                                          fontSize: 14.5,
                                          fontWeight: FontWeight.w800,
                                          color: Color(0xFF0F172A),
                                        ),
                                      ),
                                      if (item['badge'] != null)
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFF5F3FF),
                                            borderRadius: BorderRadius.circular(10),
                                          ),
                                          child: Text(
                                            item['badge'],
                                            style: const TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.w800,
                                              color: Color(0xFF6366F1),
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                                Row(
                                  children: [
                                    Text(
                                      item['time'],
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w600,
                                        color: stripColor,
                                      ),
                                    ),
                                    const SizedBox(width: 4),
                                    Container(
                                      width: 6,
                                      height: 6,
                                      decoration: BoxDecoration(
                                        color: stripColor,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              item['subtitle'],
                              style: const TextStyle(
                                fontSize: 12.5,
                                color: Color(0xFF64748B),
                                height: 1.35,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8), size: 20),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildThankYouCard() {
    return Container(
      margin: const EdgeInsets.only(top: 8, bottom: 20),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0), width: 1.5),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: const BoxDecoration(
              color: Color(0xFFECFDF5),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.eco_rounded, color: Color(0xFF10B981), size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Thank you for choosing EVegah!",
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                SizedBox(height: 2),
                Text(
                  "Together we're building a cleaner and greener future.",
                  style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/empty-states/no-search-results.png',
              width: 180,
              height: 180,
              errorBuilder: (_, __, ___) => const Icon(Icons.notifications_off_outlined, size: 80, color: Colors.grey),
            ),
            const SizedBox(height: 16),
            const Text(
              "No Alerts Found",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 6),
            const Text(
              "You're all caught up! Check back later for ride updates and offers.",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ),
    );
  }
}