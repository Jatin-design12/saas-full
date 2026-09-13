import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../../../../core/widgets/app_sidebar_drawer.dart';
import '../../../kyc/presentation/screens/kyc_screen.dart';
import 'rent_ev_screen.dart';
import 'vehicle_details_screen.dart';
import 'vehicle_model_list_screen.dart';
import 'select_location_screen.dart';
import 'select_date_time_screen.dart';
import '../../../notifications/presentation/screens/notification_screen.dart';
import '../../../rides/presentation/screen/ride_history_screen.dart';
import '../../../wallet/presentation/screens/wallet_screen.dart';
import '../../../wallet/data/services/wallet_service.dart';
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
  bool hasActiveRide = false;
  bool hasBookedRide = false;
  Map<String, dynamic>? activeBooking;
  int totalRidesCount = 0;
  double co2SavedKg = 0.0;
  double cleanEnergyKwh = 0.0;
  String selectedLocation = "Gotri Zone, Vadodara";
  late PageController _pageController;
  Timer? _carouselTimer;

  late PageController _fleetPageController;
  int _currentFleetIndex = 0;

  final List<String> _carouselBanners = [
    "assets/Rakshabandhan.png",
    "assets/offer.png",
    "assets/Rent EV.png",
    "assets/Ride More.png",
  ];

  final List<Map<String, dynamic>> _evFleet = [
    {
      "name": "EverRide Lite",
      "tagline": "Light. Smart. Everyday.",
      "category": "E-Bike",
      "tagColor": const Color(0xFFDBEAFE),
      "tagTextColor": const Color(0xFF1E40AF),
      "cardBg": const Color(0xFFEFF5FD),
      "sideCardBg": const Color(0xFFEFF5FD),
      "btnColor": const Color(0xFF55739E),
      "image": "assets/Fly.png",
      "range": "35–50 km",
      "speed": "25 km/h",
      "capacity": "1 Seat",
      "isFavorite": false,
    },
    {
      "name": "Evegah City",
      "tagline": "Smart. Silent. Sustainable.",
      "category": "E-Vehicle",
      "tagColor": const Color(0xFFF3E8FF),
      "tagTextColor": const Color(0xFF6B21A8),
      "cardBg": const Color(0xFFFFFFFF),
      "sideCardBg": const Color(0xFFFAF9FF),
      "btnColor": const Color(0xFF4F14E0),
      "image": "assets/city.png",
      "range": "80–100 km",
      "speed": "45 km/h",
      "capacity": "2 Seats",
      "isFavorite": false,
    },
    {
      "name": "Evegah Pro",
      "tagline": "Compact. Powerful.",
      "category": "E-Scooter",
      "tagColor": const Color(0xFFDCFCE7),
      "tagTextColor": const Color(0xFF15803D),
      "cardBg": const Color(0xFFEAF8EE),
      "sideCardBg": const Color(0xFFEAF8EE),
      "btnColor": const Color(0xFF22864E),
      "image": "assets/pro-1.png",
      "range": "10–12 km",
      "speed": "10 km/h",
      "capacity": "1 Seat",
      "isFavorite": false,
    },
    {
      "name": "EcoRide Plus",
      "tagline": "Pedal the Change.",
      "category": "E-Cycle",
      "tagColor": const Color(0xFFFFE4E6),
      "tagTextColor": const Color(0xFFBE123C),
      "cardBg": const Color(0xFFFDEFEF),
      "sideCardBg": const Color(0xFFFDEFEF),
      "btnColor": const Color(0xFFDE7067),
      "image": "assets/fly-1.png",
      "range": "60–80 km",
      "speed": "35 km/h",
      "capacity": "1 Seat",
      "isFavorite": false,
    },
  ];

  double _dashboardWalletBalance = 0.0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 0);
    _fleetPageController = PageController(viewportFraction: 0.68, initialPage: 1);
    _currentFleetIndex = 1;
    _startCarouselTimer();
    _loadBookingState();
    _fetchActiveBooking();
    _fetchAdminBanners();
    _fetchBackendVehicleModels();
    _fetchWalletBalance();
  }

  Future<void> _fetchBackendVehicleModels() async {
    final List<String> urls = [
      '${AppConstants.apiBaseUrl}/vehicles/models',
      if (kDebugMode) ...[
        'http://192.168.1.4:5000/api/vehicles/models',
        'http://localhost:5000/api/vehicles/models',
        'http://10.0.2.2:5000/api/vehicles/models',
      ]
    ];

    for (final url in urls) {
      try {
        final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 4));
        if (res.statusCode == 200) {
          final decoded = json.decode(res.body);
          final List list = decoded['data'] ?? [];
          if (list.isNotEmpty && mounted) {
            final List<Map<String, dynamic>> dynamicFleet = [];
            for (var item in list) {
              final String name = item['name'] ?? 'Evegah EV';
              final String category = item['category'] ?? 'E-Vehicle';
              final String tagline = item['tagline'] ?? 'Smart. Silent. Sustainable.';
              final String range = item['range'] ?? '80–100 km';
              final String speed = item['top_speed'] ?? '45 km/h';
              final String capacity = item['seating_capacity'] != null
                  ? "${item['seating_capacity']} Seats"
                  : (category.contains('Scooter') || category.contains('Cycle') || category.contains('Bike')
                      ? "1 Seat"
                      : "2 Seats");

              String img = "assets/city.png";
              final String rawImg = (item['main_image'] ?? item['image'] ?? '').toString().toLowerCase();
              if (rawImg.contains('pro') || name.toLowerCase().contains("pro") || category.toLowerCase().contains("scooter")) {
                img = "assets/pro-1.png";
              } else if (rawImg.contains('mink') || name.toLowerCase().contains("mink") || category.toLowerCase().contains("cargo")) {
                img = "assets/MINK-1.png";
              } else if (rawImg.contains('fly-1') || rawImg.contains('cycle') || name.toLowerCase().contains("eco") || category.toLowerCase().contains("cycle")) {
                img = "assets/fly-1.png";
              } else if (rawImg.contains('fly') || name.toLowerCase().contains("fly") || category.toLowerCase().contains("bike") || category.toLowerCase().contains("moped")) {
                img = "assets/Fly.png";
              } else if (rawImg.isNotEmpty && rawImg.startsWith('assets/')) {
                img = rawImg;
              }

              Color tagBg = const Color(0xFFF3E8FF);
              Color tagTextColor = const Color(0xFF6B21A8);
              Color sideBg = const Color(0xFFF8FAFC);
              List<Color> btnGradient = const [Color(0xFF4313B8), Color(0xFF310B96)];

              if (category.toLowerCase().contains("scooter")) {
                tagBg = const Color(0xFFDCFCE7);
                tagTextColor = const Color(0xFF15803D);
                sideBg = const Color(0xFFF0FDF4);
                btnGradient = const [Color(0xFF16A34A), Color(0xFF15803D)];
              } else if (category.toLowerCase().contains("bike") || category.toLowerCase().contains("moped")) {
                tagBg = const Color(0xFFE0F2FE);
                tagTextColor = const Color(0xFF0369A1);
                sideBg = const Color(0xFFF0F9FF);
                btnGradient = const [Color(0xFF0284C7), Color(0xFF0369A1)];
              } else if (category.toLowerCase().contains("cycle")) {
                tagBg = const Color(0xFFFFEDD5);
                tagTextColor = const Color(0xFFC2410C);
                sideBg = const Color(0xFFFFF7ED);
                btnGradient = const [Color(0xFFEA580C), Color(0xFFC2410C)];
              }

              dynamicFleet.add({
                "name": name,
                "tagline": tagline,
                "category": category,
                "tagColor": tagBg,
                "tagTextColor": tagTextColor,
                "cardBg": const Color(0xFFFFFFFF),
                "sideCardBg": sideBg,
                "btnGradient": btnGradient,
                "image": img,
                "range": range,
                "speed": speed,
                "capacity": capacity,
                "features": ["👥 $capacity", "🔒 Smart Lock"],
                "isFavorite": false,
              });
            }

            setState(() {
              _evFleet.clear();
              _evFleet.addAll(dynamicFleet);
            });
            break;
          }
        }
      } catch (e) {
        debugPrint("Error loading fleet models from backend: $e");
      }
    }
  }

  Future<void> _fetchWalletBalance() async {
    final loggedIn = await SessionService().isLoggedIn();
    final mobile = await SessionService().getUserMobile();
    if (!loggedIn || mobile == null || mobile.trim().isEmpty) {
      if (mounted) {
        setState(() {
          _dashboardWalletBalance = 0.0;
        });
      }
      return;
    }

    final balMap = await WalletService().fetchWalletBalance();
    if (mounted) {
      setState(() {
        _dashboardWalletBalance = balMap['main'] ?? 0.0;
      });
    }
  }

  Future<void> _fetchAdminBanners() async {
    final List<String> urls = [
      '${AppConstants.apiBaseUrl}/banners',
      if (kDebugMode) ...[
        'http://192.168.1.4:5000/api/banners',
        'http://localhost:5000/api/banners',
        'http://10.0.2.2:5000/api/banners',
      ]
    ];

    for (final url in urls) {
      try {
        final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 5));
        if (res.statusCode == 200) {
          final data = json.decode(res.body);
          List<String> remoteBanners = [];
          if (data is List) {
            for (var item in data) {
              if (item is String) remoteBanners.add(item);
              else if (item is Map) {
                final img = item['image_url'] ?? item['image'] ?? item['url'] ?? item['banner_url'];
                if (img != null && img.toString().isNotEmpty) {
                  remoteBanners.add(img.toString());
                }
              }
            }
          } else if (data is Map && data['data'] != null) {
            final List list = data['data'];
            for (var item in list) {
              if (item is String) remoteBanners.add(item);
              else if (item is Map) {
                final img = item['image_url'] ?? item['image'] ?? item['url'] ?? item['banner_url'];
                if (img != null && img.toString().isNotEmpty) {
                  remoteBanners.add(img.toString());
                }
              }
            }
          }

          if (remoteBanners.isNotEmpty && mounted) {
            setState(() {
              _carouselBanners.clear();
              _carouselBanners.addAll(remoteBanners);
            });
            break;
          }
        }
      } catch (e) {
        debugPrint("Banner API info: $e");
      }
    }
  }

  @override
  void dispose() {
    _carouselTimer?.cancel();
    _pageController.dispose();
    _fleetPageController.dispose();
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
    final cleanMobile = mobile.replaceAll(RegExp(r'\D'), '');
    final last10 = cleanMobile.length >= 10 ? cleanMobile.substring(cleanMobile.length - 10) : cleanMobile;

    final urls = [
      '${AppConstants.apiBaseUrl}/reservations?search=${Uri.encodeComponent(last10)}',
      if (kDebugMode) ...[
        'http://192.168.1.4:5000/api/reservations?search=${Uri.encodeComponent(last10)}',
        'http://localhost:5000/api/reservations?search=${Uri.encodeComponent(last10)}',
      ]
    ];

    for (final url in urls) {
      try {
        final response = await http
            .get(Uri.parse(url))
            .timeout(const Duration(seconds: 5));
        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          if (data['status'] == 'success' && data['data'] != null) {
            final List list = data['data'];
            final count = list.length;

            final active = list.firstWhere(
              (r) =>
                  r['status'] == 'Confirmed' ||
                  r['status'] == 'Ongoing' ||
                  r['status'] == 'In Progress' ||
                  r['status'] == 'Started',
              orElse: () => null,
            );

            if (mounted) {
              setState(() {
                totalRidesCount = count;
                co2SavedKg = count * 1.55;
                cleanEnergyKwh = count * 2.325;

                if (active != null) {
                  activeBooking = active;
                  hasActiveRide = (active['status'] == 'Ongoing' || active['status'] == 'In Progress' || active['status'] == 'Started' || active['status'] == 'Confirmed');
                } else {
                  activeBooking = null;
                  hasActiveRide = false;
                }
              });
            }
            return;
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
                            child: ValueListenableBuilder<String?>(
                              valueListenable: bleService.connectedDeviceName,
                              builder: (context, devName, _) {
                                return Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      devName ?? "Live Battery",
                                      style: const TextStyle(
                                        fontSize: 12.5,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF0F172A),
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    Text(
                                      isConnected
                                          ? "• Connected Live"
                                          : "• Preserved Offline",
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: isConnected
                                            ? const Color(0xFF16A34A)
                                            : const Color(0xFFD97706),
                                      ),
                                    ),
                                  ],
                                );
                              },
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
                              ValueListenableBuilder<double>(
                                valueListenable: bleService.batteryPercentage,
                                builder: (context, rawPct, _) {
                                  final displayPct = rawPct > 0 ? rawPct.toInt() : (isConnected ? 0 : 78);
                                  final rangeVal = (displayPct * 0.8).round();
                                  return Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "$displayPct%",
                                        style: const TextStyle(
                                          fontSize: 26,
                                          fontWeight: FontWeight.w900,
                                          color: Color(0xFF4313B8),
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        "Range ~ $rangeVal km",
                                        style: const TextStyle(
                                          fontSize: 10.5,
                                          color: Color(0xFF64748B),
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  );
                                },
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
                      const SizedBox(height: 8),

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

              // --- 3.5 ACTIVE RIDE TELEMETRY CARDS (ONLY DISPLAY WHEN RIDER HAS ACTIVE RIDE) ---
              if (hasActiveRide) ...[
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

              // --- 8. TRUST BADGES ROW ---
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

  // Header with Location Pill & Bell Icon (Border Removed)
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
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.03),
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
                    Flexible(
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

  // Safe Image Banner Loader (Handles Casing & Network Admin Banners)
  Widget _buildSafeBannerImage(String path, {BoxFit fit = BoxFit.cover}) {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return Image.network(
        path,
        fit: fit,
        errorBuilder: (context, error, stackTrace) => _buildFallbackBanner(),
      );
    }

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
          errorBuilder: (context, error2, stackTrace2) => _buildFallbackBanner(),
        );
      },
    );
  }

  Widget _buildFallbackBanner() {
    return Container(
      color: const Color(0xFF200F54),
      alignment: Alignment.center,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Text(
            "EVEGAH EV RENTALS",
            style: TextStyle(
              color: Color(0xFF8CE600),
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 4),
          Text(
            "Ride More, Save More • Smart EV Mobility",
            style: TextStyle(color: Colors.white70, fontSize: 10),
          ),
        ],
      ),
    );
  }

  // Hero Carousel Slider
  Widget _buildHeroCarousel() {
    return Column(
      children: [
        SizedBox(
          height: 195,
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
        const SizedBox(height: 10),
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

  // Quick Actions Section (Single Box Container)
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
        Container(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
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
            mainAxisAlignment: MainAxisAlignment.spaceAround,
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
                subtitle: "₹${_dashboardWalletBalance.toStringAsFixed(2)}",
                bgColor: const Color(0xFFF5F3FF),
                iconColor: const Color(0xFF4313B8),
                onTap: () async {
                  await Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const WalletScreen()),
                  );
                  _fetchWalletBalance();
                },
              ),
            ],
          ),
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
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
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
    );
  }

  // Choose Your Rental Section (Clean Solid Colors with 3D Cutout Scooter Graphics)
  Widget _buildChooseYourRentalSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Choose Your Rental",
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 198,
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            clipBehavior: Clip.none,
            child: Row(
              children: [
                const SizedBox(width: 4),

                // Card 1: Daily Drive (3D tilted)
                _build3DRentalCard(
                  rotationAngle: 0.045,
                  title: "Daily Drive",
                  titleColor: const Color(0xFF0F172A),
                  subtitle: "24+ Hours",
                  desc: "Perfect for short\ndaily rides",
                  bgColor: const Color(0xFFF4F0FF),
                  btnColor: const Color(0xFF4313B8),
                  shadowColor: const Color(0xFF4313B8).withValues(alpha: 0.14),
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

                // Card 2: Monthly Drive
                _build3DRentalCard(
                  rotationAngle: 0.045,
                  title: "Monthly Drive",
                  titleColor: const Color(0xFF15803D),
                  subtitle: "30+ Days",
                  desc: "Best for regular\nriders",
                  bgColor: const Color(0xFFF0FDF4),
                  btnColor: const Color(0xFF16A34A),
                  shadowColor: const Color(0xFF16A34A).withValues(alpha: 0.14),
                  badgeIcon: Icons.card_giftcard_rounded,
                  badgeBg: const Color(0xFF16A34A),
                  image: "assets/mink-1.png",
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

                // Card 3: Weekday Pass
                _build3DRentalCard(
                  rotationAngle: 0.045,
                  title: "Weekday Pass",
                  titleColor: const Color(0xFFC2410C),
                  subtitle: "Mon to Fri\nUnlimited Kms",
                  desc: "Ride more for\nless",
                  bgColor: const Color(0xFFFFFBEB),
                  btnColor: const Color(0xFFEA580C),
                  shadowColor: const Color(0xFFEA580C).withValues(alpha: 0.14),
                  badgeIcon: Icons.percent_rounded,
                  badgeBg: const Color(0xFFEA580C),
                  image: "assets/city-white.png",
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
          width: 175,
          height: 185,
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
                        color: badgeBg.withValues(alpha: 0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(badgeIcon, color: Colors.white, size: 16),
                ),
              ),

              // 3D Scooter Graphic (Overflowing Bottom Right - ENLARGED)
              Positioned(
                bottom: -10,
                right: -10,
                width: 125,
                height: 115,
                child: Image.asset(
                  image,
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) => const Icon(
                    Icons.electric_scooter,
                    size: 55,
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
                        color: btnColor.withValues(alpha: 0.3),
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

  // ==========================================
  // CHOOSE YOUR EV RIDE SECTION (1000% MATCHED TO DESIGN)
  // ==========================================
  Widget _buildOurEvFleetSection() {
    final fleetList = _evFleet;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 1. Header: Choose Your EV Ride + View All Pill
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Choose Your EV Ride",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F172A),
                    letterSpacing: -0.4,
                  ),
                ),
                SizedBox(height: 3),
                Text(
                  "Clean Rides. Greener Tomorrows.",
                  style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
            InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const VehicleModelListScreen(),
                  ),
                );
              },
              borderRadius: BorderRadius.circular(20),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 7),
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F3FF),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFDDD6FE)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Text(
                      "View All",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF4313B8),
                      ),
                    ),
                    SizedBox(width: 4),
                    Icon(
                      Icons.chevron_right_rounded,
                      size: 16,
                      color: Color(0xFF4313B8),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: 14),

        // 2. Center-Elevated 3D Card Carousel (1000000% Pixel Perfect to media_1789287607711.png)
        if (fleetList.isEmpty)
          Container(
            height: 180,
            alignment: Alignment.center,
            child: const Text(
              "Loading fleet models...",
              style: TextStyle(color: Color(0xFF64748B), fontSize: 13),
            ),
          )
        else
          SizedBox(
            height: 385,
            child: PageView.builder(
              controller: _fleetPageController,
              clipBehavior: Clip.none,
              itemCount: fleetList.length,
              onPageChanged: (idx) {
                setState(() {
                  _currentFleetIndex = idx;
                });
              },
              itemBuilder: (context, index) {
                final item = fleetList[index];
                final isCenter = index == _currentFleetIndex;

                return AnimatedBuilder(
                  animation: _fleetPageController,
                  builder: (context, child) {
                    double pageOffset = index.toDouble();
                    if (_fleetPageController.hasClients && _fleetPageController.position.haveDimensions) {
                      pageOffset = (_fleetPageController.page ?? index.toDouble()) - index;
                    } else {
                      pageOffset = (_currentFleetIndex.toDouble()) - index;
                    }

                    final double scale = (1.0 - (pageOffset.abs() * 0.12)).clamp(0.86, 1.0);
                    final double opacity = (1.0 - (pageOffset.abs() * 0.18)).clamp(0.82, 1.0);

                    // True 3D perspective matrix matching reference media_1789287607711.png
                    final Matrix4 matrix = Matrix4.identity()
                      ..setEntry(3, 2, 0.0014) // 3D depth perspective
                      ..rotateY(pageOffset * -0.16) // 3D Y-axis angle toward center
                      ..setTranslationRaw(-pageOffset * 16.0, 0.0, 0.0); // Smooth horizontal tuck

                    return Transform(
                      transform: matrix,
                      alignment: Alignment.center,
                      child: Transform.scale(
                        scale: scale,
                        child: Opacity(
                          opacity: opacity,
                          child: _buildExactFleetCard(
                            item: item,
                            isCenter: isCenter,
                            onDetailsTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => VehicleDetailsScreen(
                                    vehicleId: item["name"]?.toString() ?? "Evegah City",
                                    modelName: item["name"]?.toString() ?? "Evegah City",
                                  ),
                                ),
                              );
                            },
                            onBookTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => const RentEvScreen(),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),

        const SizedBox(height: 12),

        // 3. Page Indicator Dots
        if (fleetList.length > 1)
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              fleetList.length,
              (dotIdx) => AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.symmetric(horizontal: 3),
                width: _currentFleetIndex == dotIdx ? 18 : 6,
                height: 5,
                decoration: BoxDecoration(
                  color: _currentFleetIndex == dotIdx
                      ? const Color(0xFF4313B8)
                      : const Color(0xFFCBD5E1),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
          ),
      ],
    );
  }

  // Exact Card Builder Matching Reference Design media_1789287607711.png 1000%
  Widget _buildExactFleetCard({
    required Map<String, dynamic> item,
    required bool isCenter,
    required VoidCallback onDetailsTap,
    required VoidCallback onBookTap,
  }) {
    final Color cardBackground = isCenter
        ? const Color(0xFFFFFFFF)
        : (item["cardBg"] as Color? ?? const Color(0xFFF8FAFC));

    final Color tagColor = item["tagColor"] as Color? ?? const Color(0xFFF3E8FF);
    final Color tagTextColor = item["tagTextColor"] as Color? ?? const Color(0xFF6B21A8);
    final Color btnColor = item["btnColor"] as Color? ?? const Color(0xFF4313B8);
    final String name = item["name"] ?? "Evegah City";
    final String tagline = item["tagline"] ?? "Smart. Silent. Sustainable.";
    final String category = item["category"] ?? "E-Vehicle";
    final String imagePath = item["image"] ?? "assets/city.png";
    final String range = item["range"] ?? "80–100 km";
    final String speed = item["speed"] ?? "45 km/h";
    final String capacity = item["capacity"] ?? "2 Seats";
    final bool isFavorite = item["isFavorite"] == true;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
      decoration: BoxDecoration(
        color: cardBackground,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isCenter ? const Color(0xFFE9D5FF).withValues(alpha: 0.8) : Colors.white.withValues(alpha: 0.9),
          width: isCenter ? 1.5 : 1.2,
        ),
        boxShadow: isCenter
            ? [
                BoxShadow(
                  color: const Color(0xFF4313B8).withValues(alpha: 0.14),
                  blurRadius: 24,
                  spreadRadius: 2,
                  offset: const Offset(0, 10),
                ),
                BoxShadow(
                  color: Colors.white.withValues(alpha: 0.9),
                  blurRadius: 6,
                  offset: const Offset(0, -2),
                ),
              ]
            : [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 12,
                  offset: const Offset(0, 5),
                ),
              ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(23),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Row: Category Badge Pill + (Heart Favorite on Center Card)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 5),
                    decoration: BoxDecoration(
                      color: tagColor,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      category,
                      style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w700,
                        color: tagTextColor,
                        letterSpacing: -0.1,
                      ),
                    ),
                  ),
                  if (isCenter)
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          item["isFavorite"] = !isFavorite;
                        });
                      },
                      child: Container(
                        width: 34,
                        height: 34,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xFFF1F5F9)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.06),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Icon(
                          isFavorite ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                          size: 18,
                          color: isFavorite ? const Color(0xFFE11D48) : const Color(0xFF0F172A),
                        ),
                      ),
                    )
                  else
                    const SizedBox(height: 34),
                ],
              ),

              const SizedBox(height: 6),

              // Title & Subtitle Tagline
              Text(
                name,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: isCenter ? 18 : 16.5,
                  fontWeight: FontWeight.w800,
                  color: const Color(0xFF0F172A),
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                tagline,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF64748B),
                ),
              ),

              // Transparent Vehicle Stage with Realistic Soft Floor Shadow
              Expanded(
                child: Center(
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Floor Shadow Ellipse
                      Positioned(
                        bottom: 4,
                        child: Container(
                          width: 125,
                          height: 14,
                          decoration: BoxDecoration(
                            borderRadius: const BorderRadius.all(Radius.elliptical(125, 14)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.16),
                                blurRadius: 16,
                                spreadRadius: 2,
                              ),
                            ],
                          ),
                        ),
                      ),
                      // Background-Removed Vehicle PNG
                      GestureDetector(
                        onTap: isCenter ? onBookTap : onDetailsTap,
                        child: Image.asset(
                          imagePath,
                          fit: BoxFit.contain,
                          alignment: Alignment.center,
                          filterQuality: FilterQuality.high,
                          errorBuilder: (context, error, stackTrace) => const Icon(
                            Icons.electric_moped_rounded,
                            size: 65,
                            color: Color(0xFF4313B8),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Spec Row: 3 columns for center card, 2 columns for side cards (per media_1789287607711.png)
              Container(
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
                decoration: BoxDecoration(
                  color: isCenter ? const Color(0xFFF8FAFC) : Colors.white.withValues(alpha: 0.8),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFF1F5F9)),
                ),
                child: Row(
                  children: [
                    // Spec 1: Range
                    Expanded(
                      child: _buildDesignSpecItem(
                        icon: Icons.bolt_rounded,
                        iconColor: isCenter ? const Color(0xFF4F14E0) : btnColor,
                        value: range,
                        label: "Range",
                      ),
                    ),
                    Container(width: 1, height: 24, color: const Color(0xFFE2E8F0)),
                    // Spec 2: Top Speed
                    Expanded(
                      child: _buildDesignSpecItem(
                        icon: Icons.speed_rounded,
                        iconColor: isCenter ? const Color(0xFF2563EB) : btnColor,
                        value: speed,
                        label: "Top Speed",
                      ),
                    ),
                    if (isCenter) ...[
                      Container(width: 1, height: 24, color: const Color(0xFFE2E8F0)),
                      // Spec 3: Capacity (Center Card Only)
                      Expanded(
                        child: _buildDesignSpecItem(
                          icon: Icons.people_alt_rounded,
                          iconColor: const Color(0xFF7C3AED),
                          value: capacity,
                          label: "Capacity",
                        ),
                      ),
                    ],
                  ],
                ),
              ),

              const SizedBox(height: 10),

              // Action Button: Book This Ride for Center, View Details for Side Cards
              InkWell(
                onTap: isCenter ? onBookTap : onDetailsTap,
                borderRadius: BorderRadius.circular(25),
                child: Container(
                  width: double.infinity,
                  height: 40,
                  decoration: BoxDecoration(
                    gradient: isCenter
                        ? const LinearGradient(
                            colors: [Color(0xFF4F14E0), Color(0xFF380BAA)],
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                          )
                        : null,
                    color: isCenter ? null : btnColor,
                    borderRadius: BorderRadius.circular(25),
                    boxShadow: [
                      BoxShadow(
                        color: (isCenter ? const Color(0xFF4F14E0) : btnColor).withValues(alpha: 0.28),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        isCenter ? "Book This Ride" : "View Details",
                        style: const TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                          letterSpacing: -0.1,
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Icon(
                        Icons.arrow_forward_rounded,
                        size: 15,
                        color: Colors.white,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDesignSpecItem({
    required IconData icon,
    required Color iconColor,
    required String value,
    required String label,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: iconColor),
        const SizedBox(height: 2),
        Text(
          value,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 1),
        Text(
          label,
          style: const TextStyle(
            fontSize: 8,
            fontWeight: FontWeight.w500,
            color: Color(0xFF64748B),
          ),
        ),
      ],
    );
  }

  // Environmental Impact Bar (Light Theme Eco Card)
  Widget _buildEnvironmentalImpactBar() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDF4),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFBBF7D0)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF16A34A).withValues(alpha: 0.08),
            blurRadius: 16,
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
              Row(
                children: const [
                  Icon(Icons.park_rounded, color: Color(0xFF15803D), size: 20),
                  SizedBox(width: 8),
                  Text(
                    "Your Green Impact",
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF14532D),
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFDCFCE7),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF86EFAC)),
                ),
                child: const Text(
                  "🌱 THIS MONTH",
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF15803D),
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: _buildEcoMetricItem(
                  icon: Icons.eco_rounded,
                  value: "${co2SavedKg.toStringAsFixed(1)} kg",
                  label: "CO₂ Saved",
                  color: const Color(0xFF16A34A),
                ),
              ),
              Container(width: 1, height: 32, color: const Color(0xFFBBF7D0)),
              Expanded(
                child: _buildEcoMetricItem(
                  icon: Icons.electric_scooter_rounded,
                  value: "$totalRidesCount Rides",
                  label: "Zero Emission",
                  color: const Color(0xFF15803D),
                ),
              ),
              Container(width: 1, height: 32, color: const Color(0xFFBBF7D0)),
              Expanded(
                child: _buildEcoMetricItem(
                  icon: Icons.bolt_rounded,
                  value: "${cleanEnergyKwh.toStringAsFixed(1)} kWh",
                  label: "Clean Energy",
                  color: const Color(0xFFD97706),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEcoMetricItem({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
  }) {
    return Column(
      children: [
        Icon(icon, color: color, size: 18),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w900,
            color: Color(0xFF14532D),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(
            fontSize: 9,
            color: Color(0xFF166534),
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  // 4 Value Proposition Badges (1000% Matched to Screenshot)
  Widget _buildTrustBadgesRow() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
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
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: const [
          _ScreenshotFeatureBadge(
            icon: Icons.eco_rounded,
            circleBg: Color(0xFFDCFCE7),
            iconColor: Color(0xFF16A34A),
            title: "Eco Friendly",
            subtitle: "Zero Emission",
          ),
          _ScreenshotFeatureBadge(
            icon: Icons.account_balance_wallet_rounded,
            circleBg: Color(0xFFEDE9FE),
            iconColor: Color(0xFF7C3AED),
            title: "Affordable",
            subtitle: "Save More",
          ),
          _ScreenshotFeatureBadge(
            icon: Icons.verified_user_rounded,
            circleBg: Color(0xFFFEF3C7),
            iconColor: Color(0xFFD97706),
            title: "Safe & Reliable",
            subtitle: "Ride with Confidence",
          ),
          _ScreenshotFeatureBadge(
            icon: Icons.public_rounded,
            circleBg: Color(0xFFDBEAFE),
            iconColor: Color(0xFF2563EB),
            title: "Sustainable",
            subtitle: "A Cleaner Tomorrow",
          ),
        ],
      ),
    );
  }
}

// 4 Circular Feature Badges Matching Screenshot
class _ScreenshotFeatureBadge extends StatelessWidget {
  final IconData icon;
  final Color circleBg;
  final Color iconColor;
  final String title;
  final String subtitle;

  const _ScreenshotFeatureBadge({
    required this.icon,
    required this.circleBg,
    required this.iconColor,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: circleBg,
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            size: 24,
            color: iconColor,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          subtitle,
          style: const TextStyle(
            fontSize: 8.5,
            color: Color(0xFF64748B),
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
