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

  // Default models matching Evegah banner assets
  final List<Map<String, dynamic>> _defaultModels = [
    {
      "id": 1,
      "name": "Evegah City",
      "tagline": "Smart. Silent. Sustainable.",
      "category": "E-Vehicle",
      "bannerImage": "assets/evegah_vb_city.png",
      "isFavorite": false,
    },
    {
      "id": 2,
      "name": "Evegah Fly",
      "tagline": "Lightweight & Agile City Moped.",
      "category": "E-Bike",
      "bannerImage": "assets/evegah_vb_fly.png",
      "isFavorite": false,
    },
    {
      "id": 3,
      "name": "Evegah Mink",
      "tagline": "Heavy Duty. Unlimited Utility.",
      "category": "E-Car",
      "bannerImage": "assets/evegah_vb_mink.png",
      "isFavorite": false,
    },
    {
      "id": 4,
      "name": "Evegah Pro",
      "tagline": "Compact. Powerful. Anywhere.",
      "category": "E-Scooter",
      "bannerImage": "assets/evegah_vb_pro.png",
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

  String _getBannerImage(String modelName) {
    final lower = modelName.toLowerCase();
    if (lower.contains('mink')) {
      return 'assets/evegah_vb_mink.png';
    } else if (lower.contains('pro')) {
      return 'assets/evegah_vb_pro.png';
    } else if (lower.contains('fly') || lower.contains('cycle') || lower.contains('kick') || lower.contains('moped') || lower.contains('bike')) {
      return 'assets/evegah_vb_fly.png';
    } else {
      return 'assets/evegah_vb_city.png';
    }
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

            for (int i = 0; i < list.length; i++) {
              final raw = list[i];
              final String name = raw['name'] ?? 'Evegah EV';
              final String category = raw['category'] ?? 'E-Vehicle';
              final String tagline = raw['tagline'] ?? 'Smart. Silent. Sustainable.';

              updated.add({
                "id": raw['id'] ?? i,
                "name": name,
                "tagline": tagline,
                "category": category,
                "bannerImage": _getBannerImage(name),
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
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                      letterSpacing: -0.4,
                    ),
                  ),
                  SizedBox(height: 2),
                  Text(
                    "Choose a ride for a greener tomorrow",
                    style: TextStyle(
                      fontSize: 8,
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

  // Vehicle Card Item - Renders full-bleed banner image (assets/evegah_vb_*.png) and links to details
  Widget _buildWideVehicleCard(Map<String, dynamic> item) {
    final String name = item["name"] ?? "Evegah EV";
    final String bannerPath = item["bannerImage"] ?? _getBannerImage(name);
    final bool isFavorite = item["isFavorite"] == true;

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(19),
        child: Stack(
          children: [
            // 1. Direct Banner Image (1942 / 809 ratio)
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
              child: AspectRatio(
                aspectRatio: 1942 / 809,
                child: Image.asset(
                  bannerPath,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    color: const Color(0xFFF1F5F9),
                    child: Center(
                      child: Text(
                        name,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // 2. Favorite Heart Button on Top Right
            Positioned(
              top: 10,
              right: 10,
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
                    color: Colors.white.withValues(alpha: 0.92),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.12),
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
              ),
            ),
          ],
        ),
      ),
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
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        child: Row(
          children: const [
            _BottomBadgeItem(
              icon: Icons.eco_rounded,
              circleBg: Color(0xFFDCFCE7),
              iconColor: Color(0xFF16A34A),
              title: "Eco Friendly",
              subtitle: "Zero Emission",
            ),
            SizedBox(width: 16),
            _BottomBadgeItem(
              icon: Icons.account_balance_wallet_rounded,
              circleBg: Color(0xFFEDE9FE),
              iconColor: Color(0xFF7C3AED),
              title: "Affordable",
              subtitle: "Save More",
            ),
            SizedBox(width: 16),
            _BottomBadgeItem(
              icon: Icons.verified_user_rounded,
              circleBg: Color(0xFFDCFCE7),
              iconColor: Color(0xFF16A34A),
              title: "Safe & Reliable",
              subtitle: "Ride with Confidence",
            ),
            SizedBox(width: 16),
            _BottomBadgeItem(
              icon: Icons.eco_rounded,
              circleBg: Color(0xFFDCFCE7),
              iconColor: Color(0xFF16A34A),
              title: "Sustainable",
              subtitle: "A Cleaner Tomorrow",
            ),
          ],
        ),
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
