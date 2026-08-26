import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../../../core/constants/app_constants.dart';

import '../../data/services/profile_service.dart';
import 'basic_profile_screen.dart';
import 'about_screen.dart';

import '../../../offers/presentation/screens/offer_screen.dart';
import '../../../offers/presentation/screens/refer_earn_screen.dart';
import '../../../preferences/presentation/screens/preferences_screen.dart';
import '../../../support/presentation/screens/help_screen.dart';
import '../../../wallet/presentation/screens/wallet_screen.dart';
import '../../../rides/presentation/screen/ride_history_screen.dart';
import '../../../auth/presentation/screens/login_screen.dart';

import '../../../../core/services/session_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  int _totalRidesCount = 0;
  double _co2SavedKg = 0.0;
  int _evePointsVal = 120;

  final ProfileService _profileService = ProfileService();

  // ============================================================
  // COLORS
  // ============================================================

  static const Color brandPurple = Color(0xFF4313B8);
  static const Color brandPurpleLight = Color(0xFFF1EDFF);

  static const Color backgroundColor = Color(0xFFF7F8FC);
  static const Color cardColor = Colors.white;

  static const Color darkText = Color(0xFF111827);
  static const Color secondaryText = Color(0xFF6B7280);
  static const Color mutedText = Color(0xFF9CA3AF);

  static const Color borderColor = Color(0xFFE9ECF2);

  static const Color accentGreen = Color(0xFFD2FC00);
  static const Color green = Color(0xFF16A34A);

  @override
  void initState() {
    super.initState();
    _loadProfileAndStats();
  }

  // ============================================================
  // DATA
  // ============================================================

  Future<void> _loadProfileAndStats() async {
    await _profileService.fetchUserData();

    if (mounted) {
      setState(() {});
    }

    await _fetchBackendStats();
  }

  Future<void> _fetchBackendStats() async {
    final mobile =
        await SessionService().getUserMobile() ?? "+91 98765 43210";

    final url =
        '${AppConstants.apiBaseUrl}/reservations?limit=100&search=${Uri.encodeComponent(mobile)}';

    try {
      final response = await http
          .get(Uri.parse(url))
          .timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        if (data['status'] == 'success' && data['data'] != null) {
          final list = data['data'] as List;
          final int count = list.length;

          if (mounted) {
            setState(() {
              _totalRidesCount = count;
              _co2SavedKg = count * 0.85;
              _evePointsVal = (count * 25) + 120;
            });
          }

          return;
        }
      }
    } catch (e) {
      debugPrint("Profile stats fetch error: $e");
    }
  }

  void _refreshProfile() {
    _loadProfileAndStats();
  }

  // ============================================================
  // INITIALS
  // ============================================================

  String _getInitials() {
    final String name = _profileService.userName.trim();

    if (name.isEmpty) {
      return "ER";
    }

    final List<String> words =
        name.split(" ").where((String word) => word.isNotEmpty).toList();

    if (words.length == 1) {
      return words.first[0].toUpperCase();
    }

    return "${words[0][0]}${words[1][0]}".toUpperCase();
  }

  // ============================================================
  // PROFILE
  // ============================================================

  Future<void> _openProfileDetails() async {
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const BasicProfileScreen(),
      ),
    );

    _refreshProfile();
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  Future<void> _handleLogout() async {
    final bool? shouldLogout = await showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.white,
          insetPadding: const EdgeInsets.symmetric(horizontal: 24),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(28),
          ),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 28, 24, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  height: 64,
                  width: 64,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF1F2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(
                    Icons.logout_rounded,
                    color: Color(0xFFE11D48),
                    size: 28,
                  ),
                ),

                const SizedBox(height: 20),

                const Text(
                  "Log out?",
                  style: TextStyle(
                    color: darkText,
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                  ),
                ),

                const SizedBox(height: 8),

                const Text(
                  "Are you sure you want to log out of your Evegah account?",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: secondaryText,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),

                const SizedBox(height: 24),

                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          Navigator.pop(context, false);
                        },
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size.fromHeight(52),
                          side: const BorderSide(
                            color: borderColor,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: const Text(
                          "Cancel",
                          style: TextStyle(
                            color: darkText,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(width: 12),

                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context, true);
                        },
                        style: ElevatedButton.styleFrom(
                          elevation: 0,
                          backgroundColor: const Color(0xFFE11D48),
                          foregroundColor: Colors.white,
                          minimumSize: const Size.fromHeight(52),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: const Text(
                          "Log Out",
                          style: TextStyle(
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );

    if (shouldLogout != true) return;

    await SessionService().logout();

    if (!mounted) return;

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(
        builder: (context) => const LoginScreen(),
      ),
      (Route<dynamic> route) => false,
    );
  }

  // ============================================================
  // BUILD
  // ============================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,

      body: SafeArea(
        child: RefreshIndicator(
          color: brandPurple,
          onRefresh: _loadProfileAndStats,

          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(
              parent: BouncingScrollPhysics(),
            ),

            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 40),

              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,

                children: [
                  _buildTopBar(),

                  const SizedBox(height: 22),

                  _buildProfileHero(),

                  const SizedBox(height: 18),

                  _buildStatsStrip(),

                  const SizedBox(height: 28),

                  _buildSectionHeader(
                    "Your Activity",
                    "This week",
                  ),

                  const SizedBox(height: 12),

                  _buildActivityCard(),

                  const SizedBox(height: 28),

                  _buildMembershipCard(),

                  const SizedBox(height: 30),

                  _buildSectionHeader(
                    "Account",
                    null,
                  ),

                  const SizedBox(height: 12),

                  _buildAccountMenu(),

                  const SizedBox(height: 20),

                  _buildLogoutButton(),

                  const SizedBox(height: 24),

                  _buildFooter(),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ============================================================
  // TOP BAR
  // ============================================================

  Widget _buildTopBar() {
    return Row(
      children: [
        const Expanded(
          child: Text(
            "Profile",
            style: TextStyle(
              color: darkText,
              fontSize: 30,
              fontWeight: FontWeight.w900,
              letterSpacing: -0.8,
            ),
          ),
        ),

        Material(
          color: cardColor,
          borderRadius: BorderRadius.circular(15),

          child: InkWell(
            onTap: _openProfileDetails,

            borderRadius: BorderRadius.circular(15),

            child: Container(
              height: 44,
              width: 44,

              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(15),
                border: Border.all(
                  color: borderColor,
                ),
              ),

              child: const Icon(
                Icons.edit_outlined,
                color: darkText,
                size: 20,
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ============================================================
  // PROFILE HERO
  // ============================================================

  Widget _buildProfileHero() {
    return GestureDetector(
      onTap: _openProfileDetails,

      child: Container(
        padding: const EdgeInsets.all(20),

        decoration: BoxDecoration(
          color: cardColor,

          borderRadius: BorderRadius.circular(26),

          border: Border.all(
            color: borderColor,
          ),

          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.035),
              blurRadius: 24,
              offset: const Offset(0, 8),
            ),
          ],
        ),

        child: Row(
          children: [
            // Avatar
            Stack(
              clipBehavior: Clip.none,

              children: [
                Container(
                  height: 76,
                  width: 76,

                  alignment: Alignment.center,

                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [
                        brandPurple,
                        Color(0xFF6D3FE8),
                      ],

                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),

                    shape: BoxShape.circle,

                    boxShadow: [
                      BoxShadow(
                        color: brandPurple.withOpacity(0.20),
                        blurRadius: 18,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),

                  child: Text(
                    _getInitials(),

                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),

                Positioned(
                  right: -1,
                  bottom: -1,

                  child: Container(
                    height: 25,
                    width: 25,

                    decoration: BoxDecoration(
                      color: accentGreen,
                      shape: BoxShape.circle,

                      border: Border.all(
                        color: Colors.white,
                        width: 3,
                      ),
                    ),

                    child: const Icon(
                      Icons.check_rounded,
                      color: darkText,
                      size: 13,
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(width: 16),

            // Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,

                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          _profileService.userName.isNotEmpty
                              ? _profileService.userName
                              : "Evegah Rider",

                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,

                          style: const TextStyle(
                            color: darkText,
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.4,
                          ),
                        ),
                      ),

                      const SizedBox(width: 7),

                      const Icon(
                        Icons.verified_rounded,
                        color: brandPurple,
                        size: 17,
                      ),
                    ],
                  ),

                  const SizedBox(height: 7),

                  if (_profileService.phoneNumber.isNotEmpty)
                    Text(
                      _profileService.phoneNumber,

                      style: const TextStyle(
                        color: secondaryText,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),

                  if (_profileService.email.isNotEmpty) ...[
                    const SizedBox(height: 3),

                    Text(
                      _profileService.email,

                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,

                      style: const TextStyle(
                        color: mutedText,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],

                  const SizedBox(height: 9),

                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 9,
                      vertical: 5,
                    ),

                    decoration: BoxDecoration(
                      color: brandPurpleLight,
                      borderRadius: BorderRadius.circular(8),
                    ),

                    child: const Text(
                      "VERIFIED RIDER",

                      style: TextStyle(
                        color: brandPurple,
                        fontSize: 9,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.6,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(width: 8),

            const Icon(
              Icons.chevron_right_rounded,
              color: mutedText,
              size: 24,
            ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // STATS STRIP
  // ============================================================

  Widget _buildStatsStrip() {
    return Container(
      padding: const EdgeInsets.symmetric(
        vertical: 18,
        horizontal: 10,
      ),

      decoration: BoxDecoration(
        color: cardColor,

        borderRadius: BorderRadius.circular(22),

        border: Border.all(
          color: borderColor,
        ),
      ),

      child: Row(
        children: [
          Expanded(
            child: _buildStatItem(
              value: _totalRidesCount.toString(),
              label: "RIDES",
              icon: Icons.electric_scooter_rounded,
              iconColor: brandPurple,
            ),
          ),

          _buildVerticalDivider(),

          Expanded(
            child: _buildStatItem(
              value: "${_co2SavedKg.toStringAsFixed(1)} kg",
              label: "CO₂ SAVED",
              icon: Icons.eco_rounded,
              iconColor: green,
            ),
          ),

          _buildVerticalDivider(),

          Expanded(
            child: _buildStatItem(
              value: _evePointsVal.toString(),
              label: "POINTS",
              icon: Icons.stars_rounded,
              iconColor: const Color(0xFFD97706),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem({
    required String value,
    required String label,
    required IconData icon,
    required Color iconColor,
  }) {
    return Column(
      children: [
        Icon(
          icon,
          color: iconColor,
          size: 20,
        ),

        const SizedBox(height: 8),

        Text(
          value,

          style: const TextStyle(
            color: darkText,
            fontSize: 17,
            fontWeight: FontWeight.w900,
            letterSpacing: -0.3,
          ),
        ),

        const SizedBox(height: 3),

        Text(
          label,

          style: const TextStyle(
            color: mutedText,
            fontSize: 9,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.7,
          ),
        ),
      ],
    );
  }

  Widget _buildVerticalDivider() {
    return Container(
      height: 42,
      width: 1,
      color: borderColor,
    );
  }

  // ============================================================
  // SECTION HEADER
  // ============================================================

  Widget _buildSectionHeader(
    String title,
    String? action,
  ) {
    return Row(
      children: [
        Text(
          title,

          style: const TextStyle(
            color: darkText,
            fontSize: 18,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.3,
          ),
        ),

        const Spacer(),

        if (action != null)
          Text(
            action,

            style: const TextStyle(
              color: secondaryText,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
      ],
    );
  }

  // ============================================================
  // ACTIVITY CARD
  // ============================================================

  Widget _buildActivityCard() {
    final List<double> values = [
      0.35,
      0.55,
      0.78,
      0.48,
      0.92,
      0.68,
      0.56,
    ];

    final List<String> days = [
      "M",
      "T",
      "W",
      "T",
      "F",
      "S",
      "S",
    ];

    return Container(
      padding: const EdgeInsets.fromLTRB(18, 20, 18, 16),

      decoration: BoxDecoration(
        color: cardColor,

        borderRadius: BorderRadius.circular(24),

        border: Border.all(
          color: borderColor,
        ),
      ),

      child: Column(
        children: [
          Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,

                children: [
                  const Text(
                    "Riding activity",

                    style: TextStyle(
                      color: darkText,
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                    ),
                  ),

                  const SizedBox(height: 4),

                  Text(
                    _totalRidesCount == 0
                        ? "Start your first ride"
                        : "Keep moving with Evegah",

                    style: const TextStyle(
                      color: secondaryText,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),

              const Spacer(),

              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 9,
                  vertical: 6,
                ),

                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(10),
                ),

                child: const Row(
                  children: [
                    Icon(
                      Icons.trending_up_rounded,
                      color: green,
                      size: 14,
                    ),

                    SizedBox(width: 4),

                    Text(
                      "+15%",
                      style: TextStyle(
                        color: green,
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 26),

          SizedBox(
            height: 145,

            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.spaceAround,

              children: List.generate(
                values.length,
                (index) {
                  final bool selected = index == 4;

                  return _buildActivityBar(
                    days[index],
                    values[index],
                    selected,
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActivityBar(
    String day,
    double value,
    bool selected,
  ) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,

      children: [
        if (selected)
          Container(
            margin: const EdgeInsets.only(bottom: 7),

            padding: const EdgeInsets.symmetric(
              horizontal: 7,
              vertical: 4,
            ),

            decoration: BoxDecoration(
              color: brandPurple,
              borderRadius: BorderRadius.circular(7),
            ),

            child: const Text(
              "95 km",

              style: TextStyle(
                color: Colors.white,
                fontSize: 9,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),

        Container(
          width: 20,
          height: 90 * value,

          decoration: BoxDecoration(
            color: selected
                ? brandPurple
                : const Color(0xFFE8E9F0),

            borderRadius: BorderRadius.circular(8),
          ),
        ),

        const SizedBox(height: 9),

        Text(
          day,

          style: TextStyle(
            color: selected ? darkText : mutedText,
            fontSize: 11,
            fontWeight: selected
                ? FontWeight.w800
                : FontWeight.w600,
          ),
        ),
      ],
    );
  }

  // ============================================================
  // QUICK ACTIONS
  // ============================================================

  Widget _buildQuickActions() {
    return Row(
      children: [
        Expanded(
          child: _buildActionItem(
            title: "My Rides",
            icon: Icons.route_rounded,
            color: const Color(0xFF059669),
            background: const Color(0xFFECFDF5),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const RideHistoryScreen(),
                ),
              );
            },
          ),
        ),

        const SizedBox(width: 10),

        Expanded(
          child: _buildActionItem(
            title: "Wallet",
            icon: Icons.account_balance_wallet_rounded,
            color: brandPurple,
            background: brandPurpleLight,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const WalletScreen(),
                ),
              );
            },
          ),
        ),

        const SizedBox(width: 10),

        Expanded(
          child: _buildActionItem(
            title: "Offers",
            icon: Icons.local_offer_rounded,
            color: const Color(0xFFEA580C),
            background: const Color(0xFFFFF7ED),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const OfferScreen(),
                ),
              );
            },
          ),
        ),

        const SizedBox(width: 10),

        Expanded(
          child: _buildActionItem(
            title: "Help",
            icon: Icons.support_agent_rounded,
            color: const Color(0xFF2563EB),
            background: const Color(0xFFEFF6FF),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const HelpScreen(),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildActionItem({
    required String title,
    required IconData icon,
    required Color color,
    required Color background,
    required VoidCallback onTap,
  }) {
    return Material(
      color: cardColor,

      borderRadius: BorderRadius.circular(18),

      child: InkWell(
        onTap: onTap,

        borderRadius: BorderRadius.circular(18),

        child: Container(
          padding: const EdgeInsets.symmetric(
            vertical: 15,
            horizontal: 5,
          ),

          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),

            border: Border.all(
              color: borderColor,
            ),
          ),

          child: Column(
            children: [
              Container(
                height: 40,
                width: 40,

                decoration: BoxDecoration(
                  color: background,
                  borderRadius: BorderRadius.circular(13),
                ),

                child: Icon(
                  icon,
                  color: color,
                  size: 20,
                ),
              ),

              const SizedBox(height: 9),

              Text(
                title,

                maxLines: 1,
                overflow: TextOverflow.ellipsis,

                style: const TextStyle(
                  color: darkText,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ============================================================
  // MEMBERSHIP
  // ============================================================

  Widget _buildMembershipCard() {
    String tierName = "Bronze Member";
    String nextTierName = "Silver";
    int targetPts = 500;

    if (_totalRidesCount >= 50 || _evePointsVal >= 5000) {
      tierName = "Platinum Member";
      nextTierName = "Max Tier";
      targetPts = 5000;
    } else if (_totalRidesCount >= 20 || _evePointsVal >= 2000) {
      tierName = "Gold Member";
      nextTierName = "Platinum";
      targetPts = 5000;
    } else if (_totalRidesCount >= 5 || _evePointsVal >= 500) {
      tierName = "Silver Member";
      nextTierName = "Gold";
      targetPts = 2000;
    } else {
      tierName = "Bronze Member";
      nextTierName = "Silver";
      targetPts = 500;
    }

    final double progress = (_evePointsVal / targetPts).clamp(0.0, 1.0);
    final int remaining = _evePointsVal >= targetPts ? 0 : targetPts - _evePointsVal;

    return Container(
      padding: const EdgeInsets.all(20),

      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            Color(0xFFF5F1FF),
            Color(0xFFFFFFFF),
          ],

          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),

        borderRadius: BorderRadius.circular(26),

        border: Border.all(
          color: const Color(0xFFE2D9FF),
        ),
      ),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,

        children: [
          Row(
            children: [
              Container(
                height: 44,
                width: 44,

                decoration: BoxDecoration(
                  color: brandPurple,
                  borderRadius: BorderRadius.circular(14),

                  boxShadow: [
                    BoxShadow(
                      color: brandPurple.withOpacity(0.20),
                      blurRadius: 12,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),

                child: const Icon(
                  Icons.workspace_premium_rounded,
                  color: Colors.white,
                  size: 23,
                ),
              ),

              const SizedBox(width: 12),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,

                  children: [
                    const Text(
                      "EveClub",

                      style: TextStyle(
                        color: brandPurple,
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                      ),
                    ),

                    const SizedBox(height: 2),

                    Text(
                      tierName,

                      style: const TextStyle(
                        color: darkText,
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),

              Text(
                "$_evePointsVal",

                style: const TextStyle(
                  color: brandPurple,
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                ),
              ),

              const Text(
                " pts",

                style: TextStyle(
                  color: secondaryText,
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),

          const SizedBox(height: 22),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,

            children: [
              Text(
                nextTierName == "Max Tier" ? "Platinum Unlocked!" : "Progress to $nextTierName",

                style: const TextStyle(
                  color: darkText,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),

              Text(
                remaining == 0
                    ? "Tier unlocked!"
                    : "$remaining pts to go",

                style: const TextStyle(
                  color: secondaryText,
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),

          const SizedBox(height: 9),

          ClipRRect(
            borderRadius: BorderRadius.circular(20),

            child: LinearProgressIndicator(
              value: progress,
              minHeight: 9,

              backgroundColor: const Color(0xFFE4E0EF),

              valueColor:
                  const AlwaysStoppedAnimation<Color>(
                brandPurple,
              ),
            ),
          ),

          const SizedBox(height: 16),

          Material(
            color: Colors.transparent,

            child: InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const ReferEarnScreen(),
                  ),
                );
              },

              borderRadius: BorderRadius.circular(12),

              child: Container(
                padding: const EdgeInsets.symmetric(
                  vertical: 11,
                  horizontal: 12,
                ),

                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),

                child: const Row(
                  children: [
                    Icon(
                      Icons.card_giftcard_rounded,
                      color: brandPurple,
                      size: 17,
                    ),

                    SizedBox(width: 8),

                    Expanded(
                      child: Text(
                        "Refer friends & earn more points",

                        style: TextStyle(
                          color: darkText,
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),

                    Icon(
                      Icons.arrow_forward_rounded,
                      color: brandPurple,
                      size: 17,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // ACCOUNT MENU
  // ============================================================

  Widget _buildAccountMenu() {
    return Container(
      decoration: BoxDecoration(
        color: cardColor,

        borderRadius: BorderRadius.circular(22),

        border: Border.all(
          color: borderColor,
        ),
      ),

      child: Column(
        children: [
          _buildAccountTile(
            title: "Refer & Earn",
            subtitle: "Invite friends & earn free ride points",
            icon: Icons.card_giftcard_rounded,
            iconColor: const Color(0xFF2563EB),
            iconBackground: const Color(0xFFEFF6FF),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const ReferEarnScreen(),
                ),
              );
            },
            isFirst: true,
          ),

          _buildAccountTile(
            title: "Promotions & Offers",
            subtitle: "Available offers for you",
            icon: Icons.local_offer_rounded,
            iconColor: const Color(0xFF9333EA),
            iconBackground: const Color(0xFFF3E8FF),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const OfferScreen(),
                ),
              );
            },
          ),

          _buildAccountTile(
            title: "Safety & Help",
            subtitle: "Support and safety center",
            icon: Icons.shield_outlined,
            iconColor: green,
            iconBackground: const Color(0xFFECFDF5),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const HelpScreen(),
                ),
              );
            },
          ),

          _buildAccountTile(
            title: "Preferences",
            subtitle: "App settings & preferences",
            icon: Icons.tune_rounded,
            iconColor: const Color(0xFFD97706),
            iconBackground: const Color(0xFFFFFBEB),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const PreferencesScreen(),
                ),
              );
            },
          ),

          _buildAccountTile(
            title: "About Evegah",
            subtitle: "Version, terms & information",
            icon: Icons.info_outline_rounded,
            iconColor: const Color(0xFF64748B),
            iconBackground: const Color(0xFFF1F5F9),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const AboutScreen(),
                ),
              );
            },
            isLast: true,
          ),
        ],
      ),
    );
  }

  Widget _buildAccountTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required Color iconBackground,
    required VoidCallback onTap,
    bool isFirst = false,
    bool isLast = false,
  }) {
    return Material(
      color: Colors.transparent,

      child: InkWell(
        onTap: onTap,

        borderRadius: BorderRadius.vertical(
          top: Radius.circular(isFirst ? 22 : 0),
          bottom: Radius.circular(isLast ? 22 : 0),
        ),

        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 14,
              ),

              child: Row(
                children: [
                  Container(
                    height: 42,
                    width: 42,

                    decoration: BoxDecoration(
                      color: iconBackground,
                      borderRadius: BorderRadius.circular(13),
                    ),

                    child: Icon(
                      icon,
                      color: iconColor,
                      size: 20,
                    ),
                  ),

                  const SizedBox(width: 14),

                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,

                      children: [
                        Text(
                          title,

                          style: const TextStyle(
                            color: darkText,
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                          ),
                        ),

                        const SizedBox(height: 3),

                        Text(
                          subtitle,

                          style: const TextStyle(
                            color: mutedText,
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const Icon(
                    Icons.chevron_right_rounded,
                    color: Color(0xFFB8BEC9),
                    size: 22,
                  ),
                ],
              ),
            ),

            if (!isLast)
              const Padding(
                padding: EdgeInsets.only(
                  left: 72,
                  right: 16,
                ),

                child: Divider(
                  height: 1,
                  thickness: 1,
                  color: borderColor,
                ),
              ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  Widget _buildLogoutButton() {
    return Material(
      color: Colors.transparent,

      child: InkWell(
        onTap: _handleLogout,

        borderRadius: BorderRadius.circular(16),

        child: Container(
          width: double.infinity,

          padding: const EdgeInsets.symmetric(
            vertical: 15,
          ),

          decoration: BoxDecoration(
            color: const Color(0xFFFFF7F7),

            borderRadius: BorderRadius.circular(16),

            border: Border.all(
              color: const Color(0xFFFEE2E2),
            ),
          ),

          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,

            children: [
              Icon(
                Icons.logout_rounded,
                color: Color(0xFFE11D48),
                size: 19,
              ),

              SizedBox(width: 8),

              Text(
                "Log out",

                style: TextStyle(
                  color: Color(0xFFE11D48),
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ============================================================
  // FOOTER
  // ============================================================

  Widget _buildFooter() {
    return const Center(
      child: Column(
        children: [
          Text(
            "EVEGAH",

            style: TextStyle(
              color: Color(0xFFB5BAC4),
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 2,
            ),
          ),

          SizedBox(height: 5),

          Text(
            "Rider App • Version 1.0.0",

            style: TextStyle(
              color: Color(0xFFB5BAC4),
              fontSize: 10,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}