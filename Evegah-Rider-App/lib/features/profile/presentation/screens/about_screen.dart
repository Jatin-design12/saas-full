import 'package:flutter/material.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  static const Color brandPurple = Color(0xFF5B30D1);
  static const Color brandPurpleDark = Color(0xFF38148E);
  static const Color darkText = Color(0xFF111827);
  static const Color secondaryText = Color(0xFF64748B);
  static const Color pageBackground = Color(0xFFF7F8FC);
  static const Color cardBorder = Color(0xFFF1F5F9);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackground,
      body: SafeArea(
        child: Column(
          children: [
            // Custom App Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Align(
                    alignment: Alignment.centerLeft,
                    child: GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: cardBorder),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.03),
                              blurRadius: 10,
                              offset: const Offset(0, 2),
                            )
                          ],
                        ),
                        child: const Icon(
                          Icons.chevron_left_rounded,
                          size: 28,
                          color: darkText,
                        ),
                      ),
                    ),
                  ),
                  const Text(
                    "About Evegah",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: darkText,
                      letterSpacing: -0.3,
                    ),
                  ),
                ],
              ),
            ),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 1. Top Artwork Banner (contains hero + about card in single crisp banner)
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: brandPurple.withOpacity(0.06),
                            blurRadius: 18,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(24),
                        child: Image.asset(
                          "assets/about_banner.png",
                          width: double.infinity,
                          fit: BoxFit.contain,
                          alignment: Alignment.topCenter,
                        ),
                      ),
                    ),

                    const SizedBox(height: 16),

                    // 2. Stats Row Card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: cardBorder),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.025),
                            blurRadius: 14,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          _buildStatItem(Icons.groups_rounded, "10,000+", "Happy Customers"),
                          _buildDivider(),
                          _buildStatItem(Icons.electric_scooter_rounded, "5,000+", "EVs on Rent"),
                          _buildDivider(),
                          _buildStatItem(Icons.location_on_rounded, "75+", "Cities Covered"),
                          _buildDivider(),
                          _buildStatItem(Icons.workspace_premium_rounded, "4.8 ★", "Customer Rating"),
                        ],
                      ),
                    ),

                    const SizedBox(height: 22),

                    // 3. Why Choose Evegah? Section
                    const Text(
                      "Why Choose Evegah?",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: darkText,
                        letterSpacing: -0.2,
                      ),
                    ),

                    const SizedBox(height: 14),

                    // Horizontal scrolling features list
                    SizedBox(
                      height: 180,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        clipBehavior: Clip.none,
                        children: [
                          _buildFeatureCard(
                            Icons.electric_scooter_rounded,
                            "Wide Range",
                            "Choose from a variety of EVs that suit your every need.",
                          ),
                          _buildFeatureCard(
                            Icons.verified_user_rounded,
                            "Smart & Reliable",
                            "Advanced technology for a safe, smooth & connected ride.",
                          ),
                          _buildFeatureCard(
                            Icons.account_balance_wallet_rounded,
                            "Affordable Plans",
                            "Flexible rental plans that fit your budget and usage.",
                          ),
                          _buildFeatureCard(
                            Icons.headset_mic_rounded,
                            "24/7 Support",
                            "Round the clock support for a hassle-free experience.",
                          ),
                          _buildFeatureCard(
                            Icons.eco_rounded,
                            "Sustainable Future",
                            "Drive electric and contribute to a greener tomorrow.",
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 22),

                    // 4. Bottom CTA Banner
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(22),
                        gradient: const LinearGradient(
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                          colors: [
                            Color(0xFF38148E),
                            Color(0xFF5B30D1),
                            Color(0xFF7A4DFB),
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: brandPurple.withOpacity(0.28),
                            blurRadius: 18,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          // Shield Icon
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.18),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.verified_user_rounded,
                              color: Colors.white,
                              size: 26,
                            ),
                          ),

                          const SizedBox(width: 12),

                          // Text Info
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text(
                                  "Drive Smart. Drive Electric. Drive Evegah.",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: -0.2,
                                  ),
                                ),
                                SizedBox(height: 3),
                                Text(
                                  "Join thousands of Indians who trust Evegah for a smarter and sustainable ride.",
                                  style: TextStyle(
                                    color: Colors.white70,
                                    fontSize: 10,
                                    height: 1.35,
                                    fontWeight: FontWeight.w400,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(width: 10),

                          // Explore Vehicles Button
                          GestureDetector(
                            onTap: () => Navigator.pop(context),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(14),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.08),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: const [
                                  Text(
                                    "Explore Vehicles",
                                    style: TextStyle(
                                      color: brandPurpleDark,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                  SizedBox(width: 4),
                                  Icon(
                                    Icons.chevron_right_rounded,
                                    color: brandPurpleDark,
                                    size: 16,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // 5. Footer
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Text(
                          "Made with ",
                          style: TextStyle(
                            color: secondaryText,
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        Icon(
                          Icons.favorite_rounded,
                          color: brandPurple,
                          size: 14,
                        ),
                        Text(
                          " for a better tomorrow",
                          style: TextStyle(
                            color: secondaryText,
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(IconData icon, String value, String label) {
    return Expanded(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: brandPurple, size: 24),
          const SizedBox(height: 6),
          Text(
            value,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: darkText,
              fontSize: 14.5,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              color: secondaryText,
              fontSize: 9.5,
              fontWeight: FontWeight.w500,
              height: 1.2,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      width: 1,
      height: 48,
      color: const Color(0xFFF1F5F9),
    );
  }

  Widget _buildFeatureCard(IconData icon, String title, String description) {
    return Container(
      width: 135,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: cardBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.025),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: const Color(0xFFF3EFFF),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: brandPurple, size: 22),
          ),
          const Spacer(),
          Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 12.5,
              fontWeight: FontWeight.w800,
              color: darkText,
              letterSpacing: -0.2,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            description,
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 10,
              color: secondaryText,
              height: 1.35,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}