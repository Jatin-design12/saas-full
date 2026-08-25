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

  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = "";

  final List<Map<String, dynamic>> _helpItems = [
    {"title": "Ride Issues", "icon": Icons.electric_scooter_rounded, "keywords": "ride vehicle scooter problem issue"},
    {"title": "Payments", "icon": Icons.account_balance_wallet_rounded, "keywords": "payment pay money razorpay transaction refund"},
    {"title": "My Account", "icon": Icons.person_outline_rounded, "keywords": "account profile login mobile user"},
    {"title": "Offers & Promos", "icon": Icons.local_offer_outlined, "keywords": "offer promo coupon discount code savings"},
    {"title": "Booking", "icon": Icons.calendar_month_rounded, "keywords": "booking reservation pickup return schedule"},
    {"title": "Safety", "icon": Icons.shield_outlined, "keywords": "safety security safe deposit damage"},
    {"title": "How do I cancel my booking?", "icon": Icons.cancel_outlined, "keywords": "cancel cancellation booking reservation"},
    {"title": "How can I change my pickup time?", "icon": Icons.schedule_rounded, "keywords": "change pickup time schedule booking"},
    {"title": "How does the security deposit work?", "icon": Icons.security_rounded, "keywords": "security deposit refundable refund money"},
    {"title": "What should I do if my vehicle has an issue?", "icon": Icons.build_circle_outlined, "keywords": "vehicle issue repair breakdown scooter ride problem"},
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  // =========================
  // COLORS
  // =========================

  static const Color primary = Color(0xFF4320A8);
  static const Color primaryDark = Color(0xFF32157F);
  static const Color primaryLight = Color(0xFFF1ECFF);

  static const Color textDark = Color(0xFF172033);
  static const Color textMedium = Color(0xFF64748B);
  static const Color textLight = Color(0xFF94A3B8);

  static const Color background = Color(0xFFF8F9FD);
  static const Color border = Color(0xFFE7EAF1);

  // =========================
  // PHONE
  // =========================

  Future<void> _makePhoneCall(String phoneNumber) async {
    final Uri launchUri = Uri(
      scheme: 'tel',
      path: phoneNumber,
    );

    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Calling $phoneNumber..."),
          ),
        );
      }
    }
  }

  // =========================
  // EMAIL
  // =========================

  Future<void> _sendEmail(String email) async {
    final Uri launchUri = Uri(
      scheme: 'mailto',
      path: email,
    );

    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Opening mail to $email..."),
          ),
        );
      }
    }
  }

  // =========================
  // BUILD
  // =========================

  @override
  Widget build(BuildContext context) {
    if (_isOffline) return _buildOfflineState();
    if (_isMaintenance) return _buildMaintenanceState();

    return Scaffold(
      backgroundColor: background,
      body: SafeArea(
        child: Column(
          children: [
            _buildAppBar(),

            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.only(bottom: 32),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildHeroHeader(),
                    if (_searchQuery.isNotEmpty) _buildSearchResults(),
                    _buildQuickSupport(),
                    _buildPopularTopics(),
                    _buildFaqSection(),
                    _buildContactBanner(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // APP BAR
  // ============================================================

  Widget _buildAppBar() {
    return Container(
      height: 72,
      padding: const EdgeInsets.symmetric(horizontal: 18),
      decoration: const BoxDecoration(
        color: background,
      ),
      child: Row(
        children: [
          _iconButton(
            icon: Icons.arrow_back_ios_new_rounded,
            onTap: () => Navigator.maybePop(context),
          ),

          const SizedBox(width: 16),

          const Expanded(
            child: Text(
              "Help Center",
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: textDark,
                letterSpacing: -0.3,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // HERO HEADER
  // ============================================================

  Widget _buildHeroHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.fromLTRB(22, 24, 22, 22),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF4B23B5),
              Color(0xFF32157F),
            ],
          ),
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: primary.withOpacity(0.18),
              blurRadius: 24,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Small badge
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 11,
                vertical: 6,
              ),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.14),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: Colors.white.withOpacity(0.15),
                ),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.support_agent_rounded,
                    color: Colors.white,
                    size: 16,
                  ),
                  SizedBox(width: 6),
                  Text(
                    "We're here to help",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            const Text(
              "How can we\nhelp you today?",
              style: TextStyle(
                color: Colors.white,
                fontSize: 30,
                fontWeight: FontWeight.w900,
                height: 1.08,
                letterSpacing: -0.6,
              ),
            ),

            const SizedBox(height: 10),

            Text(
              "Find answers, contact support,\nor get help with your ride.",
              style: TextStyle(
                color: Colors.white.withOpacity(0.78),
                fontSize: 14,
                fontWeight: FontWeight.w500,
                height: 1.45,
              ),
            ),

            const SizedBox(height: 20),

            // Functional search
            Container(
              height: 56,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(17),
              ),
              child: TextField(
                controller: _searchController,
                onChanged: (value) {
                  setState(() {
                    _searchQuery = value.trim();
                  });
                },
                textInputAction: TextInputAction.search,
                onSubmitted: (value) {
                  setState(() {
                    _searchQuery = value.trim();
                  });
                },
                style: const TextStyle(
                  color: textDark,
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
                decoration: InputDecoration(
                  // Explicitly remove the TextField border in every state.
                  // This prevents the inner green/colored focus outline.
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  disabledBorder: InputBorder.none,
                  errorBorder: InputBorder.none,
                  focusedErrorBorder: InputBorder.none,
                  hintText: "Search for help...",
                  hintStyle: const TextStyle(
                    color: textLight,
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                  prefixIcon: const Icon(
                    Icons.search_rounded,
                    color: textLight,
                    size: 22,
                  ),
                  
                  suffixIcon: _searchQuery.isEmpty
                      ? null
                      : IconButton(
                          onPressed: () {
                            _searchController.clear();
                            setState(() {
                              _searchQuery = "";
                            });
                          },
                          icon: const Icon(
                            Icons.close_rounded,
                            color: textMedium,
                            size: 20,
                          ),
                        ),
                  contentPadding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // SEARCH RESULTS
  // ============================================================

  Widget _buildSearchResults() {
    final query = _searchQuery.trim().toLowerCase();
    final queryWords = query
        .split(RegExp(r'\s+'))
        .where((word) => word.isNotEmpty)
        .toList();

    final results = _helpItems.where((item) {
      final title = (item["title"] as String).toLowerCase();
      final keywords = (item["keywords"] ?? "").toString().toLowerCase();
      final searchableText = "$title $keywords";

      // Match the full phrase OR any meaningful search word.
      // This makes searches such as "payment", "ride problem",
      // "cancel", "refund", "vehicle", etc. return useful results.
      return searchableText.contains(query) ||
          queryWords.any((word) => word.length >= 2 && searchableText.contains(word));
    }).toList();

    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 0),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: border,
            width: 1.2,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              results.isEmpty
                  ? "No results found"
                  : "Search results (${results.length})",
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: textDark,
              ),
            ),
            const SizedBox(height: 10),
            if (results.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 12),
                child: Text(
                  "Try a different keyword such as booking, payment, ride, safety, or account.",
                  style: TextStyle(
                    fontSize: 13,
                    color: textMedium,
                    height: 1.45,
                  ),
                ),
              )
            else
              ...results.map(
                (item) => InkWell(
                  borderRadius: BorderRadius.circular(12),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text("${item["title"]} selected"),
                      ),
                    );
                  },
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    child: Row(
                      children: [
                        Container(
                          width: 38,
                          height: 38,
                          decoration: BoxDecoration(
                            color: primaryLight,
                            borderRadius: BorderRadius.circular(11),
                          ),
                          child: Icon(
                            item["icon"] as IconData,
                            color: primary,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            item["title"] as String,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: textDark,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Icon(
                          Icons.arrow_forward_ios_rounded,
                          color: primary,
                          size: 14,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // QUICK SUPPORT
  // ============================================================

  Widget _buildQuickSupport() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _sectionTitle(
            title: "Quick Support",
            subtitle: "Get help from our support team",
          ),

          const SizedBox(height: 14),

          // Live Chat
          GestureDetector(
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Connecting to Live Chat..."),
                ),
              );
            },
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(
                  color: border,
                  width: 1.2,
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 54,
                    height: 54,
                    decoration: BoxDecoration(
                      color: primaryLight,
                      borderRadius: BorderRadius.circular(17),
                    ),
                    child: const Icon(
                      Icons.chat_bubble_rounded,
                      color: primary,
                      size: 25,
                    ),
                  ),

                  const SizedBox(width: 14),

                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Wrap(
                          spacing: 8,
                          runSpacing: 4,
                          crossAxisAlignment: WrapCrossAlignment.center,
                          children: const [
                            Text(
                              "Live Chat",
                              style: TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.w800,
                                color: textDark,
                              ),
                            ),
                            _OnlineBadge(),
                          ],
                        ),
                        SizedBox(height: 5),
                        Text(
                          "Chat with our support team",
                          style: TextStyle(
                            fontSize: 13,
                            color: textMedium,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const Icon(
                    Icons.arrow_forward_ios_rounded,
                    size: 16,
                    color: primary,
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: _supportSmallCard(
                  icon: Icons.phone_rounded,
                  title: "Call Us",
                  subtitle: "24/7 support",
                  iconColor: const Color(0xFF059669),
                  bgColor: const Color(0xFFECFDF5),
                  onTap: () => _makePhoneCall("+919876543210"),
                ),
              ),

              const SizedBox(width: 12),

              Expanded(
                child: _supportSmallCard(
                  icon: Icons.mail_rounded,
                  title: "Email",
                  subtitle: "Write to us",
                  iconColor: const Color(0xFFEA580C),
                  bgColor: const Color(0xFFFFF7ED),
                  onTap: () => _sendEmail("support@evegah.com"),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ============================================================
  // POPULAR TOPICS
  // ============================================================

  Widget _buildPopularTopics() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 30, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _sectionTitle(
            title: "Popular Topics",
            subtitle: "What do you need help with?",
          ),

          const SizedBox(height: 14),

          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.65,
            children: [
              _topicCard(
                title: "Ride Issues",
                icon: Icons.electric_scooter_rounded,
              ),
              _topicCard(
                title: "Payments",
                icon: Icons.account_balance_wallet_rounded,
              ),
              _topicCard(
                title: "My Account",
                icon: Icons.person_outline_rounded,
              ),
              _topicCard(
                title: "Offers & Promos",
                icon: Icons.local_offer_outlined,
              ),
              _topicCard(
                title: "Booking",
                icon: Icons.calendar_month_rounded,
              ),
              _topicCard(
                title: "Safety",
                icon: Icons.shield_outlined,
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ============================================================
  // FAQ
  // ============================================================

  Widget _buildFaqSection() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 30, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _sectionTitle(
            title: "Frequently Asked",
            subtitle: "Quick answers to common questions",
          ),

          const SizedBox(height: 14),

          _faqTile(
            "How do I cancel my booking?",
          ),

          _faqTile(
            "How can I change my pickup time?",
          ),

          _faqTile(
            "How does the security deposit work?",
          ),

          _faqTile(
            "What should I do if my vehicle has an issue?",
          ),
        ],
      ),
    );
  }

  // ============================================================
  // CONTACT BANNER
  // ============================================================

  Widget _buildContactBanner() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFFF2EEFF),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: const Color(0xFFE4DBFF),
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
              ),
              child: const Icon(
                Icons.headset_mic_rounded,
                color: primary,
                size: 24,
              ),
            ),

            const SizedBox(width: 13),

            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Still need help?",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: textDark,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    "Our support team is ready to help.",
                    style: TextStyle(
                      fontSize: 12,
                      color: textMedium,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),

            GestureDetector(
              onTap: () => _makePhoneCall("+919876543210"),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: primary,
                  borderRadius: BorderRadius.circular(13),
                ),
                child: const Text(
                  "Contact",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // SECTION TITLE
  // ============================================================

  Widget _sectionTitle({
    required String title,
    required String subtitle,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: textDark,
            letterSpacing: -0.2,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          subtitle,
          style: const TextStyle(
            fontSize: 13,
            color: textMedium,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  // ============================================================
  // SMALL SUPPORT CARD
  // ============================================================

  Widget _supportSmallCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color iconColor,
    required Color bgColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        constraints: const BoxConstraints(minHeight: 108),
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: border,
            width: 1.2,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: bgColor,
                borderRadius: BorderRadius.circular(11),
              ),
              child: Icon(
                icon,
                color: iconColor,
                size: 19,
              ),
            ),

            const SizedBox(height: 8),

            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: textDark,
              ),
            ),

            const SizedBox(height: 2),

            Text(
              subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 11,
                color: textMedium,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // TOPIC CARD
  // ============================================================

  Widget _topicCard({
    required String title,
    required IconData icon,
  }) {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("$title selected"),
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: border,
            width: 1.2,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: primaryLight,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: primary,
                size: 20,
              ),
            ),

            const SizedBox(width: 10),

            Expanded(
              child: Text(
                title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: textDark,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // FAQ TILE
  // ============================================================

  Widget _faqTile(String question) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(
          color: border,
          width: 1.2,
        ),
      ),
      child: Theme(
        data: Theme.of(context).copyWith(
          dividerColor: Colors.transparent,
        ),
        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 2,
          ),
          childrenPadding: const EdgeInsets.fromLTRB(
            16,
            0,
            16,
            16,
          ),
          iconColor: primary,
          collapsedIconColor: textMedium,
          title: Text(
            question,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: textDark,
            ),
          ),
          children: const [
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                "For detailed assistance with this topic, "
                "please contact our support team through Live Chat, "
                "Call Us, or Email.",
                style: TextStyle(
                  fontSize: 13,
                  color: textMedium,
                  height: 1.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // ICON BUTTON
  // ============================================================

  Widget _iconButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: border,
            width: 1.2,
          ),
        ),
        child: Icon(
          icon,
          color: textDark,
          size: 19,
        ),
      ),
    );
  }

  // ============================================================
  // OFFLINE STATE
  // ============================================================

  Widget _buildOfflineState() {
    return Scaffold(
      backgroundColor: background,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(28),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: border,
                    ),
                  ),
                  child: const Icon(
                    Icons.wifi_off_rounded,
                    size: 42,
                    color: textLight,
                  ),
                ),

                const SizedBox(height: 24),

                const Text(
                  "You're Offline",
                  style: TextStyle(
                    fontSize: 25,
                    fontWeight: FontWeight.w900,
                    color: textDark,
                  ),
                ),

                const SizedBox(height: 10),

                const Text(
                  "We can't connect to the network.\n"
                  "Please check your connection and try again.",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    color: textMedium,
                    height: 1.5,
                  ),
                ),

                const SizedBox(height: 28),

                SizedBox(
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _isOffline = false;
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 32,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Text(
                      "Reconnect",
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ============================================================
  // MAINTENANCE STATE
  // ============================================================

  Widget _buildMaintenanceState() {
    return Scaffold(
      backgroundColor: background,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(28),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF7ED),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.build_circle_rounded,
                    size: 46,
                    color: Color(0xFFF59E0B),
                  ),
                ),

                const SizedBox(height: 24),

                const Text(
                  "Taking a Quick Break",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 25,
                    fontWeight: FontWeight.w900,
                    color: textDark,
                  ),
                ),

                const SizedBox(height: 10),

                const Text(
                  "Our systems are currently undergoing\n"
                  "some scheduled maintenance.",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    color: textMedium,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ============================================================
// ONLINE BADGE
// ============================================================

class _OnlineBadge extends StatelessWidget {
  const _OnlineBadge();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 7,
        vertical: 3,
      ),
      decoration: BoxDecoration(
        color: const Color(0xFFDCFCE7),
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.circle,
            size: 6,
            color: Color(0xFF16A34A),
          ),
          SizedBox(width: 4),
          Text(
            "Online",
            style: TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.w800,
              color: Color(0xFF15803D),
            ),
          ),
        ],
      ),
    );
  }
}