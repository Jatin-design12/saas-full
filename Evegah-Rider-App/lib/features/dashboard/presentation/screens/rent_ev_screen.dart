import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/constants/app_constants.dart';
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
  List<Map<String, dynamic>> _liveBackendZones = [];

  @override
  void initState() {
    super.initState();
    _loadLiveBackendZones();
  }

  Future<void> _loadLiveBackendZones() async {
    final urls = [
      AppConstants.getLiveZones,
      'http://192.168.1.4:5000/api/zones',
      'http://localhost:5000/api/zones',
      'http://10.0.2.2:5000/api/zones',
    ];

    for (final url in urls) {
      try {
        final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 3));
        if (res.statusCode == 200) {
          final data = json.decode(res.body);
          if (data['status'] == 'success' && data['data'] != null && (data['data'] as List).isNotEmpty) {
            final List list = data['data'];
            if (!mounted) return;
            setState(() {
              _liveBackendZones = List<Map<String, dynamic>>.from(list);
              if (selectedZoneData == null && _liveBackendZones.isNotEmpty) {
                selectedZoneData = _liveBackendZones.first;
                selectedLocation = "${_liveBackendZones.first['name']}, Vadodara";
              }
            });
            break;
          }
        }
      } catch (e) {
        debugPrint("Error fetching backend zones: $e");
      }
    }
  }

  Future<void> _makePhoneCall(String phoneNumber) async {
    final cleanPhone = phoneNumber.replaceAll(RegExp(r'[^0-9+]'), '');
    if (cleanPhone.isEmpty) return;
    final Uri launchUri = Uri(scheme: 'tel', path: cleanPhone);
    try {
      if (await canLaunchUrl(launchUri)) {
        await launchUrl(launchUri);
      } else {
        await launchUrl(launchUri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      debugPrint("Error making phone call: $e");
    }
  }

  Future<void> _openMapDirections(String address, String? mapLink) async {
    Uri googleMapsUri;
    if (mapLink != null && mapLink.startsWith('http')) {
      googleMapsUri = Uri.parse(mapLink);
    } else {
      final encodedAddress = Uri.encodeComponent(address);
      googleMapsUri = Uri.parse('https://www.google.com/maps/search/?api=1&query=$encodedAddress');
    }
    try {
      if (await canLaunchUrl(googleMapsUri)) {
        await launchUrl(googleMapsUri, mode: LaunchMode.externalApplication);
      } else {
        await launchUrl(googleMapsUri);
      }
    } catch (e) {
      debugPrint("Error launching directions: $e");
    }
  }

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

                    // --- ZONE BASED PRICING & FLEXI PICKUP BANNER ROW (2-COLUMN GRID) ---
                    _buildPricingAndFlexiRow(),
                    const SizedBox(height: 16),

                    // --- ZONE DETAILS CARD (DYNAMIC PER SELECTED ZONE) ---
                    _buildZoneDetailsCard(),
                    const SizedBox(height: 20),

                    // --- WHY CHOOSE EVEGAH SECTION ---
                    _buildWhyChooseEvegahSection(),
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

  // Top App Bar (Title & Bell Notification - Left icon removed)
  Widget _buildTopAppBar() {
    final unreadCount = NotificationService().unreadCount;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const SizedBox(width: 40), // Left placeholder space (left icon removed)

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
            "Ride Green, Choose Green",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: Color(0xFF200F54),
              letterSpacing: -0.4,
            ),
          ),
          const SizedBox(height: 2),
          Column(
            children: [
              const Text(
                "INDIA'S SMARTEST EV RENTAL MOBILITY",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF1E1B4B),
                  letterSpacing: 1.1,
                ),
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Icon(Icons.bolt_rounded, color: Color(0xFF6366F1), size: 14),
                  SizedBox(width: 4),
                  Text(
                    "ELECTRIC",
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF4F46E5),
                      letterSpacing: 0.8,
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8),
                    child: Text(
                      "|",
                      style: TextStyle(
                        color: Color(0xFFCBD5E1),
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Icon(Icons.eco_rounded, color: Color(0xFF84CC16), size: 14),
                  SizedBox(width: 4),
                  Text(
                    "SUSTAINABLE",
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF65A30D),
                      letterSpacing: 0.8,
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8),
                    child: Text(
                      "|",
                      style: TextStyle(
                        color: Color(0xFFCBD5E1),
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Icon(Icons.sensors_rounded, color: Color(0xFF6366F1), size: 14),
                  SizedBox(width: 4),
                  Text(
                    "SMART",
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF4F46E5),
                      letterSpacing: 0.8,
                    ),
                  ),
                ],
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
                          zoneData: selectedZoneData,
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
                          zoneData: selectedZoneData,
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

  // Zone Based Pricing & Flexi Pickup Banner Row (2-Column Grid matching media_1787648369515.png)
  Widget _buildPricingAndFlexiRow() {
    return Row(
      children: [
        // Left Column: Zone Based Pricing
        Expanded(
          child: Container(
            height: 110,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF0FDF4),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFDCFCE7)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: const Color(0xFF16A34A),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(
                        Icons.electric_scooter_rounded,
                        color: Colors.white,
                        size: 16,
                      ),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      "Zone based pricing",
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF15803D),
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      "Prices & packages may vary based on vehicle and zone.",
                      style: TextStyle(
                        fontSize: 8.5,
                        color: Color(0xFF166534),
                        height: 1.2,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: const [
                    Text(
                      "Learn More",
                      style: TextStyle(
                        fontSize: 9.5,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF16A34A),
                      ),
                    ),
                    SizedBox(width: 2),
                    Icon(
                      Icons.arrow_forward_rounded,
                      size: 10,
                      color: Color(0xFF16A34A),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),

        const SizedBox(width: 12),

        // Right Column: Flexi Pickup & Drop
        Expanded(
          child: GestureDetector(
            onTap: () {
              setState(() {
                isDifferentDropZone = true;
              });
            },
            child: Container(
              height: 110,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF5F3FF),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFFDDD6FE)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: const Color(0xFF4313B8),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.location_on_rounded,
                          color: Colors.white,
                          size: 16,
                        ),
                      ),
                      const Icon(
                        Icons.arrow_forward_rounded,
                        size: 14,
                        color: Color(0xFF4313B8),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        "Flexi Pickup & Drop",
                        style: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF4313B8),
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        "Now pick up and drop off the vehicle from any zone you prefer.",
                        style: TextStyle(
                          fontSize: 8.5,
                          color: Color(0xFF5B21B6),
                          height: 1.2,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSmartImage(String src, {double? width, double? height, BoxFit fit = BoxFit.cover}) {
    final fallback = Container(
      width: width,
      height: height,
      color: const Color(0xFFF1F5F9),
      child: const Center(
        child: Icon(Icons.location_city_rounded, size: 40, color: Color(0xFF4313B8)),
      ),
    );

    if (src.trim().isEmpty) return fallback;

    bool isBase64 = src.startsWith('data:image') ||
        (!src.startsWith('http') && !src.startsWith('assets') && !src.startsWith('blob:') && src.length > 100);

    if (isBase64) {
      try {
        String base64Str = src;
        final commaIdx = src.indexOf(',');
        if (commaIdx != -1) {
          base64Str = src.substring(commaIdx + 1);
        }
        base64Str = base64Str.replaceAll(RegExp(r'\s+'), '');
        final bytes = base64Decode(base64Str);
        return Image.memory(
          bytes,
          width: width,
          height: height,
          fit: fit,
          errorBuilder: (context, error, stackTrace) => fallback,
        );
      } catch (e) {
        debugPrint("Error decoding base64 image: $e");
        return fallback;
      }
    }

    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:')) {
      return Image.network(
        src,
        width: width,
        height: height,
        fit: fit,
        errorBuilder: (context, error, stackTrace) => fallback,
      );
    }

    String assetPath = src.trim();
    while (assetPath.startsWith('/')) {
      assetPath = assetPath.substring(1);
    }
    if (!assetPath.startsWith('assets/')) {
      assetPath = 'assets/$assetPath';
    }

    return Image.asset(
      assetPath,
      width: width,
      height: height,
      fit: fit,
      errorBuilder: (context, error, stackTrace) {
        // Fallback for asset image variations
        String altPath = assetPath;
        if (assetPath.contains('City-1.png')) altPath = 'assets/city.png';
        if (assetPath.contains('fly-1.png')) altPath = 'assets/Fly.png';
        if (assetPath.contains('Pro Banner.png')) altPath = 'assets/Pro_Banner.png';
        if (assetPath.contains('mink banner.png')) altPath = 'assets/mink_banner.png';
        
        if (altPath != assetPath) {
          return Image.asset(
            altPath,
            width: width,
            height: height,
            fit: fit,
            errorBuilder: (context, err, stack) => fallback,
          );
        }
        return fallback;
      },
    );
  }

  // Live Backend Zone Details Card (Connected to /api/zones, with Operational Call & Map Directions)
  Widget _buildZoneDetailsCard() {
    Map<String, dynamic> activeZone = selectedZoneData ?? {};

    if (_liveBackendZones.isNotEmpty) {
      final selectedName = (activeZone['name'] ?? selectedLocation).toString().toLowerCase();
      final matched = _liveBackendZones.firstWhere(
        (z) {
          final zName = (z['name'] ?? '').toString().toLowerCase();
          return zName.isNotEmpty && (selectedName.contains(zName) || zName.contains(selectedName.replaceAll(" zone", "").trim()));
        },
        orElse: () => activeZone.isNotEmpty ? activeZone : _liveBackendZones.first,
      );

      activeZone = {
        ...matched,
        ...activeZone,
      };

      if ((activeZone['image_url'] == null || activeZone['image_url'].toString().isEmpty) && matched['image_url'] != null) {
        activeZone['image_url'] = matched['image_url'];
      }
      if ((activeZone['phone'] == null || activeZone['phone'].toString().isEmpty) && matched['phone'] != null) {
        activeZone['phone'] = matched['phone'];
      }
      if ((activeZone['address'] == null || activeZone['address'].toString().isEmpty) && matched['address'] != null) {
        activeZone['address'] = matched['address'];
      }
      if ((activeZone['map_link'] == null || activeZone['map_link'].toString().isEmpty) && matched['map_link'] != null) {
        activeZone['map_link'] = matched['map_link'];
      }
      if ((activeZone['open_time'] == null || activeZone['open_time'].toString().isEmpty) && matched['open_time'] != null) {
        activeZone['open_time'] = matched['open_time'];
      }
      if ((activeZone['close_time'] == null || activeZone['close_time'].toString().isEmpty) && matched['close_time'] != null) {
        activeZone['close_time'] = matched['close_time'];
      }
      if (activeZone['is_24_hours'] == null && matched['is_24_hours'] != null) {
        activeZone['is_24_hours'] = matched['is_24_hours'];
      }
    }

    final zoneName = activeZone['name'] ?? 
        (selectedLocation != "Select pickup zone" && selectedLocation.isNotEmpty
            ? selectedLocation.split(',').first
            : "Gotri Zone");

    String zoneAddress = activeZone['address'] ?? activeZone['locality'] ?? "Office No-10, Royal Nandish, Gotri, Vadodara";
    String phone = (activeZone['phone'] != null && activeZone['phone'].toString().isNotEmpty)
        ? activeZone['phone'].toString()
        : (activeZone['contact_number'] != null && activeZone['contact_number'].toString().isNotEmpty)
            ? activeZone['contact_number'].toString()
            : "+91 98765 43210";
            
    String mapLink = activeZone['map_link'] ?? "https://maps.google.com/?q=${activeZone['name'] ?? 'Gotri'},Vadodara";
    String distance = activeZone['distance'] != null ? activeZone['distance'].toString() : "Nearby";
    if (!distance.contains("km") && !distance.contains("m") && !distance.contains("Nearby")) {
      distance = "$distance km";
    }

    String timing;
    if (activeZone['is_24_hours'] == true || activeZone['hours'] == "Open 24x7") {
      timing = "24 Hours Open";
    } else if (activeZone['open_time'] != null &&
        activeZone['close_time'] != null &&
        activeZone['open_time'].toString().isNotEmpty &&
        activeZone['close_time'].toString().isNotEmpty) {
      timing = "${activeZone['open_time']} - ${activeZone['close_time']}";
    } else if (activeZone['timing'] != null && activeZone['timing'].toString().isNotEmpty) {
      timing = activeZone['timing'].toString();
    } else {
      timing = "06:00 AM - 11:00 PM";
    }

    String zoneImage = activeZone['image_url'] ?? activeZone['image'] ?? activeZone['imageUrl'] ?? "";

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Title: Zone Details with purple underline bar
        Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Zone Details",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 4),
                Container(
                  width: 32,
                  height: 3,
                  decoration: BoxDecoration(
                    color: const Color(0xFF4313B8),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 12),

        // Zone Details Card
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFF1F5F9)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Left: Zone Image
              ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: SizedBox(
                  width: 125,
                  height: 115,
                  child: _buildSmartImage(zoneImage),
                ),
              ),
              const SizedBox(width: 12),

              // Right: Details & Operational Action Buttons
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.location_on_rounded,
                          color: Color(0xFF4313B8),
                          size: 16,
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            zoneName.contains("Zone") ? zoneName : "$zoneName Zone",
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      zoneAddress,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 9.5,
                        color: Color(0xFF64748B),
                        height: 1.25,
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Distance & Timing Row + Map Direction Action
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              const Icon(
                                Icons.navigation_rounded,
                                color: Color(0xFF4313B8),
                                size: 12,
                              ),
                              const SizedBox(width: 3),
                              Text(
                                distance,
                                style: const TextStyle(
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF334155),
                                ),
                              ),
                              const Padding(
                                padding: EdgeInsets.symmetric(horizontal: 4),
                                child: Text("|", style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 10)),
                              ),
                              const Icon(
                                Icons.access_time_rounded,
                                color: Color(0xFF64748B),
                                size: 12,
                              ),
                              const SizedBox(width: 3),
                              Expanded(
                                child: Text(
                                  timing,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF64748B),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                        // OPERATIONAL DIRECTION BUTTON
                        GestureDetector(
                          onTap: () => _openMapDirections(zoneAddress, mapLink),
                          child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEFF6FF),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: const Color(0xFFBFDBFE), width: 1),
                            ),
                            child: const Icon(
                              Icons.directions_rounded,
                              color: Color(0xFF2563EB),
                              size: 16,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 8),
                    const Divider(height: 1, color: Color(0xFFF1F5F9)),
                    const SizedBox(height: 8),

                    // OPERATIONAL CALL BUTTON & PHONE DISPLAY
                    GestureDetector(
                      onTap: () => _makePhoneCall(phone),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                        decoration: BoxDecoration(
                          color: const Color(0xFFE8F5E9),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFFC8E6C9)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.phone_in_talk_rounded,
                              color: Color(0xFF2E7D32),
                              size: 13,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              phone,
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF2E7D32),
                              ),
                            ),
                            const SizedBox(width: 4),
                            const Icon(
                              Icons.arrow_forward_ios_rounded,
                              color: Color(0xFF2E7D32),
                              size: 9,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }



  // Why Choose Evegah Section (4 Cards Grid)
  Widget _buildWhyChooseEvegahSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Why Choose Evegah",
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 10),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFF1F5F9)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: const [
              _FeatureCardItem(
                Icons.battery_charging_full_rounded,
                "Long Range",
                "Up to 120km\nper charge",
                Color(0xFFF5F3FF),
                Color(0xFF4313B8),
              ),
              _FeatureCardItem(
                Icons.currency_rupee_rounded,
                "Affordable",
                "Starting at\n₹99/day",
                Color(0xFFF0FDF4),
                Color(0xFF16A34A),
              ),
              _FeatureCardItem(
                Icons.eco_rounded,
                "Zero Emission",
                "100% Eco\nfriendly",
                Color(0xFFFEF3C7),
                Color(0xFFD97706),
              ),
              _FeatureCardItem(
                Icons.headset_mic_rounded,
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
  int _activeSlideIndex = 0;
  Timer? _autoSlideTimer;

  final List<String> _sliderImages = const [
    "assets/slider.png",
    "assets/ev_baroda.png",
    "assets/ev_vadodara.png",
    "assets/ev_daman.png",
    "assets/ev_aatapi.png",
  ];

  @override
  void initState() {
    super.initState();

    // 1. Slow Cinematic Motion Pan & Zoom (Ken Burns Effect)
    _motionController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 10000),
    )..repeat(reverse: true);

    // 2. Slider Auto Change Loop (every 3 seconds)
    _autoSlideTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (mounted) {
        setState(() {
          _activeSlideIndex = (_activeSlideIndex + 1) % _sliderImages.length;
        });
      }
    });
  }

  @override
  void dispose() {
    _autoSlideTimer?.cancel();
    _motionController.dispose();
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


