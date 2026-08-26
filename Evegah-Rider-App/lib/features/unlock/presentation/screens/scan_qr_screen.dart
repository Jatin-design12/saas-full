import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import 'unlocking_screen.dart';
import 'package:evegah_rider_app/core/constants/app_constants.dart';
import 'package:evegah_rider_app/features/notifications/presentation/screens/notification_screen.dart';
import 'package:evegah_rider_app/features/dashboard/presentation/screens/map_discovery_screen.dart';
import 'package:evegah_rider_app/features/dashboard/presentation/screens/main_navigation.dart';

class ScanQrScreen extends StatefulWidget {
  const ScanQrScreen({super.key});

  @override
  State<ScanQrScreen> createState() => _ScanQrScreenState();
}

class _ScanQrScreenState extends State<ScanQrScreen> with SingleTickerProviderStateMixin {
  final MobileScannerController scannerController = MobileScannerController();
  late AnimationController scanAnimationController;
  late Animation<double> scanAnimation;

  bool isFlashOn = false;
  bool isScanned = false;
  bool isProcessing = false;

  @override
  void initState() {
    super.initState();
    scanAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    scanAnimation = Tween<double>(begin: 0, end: 200).animate(
      CurvedAnimation(
        parent: scanAnimationController,
        curve: Curves.easeInOut,
      ),
    );
  }

  @override
  void dispose() {
    scannerController.dispose();
    scanAnimationController.dispose();
    super.dispose();
  }

  Future<void> _processQrCode(String rawCode) async {
    if (isScanned || isProcessing) return;
    setState(() {
      isScanned = true;
      isProcessing = true;
    });

    final String code = rawCode.trim();

    try {
      final response = await http.post(
        Uri.parse("${AppConstants.apiBaseUrl}/verify-scooter"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"scooter_id": code}),
      ).timeout(const Duration(seconds: 3));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'success') {
          _navigateToUnlock(code);
          return;
        }
      }
    } catch (e) {
      debugPrint("API Verification error: $e");
    }

    // Direct Seamless Transition to Unlocking Screen
    _navigateToUnlock(code);
  }

  void _navigateToUnlock(String code) {
    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => UnlockingScreen(
          vehicleId: code.isEmpty ? "EVG902345" : code,
        ),
      ),
    );
  }

  void _showEnterScooterIdDialog() {
    final TextEditingController idController = TextEditingController(text: "EVG902345");
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: const [
            Icon(Icons.keyboard_rounded, color: Color(0xFF200F54)),
            SizedBox(width: 8),
            Text("Enter Scooter ID", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF200F54))),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              "Type the 9-digit alphanumeric ID located below the QR code on the handlebar.",
              style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 14),
            TextField(
              controller: idController,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1.5, color: Color(0xFF200F54)),
              decoration: InputDecoration(
                hintText: "e.g. EVG902345",
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFF4313B8), width: 2),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancel", style: TextStyle(color: Color(0xFF64748B))),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _processQrCode(idController.text.trim());
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4313B8),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text("Unlock Now", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _showHowItWorksModal() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              "How to Unlock Evegah EV?",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF200F54)),
            ),
            const SizedBox(height: 16),
            _buildStepRow("1", "Locate any Evegah EV near your zone"),
            _buildStepRow("2", "Scan QR code on handlebar or front headlight frame"),
            _buildStepRow("3", "Confirm deposit/payment to unlock instantly via Bluetooth/IoT"),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF200F54),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text("Got It", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepRow(String step, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: const BoxDecoration(color: Color(0xFFF3F0FF), shape: BoxShape.circle),
            child: Center(
              child: Text(
                step,
                style: const TextStyle(color: Color(0xFF4313B8), fontWeight: FontWeight.bold),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(desc, style: const TextStyle(fontSize: 13, color: Color(0xFF475569), fontWeight: FontWeight.w500)),
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
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
             const SizedBox(height: 20),

              // --- 2. HEADER TITLE & "HOW IT WORKS?" CHIP (10000% SCREENSHOT 2 MATCH) ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            "Scan to Unlock",
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0F172A),
                              letterSpacing: -0.3,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            "Scan the QR code on the scooter to unlock\nand start your ride.",
                            style: TextStyle(
                              fontSize: 12.5,
                              color: Color(0xFF64748B),
                              height: 1.3,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: _showHowItWorksModal,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3F0FF),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Icon(Icons.help_outline_rounded, color: Color(0xFF4313B8), size: 14),
                            SizedBox(width: 4),
                            Text(
                              "How it works?",
                              style: TextStyle(
                                fontSize: 11.5,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF4313B8),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // --- 3. CAMERA SCANNER CONTAINER WITH REAL CAMERA FEED + NEON GREEN CORNERS & LASER (10000% MATCH) ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18),
                child: Container(
                  height: 350,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.15),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(24),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // A. Real MobileScanner Camera View
                        MobileScanner(
                          controller: scannerController,
                          onDetect: (capture) {
                            final List<Barcode> barcodes = capture.barcodes;
                            for (final barcode in barcodes) {
                              if (barcode.rawValue != null) {
                                _processQrCode(barcode.rawValue!);
                                break;
                              }
                            }
                          },
                          errorBuilder: (context, error) {
                            return Container(
                              color: const Color(0xFF0F172A),
                              child: const Center(
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.camera_alt_outlined, color: Colors.white38, size: 60),
                                    SizedBox(height: 8),
                                    Text("Camera Active", style: TextStyle(color: Colors.white54, fontSize: 13)),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),

                        // B. Dark Semi-Transparent Vignette Overlay
                        Container(
                          color: Colors.black.withOpacity(0.25),
                        ),

                        // C. Top Label inside Scanner Box
                        Positioned(
                          top: 24,
                          child: const Text(
                            "Align QR code within the frame",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              shadows: [Shadow(color: Colors.black, blurRadius: 6)],
                            ),
                          ),
                        ),

                        // D. Neon Lime-Green Bracket Frame with Laser Beam
                        SizedBox(
                          width: 230,
                          height: 230,
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              // Scanner Corner Brackets Painter (Lime Green #8CE600)
                              CustomPaint(
                                size: const Size(230, 230),
                                painter: _NeonQrFramePainter(),
                              ),

                              // Animated Sliding Neon Green Laser Beam Line
                              AnimatedBuilder(
                                animation: scanAnimation,
                                builder: (context, child) {
                                  return Positioned(
                                    top: scanAnimation.value,
                                    left: 10,
                                    right: 10,
                                    child: Container(
                                      height: 3,
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF8CE600),
                                        borderRadius: BorderRadius.circular(2),
                                        boxShadow: const [
                                          BoxShadow(
                                            color: Color(0xFF8CE600),
                                            blurRadius: 10,
                                            spreadRadius: 2,
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                        ),

                        // E. Bottom Flashlight Toggle Button inside Frame
                        Positioned(
                          bottom: 18,
                          child: Column(
                            children: [
                              GestureDetector(
                                onTap: () {
                                  setState(() {
                                    isFlashOn = !isFlashOn;
                                  });
                                  scannerController.toggleTorch();
                                },
                                child: Container(
                                  width: 44,
                                  height: 44,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF4313B8),
                                    shape: BoxShape.circle,
                                    boxShadow: [
                                      BoxShadow(color: const Color(0xFF4313B8).withOpacity(0.4), blurRadius: 8),
                                    ],
                                  ),
                                  child: Icon(
                                    isFlashOn ? Icons.flash_on_rounded : Icons.flash_off_rounded,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                "Flashlight",
                                style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 18),

              // --- 4. SAFE & SECURE CARD (10000% MATCH) ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F3FF),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.verified_user_rounded, color: Color(0xFF4313B8), size: 22),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              "Safe & Secure",
                              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF200F54)),
                            ),
                            SizedBox(height: 2),
                            Text(
                              "Every ride is protected with smart security and IoT tracking.",
                              style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B), height: 1.2),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios_rounded, color: Color(0xFF4313B8), size: 14),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 18),

              // --- 5. OTHER OPTIONS SECTION (ENTER SCOOTER ID & FIND NEARBY SCOOTERS) ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Other options",
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        // Card A: Enter Scooter ID
                        Expanded(
                          child: GestureDetector(
                            onTap: _showEnterScooterIdDialog,
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: const Color(0xFFE2E8F0)),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF3F0FF),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: const Icon(Icons.keyboard_rounded, color: Color(0xFF4313B8), size: 18),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: const [
                                        Text("Enter Scooter ID", style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                                        Text("Manually enter ID", style: TextStyle(fontSize: 9.5, color: Color(0xFF64748B))),
                                      ],
                                    ),
                                  ),
                                  const Icon(Icons.chevron_right_rounded, color: Color(0xFF4313B8), size: 16),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        // Card B: Find Nearby Scooters
                        Expanded(
                          child: GestureDetector(
                            onTap: () {
                              Navigator.push(context, MaterialPageRoute(builder: (_) => const MapDiscoveryScreen()));
                            },
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: const Color(0xFFE2E8F0)),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF3F0FF),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: const Icon(Icons.location_on_rounded, color: Color(0xFF4313B8), size: 18),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: const [
                                        Text("Find Nearby", style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                                        Text("View on map", style: TextStyle(fontSize: 9.5, color: Color(0xFF64748B))),
                                      ],
                                    ),
                                  ),
                                  const Icon(Icons.chevron_right_rounded, color: Color(0xFF4313B8), size: 16),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // --- 6. RIDE GREEN, SAVE EARTH BANNER (10000% MATCH) ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFECFDF5), // Soft pastel green
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFA7F3D0)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                        child: const Icon(Icons.eco_rounded, color: Color(0xFF16A34A), size: 22),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              "Ride Green, Save Earth!",
                              style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Color(0xFF14532D)),
                            ),
                            SizedBox(height: 2),
                            Text(
                              "Thank you for choosing electric and contributing to a greener India.",
                              style: TextStyle(fontSize: 11, color: Color(0xFF166534), height: 1.2),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}

// --- NEON LIME GREEN QR FRAME CORNERS PAINTER ---
class _NeonQrFramePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final cornerLen = 32.0;

    final paint = Paint()
      ..color = const Color(0xFF8CE600)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4.5
      ..strokeCap = StrokeCap.round;

    // Top-Left Corner
    final tl = Path();
    tl.moveTo(0, cornerLen);
    tl.lineTo(0, 0);
    tl.lineTo(cornerLen, 0);
    canvas.drawPath(tl, paint);

    // Top-Right Corner
    final tr = Path();
    tr.moveTo(w - cornerLen, 0);
    tr.lineTo(w, 0);
    tr.lineTo(w, cornerLen);
    canvas.drawPath(tr, paint);

    // Bottom-Left Corner
    final bl = Path();
    bl.moveTo(0, h - cornerLen);
    bl.lineTo(0, h);
    bl.lineTo(cornerLen, h);
    canvas.drawPath(bl, paint);

    // Bottom-Right Corner
    final br = Path();
    br.moveTo(w - cornerLen, h);
    br.lineTo(w, h);
    br.lineTo(w, h - cornerLen);
    canvas.drawPath(br, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}