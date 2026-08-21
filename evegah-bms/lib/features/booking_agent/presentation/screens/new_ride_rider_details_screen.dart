import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import '../widgets/stepper_progress_bar.dart';
import 'new_ride_vehicle_details_screen.dart';

class NewRideRiderDetailsScreen extends StatefulWidget {
  const NewRideRiderDetailsScreen({super.key});

  @override
  State<NewRideRiderDetailsScreen> createState() => _NewRideRiderDetailsScreenState();
}

class _NewRideRiderDetailsScreenState extends State<NewRideRiderDetailsScreen> {
  // Form State
  String _selectedIdentityType = "Aadhaar Card";
  String _selectedRideType = "One Way";
  String _selectedLocation = "EV Zone – Sayajigunj";
  String _locationAddress = "Beside Central Mall, Sayajigunj, Vadodara, Gujarat";
  DateTime _startDate = DateTime(2024, 5, 20);
  TimeOfDay _startTime = const TimeOfDay(hour: 10, minute: 30);
  
  final TextEditingController _fullNameController = TextEditingController(text: "Rahul Sharma");
  final TextEditingController _phoneController = TextEditingController(text: "+91 98765 43210");
  final TextEditingController _emailController = TextEditingController(text: "rahul.sharma@example.com");
  final TextEditingController _notesController = TextEditingController();

  @override
  void dispose() {
    _fullNameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EmployeeTheme.softBlueBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: EmployeeTheme.textDark, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "New Ride",
          style: TextStyle(
            color: EmployeeTheme.textDark,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. STEPPER PROGRESS BAR (Step 1 active)
            const StepperProgressBar(currentStep: 1),
            const SizedBox(height: 14),

            // 2. SELECTED RIDER CARD
            _buildSelectedRiderCard(),
            const SizedBox(height: 18),

            // 3. RIDER INFORMATION SECTION
            const Text(
              "Rider Information",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: _buildInputField(
                    label: "Full Name",
                    controller: _fullNameController,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildInputField(
                    label: "Phone Number",
                    controller: _phoneController,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            _buildInputField(
              label: "Email (Optional)",
              controller: _emailController,
            ),
            const SizedBox(height: 18),

            // 4. IDENTITY TYPE SECTION
            const Text(
              "Identity Type",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(child: _buildIdentityTypeCard("Aadhaar Card", Icons.badge_outlined)),
                const SizedBox(width: 8),
                Expanded(child: _buildIdentityTypeCard("Driving License", Icons.subtitles_outlined)),
                const SizedBox(width: 8),
                Expanded(child: _buildIdentityTypeCard("Voter ID", Icons.assignment_ind_outlined)),
              ],
            ),
            const SizedBox(height: 18),

            // 5. PICK UP LOCATION SECTION
            const Text(
              "Pick Up Location",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 10),
            _buildPickUpLocationCard(),
            const SizedBox(height: 18),

            // 6. RIDE TYPE SECTION
            Row(
              children: const [
                Text(
                  "Ride Type",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: EmployeeTheme.textDark,
                  ),
                ),
                SizedBox(width: 4),
                Icon(Icons.info_outline_rounded, size: 14, color: EmployeeTheme.textMuted),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: _buildRideTypeCard(
                    title: "One Way",
                    subtitle: "Pick up and drop at different locations",
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildRideTypeCard(
                    title: "Round Trip",
                    subtitle: "Return to the same location",
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // 7. START DATE & TIME SECTION
            const Text(
              "Start Date & Time",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: _buildDatePickerField(
                    label: "Start Date",
                    valueText: "${_startDate.day} ${_getMonthName(_startDate.month)} ${_startDate.year}",
                    icon: Icons.calendar_today_rounded,
                    onTap: () async {
                      final picked = await showDatePicker(
                        context: context,
                        initialDate: _startDate,
                        firstDate: DateTime(2024),
                        lastDate: DateTime(2030),
                      );
                      if (picked != null) {
                        setState(() => _startDate = picked);
                      }
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildTimePickerField(
                    label: "Start Time",
                    valueText: _startTime.format(context),
                    icon: Icons.access_time_rounded,
                    onTap: () async {
                      final picked = await showTimePicker(
                        context: context,
                        initialTime: _startTime,
                      );
                      if (picked != null) {
                        setState(() => _startTime = picked);
                      }
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // 8. NOTES (OPTIONAL) SECTION
            const Text(
              "Notes (Optional)",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 10),
            _buildNotesBox(),
            const SizedBox(height: 24),

            // 9. CONTINUE TO VEHICLE DETAILS BUTTON
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const NewRideVehicleDetailsScreen(),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: EmployeeTheme.primaryPurple,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      "Continue to Vehicle Details",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Container(
                      width: 24,
                      height: 24,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.chevron_right_rounded,
                        color: EmployeeTheme.primaryPurple,
                        size: 18,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  // 2. SELECTED RIDER CARD
  Widget _buildSelectedRiderCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: EmployeeTheme.lightPurple,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE0E7FF)),
      ),
      child: Row(
        children: [
          // Rider Avatar
          Container(
            width: 44,
            height: 44,
            decoration: const BoxDecoration(
              color: Color(0xFFDDD6FE),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.person, color: EmployeeTheme.primaryPurple, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Rahul Sharma",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: EmployeeTheme.textDark,
                  ),
                ),
                const SizedBox(height: 3),
                Row(
                  children: const [
                    Icon(Icons.verified_user_rounded, color: EmployeeTheme.successGreen, size: 13),
                    SizedBox(width: 4),
                    Text(
                      "KYC Verified",
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: EmployeeTheme.successGreen,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  _phoneController.text,
                  style: const TextStyle(
                    fontSize: 11,
                    color: EmployeeTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),

          // Change Rider Button
          OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.edit_outlined, size: 12, color: EmployeeTheme.brandPurple),
            label: const Text(
              "Change Rider",
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: EmployeeTheme.brandPurple),
            ),
            style: OutlinedButton.styleFrom(
              backgroundColor: Colors.white,
              side: const BorderSide(color: EmployeeTheme.brandPurple),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              minimumSize: Size.zero,
            ),
          ),
        ],
      ),
    );
  }

  // Input Field Helper
  Widget _buildInputField({
    required String label,
    required TextEditingController controller,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: EmployeeTheme.borderColor),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 9.5,
                  color: EmployeeTheme.textMuted,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 2),
              TextField(
                controller: controller,
                style: const TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.bold,
                  color: EmployeeTheme.textDark,
                ),
                decoration: const InputDecoration(
                  isDense: true,
                  contentPadding: EdgeInsets.zero,
                  border: InputBorder.none,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // Identity Type Card Builder
  Widget _buildIdentityTypeCard(String title, IconData icon) {
    final isSelected = _selectedIdentityType == title;

    return GestureDetector(
      onTap: () {
        setState(() => _selectedIdentityType = title);
      },
      child: Container(
        height: 104,
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: isSelected ? EmployeeTheme.limeCardBg : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? EmployeeTheme.limeCardBorder : EmployeeTheme.borderColor,
            width: isSelected ? 1.5 : 1.0,
          ),
        ),
        child: Stack(
          children: [
            // Top Right Selected Radio Indicator
            Positioned(
              top: 0,
              right: 0,
              child: Icon(
                isSelected ? Icons.check_circle_rounded : Icons.radio_button_off_rounded,
                color: isSelected ? EmployeeTheme.successGreen : const Color(0xFFCBD5E1),
                size: 16,
              ),
            ),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Center(
                  child: Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: isSelected ? EmployeeTheme.limeGreenCircle : const Color(0xFFF0EFFE),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      icon,
                      color: EmployeeTheme.primaryPurple,
                      size: 20,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.bold,
                    color: EmployeeTheme.textDark,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Pick Up Location Card
  Widget _buildPickUpLocationCard() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: EmployeeTheme.borderColor),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: const BoxDecoration(
              color: Color(0xFFF0EFFE),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.location_on_rounded, color: EmployeeTheme.brandPurple, size: 20),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _selectedLocation,
                  style: const TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.bold,
                    color: EmployeeTheme.textDark,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  _locationAddress,
                  style: const TextStyle(
                    fontSize: 10,
                    color: EmployeeTheme.textSecondary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: () {},
            child: const Text(
              "Change",
              style: TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.brandPurple,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Ride Type Card
  Widget _buildRideTypeCard({
    required String title,
    required String subtitle,
  }) {
    final isSelected = _selectedRideType == title;

    return GestureDetector(
      onTap: () {
        setState(() => _selectedRideType = title);
      },
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? EmployeeTheme.limeCardBg : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? EmployeeTheme.limeCardBorder : EmployeeTheme.borderColor,
            width: isSelected ? 1.5 : 1.0,
          ),
        ),
        child: Stack(
          children: [
            Positioned(
              top: 0,
              right: 0,
              child: Icon(
                isSelected ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
                color: isSelected ? const Color(0xFF84CC16) : const Color(0xFFCBD5E1),
                size: 16,
              ),
            ),
            Row(
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: isSelected ? EmployeeTheme.limeGreenCircle : const Color(0xFFF0EFFE),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.electric_scooter_rounded, color: EmployeeTheme.primaryPurple, size: 22),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: EmployeeTheme.textDark,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          fontSize: 9,
                          color: EmployeeTheme.textSecondary,
                          height: 1.2,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Date & Time Picker Helpers
  Widget _buildDatePickerField({
    required String label,
    required String valueText,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: EmployeeTheme.borderColor),
        ),
        child: Row(
          children: [
            Icon(icon, size: 16, color: EmployeeTheme.textMuted),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: const TextStyle(
                      fontSize: 9,
                      color: EmployeeTheme.textMuted,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    valueText,
                    style: const TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.bold,
                      color: EmployeeTheme.textDark,
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

  Widget _buildTimePickerField({
    required String label,
    required String valueText,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: EmployeeTheme.borderColor),
        ),
        child: Row(
          children: [
            Icon(icon, size: 16, color: EmployeeTheme.textMuted),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: const TextStyle(
                      fontSize: 9,
                      color: EmployeeTheme.textMuted,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    valueText,
                    style: const TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.bold,
                      color: EmployeeTheme.textDark,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: EmployeeTheme.textMuted),
          ],
        ),
      ),
    );
  }

  // Notes Text Box
  Widget _buildNotesBox() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: EmployeeTheme.borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.description_outlined, size: 16, color: EmployeeTheme.textMuted),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  controller: _notesController,
                  maxLength: 150,
                  maxLines: 2,
                  style: const TextStyle(fontSize: 11.5, color: EmployeeTheme.textDark),
                  decoration: const InputDecoration(
                    hintText: "Add any notes for this ride...",
                    hintStyle: TextStyle(fontSize: 11.5, color: EmployeeTheme.textMuted),
                    isDense: true,
                    contentPadding: EdgeInsets.zero,
                    border: InputBorder.none,
                    counterText: "",
                  ),
                  onChanged: (val) {
                    setState(() {});
                  },
                ),
              ),
            ],
          ),
          Align(
            alignment: Alignment.bottomRight,
            child: Text(
              "${_notesController.text.length}/150",
              style: const TextStyle(fontSize: 9.5, color: EmployeeTheme.textMuted),
            ),
          ),
        ],
      ),
    );
  }

  String _getMonthName(int m) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[(m - 1) % 12];
  }
}
