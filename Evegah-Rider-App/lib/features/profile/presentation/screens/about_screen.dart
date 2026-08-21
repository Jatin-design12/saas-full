import 'package:flutter/material.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
              "About EVegah",
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 22,
                color: Color(0xFF0F172A),
              ),
            ),
            SizedBox(height: 2),
            Text(
              "Ride Green. Live Clean.",
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
            // Top Hero Card
            _buildHeroCard(),
            const SizedBox(height: 20),

            // 4 Metrics / Stats Row
            Row(
              children: [
                Expanded(child: _buildStatItem("25K+", "Rides Completed", Icons.electric_scooter_rounded, const Color(0xFFF5F3FF), const Color(0xFF6366F1))),
                const SizedBox(width: 8),
                Expanded(child: _buildStatItem("120+", "Tons CO₂ Saved", Icons.eco_rounded, const Color(0xFFECFDF5), const Color(0xFF10B981))),
                const SizedBox(width: 8),
                Expanded(child: _buildStatItem("15K+", "Happy Riders", Icons.people_alt_rounded, const Color(0xFFEFF6FF), const Color(0xFF3B82F6))),
                const SizedBox(width: 8),
                Expanded(child: _buildStatItem("25+", "Cities", Icons.location_on_rounded, const Color(0xFFFFF7ED), const Color(0xFFF97316))),
              ],
            ),
            const SizedBox(height: 24),

            // Our Mission Section
            const Text(
              "Our Mission",
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 6),
            const Text(
              "To make clean and green mobility accessible to everyone while contributing to a sustainable future.",
              style: TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.45, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 18),

            // 4 Value / Feature Action Rows
            _buildValueCard(
              title: "Smart & Reliable",
              subtitle: "AI-powered fleet ensuring a seamless and reliable ride.",
              icon: Icons.bolt_rounded,
              iconColor: const Color(0xFF6366F1),
              iconBg: const Color(0xFFF5F3FF),
            ),
            const SizedBox(height: 10),

            _buildValueCard(
              title: "Eco-Friendly",
              subtitle: "Zero emissions, lower carbon footprint, cleaner tomorrow.",
              icon: Icons.eco_outlined,
              iconColor: const Color(0xFF10B981),
              iconBg: const Color(0xFFECFDF5),
            ),
            const SizedBox(height: 10),

            _buildValueCard(
              title: "Safe & Secure",
              subtitle: "Your safety is our priority at every kilometer.",
              icon: Icons.shield_outlined,
              iconColor: const Color(0xFF3B82F6),
              iconBg: const Color(0xFFEFF6FF),
            ),
            const SizedBox(height: 10),

            _buildValueCard(
              title: "Easy & Accessible",
              subtitle: "Book, ride, and pay in just a few taps.",
              icon: Icons.phone_android_rounded,
              iconColor: const Color(0xFFF97316),
              iconBg: const Color(0xFFFFF7ED),
            ),
            const SizedBox(height: 20),

            // Bottom Sustainability Banner
            _buildGreenerPlanetCard(),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFF8FAFC), Color(0xFFF5F3FF), Color(0xFFEEF2FF)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFDDD6FE), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6366F1).withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Row(
        children: [
          Expanded(
            flex: 6,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "EVEGAH",
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF2A195C),
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 10),
                const Text(
                  "EVegah is building the future of urban mobility with smart, sustainable, and accessible EV solutions.",
                  style: TextStyle(
                    fontSize: 12,
                    color: Color(0xFF64748B),
                    height: 1.45,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 12),
                Container(
                  width: 32,
                  height: 3,
                  decoration: BoxDecoration(
                    color: const Color(0xFF6366F1),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 10),
                const Text(
                  "Smarter Rides. Better Planet.",
                  style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF6366F1),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),

          // 3D EV Scooter Illustration
          Expanded(
            flex: 5,
            child: Container(
              height: 130,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.6),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Image.asset(
                    'assets/city.png',
                    height: 100,
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) =>
                        const Icon(Icons.electric_scooter_rounded, size: 70, color: Color(0xFF8B5CF6)),
                  ),
                  const Positioned(
                    top: 16,
                    right: 16,
                    child: Icon(Icons.eco_rounded, size: 18, color: Color(0xFF10B981)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String val, String lbl, IconData icon, Color iconBg, Color iconColor) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0), width: 1.5),
      ),
      child: Column(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(color: iconBg, shape: BoxShape.circle),
            child: Icon(icon, color: iconColor, size: 18),
          ),
          const SizedBox(height: 8),
          Text(
            val,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 2),
          Text(
            lbl,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 9.5, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildValueCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required Color iconBg,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0), width: 1.5),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(color: iconBg, shape: BoxShape.circle),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(width: 14),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),

          const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8), size: 20),
        ],
      ),
    );
  }

  Widget _buildGreenerPlanetCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFECFDF5),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFA7F3D0), width: 1.5),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: const BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.eco_rounded, color: Color(0xFF10B981), size: 22),
          ),
          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Together for a Greener Planet",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                SizedBox(height: 2),
                Text(
                  "Every ride with EVegah brings us closer to a cleaner, greener and better tomorrow.",
                  style: TextStyle(fontSize: 11.5, color: Color(0xFF047857), fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),

          const SizedBox(width: 8),
          const Icon(Icons.public_rounded, size: 40, color: Color(0xFF10B981)),
        ],
      ),
    );
  }
}
