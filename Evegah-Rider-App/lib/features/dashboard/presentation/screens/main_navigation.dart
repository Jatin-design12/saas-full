import 'package:flutter/material.dart';

import '../../../../core/services/session_service.dart';
import '../../../auth/presentation/screens/login_screen.dart';
import '../../../dashboard/presentation/screens/dashboard_screen.dart';
import '../../../profile/presentation/screens/profile_screen.dart';
import '../../../rides/presentation/screen/ride_history_screen.dart';
import '../../../unlock/presentation/screens/scan_qr_screen.dart';
import '../../../wallet/presentation/screens/wallet_screen.dart';

class MainNavigation extends StatefulWidget {
  final int initialIndex;

  const MainNavigation({
    super.key,
    this.initialIndex = 0,
  });

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  late int _currentIndex;

  static const Color _primaryColor = Color(0xFF4327A8);
  static const Color _darkColor = Color(0xFF1E293B);
  static const Color _inactiveColor = Color(0xFF94A3B8);
  static const Color _scanColor = Color(0xFFD7FF00);

  @override
  void initState() {
    super.initState();

    // Valid navigation indexes:
    // 0 = Home
    // 1 = My Rides
    // 2 = Scan
    // 3 = Wallet
    // 4 = Profile

    _currentIndex =
        widget.initialIndex >= 0 && widget.initialIndex <= 4
            ? widget.initialIndex
            : 0;

    // Scan is an action, not a permanent screen.
    if (_currentIndex == 2) {
      _currentIndex = 0;
    }
  }

  Widget _getBody() {
    switch (_currentIndex) {
      case 0:
        return const DashboardScreen();

      case 1:
        return const RideHistoryScreen();

      case 3:
        return const WalletScreen();

      case 4:
        return const ProfileScreen();

      default:
        return const DashboardScreen();
    }
  }

  Future<void> _handleTabTap(int index) async {
    // =========================
    // SCAN TO RIDE
    // =========================

    if (index == 2) {
      final loggedIn = await SessionService().isLoggedIn();

      if (!mounted) return;

      if (!loggedIn) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const LoginScreen(),
          ),
        );
      } else {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const ScanQrScreen(),
          ),
        );
      }

      return;
    }

    // =========================
    // LOGIN REQUIRED TABS
    // =========================

    if (index == 1 || index == 3 || index == 4) {
      final loggedIn = await SessionService().isLoggedIn();

      if (!mounted) return;

      if (!loggedIn) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const LoginScreen(),
          ),
        );

        return;
      }
    }

    if (_currentIndex == index) return;

    setState(() {
      _currentIndex = index;
    });
  }

  // ============================================================
  // NORMAL NAVIGATION ITEM
  // ============================================================

  Widget _buildNavItem({
    required int index,
    required IconData icon,
    required IconData selectedIcon,
    required String label,
  }) {
    final bool isSelected = _currentIndex == index;

    final Color iconColor =
        isSelected ? _primaryColor : _inactiveColor;

    return Expanded(
      child: InkWell(
        onTap: () => _handleTabTap(index),
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: SizedBox(
          height: 64,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                curve: Curves.easeOut,
                padding: EdgeInsets.symmetric(
                  horizontal: isSelected ? 9 : 0,
                  vertical: isSelected ? 4 : 0,
                ),
                decoration: BoxDecoration(
                  color: isSelected
                      ? const Color(0xFFF0EEFF)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  isSelected ? selectedIcon : icon,
                  size: 22,
                  color: iconColor,
                ),
              ),

              const SizedBox(height: 4),

              Text(
                label,
                style: TextStyle(
                  fontFamily: 'Roboto',
                  color: isSelected
                      ? _primaryColor
                      : const Color(0xFF64748B),
                  fontSize: 9.5,
                  height: 1,
                  fontWeight: isSelected
                      ? FontWeight.w700
                      : FontWeight.w500,
                  letterSpacing: -0.1,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ============================================================
  // CENTER SCAN BUTTON
  // ============================================================

  Widget _buildScanToRideNavItem() {
    return Expanded(
      child: InkWell(
        onTap: () => _handleTabTap(2),
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
        child: Transform.translate(
          offset: const Offset(0, -12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: _scanColor,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Colors.white,
                    width: 4,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFD7FF00)
                          .withOpacity(0.32),
                      blurRadius: 16,
                      spreadRadius: 2,
                      offset: const Offset(0, 5),
                    ),
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.qr_code_2_rounded,
                  size: 23,
                  color: Color(0xFF111827),
                ),
              ),

              const SizedBox(height: 2),

              const Text(
                "Scan",
                style: TextStyle(
                  fontFamily: 'Roboto',
                  fontSize: 9.5,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF374151),
                  height: 1,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ============================================================
  // BOTTOM NAVIGATION
  // ============================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,

      body: _getBody(),

      bottomNavigationBar: Container(
        height: 74,
        decoration: BoxDecoration(
          color: const Color(0xFFFEFEFF),
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(24),
          ),
          border: Border(
            top: BorderSide(
              color: const Color(0xFFE9EDF3),
              width: 1,
            ),
          ),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF0F172A).withOpacity(0.06),
              blurRadius: 20,
              offset: const Offset(0, -6),
            ),
          ],
        ),

        child: SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(
              8,
              3,
              8,
              0,
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // HOME
                _buildNavItem(
                  index: 0,
                  icon: Icons.home_outlined,
                  selectedIcon: Icons.home_rounded,
                  label: "Home",
                ),

                // MY RIDES
                _buildNavItem(
                  index: 1,
                  icon: Icons.electric_scooter_outlined,
                  selectedIcon: Icons.electric_scooter_rounded,
                  label: "My Rides",
                ),

                // SCAN
                _buildScanToRideNavItem(),

                // WALLET
                _buildNavItem(
                  index: 3,
                  icon: Icons.account_balance_wallet_outlined,
                  selectedIcon: Icons.account_balance_wallet_rounded,
                  label: "Wallet",
                ),

                // PROFILE
                _buildNavItem(
                  index: 4,
                  icon: Icons.person_outline_rounded,
                  selectedIcon: Icons.person_rounded,
                  label: "Profile",
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}