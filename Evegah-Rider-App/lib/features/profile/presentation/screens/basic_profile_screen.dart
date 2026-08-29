import 'package:flutter/material.dart';
import '../../data/services/profile_service.dart';
import '../../../kyc/presentation/screens/kyc_screen.dart';

class BasicProfileScreen extends StatefulWidget {
  const BasicProfileScreen({super.key});

  @override
  State<BasicProfileScreen> createState() => _BasicProfileScreenState();
}

class _BasicProfileScreenState extends State<BasicProfileScreen> {
  static const Color brandPurple = Color(0xFF6B4BFF);
  static const Color brandPurpleDark = Color(0xFF4313B8);
  static const Color lightPurpleBg = Color(0xFFF5F3FF);

  static const Color pageBackground = Color(0xFFFAFBFE);
  static const Color darkText = Color(0xFF0F172A);
  static const Color secondaryText = Color(0xFF64748B);
  static const Color inputBorder = Color(0xFFE2E8F0);

  final ProfileService _profileService = ProfileService();

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _dobController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _aadhaarController = TextEditingController();

  String _selectedGender = "Male";
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    await _profileService.fetchUserData();

    if (!mounted) return;

    setState(() {
      _nameController.text = _profileService.userName;

      _dobController.text = _profileService.dateOfBirth.isNotEmpty
          ? _profileService.dateOfBirth
          : "";

      _addressController.text = _profileService.userAddress.isNotEmpty
          ? _profileService.userAddress
          : "";

      _aadhaarController.text = _profileService.aadhaarNumber.isNotEmpty
          ? _profileService.aadhaarNumber
          : "";

      _selectedGender = _profileService.userGender.isNotEmpty
          ? _profileService.userGender
          : "Male";
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _dobController.dispose();
    _addressController.dispose();
    _aadhaarController.dispose();
    super.dispose();
  }

  Future<void> _selectDateOfBirth() async {
    FocusScope.of(context).unfocus();

    DateTime initialDate = DateTime(1996, 1, 15);

    final DateTime? selectedDate = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: brandPurple,
              onPrimary: Colors.white,
              surface: Colors.white,
              onSurface: darkText,
            ),
          ),
          child: child!,
        );
      },
    );

    if (selectedDate != null) {
      final String formattedDate =
          "${selectedDate.day.toString().padLeft(2, '0')} / "
          "${selectedDate.month.toString().padLeft(2, '0')} / "
          "${selectedDate.year}";

      setState(() {
        _dobController.text = formattedDate;
      });
    }
  }

  Future<void> _saveProfile() async {
    FocusScope.of(context).unfocus();

    final name = _nameController.text.trim();
    final dob = _dobController.text.trim();
    final address = _addressController.text.trim();

    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Please enter your full name."),
        ),
      );
      return;
    }

    setState(() => _isSaving = true);

    try {
      await _profileService.updateFullProfile(
        name: name,
        userEmail: _profileService.email,
        userDateOfBirth: dob,
        userAddress: address,
        enableBiometric: _profileService.isBiometricEnabled,
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Profile updated successfully!"),
          backgroundColor: Colors.green,
        ),
      );

      await Future.delayed(
        const Duration(milliseconds: 500),
      );

      if (!mounted) return;

      Navigator.pop(context);
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Unable to save profile."),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(
        bottom: 8,
        left: 2,
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w700,
          color: darkText,
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String hint,
    required IconData prefixIcon,
    IconData? suffixIcon,
    required TextEditingController controller,
    VoidCallback? onTap,
    bool readOnly = false,
    int maxLines = 1,
  }) {
    return Container(
      constraints: BoxConstraints(
        minHeight: maxLines > 1 ? 100 : 58,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: inputBorder,
          width: 1,
        ),
      ),
      child: Row(
        crossAxisAlignment: maxLines > 1
            ? CrossAxisAlignment.start
            : CrossAxisAlignment.center,
        children: [
          Padding(
            padding: EdgeInsets.only(
              left: 16,
              top: maxLines > 1 ? 18 : 0,
            ),
            child: Icon(
              prefixIcon,
              color: brandPurple,
              size: 22,
            ),
          ),

          const SizedBox(width: 12),

          Expanded(
            child: TextField(
              controller: controller,
              readOnly: readOnly || onTap != null,
              onTap: onTap,
              maxLines: maxLines,
              minLines: maxLines > 1 ? 3 : 1,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: darkText,
              ),
              decoration: InputDecoration(
                hintText: hint,
                hintStyle: const TextStyle(
                  color: Color(0xFF94A3B8),
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                disabledBorder: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.symmetric(
                  vertical: maxLines > 1 ? 16 : 0,
                ),
              ),
            ),
          ),

          if (suffixIcon != null)
            Padding(
              padding: const EdgeInsets.only(
                right: 16,
                left: 10,
              ),
              child: Icon(
                suffixIcon,
                color: brandPurple,
                size: 21,
              ),
            )
          else
            const SizedBox(width: 16),
        ],
      ),
    );
  }

  Widget _buildGenderOption(
    String title,
    IconData icon,
  ) {
    final bool isSelected = _selectedGender == title;

    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedGender = title;
          });
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          height: 78,
          decoration: BoxDecoration(
            color: isSelected ? lightPurpleBg : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected
                  ? brandPurple
                  : inputBorder,
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                color: isSelected
                    ? brandPurple
                    : secondaryText,
                size: 21,
              ),
              const SizedBox(height: 6),
              Text(
                title,
                style: TextStyle(
                  color: isSelected
                      ? brandPurple
                      : const Color(0xFF475569),
                  fontWeight: isSelected
                      ? FontWeight.w700
                      : FontWeight.w600,
                  fontSize: 13,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackground,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(
                20,
                16,
                20,
                0,
              ),
              child: Align(
                alignment: Alignment.centerLeft,
                child: GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: const Color(0xFFEFF2F6),
                      ),
                    ),
                    child: const Icon(
                      Icons.chevron_left_rounded,
                      size: 28,
                      color: darkText,
                    ),
                  ),
                ),
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(
                  20,
                  24,
                  20,
                  40,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // HEADER BANNER
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: lightPurpleBg,
                        borderRadius: BorderRadius.circular(24),
                        image: const DecorationImage(
                          image: AssetImage(
                            "assets/profile_edit.png",
                          ),
                          fit: BoxFit.cover,
                          opacity: 0.8,
                        ),
                      ),
                      child: const Column(
                        crossAxisAlignment:
                            CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Edit Profile",
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w800,
                              color: darkText,
                              letterSpacing: -0.5,
                            ),
                          ),
                          SizedBox(height: 10),
                          SizedBox(
                            width: 250,
                            child: Text(
                              "Update your personal details below to keep your account current",
                              style: TextStyle(
                                fontSize: 14,
                                color: Color(0xFF334155),
                                fontWeight: FontWeight.w500,
                                height: 1.45,
                              ),
                            ),
                          ),
                          SizedBox(height: 36),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // FORM CARD
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: const Color(0xFFEFF2F6),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment:
                            CrossAxisAlignment.start,
                        children: [
                          _buildLabel("Full Name"),
                          _buildTextField(
                            hint: "Enter your full name",
                            prefixIcon:
                                Icons.person_outline_rounded,
                            controller: _nameController,
                          ),

                          const SizedBox(height: 24),

                          _buildLabel("Gender"),

                          Row(
                            children: [
                              _buildGenderOption(
                                "Male",
                                Icons.male_rounded,
                              ),
                              const SizedBox(width: 8),
                              _buildGenderOption(
                                "Female",
                                Icons.female_rounded,
                              ),
                              const SizedBox(width: 8),
                              _buildGenderOption(
                                "Other",
                                Icons.transgender_rounded,
                              ),
                            ],
                          ),

                          const SizedBox(height: 24),

                          _buildLabel("Date of Birth"),

                          _buildTextField(
                            hint: "DD / MM / YYYY",
                            prefixIcon:
                                Icons.calendar_month_outlined,
                            suffixIcon:
                                Icons.calendar_today_rounded,
                            controller: _dobController,
                            onTap: _selectDateOfBirth,
                            readOnly: true,
                          ),

                          const SizedBox(height: 24),

                          _buildLabel("Address"),

                          _buildTextField(
                            hint: "Enter your full address",
                            prefixIcon:
                                Icons.location_on_outlined,
                            controller: _addressController,
                            maxLines: 3,
                          ),

                          // AADHAAR NUMBER FIELD - AVAILABLE AFTER KYC DONE
                          if (_profileService.kycStatus == "Approved" ||
                              _profileService.kycStatus == "Verified" ||
                              _profileService.aadhaarNumber.isNotEmpty) ...[
                            const SizedBox(height: 24),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                _buildLabel("Aadhaar Number"),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFDCFCE7),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(Icons.verified_user_rounded, size: 12, color: Color(0xFF16A34A)),
                                      SizedBox(width: 4),
                                      Text(
                                        "KYC Verified",
                                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            _buildTextField(
                              hint: "XXXX XXXX XXXX",
                              prefixIcon: Icons.badge_outlined,
                              controller: _aadhaarController,
                              readOnly: true,
                            ),
                          ] else ...[
                            const SizedBox(height: 24),
                            _buildLabel("Aadhaar Number"),
                            Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF8FAFC),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: const Color(0xFFE2E8F0)),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.lock_outline_rounded, color: Color(0xFF94A3B8), size: 20),
                                  const SizedBox(width: 10),
                                  const Expanded(
                                    child: Text(
                                      "Available after KYC completion",
                                      style: TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                                    ),
                                  ),
                                  ElevatedButton(
                                    onPressed: () {
                                      Navigator.push(context, MaterialPageRoute(builder: (_) => const KycScreen()));
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF4313B8),
                                      foregroundColor: Colors.white,
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      minimumSize: Size.zero,
                                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      elevation: 0,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                    ),
                                    child: const Text("Do KYC", style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold)),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // SECURITY CARD
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: lightPurpleBg,
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: const BoxDecoration(
                              color: brandPurple,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.verified_user_outlined,
                              color: Colors.white,
                              size: 22,
                            ),
                          ),
                          const SizedBox(width: 14),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment:
                                  CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "Your information is secure",
                                  style: TextStyle(
                                    color: darkText,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 14,
                                  ),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  "We use industry-standard security to protect your personal data.",
                                  style: TextStyle(
                                    color: secondaryText,
                                    fontSize: 12,
                                    height: 1.35,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // SAVE BUTTON
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed:
                            _isSaving ? null : _saveProfile,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: brandPurple,
                          disabledBackgroundColor:
                              brandPurple.withOpacity(0.6),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.circular(16),
                          ),
                        ),
                        child: _isSaving
                            ? const SizedBox(
                                width: 24,
                                height: 24,
                                child:
                                    CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2.5,
                                ),
                              )
                            : const Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.center,
                                children: [
                                  Text(
                                    "Save Changes",
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 16,
                                      fontWeight:
                                          FontWeight.bold,
                                    ),
                                  ),
                                  SizedBox(width: 8),
                                  Icon(
                                    Icons.arrow_forward_rounded,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                                ],
                              ),
                      ),
                    ),

                    const SizedBox(height: 18),

                    // FOOTER
                    const Row(
                      mainAxisAlignment:
                          MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.lock_outline_rounded,
                          color: secondaryText,
                          size: 14,
                        ),
                        SizedBox(width: 6),
                        Text(
                          "Secure  •  Private  •  Trusted",
                          style: TextStyle(
                            color: secondaryText,
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
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