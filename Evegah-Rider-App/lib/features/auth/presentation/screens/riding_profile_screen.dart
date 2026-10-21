import 'package:flutter/material.dart';

class RidingProfileScreen extends StatefulWidget {
  final String? initialSelectedProfile;
  final ValueChanged<String>? onContinue;
  final VoidCallback? onSkip;
  final VoidCallback? onBack;

  const RidingProfileScreen({
    super.key,
    this.initialSelectedProfile,
    this.onContinue,
    this.onSkip,
    this.onBack,
  });

  @override
  State<RidingProfileScreen> createState() => _RidingProfileScreenState();
}

class _RidingProfileScreenState extends State<RidingProfileScreen> {
  // 0 = Student, 1 = Delivery Partner, 2 = General User
  int _selectedIndex = 0;

  final List<Map<String, dynamic>> _profiles = [
    {
      "id": "Student",
      "title": "Student",
      "subtitle": "Ride to class, chill,\nexplore, and enjoy.",
      "cardBg": Color(0xFFEDE9FF), // Exact from design spec #EDE9FF
      "iconBg": Color(0xFF6F3CFF),
      "iconAsset": "assets/icons/ic_student_cap.png",
      "fallbackIcon": Icons.school_rounded,
      "imageAsset": "assets/student_girl.png",
      "accentColor": Color(0xFF6F3CFF),
    },
    {
      "id": "Delivery Partner",
      "title": "Delivery Partner",
      "subtitle": "Ride for deliveries —\nwork, earn, repeat.",
      "cardBg": Color(0xFFE8FAF2), // Exact from design spec #E8FAF2
      "iconBg": Color(0xFF198754),
      "iconAsset": "assets/icons/ic_delivery_scooter.png",
      "fallbackIcon": Icons.two_wheeler_rounded,
      "imageAsset": "assets/delivery_boy.png",
      "accentColor": Color(0xFF198754),
    },
    {
      "id": "General User",
      "title": "General User",
      "subtitle": "Explore the city\nthe electric way.",
      "cardBg": Color(0xFFFFF6E2), // Exact from design spec #FFF6E2
      "iconBg": Color(0xFFF59E0B),
      "iconAsset": "assets/icons/ic_general_user.png",
      "fallbackIcon": Icons.manage_accounts_rounded,
      "imageAsset": "assets/general_user.png",
      "accentColor": Color(0xFFF59E0B),
    },
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialSelectedProfile != null) {
      final idx = _profiles.indexWhere((p) => p["id"] == widget.initialSelectedProfile);
      if (idx != -1) _selectedIndex = idx;
    }
  }

  void _handleContinue() {
    final selectedProfile = _profiles[_selectedIndex]["id"] as String;
    if (widget.onContinue != null) {
      widget.onContinue!(selectedProfile);
    } else {
      Navigator.of(context).pop(selectedProfile);
    }
  }

  void _handleSkip() {
    if (widget.onSkip != null) {
      widget.onSkip!();
    } else {
      _handleContinue();
    }
  }

  void _handleBack() {
    if (widget.onBack != null) {
      widget.onBack!();
    } else {
      Navigator.of(context).maybePop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final bottomPadding = mediaQuery.padding.bottom;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) {
          _handleBack();
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFFF5F2FF), // Exact from design spec #F5F2FF
        body: Stack(
          children: [
            // Background city skyline illustration (top right)
            Positioned(
              top: 0,
              right: -20,
              width: 240,
              height: 180,
              child: Opacity(
                opacity: 0.08,
                child: Image.asset(
                  'assets/City-1.png',
                  fit: BoxFit.contain,
                  errorBuilder: (_, __, ___) => Image.asset(
                    'assets/city.png',
                    fit: BoxFit.contain,
                    errorBuilder: (_, __, ___) => const SizedBox(),
                  ),
                ),
              ),
            ),

            // Leaf decorative illustrations (Left and Right borders)
            Positioned(
              top: 140,
              left: -10,
              child: CustomPaint(
                size: const Size(40, 100),
                painter: _LeafDecorationPainter(isLeft: true),
              ),
            ),
            Positioned(
              top: 280,
              right: -10,
              child: CustomPaint(
                size: const Size(40, 100),
                painter: _LeafDecorationPainter(isLeft: false),
              ),
            ),

            // Main Scrollable / Column Content
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 12),

                    // 1. Top App Bar: Back/Logo Left + Skip Button Right
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        // Left Back button (if available) + Evegah Brand Logo
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (widget.onBack != null || Navigator.canPop(context)) ...[
                              GestureDetector(
                                onTap: _handleBack,
                                child: Container(
                                  width: 36,
                                  height: 36,
                                  margin: const EdgeInsets.only(right: 10),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                    border: Border.all(color: const Color(0xFFE2E8F0)),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withValues(alpha: 0.04),
                                        blurRadius: 6,
                                        offset: const Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: const Center(
                                    child: Icon(
                                      Icons.arrow_back,
                                      size: 18,
                                      color: Color(0xFF1E293B),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                            _buildEvegahLogo(),
                          ],
                        ),

                        // Skip Pill Button
                        GestureDetector(
                          onTap: _handleSkip,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 7),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.03),
                                  blurRadius: 6,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: const Text(
                              "Skip",
                              style: TextStyle(
                                fontSize: 13.5,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF64748B),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 28),

                    // 2. Heading: "I want to ride as a..."
                    const Text(
                      "I want to ride as a...",
                      style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F0B3D), // Exact color #0F0B3D
                        letterSpacing: -0.5,
                        height: 1.15,
                      ),
                    ),
                    const SizedBox(height: 8),

                    // 3. Subtitle
                    const Text(
                      "Select a profile to get a personalized\nexperience",
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w400,
                        color: Color(0xFF8A8FA3), // Exact color #8A8FA3
                        height: 1.35,
                      ),
                    ),

                    const SizedBox(height: 24),

                    // 4. Three Selectable Riding Profile Cards
                    Expanded(
                      child: ListView.separated(
                        padding: EdgeInsets.zero,
                        physics: const BouncingScrollPhysics(),
                        itemCount: _profiles.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 16), // Exact spacing 16px
                        itemBuilder: (context, index) {
                          return _buildProfileCard(index);
                        },
                      ),
                    ),

                    const SizedBox(height: 16),

                    // 5. Large Rounded Continue Button (Height 56, Radius 28, Color #6F3CFF)
                    Container(
                      width: double.infinity,
                      height: 56, // Exact height 56px
                      decoration: BoxDecoration(
                        color: const Color(0xFF6F3CFF), // Exact primary #6F3CFF
                        borderRadius: BorderRadius.circular(28), // Exact radius 28px
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x446F3CFF),
                            blurRadius: 16,
                            offset: Offset(0, 6),
                          ),
                        ],
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(28),
                          onTap: _handleContinue,
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "Continue",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.2,
                                ),
                              ),
                              SizedBox(width: 8),
                              Icon(
                                Icons.arrow_forward_rounded,
                                color: Colors.white,
                                size: 20,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // 6. Security Trust Badge
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 20,
                          height: 20,
                          decoration: const BoxDecoration(
                            color: Color(0xFF6F3CFF),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.check,
                            size: 13,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          "Your data is safe & secure with ",
                          style: TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF64748B),
                          ),
                        ),
                        const Text(
                          "Evegah",
                          style: TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF2A195C),
                          ),
                        ),
                      ],
                    ),

                    SizedBox(height: bottomPadding > 0 ? bottomPadding : 12),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- BRAND LOGO ROW ---
  Widget _buildEvegahLogo() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        // Bolt Logo Icon
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: const Color(0xFF6F3CFF),
            borderRadius: BorderRadius.circular(8),
            boxShadow: const [
              BoxShadow(
                color: Color(0x336F3CFF),
                blurRadius: 6,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: const Center(
            child: Icon(
              Icons.bolt_rounded,
              color: Colors.white,
              size: 22,
            ),
          ),
        ),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: const [
            Text(
              "Evegah",
              style: TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F0B3D),
                letterSpacing: -0.5,
                height: 1.1,
              ),
            ),
            Text(
              "RIDE CLEANER TOMORROW",
              style: TextStyle(
                fontSize: 7.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFF6F3CFF),
                letterSpacing: 0.8,
              ),
            ),
          ],
        ),
      ],
    );
  }

  // --- INDIVIDUAL RIDER PROFILE CARD ---
  Widget _buildProfileCard(int index) {
    final profile = _profiles[index];
    final bool isSelected = _selectedIndex == index;

    final Color cardBackground = isSelected
        ? (profile["cardBg"] as Color) // Exact cardBg (#EDE9FF, #E8FAF2, #FFF6E2)
        : Colors.white;

    final Color borderColor = isSelected
        ? const Color(0xFF6F3CFF) // Exact primary purple for selected border
        : const Color(0xFFE2E8F0);

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedIndex = index;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        height: 104, // Card height ~96-104px
        decoration: BoxDecoration(
          color: cardBackground,
          borderRadius: BorderRadius.circular(16), // Exact card radius 16px
          border: Border.all(
            color: borderColor,
            width: isSelected ? 2.0 : 1.2,
          ),
          boxShadow: [
            BoxShadow(
              color: isSelected ? const Color(0x1F6F3CFF) : Colors.black.withValues(alpha: 0.03),
              blurRadius: isSelected ? 14 : 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(15),
          child: Stack(
            children: [
              // 1. Right Side Illustration (~140-150px wide)
              Positioned(
                right: -6,
                top: 0,
                bottom: 0,
                width: 146,
                child: Image.asset(
                  profile["imageAsset"] as String,
                  fit: BoxFit.cover,
                  alignment: Alignment.centerRight,
                  errorBuilder: (_, __, ___) => const SizedBox(),
                ),
              ),

              // 2. Left Icon Circle & Typography
              Positioned(
                left: 14,
                top: 0,
                bottom: 0,
                right: 120, // Prevents text colliding with right illustration
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Icon Circle (48x48)
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: profile["iconBg"] as Color,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: (profile["iconBg"] as Color).withValues(alpha: 0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: ClipOval(
                        child: Image.asset(
                          profile["iconAsset"] as String,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Icon(
                            profile["fallbackIcon"] as IconData,
                            color: Colors.white,
                            size: 24,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),

                    // Texts
                    Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            profile["title"] as String,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0F0B3D),
                              letterSpacing: -0.3,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            profile["subtitle"] as String,
                            style: const TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w400,
                              color: Color(0xFF8A8FA3),
                              height: 1.25,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // 3. Selection Indicator (Top Right Corner)
              Positioned(
                top: 10,
                right: 10,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isSelected ? const Color(0xFF6F3CFF) : Colors.white.withValues(alpha: 0.9),
                    border: Border.all(
                      color: isSelected ? const Color(0xFF6F3CFF) : const Color(0xFFCBD5E1),
                      width: isSelected ? 2.0 : 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.08),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: isSelected
                      ? const Icon(
                          Icons.check,
                          size: 15,
                          color: Colors.white,
                        )
                      : null,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// --- SUBTLE BOTANICAL LEAF ACCENT PAINTER ---
class _LeafDecorationPainter extends CustomPainter {
  final bool isLeft;
  _LeafDecorationPainter({required this.isLeft});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF10B981).withValues(alpha: 0.18)
      ..style = PaintingStyle.fill;

    final path = Path();
    if (isLeft) {
      path.moveTo(0, 20);
      path.quadraticBezierTo(size.width * 0.8, 10, size.width, 35);
      path.quadraticBezierTo(size.width * 0.4, 55, 0, 50);
      path.close();

      path.moveTo(0, 60);
      path.quadraticBezierTo(size.width * 0.9, 50, size.width * 0.8, 80);
      path.quadraticBezierTo(size.width * 0.3, 95, 0, 90);
      path.close();
    } else {
      path.moveTo(size.width, 20);
      path.quadraticBezierTo(size.width * 0.2, 10, 0, 35);
      path.quadraticBezierTo(size.width * 0.6, 55, size.width, 50);
      path.close();

      path.moveTo(size.width, 60);
      path.quadraticBezierTo(size.width * 0.1, 50, size.width * 0.2, 80);
      path.quadraticBezierTo(size.width * 0.7, 95, size.width, 90);
      path.close();
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
