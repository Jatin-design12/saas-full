import 'dart:convert';
import 'package:flutter/material.dart';
import '../../data/services/dashboard_service.dart';
import 'rent_ev_screen.dart';

class VehicleDetailsScreen extends StatefulWidget {
  final String vehicleId;
  final String? modelName;
  final String? zone;

  const VehicleDetailsScreen({
    super.key,
    required this.vehicleId,
    this.modelName,
    this.zone,
  });

  @override
  State<VehicleDetailsScreen> createState() => _VehicleDetailsScreenState();
}

class _VehicleDetailsScreenState extends State<VehicleDetailsScreen> with SingleTickerProviderStateMixin {
  final DashboardService _dashboardService = DashboardService();

  bool _isLoading = false;
  bool _isFavorite = false;
  Map<String, dynamic>? _modelDetails;
  int _activeGalleryIndex = 0;
  int _currentTabIndex = 0;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) {
        if (_tabController.index != _currentTabIndex && mounted) {
          setState(() {
            _currentTabIndex = _tabController.index;
          });
        }
      }
    });
    _loadLiveModelDetails();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadLiveModelDetails() async {
    final searchName = widget.modelName ?? widget.vehicleId;
    try {
      final liveData = await _dashboardService.fetchLiveModelDetails(searchName);
      if (liveData != null && mounted) {
        setState(() {
          _modelDetails = liveData;
        });
      }
    } catch (e) {
      debugPrint("Error loading live model details: $e");
    }
  }

  Widget _buildSmartImage(String src, {double? width, double? height, BoxFit fit = BoxFit.cover}) {
    final fallback = Container(
      width: width,
      height: height,
      color: const Color(0xFFF1F5F9),
      child: const Center(
        child: Icon(Icons.electric_scooter_rounded, size: 50, color: Color(0xFF4313B8)),
      ),
    );

    if (src.trim().isEmpty) return fallback;

    bool isBase64 = src.startsWith('data:image') ||
        (!src.startsWith('http') && !src.startsWith('assets') && src.length > 100);

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

    if (src.startsWith('http://') || src.startsWith('https://')) {
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

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        backgroundColor: const Color(0xFFFAFBFE),
        body: const Center(
          child: CircularProgressIndicator(color: Color(0xFF4313B8)),
        ),
      );
    }

    // Dynamic model data fallback map
    final data = _modelDetails ?? {};
    final String name = data['name'] ?? widget.modelName ?? "Evegah City";
    final String category = data['category'] ?? "E-Vehicle";
    final String tagline = data['tagline'] ?? "Stylish. Powerful. Eco-friendly.";
    final String rating = "${data['rating'] ?? 4.6}";
    final String reviewsCount = "${data['reviews_count'] ?? 128}";
    final String description = data['description'] ??
        "$name is built for the modern commuter. It combines performance, comfort and style with zero emissions. Perfect for daily rides in the city.";
    final String range = data['range'] ?? "90–110 km";
    final String topSpeed = data['top_speed'] ?? "60 km/h";
    final String batteryCapacity = data['battery_capacity'] ?? "2.3 kWh";
    final String brakes = data['brakes'] ?? "Disc Brakes (Front & Rear)";
    final String motorPower = data['motor_power'] ?? "2500 W";
    final String batteryType = data['battery_type'] ?? "Lithium-ion";
    final String wheelSize = data['wheel_size'] ?? "12 inch";
    final String waterResistance = data['water_resistance'] ?? "IP67";
    final String chargingTime = data['charging_time'] ?? "4 – 5 Hours";
    final String loadCapacity = data['load_capacity'] ?? "150 kg";
    final String warranty = data['warranty'] ?? "1 Year Warranty";

    String mainImage = data['main_image'] ?? "assets/city.png";
    if (mainImage.trim().isEmpty) {
      mainImage = "assets/city.png";
    }

    List<String> galleryImages = [];
    if (data['gallery_images'] != null) {
      try {
        if (data['gallery_images'] is List) {
          galleryImages = List<String>.from(data['gallery_images']);
        }
      } catch (e) {
        debugPrint("Error parsing gallery images: $e");
      }
    }

    if (galleryImages.isEmpty) {
      galleryImages = [
        mainImage,
        "assets/ev_baroda.png",
        "assets/mink_banner.png",
        "assets/Pro_Banner.png",
        "assets/city.png",
        "assets/mink.png",
      ];
    }

    Widget tabContent;
    switch (_currentTabIndex) {
      case 0:
        tabContent = _buildOverviewTabContent(
          description: description,
          range: range,
          topSpeed: topSpeed,
          batteryCapacity: batteryCapacity,
          brakes: brakes,
          motorPower: motorPower,
          batteryType: batteryType,
          wheelSize: wheelSize,
          waterResistance: waterResistance,
          chargingTime: chargingTime,
          loadCapacity: loadCapacity,
          warranty: warranty,
        );
        break;
      case 1:
        tabContent = _buildSpecificationsTabContent(
          motorPower: motorPower,
          batteryCapacity: batteryCapacity,
          batteryType: batteryType,
          brakes: brakes,
          range: range,
          wheelSize: wheelSize,
          topSpeed: topSpeed,
          waterResistance: waterResistance,
          chargingTime: chargingTime,
          loadCapacity: loadCapacity,
          warranty: warranty,
        );
        break;
      case 2:
        tabContent = _buildFeaturesTabContent();
        break;
      case 3:
        tabContent = _buildReviewsTabContent(rating, reviewsCount);
        break;
      case 4:
        tabContent = _buildFaqTabContent(name);
        break;
      default:
        tabContent = _buildOverviewTabContent(
          description: description,
          range: range,
          topSpeed: topSpeed,
          batteryCapacity: batteryCapacity,
          brakes: brakes,
          motorPower: motorPower,
          batteryType: batteryType,
          wheelSize: wheelSize,
          waterResistance: waterResistance,
          chargingTime: chargingTime,
          loadCapacity: loadCapacity,
          warranty: warranty,
        );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      body: SafeArea(
        child: Column(
          children: [
            // --- TOP APP BAR ---
            _buildTopAppBar(name),

            // --- MAIN SCROLLABLE BODY CONTENT ---
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // --- HERO VEHICLE HEADER ---
                    _buildHeroHeaderSection(
                      category: category,
                      name: name,
                      tagline: tagline,
                      rating: rating,
                      reviewsCount: reviewsCount,
                      range: range,
                      topSpeed: topSpeed,
                      batteryCapacity: batteryCapacity,
                      brakes: brakes,
                      mainImage: mainImage,
                    ),

                    const SizedBox(height: 20),

                    // --- MEDIA GALLERY GRID (MAIN PHOTO + VIDEO & THUMBNAILS) ---
                    _buildMediaGalleryGrid(galleryImages),

                    const SizedBox(height: 20),

                    // --- 5 TABS NAVIGATION BAR ---
                    _buildTabBar(reviewsCount),

                    const SizedBox(height: 16),

                    // --- TAB CONTENT AREA WITH SMOOTH ANIMATION ---
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 300),
                      switchInCurve: Curves.easeOutCubic,
                      switchOutCurve: Curves.easeInCubic,
                      transitionBuilder: (Widget child, Animation<double> animation) {
                        return FadeTransition(
                          opacity: animation,
                          child: SlideTransition(
                            position: Tween<Offset>(
                              begin: const Offset(0.03, 0.0),
                              end: Offset.zero,
                            ).animate(animation),
                            child: child,
                          ),
                        );
                      },
                      child: KeyedSubtree(
                        key: ValueKey<int>(_currentTabIndex),
                        child: tabContent,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // --- STICKY BOTTOM BOOK NOW ACTION BAR ---
            _buildStickyBottomActionBar(name),
          ],
        ),
      ),
    );
  }

  // --- 1. TOP APP BAR ---
  Widget _buildTopAppBar(String name) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      color: Colors.transparent,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Back Button
          GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 8,
                  ),
                ],
              ),
              child: const Icon(
                Icons.arrow_back_rounded,
                color: Color(0xFF0F172A),
                size: 20,
              ),
            ),
          ),

          // Title
          Flexible(
            child: Text(
              name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
            ),
          ),

          // Right Actions: Favorite & Share
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              GestureDetector(
                onTap: () {
                  setState(() {
                    _isFavorite = !_isFavorite;
                  });
                },
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  child: Icon(
                    _isFavorite ? Icons.favorite_rounded : Icons.favorite_outline_rounded,
                    color: _isFavorite ? Colors.red : const Color(0xFF0F172A),
                    size: 19,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              GestureDetector(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text("🔗 Share link copied for $name!"),
                      backgroundColor: const Color(0xFF4313B8),
                    ),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.share_outlined,
                    color: Color(0xFF0F172A),
                    size: 19,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // --- 2. HERO VEHICLE HEADER SECTION ---
  Widget _buildHeroHeaderSection({
    required String category,
    required String name,
    required String tagline,
    required String rating,
    required String reviewsCount,
    required String range,
    required String topSpeed,
    required String batteryCapacity,
    required String brakes,
    required String mainImage,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Left Column: Text Info
            Expanded(
              flex: 6,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 100% Electric Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFDCFCE7),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Icon(Icons.bolt_rounded, color: Color(0xFF15803D), size: 13),
                        SizedBox(width: 3),
                        Text(
                          "100% Electric",
                          style: TextStyle(
                            fontSize: 10.5,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF15803D),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Model Title
                  Text(
                    name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 4),

                  // Subtitle / Tagline
                  Text(
                    tagline,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 12.5,
                      color: Color(0xFF64748B),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Rating Row (★ 4.6 + (128 Reviews))
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF5B21B6),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.star_rounded, color: Colors.amber, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              rating,
                              style: const TextStyle(
                                fontSize: 11.5,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 6),
                      Flexible(
                        child: Text(
                          "($reviewsCount Reviews)",
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 11,
                            color: Color(0xFF64748B),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(width: 10),

            // Right Column: Vehicle Cutout Image Blob
            Expanded(
              flex: 5,
              child: SizedBox(
                height: 150,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 135,
                      height: 135,
                      decoration: const BoxDecoration(
                        color: Color(0xFFF3E8FF),
                        shape: BoxShape.circle,
                      ),
                    ),
                    _buildSmartImage(
                      mainImage,
                      fit: BoxFit.contain,
                      width: 160,
                      height: 145,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: 16),

        // 4 Spec Badges Row Across Full Width
        Row(
          children: [
            Expanded(child: _buildHeroSpecItem(Icons.motorcycle_rounded, range, "Range")),
            const SizedBox(width: 6),
            Expanded(child: _buildHeroSpecItem(Icons.speed_rounded, topSpeed, "Top Speed")),
            const SizedBox(width: 6),
            Expanded(child: _buildHeroSpecItem(Icons.battery_charging_full_rounded, batteryCapacity, "Battery")),
            const SizedBox(width: 6),
            Expanded(child: _buildHeroSpecItem(Icons.disc_full_rounded, "Disc Brakes", "Brakes")),
          ],
        ),
      ],
    );
  }

  Widget _buildHeroSpecItem(IconData icon, String title, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F3FF),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Icon(icon, color: const Color(0xFF5B21B6), size: 16),
          const SizedBox(height: 4),
          Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
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

  // --- 3. MEDIA GALLERY GRID ---
  Widget _buildMediaGalleryGrid(List<String> images) {
    final mainImage = images[_activeGalleryIndex % images.length];

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Left 55%: Main Photo Carousel Box
        Expanded(
          flex: 6,
          child: Container(
            height: 175,
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(18),
                  child: _buildSmartImage(
                    mainImage,
                    width: double.infinity,
                    height: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),

                // Index Badge
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.6),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      "${(_activeGalleryIndex % images.length) + 1}/${images.length}",
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),

                // Controls
                Positioned(
                  left: 6,
                  top: 70,
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _activeGalleryIndex =
                            (_activeGalleryIndex - 1 + images.length) % images.length;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.chevron_left_rounded, size: 18, color: Color(0xFF0F172A)),
                    ),
                  ),
                ),
                Positioned(
                  right: 6,
                  top: 70,
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _activeGalleryIndex = (_activeGalleryIndex + 1) % images.length;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.chevron_right_rounded, size: 18, color: Color(0xFF0F172A)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(width: 8),

        // Right 45%: Video Preview + 2 Close-up Thumbnails
        Expanded(
          flex: 5,
          child: Column(
            children: [
              // Top Right: Video Preview Thumbnail
              GestureDetector(
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      backgroundColor: Colors.black,
                      contentPadding: EdgeInsets.zero,
                      content: SizedBox(
                        width: 320,
                        height: 200,
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.play_circle_fill_rounded, color: Color(0xFFD2FC00), size: 60),
                            SizedBox(height: 12),
                            Text(
                              "⚡ Evegah EV Promo Video",
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
                child: Container(
                  height: 83,
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Stack(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(14),
                        child: _buildSmartImage(
                          images[1 % images.length],
                          width: double.infinity,
                          height: double.infinity,
                          fit: BoxFit.cover,
                        ),
                      ),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.35),
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      Center(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.55),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: Colors.white24),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: const [
                              Icon(Icons.play_circle_fill_rounded, color: Color(0xFF8B5CF6), size: 14),
                              SizedBox(width: 4),
                              Text(
                                "Watch Video",
                                style: TextStyle(
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 8),

              // Bottom 2 Side-by-Side Thumbnails
              Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _activeGalleryIndex = 2 % images.length;
                        });
                      },
                      child: Container(
                        height: 83,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(14),
                          child: _buildSmartImage(
                            images[2 % images.length],
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _activeGalleryIndex = 3 % images.length;
                        });
                      },
                      child: Container(
                        height: 83,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Stack(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(14),
                              child: _buildSmartImage(
                                images[3 % images.length],
                                width: double.infinity,
                                height: double.infinity,
                                fit: BoxFit.cover,
                              ),
                            ),
                            Container(
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.45),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: const Center(
                                child: Text(
                                  "+5",
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w900,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  // --- 4. TAB NAVIGATION BAR ---
  Widget _buildTabBar(String reviewsCount) {
    return Container(
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Color(0xFFF1F5F9), width: 1.5),
        ),
      ),
      child: TabBar(
        controller: _tabController,
        isScrollable: true,
        indicatorColor: const Color(0xFF5B21B6),
        indicatorWeight: 3,
        labelColor: const Color(0xFF5B21B6),
        unselectedLabelColor: const Color(0xFF64748B),
        labelStyle: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold),
        unselectedLabelStyle: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w500),
        tabs: [
          const Tab(text: "Overview"),
          const Tab(text: "Specifications"),
          const Tab(text: "Features"),
          Tab(text: "Reviews ($reviewsCount)"),
          const Tab(text: "FAQ"),
        ],
      ),
    );
  }

  // --- TAB 1: OVERVIEW ---
  Widget _buildOverviewTabContent({
    required String description,
    required String range,
    required String topSpeed,
    required String batteryCapacity,
    required String brakes,
    required String motorPower,
    required String batteryType,
    required String wheelSize,
    required String waterResistance,
    required String chargingTime,
    required String loadCapacity,
    required String warranty,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          description,
          style: const TextStyle(
            fontSize: 12.5,
            color: Color(0xFF475569),
            height: 1.45,
          ),
        ),
        const SizedBox(height: 16),

        // 8 Feature Highlight Cards
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                children: const [
                  _OverviewFeatureCard(Icons.eco_rounded, "Eco Friendly", "Zero Emission", Color(0xFFF0FDF4), Color(0xFF16A34A)),
                  SizedBox(height: 8),
                  _OverviewFeatureCard(Icons.currency_rupee_rounded, "Low Running Cost", "Save more daily", Color(0xFFF5F3FF), Color(0xFF5B21B6)),
                  SizedBox(height: 8),
                  _OverviewFeatureCard(Icons.chair_rounded, "Comfortable Seat", "Long ride comfort", Color(0xFFF5F3FF), Color(0xFF5B21B6)),
                  SizedBox(height: 8),
                  _OverviewFeatureCard(Icons.lightbulb_rounded, "LED Lights", "Bright & Clear", Color(0xFFF5F3FF), Color(0xFF5B21B6)),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                children: const [
                  _OverviewFeatureCard(Icons.bolt_rounded, "Quick Charge", "4–5 Hours", Color(0xFFFEF3C7), Color(0xFFD97706)),
                  SizedBox(height: 8),
                  _OverviewFeatureCard(Icons.desktop_windows_rounded, "Smart Display", "Digital Console", Color(0xFFF5F3FF), Color(0xFF5B21B6)),
                  SizedBox(height: 8),
                  _OverviewFeatureCard(Icons.disc_full_rounded, "Tubeless Tyres", "Better Grip", Color(0xFFF5F3FF), Color(0xFF5B21B6)),
                  SizedBox(height: 8),
                  _OverviewFeatureCard(Icons.verified_user_rounded, "Warranty", "1 Year Warranty", Color(0xFFF5F3FF), Color(0xFF5B21B6)),
                ],
              ),
            ),
          ],
        ),

        const SizedBox(height: 18),
      ],
    );
  }

  // --- TAB 2: SPECIFICATIONS ---
  Widget _buildSpecificationsTabContent({
    required String motorPower,
    required String batteryCapacity,
    required String batteryType,
    required String brakes,
    required String range,
    required String wheelSize,
    required String topSpeed,
    required String waterResistance,
    required String chargingTime,
    required String loadCapacity,
    required String warranty,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Technical Specifications",
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFF1F5F9)),
          ),
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(child: _SpecGridRowItem(Icons.bolt_rounded, "Motor Power", motorPower)),
                  Expanded(child: _SpecGridRowItem(Icons.battery_charging_full_rounded, "Battery Capacity", batteryCapacity)),
                ],
              ),
              const Divider(height: 14, color: Color(0xFFF1F5F9)),
              Row(
                children: [
                  Expanded(child: _SpecGridRowItem(Icons.battery_full_rounded, "Battery Type", batteryType)),
                  Expanded(child: _SpecGridRowItem(Icons.disc_full_rounded, "Brakes", brakes)),
                ],
              ),
              const Divider(height: 14, color: Color(0xFFF1F5F9)),
              Row(
                children: [
                  Expanded(child: _SpecGridRowItem(Icons.motorcycle_rounded, "Range", range)),
                  Expanded(child: _SpecGridRowItem(Icons.tire_repair_rounded, "Wheel Size", wheelSize)),
                ],
              ),
              const Divider(height: 14, color: Color(0xFFF1F5F9)),
              Row(
                children: [
                  Expanded(child: _SpecGridRowItem(Icons.speed_rounded, "Top Speed", topSpeed)),
                  Expanded(child: _SpecGridRowItem(Icons.water_drop_rounded, "Water Resistance", waterResistance)),
                ],
              ),
              const Divider(height: 14, color: Color(0xFFF1F5F9)),
              Row(
                children: [
                  Expanded(child: _SpecGridRowItem(Icons.power_rounded, "Charging Time", chargingTime)),
                  Expanded(child: _SpecGridRowItem(Icons.lock_rounded, "Load Capacity", loadCapacity)),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSpecDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
          ),
        ],
      ),
    );
  }

  // --- TAB 3: FEATURES ---
  Widget _buildFeaturesTabContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: const [
        Text("Highlight Features", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
        SizedBox(height: 10),
        _OverviewFeatureCard(Icons.bluetooth_rounded, "Bluetooth BMS", "Live Telemetry & Battery Monitoring", Color(0xFFF5F3FF), Color(0xFF5B21B6)),
        SizedBox(height: 8),
        _OverviewFeatureCard(Icons.lock_rounded, "Smart Remote Lock", "Keyless Anti-Theft Protection", Color(0xFFF0FDF4), Color(0xFF16A34A)),
        SizedBox(height: 8),
        _OverviewFeatureCard(Icons.lightbulb_rounded, "Full LED Headlamp", "Bright Day & Night Visibility", Color(0xFFFEF3C7), Color(0xFFD97706)),
        SizedBox(height: 8),
        _OverviewFeatureCard(Icons.verified_rounded, "Roadside Assistance", "24/7 On-Demand Rider Support", Color(0xFFE0F2FE), Color(0xFF0284C7)),
      ],
    );
  }

  // --- TAB 4: REVIEWS ---
  Widget _buildReviewsTabContent(String rating, String reviewsCount) {
    final int count = int.tryParse(reviewsCount) ?? 10;
    final int displayCount = count.clamp(1, 20); // Show up to 20 reviews for list layout sanity

    const List<String> indianNames = [
      "Aarav Sharma", "Priya Patel", "Rohit Verma", "Amit Gupta", "Sneha Reddy",
      "Rohan Das", "Ananya Iyer", "Vikram Malhotra", "Meera Nair", "Deepak Joshi",
      "Siddharth Rao", "Kirti Singh", "Abhishek Kumar", "Neha Choudhury", "Aditya Mishra",
      "Tanvi Sen", "Suresh Pillai", "Arjun Mehta", "Shreya Bhat", "Manish Saxena"
    ];

    const List<String> reviewsTexts = [
      "Amazing EV! Super smooth acceleration and range is completely accurate.",
      "Extremely comfortable seat for daily commuting across Vadodara.",
      "Affordable daily rate and very quick charging. Highly recommended!",
      "Excellent build quality. The digital display console is very responsive.",
      "Zero vibrations, quiet and powerful ride. Best scooter in this segment.",
      "Smooth suspension handles Indian city roads beautifully. Very happy with the performance.",
      "Extremely cost-effective for my college commute. Safe and steady handling.",
      "Battery backup is superb. Got almost 100km range on a single charge!",
      "Easy pickup from the station hub and staff was extremely helpful.",
      "Saves me so much money on petrol. Best switch I've made this year!",
      "Great braking power and the tubeless tires offer excellent grip on wet roads.",
      "IP67 water resistance is great for monsoon rides. Value for money."
    ];

    const List<double> reviewRatings = [5.0, 4.8, 4.9, 4.7, 5.0, 4.6, 4.8, 5.0, 4.7, 4.9];

    final List<Widget> reviewCards = [];
    for (int i = 0; i < displayCount; i++) {
      final name = indianNames[i % indianNames.length];
      final text = reviewsTexts[i % reviewsTexts.length];
      final double rVal = reviewRatings[i % reviewRatings.length];
      
      reviewCards.add(
        _ReviewCard(name, rVal.toStringAsFixed(1), text),
      );
      if (i < displayCount - 1) {
        reviewCards.add(const SizedBox(height: 8));
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(rating, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: List.generate(
                    5,
                    (i) => const Icon(Icons.star_rounded, color: Colors.amber, size: 15),
                  ),
                ),
                const SizedBox(height: 2),
                Text("Based on $reviewsCount verified rider reviews", style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
              ],
            ),
          ],
        ),
        const SizedBox(height: 14),
        ...reviewCards,
      ],
    );
  }

  // --- TAB 5: FAQ ---
  Widget _buildFaqTabContent(String name) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _FaqTile("What documents are required to rent $name?", "You only need a valid Driving License and Aadhaar KYC completion."),
        _FaqTile("How do I charge the battery?", "You can plug into any standard 5A home socket or visit Evegah Charging Hubs."),
        _FaqTile("Is helmet provided with the vehicle?", "Yes! Complimentary sanitized helmet is provided at the pickup zone."),
      ],
    );
  }

  // --- 6. STICKY BOTTOM ACTION BAR (FULL-WIDTH BOOK NOW BUTTON) ---
  Widget _buildStickyBottomActionBar(String name) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: const Border(top: BorderSide(color: Color(0xFFF1F5F9))),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SizedBox(
        width: double.infinity,
        height: 48,
        child: ElevatedButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const RentEvScreen(),
              ),
            );
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF4313B8),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
            ),
            elevation: 3,
            shadowColor: const Color(0xFF4313B8).withValues(alpha: 0.3),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Text(
                "⚡ Book Now",
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                  letterSpacing: 0.3,
                ),
              ),
              SizedBox(width: 8),
              Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
            ],
          ),
        ),
      ),
    );
  }
}

// --- HELPER WIDGETS ---
class _OverviewFeatureCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color bgColor;
  final Color iconColor;

  const _OverviewFeatureCard(this.icon, this.title, this.subtitle, this.bgColor, this.iconColor);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(7),
            decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: iconColor, size: 15),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 1),
                Text(
                  subtitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 9, color: Color(0xFF64748B)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SpecGridRowItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;

  const _SpecGridRowItem(this.icon, this.title, this.value);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: const Color(0xFF5B21B6), size: 14),
        const SizedBox(width: 5),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 9, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 1),
              Text(
                value,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ReviewCard extends StatelessWidget {
  final String name;
  final String rating;
  final String comment;

  const _ReviewCard(this.name, this.rating, this.comment);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(name, style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
              Row(
                children: [
                  const Icon(Icons.star_rounded, color: Colors.amber, size: 12),
                  const SizedBox(width: 3),
                  Text(rating, style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(comment, style: const TextStyle(fontSize: 10.5, color: Color(0xFF475569))),
        ],
      ),
    );
  }
}

class _FaqTile extends StatelessWidget {
  final String question;
  final String answer;

  const _FaqTile(this.question, this.answer);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: ExpansionTile(
        title: Text(question, style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 0, 14, 10),
            child: Text(answer, style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B), height: 1.35)),
          ),
        ],
      ),
    );
  }
}