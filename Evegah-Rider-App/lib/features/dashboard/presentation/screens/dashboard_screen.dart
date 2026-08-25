import 'dart:async';
import 'package:flutter/material.dart';
import '../../../../core/widgets/app_sidebar_drawer.dart';
import '../../../kyc/presentation/screens/kyc_screen.dart';
import 'rent_ev_screen.dart';
import 'vehicle_list_screen.dart';
import 'select_location_screen.dart';
import 'select_date_time_screen.dart';
import '../../../notifications/presentation/screens/notification_screen.dart';
import '../../../offers/presentation/screens/payment_offers_screen.dart';
import '../../../rides/presentation/screen/ride_history_screen.dart';
import '../../../wallet/presentation/screens/wallet_screen.dart';
import '../../../unlock/presentation/screens/scan_qr_screen.dart';
import '../../../kyc/data/services/kyc_service.dart';
import '../../../../core/services/session_service.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/ble_battery_service.dart';
import '../widgets/bluetooth_scan_dialog.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _carouselIndex = 0;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  bool hasActiveRide = false; // Double tap header icon toggles active ride view
  bool hasBookedRide = false;
  Map<String, dynamic>? activeBooking;
  String selectedLocation = "Gotri Zone, Vadodara";
  late PageController _pageController;
  Timer? _carouselTimer;

  final List<String> _carouselBanners = [
    "assets/offer.png",
    "assets/Rent EV.png",
    "assets/Ride More Spend Less.png",
    "assets/Ride More.png",
  ];

  final List<Map<String, dynamic>> _evFleet = [
    {
      "name": "Evegah City",
      "category": "E-Vehicle",
      "tagColor": const Color(0xFFF5F3FF),
      "tagTextColor": const Color(0xFF4313B8),
      "image": "assets/city.png",
      "range": "80–100 km",
      "speed": "45 km/h",
      "features": ["👥 2 Seater", "🔒 Smart Lock"],
      "isFavorite": false,
    },
    {
      "name": "Evegah Pro",
      "category": "E-Scooter",
      "tagColor": const Color(0xFFDCFCE7),
      "tagTextColor": const Color(0xFF15803D),
      "image": "assets/pro-1.png",
      "range": "90–120 km",
      "speed": "20 km/h",
      "features": ["👥 2 Seater", "⚡ Fast Charge"],
      "isFavorite": false,
    },
    {
      "name": "Evegah Mink",
      "category": "E-Moped",
      "tagColor": const Color(0xFFE0F2FE),
      "tagTextColor": const Color(0xFF0369A1),
      "image": "assets/mink.png",
      "range": "60–80 km",
      "speed": "30 km/h",
      "features": ["👥 2 Seater", "🔒 Smart Lock"],
      "isFavorite": false,
    },
    {
      "name": "Evegah Cycle",
      "category": "E-Cycle",
      "tagColor": const Color(0xFFFFEDD5),
      "tagTextColor": const Color(0xFFC2410C),
      "image": "assets/Fly.png",
      "range": "15–20 km",
      "speed": "25 km/h",
      "features": ["👤 Single Seat", "🚲 Pedal Assist"],
      "isFavorite": false,
    },
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 0);
    _startCarouselTimer();
    _loadBookingState();
    _fetchActiveBooking();
  }

  @override
  void dispose() {
    _carouselTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  void _startCarouselTimer() {
    _carouselTimer?.cancel();
    _carouselTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (!mounted || !_pageController.hasClients) return;
      int nextPage = _carouselIndex + 1;
      if (nextPage >= _carouselBanners.length) {
        nextPage = 0;
      }
      _pageController.animateToPage(
        nextPage,
        duration: const Duration(milliseconds: 800),
        curve: Curves.easeInOut,
      );
    });
  }

  Future<void> _loadBookingState() async {
    final booked = await SessionService().hasBookedFirstRide();
    setState(() {
      hasBookedRide = booked;
    });
  }

  Future<void> _fetchActiveBooking() async {
    final loggedIn = await SessionService().isLoggedIn();
    if (!loggedIn) return;

    final mobile = await SessionService().getUserMobile() ?? "+91 98765 43210";
    final urls = [
      '${AppConstants.apiBaseUrl}/reservations?search=${Uri.encodeComponent(mobile)}',
      'http://192.168.1.4:5000/api/reservations?search=${Uri.encodeComponent(mobile)}',
      'http://localhost:5000/api/reservations?search=${Uri.encodeComponent(mobile)}',
    ];

    for (final url in urls) {
      try {
        final response = await http
            .get(Uri.parse(url))
            .timeout(const Duration(seconds: 2));
        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          if (data['status'] == 'success' && data['data'] != null) {
            final List list = data['data'];
            final active = list.firstWhere(
              (r) =>
                  r['status'] == 'Confirmed' ||
                  r['status'] == 'Upcoming' ||
                  r['status'] == 'Ongoing',
              orElse: () => null,
            );
            if (active != null) {
              setState(() {
                activeBooking = active;
              });
              return;
            }
          }
        }
      } catch (e) {
        debugPrint("Error fetching active booking: $e");
      }
    }
  }

  Widget _buildActiveBookingCard() {
    if (activeBooking == null) return const SizedBox.shrink();

    final String vehicleName =
        activeBooking!['vehicle_category'] ?? 'Evegah Premium';
    final String reservationId = activeBooking!['reservation_id'] ?? '';
    final String pickupZone = activeBooking!['pickup_zone'] ?? '';

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF200F54), Color(0xFF4313B8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF4313B8).withOpacity(0.2),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "ACTIVE BOOKING",
                      style: TextStyle(
                        color: Color(0xFFDDD6FE),
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      vehicleName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 5,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  "ID: $reservationId",
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const Divider(color: Colors.white24, height: 24),
          Row(
            children: [
              const Icon(
                Icons.location_on_rounded,
                color: Color(0xFFDDD6FE),
                size: 14,
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  "Pickup: $pickupZone",
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Color(0xFFE2E8F0),
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Bluetooth Battery Panel
          ValueListenableBuilder<BleBatteryState>(
            valueListenable: BleBatteryService.instance.connectionState,
            builder: (context, connState, _) {
              if (connState == BleBatteryState.connected) {
                return ValueListenableBuilder<double>(
                  valueListenable: BleBatteryService.instance.batteryPercentage,
                  builder: (context, batteryPct, _) {
                    return Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white12),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.battery_charging_full_rounded,
                            color: Color(0xFF22C55E),
                            size: 24,
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Connected to Battery",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  "Live BMS: ${batteryPct.toStringAsFixed(0)}%",
                                  style: const TextStyle(
                                    color: Color(0xFFE2E8F0),
                                    fontSize: 11,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              BleBatteryService.instance.disconnect();
                            },
                            style: TextButton.styleFrom(
                              foregroundColor: const Color(0xFFF87171),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                              ),
                              minimumSize: Size.zero,
                            ),
                            child: const Text(
                              "Disconnect",
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                );
              } else if (connState == BleBatteryState.connecting ||
                  connState == BleBatteryState.scanning) {
                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0x14FFFFFF),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: const [
                      SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(width: 12),
                      Text(
                        "Connecting to Battery...",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                );
              } else {
                return SizedBox(
                  width: double.infinity,
                  height: 44,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => const BluetoothScanDialog(),
                      );
                    },
                    icon: const Icon(
                      Icons.bluetooth_searching_rounded,
                      size: 16,
                    ),
                    label: const Text(
                      "Scan & Connect Battery",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFF200F54),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      elevation: 0,
                    ),
                  ),
                );
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildActiveRideTelemetryRow() {
    final bleService = BleBatteryService.instance;

    return Row(
      children: [
        // --- LEFT CARD: LIVE BATTERY ---
        Expanded(
          child: ValueListenableBuilder<BleBatteryState>(
            valueListenable: bleService.connectionState,
            builder: (context, connState, _) {
              final isConnected = connState == BleBatteryState.connected;
              final batteryPct = bleService.batteryPercentage.value;
              final estRange = isConnected ? (batteryPct * 0.8).round() : 0;

              return GestureDetector(
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (context) => const BluetoothScanDialog(),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x08000000),
                        blurRadius: 10,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header Row
                      Row(
                        children: [
                          Icon(
                            isConnected
                                ? Icons.bluetooth_connected_rounded
                                : Icons.bluetooth_disabled_rounded,
                            size: 18,
                            color: isConnected
                                ? const Color(0xFF16A34A)
                                : const Color(0xFF94A3B8),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Live Battery",
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                Text(
                                  isConnected
                                      ? "• Connected"
                                      : "• Disconnected",
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: isConnected
                                        ? const Color(0xFF16A34A)
                                        : const Color(0xFFEF4444),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // SoC & Range Display
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                isConnected ? "${batteryPct.toInt()}%" : "--%",
                                style: const TextStyle(
                                  fontSize: 26,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF4313B8),
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                isConnected
                                    ? "Range ~ $estRange km"
                                    : "Range ~ -- km",
                                style: const TextStyle(
                                  fontSize: 10.5,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            width: 38,
                            height: 38,
                            decoration: const BoxDecoration(
                              color: Color(0xFFF8FAFC),
                              shape: BoxShape.circle,
                            ),
                            child: const Center(
                              child: Icon(
                                Icons.flash_on_rounded,
                                color: Color(0xFF4313B8),
                                size: 20,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Divider(height: 1, color: Color(0xFFF1F5F9)),
                      const SizedBox(height: 10),

                      // Bottom Health Row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Row(
                            children: [
                              Icon(
                                Icons.favorite_rounded,
                                color: Color(0xFFEF4444),
                                size: 12,
                              ),
                              SizedBox(width: 4),
                              Text(
                                "Battery Health",
                                style: TextStyle(
                                  fontSize: 10.5,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            isConnected ? "98% >" : "-- >",
                            style: TextStyle(
                              fontSize: 10.5,
                              color: isConnected
                                  ? const Color(0xFF16A34A)
                                  : const Color(0xFF94A3B8),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(width: 12),

        // --- RIGHT CARD: VEHICLE RUNNING STATUS (REPLACING WALLET) ---
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x08000000),
                  blurRadius: 10,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Row
                Row(
                  children: [
                    Container(
                      width: 26,
                      height: 26,
                      decoration: const BoxDecoration(
                        color: Color(0xFFF3E8FF),
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.electric_scooter_rounded,
                          color: Color(0xFF4313B8),
                          size: 14,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Expanded(
                      child: Text(
                        "Vehicle Status",
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ),
                    const Icon(
                      Icons.chevron_right_rounded,
                      size: 16,
                      color: Color(0xFF94A3B8),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Speed / Running Metric Display
                Row(
                  children: [
                    Flexible(
                      flex: 5,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 7,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFFDCFCE7),
                          borderRadius: BorderRadius.circular(9),
                        ),
                        child: const FittedBox(
                          fit: BoxFit.scaleDown,
                          alignment: Alignment.centerLeft,
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.circle,
                                color: Color(0xFF16A34A),
                                size: 6,
                              ),
                              SizedBox(width: 4),
                              Text(
                                "In Motion",
                                style: TextStyle(
                                  fontSize: 10,
                                  color: Color(0xFF16A34A),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 7),
                    Flexible(
                      flex: 5,
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        alignment: Alignment.centerRight,
                        child: const Text(
                          "24 km/h",
                          maxLines: 1,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Lock/Unlock Control Action Row
                GestureDetector(
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text(
                          "🔒 Vehicle Remote Command: Lock / Unlock Signal Sent!",
                        ),
                        backgroundColor: Color(0xFF4313B8),
                      ),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F3FF),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFDDD6FE)),
                    ),
                    child: const Center(
                      child: Text(
                        "🔒 Lock / Unlock",
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF4313B8),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                const Divider(height: 1, color: Color(0xFFF1F5F9)),
                const SizedBox(height: 8),

                // Bottom Riding Score Row
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.star_rounded,
                          color: Color(0xFFEAB308),
                          size: 13,
                        ),
                        SizedBox(width: 4),
                        Text(
                          "Riding Score",
                          style: TextStyle(
                            fontSize: 10.5,
                            color: Color(0xFF64748B),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    Text(
                      "95/100 >",
                      style: TextStyle(
                        fontSize: 10.5,
                        color: Color(0xFF4313B8),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool showKycBanner =
        hasBookedRide && KycService().kycStatus != "Verified";

    return Scaffold(
      key: _scaffoldKey,
      drawer: const AppSidebarDrawer(),
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // --- 1. TOP HEADER (Location Chip & Bell Badge) ---
              _buildTopHeader(),
              const SizedBox(height: 12),

              // --- 3. HERO CAROUSEL / SLIDER BANNER ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: _buildHeroCarousel(),
              ),
              const SizedBox(height: 18),

              // --- 3.5 ACTIVE RIDE TELEMETRY CARDS (LIVE BATTERY & VEHICLE RUNNING STATUS) ---
              if (hasActiveRide || activeBooking != null || hasBookedRide) ...[
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: _buildActiveRideTelemetryRow(),
                ),
                const SizedBox(height: 18),
              ],

              // --- 2. KYC WARNING BANNER (IF BOOKED & UNVERIFIED) ---
              if (showKycBanner) ...[
                _buildKycBanner(),
                const SizedBox(height: 16),
              ],

              // --- 4. QUICK ACTIONS SECTION ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: _buildQuickActionsSection(),
              ),
              const SizedBox(height: 20),

              // --- 5. CHOOSE YOUR RENTAL SECTION ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: _buildChooseYourRentalSection(),
              ),
              const SizedBox(height: 20),

              // --- 6. OUR EV FLEET SECTION ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: _buildOurEvFleetSection(),
              ),
              const SizedBox(height: 20),

              // --- 7. ENVIRONMENTAL IMPACT BAR ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: _buildEnvironmentalImpactBar(),
              ),
              const SizedBox(height: 16),

              // --- 8. HOST YOUR EV & EARN BANNER ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: _buildHostYourEvBanner(),
              ),
              const SizedBox(height: 16),

              // --- 9. TRUST BADGES ROW ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: _buildTrustBadgesRow(),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  // Header with Location Pill & Bell Icon
  Widget _buildTopHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // --- Left Side: Location Selector Chip Button ---
          Expanded(
            child: InkWell(
              onTap: () async {
                final result = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => SelectLocationScreen(
                      currentCity: selectedLocation.split(",").first,
                      onLocationSelected: (zone) {
                        setState(() {
                          final zoneName = zone is Map
                              ? zone['name']
                              : zone.toString();
                          selectedLocation = "$zoneName, Vadodara";
                        });
                      },
                    ),
                  ),
                );
                if (result != null) {
                  setState(() {
                    final zoneName = result is Map
                        ? result['name']
                        : result.toString();
                    selectedLocation = zoneName.contains(",")
                        ? zoneName
                        : "$zoneName, Vadodara";
                  });
                }
              },
              borderRadius: BorderRadius.circular(20),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.02),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.location_on_rounded,
                      color: Color(0xFF4313B8),
                      size: 18,
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        selectedLocation,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    const Icon(
                      Icons.keyboard_arrow_down_rounded,
                      color: Color(0xFF64748B),
                      size: 18,
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),

          // --- Right Side: Notification Bell & Hamburger Menu ---
          Row(
            children: [
              // 1. Notification Bell
              Stack(
                children: [
                  InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const NotificationScreen(),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: const Icon(
                        Icons.notifications_none_rounded,
                        color: Color(0xFF0F172A),
                        size: 20,
                      ),
                    ),
                  ),
                  Positioned(
                    top: 2,
                    right: 2,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: Color(0xFF200F54),
                        shape: BoxShape.circle,
                      ),
                      child: const Text(
                        "3",
                        style: TextStyle(
                          fontSize: 8,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(width: 8),

              // 2. Hamburger App Drawer Menu
              Builder(
                builder: (context) {
                  return InkWell(
                    onTap: () {
                      _scaffoldKey.currentState?.openDrawer(); // Opens the sidebar
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: const Icon(
                        Icons.menu_rounded,
                        color: Color(0xFF0F172A),
                        size: 20,
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  // KYC Warning Banner
  Widget _buildKycBanner() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F3FF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFDDD6FE)),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.verified_user_rounded,
            color: Color(0xFF4313B8),
            size: 20,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Complete your KYC verification",
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF200F54),
                  ),
                ),
                Text(
                  "Required before starting your first booked ride.",
                  style: TextStyle(fontSize: 9, color: Color(0xFF64748B)),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const KycScreen()),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4313B8),
              minimumSize: Size.zero,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text(
              "Start KYC",
              style: TextStyle(
                fontSize: 9,
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Safe Image Banner Loader (Handles Casing Compatibility)
  Widget _buildSafeBannerImage(String path, {BoxFit fit = BoxFit.cover}) {
    String altPath = path;
    if (path.contains("offer.png")) {
      altPath = "assets/Offer.png";
    } else if (path.contains("Offer.png")) {
      altPath = "assets/offer.png";
    } else if (path.contains("Ride More.png")) {
      altPath = "assets/Ride more.png";
    } else if (path.contains("Ride more.png")) {
      altPath = "assets/Ride More.png";
    } else if (path.contains("Rent EV.png")) {
      altPath = "assets/rent ev.png";
    } else if (path.contains("Ride More Spend Less.png")) {
      altPath = "assets/ride more spend less.png";
    }

    return Image.asset(
      path,
      fit: fit,
      errorBuilder: (context, error, stackTrace) {
        return Image.asset(
          altPath,
          fit: fit,
          errorBuilder: (context, error2, stackTrace2) {
            return Container(
              color: const Color(0xFF200F54),
              alignment: Alignment.center,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Text(
                    "MONSOON OFFER 30% OFF",
                    style: TextStyle(
                      color: Color(0xFF8CE600),
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    "Enjoy exciting offers on every EV ride • Use Code EVGO30",
                    style: TextStyle(color: Colors.white70, fontSize: 10),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  // Hero Carousel Slider
  Widget _buildHeroCarousel() {
    return Column(
      children: [
        SizedBox(
          height: 155,
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _carouselIndex = index;
              });
            },
            itemCount: _carouselBanners.length,
            itemBuilder: (context, index) {
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 2),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(22),
                  child: _buildSafeBannerImage(
                    _carouselBanners[index],
                    fit: BoxFit.cover,
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 8),
        // Dots
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            _carouselBanners.length,
            (idx) => AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              width: _carouselIndex == idx ? 16 : 6,
              height: 6,
              margin: const EdgeInsets.symmetric(horizontal: 3),
              decoration: BoxDecoration(
                color: _carouselIndex == idx
                    ? const Color(0xFF4313B8)
                    : Colors.grey.shade300,
                borderRadius: BorderRadius.circular(3),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // Quick Actions Section
  Widget _buildQuickActionsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              "Quick Actions",
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
            ),
            InkWell(
              onTap: () {
                _scaffoldKey.currentState?.openDrawer();
              },
              child: Row(
                children: const [
                  Text(
                    "View All",
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF4313B8),
                    ),
                  ),
                  Icon(
                    Icons.chevron_right_rounded,
                    size: 14,
                    color: Color(0xFF4313B8),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // 1. Rent Now -> Navigates to Rent Your EV page!
            _buildActionItem(
              icon: Icons.electric_scooter_rounded,
              title: "Rent Now",
              subtitle: "Book a vehicle",
              bgColor: const Color(0xFFF5F3FF),
              iconColor: const Color(0xFF4313B8),
              hasPlusBadge: true,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const RentEvScreen()),
                );
              },
            ),
            // 2. Ride History
            _buildActionItem(
              icon: Icons.access_time_rounded,
              title: "Ride History",
              subtitle: "Your trips",
              bgColor: const Color(0xFFF5F3FF),
              iconColor: const Color(0xFF4313B8),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const RideHistoryScreen(),
                  ),
                );
              },
            ),
            // 3. Scan QR
            _buildActionItem(
              icon: Icons.qr_code_scanner_rounded,
              title: "Scan QR",
              subtitle: "Unlock vehicle",
              bgColor: const Color(0xFFF5F3FF),
              iconColor: const Color(0xFF4313B8),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ScanQrScreen()),
                );
              },
            ),
            // 4. My Wallet
            _buildActionItem(
              icon: Icons.account_balance_wallet_outlined,
              title: "My Wallet",
              subtitle: "₹1,250.00",
              bgColor: const Color(0xFFF5F3FF),
              iconColor: const Color(0xFF4313B8),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const WalletScreen()),
                );
              },
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color bgColor,
    required Color iconColor,
    required VoidCallback onTap,
    bool hasPlusBadge = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 80,
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFF1F5F9)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: bgColor,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: iconColor, size: 22),
                ),
                if (hasPlusBadge)
                  Positioned(
                    bottom: 0,
                    right: -2,
                    child: Container(
                      padding: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(
                        color: Color(0xFF16A34A),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.add_rounded,
                        color: Colors.white,
                        size: 9,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 8.5,
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Choose Your Rental Section with 100000% 3D Perspective Rotation
  Widget _buildChooseYourRentalSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Choose Your Rental",
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 185,
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            clipBehavior: Clip.none,
            child: Row(
              children: [
                const SizedBox(width: 4),

                // Card 1: Daily Drive (3D tilted counter-clockwise -0.035 rad)
                _build3DRentalCard(
                  rotationAngle: 0.045,
                  title: "Daily Drive",
                  titleColor: const Color(0xFF0F172A),
                  subtitle: "24+ Hours",
                  desc: "Perfect for short\ndaily rides",
                  bgColor: const Color(0xFFF4F0FF),
                  btnColor: const Color(0xFF4313B8),
                  shadowColor: const Color(0xFF4313B8).withOpacity(0.14),
                  badgeIcon: Icons.bolt_rounded,
                  badgeBg: const Color(0xFF4313B8),
                  image: "assets/city.png",
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const RentEvScreen(),
                      ),
                    );
                  },
                ),

                const SizedBox(width: 14),

                // Card 2: Monthly Subscription (Upright / 0.0 rad)
                _build3DRentalCard(
                  rotationAngle: 0.045,
                  title: "Monthly Drive",
                  titleColor: const Color(0xFF15803D),
                  subtitle: "30+ Days",
                  desc: "Best for regular\nriders",
                  bgColor: const Color(0xFFF0FDF4),
                  btnColor: const Color(0xFF16A34A),
                  shadowColor: const Color(0xFF16A34A).withOpacity(0.14),
                  badgeIcon: Icons.card_giftcard_rounded,
                  badgeBg: const Color(0xFF16A34A),
                  image: "assets/mink.png",
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const SelectDateTimeScreen(),
                      ),
                    );
                  },
                ),

                const SizedBox(width: 14),

                // Card 3: Weekday Pass (3D tilted clockwise 0.035 rad)
                _build3DRentalCard(
                  rotationAngle: 0.045,
                  title: "Weekday Pass",
                  titleColor: const Color(0xFFC2410C),
                  subtitle: "Mon to Fri\nUnlimited Kms",
                  desc: "Ride more for\nless",
                  bgColor: const Color(0xFFFFFBEB),
                  btnColor: const Color(0xFFEA580C),
                  shadowColor: const Color(0xFFEA580C).withOpacity(0.14),
                  badgeIcon: Icons.percent_rounded,
                  badgeBg: const Color(0xFFEA580C),
                  image: "assets/v2.webp",
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const RentEvScreen(),
                      ),
                    );
                  },
                ),

                const SizedBox(width: 8),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _build3DRentalCard({
    required double rotationAngle,
    required String title,
    required Color titleColor,
    required String subtitle,
    required String desc,
    required Color bgColor,
    required Color btnColor,
    required Color shadowColor,
    required IconData badgeIcon,
    required Color badgeBg,
    required String image,
    required VoidCallback onTap,
  }) {
    return Transform.rotate(
      angle: rotationAngle,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          width: 165,
          height: 170,
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: shadowColor,
                blurRadius: 16,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              // Content Column
              Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: titleColor,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        fontSize: 11,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      desc,
                      style: const TextStyle(
                        fontSize: 9.5,
                        color: Color(0xFF475569),
                        height: 1.3,
                      ),
                    ),
                  ],
                ),
              ),

              // Floating 3D Top-Right Badge (Overflowing)
              Positioned(
                top: -10,
                right: -6,
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: badgeBg,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: badgeBg.withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(badgeIcon, color: Colors.white, size: 16),
                ),
              ),

              // 3D Scooter Graphic (Overflowing Bottom Right)
              Positioned(
                bottom: -8,
                right: -8,
                width: 105,
                height: 100,
                child: Image.asset(
                  image,
                  fit: BoxFit.contain,
                  errorBuilder: (_, __, ___) => const Icon(
                    Icons.electric_scooter,
                    size: 50,
                    color: Color(0xFF4313B8),
                  ),
                ),
              ),

              // Bottom Left Solid Circular Arrow Action Button
              Positioned(
                bottom: 12,
                left: 12,
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: btnColor,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: btnColor.withOpacity(0.3),
                        blurRadius: 6,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.arrow_forward_rounded,
                    color: Colors.white,
                    size: 16,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Our EV Fleet Section
  // REQUIREMENT: "when we click on any vehicle navigate to the Rent Your EV page"
  Widget _buildOurEvFleetSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              "Our EV Fleet",
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
            ),
            InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const VehicleListScreen(),
                  ),
                );
              },
              child: Row(
                children: const [
                  Text(
                    "View All",
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF4313B8),
                    ),
                  ),
                  Icon(
                    Icons.chevron_right_rounded,
                    size: 14,
                    color: Color(0xFF4313B8),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        SizedBox(
          height:
              215, // 🚨 Increased height slightly to accommodate wrapped feature badges safely
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: _evFleet.length,
            itemBuilder: (context, index) {
              final item = _evFleet[index];
              return GestureDetector(
                onTap: () {
                  // 🟢 WIRED UP: Navigate directly to Rent Your EV page when clicking ANY vehicle!
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const RentEvScreen(),
                    ),
                  );
                },
                child: Container(
                  width: 145,
                  margin: const EdgeInsets.only(right: 12),
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFF1F5F9)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.01),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: item["tagColor"],
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              item["category"],
                              style: TextStyle(
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                                color: item["tagTextColor"],
                              ),
                            ),
                          ),
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                item["isFavorite"] =
                                    !(item["isFavorite"] as bool);
                              });
                            },
                            child: Icon(
                              item["isFavorite"]
                                  ? Icons.favorite_rounded
                                  : Icons.favorite_outline_rounded,
                              size: 14,
                              color: item["isFavorite"]
                                  ? Colors.red
                                  : const Color(0xFF94A3B8),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),

                      // Image
                      Expanded(
                        child: Center(
                          child: Image.asset(
                            item["image"],
                            fit: BoxFit.contain,
                            errorBuilder: (_, __, ___) => const Icon(
                              Icons.electric_scooter,
                              size: 45,
                              color: Color(0xFF4313B8),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),

                      Text(
                        item["name"],
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 4),

                      // Specs
                      Row(
                        children: [
                          const Icon(
                            Icons.bolt_rounded,
                            size: 10,
                            color: Color(0xFF64748B),
                          ),
                          const SizedBox(width: 2),
                          Text(
                            item["range"],
                            style: const TextStyle(
                              fontSize: 8,
                              color: Color(0xFF64748B),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 6),
                          const Icon(
                            Icons.speed_rounded,
                            size: 10,
                            color: Color(0xFF64748B),
                          ),
                          const SizedBox(width: 2),
                          Text(
                            item["speed"],
                            style: const TextStyle(
                              fontSize: 8,
                              color: Color(0xFF64748B),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),

                      // Feature Pills
                      // 🚨 FIX: Swapped out Row for Wrap to dynamically stack tightly bound cards safely
                      // Feature Pills
                      // 🟢 FittedBox forces them onto one single line and scales down safely if needed
                      SizedBox(
                        width: double.infinity,
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          alignment: Alignment.centerLeft,
                          child: Row(
                            children: (item["features"] as List<String>).map((
                              f,
                            ) {
                              return Container(
                                margin: const EdgeInsets.only(right: 4),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 5,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF5F3FF),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  f,
                                  style: const TextStyle(
                                    fontSize: 7,
                                    color: Color(0xFF4313B8),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // Environmental Impact Bar
  Widget _buildEnvironmentalImpactBar() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF7FBEF), // Soft green
        borderRadius: BorderRadius.circular(20),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        child: Row(
          children: const [
            _ImpactColumn(
              Icons.eco_rounded,
              "CO₂ Saved",
              "12.4 kg",
              "This Month",
              Color(0xFF16A34A),
            ),
            SizedBox(width: 24),
            _ImpactColumn(
              Icons.park_rounded,
              "Green Rides",
              "8",
              "This Month",
              Color(0xFF16A34A),
            ),
            SizedBox(width: 24),
            _ImpactColumn(
              Icons.bolt_rounded,
              "Energy Saved",
              "18.6 kWh",
              "This Month",
              Color(0xFF16A34A),
            ),
            SizedBox(width: 24),
            _ImpactColumn(
              Icons.spa_rounded,
              "Together We Save",
              "",
              "For a Better Tomorrow",
              Color(0xFF16A34A),
            ),
          ],
        ),
      ),
    );
  }

  // Host Your EV & Earn Banner
  Widget _buildHostYourEvBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F3FF),
        borderRadius: BorderRadius.circular(22),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // EV icon
          Container(
            width: 52,
            height: 52,
            alignment: Alignment.center,
            child: Image.asset(
              "assets/MINK.png",
              width: 44,
              height: 44,
              fit: BoxFit.contain,
              errorBuilder: (_, __, ___) => const Icon(
                Icons.directions_car_rounded,
                size: 34,
                color: Color(0xFF4313B8),
              ),
            ),
          ),
          const SizedBox(width: 10),

          // Text + button area
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Host Your EV Fleet & Earn",
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 12.5,
                    height: 1.15,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF200F54),
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  "Earn extra income by sharing your EV with trusted riders.",
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 8.5,
                    height: 1.2,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),

                // Button gets its own row, so it never collides with text.
                Align(
                  alignment: Alignment.centerLeft,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF200F54),
                      foregroundColor: Colors.white,
                      minimumSize: const Size(0, 32),
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 13,
                        vertical: 7,
                      ),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          "Become a Host",
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(width: 3),
                        Icon(
                          Icons.chevron_right_rounded,
                          size: 13,
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
    );
  }

  // Trust Badges Row
  Widget _buildTrustBadgesRow() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        child: Row(
          children: const [
            _TrustBadgeItem(
              Icons.verified_user_outlined,
              "100% Secure",
              "Verified Rides",
            ),
            SizedBox(width: 18),
            _TrustBadgeItem(
              Icons.headset_mic_outlined,
              "24/7 Support",
              "We're here for you",
            ),
            SizedBox(width: 18),
            _TrustBadgeItem(
              Icons.grid_view_rounded,
              "On-Road Assistance",
              "Whenever you need",
            ),
            SizedBox(width: 18),
            _TrustBadgeItem(Icons.sell_outlined, "Best Value", "For every ride"),
          ],
        ),
      ),
    );
  }
}

class _ImpactColumn extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final String subtitle;
  final Color iconColor;

  const _ImpactColumn(
    this.icon,
    this.title,
    this.value,
    this.subtitle,
    this.iconColor,
  );

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: iconColor, size: 16),
        const SizedBox(height: 4),
        Text(
          title,
          style: const TextStyle(
            fontSize: 8,
            color: Color(0xFF475569),
            fontWeight: FontWeight.w600,
          ),
        ),
        if (value.isNotEmpty)
          Text(
            value,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: Color(0xFF0F172A),
            ),
          ),
        Text(
          subtitle,
          style: const TextStyle(fontSize: 7, color: Color(0xFF64748B)),
        ),
      ],
    );
  }
}

class _TrustBadgeItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;

  const _TrustBadgeItem(this.icon, this.title, this.subtitle);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: const Color(0xFF4313B8), size: 14),
        const SizedBox(width: 4),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 8,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
            ),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 7, color: Color(0xFF64748B)),
            ),
          ],
        ),
      ],
    );
  }
}
