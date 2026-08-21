import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../../../core/widgets/app_sidebar_drawer.dart';
import 'select_location_screen.dart';
import 'select_date_time_screen.dart';
import 'vehicle_list_screen.dart';
import 'package:evegah_rider_app/features/notifications/presentation/screens/notification_screen.dart';
import 'package:evegah_rider_app/features/notifications/data/services/notification_service.dart';
import 'package:evegah_rider_app/features/auth/presentation/screens/login_screen.dart';
import '../../../../core/services/session_service.dart';

class RentEvScreen extends StatefulWidget {
  const RentEvScreen({super.key});

  @override
  State<RentEvScreen> createState() => _RentEvScreenState();
}

class _RentEvScreenState extends State<RentEvScreen> {
  String selectedLocation = "Select pickup zone";
  String selectedDropLocation = "Select drop-off zone";
  Map<String, dynamic>? selectedZoneData;
  Map<String, dynamic>? selectedDropZoneData;
  String pickupDateTime = "Select date & time";
  String dropDateTime = "Select date & time";
  String? pickupRaw;
  String? dropRaw;
  bool isDifferentDropZone = false;
  double flexiDropFee = 49.0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 8),
            // --- TOP STICKY NAVIGATION BAR ---
            _buildTopAppBar(),

            // --- MAIN SCROLLABLE CONTENT ---
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 18,
                  vertical: 8,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // --- SLOGAN & ANYWHERE ANYTIME HEADER (SCROLLS WITH CARDS) ---
                    _buildSloganHeader(),
                    const SizedBox(height: 14),

                    // --- MOTION ANIMATED CITY EV FLEET SLIDER BANNER ---
                    const MotionAnimatedCityBanner(),
                    const SizedBox(height: 16),

                    // --- MAIN BOOKING SEARCH CARD ---
                    _buildBookingSearchCard(),
                    const SizedBox(height: 16),

                    // --- ZONE BASED PRICING BANNER ---
                    _buildZonePricingBanner(),
                    const SizedBox(height: 12),

                    // --- FLEXI PICKUP & DROP BANNER ---
                    _buildFlexiPickupBanner(),
                    const SizedBox(height: 20),

                    // --- WHY CHOOSE EVEGAH SECTION ---
                    _buildWhyChooseEvegahSection(),
                    const SizedBox(height: 20),

                    // --- GO ELECTRIC BOTTOM BANNER ---
                    _buildGoElectricBottomBanner(),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Top App Bar (Menu Icon, Title & Bell Notification)
  Widget _buildTopAppBar() {
    final unreadCount = NotificationService().unreadCount;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFFF3F0FF),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: const Icon(
              Icons.electric_scooter_rounded,
              color: Color(0xFF200F54),
              size: 22,
            ),
          ),
          const Text(
            "Rent Your EV",
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Color(0xFF200F54),
            ),
          ),
          GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const NotificationScreen(),
                ),
              ).then((_) => setState(() {}));
            },
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: const Icon(
                    Icons.notifications_none_rounded,
                    color: Color(0xFF200F54),
                    size: 22,
                  ),
                ),
                if (unreadCount > 0)
                  Positioned(
                    top: -2,
                    right: -2,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: Color(0xFF200F54),
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        "$unreadCount",
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Slogan Header with Green Slogan, Eco Leaf Accents & Underline Curve
  Widget _buildSloganHeader() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            "Ride Green, Ride Smart",
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: Color(0xFF200F54),
              letterSpacing: -0.4,
            ),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.eco_rounded,
                color: Color(0xFF16A34A),
                size: 18,
              ),
              const SizedBox(width: 6),
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  RichText(
                    text: const TextSpan(
                      children: [
                        TextSpan(
                          text: "Anywhere",
                          style: TextStyle(
                            color: Color(0xFF16A34A),
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        TextSpan(
                          text: " • ",
                          style: TextStyle(
                            color: Color(0xFF200F54),
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        TextSpan(
                          text: "Anytime",
                          style: TextStyle(
                            color: Color(0xFF16A34A),
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 2),
                  CustomPaint(
                    size: const Size(140, 5),
                    painter: _GreenCurvePainter(),
                  ),
                ],
              ),
              const SizedBox(width: 6),
              Transform(
                alignment: Alignment.center,
                transform: Matrix4.rotationY(math.pi),
                child: const Icon(
                  Icons.eco_rounded,
                  color: Color(0xFF16A34A),
                  size: 18,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // Search Card (Pickup location, Dates, Checkbox & Search Button)
  Widget _buildBookingSearchCard() {
    final isSearchDisabled = selectedLocation == "Select pickup zone" ||
        pickupDateTime == "Select date & time" ||
        dropDateTime == "Select date & time";

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFF1F5F9)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Enter pickup zone or location
          GestureDetector(
            onTap: () async {
              if (isDifferentDropZone) {
                // Flexi Pickup & Drop Enabled -> Open Interactive Map-Based Selection Screen
                final result = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => MapPickupDropSelectionScreen(
                      initialPickup: selectedLocation == "Select pickup zone" ? "Gotri Station, Vadodara" : selectedLocation,
                      initialDrop: selectedDropLocation == "Select drop-off zone" ? "Alkapuri Hub, Vadodara" : selectedDropLocation,
                    ),
                  ),
                );
                if (result != null && result is Map<String, dynamic>) {
                  setState(() {
                    selectedZoneData = result;
                    selectedLocation = result['pickup'] ?? selectedLocation;
                    if (result['drop'] != null && result['drop'] != selectedLocation) {
                      selectedDropLocation = result['drop'];
                    }
                  });
                }
              } else {
                // Standard Zone Mode -> Open List-Wise Zone Selection Screen
                final result = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => SelectLocationScreen(
                      currentCity: "Vadodara",
                      onLocationSelected: (zone) {
                        setState(() {
                          if (zone is Map<String, dynamic>) {
                            selectedZoneData = zone;
                            selectedLocation = "${zone['name']}, Vadodara";
                          } else {
                            selectedLocation = "$zone Zone, Vadodara";
                          }
                        });
                      },
                    ),
                  ),
                );
                if (result != null) {
                  setState(() {
                    if (result is Map<String, dynamic>) {
                      selectedZoneData = result;
                      selectedLocation = "${result['name']}, Vadodara";
                    } else if (result is String) {
                      selectedLocation = result;
                    }
                  });
                }
              }
            },
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.location_on_rounded,
                    color: Color(0xFF4313B8),
                    size: 20,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Enter pickup zone or location",
                          style: TextStyle(
                            fontSize: 10,
                            color: Color(0xFF64748B),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          selectedLocation,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F3FF),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(
                      Icons.my_location_rounded,
                      color: Color(0xFF4313B8),
                      size: 18,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),

          // 2. Pickup & Drop Date & Time (2 Columns)
          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () async {
                    final isPackage = selectedZoneData != null
                        ? (selectedZoneData!['pricing'] != null &&
                            selectedZoneData!['pricing']['pricingModel'] == 'Package Based')
                        : (!selectedLocation.toLowerCase().contains("daman") &&
                            !selectedLocation.toLowerCase().contains("aatapi"));
                    final result = await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => SelectDateTimeScreen(
                          initialIsPackageBased: isPackage,
                          pricing: selectedZoneData != null ? selectedZoneData!['pricing'] : null,
                          zoneName: selectedZoneData != null ? selectedZoneData!['name'] : selectedLocation.split(',').first,
                        ),
                      ),
                    );
                    if (result != null && result is Map<String, String>) {
                      setState(() {
                        pickupDateTime =
                            result['pickup'] ?? "Select date & time";
                        dropDateTime = result['drop'] ?? "Select date & time";
                      });
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.calendar_month_outlined,
                          color: Color(0xFF4313B8),
                          size: 18,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                "Pickup Date & Time",
                                style: TextStyle(
                                  fontSize: 9,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                pickupDateTime,
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: GestureDetector(
                  onTap: () async {
                    final isPackage = selectedZoneData != null
                        ? (selectedZoneData!['pricing'] != null &&
                            selectedZoneData!['pricing']['pricingModel'] == 'Package Based')
                        : (!selectedLocation.toLowerCase().contains("daman") &&
                            !selectedLocation.toLowerCase().contains("aatapi"));
                    final result = await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => SelectDateTimeScreen(
                          initialIsPackageBased: isPackage,
                          pricing: selectedZoneData != null ? selectedZoneData!['pricing'] : null,
                          zoneName: selectedZoneData != null ? selectedZoneData!['name'] : selectedLocation.split(',').first,
                        ),
                      ),
                    );
                    if (result != null && result is Map) {
                      setState(() {
                        pickupDateTime = result['pickup'] ?? "Select date & time";
                        dropDateTime = result['drop'] ?? "Select date & time";
                        pickupRaw = result['pickupRaw'];
                        dropRaw = result['dropRaw'];
                      });
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.calendar_month_outlined,
                          color: Color(0xFF4313B8),
                          size: 18,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                "Drop Date & Time",
                                style: TextStyle(
                                  fontSize: 9,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                dropDateTime,
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // 3. Doorstep Delivery Checkbox (Disabled until Pickup Zone and Dates are selected)
          Builder(
            builder: (context) {
              final bool isZoneSelected = selectedLocation != "Select pickup zone" && selectedLocation.trim().isNotEmpty;
              final bool isDatesSelected = pickupDateTime != "Select date & time" && dropDateTime != "Select date & time";
              final bool isDoorstepEligible = isZoneSelected && isDatesSelected;

              return Opacity(
                opacity: isDoorstepEligible ? 1.0 : 0.5,
                child: Row(
                  children: [
                    SizedBox(
                      width: 20,
                      height: 20,
                      child: Checkbox(
                        value: isDifferentDropZone,
                        activeColor: const Color(0xFF4313B8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(4),
                        ),
                        onChanged: isDoorstepEligible
                            ? (val) => setState(() => isDifferentDropZone = val ?? false)
                            : (val) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text("Please select Pickup Zone and Pickup & Drop Dates first to enable Doorstep Delivery."),
                                    backgroundColor: Colors.orange,
                                  ),
                                );
                              },
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: GestureDetector(
                        onTap: isDoorstepEligible
                            ? null
                            : () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text("Please select Pickup Zone and Pickup & Drop Dates first to enable Doorstep Delivery."),
                                    backgroundColor: Colors.orange,
                                  ),
                                );
                              },
                        child: const Text(
                          "Vehicle Pickup & Drop Doorstep Delivery (₹30/km)",
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF200F54),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          if (isDifferentDropZone) ...[
            const SizedBox(height: 10),
            GestureDetector(
              onTap: () async {
                final result = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => MapPickupDropSelectionScreen(
                      initialPickup: selectedLocation == "Select pickup zone" ? "Gotri Station, Vadodara" : selectedLocation,
                      initialDrop: selectedDropLocation == "Select drop-off zone" ? "Alkapuri Hub, Vadodara" : selectedDropLocation,
                    ),
                  ),
                );
                if (result != null && result is Map<String, dynamic>) {
                  setState(() {
                    selectedDropZoneData = result;
                    // Protect main zone: ONLY update doorstep drop-off location
                    selectedDropLocation = result['doorstepAddress'] ?? result['drop'] ?? selectedDropLocation;
                    if (result['doorstepDeliveryFee'] != null) {
                      flexiDropFee = (result['doorstepDeliveryFee'] as num).toDouble();
                    }
                  });
                }
              },
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F3FF),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFDDD6FE)),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.door_front_door_rounded,
                      color: Color(0xFF4313B8),
                      size: 20,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Select vehicle doorstep drop-off location",
                            style: TextStyle(
                              fontSize: 10,
                              color: Color(0xFF64748B),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            selectedDropLocation,
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.map_rounded,
                        color: Color(0xFF4313B8),
                        size: 18,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFFDCFCE7),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline_rounded, color: Color(0xFF16A34A), size: 14),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      flexiDropFee > 0
                          ? "Doorstep Delivery Fee (₹${flexiDropFee.toInt()} @ ₹30/km) will be added to final payment."
                          : "Doorstep Delivery Fee (calculated @ ₹30/km) will be added to final payment.",
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF16A34A)),
                    ),
                  ),
                ],
              ),
            ),
          ],
          const SizedBox(height: 14),

          // 4. Full Width Search Vehicle Button
          SizedBox(
            width: double.infinity,
            height: 48,
            child: InkWell(
              onTap: (isSearchDisabled || (isDifferentDropZone && selectedDropLocation == "Select drop-off zone"))
                  ? null
                  : () async {
                      final isLoggedIn = await SessionService().isLoggedIn();
                      if (!mounted) return;
                      if (!isLoggedIn) {
                        final loginSuccess = await Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const LoginScreen()),
                        );
                        if (loginSuccess != true) return;
                      }
                      if (!mounted) return;
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => VehicleListScreen(
                            selectedZone: selectedLocation.split(',').first.trim(),
                            dropZone: isDifferentDropZone ? selectedDropLocation.split(',').first.trim() : selectedLocation.split(',').first.trim(),
                            isFlexiDrop: isDifferentDropZone,
                            flexiDropFee: flexiDropFee,
                            pickupDateTime: pickupDateTime,
                            dropDateTime: dropDateTime,
                            selectedZoneData: {
                              ...?selectedZoneData,
                              'pickupRaw': pickupRaw,
                              'dropRaw': dropRaw,
                              'selectedDropLocation': selectedDropLocation,
                            },
                          ),
                        ),
                      );
                    },
              borderRadius: BorderRadius.circular(14),
              child: Container(
                decoration: BoxDecoration(
                  color: isSearchDisabled ? Colors.grey : const Color(0xFF200F54), // Deep brand purple
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.search_rounded, color: Colors.white, size: 18),
                    SizedBox(width: 8),
                    Text(
                      "SEARCH VEHICLE",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
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

  // Zone Based Pricing Banner
  Widget _buildZonePricingBanner() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF7FBEF), // Light green tint
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.delivery_dining_rounded,
              color: Color(0xFF16A34A),
              size: 24,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Zone based pricing",
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF16A34A),
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  "Prices & packages may vary based on vehicle and zone.",
                  style: TextStyle(
                    fontSize: 10,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Text(
                  "Learn More",
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF475569),
                  ),
                ),
                SizedBox(width: 2),
                Icon(
                  Icons.chevron_right_rounded,
                  size: 14,
                  color: Color(0xFF475569),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Flexi Pickup & Drop Banner
  Widget _buildFlexiPickupBanner() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F3FF), // Light purple tint
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFDDD6FE).withOpacity(0.5)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.wrong_location_rounded,
              color: Color(0xFF4313B8),
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Flexi Pickup & Drop",
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF200F54),
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  "Now pick up and drop off the vehicle from any zone you prefer.",
                  style: TextStyle(
                    fontSize: 10,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          const Icon(
            Icons.chevron_right_rounded,
            color: Color(0xFF475569),
            size: 18,
          ),
        ],
      ),
    );
  }

  // Why Choose Evegah Section (4 Cards Grid)
  Widget _buildWhyChooseEvegahSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Why Choose Evegah?",
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFF1F5F9)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: const [
              _FeatureCardItem(
                Icons.eco_outlined,
                "Eco Friendly",
                "Zero Emission\nRide",
                Color(0xFFDCFCE7),
                Color(0xFF16A34A),
              ),
              _FeatureCardItem(
                Icons.security_outlined,
                "Safe & Secure",
                "Smart Lock &\nInsurance",
                Color(0xFFF5F3FF),
                Color(0xFF4313B8),
              ),
              _FeatureCardItem(
                Icons.sell_outlined,
                "Best Prices",
                "Zone Based\nPricing",
                Color(0xFFFFF7ED),
                Color(0xFFEA580C),
              ),
              _FeatureCardItem(
                Icons.headset_mic_outlined,
                "24/7 Support",
                "We're here\nfor you",
                Color(0xFFE0F2FE),
                Color(0xFF0284C7),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // Bottom Banner
  Widget _buildGoElectricBottomBanner() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F3FF),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Go Electric, Go Smart",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF200F54),
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  "Join the green revolution today!",
                  style: TextStyle(
                    fontSize: 10,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          SizedBox(
            width: 70,
            height: 50,
            child: Image.asset(
              "assets/city.png",
              fit: BoxFit.contain,
              errorBuilder: (context, error, stackTrace) => const Icon(
                Icons.electric_scooter,
                color: Color(0xFF4313B8),
                size: 36,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _FeatureCardItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color bgColor;
  final Color iconColor;

  const _FeatureCardItem(
    this.icon,
    this.title,
    this.subtitle,
    this.bgColor,
    this.iconColor,
  );

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(color: bgColor, shape: BoxShape.circle),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        const SizedBox(height: 6),
        Text(
          title,
          style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          subtitle,
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 8,
            color: Color(0xFF64748B),
          ),
        ),
      ],
    );
  }
}

// --- MOTION ANIMATED CITY EV FLEET SLIDER BANNER ---
class MotionAnimatedCityBanner extends StatefulWidget {
  const MotionAnimatedCityBanner({super.key});

  @override
  State<MotionAnimatedCityBanner> createState() => _MotionAnimatedCityBannerState();
}

class _MotionAnimatedCityBannerState extends State<MotionAnimatedCityBanner>
    with TickerProviderStateMixin {
  late AnimationController _motionController;
  late AnimationController _spotlightController;
  int _activeSlideIndex = 0;

  final List<String> _sliderImages = const [
    "assets/slider.png",
    "assets/ev_baroda.png",
    "assets/ev_vadodara.png",
    "assets/ev_daman.png",
    "assets/ev_aatapi.png",
    "assets/Ride More Spend Less.png",
  ];

  @override
  void initState() {
    super.initState();

    // 1. Slow Cinematic Motion Pan & Zoom (Ken Burns Effect)
    _motionController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 10000),
    )..repeat(reverse: true);

    // 2. Slider Auto Change Loop (every 3.5 seconds)
    _spotlightController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3500),
    )..repeat();

    _spotlightController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        if (mounted) {
          setState(() {
            _activeSlideIndex = (_activeSlideIndex + 1) % _sliderImages.length;
          });
          _spotlightController.forward(from: 0);
        }
      }
    });
  }

  @override
  void dispose() {
    _motionController.dispose();
    _spotlightController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 180,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF200F54).withValues(alpha: 0.12),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(22),
        child: Stack(
          children: [
            // 1. Motion Animated Background Image (Pan, Zoom & Crossfade)
            AnimatedBuilder(
              animation: _motionController,
              builder: (context, child) {
                // Continuous cinematic scale (1.0 -> 1.07) & subtle translation
                final scale = 1.0 + (_motionController.value * 0.07);
                final dx = math.sin(_motionController.value * math.pi * 2) * 6.0;
                final dy = math.cos(_motionController.value * math.pi) * 3.0;

                return Transform.translate(
                  offset: Offset(dx, dy),
                  child: Transform.scale(
                    scale: scale,
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 800),
                      transitionBuilder: (child, animation) {
                        return FadeTransition(opacity: animation, child: child);
                      },
                      child: Image.asset(
                        _sliderImages[_activeSlideIndex],
                        key: ValueKey<int>(_activeSlideIndex),
                        width: double.infinity,
                        height: double.infinity,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Image.asset(
                            "assets/slider.png",
                            width: double.infinity,
                            height: double.infinity,
                            fit: BoxFit.cover,
                          );
                        },
                      ),
                    ),
                  ),
                );
              },
            ),

            // 2. Stylish Vignette & Gradient Overlays
            Positioned.fill(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.black.withValues(alpha: 0.15),
                      Colors.transparent,
                      Colors.black.withValues(alpha: 0.50),
                    ],
                    stops: const [0.0, 0.4, 1.0],
                  ),
                ),
              ),
            ),

            // 3. Motion Floating Eco Particles / Glinting Light Effect
            Positioned.fill(
              child: AnimatedBuilder(
                animation: _motionController,
                builder: (context, child) {
                  return Stack(
                    children: List.generate(5, (index) {
                      final pValue = (_motionController.value + index * 0.20) % 1.0;
                      final pX = (index * 0.20 + pValue * 0.15) * 320.0;
                      final pY = 130.0 - (pValue * 90.0);
                      final opacity = (1.0 - pValue) * 0.75;

                      return Positioned(
                        left: pX,
                        top: pY,
                        child: Opacity(
                          opacity: opacity.clamp(0.0, 1.0),
                          child: const Icon(
                            Icons.eco_rounded,
                            color: Color(0xFF86EFAC),
                            size: 12,
                          ),
                        ),
                      );
                    }),
                  );
                },
              ),
            ),

            // 4. Centered Bottom Slider Dots Indicator
            Positioned(
              left: 0,
              right: 0,
              bottom: 12,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(_sliderImages.length, (index) {
                  final isActive = index == _activeSlideIndex;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _activeSlideIndex = index;
                      });
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      margin: const EdgeInsets.symmetric(horizontal: 3),
                      width: isActive ? 18 : 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: isActive ? const Color(0xFF22C55E) : Colors.white.withValues(alpha: 0.7),
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ),
                  );
                }),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// --- GREEN CURVE UNDERLINE PAINTER ---
class _GreenCurvePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF16A34A)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    final path = Path();
    path.moveTo(0, size.height * 0.2);
    path.quadraticBezierTo(
      size.width * 0.5,
      size.height * 1.3,
      size.width,
      size.height * 0.2,
    );
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// --- TREE & CITY LANDSCAPE BACKGROUND PAINTER ---
class _HeaderTreeBackgroundPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final width = size.width;
    final height = size.height;

    // 1. Soft Gradient Sky Background
    final bgPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          const Color(0xFFF1F9F5),
          const Color(0xFFFFFFFF),
        ],
      ).createShader(Rect.fromLTWH(0, 0, width, height));
    canvas.drawRect(Rect.fromLTWH(0, 0, width, height), bgPaint);

    // 2. Distant Horizon / City Line Silhouette
    final distantPaint = Paint()
      ..color = const Color(0xFFCBD5E1).withValues(alpha: 0.4)
      ..style = PaintingStyle.fill;

    final distantPath = Path();
    distantPath.moveTo(0, height * 0.72);
    distantPath.quadraticBezierTo(width * 0.15, height * 0.62, width * 0.3, height * 0.72);
    distantPath.quadraticBezierTo(width * 0.45, height * 0.58, width * 0.6, height * 0.70);
    distantPath.quadraticBezierTo(width * 0.75, height * 0.60, width * 0.9, height * 0.72);
    distantPath.quadraticBezierTo(width * 0.95, height * 0.66, width, height * 0.72);
    distantPath.lineTo(width, height);
    distantPath.lineTo(0, height);
    distantPath.close();
    canvas.drawPath(distantPath, distantPaint);

    // 3. Ground Terrain Line
    final groundPaint = Paint()
      ..color = const Color(0xFFDCFCE7).withValues(alpha: 0.7)
      ..style = PaintingStyle.fill;

    final groundPath = Path();
    groundPath.moveTo(0, height * 0.80);
    groundPath.quadraticBezierTo(width * 0.25, height * 0.76, width * 0.5, height * 0.81);
    groundPath.quadraticBezierTo(width * 0.75, height * 0.86, width, height * 0.79);
    groundPath.lineTo(width, height);
    groundPath.lineTo(0, height);
    groundPath.close();
    canvas.drawPath(groundPath, groundPaint);

    // Baseline Accent Line
    final linePaint = Paint()
      ..color = const Color(0xFF86EFAC)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;
    canvas.drawLine(
      Offset(0, height * 0.80),
      Offset(width, height * 0.79),
      linePaint,
    );

    // 4. Eco Trees (Left, Middle, Right)
    _drawTree(canvas, Offset(width * 0.07, height * 0.80), 24, const Color(0xFF86EFAC), const Color(0xFF22C55E));
    _drawPineTree(canvas, Offset(width * 0.25, height * 0.78), 28, const Color(0xFF4ADE80));
    _drawTree(canvas, Offset(width * 0.43, height * 0.80), 22, const Color(0xFFA7F3D0), const Color(0xFF16A34A));
    _drawPineTree(canvas, Offset(width * 0.69, height * 0.79), 27, const Color(0xFF86EFAC));
    _drawTree(canvas, Offset(width * 0.92, height * 0.79), 26, const Color(0xFF4ADE80), const Color(0xFF15803D));

    // 5. Small Bushes
    _drawBush(canvas, Offset(width * 0.16, height * 0.82), 8, const Color(0xFF86EFAC));
    _drawBush(canvas, Offset(width * 0.56, height * 0.83), 10, const Color(0xFF4ADE80));
    _drawBush(canvas, Offset(width * 0.83, height * 0.81), 9, const Color(0xFFA7F3D0));
  }

  void _drawTree(Canvas canvas, Offset root, double radius, Color lightColor, Color darkColor) {
    // Trunk
    final trunkPaint = Paint()
      ..color = const Color(0xFF64748B)
      ..style = PaintingStyle.fill;
    final trunkPath = Path();
    trunkPath.moveTo(root.dx - 2.5, root.dy);
    trunkPath.lineTo(root.dx + 2.5, root.dy);
    trunkPath.lineTo(root.dx + 2, root.dy - radius * 1.1);
    trunkPath.lineTo(root.dx - 2, root.dy - radius * 1.1);
    trunkPath.close();
    canvas.drawPath(trunkPath, trunkPaint);

    // Foliage
    final canopyCenter = Offset(root.dx, root.dy - radius * 1.2);
    final darkPaint = Paint()..color = darkColor.withValues(alpha: 0.75);
    final lightPaint = Paint()..color = lightColor.withValues(alpha: 0.9);

    canvas.drawCircle(Offset(canopyCenter.dx - radius * 0.4, canopyCenter.dy + radius * 0.2), radius * 0.6, darkPaint);
    canvas.drawCircle(Offset(canopyCenter.dx + radius * 0.4, canopyCenter.dy + radius * 0.2), radius * 0.6, darkPaint);
    canvas.drawCircle(canopyCenter, radius * 0.75, lightPaint);
    canvas.drawCircle(Offset(canopyCenter.dx - radius * 0.2, canopyCenter.dy - radius * 0.2), radius * 0.4, lightPaint);
  }

  void _drawPineTree(Canvas canvas, Offset root, double treeHeight, Color leafColor) {
    // Trunk
    final trunkPaint = Paint()..color = const Color(0xFF64748B);
    canvas.drawRect(Rect.fromLTWH(root.dx - 1.5, root.dy - treeHeight * 0.4, 3, treeHeight * 0.4), trunkPaint);

    // Pine layers
    final leafPaint = Paint()..color = leafColor.withValues(alpha: 0.85);
    double topY = root.dy - treeHeight;
    double bottomY = root.dy - treeHeight * 0.25;
    double width = treeHeight * 0.5;

    for (int i = 0; i < 3; i++) {
      double layerTop = topY + (i * treeHeight * 0.22);
      double layerBottom = bottomY - ((2 - i) * treeHeight * 0.15);
      double layerWidth = width * (0.5 + i * 0.25);

      final path = Path();
      path.moveTo(root.dx, layerTop);
      path.lineTo(root.dx - layerWidth / 2, layerBottom);
      path.lineTo(root.dx + layerWidth / 2, layerBottom);
      path.close();
      canvas.drawPath(path, leafPaint);
    }
  }

  void _drawBush(Canvas canvas, Offset center, double radius, Color color) {
    final paint = Paint()..color = color.withValues(alpha: 0.8);
    canvas.drawCircle(center, radius, paint);
    canvas.drawCircle(Offset(center.dx - radius * 0.5, center.dy + radius * 0.2), radius * 0.7, paint);
    canvas.drawCircle(Offset(center.dx + radius * 0.5, center.dy + radius * 0.2), radius * 0.7, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
