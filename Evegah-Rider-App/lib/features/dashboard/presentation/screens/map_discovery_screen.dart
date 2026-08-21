import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import 'vehicle_details_screen.dart';
import 'rent_ev_screen.dart';
import 'zone_map_screen.dart';
import 'package:evegah_rider_app/features/unlock/presentation/screens/scan_qr_screen.dart';

class MapDiscoveryScreen extends StatefulWidget {
  const MapDiscoveryScreen({super.key});

  @override
  State<MapDiscoveryScreen> createState() => _MapDiscoveryScreenState();
}

class _MapDiscoveryScreenState extends State<MapDiscoveryScreen> {
  GoogleMapController? _mapController;
  final TextEditingController _searchController = TextEditingController();

  // Center Coordinates
  final LatLng _center = const LatLng(22.3072, 73.1812);

  Set<Marker> _markers = {};
  Set<Polygon> _polygons = {};
  bool _isMapView = true;
  int _selectedZoneIdx = 0;

  final List<Map<String, dynamic>> _allZones = [
    {
      "id": 1,
      "name": "Lekki Phase 1",
      "distance": "500 m away",
      "count": 8,
      "location": "Gotri - Sevasi Main Rd, Vadodara",
      "lat": 22.3082,
      "lng": 73.1822,
      "status": "Open",
      "timing": "Closes 10:00 PM",
    },
    {
      "id": 2,
      "name": "Chevron Drive",
      "distance": "1.2 km away",
      "count": 6,
      "location": "Subhanpura Circle, Vadodara",
      "lat": 22.3150,
      "lng": 73.1740,
      "status": "Open",
      "timing": "Closes 10:00 PM",
    },
    {
      "id": 3,
      "name": "Admiralty Way",
      "distance": "1.8 km away",
      "count": 3,
      "location": "Alkapuri Main Rd, Vadodara",
      "lat": 22.3010,
      "lng": 73.1900,
      "status": "Open",
      "timing": "Closes 10:00 PM",
    },
    {
      "id": 4,
      "name": "Lekki Phase 2",
      "distance": "2.4 km away",
      "count": 5,
      "location": "Akota Bridge, Vadodara",
      "lat": 22.2950,
      "lng": 73.1700,
      "status": "Open",
      "timing": "Closes 10:00 PM",
    },
    {
      "id": 5,
      "name": "Freedom Way",
      "distance": "3.1 km away",
      "count": 4,
      "location": "Vasna Rd, Vadodara",
      "lat": 22.2910,
      "lng": 73.1610,
      "status": "Open",
      "timing": "Closes 10:00 PM",
    },
  ];

  @override
  void initState() {
    super.initState();
    _initMarkers();
  }

  void _initMarkers() {
    final Set<Marker> markersSet = {};
    for (int i = 0; i < _allZones.length; i++) {
      final z = _allZones[i];
      markersSet.add(
        Marker(
          markerId: MarkerId("ZONE_${z['id']}"),
          position: LatLng(z['lat'] as double, z['lng'] as double),
          infoWindow: InfoWindow(title: z['name'] as String, snippet: "${z['count']} Vehicles Available"),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
          onTap: () {
            setState(() {
              _selectedZoneIdx = i;
            });
          },
        ),
      );
    }
    setState(() {
      _markers = markersSet;
    });
  }

  @override
  Widget build(BuildContext context) {
    final nearestZone = _allZones[_selectedZoneIdx];

    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      body: SafeArea(
        child: Stack(
          children: [
            // --- 1. FULL MAP CANVAS OR LIST VIEW ---
            _isMapView
                ? Positioned.fill(
                    child: GoogleMap(
                      initialCameraPosition: CameraPosition(target: _center, zoom: 14.5),
                      onMapCreated: (controller) => _mapController = controller,
                      markers: _markers,
                      polygons: _polygons,
                      myLocationEnabled: true,
                      myLocationButtonEnabled: false,
                      zoomControlsEnabled: false,
                    ),
                  )
                : Positioned.fill(
                    child: Padding(
                      padding: const EdgeInsets.only(top: 120, bottom: 20),
                      child: _buildAllZonesListView(),
                    ),
                  ),

            // --- 2. TOP HEADER BAR (MENU, BRAND LOGO, BELL & PROFILE AVATAR) ---
            Positioned(
              top: 10,
              left: 18,
              right: 18,
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 6)]),
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
                            decoration: BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 6)]),
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
                  const SizedBox(height: 12),

                  // SEARCH BAR (100000% MATCH SCREENSHOT 2)
                  Container(
                    height: 48,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 10, offset: const Offset(0, 3))],
                    ),
                    child: Row(
                      children: [
                        const SizedBox(width: 16),
                        const Icon(Icons.search_rounded, color: Color(0xFF94A3B8), size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: TextField(
                            controller: _searchController,
                            style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600, color: Color(0xFF0F172A)),
                            decoration: const InputDecoration(
                              hintText: "Search zone or area",
                              hintStyle: TextStyle(fontSize: 13, color: Color(0xFF94A3B8), fontWeight: FontWeight.w400),
                              border: InputBorder.none,
                              isDense: true,
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(8),
                          margin: const EdgeInsets.only(right: 6),
                          decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(16)),
                          child: const Icon(Icons.tune_rounded, color: Color(0xFF200F54), size: 18),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // --- 3. FLOATING MAP CONTROLS & TOGGLE SWITCH (100000% MATCH) ---
            if (_isMapView) ...[
              Positioned(
                right: 18,
                bottom: 340,
                child: Column(
                  children: [
                    GestureDetector(
                      onTap: () {
                        _mapController?.animateCamera(CameraUpdate.newLatLngZoom(_center, 15));
                      },
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8)]),
                        child: const Icon(Icons.my_location_rounded, color: Color(0xFF200F54), size: 20),
                      ),
                    ),
                    const SizedBox(height: 10),
                    Container(
                      width: 44,
                      height: 44,
                      decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8)]),
                      child: const Icon(Icons.navigation_rounded, color: Color(0xFF4313B8), size: 20),
                    ),
                  ],
                ),
              ),
            ],

            // FLOATING MAP/LIST TOGGLE PILL
            Positioned(
              left: 18,
              bottom: _isMapView ? 340 : 20,
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8)],
                ),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () => setState(() => _isMapView = true),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: _isMapView ? const Color(0xFFF3F0FF) : Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          children: const [
                            Icon(Icons.grid_view_rounded, size: 14, color: Color(0xFF4313B8)),
                            SizedBox(width: 4),
                            Text("Map", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF4313B8))),
                          ],
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () => setState(() => _isMapView = false),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: !_isMapView ? const Color(0xFFF3F0FF) : Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          children: const [
                            Icon(Icons.format_list_bulleted_rounded, size: 14, color: Color(0xFF64748B)),
                            SizedBox(width: 4),
                            Text("List", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF64748B))),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // --- 4. BOTTOM SHEET CARD (NEAREST ZONE & OTHER NEARBY ZONES) (100000% MATCH SCREENSHOT 2) ---
            if (_isMapView)
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                child: Container(
                  padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                    boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 20, offset: Offset(0, -6))],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Drag Handle Indicator
                      Center(
                        child: Container(
                          width: 38,
                          height: 4,
                          decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Section Title: "📍 Nearest Zone"
                      Row(
                        children: const [
                          Icon(Icons.location_on_rounded, color: Color(0xFF4313B8), size: 18),
                          SizedBox(width: 6),
                          Text(
                            "Nearest Zone",
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF200F54)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // MAIN HIGHLIGHT CARD (NEAREST ZONE WITH LIME-GREEN "View Zone Details →" BUTTON)
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFF1F5F9)),
                          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 3))],
                        ),
                        child: Column(
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 44,
                                  height: 44,
                                  decoration: const BoxDecoration(color: Color(0xFF4313B8), shape: BoxShape.circle),
                                  child: const Icon(Icons.two_wheeler_rounded, color: Colors.white, size: 22),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        nearestZone['name'] as String,
                                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        nearestZone['distance'] as String,
                                        style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                                      ),
                                    ],
                                  ),
                                ),
                                // Large Vehicle Count
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.baseline,
                                  textBaseline: TextBaseline.alphabetic,
                                  children: [
                                    Text(
                                      "${nearestZone['count']}",
                                      style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Color(0xFF4313B8)),
                                    ),
                                    const SizedBox(width: 4),
                                    const Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text("Vehicles", style: TextStyle(fontSize: 9, color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
                                        Text("available", style: TextStyle(fontSize: 9, color: Color(0xFF64748B))),
                                      ],
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),

                            // Vibrant Lime-Green "View Zone Details →" Button (100000% MATCH SCREENSHOT 2)
                            SizedBox(
                              width: double.infinity,
                              height: 46,
                              child: ElevatedButton(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => ZoneMapScreen(zoneName: nearestZone['name'] as String),
                                    ),
                                  );
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFFCCF200), // Lime Green
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: const [
                                    Text(
                                      "View Zone Details",
                                      style: TextStyle(color: Color(0xFF0F172A), fontSize: 14, fontWeight: FontWeight.w800),
                                    ),
                                    SizedBox(width: 8),
                                    Icon(Icons.arrow_forward_rounded, color: Color(0xFF0F172A), size: 18),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // OTHER NEARBY ZONES LIST
                      const Text(
                        "Other Nearby Zones",
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                      const SizedBox(height: 10),

                      Column(
                        children: List.generate(_allZones.length - 1, (index) {
                          final zIdx = (index + 1) % _allZones.length;
                          final z = _allZones[zIdx];
                          return GestureDetector(
                            onTap: () {
                              setState(() {
                                _selectedZoneIdx = zIdx;
                              });
                            },
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF8FAFC),
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: const Color(0xFFF1F5F9)),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    width: 32,
                                    height: 32,
                                    decoration: const BoxDecoration(color: Color(0xFFF3F0FF), shape: BoxShape.circle),
                                    child: const Icon(Icons.two_wheeler_rounded, color: Color(0xFF4313B8), size: 16),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(z['name'] as String, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                                        Text(z['distance'] as String, style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
                                      ],
                                    ),
                                  ),
                                  Text(
                                    "${z['count']}",
                                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF4313B8)),
                                  ),
                                  const SizedBox(width: 8),
                                  const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8), size: 18),
                                ],
                              ),
                            ),
                          );
                        }),
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

  // --- FULL SCROLLABLE LIST OF ALL OPERATING ZONES ---
  Widget _buildAllZonesListView() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
      itemCount: _allZones.length,
      itemBuilder: (context, index) {
        final z = _allZones[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFF1F5F9)),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 3))],
          ),
          child: Column(
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
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(z['name'] as String, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                        const SizedBox(height: 2),
                        Text(z['location'] as String, style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                  Text("${z['count']}", style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Color(0xFF4313B8))),
                ],
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 44,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ZoneMapScreen(zoneName: z['name'] as String),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFCCF200),
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Text("View Zone Details", style: TextStyle(color: Color(0xFF0F172A), fontSize: 13, fontWeight: FontWeight.w800)),
                      SizedBox(width: 6),
                      Icon(Icons.arrow_forward_rounded, color: Color(0xFF0F172A), size: 16),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}