import 'package:flutter/material.dart';

import '../../data/services/profile_service.dart';

class BasicProfileScreen extends StatefulWidget {
  const BasicProfileScreen({super.key});

  @override
  State<BasicProfileScreen> createState() => _BasicProfileScreenState();
}

class _BasicProfileScreenState extends State<BasicProfileScreen> {
  // =========================================================
  // COLORS
  // =========================================================

  static const Color pageBackground = Color(0xFFF9FAFF);
  static const Color darkText = Color(0xFF111827);
  static const Color greyText = Color(0xFF718096);
  static const Color lightBorder = Color(0xFFE1E5EC);
  static const Color brandPurple = Color(0xFF5630B5);
  static const Color brightPurple = Color(0xFF5426C7);
  static const Color lightPurple = Color(0xFFF3EFFF);

  // =========================================================
  // SERVICE
  // =========================================================

  final ProfileService _profileService = ProfileService();

  // =========================================================
  // CONTROLLERS
  // =========================================================

  final TextEditingController _nameController =
      TextEditingController();

  final TextEditingController _dobController =
      TextEditingController();

  final TextEditingController _addressController =
      TextEditingController();

  // =========================================================
  // STATE
  // =========================================================

  String _selectedGender = "Male";

  bool _isSaving = false;

  // =========================================================
  // INIT
  // =========================================================

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

      // IMPORTANT:
      // Use dateOfBirth instead of age.
      _dobController.text =
          _profileService.dateOfBirth;

      _addressController.text =
          _profileService.userAddress;

      _selectedGender =
          _profileService.userGender;
    });
  }

  // =========================================================
  // DISPOSE
  // =========================================================

  @override
  void dispose() {
    _nameController.dispose();
    _dobController.dispose();
    _addressController.dispose();

    super.dispose();
  }

  // =========================================================
  // DATE OF BIRTH PICKER
  // =========================================================

  Future<void> _selectDateOfBirth() async {
    FocusScope.of(context).unfocus();

    DateTime initialDate = DateTime(
      DateTime.now().year - 24,
      DateTime.now().month,
      DateTime.now().day,
    );

    final existingDate =
        _parseDate(_dobController.text);

    if (existingDate != null) {
      initialDate = existingDate;
    }

    final DateTime? selectedDate =
        await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      helpText: "SELECT DATE OF BIRTH",
      cancelText: "CANCEL",
      confirmText: "SELECT",
      builder: (
        BuildContext context,
        Widget? child,
      ) {
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

    if (selectedDate == null) return;

    final String formattedDate =
        "${selectedDate.day.toString().padLeft(2, '0')}/"
        "${selectedDate.month.toString().padLeft(2, '0')}/"
        "${selectedDate.year}";

    setState(() {
      _dobController.text = formattedDate;
    });
  }

  // =========================================================
  // PARSE DOB
  // =========================================================

  DateTime? _parseDate(String value) {
    try {
      final parts = value.split('/');

      if (parts.length == 3) {
        final day = int.parse(parts[0]);
        final month = int.parse(parts[1]);
        final year = int.parse(parts[2]);

        final date = DateTime(
          year,
          month,
          day,
        );

        // Make sure invalid dates aren't accepted.
        if (date.day == day &&
            date.month == month &&
            date.year == year) {
          return date;
        }
      }
    } catch (_) {}

    return null;
  }

  // =========================================================
  // VALIDATE DOB
  // =========================================================

  bool _isValidDob(String value) {
    final date = _parseDate(value);

    if (date == null) {
      return false;
    }

    final now = DateTime.now();

    if (date.isAfter(now)) {
      return false;
    }

    return true;
  }

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  Future<void> _saveProfile() async {
    FocusScope.of(context).unfocus();

    final name =
        _nameController.text.trim();

    final dob =
        _dobController.text.trim();

    final address =
        _addressController.text.trim();

    // -----------------------------
    // NAME VALIDATION
    // -----------------------------

    if (name.isEmpty) {
      _showMessage(
        "Please enter your full name.",
      );
      return;
    }

    // -----------------------------
    // DOB VALIDATION
    // -----------------------------

    if (dob.isEmpty) {
      _showMessage(
        "Please enter your date of birth.",
      );
      return;
    }

    if (!_isValidDob(dob)) {
      _showMessage(
        "Please enter a valid date of birth in DD/MM/YYYY format.",
      );
      return;
    }

    // -----------------------------
    // ADDRESS VALIDATION
    // -----------------------------

    if (address.isEmpty) {
      _showMessage(
        "Please enter your address.",
      );
      return;
    }

    setState(() {
      _isSaving = true;
    });

    try {
      // IMPORTANT:
      // userDateOfBirth instead of userAge.
      await _profileService.updateFullProfile(
        name: name,
        userEmail: _profileService.email,
        userDateOfBirth: dob,
        userAddress: address,
        enableBiometric:
            _profileService.isBiometricEnabled,
      );

      if (!mounted) return;

      _showMessage(
        "Profile saved successfully.",
        success: true,
      );

      await Future.delayed(
        const Duration(milliseconds: 500),
      );

      if (!mounted) return;

      Navigator.pop(context);
    } catch (e) {
      debugPrint(
        "Profile save error: $e",
      );

      if (!mounted) return;

      _showMessage(
        "Unable to save profile. Please try again.",
      );
    } finally {
      if (mounted) {
        setState(() {
          _isSaving = false;
        });
      }
    }
  }

  // =========================================================
  // MESSAGE
  // =========================================================

  void _showMessage(
    String message, {
    bool success = false,
  }) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor:
              success
                  ? Colors.green
                  : Colors.redAccent,
          behavior:
              SnackBarBehavior.floating,
          margin:
              const EdgeInsets.all(16),
          shape:
              RoundedRectangleBorder(
            borderRadius:
                BorderRadius.circular(14),
          ),
        ),
      );
  }

  // =========================================================
  // INPUT FIELD
  //
  // IMPORTANT:
  // The TextField has:
  // - NO inner border
  // - NO white background
  // - NO second rectangle
  //
  // Only the outer Container has the border.
  // =========================================================

  Widget _buildInputField({
    required IconData icon,
    required TextEditingController controller,
    required String hint,
    TextInputType keyboardType =
        TextInputType.text,
    Widget? trailing,
    VoidCallback? onTap,
    bool readOnly = false,
  }) {
    return Container(
      height: 78,

      decoration: BoxDecoration(
        color: Colors.transparent,

        border: Border.all(
          color: lightBorder,
          width: 2,
        ),

        borderRadius:
            BorderRadius.circular(22),
      ),

      child: Row(
        children: [

          // =================================================
          // LEFT ICON
          // =================================================

          SizedBox(
            width: 76,
            child: Center(
              child: Icon(
                icon,
                color: greyText,
                size: 28,
              ),
            ),
          ),

          // =================================================
          // DIVIDER
          // =================================================

          Container(
            width: 1,
            height: 42,
            color: lightBorder,
          ),

          // =================================================
          // TEXT FIELD
          //
          // NO INNER BORDER
          // NO BACKGROUND
          // =================================================

          Expanded(
            child: TextField(
              controller: controller,

              keyboardType:
                  keyboardType,

              readOnly: readOnly,

              onTap: onTap,

              cursorColor:
                  brandPurple,

              style:
                  const TextStyle(
                color: darkText,
                fontSize: 17,
                fontWeight:
                    FontWeight.w500,
              ),

              decoration:
                  InputDecoration(
                hintText: hint,

                hintStyle:
                    const TextStyle(
                  color:
                      Color(0xFF9AA7B8),
                  fontSize: 17,
                  fontWeight:
                      FontWeight.w400,
                ),

                // Completely remove
                // TextField borders.
                border:
                    InputBorder.none,

                enabledBorder:
                    InputBorder.none,

                focusedBorder:
                    InputBorder.none,

                disabledBorder:
                    InputBorder.none,

                errorBorder:
                    InputBorder.none,

                focusedErrorBorder:
                    InputBorder.none,

                // Remove background.
                filled: false,

                fillColor:
                    Colors.transparent,

                contentPadding:
                    const EdgeInsets
                        .symmetric(
                  horizontal: 18,
                  vertical: 18,
                ),
              ),
            ),
          ),

          // =================================================
          // TRAILING WIDGET
          // =================================================

          if (trailing != null)
            Padding(
              padding:
                  const EdgeInsets.only(
                right: 14,
              ),
              child: trailing,
            ),
        ],
      ),
    );
  }

  // =========================================================
  // SECTION LABEL
  // =========================================================

  Widget _buildLabel(String title) {
    return Padding(
      padding:
          const EdgeInsets.only(
        bottom: 10,
      ),
      child: Text(
        title,
        style:
            const TextStyle(
          color: darkText,
          fontSize: 18,
          fontWeight:
              FontWeight.w800,
        ),
      ),
    );
  }

  // =========================================================
  // GENDER BUTTON
  // =========================================================

  Widget _buildGenderButton(
    String gender,
  ) {
    final bool selected =
        _selectedGender == gender;

    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedGender = gender;
          });

          _profileService.userGender =
              gender;
        },

        child: AnimatedContainer(
          duration:
              const Duration(
            milliseconds: 180,
          ),

          height: 64,

          decoration:
              BoxDecoration(
            color: selected
                ? brandPurple
                : Colors.transparent,

            border: selected
                ? null
                : Border.all(
                    color: lightBorder,
                    width: 2,
                  ),

            borderRadius:
                BorderRadius.circular(20),
          ),

          child: Center(
            child: Text(
              gender,
              style:
                  TextStyle(
                color: selected
                    ? Colors.white
                    : const Color(
                        0xFF4B5563,
                      ),
                fontSize: 17,
                fontWeight:
                    FontWeight.w700,
              ),
            ),
          ),
        ),
      ),
    );
  }

  // =========================================================
  // MAP BUTTON
  // =========================================================

  Widget _buildFetchMapButton() {
    return GestureDetector(
      onTap: () {
        _showMessage(
          "Google Maps location selection will open here.",
        );
      },

      child: Row(
        mainAxisSize:
            MainAxisSize.min,
        children: const [
          Icon(
            Icons.my_location_rounded,
            color: brandPurple,
            size: 23,
          ),

          SizedBox(width: 7),

          Text(
            "Fetch from Google Map",
            style: TextStyle(
              color: brandPurple,
              fontSize: 15,
              fontWeight:
                  FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          pageBackground,

      body: SafeArea(
        child: Stack(
          children: [

            // =================================================
            // BACKGROUND / HERO
            // =================================================

            Positioned(
              top: 0,
              left: 0,
              right: 0,
              height: 310,

              child: IgnorePointer(
                child: Opacity(
                  opacity: 0.13,

                  child: Image.asset(
                    "assets/images/profile_bg.png",

                    fit: BoxFit.cover,

                    errorBuilder:
                        (
                      context,
                      error,
                      stackTrace,
                    ) {
                      return const SizedBox();
                    },
                  ),
                ),
              ),
            ),

            // =================================================
            // CONTENT
            // =================================================

            SingleChildScrollView(
              physics:
                  const BouncingScrollPhysics(),

              padding:
                  const EdgeInsets.only(
                top: 330,
                left: 20,
                right: 20,
                bottom: 30,
              ),

              child: Container(
                width: double.infinity,

                padding:
                    const EdgeInsets.fromLTRB(
                  20,
                  30,
                  20,
                  28,
                ),

                decoration:
                    const BoxDecoration(
                  color: Colors.white,

                  borderRadius:
                      BorderRadius.only(
                    topLeft:
                        Radius.circular(48),
                    topRight:
                        Radius.circular(48),
                  ),
                ),

                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.stretch,

                  children: [

                    // =================================================
                    // TITLE
                    // =================================================

                    const Text(
                      "Complete Profile",

                      textAlign:
                          TextAlign.center,

                      style:
                          TextStyle(
                        color: darkText,
                        fontSize: 28,
                        fontWeight:
                            FontWeight.w800,
                      ),
                    ),

                    const SizedBox(
                      height: 8,
                    ),

                    const Text(
                      "Required to confirm your EV ride booking",

                      textAlign:
                          TextAlign.center,

                      style:
                          TextStyle(
                        color: greyText,
                        fontSize: 16,
                        fontWeight:
                            FontWeight.w500,
                      ),
                    ),

                    const SizedBox(
                      height: 42,
                    ),

                    // =================================================
                    // FULL NAME
                    // =================================================

                    _buildLabel(
                      "Full Name",
                    ),

                    _buildInputField(
                      icon:
                          Icons
                              .person_outline_rounded,

                      controller:
                          _nameController,

                      hint:
                          "Enter your full name",
                    ),

                    const SizedBox(
                      height: 28,
                    ),

                    // =================================================
                    // GENDER
                    // =================================================

                    _buildLabel(
                      "Gender",
                    ),

                    Row(
                      children: [

                        _buildGenderButton(
                          "Male",
                        ),

                        const SizedBox(
                          width: 12,
                        ),

                        _buildGenderButton(
                          "Female",
                        ),

                        const SizedBox(
                          width: 12,
                        ),

                        _buildGenderButton(
                          "Other",
                        ),
                      ],
                    ),

                    const SizedBox(
                      height: 28,
                    ),

                    // =================================================
                    // DATE OF BIRTH
                    // =================================================

                    _buildLabel(
                      "Date of Birth",
                    ),

                    _buildInputField(
                      icon:
                          Icons
                              .calendar_month_rounded,

                      controller:
                          _dobController,

                      hint:
                          "DD / MM / YYYY",

                      keyboardType:
                          TextInputType.datetime,

                      trailing:
                          GestureDetector(
                        onTap:
                            _selectDateOfBirth,

                        child: Container(
                          width: 46,
                          height: 46,

                          decoration:
                              BoxDecoration(
                            color:
                                lightPurple,

                            borderRadius:
                                BorderRadius
                                    .circular(
                              14,
                            ),
                          ),

                          child:
                              const Icon(
                            Icons
                                .calendar_month_rounded,

                            color:
                                brandPurple,

                            size: 25,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(
                      height: 8,
                    ),

                    const Padding(
                      padding:
                          EdgeInsets.only(
                        left: 8,
                      ),

                      child: Text(
                        "You can type your date of birth or select it from the calendar.",

                        style:
                            TextStyle(
                          color:
                              greyText,
                          fontSize: 12,
                          height: 1.4,
                        ),
                      ),
                    ),

                    const SizedBox(
                      height: 28,
                    ),

                    // =================================================
                    // ADDRESS HEADER
                    // =================================================

                    Row(
                      crossAxisAlignment:
                          CrossAxisAlignment
                              .center,

                      children: [

                        const Expanded(
                          child: Text(
                            "Address",

                            style:
                                TextStyle(
                              color:
                                  darkText,
                              fontSize: 18,
                              fontWeight:
                                  FontWeight
                                      .w800,
                            ),
                          ),
                        ),

                        _buildFetchMapButton(),
                      ],
                    ),

                    const SizedBox(
                      height: 10,
                    ),

                    // =================================================
                    // ADDRESS FIELD
                    // =================================================

                    _buildInputField(
                      icon:
                          Icons
                              .location_on_outlined,

                      controller:
                          _addressController,

                      hint:
                          "Enter society name, area or ...",

                      trailing:
                          GestureDetector(
                        onTap: () {
                          _showMessage(
                            "Map selection will open here.",
                          );
                        },

                        child:
                            const Icon(
                          Icons
                              .map_outlined,

                          color:
                              brandPurple,

                          size: 29,
                        ),
                      ),
                    ),

                    const SizedBox(
                      height: 38,
                    ),

                    // =================================================
                    // SAVE BUTTON
                    // =================================================

                    SizedBox(
                      height: 70,

                      child:
                          ElevatedButton(
                        onPressed:
                            _isSaving
                                ? null
                                : _saveProfile,

                        style:
                            ElevatedButton
                                .styleFrom(
                          backgroundColor:
                              brandPurple,

                          disabledBackgroundColor:
                              brandPurple
                                  .withOpacity(
                            0.55,
                          ),

                          elevation: 0,

                          shape:
                              RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius
                                    .circular(
                              22,
                            ),
                          ),
                        ),

                        child:
                            _isSaving
                                ? const SizedBox(
                                    width: 26,
                                    height: 26,

                                    child:
                                        CircularProgressIndicator(
                                      strokeWidth:
                                          3,
                                      color:
                                          Colors.white,
                                    ),
                                  )

                                : const Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment
                                            .center,

                                    children: [

                                      Text(
                                        "Save Profile & Start Ride",

                                        style:
                                            TextStyle(
                                          color:
                                              Colors.white,
                                          fontSize:
                                              18,
                                          fontWeight:
                                              FontWeight
                                                  .w800,
                                        ),
                                      ),

                                      SizedBox(
                                        width: 12,
                                      ),

                                      Icon(
                                        Icons
                                            .arrow_forward_rounded,

                                        color:
                                            Colors.white,

                                        size: 27,
                                      ),
                                    ],
                                  ),
                      ),
                    ),

                    const SizedBox(
                      height: 10,
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