import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class HelpScreen extends StatefulWidget {
  const HelpScreen({super.key});

  @override
  State<HelpScreen> createState() => _HelpScreenState();
}

class _HelpScreenState extends State<HelpScreen> {
  bool _isOffline = false;
  final bool _isMaintenance = false;

  Future<void> _makePhoneCall(String phoneNumber) async {
    final Uri launchUri = Uri(scheme: 'tel', path: phoneNumber);
    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Calling $phoneNumber...")),
        );
      }
    }
  }

  Future<void> _sendEmail(String email) async {
    final Uri launchUri = Uri(scheme: 'mailto', path: email);
    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Opening mail to $email...")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isOffline) {
      return _buildOfflineState();
    }
    if (_isMaintenance) {
      return _buildMaintenanceState();
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: IconButton(
              icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A), size: 18),
              onPressed: () => Navigator.maybePop(context),
            ),
          ),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              "Get Help",
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 22,
                color: Color(0xFF0F172A),
              ),
            ),
            SizedBox(height: 2),
            Text(
              "How can we help you today?",
              style: TextStyle(
                fontSize: 12,
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Dark Purple Hero Banner Card
            _buildHeroBannerCard(),
            const SizedBox(height: 24),

            // Contact Support Section
            const Text(
              "Contact Support",
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 2),
            const Text(
              "Choose how you would like to contact us",
              style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 14),

            // Call Us Card
            _buildContactCard(
              title: "Call Us",
              badgeText: "AVAILABLE",
              badgeColor: const Color(0xFF10B981),
              badgeBg: const Color(0xFFECFDF5),
              subtitle: "+91 98765 43210",
              hoursText: "Mon - Sun, 8:00 AM to 10:00 PM",
              icon: Icons.phone_in_talk_rounded,
              iconColor: const Color(0xFF10B981),
              iconBg: const Color(0xFFECFDF5),
              borderColor: const Color(0xFF10B981),
              onTap: () => _makePhoneCall("+919876543210"),
            ),
            const SizedBox(height: 12),

            // Email Support Card
            _buildContactCard(
              title: "Email Support",
              badgeText: "QUICK REPLY",
              badgeColor: const Color(0xFF3B82F6),
              badgeBg: const Color(0xFFEFF6FF),
              subtitle: "support@evegah.com",
              hoursText: "Typical reply within 2 hours",
              icon: Icons.mail_outline_rounded,
              iconColor: const Color(0xFF3B82F6),
              iconBg: const Color(0xFFEFF6FF),
              borderColor: const Color(0xFF3B82F6),
              onTap: () => _sendEmail("support@evegah.com"),
            ),
            const SizedBox(height: 12),

            // Live Chat Card
            _buildContactCard(
              title: "Live Chat",
              badgeText: "BEST WAY",
              badgeColor: const Color(0xFF6366F1),
              badgeBg: const Color(0xFFF5F3FF),
              subtitle: "Chat with our support executive",
              hoursText: "Available 24/7",
              icon: Icons.chat_bubble_outline_rounded,
              iconColor: const Color(0xFF6366F1),
              iconBg: const Color(0xFFF5F3FF),
              borderColor: const Color(0xFF6366F1),
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Connecting to Live Chat Support...")),
                );
              },
            ),
            const SizedBox(height: 24),

            // Need Help With? Section
            const Text(
              "Need help with?",
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 14),

            Row(
              children: [
                Expanded(child: _buildNeedHelpItem("Ride Issues", Icons.electric_scooter_rounded, const Color(0xFFF5F3FF), const Color(0xFF6366F1))),
                const SizedBox(width: 10),
                Expanded(child: _buildNeedHelpItem("Payments", Icons.account_balance_wallet_rounded, const Color(0xFFFEF3C7), const Color(0xFFD97706))),
                const SizedBox(width: 10),
                Expanded(child: _buildNeedHelpItem("Account", Icons.person_outline_rounded, const Color(0xFFECFDF5), const Color(0xFF10B981))),
                const SizedBox(width: 10),
                Expanded(child: _buildNeedHelpItem("Promotions", Icons.card_giftcard_rounded, const Color(0xFFFCE7F3), const Color(0xFFDB2777))),
              ],
            ),
            const SizedBox(height: 20),

            // Bottom Info Card
            _buildBottomInfoCard(),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroBannerCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF2A195C), Color(0xFF4338CA)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2A195C).withValues(alpha: 0.25),
            blurRadius: 12,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.headset_mic_rounded, color: Color(0xFFA7F3D0), size: 20),
                ),
                const SizedBox(height: 12),
                const Text(
                  "We're here\nfor you!",
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    height: 1.15,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  "Our support team is ready to help with your rides, payments and account.",
                  style: TextStyle(
                    fontSize: 12,
                    color: Color(0xFFCBD5E1),
                    height: 1.35,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: Color(0xFF10B981),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Text(
                        "Support team is available",
                        style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),

          // 3D Headset graphic
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(24),
            ),
            child: const Icon(Icons.headset_mic_rounded, size: 54, color: Color(0xFFA7F3D0)),
          ),
        ],
      ),
    );
  }

  Widget _buildContactCard({
    required String title,
    required String badgeText,
    required Color badgeColor,
    required Color badgeBg,
    required String subtitle,
    required String hoursText,
    required IconData icon,
    required Color iconColor,
    required Color iconBg,
    required Color borderColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFE2E8F0), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.015),
              blurRadius: 6,
              offset: const Offset(0, 2),
            )
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: iconBg,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: iconColor, size: 24),
            ),
            const SizedBox(width: 14),

            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        title,
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: badgeBg,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          badgeText,
                          style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w800, color: badgeColor),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(
                    subtitle,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    hoursText,
                    style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            ),

            Container(
              width: 32,
              height: 32,
              decoration: const BoxDecoration(
                color: Color(0xFFF8FAFC),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8), size: 20),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNeedHelpItem(String title, IconData icon, Color iconBg, Color iconColor) {
    return GestureDetector(
      onTap: () {},
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFFE2E8F0), width: 1.5),
        ),
        child: Column(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(color: iconBg, shape: BoxShape.circle),
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(height: 10),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: Color(0xFF1E293B)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomInfoCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F3FF),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFDDD6FE), width: 1.5),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: const BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.info_outline_rounded, color: Color(0xFF6366F1), size: 20),
          ),
          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Still need help?",
                  style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                SizedBox(height: 2),
                Text(
                  "For further support, keep your ride or booking details ready.",
                  style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),

          const Icon(Icons.mail_rounded, color: Color(0xFF6366F1), size: 32),
        ],
      ),
    );
  }

  Widget _buildOfflineState() {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset('assets/empty-states/no-internet-connection.png', width: 220, height: 220),
              const SizedBox(height: 20),
              const Text("No Internet Connection", style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
              const SizedBox(height: 8),
              const Text("Please check your Wi-Fi or cellular network settings and try again.", textAlign: TextAlign.center, style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => setState(() => _isOffline = false),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1), padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                child: const Text("Retry Connection", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMaintenanceState() {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset('assets/empty-states/app-under-maintenance.png', width: 220, height: 220),
              const SizedBox(height: 20),
              const Text("App Under Maintenance", style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
              const SizedBox(height: 8),
              const Text("We're currently performing scheduled system upgrades. We'll be back online shortly!", textAlign: TextAlign.center, style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
            ],
          ),
        ),
      ),
    );
  }
}