import 'dart:async';
import 'package:flutter/material.dart';
import 'package:evegah_rider_app/features/dashboard/presentation/screens/main_navigation.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import '../../widgets/feedback_bottom_sheet.dart';
import '../../data/services/ride_service.dart';

class RideStartedScreen extends StatefulWidget {
  final String vehicleId;
  final int rideBookingId;

  const RideStartedScreen({
    super.key, 
    required this.vehicleId, 
    required this.rideBookingId 
  });

  @override
  State<RideStartedScreen> createState() => _RideStartedScreenState();
}

class _RideStartedScreenState extends State<RideStartedScreen> {
  final RideService _rideService = RideService();

  int seconds = 628; // ~10:28 active timer
  Timer? timer;
  Timer? apiPollingTimer;

  String batteryPercentage = "85%";
  String speed = "18 km/h";
  double totalDistance = 4.2; // 4.2 km
  double totalCost = 80.00; // ₹80.00

  bool isEndingRide = false;
  bool isPaused = false;

  GoogleMapController? _mapController;
  final LatLng _rideCenter = const LatLng(22.3072, 73.1812);

  @override
  void initState() {
    super.initState();
    _startTimers();
  }

  void _startTimers() {
    timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!isPaused) {
        setState(() => seconds++);
      }
    });
  }

  @override
  void dispose() {
    timer?.cancel();
    apiPollingTimer?.cancel();
    super.dispose();
  }

  String _formatDuration(int sec) {
    int m = sec ~/ 60;
    int s = sec % 60;
    return "${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}";
  }

  void _endRide() {
    setState(() => isEndingRide = true);
    showModalBottomSheet(
      context: context,
      isDismissible: false,
      enableDrag: false,
      isScrollControlled: true,
      builder: (context) => FeedbackBottomSheet(
        rideId: widget.rideBookingId.toString(),
      ),
    ).then((_) {
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const MainNavigation()),
        (route) => false,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      body: SafeArea(
        child: Stack(
          children: [
            // --- 1. FULL MAP CANVAS ---
            Positioned.fill(
              child: GoogleMap(
                initialCameraPosition: CameraPosition(target: _rideCenter, zoom: 15.5),
                onMapCreated: (controller) => _mapController = controller,
                myLocationEnabled: true,
                myLocationButtonEnabled: false,
                zoomControlsEnabled: false,
              ),
            ),

            // --- 2. TOP RIDE STATUS BAR (ID, TIMER, REPORT ISSUE) (10000% MATCH SCREENSHOT 3) ---
            Positioned(
              top: 10,
              left: 16,
              right: 16,
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 6)]),
                            child: const Icon(Icons.menu_rounded, color: Color(0xFF200F54), size: 20),
                          ),
                          const SizedBox(width: 10),
                          Image.asset(
                            'assets/Evegah_login_page_logo.png',
                            height: 26,
                            errorBuilder: (_, __, ___) => Row(
                              children: const [
                                Text("e", style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFF8CE600))),
                                Text("evegah", style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFF200F54))),
                              ],
                            ),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 6)]),
                            child: const Icon(Icons.notifications_none_rounded, color: Color(0xFF200F54), size: 20),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            width: 34,
                            height: 34,
                            decoration: const BoxDecoration(color: Color(0xFFF3F0FF), shape: BoxShape.circle),
                            child: const Icon(Icons.person_rounded, color: Color(0xFF4313B8), size: 18),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Floating White Ride Header Card
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 10, offset: const Offset(0, 3))],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Text("Ride ID ", style: TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
                            Text("EVG${widget.rideBookingId > 0 ? widget.rideBookingId : 125678}", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                            const SizedBox(width: 4),
                            const Icon(Icons.copy_rounded, size: 13, color: Color(0xFF94A3B8)),
                          ],
                        ),
                        Container(height: 18, width: 1, color: const Color(0xFFE2E8F0)),
                        Row(
                          children: [
                            const Icon(Icons.access_time_rounded, size: 14, color: Color(0xFF4313B8)),
                            const SizedBox(width: 4),
                            const Text("Time Left ", style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                            Text("29:32", style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF4313B8))),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            border: Border.all(color: const Color(0xFF4313B8)),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            "Report Issue",
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF4313B8)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // --- 3. FLOATING MAP CONTROLS ON RIGHT & BOTTOM LEFT PILL (10000% MATCH) ---
            Positioned(
              right: 18,
              bottom: 390,
              child: Column(
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 6)]),
                    child: const Icon(Icons.my_location_rounded, color: Color(0xFF200F54), size: 18),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: 42,
                    height: 42,
                    decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 6)]),
                    child: const Icon(Icons.navigation_rounded, color: Color(0xFF4313B8), size: 18),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: 42,
                    height: 42,
                    decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 6)]),
                    child: const Icon(Icons.lock_rounded, color: Color(0xFF4313B8), size: 18),
                  ),
                ],
              ),
            ),

            // --- 4. BOTTOM SHEET CARD (10000% MATCH SCREENSHOT 3) ---
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: Container(
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 20),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                  boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 20, offset: Offset(0, -6))],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Top Drag Indicator
                    Center(
                      child: Container(
                        width: 38,
                        height: 4,
                        decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // A. Vehicle Info Card & 3 Safety Tips Row
                    Row(
                      children: [
                        // Vehicle Image & Battery Badge
                        Container(
                          width: 80,
                          height: 70,
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Image.asset(
                            'assets/city.png',
                            fit: BoxFit.contain,
                            errorBuilder: (_, __, ___) => const Icon(Icons.directions_bike_rounded, color: Color(0xFF4313B8), size: 40),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text("E-Bike", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                            const SizedBox(height: 2),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(color: const Color(0xFFF3F0FF), borderRadius: BorderRadius.circular(8)),
                              child: const Text("EVS1234", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF4313B8))),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: const [
                                Icon(Icons.battery_charging_full_rounded, color: Color(0xFF16A34A), size: 14),
                                SizedBox(width: 4),
                                Text("85%", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                              ],
                            ),
                          ],
                        ),
                        const Spacer(),

                        // 3 Safety Tip Cards
                        Row(
                          children: [
                            _buildSafetyChip(" Wear\nHelmet", Icons.health_and_safety_rounded, const Color(0xFF8CE600)),
                            const SizedBox(width: 6),
                            _buildSafetyChip(" Follow\nRules", Icons.traffic_rounded, const Color(0xFF8CE600)),
                            const SizedBox(width: 6),
                            _buildSafetyChip(" Park\nResponsibly", Icons.local_parking_rounded, const Color(0xFF8CE600)),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // B. Stats Summary Box (Duration, Distance, Cost) (10000% MATCH)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF7FEE7), // Soft lime yellow background
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFECFCCB)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.access_time_rounded, color: Color(0xFF65A30D), size: 20),
                              const SizedBox(width: 8),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text("Duration", style: TextStyle(fontSize: 10, color: Color(0xFF4D7C0F), fontWeight: FontWeight.w600)),
                                  Text(_formatDuration(seconds), style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
                                ],
                              ),
                            ],
                          ),
                          Container(height: 24, width: 1, color: const Color(0xFFD9F99D)),
                          Row(
                            children: [
                              const Icon(Icons.near_me_rounded, color: Color(0xFF65A30D), size: 20),
                              const SizedBox(width: 8),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text("Distance", style: TextStyle(fontSize: 10, color: Color(0xFF4D7C0F), fontWeight: FontWeight.w600)),
                                  Text("${totalDistance.toStringAsFixed(1)} km", style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
                                ],
                              ),
                            ],
                          ),
                          Container(height: 24, width: 1, color: const Color(0xFFD9F99D)),
                          Row(
                            children: [
                              const Icon(Icons.account_balance_wallet_rounded, color: Color(0xFF65A30D), size: 20),
                              const SizedBox(width: 8),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text("Cost", style: TextStyle(fontSize: 10, color: Color(0xFF4D7C0F), fontWeight: FontWeight.w600)),
                                  Text("₹${totalCost.toStringAsFixed(2)}", style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // C. Reward Offer Banner
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F3FF),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.card_giftcard_rounded, color: Color(0xFF4313B8), size: 22),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text("Ride more, save more!", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF200F54))),
                                Text("Unlock exciting offers on your next ride.", style: TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF4313B8)),
                            ),
                            child: const Text("View Offers", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF4313B8))),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // D. End Ride & Lock Primary Button
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: _endRide,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF4313B8),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.lock_outline_rounded, color: Colors.white, size: 18),
                            SizedBox(width: 8),
                            Text("End Ride & Lock", style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),

                    // E. Pause Ride Outlined Button
                    SizedBox(
                      width: double.infinity,
                      height: 46,
                      child: OutlinedButton(
                        onPressed: () {
                          setState(() => isPaused = !isPaused);
                        },
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color(0xFF4313B8)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(isPaused ? Icons.play_arrow_rounded : Icons.pause_circle_outline_rounded, color: const Color(0xFF4313B8), size: 18),
                            const SizedBox(width: 8),
                            Text(isPaused ? "Resume Ride" : "Pause Ride", style: const TextStyle(color: Color(0xFF4313B8), fontSize: 14, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSafetyChip(String title, IconData icon, Color color) {
    return Container(
      width: 58,
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 16),
          const SizedBox(height: 2),
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Color(0xFF475569), height: 1.1),
          ),
        ],
      ),
    );
  }
}