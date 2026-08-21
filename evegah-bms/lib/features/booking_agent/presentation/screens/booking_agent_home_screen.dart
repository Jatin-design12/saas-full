import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'new_ride_rider_details_screen.dart';
import 'retain_rider_search_screen.dart';
import 'return_ride_search_screen.dart';
import 'battery_swap_search_screen.dart';

class BookingAgentHomeScreen extends StatefulWidget {
  const BookingAgentHomeScreen({super.key});

  @override
  State<BookingAgentHomeScreen> createState() => _BookingAgentHomeScreenState();
}

class _BookingAgentHomeScreenState extends State<BookingAgentHomeScreen> {
  int _currentBottomNavIndex = 0;
  String _agentStatus = "Online";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EmployeeTheme.softBlueBackground,
      bottomNavigationBar: _buildBottomNav(),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. TOP HEADER (Drawer menu, Evegah Logo, Bell Notification)
              _buildTopHeader(context),
              const SizedBox(height: 16),

              // 2. GREETING & STATUS CARD
              _buildGreetingHeader(),
              const SizedBox(height: 16),

              // 3. TODAY'S OVERVIEW CARD
              _buildTodaysOverviewCard(),
              const SizedBox(height: 20),

              // 4. QUICK ACTIONS SECTION
              _buildQuickActionsHeader(),
              const SizedBox(height: 12),
              _buildQuickActionsGrid(context),
              const SizedBox(height: 20),

              // 5. ACTIVE RIDE BANNER CARD
              _buildActiveRideCard(),
              const SizedBox(height: 20),

              // 6. RECENT SUBMISSIONS SECTION
              _buildRecentSubmissionsHeader(),
              const SizedBox(height: 12),
              _buildRecentSubmissionsList(),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  // 1. TOP HEADER
  Widget _buildTopHeader(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Menu Drawer Icon
        IconButton(
          onPressed: () {
            Scaffold.of(context).openDrawer();
          },
          icon: const Icon(Icons.notes_rounded, color: EmployeeTheme.textDark, size: 26),
          padding: EdgeInsets.zero,
          constraints: const BoxConstraints(),
        ),

        // Evegah Logo with green dot on the 'e'
        RichText(
          text: TextSpan(
            children: [
              const TextSpan(
                text: 'l',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: EmployeeTheme.primaryPurple,
                  fontFamily: 'sans-serif',
                ),
              ),
              WidgetSpan(
                alignment: PlaceholderAlignment.middle,
                child: Stack(
                  alignment: Alignment.topRight,
                  children: [
                    const Text(
                      'e',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                        color: EmployeeTheme.primaryPurple,
                        fontFamily: 'sans-serif',
                      ),
                    ),
                    Positioned(
                      top: 4,
                      right: 1,
                      child: Container(
                        width: 5,
                        height: 5,
                        decoration: const BoxDecoration(
                          color: EmployeeTheme.limeGreenCircle,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const TextSpan(
                text: 'vegah',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: EmployeeTheme.primaryPurple,
                  fontFamily: 'sans-serif',
                ),
              ),
            ],
          ),
        ),

        // Notification Bell Icon with Badge
        Stack(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.notifications_none_rounded, color: EmployeeTheme.textDark, size: 24),
            ),
            Positioned(
              top: 6,
              right: 6,
              child: Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: Color(0xFFEF4444),
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // 2. GREETING HEADER
  Widget _buildGreetingHeader() {
    return Row(
      children: [
        // Avatar circle
        Container(
          width: 52,
          height: 52,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: const Color(0xFF1E1B4B),
            border: Border.all(color: Colors.white, width: 2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.06),
                blurRadius: 8,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: const Center(
            child: Icon(Icons.person, color: Colors.white, size: 30),
          ),
        ),
        const SizedBox(width: 12),

        // Text Column
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text(
                "Hello, Akash",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: EmployeeTheme.textDark,
                ),
              ),
              SizedBox(height: 2),
              Text(
                "Booking Agent",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: EmployeeTheme.textSecondary,
                ),
              ),
            ],
          ),
        ),

        // Online Status Dropdown Button
        PopupMenuButton<String>(
          onSelected: (val) {
            setState(() => _agentStatus = val);
          },
          itemBuilder: (context) => [
            const PopupMenuItem(value: "Online", child: Text("• Online", style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold))),
            const PopupMenuItem(value: "Busy", child: Text("• Busy", style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold))),
            const PopupMenuItem(value: "Offline", child: Text("• Offline", style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold))),
          ],
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: EmployeeTheme.borderColor),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 7,
                  height: 7,
                  decoration: BoxDecoration(
                    color: _agentStatus == "Online"
                        ? EmployeeTheme.successGreen
                        : (_agentStatus == "Busy" ? Colors.orange : Colors.grey),
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  _agentStatus,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: EmployeeTheme.textDark,
                  ),
                ),
                const SizedBox(width: 4),
                const Icon(Icons.keyboard_arrow_down_rounded, color: EmployeeTheme.textSecondary, size: 16),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // 3. TODAY'S OVERVIEW CARD
  Widget _buildTodaysOverviewCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: EmployeeTheme.overviewGradient,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.purple.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Title & Dropdown Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Today's Overview",
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: EmployeeTheme.textDark,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: EmployeeTheme.borderColor),
                ),
                child: Row(
                  children: const [
                    Text(
                      "Today",
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: EmployeeTheme.primaryPurple,
                      ),
                    ),
                    SizedBox(width: 4),
                    Icon(Icons.keyboard_arrow_down_rounded, size: 14, color: EmployeeTheme.primaryPurple),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // 4 Stat Columns Row
          Row(
            children: [
              Expanded(child: _buildOverviewStatItem("12", "Total Rides", Icons.description_outlined, const Color(0xFFE8E5FF), const Color(0xFF200F54))),
              _buildVerticalDivider(),
              Expanded(child: _buildOverviewStatItem("8", "Completed", Icons.check_circle_outline_rounded, const Color(0xFFDCFCE7), const Color(0xFFD2FC00))),
              _buildVerticalDivider(),
              Expanded(child: _buildOverviewStatItem("4", "Ongoing", Icons.access_time_rounded, const Color(0xFFE8E5FF), const Color(0xFF3B82F6))),
              _buildVerticalDivider(),
              Expanded(child: _buildOverviewStatItem("2", "Pending", Icons.hourglass_empty_rounded, const Color(0xFFFEF3C7), const Color(0xFFEAB308))),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildVerticalDivider() {
    return Container(
      height: 48,
      width: 1,
      color: const Color(0xFFE2E8F0),
    );
  }

  Widget _buildOverviewStatItem(String val, String label, IconData icon, Color iconBgColor, Color barColor) {
    return Column(
      children: [
        Container(
          width: 34,
          height: 34,
          decoration: BoxDecoration(
            color: iconBgColor,
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 18, color: EmployeeTheme.primaryPurple),
        ),
        const SizedBox(height: 8),
        Text(
          val,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: EmployeeTheme.textDark,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            color: EmployeeTheme.textSecondary,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: 28,
          height: 3,
          decoration: BoxDecoration(
            color: barColor,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
      ],
    );
  }

  // 4. QUICK ACTIONS SECTION
  Widget _buildQuickActionsHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          "Quick Actions",
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: EmployeeTheme.textDark,
          ),
        ),
        GestureDetector(
          onTap: () {},
          child: Row(
            children: const [
              Text(
                "View All",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: EmployeeTheme.brandPurple,
                ),
              ),
              SizedBox(width: 2),
              Icon(Icons.chevron_right_rounded, size: 16, color: EmployeeTheme.brandPurple),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildQuickActionsGrid(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _buildQuickActionCard(
            context: context,
            title: "New Rider",
            subtitle: "Onboard new rider",
            icon: Icons.electric_scooter_rounded,
            badgeIcon: Icons.add,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const NewRideRiderDetailsScreen()),
              );
            },
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _buildQuickActionCard(
            context: context,
            title: "Retain Rider",
            subtitle: "Update existing rider",
            icon: Icons.published_with_changes_rounded,
            badgeIcon: Icons.person,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const RetainRiderSearchScreen()),
              );
            },
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _buildQuickActionCard(
            context: context,
            title: "Return Rider",
            subtitle: "Rider returning back",
            icon: Icons.u_turn_left_rounded,
            badgeIcon: Icons.person,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const ReturnRideSearchScreen()),
              );
            },
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _buildQuickActionCard(
            context: context,
            title: "Battery Swap",
            subtitle: "Record battery swap",
            icon: Icons.battery_charging_full_rounded,
            badgeIcon: Icons.refresh,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const BatterySwapSearchScreen()),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildQuickActionCard({
    required BuildContext context,
    required String title,
    required String subtitle,
    required IconData icon,
    required IconData badgeIcon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.015),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            // Top Icon with small Badge
            Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: const BoxDecoration(
                    color: Color(0xFFF0EFFE),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: EmployeeTheme.brandPurple, size: 22),
                ),
                Positioned(
                  bottom: -1,
                  right: -1,
                  child: Container(
                    width: 14,
                    height: 14,
                    decoration: const BoxDecoration(
                      color: EmployeeTheme.limeGreenCircle,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(badgeIcon, color: EmployeeTheme.primaryPurple, size: 9),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 8.5,
                color: EmployeeTheme.textMuted,
                height: 1.2,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 10),
            // Bottom Right Action Circle Button
            Align(
              alignment: Alignment.centerRight,
              child: Container(
                width: 22,
                height: 22,
                decoration: const BoxDecoration(
                  color: EmployeeTheme.limeGreenCircle,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.chevron_right_rounded, color: EmployeeTheme.primaryPurple, size: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 5. ACTIVE RIDE CARD
  Widget _buildActiveRideCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: EmployeeTheme.activeRideGradient,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: EmployeeTheme.primaryPurple.withOpacity(0.2),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            children: [
              // Scooter icon with live green dot
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.electric_scooter_rounded, color: EmployeeTheme.primaryPurple, size: 26),
                  ),
                  Positioned(
                    bottom: 2,
                    right: 2,
                    child: Container(
                      width: 10,
                      height: 10,
                      decoration: BoxDecoration(
                        color: EmployeeTheme.successGreen,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 1.5),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Active Ride",
                      style: TextStyle(
                        color: Color(0xFFCCFF00),
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        const Text(
                          "RIDE-1256",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: EmployeeTheme.successBg,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Text(
                            "Ongoing",
                            style: TextStyle(
                              color: EmployeeTheme.successGreen,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Call Button
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.12),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white24),
                ),
                child: const Icon(Icons.phone_rounded, color: Colors.white, size: 18),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(color: Colors.white12, height: 1),
          const SizedBox(height: 12),

          // 3 Columns Row
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text("Rider", style: TextStyle(fontSize: 10, color: Colors.white60, fontWeight: FontWeight.w500)),
                    SizedBox(height: 4),
                    Text("Rahul Sharma", style: TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              Container(height: 26, width: 1, color: Colors.white24),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: const [
                    Text("Vehicle", style: TextStyle(fontSize: 10, color: Colors.white60, fontWeight: FontWeight.w500)),
                    SizedBox(height: 4),
                    Text("EV-12KA-1234", style: TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              Container(height: 26, width: 1, color: Colors.white24),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: const [
                    Text("Start Time", style: TextStyle(fontSize: 10, color: Colors.white60, fontWeight: FontWeight.w500)),
                    SizedBox(height: 4),
                    Text("10:30 AM", style: TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 6. RECENT SUBMISSIONS SECTION
  Widget _buildRecentSubmissionsHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          "Recent Submissions",
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: EmployeeTheme.textDark,
          ),
        ),
        GestureDetector(
          onTap: () {},
          child: Row(
            children: const [
              Text(
                "View All",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: EmployeeTheme.brandPurple,
                ),
              ),
              SizedBox(width: 2),
              Icon(Icons.chevron_right_rounded, size: 16, color: EmployeeTheme.brandPurple),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRecentSubmissionsList() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.015),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          _buildSubmissionTile(
            icon: Icons.electric_scooter_rounded,
            iconBg: const Color(0xFFF0EFFE),
            title: "New Rider - RIDE-1256",
            subtitle: "Rahul Sharma • 20 May 2024, 10:30 AM",
            badgeText: "Submitted",
            isSubmitted: true,
          ),
          const Divider(height: 1, color: Color(0xFFF1F5F9)),
          _buildSubmissionTile(
            icon: Icons.published_with_changes_rounded,
            iconBg: const Color(0xFFF4FDE8),
            title: "Retain Rider - RIDE-1248",
            subtitle: "Aman Verma • 20 May 2024, 09:15 AM",
            badgeText: "Draft",
            isSubmitted: false,
          ),
          const Divider(height: 1, color: Color(0xFFF1F5F9)),
          _buildSubmissionTile(
            icon: Icons.u_turn_left_rounded,
            iconBg: const Color(0xFFF0EFFE),
            title: "Return Rider - RIDE-1205",
            subtitle: "Vikram Singh • 19 May 2024, 04:45 PM",
            badgeText: "Submitted",
            isSubmitted: true,
          ),
          const Divider(height: 1, color: Color(0xFFF1F5F9)),
          _buildSubmissionTile(
            icon: Icons.battery_charging_full_rounded,
            iconBg: const Color(0xFFF4FDE8),
            title: "Battery Swap - SWAP-0098",
            subtitle: "EV-12KA-1234 • 19 May 2024, 11:30 AM",
            badgeText: "Submitted",
            isSubmitted: true,
          ),
        ],
      ),
    );
  }

  Widget _buildSubmissionTile({
    required IconData icon,
    required Color iconBg,
    required String title,
    required String subtitle,
    required String badgeText,
    required bool isSubmitted,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: EmployeeTheme.brandPurple, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: EmployeeTheme.textDark,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 10,
                    color: EmployeeTheme.textMuted,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: isSubmitted ? EmployeeTheme.successBg : EmployeeTheme.draftBg,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              badgeText,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: isSubmitted ? EmployeeTheme.successGreen : EmployeeTheme.draftBlue,
              ),
            ),
          ),
          const SizedBox(width: 6),
          const Icon(Icons.chevron_right_rounded, color: EmployeeTheme.textMuted, size: 18),
        ],
      ),
    );
  }

  // 7. BOTTOM NAVIGATION BAR
  Widget _buildBottomNav() {
    return Container(
      height: 64,
      decoration: BoxDecoration(
        color: Colors.white,
        border: const Border(top: BorderSide(color: Color(0xFFF1F5F9), width: 1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(0, Icons.home_rounded, "Home"),
          _buildNavItem(1, Icons.assignment_outlined, "Forms"),
          
          // Center Floating Plus Button
          GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const NewRideRiderDetailsScreen()),
              );
            },
            child: Container(
              width: 48,
              height: 48,
              margin: const EdgeInsets.only(bottom: 4),
              decoration: BoxDecoration(
                color: EmployeeTheme.primaryPurple,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: EmployeeTheme.primaryPurple.withOpacity(0.3),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Icon(Icons.add_rounded, color: Colors.white, size: 28),
            ),
          ),

          _buildNavItem(3, Icons.notifications_none_rounded, "Alerts", hasBadge: true),
          _buildNavItem(4, Icons.grid_view_rounded, "More"),
        ],
      ),
    );
  }

  Widget _buildNavItem(int idx, IconData icon, String label, {bool hasBadge = false}) {
    final isSelected = _currentBottomNavIndex == idx;

    return InkWell(
      onTap: () {
        setState(() => _currentBottomNavIndex = idx);
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: isSelected
            ? BoxDecoration(
                color: EmployeeTheme.lightPurple,
                borderRadius: BorderRadius.circular(12),
              )
            : null,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(
                  icon,
                  color: isSelected ? EmployeeTheme.primaryPurple : EmployeeTheme.textMuted,
                  size: 22,
                ),
                if (hasBadge)
                  Positioned(
                    top: -1,
                    right: -1,
                    child: Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: Color(0xFFEF4444),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected ? EmployeeTheme.primaryPurple : EmployeeTheme.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
