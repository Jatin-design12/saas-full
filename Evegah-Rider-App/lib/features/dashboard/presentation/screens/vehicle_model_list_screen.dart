import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import 'vehicle_details_screen.dart';

class VehicleModelListScreen extends StatefulWidget {
  const VehicleModelListScreen({super.key});

  @override
  State<VehicleModelListScreen> createState() => _VehicleModelListScreenState();
}

class _VehicleModelListScreenState extends State<VehicleModelListScreen> {
  String _selectedCategory = "All";
  String _searchQuery = "";
  final TextEditingController _searchController = TextEditingController();

  final List<String> _categories = [
    "All",
    "E-Scooter",
    "E-Bike",
    "E-Car",
    "E-Cycle",
  ];

  // Default models with fleet_bg backgrounds
  final List<Map<String, dynamic>> _defaultModels = [
    {
      "id": 1,
      "name": "Evegah City",
      "tagline": "Smart. Silent. Sustainable.",
      "category": "E-Vehicle",
      "pillCategory": "E-Vehicle",
      "pillBg": Color(0xFFEDE9FE),
      "pillColor": Color(0xFF6B21A8),
      "bgImage": "assets/fleet_bg1.png",
      "vehicleImage": "assets/city.png",
      "range": "80–100 km",
      "speed": "45 km/h",
      "capacity": "2 Seats",
      "btnBg": Color(0xFF4313B8),
      "isFavorite": false,
    },
    {
      "id": 2,
      "name": "Evegah Pro",
      "tagline": "Compact. Powerful. Anywhere.",
      "category": "E-Scooter",
      "pillCategory": "E-Scooter",
      "pillBg": Color(0xFFDCFCE7),
      "pillColor": Color(0xFF15803D),
      "bgImage": "assets/fleet_bg2.png",
      "vehicleImage": "assets/pro-1.png",
      "range": "10–12 km",
      "speed": "10 km/h",
      "capacity": "1 Seat",
      "btnBg": Color(0xFF16A34A),
      "isFavorite": false,
    },
    {
      "id": 3,
      "name": "EverRide Lite",
      "tagline": "Light. Smart. Everyday.",
      "category": "E-Bike",
      "pillCategory": "E-Bike",
      "pillBg": Color(0xFFE0F2FE),
      "pillColor": Color(0xFF0369A1),
      "bgImage": "assets/fleet_bg3.png",
      "vehicleImage": "assets/Fly.png",
      "range": "35–50 km",
      "speed": "25 km/h",
      "capacity": "1 Seat",
      "btnBg": Color(0xFF0284C7),
      "isFavorite": false,
    },
    {
      "id": 4,
      "name": "EcoRide Plus",
      "tagline": "Pedal the Change.",
      "category": "E-Cycle",
      "pillCategory": "E-Cycle",
      "pillBg": Color(0xFFFFEDD5),
      "pillColor": Color(0xFFC2410C),
      "bgImage": "assets/fleet_bg4.png",
      "vehicleImage": "assets/fly-1.png",
      "range": "60–80 km",
      "speed": "25 km/h",
      "capacity": "1 Seat",
      "btnBg": Color(0xFFEA580C),
      "isFavorite": false,
    },
    {
      "id": 5,
      "name": "Evegah Mink",
      "tagline": "Heavy Duty. Unlimited Utility.",
      "category": "E-Car",
      "pillCategory": "E-Vehicle",
      "pillBg": Color(0xFFEDE9FE),
      "pillColor": Color(0xFF6B21A8),
      "bgImage": "assets/fleet_bg1.png",
      "vehicleImage": "assets/MINK-1.png",
      "range": "70–90 km",
      "speed": "30 km/h",
      "capacity": "2 Seats",
      "btnBg": Color(0xFF7C3AED),
      "isFavorite": false,
    },
  ];

  List<Map<String, dynamic>> _models = [];

  @override
  void initState() {
    super.initState();
    _models = List.from(_defaultModels);
    _fetchLiveVehicleModels();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchLiveVehicleModels() async {
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
            final List<Map<String, dynamic>> updated = [];
            final bgList = [
              "assets/fleet_bg1.png",
              "assets/fleet_bg2.png",
              "assets/fleet_bg3.png",
              "assets/fleet_bg4.png"
            ];

            for (int i = 0; i < list.length; i++) {
              final raw = list[i];
              final String name = raw['name'] ?? 'Evegah EV';
              final String category = raw['category'] ?? 'E-Vehicle';
              final String tagline = raw['tagline'] ?? 'Smart. Silent. Sustainable.';
              final String range = raw['range'] ?? '80–100 km';
              final String speed = raw['top_speed'] ?? '45 km/h';
              final String capacity = raw['seating_capacity'] != null
                  ? "${raw['seating_capacity']} Seats"
                  : (category.contains('Cycle') || category.contains('Scooter') || category.contains('Moped')
                      ? "1 Seat"
                      : "2 Seats");

              String vehicleImg = "assets/city.png";
              if (name.toLowerCase().contains("pro") || category.toLowerCase().contains("scooter")) {
                vehicleImg = "assets/pro-1.png";
              } else if (name.toLowerCase().contains("mink") || category.toLowerCase().contains("cargo")) {
                vehicleImg = "assets/MINK-1.png";
              } else if (name.toLowerCase().contains("fly") || category.toLowerCase().contains("bike") || category.toLowerCase().contains("moped")) {
                vehicleImg = "assets/Fly.png";
              }

              final String bgImage = bgList[i % bgList.length];
              Color pillBg = const Color(0xFFEDE9FE);
              Color pillColor = const Color(0xFF6B21A8);
              Color btnBg = const Color(0xFF4313B8);

              if (category.toLowerCase().contains("scooter")) {
                pillBg = const Color(0xFFDCFCE7);
                pillColor = const Color(0xFF15803D);
                btnBg = const Color(0xFF16A34A);
              } else if (category.toLowerCase().contains("bike")) {
                pillBg = const Color(0xFFE0F2FE);
                pillColor = const Color(0xFF0369A1);
                btnBg = const Color(0xFF0284C7);
              } else if (category.toLowerCase().contains("cycle")) {
                pillBg = const Color(0xFFFFEDD5);
                pillColor = const Color(0xFFC2410C);
                btnBg = const Color(0xFFEA580C);
              }

              updated.add({
                "id": raw['id'] ?? i,
                "name": name,
                "tagline": tagline,
                "category": category,
                "pillCategory": category,
                "pillBg": pillBg,
                "pillColor": pillColor,
                "bgImage": bgImage,
                "vehicleImage": vehicleImg,
                "range": range,
                "speed": speed,
                "capacity": capacity,
                "btnBg": btnBg,
                "isFavorite": false,
              });
            }

            setState(() {
              _models = updated;
            });
            break;
          }
        }
      } catch (e) {
        debugPrint("Error fetching vehicle models: $e");
      }
    }
  }

  List<Map<String, dynamic>> get _filteredModels {
    return _models.where((item) {
      final matchesSearch = _searchQuery.isEmpty ||
          item["name"].toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
          item["tagline"].toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
          item["category"].toString().toLowerCase().contains(_searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (_selectedCategory == "All") return true;
      if (_selectedCategory == "E-Scooter") {
        return item["category"] == "E-Scooter";
      }
      if (_selectedCategory == "E-Bike") {
        return item["category"] == "E-Bike" || item["category"] == "E-Moped";
      }
      if (_selectedCategory == "E-Car") {
        return item["category"] == "E-Vehicle" || item["category"] == "E-Cargo" || item["category"] == "E-Car";
      }
      if (_selectedCategory == "E-Cycle") {
        return item["category"] == "E-Cycle";
      }
      return true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFCFCFE),
      body: SafeArea(
        child: Column(
          children: [
            // Top App Bar / Title Header
            _buildHeader(),

            // Search Bar & Filter Button
            _buildSearchAndFilterRow(),

            const SizedBox(height: 14),

            // Category Filter Pills Row
            _buildCategoryPillsRow(),

            const SizedBox(height: 16),

            // Vehicle Cards List
            Expanded(
              child: _filteredModels.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.electric_moped_outlined, size: 54, color: Colors.grey.shade400),
                          const SizedBox(height: 10),
                          Text(
                            "No vehicle models found",
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey.shade600),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
                      itemCount: _filteredModels.length,
                      itemBuilder: (context, index) {
                        final item = _filteredModels[index];
                        return _buildWideVehicleCard(item);
                      },
                    ),
            ),

            // Bottom Trust Feature Badges
            _buildBottomFeatureBadges(),
          ],
        ),
      ),
    );
  }

  // Header matching reference
  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Color(0xFF0F172A)),
                onPressed: () => Navigator.pop(context),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    "Our EV Fleet",
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                      letterSpacing: -0.4,
                    ),
                  ),
                  SizedBox(height: 2),
                  Text(
                    "Choose a ride for a greener tomorrow",
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
            ],
          ),
          InkWell(
            onTap: () {
              setState(() {
                _selectedCategory = "All";
                _searchController.clear();
                _searchQuery = "";
              });
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Text(
                  "View All",
                  style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF4313B8),
                  ),
                ),
                SizedBox(width: 3),
                Icon(
                  Icons.chevron_right_rounded,
                  size: 16,
                  color: Color(0xFF4313B8),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Search Bar + Filter Icon
  Widget _buildSearchAndFilterRow() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          // Search Input
          Expanded(
            child: Container(
              height: 48,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.02),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: TextField(
                controller: _searchController,
                onChanged: (val) {
                  setState(() {
                    _searchQuery = val.trim();
                  });
                },
                decoration: const InputDecoration(
                  hintText: "Search vehicles, range, brand...",
                  hintStyle: TextStyle(
                    fontSize: 12.5,
                    color: Color(0xFF94A3B8),
                    fontWeight: FontWeight.w500,
                  ),
                  prefixIcon: Icon(Icons.search_rounded, size: 20, color: Color(0xFF0F172A)),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          // Filter Pill
          Container(
            height: 48,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.02),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Icon(Icons.tune_rounded, size: 18, color: Color(0xFF0F172A)),
                SizedBox(width: 6),
                Text(
                  "Filter",
                  style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF0F172A),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Category Filter Pills Row
  Widget _buildCategoryPillsRow() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      clipBehavior: Clip.none,
      child: Row(
        children: _categories.map((cat) {
          final isSelected = _selectedCategory == cat;
          IconData catIcon = Icons.two_wheeler_rounded;
          if (cat == "All") {
            catIcon = Icons.clear_all_rounded;
          } else if (cat == "E-Scooter") {
            catIcon = Icons.electric_scooter_rounded;
          } else if (cat == "E-Bike") {
            catIcon = Icons.pedal_bike_rounded;
          } else if (cat == "E-Car") {
            catIcon = Icons.directions_car_rounded;
          } else if (cat == "E-Cycle") {
            catIcon = Icons.directions_bike_rounded;
          }

          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              onTap: () {
                setState(() {
                  _selectedCategory = cat;
                });
              },
              borderRadius: BorderRadius.circular(20),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected ? const Color(0xFF4313B8) : const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isSelected ? const Color(0xFF4313B8) : const Color(0xFFE2E8F0),
                    width: 1.1,
                  ),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: const Color(0xFF4313B8).withValues(alpha: 0.25),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ]
                      : null,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (cat != "All") ...[
                      Icon(
                        catIcon,
                        size: 16,
                        color: isSelected ? Colors.white : const Color(0xFF334155),
                      ),
                      const SizedBox(width: 6),
                    ],
                    Text(
                      cat,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: isSelected ? Colors.white : const Color(0xFF334155),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  // Wide Vehicle Card Matching Reference Image Exactly
  Widget _buildWideVehicleCard(Map<String, dynamic> item) {
    final String name = item["name"] ?? "Evegah City";
    final String tagline = item["tagline"] ?? "Smart. Silent. Sustainable.";
    final String category = item["pillCategory"] ?? "E-Vehicle";
    final Color pillBg = item["pillBg"] ?? const Color(0xFFEDE9FE);
    final Color pillColor = item["pillColor"] ?? const Color(0xFF6B21A8);
    final String bgImage = item["bgImage"] ?? "assets/fleet_bg1.png";
    final String vehicleImage = (item["vehicleImage"] ?? item["image"] ?? "assets/city.png").toString();
    final String range = item["range"] ?? "80–100 km";
    final String speed = item["speed"] ?? "45 km/h";
    final String capacity = item["capacity"] ?? "2 Seats";
    final Color btnBg = item["btnBg"] ?? const Color(0xFF4313B8);
    final bool isFavorite = item["isFavorite"] == true;

    return Container(
      height: 205,
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(23),
        child: Stack(
          children: [
            // 1. Background City Landscape graphic (fleet_bg1..4)
            Positioned.fill(
              child: Image.asset(
                bgImage,
                fit: BoxFit.cover,
                alignment: Alignment.centerRight,
              ),
            ),

            // 2. Background-Removed Vehicle PNG on Right Side with Shadow
            Positioned(
              right: 6,
              bottom: 8,
              top: 22,
              width: 175,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Positioned(
                    bottom: 2,
                    child: Container(
                      width: 110,
                      height: 12,
                      decoration: BoxDecoration(
                        borderRadius: const BorderRadius.all(Radius.elliptical(110, 12)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.16),
                            blurRadius: 14,
                            spreadRadius: 2,
                          ),
                        ],
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => VehicleDetailsScreen(
                            vehicleId: name,
                            modelName: name,
                          ),
                        ),
                      );
                    },
                    child: vehicleImage.startsWith('http')
                        ? Image.network(
                            vehicleImage,
                            fit: BoxFit.contain,
                            filterQuality: FilterQuality.high,
                            errorBuilder: (context, error, stackTrace) => const Icon(
                              Icons.electric_moped_rounded,
                              size: 70,
                              color: Color(0xFF4313B8),
                            ),
                          )
                        : Image.asset(
                            vehicleImage,
                            fit: BoxFit.contain,
                            filterQuality: FilterQuality.high,
                            errorBuilder: (context, error, stackTrace) => const Icon(
                              Icons.electric_moped_rounded,
                              size: 70,
                              color: Color(0xFF4313B8),
                            ),
                          ),
                  ),
                ],
              ),
            ),

            // 3. Favorite Heart Button on Top Right
            Positioned(
              top: 12,
              right: 12,
              child: GestureDetector(
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
                        color: Colors.black.withValues(alpha: 0.08),
                        blurRadius: 8,
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
              ),
            ),

            // 4. Left Content Column
            Positioned(
              top: 14,
              left: 14,
              bottom: 14,
              width: 190,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Pill category badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: pillBg,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          category,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: pillColor,
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      // Model Name
                      Text(
                        name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(height: 2),
                      // Tagline
                      Text(
                        tagline,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),

                  // Specs Row (⚡ Range, ⏲️ Top Speed, 👥 Capacity)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildSpecCol(Icons.bolt_rounded, range, "Range"),
                      _buildSpecCol(Icons.speed_rounded, speed, "Top Speed"),
                      _buildSpecCol(Icons.people_alt_rounded, capacity, "Capacity"),
                    ],
                  ),

                  // "View Details ->" Action Button
                  InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => VehicleDetailsScreen(
                            vehicleId: name,
                            modelName: name,
                          ),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      height: 38,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: btnBg,
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: [
                          BoxShadow(
                            color: btnBg.withValues(alpha: 0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Text(
                            "View Details",
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                              letterSpacing: -0.2,
                            ),
                          ),
                          SizedBox(width: 5),
                          Icon(Icons.arrow_forward_rounded, size: 14, color: Colors.white),
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
    );
  }

  Widget _buildSpecCol(IconData icon, String value, String label) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 13, color: const Color(0xFF4313B8)),
        const SizedBox(width: 3),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              value,
              style: const TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
            ),
            Text(
              label,
              style: const TextStyle(
                fontSize: 7.5,
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ],
    );
  }

  // 4 Bottom Feature Badges matching reference design
  Widget _buildBottomFeatureBadges() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFF1F5F9))),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: const [
          _BottomBadgeItem(
            icon: Icons.eco_rounded,
            circleBg: Color(0xFFDCFCE7),
            iconColor: Color(0xFF16A34A),
            title: "Eco Friendly",
            subtitle: "Zero Emission",
          ),
          _BottomBadgeItem(
            icon: Icons.account_balance_wallet_rounded,
            circleBg: Color(0xFFEDE9FE),
            iconColor: Color(0xFF7C3AED),
            title: "Affordable",
            subtitle: "Save More",
          ),
          _BottomBadgeItem(
            icon: Icons.verified_user_rounded,
            circleBg: Color(0xFFDCFCE7),
            iconColor: Color(0xFF16A34A),
            title: "Safe & Reliable",
            subtitle: "Ride with Confidence",
          ),
          _BottomBadgeItem(
            icon: Icons.eco_rounded,
            circleBg: Color(0xFFDCFCE7),
            iconColor: Color(0xFF16A34A),
            title: "Sustainable",
            subtitle: "A Cleaner Tomorrow",
          ),
        ],
      ),
    );
  }
}

class _BottomBadgeItem extends StatelessWidget {
  final IconData icon;
  final Color circleBg;
  final Color iconColor;
  final String title;
  final String subtitle;

  const _BottomBadgeItem({
    required this.icon,
    required this.circleBg,
    required this.iconColor,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: circleBg,
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 16, color: iconColor),
        ),
        const SizedBox(width: 6),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 9.5,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
            ),
            Text(
              subtitle,
              style: const TextStyle(
                fontSize: 7.5,
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
