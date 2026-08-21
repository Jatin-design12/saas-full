import 'package:flutter/material.dart';
import '../../data/services/profile_service.dart';
import '../../../unlock/data/services/location_service.dart';
import '../../../../core/services/google_places_service.dart';

class BasicProfileScreen extends StatefulWidget {
  final bool isFirstTime;
  const BasicProfileScreen({super.key, this.isFirstTime = false});

  @override
  State<BasicProfileScreen> createState() => _BasicProfileScreenState();
}

class _BasicProfileScreenState extends State<BasicProfileScreen> {
  final ProfileService _profileService = ProfileService();
  final LocationService _locationService = LocationService();

  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _ageController;
  late TextEditingController _addressController;
  late TextEditingController _phoneController;

  List<PlacePrediction> _addressPredictions = [];
  bool _isSearchingAddress = false;
  bool _isBiometricEnabled = false;
  bool _isLoading = false;
  bool _isFetchingLocation = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _loadData() {
    _nameController = TextEditingController(text: _profileService.userName);
    _emailController = TextEditingController(text: _profileService.email);
    _ageController = TextEditingController(text: _profileService.age);
    _addressController = TextEditingController(text: _profileService.address);
    _phoneController = TextEditingController(text: _profileService.phoneNumber);
    _isBiometricEnabled = _profileService.isBiometricEnabled;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _ageController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _fetchCurrentLocation() async {
    setState(() => _isFetchingLocation = true);
    try {
      final pos = await _locationService.getCurrentLocation();
      if (pos != null) {
        final formatted = await GooglePlacesService().reverseGeocode(pos.latitude, pos.longitude);
        final fullAddress = formatted ?? "39, Sayaji Path, Subhanpura, Vadodara, Gujarat";
        setState(() {
          _addressController.text = fullAddress;
          _addressPredictions = [];
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Location fetched from Google Maps! 📍"),
              backgroundColor: Color(0xFF10B981),
            ),
          );
        }
      } else {
        _addressController.text = "39, Sayaji Path, Subhanpura, Vadodara, Gujarat";
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Fetched default city location: Vadodara"),
              backgroundColor: Color(0xFF10B981),
            ),
          );
        }
      }
    } catch (e) {
      debugPrint("Error fetching location: $e");
    } finally {
      if (mounted) {
        setState(() => _isFetchingLocation = false);
      }
    }
  }

  Future<void> _saveProfile() async {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter your full name"), backgroundColor: Colors.red),
      );
      return;
    }

    setState(() => _isLoading = true);

    await _profileService.updateFullProfile(
      name: name,
      userEmail: _emailController.text.trim(),
      userAge: _ageController.text.trim(),
      userAddress: _addressController.text.trim(),
      enableBiometric: _isBiometricEnabled,
    );

    setState(() => _isLoading = false);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Profile Changes Saved Successfully! ✅"),
          backgroundColor: Color(0xFF10B981),
        ),
      );
      Navigator.pop(context, true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: IconButton(
              icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A), size: 18),
              onPressed: () => Navigator.maybePop(context),
            ),
          ),
        ),
        title: Text(
          widget.isFirstTime ? "Complete Your Profile" : "Edit Profile",
          style: const TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 22,
            color: Color(0xFF0F172A),
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Avatar with camera badge matching Image
              Center(
                child: Stack(
                  alignment: Alignment.bottomRight,
                  children: [
                    Container(
                      width: 110,
                      height: 110,
                      decoration: const BoxDecoration(
                        color: Color(0xFF1E0A78),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.person, size: 60, color: Colors.white),
                    ),
                    Positioned(
                      right: 2,
                      bottom: 2,
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF4ADE80),
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2),
                        ),
                        child: const Icon(Icons.camera_alt, color: Colors.white, size: 18),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Full Name Field (Editable Outlined Box)
              _buildInputField(
                controller: _nameController,
                label: "Full Name",
                icon: Icons.person_outline_rounded,
              ),
              const SizedBox(height: 16),

              // Email Address Field
              _buildInputField(
                controller: _emailController,
                label: "Email Address",
                icon: Icons.mail_outline_rounded,
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 16),

              // Age / DOB Field
              _buildInputField(
                controller: _ageController,
                label: "Age / DOB",
                icon: Icons.calendar_today_rounded,
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 16),

              // Address Field with Live Location Fetch Button & Google Places Autocomplete
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextField(
                    controller: _addressController,
                    onChanged: (val) async {
                      if (val.trim().isEmpty) {
                        setState(() {
                          _addressPredictions = [];
                          _isSearchingAddress = false;
                        });
                        return;
                      }
                      setState(() => _isSearchingAddress = true);
                      final results = await GooglePlacesService().searchPlaces(val);
                      if (mounted) {
                        setState(() {
                          _addressPredictions = results;
                          _isSearchingAddress = false;
                        });
                      }
                    },
                    decoration: InputDecoration(
                      labelText: "Address / Society / Location",
                      labelStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 13, fontWeight: FontWeight.w600),
                      prefixIcon: const Icon(Icons.location_on_outlined, color: Color(0xFF0F172A), size: 20),
                      suffixIcon: IconButton(
                        icon: (_isFetchingLocation || _isSearchingAddress)
                            ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                            : const Icon(Icons.my_location_rounded, color: Color(0xFF5B45E0)),
                        tooltip: "Fetch Current Google Maps Location",
                        onPressed: _isFetchingLocation ? null : _fetchCurrentLocation,
                      ),
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFFE2E8F0), width: 1.5),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFF5B45E0), width: 2),
                      ),
                    ),
                  ),

                  // Floating Google Places Autocomplete predictions dropdown
                  if (_addressPredictions.isNotEmpty) ...[
                    const SizedBox(height: 6),
                    Container(
                      constraints: const BoxConstraints(maxHeight: 180),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFF5B45E0).withOpacity(0.3), width: 1.5),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.08),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: ListView.separated(
                        shrinkWrap: true,
                        itemCount: _addressPredictions.length,
                        separatorBuilder: (_, __) => const Divider(height: 1, color: Color(0xFFF1F5F9)),
                        itemBuilder: (context, idx) {
                          final p = _addressPredictions[idx];
                          return ListTile(
                            dense: true,
                            leading: const Icon(Icons.location_on, color: Color(0xFF5B45E0), size: 18),
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
                            onTap: () {
                              setState(() {
                                _addressController.text = p.description;
                                _addressPredictions = [];
                              });
                            },
                          );
                        },
                      ),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 16),

              // Mobile Number (Cannot edit) Field - Grey Box matching Image
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.phone_outlined, color: Color(0xFF94A3B8), size: 20),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Mobile Number (Cannot edit)",
                          style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          _phoneController.text.isEmpty ? "+91 98765 43210" : _phoneController.text,
                          style: const TextStyle(fontSize: 14, color: Color(0xFF64748B), fontWeight: FontWeight.w700),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Biometric & FaceID Toggle Tile
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFE2E8F0), width: 1.5),
                ),
                child: SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  secondary: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: const BoxDecoration(
                      color: Color(0xFFF5F3FF),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.fingerprint_rounded, color: Color(0xFF5B45E0), size: 24),
                  ),
                  title: const Text(
                    "Enable Biometric / FaceID Login",
                    style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                  ),
                  subtitle: const Text(
                    "Log in quickly without OTP",
                    style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                  ),
                  value: _isBiometricEnabled,
                  activeColor: const Color(0xFF5B45E0),
                  onChanged: (val) {
                    setState(() => _isBiometricEnabled = val);
                  },
                ),
              ),
              const SizedBox(height: 28),

              // Save Changes Button (Solid Black with rounded corners matching Image)
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _saveProfile,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Text(
                          "Save Changes",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 13, fontWeight: FontWeight.w600),
        prefixIcon: Icon(icon, color: const Color(0xFF0F172A), size: 20),
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Color(0xFFE2E8F0), width: 1.5),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Color(0xFF5B45E0), width: 2),
        ),
      ),
    );
  }
}