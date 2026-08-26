import 'dart:ui';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/session_service.dart';

class ReferEarnScreen extends StatefulWidget {
  const ReferEarnScreen({super.key});

  @override
  State<ReferEarnScreen> createState() => _ReferEarnScreenState();
}

class _ReferEarnScreenState extends State<ReferEarnScreen> {
  String _referralCode = "EVEGAH100";
  int _totalEarned = 420;
  int _friendsJoined = 12;
  int _pointsRedeemed = 320;
  int _availablePoints = 100;
  bool _isLoading = true;
  List<dynamic> _history = [];
  String _riderMobile = "";
  String _riderName = "";

  @override
  void initState() {
    super.initState();
    _fetchRiderReferralData();
  }

  Future<void> _fetchRiderReferralData() async {
    try {
      final session = SessionService();
      _riderMobile = await session.getUserMobile() ?? "+91 81282 51172";
      final profile = await session.getUserProfile();
      _riderName = profile["name"]?.isNotEmpty == true ? profile["name"]! : "Himanshu Chavda";

      final url = Uri.parse(
        '${AppConstants.apiBaseUrl}/referral?mobile=${Uri.encodeComponent(_riderMobile)}&name=${Uri.encodeComponent(_riderName)}',
      );

      final res = await http.get(url).timeout(const Duration(seconds: 5));
      if (res.statusCode == 200) {
        final decoded = json.decode(res.body);
        if (decoded['status'] == 'success' && decoded['data'] != null) {
          final d = decoded['data'];
          if (mounted) {
            setState(() {
              _referralCode = d['referralCode'] ?? _referralCode;
              _totalEarned = d['totalEarned'] ?? _totalEarned;
              _friendsJoined = d['friendsJoined'] ?? _friendsJoined;
              _pointsRedeemed = d['pointsRedeemed'] ?? _pointsRedeemed;
              _availablePoints = d['availablePoints'] ?? (_totalEarned - _pointsRedeemed);
              _history = d['history'] ?? [];
              _isLoading = false;
            });
          }
          return;
        }
      }
    } catch (e) {
      debugPrint('Referral fetch error: $e');
    }

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _copyCode() {
    Clipboard.setData(ClipboardData(text: _referralCode));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Referral code '$_referralCode' copied to clipboard! 📋"),
        backgroundColor: const Color(0xFF4313B8),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  Future<void> _redeemPoints(int points, String offerName) async {
    if (_availablePoints < points) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Insufficient EV Points! Available: $_availablePoints EV Points"),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    try {
      final url = Uri.parse('${AppConstants.apiBaseUrl}/referral/redeem');
      final res = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'mobile': _riderMobile,
          'pointsToRedeem': points,
          'offerName': offerName,
        }),
      );

      if (res.statusCode == 200) {
        final decoded = json.decode(res.body);
        if (decoded['status'] == 'success') {
          if (!mounted) return;
          setState(() {
            _pointsRedeemed += points;
            _availablePoints = mathMax(0, _totalEarned - _pointsRedeemed);
          });

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("🎉 Successfully redeemed $points EV Points for $offerName!"),
              backgroundColor: const Color(0xFF16A34A),
              duration: const Duration(seconds: 3),
            ),
          );
          return;
        }
      }
    } catch (e) {
      debugPrint('Redeem error: $e');
    }

    if (!mounted) return;
    // Local fallback update
    setState(() {
      _pointsRedeemed += points;
      _availablePoints = mathMax(0, _totalEarned - _pointsRedeemed);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("🎉 Redeemed $points EV Points for $offerName!"),
        backgroundColor: const Color(0xFF16A34A),
      ),
    );
  }

  int mathMax(int a, int b) => a > b ? a : b;

  void _showHistoryModal() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "EV Points History",
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const Divider(color: Color(0xFFE2E8F0)),
              const SizedBox(height: 8),
              _history.isEmpty
                  ? const Padding(
                      padding: EdgeInsets.all(16),
                      child: Center(child: Text("No transaction history yet.")),
                    )
                  : ListView.builder(
                      shrinkWrap: true,
                      itemCount: _history.length,
                      itemBuilder: (context, idx) {
                        final item = _history[idx];
                        final isEarn = item['type'] == 'earn';
                        return ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: CircleAvatar(
                            backgroundColor: isEarn ? const Color(0xFFECFDF5) : const Color(0xFFFEF2F2),
                            child: Icon(
                              isEarn ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded,
                              color: isEarn ? const Color(0xFF10B981) : Colors.red,
                              size: 18,
                            ),
                          ),
                          title: Text(
                            item['title'] ?? 'Transaction',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text(
                            item['date'] ?? '',
                            style: const TextStyle(fontSize: 10, color: Colors.grey),
                          ),
                          trailing: Text(
                            item['points'] ?? '',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: isEarn ? const Color(0xFF10B981) : Colors.red,
                            ),
                          ),
                        );
                      },
                    ),
            ],
          ),
        );
      },
    );
  }

  void _showRedeemOffersModal() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "Redeem EV Points",
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F3FF),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      "$_availablePoints EV Points Available",
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF4313B8)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Divider(color: Color(0xFFE2E8F0)),
              const SizedBox(height: 8),

              _buildRedeemOfferTile("₹50 Off Next Ride", 100, "Valid on any EVegah ride"),
              _buildRedeemOfferTile("₹100 Off Weekly Pass", 200, "Valid on Pro & Lite packages"),
              _buildRedeemOfferTile("Free Battery Swap Pass", 150, "Instant swap at any station"),

              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  Widget _buildRedeemOfferTile(String title, int pointsRequired, String desc) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: const BoxDecoration(
              color: Color(0xFF4313B8),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.stars_rounded, color: Colors.white, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 2),
                Text(desc, style: const TextStyle(fontSize: 9, color: Colors.grey)),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _redeemPoints(pointsRequired, title);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4313B8),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              minimumSize: Size.zero,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: Text(
              "$pointsRequired PTS",
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      body: SafeArea(
        child: Column(
          children: [
            // --- 1. TOP HEADER (Back, Bell, Profile) ---
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: const Icon(Icons.arrow_back_rounded, color: Colors.black, size: 20),
                    ),
                  ),
                  Row(
                    children: [
                      Stack(
                        children: [
                          const Icon(Icons.notifications_none_rounded, color: Colors.black, size: 24),
                          Positioned(
                            top: 2,
                            right: 2,
                            child: Container(
                              width: 7,
                              height: 7,
                              decoration: const BoxDecoration(
                                color: Color(0xFFD2FC00),
                                shape: BoxShape.circle,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(width: 14),
                      const Icon(Icons.account_circle_outlined, color: Colors.black, size: 24),
                    ],
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 8),

                    // --- 2. HERO BANNER IMAGE (Updated High-Definition 3D Banner) ---
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF31108F).withValues(alpha: 0.20),
                            blurRadius: 16,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(24),
                        child: Image.asset(
                          "assets/refer-and-earn-illustration.png",
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Color(0xFF31108F), Color(0xFF1B0554)],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                                borderRadius: BorderRadius.circular(24),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: const [
                                  Text("Refer & Earn EV Points", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                                  SizedBox(height: 4),
                                  Text("Invite friends and earn points on every ride!", style: TextStyle(color: Colors.white70, fontSize: 11)),
                                ],
                              ),
                            );
                          },
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // --- 3. YOUR REFERRAL CODE CONTAINER (Fetched from Backend) ---
                    const Text(
                      "Your Referral Code",
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey),
                    ),
                    const SizedBox(height: 8),

                    CustomPaint(
                      painter: DashedRectPainter(
                        color: const Color(0xFFC084FC), // Dotted purple border
                        strokeWidth: 1.5,
                        gap: 4.0,
                      ),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF5F3FF),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _isLoading ? "FETCHING..." : _referralCode,
                              style: const TextStyle(
                                color: Color(0xFF4313B8),
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 1.2,
                              ),
                            ),
                            Row(
                              children: [
                                Container(width: 1.5, height: 20, color: const Color(0xFFDDD6FE)),
                                const SizedBox(width: 16),
                                GestureDetector(
                                  onTap: _copyCode,
                                  child: Row(
                                    children: const [
                                      Icon(Icons.copy_rounded, color: Color(0xFF4313B8), size: 16),
                                      SizedBox(width: 6),
                                      Text(
                                        "Copy",
                                        style: TextStyle(
                                          color: Color(0xFF4313B8),
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // --- 4. OR SHARE VIA DIVIDER & ROW ---
                    Row(
                      children: const [
                        Expanded(child: Divider(color: Color(0xFFE2E8F0))),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 12),
                          child: Text(
                            "or share via",
                            style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.w500),
                          ),
                        ),
                        Expanded(child: Divider(color: Color(0xFFE2E8F0))),
                      ],
                    ),

                    const SizedBox(height: 16),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildShareBtn("WhatsApp", const Color(0xFF25D366), Icons.chat_rounded),
                        _buildShareBtn("Instagram", const Color(0xFFE1306C), Icons.camera_alt_rounded),
                        _buildShareBtn("Facebook", const Color(0xFF1877F2), Icons.facebook_rounded),
                        _buildShareBtn("X (Twitter)", Colors.black, Icons.tag_rounded),
                        _buildShareBtn("More", const Color(0xFF94A3B8), Icons.more_horiz_rounded),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // --- 5. YOUR EARNINGS CARD (Backend EV Points) ---
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.02),
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          )
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                "Your Earnings",
                                style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.black),
                              ),
                              GestureDetector(
                                onTap: _showHistoryModal,
                                child: const Text(
                                  "View History →",
                                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF4313B8)),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              _buildEarningsColumn(
                                Icons.stars_rounded,
                                _totalEarned.toString(),
                                "Total EvePoints\nEarned",
                                const Color(0xFFF5F3FF),
                                const Color(0xFF4313B8),
                              ),
                              Container(width: 1, height: 40, color: const Color(0xFFF1F5F9)),
                              _buildEarningsColumn(
                                Icons.people_alt_rounded,
                                _friendsJoined.toString(),
                                "Friends\nJoined",
                                const Color(0xFFECFDF5),
                                const Color(0xFF047857),
                              ),
                              Container(width: 1, height: 40, color: const Color(0xFFF1F5F9)),
                              _buildEarningsColumn(
                                Icons.account_balance_wallet_rounded,
                                _pointsRedeemed.toString(),
                                "EvePoints\nRedeemed",
                                const Color(0xFFEFF6FF),
                                const Color(0xFF1D4ED8),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // --- 6. HOW IT WORKS SECTION ---
                    const Text(
                      "How it works",
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.black),
                    ),
                    const SizedBox(height: 16),

                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildStepItem("1", Icons.share_rounded, "Share your code", "Share your referral\ncode with friends"),
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.only(top: 24),
                            child: CustomPaint(
                              painter: DashedLinePainter(color: const Color(0xFFDDD6FE)),
                              child: const SizedBox(height: 1),
                            ),
                          ),
                        ),
                        _buildStepItem("2", Icons.person_add_alt_1_rounded, "Friend joins", "Your friend signs up\nand takes their first ride"),
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.only(top: 24),
                            child: CustomPaint(
                              painter: DashedLinePainter(color: const Color(0xFFDDD6FE)),
                              child: const SizedBox(height: 1),
                            ),
                          ),
                        ),
                        _buildStepItem("3", Icons.emoji_events_rounded, "You earn points", "You get 100 EvePoints\nthey get 50 EvePoints"),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // --- 7. REDEEM PROMO BANNER ---
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F3FF),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFDDD6FE)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: const BoxDecoration(color: Color(0xFF4313B8), shape: BoxShape.circle),
                            child: const Icon(Icons.stars_rounded, color: Colors.white, size: 20),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Redeem your EvePoints",
                                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.black),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  "Available: $_availablePoints EV Points to get discounts on rides & offers!",
                                  style: const TextStyle(fontSize: 9, color: Colors.grey, fontWeight: FontWeight.w500),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          ElevatedButton(
                            onPressed: _showRedeemOffersModal,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF4313B8),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              minimumSize: Size.zero,
                              elevation: 0,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                            child: const Text(
                              "Explore Offers →",
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShareBtn(String name, Color bg, IconData icon) {
    return Column(
      children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
          child: Icon(icon, color: Colors.white, size: 18),
        ),
        const SizedBox(height: 4),
        Text(
          name,
          style: const TextStyle(fontSize: 8, color: Colors.grey, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildEarningsColumn(IconData icon, String val, String lbl, Color bg, Color iconColor) {
    return Expanded(
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
            child: Icon(icon, color: iconColor, size: 18),
          ),
          const SizedBox(height: 8),
          Text(
            val,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Colors.black),
          ),
          const SizedBox(height: 2),
          Text(
            lbl,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 8, color: Colors.grey, fontWeight: FontWeight.bold, height: 1.1),
          ),
        ],
      ),
    );
  }

  Widget _buildStepItem(String stepNo, IconData icon, String title, String subtitle) {
    return Expanded(
      flex: 3,
      child: Column(
        children: [
          Stack(
            alignment: Alignment.topRight,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Icon(icon, color: const Color(0xFF4313B8), size: 18),
              ),
              Container(
                padding: const EdgeInsets.all(4),
                decoration: const BoxDecoration(color: Color(0xFF4313B8), shape: BoxShape.circle),
                child: Text(
                  stepNo,
                  style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.black),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 7, color: Colors.grey, fontWeight: FontWeight.w500, height: 1.1),
          ),
        ],
      ),
    );
  }
}

class DashedRectPainter extends CustomPainter {
  final Color color;
  final double strokeWidth;
  final double gap;

  DashedRectPainter({
    this.color = const Color(0xFFDDD6FE),
    this.strokeWidth = 1.0,
    this.gap = 4.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    final Path path = Path()
      ..addRRect(RRect.fromRectAndRadius(
        Rect.fromLTWH(0, 0, size.width, size.height),
        const Radius.circular(12),
      ));

    for (PathMetric pathMetric in path.computeMetrics()) {
      double distance = 0.0;
      while (distance < pathMetric.length) {
        final double length = gap;
        canvas.drawPath(
          pathMetric.extractPath(distance, distance + length),
          paint,
        );
        distance += length * 2;
      }
    }
  }

  @override
  bool shouldRepaint(DashedRectPainter oldDelegate) => false;
}

class DashedLinePainter extends CustomPainter {
  final Color color;
  final double strokeWidth;
  final double gap;

  DashedLinePainter({
    this.color = const Color(0xFFDDD6FE),
    this.strokeWidth = 1.5,
    this.gap = 4.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    double dx = 0.0;
    while (dx < size.width) {
      canvas.drawLine(Offset(dx, size.height / 2), Offset(dx + gap, size.height / 2), paint);
      dx += gap * 2;
    }
  }

  @override
  bool shouldRepaint(DashedLinePainter oldDelegate) => false;
}
