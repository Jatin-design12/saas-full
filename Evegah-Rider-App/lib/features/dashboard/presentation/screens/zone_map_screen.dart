import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import 'rent_ev_screen.dart';
import '../../../auth/presentation/screens/login_screen.dart';
import '../../../../core/services/session_service.dart';

class ZoneMapScreen extends StatefulWidget {
  final String zoneName;
  const ZoneMapScreen({super.key, this.zoneName = "Lekki Phase 1"});

  @override
  State<ZoneMapScreen> createState() => _ZoneMapScreenState();
}

class _ZoneMapScreenState extends State<ZoneMapScreen> {
  GoogleMapController? _mapController;
  final LatLng _zoneCenter = const LatLng(22.3072, 73.1812);

  Set<Polygon> _polygons = {};
  Set<Marker> _markers = {};

  final List<Map<String, dynamic>> _availableVehicles = [
    {
      "name": "E-Scooter",
      "range": "60 km",
      "battery": "80%",
      "price": "₹250",
      "unit": "/ 30 min",
      "image": "assets/Fly.png",
    },
    {
      "name": "E-Bike",
      "range": "80 km",
      "battery": "85%",
      "price": "₹400",
      "unit": "/ 30 min",
      "image": "assets/MINK-1.png",
    },
    {
      "name": "E-Scooter Pro",
      "range": "70 km",
      "battery": "90%",
      "price": "₹300",
      "unit": "/ 30 min",
      "image": "assets/black_scooter_city.png",
    },
  ];

  BitmapDescriptor? _zoneCustomIcon;

  @override
  void initState() {
    super.initState();
    _loadCustomZoneAsset();
    _initZoneMap();
    _fetchBackendZoneData();
  }

  Future<void> _loadCustomZoneAsset() async {
    try {
      final icon = await BitmapDescriptor.fromAssetImage(
        const ImageConfiguration(size: Size(40, 40)),
        'assets/evegah-zone-1.png',
      );
      if (mounted) {
        setState(() {
          _zoneCustomIcon = icon;
          _initZoneMap();
        });
      }
    } catch (e) {
      debugPrint("Zone map custom asset error: $e");
    }
  }

  Future<void> _fetchBackendZoneData() async {
    try {
      final res = await http.get(Uri.parse(AppConstants.getLiveZones)).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        if (data['status'] == 'success' && data['data'] != null) {
          final List list = data['data'];
          if (list.isNotEmpty) {
            final Set<Marker> newMarkers = {};
            for (int i = 0; i < list.length; i++) {
              final z = list[i];
              double lat = 22.3072;
              double lng = 73.1812;
              if (z['center'] != null) {
                lat = (z['center']['lat'] as num).toDouble();
                lng = (z['center']['lng'] as num).toDouble();
              }
              newMarkers.add(
                Marker(
                  markerId: MarkerId("BACKEND_ZONE_$i"),
                  position: LatLng(lat, lng),
                  icon: _zoneCustomIcon ?? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueViolet),
                  infoWindow: InfoWindow(
                    title: z['name'] ?? widget.zoneName,
                    snippet: "${z['bikeCount'] ?? 8} Vehicles Available • Backend Live",
                  ),
                ),
              );
            }
            if (mounted) {
              setState(() => _markers = newMarkers);
            }
          }
        }
      }
    } catch (e) {
      debugPrint("Zone map backend sync info: $e");
    }
  }

  void _initZoneMap() {
    // 1. Polygon Boundary (Operating Zone matching Image 3)
    final Set<Polygon> polygonSet = {
      Polygon(
        polygonId: const PolygonId("OPERATING_ZONE_1"),
        points: const [
          LatLng(22.3150, 73.1700),
          LatLng(22.3200, 73.1880),
          LatLng(22.3080, 73.2000),
          LatLng(22.2960, 73.1880),
          LatLng(22.2980, 73.1680),
          LatLng(22.3080, 73.1620),
          LatLng(22.3150, 73.1700),
        ],
        strokeColor: const Color(0xFF7C3AED),
        strokeWidth: 2,
        fillColor: const Color(0xFF7C3AED).withOpacity(0.14),
      ),
    };

    // 2. Zone Markers (using custom asset assets/evegah-zone-1.png or violet pins)
    final Set<Marker> markerSet = {
      Marker(
        markerId: const MarkerId("MARKER_1"),
        position: const LatLng(22.3130, 73.1820),
        icon: _zoneCustomIcon ?? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
        infoWindow: const InfoWindow(title: "Hub A - Subhanpura", snippet: "3 Scooters Available"),
      ),
      Marker(
        markerId: const MarkerId("MARKER_2"),
        position: const LatLng(22.3100, 73.1890),
        icon: _zoneCustomIcon ?? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
        infoWindow: const InfoWindow(title: "Hub B - Alkapuri", snippet: "2 Scooters Available"),
      ),
      Marker(
        markerId: const MarkerId("MARKER_3"),
        position: const LatLng(22.3040, 73.1800),
        icon: _zoneCustomIcon ?? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
        infoWindow: const InfoWindow(title: "Hub C - Gotri Road", snippet: "5 Scooters Available"),
      ),
      Marker(
        markerId: const MarkerId("MARKER_4"),
        position: const LatLng(22.3020, 73.1870),
        icon: _zoneCustomIcon ?? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
        infoWindow: const InfoWindow(title: "Hub D - Akota Circle", snippet: "8 Scooters Available"),
      ),
    };

    setState(() {
      _polygons = polygonSet;
      _markers = markerSet;
    });
  }

  Future<void> _handleBookNow() async {
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
      MaterialPageRoute(builder: (context) => const RentEvScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      body: SafeArea(
        child: Stack(
          children: [
            // --- 1. OPERATING ZONE MAP CANVAS ---
            Positioned.fill(
              child: GoogleMap(
                initialCameraPosition: CameraPosition(target: _zoneCenter, zoom: 14.5),
                onMapCreated: (controller) => _mapController = controller,
                polygons: _polygons,
                markers: _markers,
                myLocationEnabled: true,
                myLocationButtonEnabled: false,
                zoomControlsEnabled: false,
              ),
            ),

            // --- 2. TOP HEADER BAR (BACK BUTTON, LOGO, BELL & PROFILE AVATAR) (10000% MATCH SCREENSHOT 2) ---
            Positioned(
              top: 10,
              left: 16,
              right: 16,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      GestureDetector(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 6)],
                          ),
                          child: const Icon(Icons.arrow_back_rounded, color: Color(0xFF200F54), size: 20),
                        ),
                      ),
                      const SizedBox(width: 12),
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
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 6)],
                        ),
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
            ),

            // --- FLOATING MAP BUTTONS (SEARCH LEFT, FILTER RIGHT, CONTROLS RIGHT) ---
            Positioned(
              left: 16,
              top: 66,
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8)],
                ),
                child: const Icon(Icons.search_rounded, color: Color(0xFF200F54), size: 20),
              ),
            ),
            Positioned(
              right: 16,
              top: 66,
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8)],
                ),
                child: const Icon(Icons.tune_rounded, color: Color(0xFF200F54), size: 20),
              ),
            ),

            Positioned(
              right: 16,
              bottom: 480,
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
                ],
              ),
            ),

            // --- 3. BOTTOM SHEET CARD (100000% MATCH SCREENSHOT 2) ---
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
                  crossAxisAlignment: CrossAxisAlignment.start,
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

                    // A. Zone Header Row (Title, Sub-status line & Large Count 8)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: const BoxDecoration(color: Color(0xFF4313B8), shape: BoxShape.circle),
                              child: const Icon(Icons.two_wheeler_rounded, color: Colors.white, size: 22),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  widget.zoneName,
                                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                                ),
                                const SizedBox(height: 2),
                                const Text("500 m away", style: TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
                                const SizedBox(height: 4),
                                Row(
                                  children: const [
                                    Icon(Icons.circle, color: Color(0xFF16A34A), size: 8),
                                    SizedBox(width: 4),
                                    Text("Open  •  Closes 10:00 PM  |  ", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF16A34A))),
                                    Icon(Icons.info_outline_rounded, size: 10, color: Color(0xFF4313B8)),
                                    SizedBox(width: 2),
                                    Text("Zone rules", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF4313B8))),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                        // Large Vehicles Available Count (8)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFAFAFC),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: const Color(0xFFF1F5F9)),
                          ),
                          child: Column(
                            children: const [
                              Text(
                                "8",
                                style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Color(0xFF4313B8), height: 1.0),
                              ),
                              SizedBox(height: 2),
                              Text("Vehicles", style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                              Text("available", style: TextStyle(fontSize: 8.5, color: Color(0xFF64748B))),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // B. 4 Category Vehicle Counts Row (Scooters, Bikes, Cars, Parking spots)
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFAFAFC),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFF1F5F9)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildCategoryCount(Icons.electric_scooter_rounded, "Scooters", "6", const Color(0xFF4313B8)),
                          Container(height: 26, width: 1, color: const Color(0xFFE2E8F0)),
                          _buildCategoryCount(Icons.directions_bike_rounded, "Bikes", "2", const Color(0xFF8CE600)),
                          Container(height: 26, width: 1, color: const Color(0xFFE2E8F0)),
                          _buildCategoryCount(Icons.directions_car_rounded, "Cars", "0", const Color(0xFF4313B8)),
                          Container(height: 26, width: 1, color: const Color(0xFFE2E8F0)),
                          _buildCategoryCount(Icons.local_parking_rounded, "Parking spots", "12", const Color(0xFF4313B8)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

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
                                Text("Unlock exciting offers in this zone.", style: TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF0ECFB),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: const [
                                Text("View Offers", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF4313B8))),
                                SizedBox(width: 4),
                                Icon(Icons.arrow_forward_rounded, size: 12, color: Color(0xFF4313B8)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // D. Available Vehicles Section Header & Sort
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Text("Available Vehicles", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                        Row(
                          children: [
                            Text("Sort ", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF4313B8))),
                            Icon(Icons.swap_vert_rounded, size: 14, color: Color(0xFF4313B8)),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    // E. Vehicle Cards List (100000% MATCH SCREENSHOT 2)
                    Column(
                      children: _availableVehicles.map((v) {
                        return Container(
                          margin: const EdgeInsets.only(bottom: 10),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: const Color(0xFFF1F5F9)),
                            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 8, offset: const Offset(0, 2))],
                          ),
                          child: Row(
                            children: [
                              // Vehicle Photo
                              Container(
                                width: 64,
                                height: 50,
                                padding: const EdgeInsets.all(4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFAFAFC),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Image.asset(
                                  v['image'] as String,
                                  fit: BoxFit.contain,
                                  errorBuilder: (_, __, ___) => const Icon(Icons.electric_scooter_rounded, color: Color(0xFF4313B8)),
                                ),
                              ),
                              const SizedBox(width: 12),

                              // Name & Battery Stats
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      v['name'] as String,
                                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                                    ),
                                    const SizedBox(height: 4),
                                    Row(
                                      children: [
                                        Text("Range: ${v['range']}", style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                                        const SizedBox(width: 8),
                                        Text("Battery: ${v['battery']}", style: const TextStyle(fontSize: 10, color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ],
                                ),
                              ),

                              // Price & Lime Green Book Now Button (100000% MATCH)
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  RichText(
                                    text: TextSpan(
                                      children: [
                                        TextSpan(
                                          text: v['price'] as String,
                                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                                        ),
                                        TextSpan(
                                          text: " ${v['unit']}",
                                          style: const TextStyle(fontSize: 9, color: Color(0xFF64748B)),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  SizedBox(
                                    height: 32,
                                    child: ElevatedButton(
                                      onPressed: _handleBookNow,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: const Color(0xFFCCF200), // Vibrant Lime Green
                                        elevation: 0,
                                        padding: const EdgeInsets.symmetric(horizontal: 14),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                      ),
                                      child: const Text(
                                        "Book Now",
                                        style: TextStyle(color: Color(0xFF0F172A), fontSize: 11.5, fontWeight: FontWeight.w800),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      }).toList(),
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

  Widget _buildCategoryCount(IconData icon, String label, String count, Color iconColor) {
    return Column(
      children: [
        Icon(icon, color: iconColor, size: 18),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 9, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
        const SizedBox(height: 1),
        Text(count, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
      ],
    );
  }
}
