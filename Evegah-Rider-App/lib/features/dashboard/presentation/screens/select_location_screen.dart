import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:geolocator/geolocator.dart';
import '../../../../core/services/franchise_service.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/google_places_service.dart';
import 'zone_map_screen.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class SelectLocationScreen extends StatefulWidget {
  final String currentCity;
  final Function(dynamic) onLocationSelected;

  const SelectLocationScreen({
    super.key,
    required this.currentCity,
    required this.onLocationSelected,
  });

  @override
  State<SelectLocationScreen> createState() => _SelectLocationScreenState();
}

class _SelectLocationScreenState extends State<SelectLocationScreen> {
  final TextEditingController _searchController = TextEditingController();

  int _selectedZoneIndex = 0;
  List<Map<String, dynamic>> _nearestZones = [];
  Position? _currentPosition;
  String _currentAddress = "Locating your position...";
  bool _isLoadingLocation = true;

  @override
  void initState() {
    super.initState();
    FranchiseService().init();

    _searchController.addListener(() {
      setState(() {});
    });
    
    // Initially empty to avoid showing random data, only loaded from backend
    _nearestZones = [];

    _getCurrentLocation();
    _fetchZones();
  }

  Future<void> _getCurrentLocation() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        setState(() {
          _currentAddress = "Location services disabled";
          _isLoadingLocation = false;
        });
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          setState(() {
            _currentAddress = "Location permissions denied";
            _isLoadingLocation = false;
          });
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        setState(() {
          _currentAddress = "Permissions permanently denied";
          _isLoadingLocation = false;
        });
        return;
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high
      );
      
      String finalAddress = "${FranchiseService().activeFranchise.city}, India";
      try {
        final geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.latitude},${position.longitude}&key=AIzaSyC_Pn12n9hRH5jQdxU7hQUOPDy820ehjwo';
        final geoRes = await http.get(Uri.parse(geocodeUrl)).timeout(const Duration(seconds: 3));
        if (geoRes.statusCode == 200) {
          final geoData = json.decode(geoRes.body);
          if (geoData['status'] == 'OK' && geoData['results'] != null && geoData['results'].isNotEmpty) {
            finalAddress = geoData['results'][0]['formatted_address'] ?? finalAddress;
          }
        }
      } catch (ge) {
        debugPrint("Failed to reverse geocode: $ge");
      }

      setState(() {
        _currentPosition = position;
        _currentAddress = finalAddress;
        _isLoadingLocation = false;
      });

      _updateZoneDistances(position);
    } catch (e) {
      debugPrint("Error getting current location: $e");
      String fallbackCity = "${FranchiseService().activeFranchise.city}, India";
      setState(() {
        _currentAddress = fallbackCity;
        _isLoadingLocation = false;
      });
    }
  }

  void _updateZoneDistances(Position position) {
    if (_nearestZones.isEmpty) return;

    List<Map<String, dynamic>> updated = [];
    for (var zone in _nearestZones) {
      double zoneLat = 22.3072;
      double zoneLng = 73.1812;
      
      if (zone['center'] != null) {
        zoneLat = (zone['center']['lat'] as num).toDouble();
        zoneLng = (zone['center']['lng'] as num).toDouble();
      } else if (zone['points'] != null && (zone['points'] as List).isNotEmpty) {
        final firstPt = zone['points'][0];
        zoneLat = (firstPt['lat'] as num).toDouble();
        zoneLng = (firstPt['lng'] as num).toDouble();
      }

      double distanceMeters = Geolocator.distanceBetween(
        position.latitude,
        position.longitude,
        zoneLat,
        zoneLng,
      );

      double distanceKm = distanceMeters / 1000.0;
      
      updated.add({
        ...zone,
        "distance": "${distanceKm.toStringAsFixed(1)} km",
        "distanceVal": distanceKm,
      });
    }

    // Sort by distance ascending
    updated.sort((a, b) => (a['distanceVal'] as double).compareTo(b['distanceVal'] as double));

    setState(() {
      _nearestZones = updated;
      _selectedZoneIndex = 0; // Auto-select nearest zone!
    });
  }

  Future<void> _fetchZones() async {
    final urls = [
      AppConstants.getLiveZones,
      'http://192.168.1.4:5000/api/v1/getzoneDetailWithBikeCountList',
      'http://localhost:5000/api/v1/getzoneDetailWithBikeCountList',
      'http://10.0.2.2:5000/api/v1/getzoneDetailWithBikeCountList',
      'http://192.168.1.4:5000/api/zones',
      'http://localhost:5000/api/zones',
    ];

    for (final url in urls) {
      try {
        final response = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 2));
        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          if (data['status'] == 'success' && data['data'] != null) {
            final List dbList = data['data'];
            if (dbList.isNotEmpty) {
              final mapped = dbList.map((z) => {
                "id": z['id'],
                "name": z['name'] ?? '',
                "distance": "1.5 km",
                "address": z['address'] ?? z['locality'] ?? '',
                "hours": "Open 24x7",
                "isPopular": true,
                "color": const Color(0xFFF5F3FF),
                "iconColor": const Color(0xFF4313B8),
                "center": z['center'],
                "points": z['points'],
                "pricing": z['pricing'],
              }).toList();

              setState(() {
                _nearestZones = mapped;
              });

              if (_currentPosition != null) {
                _updateZoneDistances(_currentPosition!);
              }
              return;
            }
          }
        }
      } catch (e) {
        debugPrint("Failed to fetch zones from $url: $e");
      }
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      body: SafeArea(
        child: Column(
          children: [
            // --- TOP SEARCH HEADER ---
            _buildTopSearchHeader(),

            // --- MAIN SCROLLABLE CONTENT ---
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // --- 1. CURRENT LOCATION CARD ---
                    _buildCurrentLocationCard(),
                    const SizedBox(height: 16),

                    // --- 3. NEAREST ZONES HEADER ---
                    _buildNearestZonesHeader(),
                    const SizedBox(height: 12),

                    // --- 4. ZONES LIST CARDS ---
                    ...List.generate(_nearestZones.length, (index) {
                      final zone = _nearestZones[index];
                      final bool isSelected = _selectedZoneIndex == index;
                      return TweenAnimationBuilder<double>(
                        key: ValueKey(zone["name"]),
                        tween: Tween<double>(begin: 0.0, end: 1.0),
                        duration: Duration(milliseconds: 300 + (index * 80)),
                        builder: (context, value, child) {
                          return Transform.translate(
                            offset: Offset(0, 15 * (1.0 - value)),
                            child: Opacity(
                              opacity: value,
                              child: _buildZoneCard(zone, index, isSelected),
                            ),
                          );
                        },
                      );
                    }),

                    // MORE ZONES CARD
                    _buildMoreZonesCard(),
                    const SizedBox(height: 16),

                    // --- 5. GO GREEN WITH EVEGAH BANNER ---
                    _buildGoGreenBanner(),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),

            // --- BOTTOM CONTINUE ACTION BUTTON ---
            _buildBottomActionButton(),
          ],
        ),
      ),
    );
  }

  // Top Search Header with merged back button and search box
  Widget _buildTopSearchHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Row(
        children: [
          // Circular Back Arrow Button
          InkWell(
            onTap: () => Navigator.pop(context),
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: const Icon(Icons.arrow_back_rounded, color: Color(0xFF200F54), size: 20),
            ),
          ),
          const SizedBox(width: 10),
          // Clean merged Search Field Box
          Expanded(
            child: Container(
              height: 48,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  const SizedBox(width: 14),
                  const Icon(Icons.search_rounded, color: Color(0xFF64748B), size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      style: const TextStyle(fontSize: 14, color: Color(0xFF0F172A), fontWeight: FontWeight.w500),
                      decoration: const InputDecoration(
                        isDense: true,
                        contentPadding: EdgeInsets.symmetric(vertical: 12),
                        border: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        hintText: "Search for a zone or location",
                        hintStyle: TextStyle(fontSize: 14, color: Color(0xFF94A3B8), fontWeight: FontWeight.normal),
                      ),
                    ),
                  ),
                  if (_searchController.text.isNotEmpty) ...[
                    GestureDetector(
                      onTap: () {
                        _searchController.clear();
                        setState(() {});
                      },
                      child: const Icon(Icons.close_rounded, color: Color(0xFF64748B), size: 18),
                    ),
                    const SizedBox(width: 14),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Current Location Card
  Widget _buildCurrentLocationCard() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F3FF),
        borderRadius: BorderRadius.circular(18),
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
            child: const Icon(Icons.my_location_rounded, color: Color(0xFF4313B8), size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Current Location",
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF4313B8)),
                ),
                const SizedBox(height: 2),
                Text(
                  _currentAddress,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 10, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
          if (!_isLoadingLocation)
            InkWell(
              onTap: () {
                if (_nearestZones.isNotEmpty) {
                  final nearestZone = _nearestZones[0];
                  widget.onLocationSelected(nearestZone);
                  Navigator.pop(context, nearestZone);
                }
              },
              borderRadius: BorderRadius.circular(10),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFDDD6FE)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Icon(Icons.near_me_outlined, size: 12, color: Color(0xFF4313B8)),
                    SizedBox(width: 4),
                    Text(
                      "Use Current",
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF4313B8)),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  // Nearest Zones Section Header
  Widget _buildNearestZonesHeader() {
    return Row(
      children: [
        const Icon(Icons.navigation_outlined, size: 14, color: Color(0xFF4313B8)),
        const SizedBox(width: 6),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              "Nearest Zones",
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            Text(
              "Based on your current location",
              style: TextStyle(fontSize: 9, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ],
    );
  }

  // Zone Card Item
  Widget _buildZoneCard(Map<String, dynamic> zone, int index, bool isSelected) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedZoneIndex = index;
        });
        widget.onLocationSelected(zone);
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isSelected ? const Color(0xFF4313B8) : const Color(0xFFF1F5F9),
            width: isSelected ? 1.5 : 1.0,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.01),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            // Left Circle Icon Box
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: zone["color"],
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.electric_scooter_rounded, color: zone["iconColor"], size: 22),
            ),
            const SizedBox(width: 12),

            // Center Zone Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        zone["name"],
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                      if (zone["isPopular"]) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFDCFCE7),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            "Most Popular",
                            style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Color(0xFF16A34A)),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined, size: 10, color: Color(0xFF64748B)),
                      const SizedBox(width: 2),
                      Expanded(
                        child: Text(
                          zone["address"],
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 9, color: Color(0xFF64748B)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      const Icon(Icons.access_time_rounded, size: 10, color: Color(0xFF64748B)),
                      const SizedBox(width: 2),
                      Text(
                        zone["hours"],
                        style: const TextStyle(fontSize: 9, color: Color(0xFF64748B)),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Right Distance & Chevron
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  zone["distance"],
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF4313B8)),
                ),
                const SizedBox(height: 10),
                const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8), size: 18),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // More Zones Card
  Widget _buildMoreZonesCard() {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const ZoneMapScreen()),
        );
      },
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFFF1F5F9)),
        ),
        child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFFF5F3FF),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.grid_view_rounded, color: Color(0xFF4313B8), size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "More Zones",
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF4313B8)),
                ),
                SizedBox(height: 2),
                Text(
                  "Explore all zones in Bengaluru",
                  style: TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8), size: 18),
        ],
      ),
    ),
  );
}

  // Go Green Banner
  Widget _buildGoGreenBanner() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF7FBEF),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFE6F4D0)),
            ),
            child: const Icon(Icons.eco_outlined, color: Color(0xFF16A34A), size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Go Green with Evegah!",
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF16A34A)),
                ),
                SizedBox(height: 4),
                Text(
                  "Our EVs help you reduce carbon footprint and build a cleaner tomorrow.",
                  style: TextStyle(fontSize: 9, color: Color(0xFF64748B), height: 1.3),
                ),
              ],
            ),
          ),
          SizedBox(
            width: 60,
            height: 45,
            child: Image.asset("assets/city.png", fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Icon(Icons.electric_scooter, color: Color(0xFF4313B8), size: 30)),
          ),
        ],
      ),
    );
  }

  // Bottom Continue Action Button
  Widget _buildBottomActionButton() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Confirm Selection Button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: InkWell(
              onTap: () {
                if (_nearestZones.isEmpty || _selectedZoneIndex >= _nearestZones.length) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("No operational zones found in this area.")),
                  );
                  return;
                }
                final selectedZoneMap = _nearestZones[_selectedZoneIndex];
                widget.onLocationSelected(selectedZoneMap);
                Navigator.pop(context, selectedZoneMap);
              },
              borderRadius: BorderRadius.circular(16),
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF200F54), // Deep brand purple
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Text(
                      "Continue",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(width: 8),
                    Icon(
                      Icons.arrow_forward_rounded,
                      color: Colors.white,
                      size: 18,
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
}

/// --- RAPIDO / UBER STYLE INTERACTIVE MAP-BASED PICKUP & DROP SELECTION SCREEN ---
class MapPickupDropSelectionScreen extends StatefulWidget {
  final String initialPickup;
  final String? initialDrop;
  final List<Map<String, dynamic>>? availableZones;

  const MapPickupDropSelectionScreen({
    super.key,
    this.initialPickup = "Gotri Station, Vadodara",
    this.initialDrop = "Alkapuri Hub, Vadodara",
    this.availableZones,
  });

  @override
  State<MapPickupDropSelectionScreen> createState() => _MapPickupDropSelectionScreenState();
}

class _MapPickupDropSelectionScreenState extends State<MapPickupDropSelectionScreen> {
  GoogleMapController? _mapController;

  // LatLng coordinates for Vadodara operating points
  LatLng _pickupLatLng = const LatLng(22.3129, 73.1674); // Gotri
  LatLng _dropLatLng = const LatLng(22.3072, 73.1812);   // Alkapuri
  LatLng _cameraPosition = const LatLng(22.3129, 73.1674);

  String _pickupAddress = "Gotri Station, Vadodara";
  String _dropAddress = "Alkapuri Hub, Vadodara";
  bool _isSelectingPickup = true; // true = setting pickup pin, false = setting drop pin
  bool _vehicleDeliveryIncluded = true; // Checkbox for vehicle delivery included

  // Google Places Autocomplete Search Controllers & State
  final TextEditingController _pickupSearchController = TextEditingController();
  final TextEditingController _dropSearchController = TextEditingController();
  List<PlacePrediction> _placeSearchResults = [];
  bool _isSearchingPlace = false;

  List<Map<String, dynamic>> _backendZones = [];
  bool _isLoadingZones = false;

  Set<Marker> _markers = {};
  Set<Polygon> _polygons = {};
  BitmapDescriptor? _customZoneMarkerIcon;

  double _routeDistanceKm = 0.0;
  String _routeDurationText = "";

  @override
  void initState() {
    super.initState();
    _pickupAddress = widget.initialPickup;
    _pickupSearchController.text = _pickupAddress;
    if (widget.initialDrop != null && widget.initialDrop!.isNotEmpty) {
      _dropAddress = widget.initialDrop!;
      _dropSearchController.text = _dropAddress;
    }
    
    _loadCustomZoneAsset();
    _initZonePolygons();
    _geocodeInitialLocations();

    if (widget.availableZones != null && widget.availableZones!.isNotEmpty) {
      _backendZones = List.from(widget.availableZones!);
    } else {
      _fetchBackendZones();
    }
  }

  Future<void> _geocodeInitialLocations() async {
    final lowerPickup = widget.initialPickup.toLowerCase().trim();
    if (lowerPickup.contains("manjalpur")) {
      _pickupLatLng = const LatLng(22.2680, 73.1950);
    } else if (lowerPickup.contains("gotri")) {
      _pickupLatLng = const LatLng(22.3129, 73.1674);
    } else if (lowerPickup.contains("alkapuri")) {
      _pickupLatLng = const LatLng(22.3072, 73.1812);
    } else if (lowerPickup.contains("akota")) {
      _pickupLatLng = const LatLng(22.2965, 73.1750);
    } else if (lowerPickup.contains("kpgu") || lowerPickup.contains("varnama")) {
      _pickupLatLng = const LatLng(22.1890, 73.2340);
    } else if (lowerPickup.contains("aatapi") || lowerPickup.contains("ajwa")) {
      _pickupLatLng = const LatLng(22.3600, 73.3500);
    } else {
      final coords = await GooglePlacesService().getCoordinatesForAddress(widget.initialPickup);
      if (coords != null) _pickupLatLng = coords;
    }

    if (widget.initialDrop != null && widget.initialDrop!.isNotEmpty && !widget.initialDrop!.toLowerCase().contains("select")) {
      final dropCoords = await GooglePlacesService().getCoordinatesForAddress(widget.initialDrop!);
      if (dropCoords != null && (Geolocator.distanceBetween(_pickupLatLng.latitude, _pickupLatLng.longitude, dropCoords.latitude, dropCoords.longitude) > 100)) {
        _dropLatLng = dropCoords;
      } else {
        _dropLatLng = LatLng(_pickupLatLng.latitude + 0.030, _pickupLatLng.longitude + 0.025);
      }
    } else {
      _dropLatLng = LatLng(_pickupLatLng.latitude + 0.030, _pickupLatLng.longitude + 0.025);
    }

    _updateMapOverlays();
    await _calculateRouteDistance();
  }

  Future<void> _loadCustomZoneAsset() async {
    try {
      final icon = await BitmapDescriptor.fromAssetImage(
        const ImageConfiguration(size: Size(38, 38)),
        'assets/evegah-zone-1.png',
      );
      if (mounted) {
        setState(() {
          _customZoneMarkerIcon = icon;
          _updateMapOverlays();
        });
      }
    } catch (e) {
      debugPrint("Asset evegah-zone-1.png icon load info: $e");
    }
  }

  double _getTripDistanceKm() {
    if (_routeDistanceKm > 0) return _routeDistanceKm;
    double meters = Geolocator.distanceBetween(
      _pickupLatLng.latitude,
      _pickupLatLng.longitude,
      _dropLatLng.latitude,
      _dropLatLng.longitude,
    );
    double distKm = meters / 1000.0;
    return distKm > 0.05 ? distKm : 3.5;
  }

  /// Calculate real driving distance from Zone Hub to Doorstep location using Google Distance Matrix API
  Future<void> _calculateRouteDistance() async {
    try {
      final url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=${_pickupLatLng.latitude},${_pickupLatLng.longitude}&destinations=${_dropLatLng.latitude},${_dropLatLng.longitude}&key=AIzaSyC_Pn12n9hRH5jQdxU7hQUOPDy820ehjwo';
      final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 4));
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        if (data['status'] == 'OK' && data['rows'] != null && (data['rows'] as List).isNotEmpty) {
          final element = data['rows'][0]['elements'][0];
          if (element['status'] == 'OK') {
            final distanceMeters = (element['distance']['value'] as num).toDouble();
            final distKm = distanceMeters / 1000.0;
            final durationText = element['duration']['text'] as String;

            if (mounted) {
              setState(() {
                _routeDistanceKm = distKm;
                _routeDurationText = durationText;
                _updateMapOverlays();
              });
            }
            return;
          }
        }
      }
    } catch (e) {
      debugPrint("Distance Matrix info: $e");
    }

    // Geodesic distance fallback if Distance Matrix fails
    final meters = Geolocator.distanceBetween(
      _pickupLatLng.latitude,
      _pickupLatLng.longitude,
      _dropLatLng.latitude,
      _dropLatLng.longitude,
    );
    final distKm = meters / 1000.0;
    final mins = (distKm * 2.5).round();

    if (mounted) {
      setState(() {
        _routeDistanceKm = distKm;
        _routeDurationText = "~$mins mins";
        _updateMapOverlays();
      });
    }
  }



  Future<void> _onSearchInputChanged(String query) async {
    if (query.trim().isEmpty) {
      setState(() {
        _placeSearchResults = [];
        _isSearchingPlace = false;
      });
      return;
    }

    setState(() => _isSearchingPlace = true);
    final results = await GooglePlacesService().searchPlaces(query);
    if (mounted) {
      setState(() {
        _placeSearchResults = results;
        _isSearchingPlace = false;
      });
    }
  }

  Future<void> _onPlaceSelected(PlacePrediction prediction) async {
    final latLng = await GooglePlacesService().getCoordinatesForPlace(prediction);
    final selectedCoords = latLng ?? const LatLng(22.3072, 73.1812);

    setState(() {
      _dropAddress = prediction.mainText;
      _dropSearchController.text = prediction.mainText;
      _dropLatLng = selectedCoords;
      _placeSearchResults = [];
    });

    _mapController?.animateCamera(CameraUpdate.newLatLngZoom(_dropLatLng, 15.0));
    await _calculateRouteDistance();
  }

  Future<void> _fetchBackendZones() async {
    setState(() => _isLoadingZones = true);
    final urls = [
      AppConstants.getLiveZones,
      'http://192.168.1.4:5000/api/v1/getzoneDetailWithBikeCountList',
      'http://localhost:5000/api/v1/getzoneDetailWithBikeCountList',
      'http://10.0.2.2:5000/api/v1/getzoneDetailWithBikeCountList',
    ];

    List<Map<String, dynamic>> loaded = [];
    for (final url in urls) {
      try {
        final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 2));
        if (res.statusCode == 200) {
          final data = json.decode(res.body);
          if (data['status'] == 'success' && data['data'] != null) {
            final List dbList = data['data'];
            for (var z in dbList) {
              double lat = 22.3072;
              double lng = 73.1812;
              if (z['center'] != null) {
                lat = (z['center']['lat'] as num).toDouble();
                lng = (z['center']['lng'] as num).toDouble();
              } else if (z['points'] != null && (z['points'] as List).isNotEmpty) {
                lat = (z['points'][0]['lat'] as num).toDouble();
                lng = (z['points'][0]['lng'] as num).toDouble();
              }

              loaded.add({
                "id": z['id'],
                "name": z['name'] ?? 'EV Zone',
                "address": z['address'] ?? z['locality'] ?? 'Vadodara',
                "lat": lat,
                "lng": lng,
                "pricing": z['pricing'],
              });
            }
            break;
          }
        }
      } catch (e) {
        debugPrint("Map screen zone fetch error ($url): $e");
      }
    }

    if (loaded.isEmpty) {
      loaded = [
        {"id": "z1", "name": "Gotri Station", "address": "Gotri Main Road, Vadodara", "lat": 22.3129, "lng": 73.1674},
        {"id": "z2", "name": "Alkapuri Hub", "address": "RC Dutt Road, Alkapuri", "lat": 22.3072, "lng": 73.1812},
        {"id": "z3", "name": "Akota Station", "address": "Akota Stadium Road", "lat": 22.2965, "lng": 73.1750},
        {"id": "z4", "name": "Aatapi EV Zone", "address": "Ajwa Nimeta Road", "lat": 22.3600, "lng": 73.3500},
      ];
    }

    if (mounted) {
      setState(() {
        _backendZones = loaded;
        _isLoadingZones = false;
        _updateMapOverlays();
      });
    }
  }

  bool _isMapInitialized = false;

  void _initZonePolygons() {
    // Polygon boundaries removed per user directive
    setState(() => _polygons = {});
  }

  void _updateMapOverlays() {
    final Set<Marker> newMarkers = {};

    // 1. Single Pickup Zone Hub Marker (ONLY the selected zone hub is rendered!)
    newMarkers.add(
      Marker(
        markerId: const MarkerId("PICKUP_ZONE_HUB_MARKER"),
        position: _pickupLatLng,
        icon: _customZoneMarkerIcon ?? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
        infoWindow: InfoWindow(
          title: "⚡ Pickup Zone Hub: $_pickupAddress",
          snippet: "Selected EV Hub • Route Origin",
        ),
      ),
    );

    // 2. Doorstep Delivery Drop Location Marker (Interactive Draggable Red Marker)
    newMarkers.add(
      Marker(
        markerId: const MarkerId("DOORSTEP_DELIVERY_MARKER"),
        position: _dropLatLng,
        draggable: true,
        onDragEnd: (newPosition) async {
          setState(() {
            _dropLatLng = newPosition;
          });
          await _reverseGeocode(newPosition);
          await _calculateRouteDistance();
        },
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
        infoWindow: InfoWindow(
          title: "📍 Doorstep Location",
          snippet: _dropAddress,
        ),
      ),
    );

    setState(() {
      _markers = newMarkers;
    });
  }

  Future<void> _reverseGeocode(LatLng latLng) async {
    try {
      final geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.latitude},${latLng.longitude}&key=AIzaSyC_Pn12n9hRH5jQdxU7hQUOPDy820ehjwo';
      final res = await http.get(Uri.parse(geocodeUrl)).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        if (data['status'] == 'OK' && data['results'] != null && data['results'].isNotEmpty) {
          final formatted = data['results'][0]['formatted_address'] as String?;
          if (formatted != null && formatted.isNotEmpty) {
            final shortAddress = formatted.split(',').take(3).join(',');
            if (mounted) {
              setState(() {
                _dropAddress = shortAddress;
                _dropSearchController.text = shortAddress;
                _dropLatLng = latLng;
              });
            }
          }
        }
      }
    } catch (e) {
      debugPrint("Reverse geocode error: $e");
    }
  }

  void _confirmSelection() {
    final distKm = _getTripDistanceKm();
    final doorstepFee = (distKm * 30).roundToDouble();
    final resultData = {
      "doorstepAddress": _dropAddress,
      "drop": _dropAddress,
      "dropLatLng": {"lat": _dropLatLng.latitude, "lng": _dropLatLng.longitude},
      "vehicleDeliveryIncluded": true,
      "doorstepDeliveryFee": doorstepFee,
      "distance": "${distKm.toStringAsFixed(1)} km",
    };
    Navigator.pop(context, resultData);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      body: SafeArea(
        child: Stack(
          children: [
            // 1. REAL GOOGLE MAP CANVAS WITH ZONE POLYGONS & CUSTOM MARKERS
            Positioned.fill(
              child: GoogleMap(
                initialCameraPosition: CameraPosition(
                  target: _dropLatLng,
                  zoom: 14.5,
                ),
                onMapCreated: (controller) {
                  _mapController = controller;
                  _isMapInitialized = true;
                  _updateMapOverlays();
                },
                onCameraMove: (position) {
                  _cameraPosition = position.target;
                },
                onCameraIdle: () async {
                  if (!_isMapInitialized) return;
                  final double distMeters = Geolocator.distanceBetween(
                    _dropLatLng.latitude,
                    _dropLatLng.longitude,
                    _cameraPosition.latitude,
                    _cameraPosition.longitude,
                  );
                  if (distMeters > 30) {
                    setState(() {
                      _dropLatLng = _cameraPosition;
                    });
                    await _reverseGeocode(_cameraPosition);
                    await _calculateRouteDistance();
                  }
                },
                markers: _markers,
                polygons: const {},
                myLocationEnabled: true,
                myLocationButtonEnabled: false,
                zoomControlsEnabled: false,
                compassEnabled: true,
              ),
            ),

            // 2. CENTER TARGET DRAGGABLE PIN (Rapido / Uber Style)
            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFDC2626),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Icon(
                          Icons.location_on,
                          color: Colors.white,
                          size: 14,
                        ),
                        SizedBox(width: 6),
                        Text(
                          "SET DOORSTEP LOCATION",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Icon(
                    Icons.location_on_rounded,
                    color: Color(0xFFDC2626),
                    size: 44,
                  ),
                  Container(
                    width: 10,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ],
              ),
            ),

            // 3. TOP SINGLE SEARCH HEADER (DOORSTEP DELIVERY LOCATION ONLY)
            Positioned(
              top: 12,
              left: 14,
              right: 14,
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.10),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Back arrow + Title Row
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back_rounded, color: Color(0xFF200F54)),
                          onPressed: () => Navigator.pop(context),
                        ),
                        const Expanded(
                          child: Text(
                            "Set Doorstep Delivery Location",
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF200F54),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),

                    // Doorstep Location Input Row with live Google Places search
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: const Color(0xFF4313B8).withOpacity(0.4),
                          width: 1.5,
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.door_front_door_rounded, color: Color(0xFF4313B8), size: 18),
                          const SizedBox(width: 10),
                          Expanded(
                            child: TextField(
                              controller: _dropSearchController,
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                              onChanged: (val) => _onSearchInputChanged(val),
                              decoration: const InputDecoration(
                                hintText: "Enter doorstep delivery address or society",
                                hintStyle: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                                border: InputBorder.none,
                                isDense: true,
                              ),
                            ),
                          ),
                          if (_isSearchingPlace)
                            const Padding(
                              padding: EdgeInsets.only(right: 6),
                              child: SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF4313B8))),
                            )
                          else
                            const Text("Active Pin", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF4313B8))),
                        ],
                      ),
                    ),

                    // Floating Autocomplete Search Predictions Overlay
                    if (_placeSearchResults.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Container(
                        constraints: const BoxConstraints(maxHeight: 180),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0xFF4313B8).withOpacity(0.3), width: 1.5),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.12),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: ListView.separated(
                          shrinkWrap: true,
                          padding: EdgeInsets.zero,
                          itemCount: _placeSearchResults.length,
                          separatorBuilder: (_, __) => const Divider(height: 1, color: Color(0xFFF1F5F9)),
                          itemBuilder: (context, idx) {
                            final p = _placeSearchResults[idx];
                            return ListTile(
                              dense: true,
                              leading: const Icon(
                                Icons.pin_drop,
                                color: Color(0xFF4313B8),
                                size: 18,
                              ),
                              title: Text(
                                p.mainText,
                                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                              ),
                              subtitle: Text(
                                p.description,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                              ),
                              onTap: () => _onPlaceSelected(p),
                            );
                          },
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),

            // 4. BOTTOM CONFIRMATION SHEET (Trip details & Confirm button)
            Positioned(
              left: 14,
              right: 14,
              bottom: 16,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.12),
                      blurRadius: 20,
                      offset: const Offset(0, -4),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Estimated Delivery Distance",
                              style: TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              _routeDurationText.isNotEmpty
                                  ? "${_getTripDistanceKm().toStringAsFixed(1)} km • $_routeDurationText"
                                  : "${_getTripDistanceKm().toStringAsFixed(1)} km • ~${(_getTripDistanceKm() * 2.5).round()} mins",
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF200F54)),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF3E8FF),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            "Doorstep Delivery: ₹${(_getTripDistanceKm() * 30).round()} (₹30/km)",
                            style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: Color(0xFF4313B8)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // Confirm Doorstep Location Primary Action Button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _confirmSelection,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF200F54),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          elevation: 4,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.check_circle_rounded, color: Colors.white, size: 20),
                            SizedBox(width: 8),
                            Text(
                              "Confirm Doorstep Location",
                              style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                            ),
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
}

