import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/session_service.dart';

import '../../data/services/profile_service.dart';
import 'basic_profile_screen.dart';
import 'about_screen.dart';

import '../../../offers/presentation/screens/offer_screen.dart';
import '../../../offers/presentation/screens/refer_earn_screen.dart';
import '../../../preferences/presentation/screens/preferences_screen.dart';
import '../../../support/presentation/screens/help_screen.dart';
import '../../../auth/presentation/screens/login_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final ProfileService _profileService = ProfileService();

  int _totalRidesCount = 0;
  double _co2SavedKg = 0.0;
  int _evePointsVal = 120;

  static const Color brandPurple = Color(0xFF6B4BFF);
  static const Color brandPurpleDark = Color(0xFF4313B8);
  static const Color lightPurpleBg = Color(0xFFF5F3FF);

  static const Color pageBackground = Color(0xFFFAFBFE);

  static const Color darkText = Color(0xFF0F172A);
  static const Color secondaryText = Color(0xFF64748B);
  static const Color mutedText = Color(0xFF94A3B8);

  static const Color borderColor = Color(0xFFE2E8F0);
  static const Color green = Color(0xFF16A34A);

  @override
  void initState() {
    super.initState();
    _loadProfileAndStats();
  }

  // ============================================================
  // LOAD DATA
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
          final count = list.length;

          if (mounted) {
            setState(() {
              _totalRidesCount = count;
              _co2SavedKg = count * 0.85;
              _evePointsVal = (count * 25) + 120;
            });
          }
        }
      }
    } catch (e) {
      debugPrint("Profile stats fetch error: $e");
    }
  }

  Future<void> _openProfileDetails() async {
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => const BasicProfileScreen(),
      ),
    );

    await _loadProfileAndStats();
  }

  // ============================================================
  // USER INITIALS
  // ============================================================

  String _getInitials() {
    final name = _profileService.userName.trim();

    if (name.isEmpty) {
      return "ER";
    }

    final words =
        name.split(" ").where((word) => word.isNotEmpty).toList();

    if (words.length == 1) {
      return words.first[0].toUpperCase();
    }

    return "${words.first[0]}${words[1][0]}".toUpperCase();
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  Future<void> _handleLogout() async {
    final bool? shouldLogout = await showDialog<bool>(
      context: context,
      builder: (context) {
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
        builder: (_) => const LoginScreen(),
      ),
      (route) => false,
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackground,
      body: SafeArea(
        child: RefreshIndicator(
          color: brandPurple,
          onRefresh: _loadProfileAndStats,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(
              parent: BouncingScrollPhysics(),
            ),
            padding: const EdgeInsets.fromLTRB(20, 18, 20, 40),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildTopBar(),

                const SizedBox(height: 24),

                _buildProfileHero(),

                const SizedBox(height: 16),

                _buildStatsCard(),

                const SizedBox(height: 28),

                _buildSectionTitle(
                  "EveClub",
                  "Your membership",
                ),

                const SizedBox(height: 12),

                _buildMembershipCard(),

                const SizedBox(height: 28),

                _buildSectionTitle(
                  "Account",
                  "Manage your profile",
                ),

                const SizedBox(height: 12),

                _buildAccountMenu(),

                const SizedBox(height: 20),

                _buildLogoutButton(),

                const SizedBox(height: 26),

                _buildFooter(),
              ],
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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "My Profile",
                style: TextStyle(
                  color: darkText,
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.8,
                ),
              ),
              SizedBox(height: 3),
              Text(
                "Manage your Evegah account",
                style: TextStyle(
                  color: secondaryText,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),

        Material(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15),
          child: InkWell(
            onTap: _openProfileDetails,
            borderRadius: BorderRadius.circular(15),
            child: Container(
              height: 46,
              width: 46,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(15),
                border: Border.all(
                  color: borderColor,
                ),
              ),
              child: const Icon(
                Icons.edit_outlined,
                color: brandPurple,
                size: 21,
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
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: _openProfileDetails,
        borderRadius: BorderRadius.circular(26),
        child: Ink(
          height: 165,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [
                Color(0xFF7C5CFF),
                Color(0xFF4313B8),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(26),
            image: const DecorationImage(
              image: AssetImage(
                "assets/user_profile_banner.png",
              ),
              fit: BoxFit.cover,
              opacity: 0.32,
            ),
            boxShadow: [
              BoxShadow(
                color: brandPurple.withOpacity(0.22),
                blurRadius: 22,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Stack(
            children: [
              Padding(
                padding: const EdgeInsets.all(22),
                child: Row(
                  children: [
                    Stack(
                      clipBehavior: Clip.none,
                      children: [
                        Container(
                          height: 78,
                          width: 78,
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.18),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Colors.white,
                              width: 2,
                            ),
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
                          right: -2,
                          bottom: -2,
                          child: Container(
                            height: 28,
                            width: 28,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: brandPurple,
                                width: 2,
                              ),
                            ),
                            child: const Icon(
                              Icons.edit_rounded,
                              color: brandPurple,
                              size: 14,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(width: 16),

                    Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment:
                            CrossAxisAlignment.start,
                        children: [
                          Text(
                            _profileService.userName.isNotEmpty
                                ? _profileService.userName
                                : (_profileService.phoneNumber.isNotEmpty ? _profileService.phoneNumber : "Rider"),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 21,
                              fontWeight: FontWeight.w800,
                              letterSpacing: -0.4,
                            ),
                          ),

                          const SizedBox(height: 8),

                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981).withOpacity(0.22),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: const Color(0xFF8CE600),
                                width: 1.2,
                              ),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.check_circle_rounded,
                                  color: Color(0xFF8CE600),
                                  size: 14,
                                ),
                                SizedBox(width: 5),
                                Text(
                                  "Verified Rider",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 10),

                          if (_profileService.phoneNumber.isNotEmpty)
                            Row(
                              children: [
                                const Icon(
                                  Icons.phone_outlined,
                                  color: Colors.white70,
                                  size: 14,
                                ),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    _profileService.phoneNumber,
                                    maxLines: 1,
                                    overflow:
                                        TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ],
                            )
                          else if (_profileService.email.isNotEmpty)
                            Row(
                              children: [
                                const Icon(
                                  Icons.email_outlined,
                                  color: Colors.white70,
                                  size: 14,
                                ),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    _profileService.email,
                                    maxLines: 1,
                                    overflow:
                                        TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              Positioned(
                top: 16,
                right: 16,
                child: Container(
                  height: 32,
                  width: 32,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.14),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.arrow_forward_ios_rounded,
                    color: Colors.white,
                    size: 14,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ============================================================
  // STATS
  // ============================================================

  Widget _buildStatsCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(
        vertical: 20,
        horizontal: 8,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
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

          _buildDivider(),

          Expanded(
            child: _buildStatItem(
              value: _co2SavedKg.toStringAsFixed(1),
              label: "KG CO₂",
              icon: Icons.eco_rounded,
              iconColor: green,
            ),
          ),

          _buildDivider(),

          Expanded(
            child: _buildStatItem(
              value: _evePointsVal.toString(),
              label: "POINTS",
              icon: Icons.stars_rounded,
              iconColor: const Color(0xFFF59E0B),
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
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.10),
            borderRadius: BorderRadius.circular(13),
          ),
          child: Icon(
            icon,
            color: iconColor,
            size: 20,
          ),
        ),

        const SizedBox(height: 9),

        Text(
          value,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            color: darkText,
            fontSize: 17,
            fontWeight: FontWeight.w900,
          ),
        ),

        const SizedBox(height: 3),

        Text(
          label,
          style: const TextStyle(
            color: mutedText,
            fontSize: 9,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.6,
          ),
        ),
      ],
    );
  }

  Widget _buildDivider() {
    return Container(
      height: 58,
      width: 1,
      color: borderColor,
    );
  }

  // ============================================================
  // SECTION HEADER
  // ============================================================

  Widget _buildSectionTitle(
    String title,
    String subtitle,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            color: darkText,
            fontSize: 19,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.4,
          ),
        ),
        const SizedBox(height: 3),
        Text(
          subtitle,
          style: const TextStyle(
            color: secondaryText,
            fontSize: 11,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }



  // ============================================================
  // MEMBERSHIP
  // ============================================================

  Widget _buildMembershipCard() {
    String tierName = "Bronze Member";
    String nextTierName = "Silver";
    int targetPts = 500;

    if (_totalRidesCount >= 50 ||
        _evePointsVal >= 5000) {
      tierName = "Platinum Member";
      nextTierName = "Max Tier";
      targetPts = 5000;
    } else if (_totalRidesCount >= 20 ||
        _evePointsVal >= 2000) {
      tierName = "Gold Member";
      nextTierName = "Platinum";
      targetPts = 5000;
    } else if (_totalRidesCount >= 5 ||
        _evePointsVal >= 500) {
      tierName = "Silver Member";
      nextTierName = "Gold";
      targetPts = 2000;
    }

    final progress =
        (_evePointsVal / targetPts).clamp(0.0, 1.0);

    final remaining =
        _evePointsVal >= targetPts
            ? 0
            : targetPts - _evePointsVal;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: const Color(0xFFE4DEFF),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF7C5CFF),
                      brandPurpleDark,
                    ],
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.workspace_premium_rounded,
                  color: Colors.white,
                  size: 25,
                ),
              ),

              const SizedBox(width: 14),

              Expanded(
                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "EVECLUB",
                      style: TextStyle(
                        color: brandPurple,
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1,
                      ),
                    ),
                    const SizedBox(height: 4),
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

              Column(
                crossAxisAlignment:
                    CrossAxisAlignment.end,
                children: [
                  Text(
                    _evePointsVal.toString(),
                    style: const TextStyle(
                      color: brandPurple,
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const Text(
                    "Eve Points",
                    style: TextStyle(
                      color: secondaryText,
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 22),

          Row(
            mainAxisAlignment:
                MainAxisAlignment.spaceBetween,
            children: [
              Text(
                nextTierName == "Max Tier"
                    ? "Maximum level unlocked"
                    : "Progress to $nextTierName",
                style: const TextStyle(
                  color: darkText,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Text(
                remaining == 0
                    ? "Completed"
                    : "$remaining pts left",
                style: const TextStyle(
                  color: secondaryText,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 10,
              backgroundColor:
                  const Color(0xFFEDE9FE),
              valueColor:
                  const AlwaysStoppedAnimation<Color>(
                brandPurple,
              ),
            ),
          ),

          const SizedBox(height: 18),

          Material(
            color: lightPurpleBg,
            borderRadius: BorderRadius.circular(14),
            child: InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) =>
                        const ReferEarnScreen(),
                  ),
                );
              },
              borderRadius: BorderRadius.circular(14),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 13,
                ),
                child: const Row(
                  children: [
                    Icon(
                      Icons.card_giftcard_rounded,
                      color: brandPurple,
                      size: 19,
                    ),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        "Refer friends & earn points",
                        style: TextStyle(
                          color: darkText,
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    Icon(
                      Icons.arrow_forward_rounded,
                      color: brandPurple,
                      size: 19,
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
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: borderColor,
        ),
      ),
      child: Column(
        children: [
          _buildAccountTile(
            title: "Edit Profile",
            subtitle: "Update your personal information",
            icon: Icons.person_outline_rounded,
            iconColor: brandPurple,
            iconBackground: lightPurpleBg,
            onTap: _openProfileDetails,
            isFirst: true,
          ),

          _buildAccountTile(
            title: "Refer & Earn",
            subtitle: "Invite friends and earn ride points",
            icon: Icons.card_giftcard_rounded,
            iconColor: const Color(0xFF2563EB),
            iconBackground: const Color(0xFFEFF6FF),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) =>
                      const ReferEarnScreen(),
                ),
              );
            },
          ),

          _buildAccountTile(
            title: "Promotions & Offers",
            subtitle: "Discover available offers",
            icon: Icons.local_offer_rounded,
            iconColor: const Color(0xFF9333EA),
            iconBackground: const Color(0xFFF3E8FF),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) =>
                      const OfferScreen(),
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
                  builder: (_) =>
                      const HelpScreen(),
                ),
              );
            },
          ),

          _buildAccountTile(
            title: "Preferences",
            subtitle: "App settings and preferences",
            icon: Icons.tune_rounded,
            iconColor: const Color(0xFFD97706),
            iconBackground: const Color(0xFFFFFBEB),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) =>
                      const PreferencesScreen(),
                ),
              );
            },
          ),

          _buildAccountTile(
            title: "About Evegah",
            subtitle: "Version, terms and information",
            icon: Icons.info_outline_rounded,
            iconColor: secondaryText,
            iconBackground: const Color(0xFFF1F5F9),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) =>
                      const AboutScreen(),
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
          top: Radius.circular(
            isFirst ? 22 : 0,
          ),
          bottom: Radius.circular(
            isLast ? 22 : 0,
          ),
        ),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 15,
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: iconBackground,
                      borderRadius:
                          BorderRadius.circular(14),
                    ),
                    child: Icon(
                      icon,
                      color: iconColor,
                      size: 21,
                    ),
                  ),

                  const SizedBox(width: 14),

                  Expanded(
                    child: Column(
                      crossAxisAlignment:
                          CrossAxisAlignment.start,
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
                            color: secondaryText,
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const Icon(
                    Icons.chevron_right_rounded,
                    color: Color(0xFF94A3B8),
                    size: 22,
                  ),
                ],
              ),
            ),

            if (!isLast)
              const Padding(
                padding: EdgeInsets.only(
                  left: 74,
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
  // LOGOUT BUTTON
  // ============================================================

  Widget _buildLogoutButton() {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: _handleLogout,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          width: double.infinity,
          height: 54,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: const Color(0xFFFECACA),
            ),
          ),
          child: const Row(
            mainAxisAlignment:
                MainAxisAlignment.center,
            children: [
              Icon(
                Icons.logout_rounded,
                color: Color(0xFFE11D48),
                size: 20,
              ),
              SizedBox(width: 9),
              Text(
                "Log out",
                style: TextStyle(
                  color: Color(0xFFE11D48),
                  fontSize: 14,
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
              color: Color(0xFF94A3B8),
              fontSize: 11,
              fontWeight: FontWeight.w900,
              letterSpacing: 2.2,
            ),
          ),
          SizedBox(height: 5),
          Text(
            "India's smart EV rental mobility",
            style: TextStyle(
              color: Color(0xFF94A3B8),
              fontSize: 10,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}